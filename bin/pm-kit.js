#!/usr/bin/env node

/**
 * ClaudeKit PM CLI
 * CLI installer and manager for Product Management framework
 */

const { program } = require('commander');
const chalk = require('chalk');
const packageJson = require('../package.json');
const { handleError } = require('../lib/utils/error-handler');

// Import commands
const initCommand = require('../lib/commands/init');
const updateCommand = require('../lib/commands/update');
const doctorCommand = require('../lib/commands/doctor');
const configCommand = require('../lib/commands/config');

// Configure CLI
program
  .name('pm-kit')
  .description('ClaudeKit PM - Product Management Framework CLI')
  .version(packageJson.version, '-v, --version', 'Display version number')
  .helpOption('-h, --help', 'Display help information');

// Init command
program
  .command('init')
  .description('Initialize PM Kit in current directory')
  .option('--reset-token', 'Reset GitHub authentication token')
  .option('--reconfigure-api', 'Reconfigure API keys only')
  .option('--minimal', 'Install minimal set of workflows')
  .option('--full', 'Install all workflows (default)', true)
  .option('--exclude <patterns...>', 'Exclude specific files/directories')
  .option('--global, -g', 'Use platform-specific user configuration')
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

// Custom help
program.addHelpText('after', `

Examples:
  $ pm-kit init                          Initialize PM Kit
  $ pm-kit init --minimal                Install minimal workflows
  $ pm-kit update                        Update to latest version
  $ pm-kit update --dry-run              Preview updates
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
