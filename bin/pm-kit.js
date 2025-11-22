#!/usr/bin/env node

/**
 * ClaudeKit PM CLI
 * CLI installer and manager for Product Management framework
 */

const { program } = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const os = require('os');
const packageJson = require('../package.json');
const { handleError } = require('../lib/utils/error-handler');

// Import commands
const initCommand = require('../lib/commands/init');
const updateCommand = require('../lib/commands/update');
const doctorCommand = require('../lib/commands/doctor');
const configCommand = require('../lib/commands/config');
const versionsCommand = require('../lib/commands/versions');
const uninstallCommand = require('../lib/commands/uninstall');

// Update notification cache
const CACHE_DIR = path.join(os.homedir(), '.pm-kit', 'cache');
const CACHE_FILE = path.join(CACHE_DIR, 'version-check.json');
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Check for newer version (cached)
 */
async function checkForUpdates() {
  // Skip if disabled
  if (process.env.NO_UPDATE_NOTIFIER === '1') {
    return null;
  }

  try {
    // Check cache
    let cached = null;
    if (fs.existsSync(CACHE_FILE)) {
      const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      if (Date.now() - data.timestamp < CACHE_TTL) {
        cached = data;
      }
    }

    if (cached) {
      return cached.latestVersion !== packageJson.version ? cached.latestVersion : null;
    }

    // Fetch latest version (async, don't block)
    const https = require('https');
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(null), 3000);

      const req = https.get(
        'https://registry.npmjs.org/pm-kit-cli/latest',
        { timeout: 3000 },
        (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            clearTimeout(timeout);
            try {
              const pkg = JSON.parse(data);
              const latestVersion = pkg.version;

              // Save to cache
              if (!fs.existsSync(CACHE_DIR)) {
                fs.mkdirSync(CACHE_DIR, { recursive: true });
              }
              fs.writeFileSync(CACHE_FILE, JSON.stringify({
                latestVersion,
                timestamp: Date.now()
              }));

              resolve(latestVersion !== packageJson.version ? latestVersion : null);
            } catch {
              resolve(null);
            }
          });
        }
      );

      req.on('error', () => {
        clearTimeout(timeout);
        resolve(null);
      });
    });
  } catch {
    return null;
  }
}

/**
 * Show version with update notification
 */
async function showVersionWithUpdateCheck() {
  console.log(`pm-kit-cli v${packageJson.version}`);

  const latestVersion = await checkForUpdates();

  if (latestVersion) {
    console.log('');
    console.log(chalk.yellow('┌────────────────────────────────────────────────┐'));
    console.log(chalk.yellow('│') + chalk.white('  Update available! ') + chalk.gray(packageJson.version) + chalk.white(' → ') + chalk.green(latestVersion) + chalk.yellow('          │'));
    console.log(chalk.yellow('│') + chalk.white('  Run ') + chalk.cyan('npm update -g pm-kit-cli') + chalk.white(' to update  ') + chalk.yellow('│'));
    console.log(chalk.yellow('└────────────────────────────────────────────────┘'));
  }
}

// Configure CLI
program
  .name('pm-kit')
  .description('ClaudeKit PM - Product Management Framework CLI')
  .version(packageJson.version, '-v, --version', 'Display version number')
  .helpOption('-h, --help', 'Display help information');

// Override version action to include update check
program.on('option:version', async () => {
  await showVersionWithUpdateCheck();
  process.exit(0);
});

// Init command
program
  .command('init')
  .description('Initialize PM Kit in current directory')
  .option('--reset-token', 'Reset GitHub authentication token')
  .option('--reconfigure-api', 'Reconfigure API keys only')
  .option('--minimal', 'Install minimal set of workflows')
  .option('--full', 'Install all workflows (default)', true)
  .option('--exclude <patterns...>', 'Exclude specific files/directories')
  .option('-g, --global', 'Install to user-wide ~/.claude directory')
  .option('--fresh', 'Clean install - remove existing before installing')
  .option('--force', 'Force overwrite without confirmation')
  .option('--no-animation', 'Skip the animated logo on startup')
  .action(async (options) => {
    try {
      await initCommand(options);
    } catch (error) {
      handleError(error, 'init');
      process.exit(1);
    }
  });

// Update command
program
  .command('update')
  .description('Update PM Kit to latest version')
  .option('--force', 'Force update, ignore local changes')
  .option('--dry-run', 'Show what would be updated without making changes')
  .option('--exclude <patterns...>', 'Additional exclusion patterns')
  .option('--backup', 'Create backup before updating')
  .option('--version <version>', 'Update to specific version')
  .action(async (options) => {
    try {
      await updateCommand(options);
    } catch (error) {
      handleError(error, 'update');
      process.exit(1);
    }
  });

// Doctor command
program
  .command('doctor')
  .description('Run diagnostics on PM Kit installation')
  .option('--verbose', 'Show detailed diagnostic information')
  .option('--fix', 'Attempt to fix issues automatically')
  .option('--json', 'Output results as JSON')
  .action(async (options) => {
    try {
      await doctorCommand(options);
    } catch (error) {
      handleError(error, 'doctor');
      process.exit(1);
    }
  });

// Config command
program
  .command('config <action> [key] [value]')
  .description('Manage PM Kit configuration')
  .action(async (action, key, value, options) => {
    try {
      await configCommand(action, key, value, options);
    } catch (error) {
      handleError(error, 'config');
      process.exit(1);
    }
  });

// Versions command
program
  .command('versions')
  .description('List available PM Kit versions')
  .option('--limit <number>', 'Maximum versions to show', '30')
  .option('--all', 'Include prereleases and drafts')
  .option('--verbose', 'Show release descriptions')
  .action(async (options) => {
    try {
      // Parse limit as integer
      options.limit = parseInt(options.limit, 10);
      await versionsCommand(options);
    } catch (error) {
      handleError(error, 'versions');
      process.exit(1);
    }
  });

// Uninstall command
program
  .command('uninstall')
  .description('Remove PM Kit installation')
  .option('-y, --yes', 'Skip confirmation prompts')
  .action(async (options) => {
    try {
      await uninstallCommand(options);
    } catch (error) {
      handleError(error, 'uninstall');
      process.exit(1);
    }
  });

// Custom help
program.addHelpText('after', `

Examples:
  $ pm-kit init                          Initialize PM Kit
  $ pm-kit init --minimal                Install minimal workflows
  $ pm-kit init --global                 Install to user-wide ~/.claude
  $ pm-kit update                        Update to latest version
  $ pm-kit update --dry-run              Preview updates
  $ pm-kit update --version v1.2.0       Update to specific version
  $ pm-kit versions                      List available versions
  $ pm-kit versions --all                Include prereleases
  $ pm-kit uninstall                     Remove PM Kit installation
  $ pm-kit doctor                        Run diagnostics
  $ pm-kit doctor --fix                  Auto-fix issues
  $ pm-kit config list                   Show configuration
  $ pm-kit config set github-token TOKEN Set GitHub token

Documentation:
  ${chalk.cyan('https://github.com/your-org/claude-kit-pm')}

Support:
  ${chalk.cyan('https://github.com/your-org/claude-kit-pm/issues')}
`);

// Handle unknown commands
program.on('command:*', (operands) => {
  console.error(chalk.red(`\nError: Unknown command '${operands[0]}'`));
  console.log('\nRun', chalk.cyan('pm-kit --help'), 'for available commands\n');
  process.exit(1);
});

// Global error handler
process.on('uncaughtException', (error) => {
  console.error(chalk.red('\n✖ Unexpected error occurred:'));
  console.error(error.message);
  console.error('\nPlease report this issue at:');
  console.error(chalk.cyan('https://github.com/your-org/claude-kit-pm/issues\n'));
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('\n✖ Unhandled promise rejection:'));
  console.error(reason);
  process.exit(1);
});

// Parse arguments and execute
program.parse(process.argv);

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
