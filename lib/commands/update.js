/**
 * Update PM Kit to latest version
 */

const chalk = require('chalk');
const logger = require('../utils/logger');
const fileManager = require('../utils/file-manager');
const githubService = require('../services/github-service');
const { confirmAction } = require('../utils/prompts');
const { PMKitError, ErrorCodes } = require('../utils/error-handler');
const constants = require('../constants');
const path = require('path');
const minimatch = require('minimatch');

async function updateCommand(options = {}) {
  try {
    logger.header('Update PM Kit');

    // Check if initialized
    if (!fileManager.isInitialized()) {
      throw new PMKitError(
        'PM Kit is not initialized in this directory',
        ErrorCodes.NOT_INITIALIZED,
        {
          help: 'Run pm-kit init first'
        }
      );
    }

    // Authenticate with GitHub
    await githubService.authenticate();

    // Get current and target versions
    const versions = await checkVersions(options.version);

    // Handle version comparison
    if (versions.status === 'current' && !options.version) {
      logger.success('You are already on the latest version!');
      logger.info(`Current version: ${versions.current}`);
      logger.newline();
      return;
    }

    // If downgrading or same version with explicit --version, warn user
    if (options.version && versions.status !== 'outdated') {
      logger.warn(
        versions.status === 'current'
          ? `You are already on version ${versions.current}`
          : `Warning: ${versions.target} is older than current ${versions.current}`
      );

      if (!options.force) {
        const confirmed = await confirmAction(
          'Continue anyway?',
          false
        );
        if (!confirmed) {
          logger.info('Update cancelled');
          return;
        }
      }
    }

    // Show update information
    displayUpdateInfo(versions);

    // Dry run mode
    if (options.dryRun) {
      await performDryRun(options);
      return;
    }

    // Confirm update
    if (!options.force) {
      logger.newline();
      const confirmed = await confirmAction(
        `Update from ${versions.current} to ${versions.latest}?`,
        true
      );

      if (!confirmed) {
        logger.info('Update cancelled');
        return;
      }
    }

    // Create backup if requested
    if (options.backup) {
      await createBackup();
    }

    // Detect local changes
    const changes = await detectLocalChanges(options);

    if (changes.length > 0 && !options.force) {
      logger.warn(`Found ${changes.length} files with local modifications`);
      logger.list(changes.slice(0, 5), { color: 'yellow' });
      if (changes.length > 5) {
        logger.log(chalk.gray(`  ... and ${changes.length - 5} more`));
      }
      logger.newline();

      const confirmed = await confirmAction(
        'Continue with update? (local changes will be overwritten)',
        false
      );

      if (!confirmed) {
        logger.info('Update cancelled');
        logger.log('Tip: Use --exclude to preserve specific files');
        return;
      }
    }

    // Perform update
    await performUpdate(options, versions.target);

    // Save file hashes for future change detection
    saveFileHashes();

    // Success message
    logger.newline();
    logger.box(
      `${chalk.green.bold('✓ Update Complete!')}\n\n` +
      `Updated from ${versions.current} to ${versions.latest}\n\n` +
      `${chalk.bold('What changed:')}\n` +
      `${formatChangelog(versions.changelog)}\n\n` +
      `${chalk.bold('Next steps:')}\n` +
      `  1. Run: ${chalk.cyan('pm-kit doctor')} to verify installation\n` +
      `  2. Review: ${chalk.cyan('CLAUDE.md')} for any new features\n` +
      `  3. Continue using: ${chalk.cyan('claude')}`,
      { borderColor: 'green' }
    );

  } catch (error) {
    logger.newline();
    logger.error('Update failed');
    throw error;
  }
}

/**
 * Check current and target versions
 */
async function checkVersions(targetVersion = null) {
  const spinner = logger.startSpinner(
    targetVersion
      ? `Checking version ${targetVersion}...`
      : 'Checking for updates...'
  );

  try {
    // Get target release (specific version or latest)
    let release;
    if (targetVersion) {
      // Normalize version tag (add 'v' prefix if missing)
      const tag = targetVersion.startsWith('v') ? targetVersion : `v${targetVersion}`;
      release = await githubService.getReleaseByTag(tag);
    } else {
      release = await githubService.getLatestRelease();
    }

    // Read current version from CLAUDE.md or package
    const currentVersion = constants.CLI_VERSION;

    // Compare versions
    const comparison = githubService.compareVersions(currentVersion, release.version);

    logger.succeedSpinner(
      comparison === 'current'
        ? 'You are up to date'
        : targetVersion
          ? `Version ${release.version} found`
          : 'Update available'
    );

    return {
      current: currentVersion,
      latest: release.version,
      target: release.version,
      status: comparison,
      changelog: release.body,
      publishedAt: release.publishedAt,
      url: release.url
    };
  } catch (error) {
    logger.failSpinner('Failed to check for updates');
    throw error;
  }
}

/**
 * Display update information
 */
function displayUpdateInfo(versions) {
  logger.newline();
  logger.table({
    'Current Version': chalk.yellow(versions.current),
    'Latest Version': chalk.green(versions.latest),
    'Published': new Date(versions.publishedAt).toLocaleDateString(),
    'Status': versions.status === 'outdated' ? chalk.yellow('Update available') : chalk.green('Up to date')
  });
  logger.newline();

  if (versions.changelog) {
    logger.log(chalk.bold('Release Notes:'));
    logger.log(chalk.gray(versions.changelog));
    logger.newline();
  }
}

/**
 * Format changelog for display
 */
function formatChangelog(changelog) {
  if (!changelog) return 'No changelog available';

  // Split into lines and format
  const lines = changelog.split('\n').slice(0, 5);
  return lines.map(line => `  ${line}`).join('\n');
}

/**
 * Perform dry run
 */
async function performDryRun(options) {
  logger.header('Dry Run - Files that would be updated:');

  const filesToUpdate = await getFilesToUpdate(options);

  if (filesToUpdate.length === 0) {
    logger.info('No files to update');
    return;
  }

  logger.list(filesToUpdate, { color: 'cyan' });
  logger.newline();
  logger.info(`Total: ${filesToUpdate.length} files would be updated`);
  logger.log('Run without --dry-run to apply updates');
}

/**
 * Get list of files to update
 */
async function getFilesToUpdate(options) {
  const files = [];
  const exclusions = getExclusionPatterns(options);

  // Check each download path
  for (const downloadPath of constants.DOWNLOAD_PATHS) {
    if (shouldExclude(downloadPath, exclusions)) {
      continue;
    }

    if (downloadPath === 'CLAUDE.md') {
      files.push(downloadPath);
    } else {
      // Would need to traverse directory
      files.push(`${downloadPath}/**`);
    }
  }

  return files;
}

/**
 * Get exclusion patterns
 */
function getExclusionPatterns(options) {
  const patterns = [...constants.DEFAULT_EXCLUSIONS];

  if (options.exclude) {
    const customExclusions = Array.isArray(options.exclude)
      ? options.exclude
      : [options.exclude];
    patterns.push(...customExclusions);
  }

  return patterns;
}

/**
 * Check if path should be excluded
 */
function shouldExclude(filePath, exclusions) {
  return exclusions.some(pattern => minimatch(filePath, pattern));
}

/**
 * Detect local changes using hash comparison
 */
async function detectLocalChanges(options) {
  const changes = [];
  const hashFilePath = path.join('.pm-kit', 'file-hashes.json');

  // Load original hashes if they exist
  const originalHashes = fileManager.loadDirectoryHashes(hashFilePath);

  if (Object.keys(originalHashes).length === 0) {
    // No hash file - check based on modification time as fallback
    const claudeMdExists = fileManager.exists('CLAUDE.md');
    if (claudeMdExists) {
      const stats = fileManager.getStats('CLAUDE.md');
      const ageInDays = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60 * 24);
      if (ageInDays < 1) {
        changes.push('CLAUDE.md (recently modified)');
      }
    }
    return changes;
  }

  // Check .claude directory for modifications
  if (fileManager.exists('.claude')) {
    const modifications = fileManager.detectModifications('.claude', originalHashes);
    for (const mod of modifications) {
      changes.push(`${mod.file} (${mod.status})`);
    }
  }

  // Check CLAUDE.md
  if (fileManager.exists('CLAUDE.md') && originalHashes['CLAUDE.md']) {
    const currentHash = fileManager.getFileHash('CLAUDE.md');
    if (currentHash !== originalHashes['CLAUDE.md']) {
      changes.push('CLAUDE.md (modified)');
    }
  }

  return changes;
}

/**
 * Create backup
 */
async function createBackup() {
  const spinner = logger.startSpinner('Creating backup...');

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = `.pm-kit-backup-${timestamp}`;

    // Create backup directory
    fileManager.createDir(backupDir);

    // Backup key files and directories
    const itemsToBackup = [
      'CLAUDE.md',
      '.mcp.json',
      '.claude'
    ];

    let backedUpCount = 0;

    for (const item of itemsToBackup) {
      if (fileManager.exists(item)) {
        const dest = path.join(backupDir, item);

        if (fileManager.isDirectory(item)) {
          // Use recursive directory copy
          fileManager.copyDirectory(item, dest);
          backedUpCount++;
          logger.debug(`Backed up directory: ${item}`);
        } else {
          fileManager.copyFile(item, dest);
          backedUpCount++;
          logger.debug(`Backed up file: ${item}`);
        }
      }
    }

    logger.succeedSpinner(`Backup created: ${backupDir} (${backedUpCount} items)`);
    return backupDir;
  } catch (error) {
    logger.failSpinner('Backup failed');
    throw error;
  }
}

/**
 * Perform update
 */
async function performUpdate(options, targetVersion = null) {
  logger.header('Updating Files');

  const spinner = logger.startSpinner('Downloading updates...');
  const exclusions = getExclusionPatterns(options);

  try {
    const repository = constants.KIT_REPOSITORY;
    // Use tag for specific version, otherwise main branch
    const ref = targetVersion
      ? (targetVersion.startsWith('v') ? targetVersion : `v${targetVersion}`)
      : constants.KIT_REPOSITORY_BRANCH;

    let updateCount = 0;

    // Update each path
    for (const downloadPath of constants.DOWNLOAD_PATHS) {
      if (shouldExclude(downloadPath, exclusions)) {
        logger.debug(`Skipping excluded path: ${downloadPath}`);
        continue;
      }

      logger.updateSpinner(`Updating ${downloadPath}...`);

      if (downloadPath === 'CLAUDE.md') {
        await githubService.downloadFile(
          repository,
          downloadPath,
          downloadPath,
          ref
        );
        updateCount++;
      } else {
        await githubService.downloadDirectory(
          repository,
          downloadPath,
          downloadPath,
          ref
        );
        updateCount++;
      }
    }

    logger.succeedSpinner(`Updated ${updateCount} components`);

    // Show what was updated
    logger.newline();
    logger.log('Updated:');
    const updatedPaths = constants.DOWNLOAD_PATHS.filter(
      p => !shouldExclude(p, exclusions)
    );
    logger.list(updatedPaths, { color: 'cyan' });

    // Show what was preserved
    const preservedPaths = exclusions.filter(pattern => {
      // Check if any actual files match this pattern
      return constants.DOWNLOAD_PATHS.some(p => minimatch(p, pattern));
    });

    if (preservedPaths.length > 0) {
      logger.newline();
      logger.log('Preserved (not updated):');
      logger.list(preservedPaths.slice(0, 5), { color: 'gray' });
    }

  } catch (error) {
    logger.failSpinner('Update failed');
    throw error;
  }
}

/**
 * Save file hashes for change detection
 */
function saveFileHashes() {
  try {
    const hashFilePath = path.join('.pm-kit', 'file-hashes.json');
    const hashes = {};

    // Hash .claude directory
    if (fileManager.exists('.claude')) {
      const claudeFiles = fileManager.getAllFiles('.claude');
      for (const file of claudeFiles) {
        const fullPath = path.join('.claude', file);
        hashes[file] = fileManager.getFileHash(fullPath);
      }
    }

    // Hash CLAUDE.md
    if (fileManager.exists('CLAUDE.md')) {
      hashes['CLAUDE.md'] = fileManager.getFileHash('CLAUDE.md');
    }

    // Save hashes
    fileManager.createDir('.pm-kit');
    fileManager.writeFile(hashFilePath, JSON.stringify(hashes, null, 2));

    logger.debug(`Saved ${Object.keys(hashes).length} file hashes`);
  } catch (error) {
    logger.debug(`Failed to save file hashes: ${error.message}`);
    // Non-critical, continue
  }
}

module.exports = updateCommand;
