/**
 * Uninstall PM Kit from project or global location
 */

const chalk = require('chalk');
const path = require('path');
const os = require('os');
const logger = require('../utils/logger');
const fileManager = require('../utils/file-manager');
const { confirmAction } = require('../utils/prompts');
const constants = require('../constants');

async function uninstallCommand(options = {}) {
  try {
    logger.header('Uninstall PM Kit');

    // Detect installations
    const installations = detectInstallations();

    if (installations.length === 0) {
      logger.info('No PM Kit installations found.');
      logger.newline();
      logger.log('PM Kit is not installed in:');
      logger.log(chalk.gray(`  • Local: ${process.cwd()}/.claude`));
      logger.log(chalk.gray(`  • Global: ${path.join(os.homedir(), '.claude')}`));
      return;
    }

    // Display found installations
    logger.log('Found PM Kit installations:');
    logger.newline();

    for (const install of installations) {
      const sizeInfo = install.size ? ` (${formatSize(install.size)})` : '';
      logger.log(`  ${chalk.cyan(install.type)}: ${install.path}${chalk.gray(sizeInfo)}`);

      if (install.metadata) {
        logger.log(chalk.gray(`    Version: ${install.metadata.version || 'unknown'}`));
        logger.log(chalk.gray(`    Installed: ${install.metadata.installedAt || 'unknown'}`));
      }
    }

    logger.newline();

    // Skip confirmation if --yes flag
    if (!options.yes) {
      logger.warn('⚠️  WARNING: This will permanently delete the following:');
      for (const install of installations) {
        logger.log(chalk.red(`  • ${install.path}`));
      }
      logger.newline();

      const confirmed = await confirmAction(
        'Are you sure you want to uninstall PM Kit?',
        false
      );

      if (!confirmed) {
        logger.info('Uninstall cancelled');
        return;
      }

      // Double confirmation for safety
      if (installations.some(i => i.type === 'global')) {
        const doubleConfirm = await confirmAction(
          'This includes GLOBAL installation. Type "yes" to confirm:',
          false,
          true // requires typing "yes"
        );

        if (!doubleConfirm) {
          logger.info('Uninstall cancelled');
          return;
        }
      }
    }

    // Perform uninstall
    const spinner = logger.startSpinner('Removing PM Kit...');

    for (const install of installations) {
      try {
        // Remove .claude directory
        if (fileManager.exists(install.claudePath)) {
          fileManager.deleteDirectory(install.claudePath);
          logger.debug(`Removed: ${install.claudePath}`);
        }

        // Remove CLAUDE.md
        const claudeMdPath = path.join(path.dirname(install.claudePath), 'CLAUDE.md');
        if (fileManager.exists(claudeMdPath)) {
          fileManager.deleteFile(claudeMdPath);
          logger.debug(`Removed: ${claudeMdPath}`);
        }

        // Remove .mcp.json (but warn about API keys)
        const mcpPath = path.join(path.dirname(install.claudePath), '.mcp.json');
        if (fileManager.exists(mcpPath)) {
          fileManager.deleteFile(mcpPath);
          logger.debug(`Removed: ${mcpPath}`);
        }

        // Remove .pm-kit config directory
        const pmKitConfigPath = path.join(path.dirname(install.claudePath), '.pm-kit');
        if (fileManager.exists(pmKitConfigPath)) {
          fileManager.deleteDirectory(pmKitConfigPath);
          logger.debug(`Removed: ${pmKitConfigPath}`);
        }

      } catch (error) {
        logger.debug(`Error removing ${install.path}: ${error.message}`);
      }
    }

    // Remove global config
    if (fileManager.exists(constants.GLOBAL_CONFIG_DIR)) {
      try {
        fileManager.deleteDirectory(constants.GLOBAL_CONFIG_DIR);
        logger.debug(`Removed global config: ${constants.GLOBAL_CONFIG_DIR}`);
      } catch (error) {
        logger.debug(`Error removing global config: ${error.message}`);
      }
    }

    logger.succeedSpinner('PM Kit uninstalled successfully');
    logger.newline();

    // Summary
    logger.box(
      `${chalk.green.bold('✓ Uninstall Complete')}\n\n` +
      `Removed ${installations.length} installation(s)\n\n` +
      `${chalk.bold('What was removed:')}\n` +
      `  • .claude/ directories\n` +
      `  • CLAUDE.md files\n` +
      `  • .mcp.json configurations\n` +
      `  • .pm-kit/ local configs\n\n` +
      `${chalk.gray('To reinstall, run:')} ${chalk.cyan('pm-kit init')}`,
      { borderColor: 'green' }
    );

  } catch (error) {
    logger.newline();
    logger.error('Uninstall failed');
    throw error;
  }
}

/**
 * Detect PM Kit installations
 */
function detectInstallations() {
  const installations = [];

  // Check local installation
  const localClaudePath = path.join(process.cwd(), '.claude');
  if (isValidPMKitInstallation(localClaudePath)) {
    installations.push({
      type: 'local',
      path: process.cwd(),
      claudePath: localClaudePath,
      metadata: loadMetadata(localClaudePath),
      size: getDirectorySize(localClaudePath)
    });
  }

  // Check global installation
  const globalClaudePath = path.join(os.homedir(), '.claude');
  if (isValidPMKitInstallation(globalClaudePath) && globalClaudePath !== localClaudePath) {
    installations.push({
      type: 'global',
      path: os.homedir(),
      claudePath: globalClaudePath,
      metadata: loadMetadata(globalClaudePath),
      size: getDirectorySize(globalClaudePath)
    });
  }

  return installations;
}

/**
 * Check if directory is a valid PM Kit installation
 * Distinguishes from plain Claude Desktop .claude directories
 */
function isValidPMKitInstallation(claudePath) {
  if (!fileManager.exists(claudePath)) {
    return false;
  }

  // Check for PM Kit specific directories/files
  const pmKitIndicators = [
    path.join(claudePath, 'workflows'),
    path.join(claudePath, 'agents'),
    path.join(claudePath, 'commands'),
    path.join(path.dirname(claudePath), '.pm-kit'),
    path.join(path.dirname(claudePath), 'CLAUDE.md')
  ];

  // Must have at least 2 indicators to be considered PM Kit
  const matches = pmKitIndicators.filter(p => fileManager.exists(p));
  return matches.length >= 2;
}

/**
 * Load installation metadata
 */
function loadMetadata(claudePath) {
  const metadataPath = path.join(path.dirname(claudePath), '.pm-kit', 'metadata.json');

  if (!fileManager.exists(metadataPath)) {
    return null;
  }

  try {
    const content = fileManager.readFile(metadataPath);
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Get directory size recursively
 */
function getDirectorySize(dirPath) {
  if (!fileManager.exists(dirPath)) {
    return 0;
  }

  let size = 0;

  try {
    const files = fileManager.getAllFiles(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      try {
        const stats = fileManager.getStats(fullPath);
        size += stats.size;
      } catch {
        // Skip files we can't stat
      }
    }
  } catch {
    // Return 0 if we can't calculate
  }

  return size;
}

/**
 * Format bytes to human readable
 */
function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

module.exports = uninstallCommand;
