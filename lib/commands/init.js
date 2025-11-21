/**
 * Initialize PM Kit in current directory
 */

const chalk = require('chalk');
const logger = require('../utils/logger');
const fileManager = require('../utils/file-manager');
const githubService = require('../services/github-service');
const mcpService = require('../services/mcp-service');
const { promptForAPIKeys, confirmAction } = require('../utils/prompts');
const { PMKitError, ErrorCodes } = require('../utils/error-handler');
const constants = require('../constants');

async function initCommand(options = {}) {
  try {
    logger.box(
      `${chalk.bold('ClaudeKit PM Installer')}\n\n` +
      `Version ${constants.CLI_VERSION}\n` +
      `Simple installation for Product Managers`,
      { borderColor: 'cyan' }
    );

    // Step 1: Pre-flight checks
    await preflightChecks(options);

    // Step 2: Authenticate with GitHub
    logger.header('GitHub Authentication');
    await githubService.authenticate(options.resetToken);

    // Step 3: Download kit files
    logger.header('Download Framework Files');
    await downloadKitFiles();

    // Step 4: Configure API keys
    if (!options.reconfigureApi) {
      logger.header('API Configuration');
    }
    const apiKeys = await promptForAPIKeys();

    // Step 5: Generate .mcp.json
    logger.header('Generate MCP Configuration');
    const mcpConfig = mcpService.generateConfig(apiKeys);
    mcpService.writeConfig(mcpConfig);
    logger.success('Created .mcp.json');

    // Step 6: Create output directories
    logger.header('Create Output Directories');
    fileManager.createDirs(constants.REQUIRED_DIRS);
    logger.success(`Created ${constants.REQUIRED_DIRS.length} directories`);

    // Step 7: Update .gitignore
    logger.header('Update .gitignore');
    fileManager.updateGitignore(constants.GITIGNORE_ENTRIES);
    logger.success('Updated .gitignore with sensitive files');

    // Success message
    logger.newline();
    logger.box(
      `${chalk.green.bold('✓ Installation Complete!')}\n\n` +
      `PM Kit has been installed successfully.\n\n` +
      `${chalk.bold('Next steps:')}\n` +
      `  1. Run: ${chalk.cyan('claude')}\n` +
      `  2. Use: ${chalk.cyan('/prd')}, ${chalk.cyan('/research')}, ${chalk.cyan('/prioritize')}\n` +
      `  3. Read: ${chalk.cyan('CLAUDE.md')} for full documentation\n\n` +
      `${chalk.bold('Get help:')}\n` +
      `  ${chalk.cyan('pm-kit doctor')} - Run diagnostics\n` +
      `  ${chalk.cyan('pm-kit --help')} - Show all commands`,
      { borderColor: 'green' }
    );

    logger.newline();
    logger.info('Installation completed in ' + process.cwd());

  } catch (error) {
    logger.newline();
    logger.error('Installation failed');
    throw error;
  }
}

/**
 * Pre-flight checks
 */
async function preflightChecks(options) {
  logger.header('Pre-flight Checks');

  const spinner = logger.startSpinner('Checking environment...');

  // Check if already initialized
  if (fileManager.isInitialized() && !options.force) {
    logger.stopSpinner();
    logger.warn('PM Kit is already initialized in this directory');
    logger.newline();

    const confirmed = await confirmAction(
      'Reinitialize? This will overwrite existing files.',
      false
    );

    if (!confirmed) {
      logger.info('Installation cancelled');
      logger.newline();
      logger.log('To update existing installation, use:', chalk.cyan('pm-kit update'));
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
    logger.log('Install from:', chalk.cyan('https://claude.ai/code'));
  }

  logger.newline();
}

/**
 * Download kit files from GitHub
 */
async function downloadKitFiles() {
  const spinner = logger.startSpinner('Downloading framework files...');

  try {
    const repository = constants.KIT_REPOSITORY;

    // Download each required path
    for (const downloadPath of constants.DOWNLOAD_PATHS) {
      logger.updateSpinner(`Downloading ${downloadPath}...`);

      if (downloadPath === 'CLAUDE.md') {
        // Download single file
        await githubService.downloadFile(
          repository,
          downloadPath,
          downloadPath,
          constants.KIT_REPOSITORY_BRANCH
        );
      } else {
        // Download directory
        await githubService.downloadDirectory(
          repository,
          downloadPath,
          downloadPath,
          constants.KIT_REPOSITORY_BRANCH
        );
      }
    }

    logger.succeedSpinner(`Downloaded ${constants.DOWNLOAD_PATHS.length} components`);

    // Show summary
    logger.newline();
    logger.log('Downloaded:');
    logger.list(constants.DOWNLOAD_PATHS, { color: 'cyan' });

  } catch (error) {
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
      logger.log('Repository:', chalk.cyan(constants.KIT_REPOSITORY));
      logger.log('Required permissions:', chalk.cyan(constants.GITHUB_TOKEN_SCOPES.join(', ')));
    }

    throw error;
  }
}

module.exports = initCommand;
