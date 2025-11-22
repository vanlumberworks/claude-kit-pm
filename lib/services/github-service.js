/**
 * GitHub Service - Handle GitHub API operations
 * Supports archive downloads (ZIP/TAR.GZ) for efficient file retrieval
 */

const { Octokit } = require('@octokit/rest');
const fs = require('fs-extra');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');
const { compareVersions } = require('compare-versions');
const extractZip = require('extract-zip');
const tar = require('tar');
const tmp = require('tmp');
const { PMKitError, ErrorCodes } = require('../utils/error-handler');
const logger = require('../utils/logger');
const constants = require('../constants');
const credentialService = require('./credential-service');

const execAsync = promisify(exec);

// Configure tmp to clean up on exit
tmp.setGracefulCleanup();

class GitHubService {
  constructor() {
    this.octokit = null;
    this.token = null;
    this.authenticated = false;
  }

  /**
   * Execute function with retry and exponential backoff
   */
  async withRetry(fn, options = {}) {
    const maxRetries = options.maxRetries || constants.MAX_RETRIES;
    const baseDelay = options.baseDelay || constants.RETRY_DELAY;
    const retryableErrors = [408, 429, 500, 502, 503, 504];

    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        const isRetryable =
          retryableErrors.includes(error.status) ||
          error.code === 'ECONNRESET' ||
          error.code === 'ETIMEDOUT' ||
          error.code === 'ENOTFOUND';

        if (!isRetryable || attempt === maxRetries) {
          throw error;
        }

        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;

        logger.debug(`Retry ${attempt + 1}/${maxRetries} after ${Math.round(delay)}ms`);

        if (error.status === 429) {
          const retryAfter = error.response?.headers?.['retry-after'];
          if (retryAfter) {
            const waitTime = parseInt(retryAfter, 10) * 1000;
            logger.debug(`Rate limited, waiting ${waitTime}ms`);
            await this.sleep(waitTime);
            continue;
          }
        }

        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  /**
   * Sleep helper
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Authenticate with GitHub
   */
  async authenticate(forcePrompt = false) {
    if (this.authenticated && !forcePrompt) {
      return true;
    }

    this.token = await this.getToken(forcePrompt);

    if (!this.token) {
      throw new PMKitError(
        'GitHub authentication required',
        ErrorCodes.AUTH_FAILED,
        {
          help: 'Set GITHUB_TOKEN environment variable or run with --reset-token',
          url: 'https://github.com/settings/tokens'
        }
      );
    }

    this.octokit = new Octokit({
      auth: this.token,
      userAgent: `pm-kit-cli/${constants.CLI_VERSION}`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      request: {
        timeout: constants.GITHUB_TIMEOUT
      }
    });

    try {
      const { data: user } = await this.octokit.users.getAuthenticated();
      logger.success(`Authenticated as ${user.login}`);
      this.authenticated = true;
      return true;
    } catch (error) {
      this.authenticated = false;

      if (error.status === 401) {
        throw new PMKitError(
          'Invalid GitHub token',
          ErrorCodes.TOKEN_INVALID,
          {
            help: 'Generate a new token at https://github.com/settings/tokens',
            scopes: 'Required scopes: ' + constants.GITHUB_TOKEN_SCOPES.join(', ')
          }
        );
      }

      throw error;
    }
  }

  /**
   * Get GitHub token from various sources
   */
  async getToken(forcePrompt = false) {
    if (forcePrompt) {
      return await this.promptForToken();
    }

    // 1. Try environment variable
    const envToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (envToken) {
      logger.debug('Using token from environment variable');
      return envToken;
    }

    // 2. Try GitHub CLI
    try {
      const { stdout } = await execAsync('gh auth token');
      const ghToken = stdout.trim();
      if (ghToken) {
        logger.debug('Using token from GitHub CLI');
        return ghToken;
      }
    } catch (error) {
      logger.debug('GitHub CLI not available or not authenticated');
    }

    // 3. Try secure credential storage (keytar)
    const secureToken = await credentialService.getGitHubToken();
    if (secureToken) {
      logger.debug('Using token from secure storage');
      return secureToken;
    }

    // 4. Try legacy config file
    const savedToken = this.loadSavedToken();
    if (savedToken) {
      logger.debug('Using saved token from config');
      // Migrate to secure storage
      await credentialService.setGitHubToken(savedToken);
      return savedToken;
    }

    // 5. Prompt user
    return await this.promptForToken();
  }

  /**
   * Load saved token from config (legacy)
   */
  loadSavedToken() {
    const configPath = constants.GLOBAL_CONFIG_FILE;

    if (!fs.existsSync(configPath)) {
      return null;
    }

    try {
      const config = fs.readJsonSync(configPath);
      return config.githubToken || null;
    } catch (error) {
      logger.debug('Failed to load saved token:', error.message);
      return null;
    }
  }

  /**
   * Prompt user for token
   */
  async promptForToken() {
    const prompts = require('../utils/prompts');
    const pc = require('picocolors');

    logger.newline();
    logger.info('GitHub Personal Access Token required');
    logger.log('Create one at: ' + pc.cyan('https://github.com/settings/tokens'));
    logger.log('Required scopes: ' + pc.bold(constants.GITHUB_TOKEN_SCOPES.join(', ')));
    logger.newline();

    const token = await prompts.passwordInput('Enter your GitHub Personal Access Token:', {
      validate: value => value && value.length > 0 ? undefined : 'Token is required'
    });

    if (!token) {
      throw new PMKitError(
        'GitHub token is required to continue',
        ErrorCodes.AUTH_FAILED
      );
    }

    // Ask if user wants to save token
    const save = await prompts.confirmAction(
      'Save token for future use? (stored securely)',
      true
    );

    if (save) {
      await this.saveToken(token);
    }

    return token;
  }

  /**
   * Save token to secure storage
   */
  async saveToken(token) {
    const saved = await credentialService.setGitHubToken(token);
    if (saved) {
      logger.success('Token saved securely');
    } else {
      logger.warn('Could not save token to secure storage');
    }
  }

  /**
   * Get latest release from repository
   */
  async getLatestRelease(repository = constants.KIT_REPOSITORY) {
    if (!this.authenticated) {
      await this.authenticate();
    }

    const [owner, repo] = repository.split('/');

    return this.withRetry(async () => {
      try {
        const { data: release } = await this.octokit.repos.getLatestRelease({
          owner,
          repo
        });

        return {
          version: release.tag_name,
          name: release.name,
          body: release.body,
          publishedAt: release.published_at,
          url: release.html_url,
          tarballUrl: release.tarball_url,
          zipballUrl: release.zipball_url
        };
      } catch (error) {
        if (error.status === 404) {
          throw new PMKitError(
            `Repository not found: ${repository}`,
            ErrorCodes.REPO_NOT_FOUND,
            {
              help: 'Verify you have access to the private repository'
            }
          );
        }
        throw error;
      }
    });
  }

  /**
   * Download and extract release archive
   * @param {string} repository - Repository name (owner/repo)
   * @param {string} ref - Git ref (tag, branch, or commit)
   * @param {string} localPath - Destination directory
   * @param {Object} options - Options
   * @param {string} options.format - Archive format: 'zip' or 'tar' (default: 'tar')
   * @param {string[]} options.include - Paths to include (relative to repo root)
   */
  async downloadArchive(repository, ref = 'main', localPath, options = {}) {
    if (!this.authenticated) {
      await this.authenticate();
    }

    const format = options.format || 'tar';
    const include = options.include || [];
    const [owner, repo] = repository.split('/');

    logger.startSpinner(`Downloading ${format} archive...`);

    // Create temp directory
    const tmpDir = tmp.dirSync({ unsafeCleanup: true });

    try {
      // Get archive URL
      const archiveResponse = await this.octokit.repos.downloadTarballArchive({
        owner,
        repo,
        ref,
        request: {
          parseSuccessResponseBody: false
        }
      });

      // Download to temp file
      const archivePath = path.join(tmpDir.name, `archive.${format === 'zip' ? 'zip' : 'tar.gz'}`);
      const response = await fetch(archiveResponse.url);
      const buffer = await response.arrayBuffer();
      await fs.writeFile(archivePath, Buffer.from(buffer));

      logger.updateSpinner('Extracting archive...');

      // Extract archive
      const extractDir = path.join(tmpDir.name, 'extracted');
      await fs.ensureDir(extractDir);

      if (format === 'zip') {
        await extractZip(archivePath, { dir: extractDir });
      } else {
        await tar.extract({
          file: archivePath,
          cwd: extractDir
        });
      }

      // Find the extracted directory (GitHub adds prefix)
      const extractedContents = await fs.readdir(extractDir);
      const extractedRoot = path.join(extractDir, extractedContents[0]);

      logger.updateSpinner('Copying files...');

      // Copy to destination
      await fs.ensureDir(localPath);

      if (include.length > 0) {
        // Copy only specified paths
        for (const includePath of include) {
          const srcPath = path.join(extractedRoot, includePath);
          const destPath = path.join(localPath, includePath);

          if (await fs.pathExists(srcPath)) {
            await fs.copy(srcPath, destPath);
          }
        }
      } else {
        // Copy everything
        await fs.copy(extractedRoot, localPath);
      }

      logger.succeedSpinner('Archive downloaded and extracted');

      return { success: true };
    } catch (error) {
      logger.failSpinner('Failed to download archive');
      throw new PMKitError(
        `Failed to download archive: ${error.message}`,
        ErrorCodes.GITHUB_ERROR,
        { error: error.message }
      );
    } finally {
      // Cleanup temp directory
      tmpDir.removeCallback();
    }
  }

  /**
   * Get file content from repository
   */
  async getFileContent(repository, filePath, ref = 'main') {
    if (!this.authenticated) {
      await this.authenticate();
    }

    const [owner, repo] = repository.split('/');

    return this.withRetry(async () => {
      try {
        const { data } = await this.octokit.repos.getContent({
          owner,
          repo,
          path: filePath,
          ref
        });

        if (data.type !== 'file') {
          throw new PMKitError(
            `Expected file but got ${data.type}: ${filePath}`,
            ErrorCodes.GITHUB_ERROR
          );
        }

        const content = Buffer.from(data.content, 'base64').toString('utf8');
        return content;
      } catch (error) {
        if (error.status === 404) {
          throw new PMKitError(
            `File not found: ${filePath}`,
            ErrorCodes.FILE_NOT_FOUND
          );
        }
        throw error;
      }
    });
  }

  /**
   * Get directory contents from repository
   */
  async getDirectoryContent(repository, dirPath = '', ref = 'main') {
    if (!this.authenticated) {
      await this.authenticate();
    }

    const [owner, repo] = repository.split('/');

    return this.withRetry(async () => {
      try {
        const { data } = await this.octokit.repos.getContent({
          owner,
          repo,
          path: dirPath,
          ref
        });

        if (!Array.isArray(data)) {
          throw new PMKitError(
            `Expected directory but got file: ${dirPath}`,
            ErrorCodes.GITHUB_ERROR
          );
        }

        return data;
      } catch (error) {
        if (error.status === 404) {
          throw new PMKitError(
            `Directory not found: ${dirPath}`,
            ErrorCodes.FILE_NOT_FOUND
          );
        }
        throw error;
      }
    });
  }

  /**
   * Count files in a remote directory recursively
   */
  async countRemoteFiles(repository, remotePath, ref = 'main') {
    if (!this.authenticated) {
      await this.authenticate();
    }

    let count = 0;
    const items = await this.getDirectoryContent(repository, remotePath, ref);

    for (const item of items) {
      if (item.type === 'file') {
        count++;
      } else if (item.type === 'dir') {
        count += await this.countRemoteFiles(repository, item.path, ref);
      }
    }

    return count;
  }

  /**
   * Download directory recursively (internal, no progress bar)
   */
  async _downloadDirectoryInternal(repository, remotePath, localPath, ref = 'main', progressCallback = null) {
    const items = await this.getDirectoryContent(repository, remotePath, ref);

    for (const item of items) {
      const itemLocalPath = path.join(localPath, item.name);

      if (item.type === 'file') {
        const content = await this.getFileContent(repository, item.path, ref);
        await fs.ensureDir(path.dirname(itemLocalPath));
        await fs.writeFile(itemLocalPath, content);

        if (progressCallback) {
          progressCallback(item.name);
        } else {
          logger.fileOperation('download', itemLocalPath);
        }
      } else if (item.type === 'dir') {
        await fs.ensureDir(itemLocalPath);
        await this._downloadDirectoryInternal(repository, item.path, itemLocalPath, ref, progressCallback);
      }
    }
  }

  /**
   * Download directory recursively with optional progress bar
   */
  async downloadDirectory(repository, remotePath, localPath, ref = 'main', options = {}) {
    if (!this.authenticated) {
      await this.authenticate();
    }

    const showProgress = options.showProgress !== false && !options.onFileDownloaded;
    const onFileDownloaded = options.onFileDownloaded;

    if (showProgress) {
      const totalFiles = await this.countRemoteFiles(repository, remotePath, ref);

      if (totalFiles > 0) {
        logger.startProgressBar(totalFiles);

        await this._downloadDirectoryInternal(repository, remotePath, localPath, ref, filename => {
          logger.incrementProgressBar({ filename });
        });

        logger.stopProgressBar();
      }
    } else if (onFileDownloaded) {
      await this._downloadDirectoryInternal(repository, remotePath, localPath, ref, onFileDownloaded);
    } else {
      await this._downloadDirectoryInternal(repository, remotePath, localPath, ref);
    }
  }

  /**
   * Download specific file
   */
  async downloadFile(repository, remotePath, localPath, ref = 'main') {
    if (!this.authenticated) {
      await this.authenticate();
    }

    const content = await this.getFileContent(repository, remotePath, ref);
    await fs.ensureDir(path.dirname(localPath));
    await fs.writeFile(localPath, content);
    logger.fileOperation('download', localPath);
  }

  /**
   * Get specific release by tag
   */
  async getReleaseByTag(tag, repository = constants.KIT_REPOSITORY) {
    if (!this.authenticated) {
      await this.authenticate();
    }

    const [owner, repo] = repository.split('/');

    try {
      const { data: release } = await this.octokit.repos.getReleaseByTag({
        owner,
        repo,
        tag
      });

      return {
        version: release.tag_name,
        name: release.name,
        body: release.body,
        publishedAt: release.published_at,
        url: release.html_url,
        tarballUrl: release.tarball_url,
        zipballUrl: release.zipball_url
      };
    } catch (error) {
      if (error.status === 404) {
        throw new PMKitError(
          `Version not found: ${tag}`,
          ErrorCodes.REPO_NOT_FOUND,
          {
            help: 'Run pm-kit versions to see available versions'
          }
        );
      }
      throw error;
    }
  }

  /**
   * List all releases
   */
  async listReleases(repository = constants.KIT_REPOSITORY, options = {}) {
    if (!this.authenticated) {
      await this.authenticate();
    }

    const [owner, repo] = repository.split('/');
    const perPage = options.limit || 30;
    const includeAll = options.all || false;

    const { data: releases } = await this.octokit.repos.listReleases({
      owner,
      repo,
      per_page: perPage
    });

    let filtered = releases;
    if (!includeAll) {
      filtered = releases.filter(r => !r.prerelease && !r.draft);
    }

    return filtered.map(r => ({
      version: r.tag_name,
      name: r.name,
      body: r.body,
      publishedAt: r.published_at,
      prerelease: r.prerelease,
      draft: r.draft
    }));
  }

  /**
   * Check API rate limit
   */
  async checkRateLimit() {
    if (!this.authenticated) {
      await this.authenticate();
    }

    const { data } = await this.octokit.rateLimit.get();

    return {
      limit: data.rate.limit,
      remaining: data.rate.remaining,
      reset: new Date(data.rate.reset * 1000),
      used: data.rate.used
    };
  }

  /**
   * Compare versions using compare-versions library
   * Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
   */
  compareVersionsRaw(v1, v2) {
    const clean1 = v1.replace(/^v/, '');
    const clean2 = v2.replace(/^v/, '');
    return compareVersions(clean1, clean2);
  }

  /**
   * Compare versions (returns status string)
   */
  compareVersionsStatus(current, latest) {
    const result = this.compareVersionsRaw(current, latest);
    if (result < 0) return 'outdated';
    if (result > 0) return 'ahead';
    return 'current';
  }

  /**
   * Check if update is available
   */
  isUpdateAvailable(current, latest) {
    return this.compareVersionsRaw(current, latest) < 0;
  }
}

module.exports = new GitHubService();
