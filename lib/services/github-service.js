/**
 * GitHub Service - Handle GitHub API operations
 */

const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');
const { PMKitError, ErrorCodes } = require('../utils/error-handler');
const logger = require('../utils/logger');
const constants = require('../constants');

const execAsync = promisify(exec);

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

        // Check if error is retryable
        const isRetryable =
          retryableErrors.includes(error.status) ||
          error.code === 'ECONNRESET' ||
          error.code === 'ETIMEDOUT' ||
          error.code === 'ENOTFOUND';

        if (!isRetryable || attempt === maxRetries) {
          throw error;
        }

        // Calculate delay with exponential backoff + jitter
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;

        logger.debug(`Retry ${attempt + 1}/${maxRetries} after ${Math.round(delay)}ms`);

        // Handle rate limiting
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
   * Tries multiple sources: env var, gh CLI, saved config, prompt
   */
  async authenticate(forcePrompt = false) {
    if (this.authenticated && !forcePrompt) {
      return true;
    }

    // Try to get token from various sources
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

    // Initialize Octokit with token
    this.octokit = new Octokit({
      auth: this.token,
      userAgent: `pm-kit-cli/${constants.CLI_VERSION}`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      request: {
        timeout: constants.GITHUB_TIMEOUT
      }
    });

    // Validate token
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

    // 3. Try saved config
    const savedToken = this.loadSavedToken();
    if (savedToken) {
      logger.debug('Using saved token from config');
      return savedToken;
    }

    // 4. Prompt user
    return await this.promptForToken();
  }

  /**
   * Load saved token from config
   */
  loadSavedToken() {
    const configPath = constants.GLOBAL_CONFIG_FILE;

    if (!fs.existsSync(configPath)) {
      return null;
    }

    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
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
    const prompts = require('prompts');
    const chalk = require('chalk');

    logger.newline();
    logger.info('GitHub Personal Access Token required');
    logger.log('Create one at: ' + chalk.cyan('https://github.com/settings/tokens'));
    logger.log('Required scopes: ' + chalk.bold(constants.GITHUB_TOKEN_SCOPES.join(', ')));
    logger.newline();

    const { token } = await prompts({
      type: 'password',
      name: 'token',
      message: 'Enter your GitHub Personal Access Token:',
      validate: value => value.length > 0 || 'Token is required'
    });

    if (!token) {
      throw new PMKitError(
        'GitHub token is required to continue',
        ErrorCodes.AUTH_FAILED
      );
    }

    // Ask if user wants to save token
    const { save } = await prompts({
      type: 'confirm',
      name: 'save',
      message: 'Save token for future use? (stored securely in ~/.pm-kit/)',
      initial: true
    });

    if (save) {
      await this.saveToken(token);
    }

    return token;
  }

  /**
   * Save token to config file
   */
  async saveToken(token) {
    const configDir = constants.GLOBAL_CONFIG_DIR;
    const configPath = constants.GLOBAL_CONFIG_FILE;

    // Create config directory
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // Load existing config or create new
    let config = {};
    if (fs.existsSync(configPath)) {
      try {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      } catch (error) {
        logger.debug('Failed to load existing config:', error.message);
      }
    }

    // Update config
    config.githubToken = token;
    config.lastUpdated = new Date().toISOString();

    // Save config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    // Secure the file (Unix/Mac only)
    if (process.platform !== 'win32') {
      fs.chmodSync(configPath, 0o600); // rw-------
    }

    logger.success('Token saved securely');
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
          url: release.html_url
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

        // Decode base64 content
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
        // Download file
        const content = await this.getFileContent(repository, item.path, ref);

        // Create directory if needed
        const dir = path.dirname(itemLocalPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // Write file
        fs.writeFileSync(itemLocalPath, content);

        // Call progress callback if provided
        if (progressCallback) {
          progressCallback(item.name);
        } else {
          logger.fileOperation('download', itemLocalPath);
        }
      } else if (item.type === 'dir') {
        // Create directory
        if (!fs.existsSync(itemLocalPath)) {
          fs.mkdirSync(itemLocalPath, { recursive: true });
        }

        // Recursively download subdirectory
        await this._downloadDirectoryInternal(repository, item.path, itemLocalPath, ref, progressCallback);
      }
    }
  }

  /**
   * Download directory recursively with optional progress bar
   * @param {string} repository - Repository name (owner/repo)
   * @param {string} remotePath - Path in repository
   * @param {string} localPath - Local destination path
   * @param {string} ref - Git ref (branch/tag)
   * @param {Object} options - Options
   * @param {boolean} options.showProgress - Whether to show progress bar (default: true)
   * @param {Function} options.onFileDownloaded - Callback for each file downloaded
   */
  async downloadDirectory(repository, remotePath, localPath, ref = 'main', options = {}) {
    if (!this.authenticated) {
      await this.authenticate();
    }

    const showProgress = options.showProgress !== false && !options.onFileDownloaded;
    const onFileDownloaded = options.onFileDownloaded;

    if (showProgress) {
      // First count total files
      const totalFiles = await this.countRemoteFiles(repository, remotePath, ref);

      if (totalFiles > 0) {
        // Start progress bar
        logger.startProgressBar(totalFiles);

        // Download with progress callback
        await this._downloadDirectoryInternal(repository, remotePath, localPath, ref, filename => {
          logger.incrementProgressBar({ filename });
        });

        // Stop progress bar
        logger.stopProgressBar();
      }
    } else if (onFileDownloaded) {
      // External callback provided - use it instead of internal progress
      await this._downloadDirectoryInternal(repository, remotePath, localPath, ref, onFileDownloaded);
    } else {
      // Download without progress bar (for single files or when disabled)
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

    // Create directory if needed
    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(localPath, content);
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
        url: release.html_url
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
   * Compare versions (semantic versioning)
   */
  compareVersions(current, latest) {
    // Remove 'v' prefix if present
    const cleanCurrent = current.replace(/^v/, '');
    const cleanLatest = latest.replace(/^v/, '');

    const currentParts = cleanCurrent.split('.').map(Number);
    const latestParts = cleanLatest.split('.').map(Number);

    // Compare major.minor.patch
    for (let i = 0; i < 3; i++) {
      const curr = currentParts[i] || 0;
      const lat = latestParts[i] || 0;

      if (lat > curr) return 'outdated';
      if (lat < curr) return 'ahead';
    }

    return 'current';
  }
}

module.exports = new GitHubService();
