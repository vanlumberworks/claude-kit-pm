#!/usr/bin/env node

/**
 * ClaudeKit PM CLI
 * CLI installer and manager for Product Management framework
 */

const { cac } = require('cac');
const pc = require('picocolors');
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
    console.log(pc.yellow('┌────────────────────────────────────────────────┐'));
    console.log(pc.yellow('│') + '  Update available! ' + pc.gray(packageJson.version) + ' → ' + pc.green(latestVersion) + '          ' + pc.yellow('│'));
    console.log(pc.yellow('│') + '  Run ' + pc.cyan('npm update -g pm-kit-cli') + ' to update  ' + pc.yellow('│'));
    console.log(pc.yellow('└────────────────────────────────────────────────┘'));
  }
}

// Create CLI instance
const cli = cac('pm-kit');

// Init command
cli
  .command('init', 'Initialize PM Kit in current directory')
  .option('--reset-token', 'Reset GitHub authentication token')
  .option('--reconfigure-api', 'Reconfigure API keys only')
  .option('--minimal', 'Install minimal set of workflows')
  .option('--full', 'Install all workflows (default)')
  .option('--exclude <patterns>', 'Exclude specific files/directories')
  .option('-g, --global', 'Install to user-wide ~/.claude directory')
  .option('--fresh', 'Clean install - remove existing before installing')
  .option('--force', 'Force overwrite without confirmation')
  .option('--no-animation', 'Skip the animated logo on startup')
  .action(async (options) => {
    try {
      // Convert exclude string to array if provided
      if (options.exclude && typeof options.exclude === 'string') {
        options.exclude = options.exclude.split(',').map(p => p.trim());
      }
      await initCommand(options);
    } catch (error) {
      handleError(error, 'init');
      process.exit(1);
    }
  });

// Update command
cli
  .command('update', 'Update PM Kit to latest version')
  .option('--force', 'Force update, ignore local changes')
  .option('--dry-run', 'Show what would be updated without making changes')
  .option('--exclude <patterns>', 'Additional exclusion patterns')
  .option('--backup', 'Create backup before updating')
  .option('--version <version>', 'Update to specific version')
  .action(async (options) => {
    try {
      if (options.exclude && typeof options.exclude === 'string') {
        options.exclude = options.exclude.split(',').map(p => p.trim());
      }
      await updateCommand(options);
    } catch (error) {
      handleError(error, 'update');
      process.exit(1);
    }
  });

// Doctor command
cli
  .command('doctor', 'Run diagnostics on PM Kit installation')
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
cli
  .command('config <action> [key] [value]', 'Manage PM Kit configuration')
  .action(async (action, key, value, options) => {
    try {
      await configCommand(action, key, value, options);
    } catch (error) {
      handleError(error, 'config');
      process.exit(1);
    }
  });

// Versions command
cli
  .command('versions', 'List available PM Kit versions')
  .option('--limit <number>', 'Maximum versions to show', { default: 30 })
  .option('--all', 'Include prereleases and drafts')
  .option('--verbose', 'Show release descriptions')
  .action(async (options) => {
    try {
      options.limit = parseInt(options.limit, 10);
      await versionsCommand(options);
    } catch (error) {
      handleError(error, 'versions');
      process.exit(1);
    }
  });

// Uninstall command
cli
  .command('uninstall', 'Remove PM Kit installation')
  .option('-y, --yes', 'Skip confirmation prompts')
  .action(async (options) => {
    try {
      await uninstallCommand(options);
    } catch (error) {
      handleError(error, 'uninstall');
      process.exit(1);
    }
  });

// Version
cli.version(packageJson.version);
cli.help();

// Add custom help text
cli.on('command:*', () => {
  console.error(pc.red(`\nError: Unknown command`));
  console.log('\nRun', pc.cyan('pm-kit --help'), 'for available commands\n');
  process.exit(1);
});

// Global error handler
process.on('uncaughtException', (error) => {
  console.error(pc.red('\n✖ Unexpected error occurred:'));
  console.error(error.message);
  console.error('\nPlease report this issue at:');
  console.error(pc.cyan('https://github.com/your-org/claude-kit-pm/issues\n'));
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(pc.red('\n✖ Unhandled promise rejection:'));
  console.error(reason);
  process.exit(1);
});

// Handle --version flag manually for update check
const args = process.argv.slice(2);
if (args.includes('-v') || args.includes('--version')) {
  showVersionWithUpdateCheck().then(() => process.exit(0));
} else {
  // Parse arguments and execute
  cli.parse();

  // Show help if no arguments provided
  if (!args.length) {
    cli.outputHelp();
  }
}
