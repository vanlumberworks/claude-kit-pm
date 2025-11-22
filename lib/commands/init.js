/**
 * Initialize PM Kit in current directory or global location
 */

const pc = require('picocolors');
const path = require('path');
const os = require('os');
const logger = require('../utils/logger');
const fileManager = require('../utils/file-manager');
const githubService = require('../services/github-service');
const mcpService = require('../services/mcp-service');
const { promptForAPIKeys, confirmAction, note, outro } = require('../utils/prompts');
const { PMKitError, ErrorCodes } = require('../utils/error-handler');
const constants = require('../constants');
const { playLogoAnimation } = require('../utils/ascii-animation');

async function initCommand(options = {}) {
  try {
    // Determine installation directory
    const installDir = options.global
      ? path.join(os.homedir(), '.claude')
      : process.cwd();

    const isGlobal = options.global || false;

    // Show beautiful logo banner on startup
    await playLogoAnimation({ skipAnimation: options.noAnimation });

    // Handle --fresh flag (clean installation)
    if (options.fresh) {
      await handleFreshInstall(installDir, isGlobal);
    }

    // Step 1: Pre-flight checks
    await preflightChecks(options, installDir);

    // Step 2: Authenticate with GitHub
    logger.header('GitHub Authentication');
    await githubService.authenticate(options.resetToken);

    // Step 3: Download kit files
    logger.header('Download Framework Files');
    await downloadKitFiles(installDir);

    // Step 4: Configure API keys
    if (!options.reconfigureApi) {
      logger.header('API Configuration');
    }
    const apiKeys = await promptForAPIKeys();

    // Step 5: Generate .mcp.json
    logger.header('Generate MCP Configuration');
    const mcpConfig = mcpService.generateConfig(apiKeys);
    const mcpPath = isGlobal
      ? path.join(os.homedir(), '.mcp.json')
      : '.mcp.json';
    mcpService.writeConfig(mcpConfig, mcpPath);
    logger.success(`Created ${mcpPath}`);

    // Step 6: Create output directories (only for local installation)
    if (!isGlobal) {
      logger.header('Create Output Directories');
      fileManager.createDirs(constants.REQUIRED_DIRS);
      logger.success(`Created ${constants.REQUIRED_DIRS.length} directories`);

      // Step 7: Update .gitignore (only for local installation)
      logger.header('Update .gitignore');
      fileManager.updateGitignore(constants.GITIGNORE_ENTRIES);
      logger.success('Updated .gitignore with sensitive files');
    }

    // Save file hashes for change detection
    saveInstallationHashes(installDir);

    // Success message using @clack/prompts
    logger.newline();

    note(
      `${pc.dim('Location:')} ${pc.cyan(installDir)}\n\n` +
      `${pc.bold('Next steps:')}\n` +
      `  1. Run ${pc.cyan('claude')} to start\n` +
      `  2. Try ${pc.cyan('/prd')}, ${pc.cyan('/research')}, ${pc.cyan('/prioritize')}\n` +
      `  3. Read ${pc.cyan('CLAUDE.md')} for docs\n\n` +
      `${pc.dim('Help:')} ${pc.cyan('pm-kit doctor')} or ${pc.cyan('pm-kit --help')}`,
      pc.green('✔ Installation Complete!')
    );

    outro(`PM Kit installed ${isGlobal ? 'globally' : 'successfully'}`);

  } catch (error) {
    logger.newline();
    logger.error('Installation failed');
    throw error;
  }
}

/**
 * Handle fresh installation (remove existing before installing)
 */
async function handleFreshInstall(installDir, isGlobal) {
  const claudePath = isGlobal
    ? path.join(os.homedir(), '.claude')
    : path.join(installDir, '.claude');

  if (!fileManager.exists(claudePath)) {
    logger.info('No existing installation found, proceeding with fresh install');
    return;
  }

  logger.warn('⚠️  WARNING: Fresh installation requested');
  logger.log(pc.red(`This will permanently delete: ${claudePath}`));
  logger.newline();

  const confirmed = await confirmAction(
    'Are you sure you want to delete ALL existing files?',
    false
  );

  if (!confirmed) {
    logger.info('Fresh installation cancelled');
    process.exit(0);
  }

  // Double confirmation
  const doubleConfirm = await confirmAction(
    'Type "yes" to confirm deletion (this cannot be undone):',
    false,
    true
  );

  if (!doubleConfirm) {
    logger.info('Fresh installation cancelled');
    process.exit(0);
  }

  const spinner = logger.startSpinner('Removing existing installation...');

  try {
    fileManager.deleteDirectory(claudePath);

    // Also remove CLAUDE.md and .mcp.json
    const claudeMdPath = isGlobal
      ? path.join(os.homedir(), 'CLAUDE.md')
      : path.join(installDir, 'CLAUDE.md');
    const mcpPath = isGlobal
      ? path.join(os.homedir(), '.mcp.json')
      : path.join(installDir, '.mcp.json');

    if (fileManager.exists(claudeMdPath)) {
      fileManager.deleteFile(claudeMdPath);
    }
    if (fileManager.exists(mcpPath)) {
      fileManager.deleteFile(mcpPath);
    }

    logger.succeedSpinner('Existing installation removed');
  } catch (error) {
    logger.failSpinner('Failed to remove existing installation');
    throw error;
  }
}

/**
 * Save file hashes after installation for change detection
 */
function saveInstallationHashes(installDir) {
  try {
    const claudePath = path.join(installDir, '.claude');
    const hashFilePath = path.join(installDir, '.pm-kit', 'file-hashes.json');

    if (!fileManager.exists(claudePath)) {
      return;
    }

    fileManager.saveDirectoryHashes(claudePath, hashFilePath);
    logger.debug('Saved installation file hashes for change detection');
  } catch (error) {
    logger.debug(`Failed to save file hashes: ${error.message}`);
    // Non-critical, continue
  }
}

/**
 * Pre-flight checks
 */
async function preflightChecks(options, installDir) {
  logger.header('Pre-flight Checks');

  const spinner = logger.startSpinner('Checking environment...');

  // Check if already initialized
  const claudePath = path.join(installDir, '.claude');
  const claudeMdPath = path.join(installDir, 'CLAUDE.md');
  const isInitialized = fileManager.exists(claudePath) && fileManager.exists(claudeMdPath);

  if (isInitialized && !options.force && !options.fresh) {
    logger.stopSpinner();
    logger.warn('PM Kit is already initialized in ' + installDir);
    logger.newline();

    const confirmed = await confirmAction(
      'Reinitialize? This will overwrite existing files.',
      false
    );

    if (!confirmed) {
      logger.info('Installation cancelled');
      logger.newline();
      logger.log('To update existing installation, use:', pc.cyan('pm-kit update'));
      process.exit(0);
    }

    logger.newline();
  } else {
    logger.succeedSpinner('Environment ready');
  }

  // Check Node.js version
  const nodeVersion = process.version;
  logger.checkResult('Node.js', true, nodeVersion);

  // Check if Claude CLI is installed
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);

  try {
    const { stdout } = await execAsync('claude --version');
    const claudeVersion = stdout.trim();
    logger.checkResult('Claude CLI', true, claudeVersion);
  } catch (error) {
    logger.checkResult('Claude CLI', false, 'Not found');
    logger.warn('Claude CLI is recommended but not required');
    logger.log('Install from:', pc.cyan('https://claude.ai/code'));
  }

  logger.newline();
}

/**
 * Download kit files from GitHub
 */
async function downloadKitFiles(installDir) {
  const spinner = logger.startSpinner('Calculating download size...');

  try {
    const repository = constants.KIT_REPOSITORY;
    const ref = constants.KIT_REPOSITORY_BRANCH;

    // First count total files across all download paths
    let totalFiles = 0;
    for (const downloadPath of constants.DOWNLOAD_PATHS) {
      if (downloadPath === 'CLAUDE.md') {
        totalFiles += 1;
      } else {
        totalFiles += await githubService.countRemoteFiles(repository, downloadPath, ref);
      }
    }

    logger.succeedSpinner(`Found ${totalFiles} files to download`);
    logger.newline();

    // Start progress bar
    logger.startProgressBar(totalFiles);

    let downloadedCount = 0;

    // Download each required path with progress
    for (const downloadPath of constants.DOWNLOAD_PATHS) {
      // Determine local path based on install directory
      const localPath = path.join(installDir, downloadPath);

      if (downloadPath === 'CLAUDE.md') {
        // Download single file
        await githubService.downloadFile(
          repository,
          downloadPath,
          localPath,
          ref
        );
        downloadedCount++;
        logger.updateProgressBar(downloadedCount, { filename: downloadPath });
      } else {
        // Download directory (without its own progress bar)
        await githubService.downloadDirectory(
          repository,
          downloadPath,
          localPath,
          ref,
          {
            showProgress: false, // We're managing progress ourselves
            onFileDownloaded: filename => {
              downloadedCount++;
              logger.updateProgressBar(downloadedCount, { filename });
            }
          }
        );
      }
    }

    // Stop progress bar
    logger.stopProgressBar();

    // Show summary
    logger.newline();
    logger.success(`Downloaded ${totalFiles} files from ${constants.DOWNLOAD_PATHS.length} components`);
    logger.newline();
    logger.log('Downloaded:');
    logger.list(constants.DOWNLOAD_PATHS, { color: 'cyan' });

  } catch (error) {
    logger.stopProgressBar();
    logger.failSpinner('Download failed');

    if (error.code === ErrorCodes.REPO_NOT_FOUND) {
      logger.newline();
      logger.error('Could not access the kit repository');
      logger.log('This may be because:');
      logger.list([
        'The repository is private and you need access',
        'Your GitHub token doesn\'t have the right permissions',
        'The repository name is incorrect'
      ], { color: 'gray' });
      logger.newline();
      logger.log('Repository:', pc.cyan(constants.KIT_REPOSITORY));
      logger.log('Required permissions:', pc.cyan(constants.GITHUB_TOKEN_SCOPES.join(', ')));
    }

    throw error;
  }
}

module.exports = initCommand;
