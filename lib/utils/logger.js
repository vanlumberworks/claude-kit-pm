/**
 * Logger utility for consistent console output
 */

const chalk = require('chalk');
const ora = require('ora');
const cliProgress = require('cli-progress');

class Logger {
  constructor() {
    this.spinner = null;
    this.progressBar = null;
  }

  /**
   * Log success message
   */
  success(message) {
    console.log(chalk.green('✔'), message);
  }

  /**
   * Log error message
   */
  error(message) {
    console.error(chalk.red('✖'), message);
  }

  /**
   * Log warning message
   */
  warn(message) {
    console.warn(chalk.yellow('⚠'), message);
  }

  /**
   * Log info message
   */
  info(message) {
    console.log(chalk.blue('ℹ'), message);
  }

  /**
   * Log debug message (only if DEBUG env var is set)
   */
  debug(message) {
    if (process.env.DEBUG) {
      console.log(chalk.gray('🐛'), chalk.gray(message));
    }
  }

  /**
   * Log plain message
   */
  log(message) {
    console.log(message);
  }

  /**
   * Log empty line
   */
  newline() {
    console.log();
  }

  /**
   * Start spinner
   */
  startSpinner(text) {
    this.spinner = ora({
      text,
      color: 'blue',
      spinner: 'dots'
    }).start();
    return this.spinner;
  }

  /**
   * Update spinner text
   */
  updateSpinner(text) {
    if (this.spinner) {
      this.spinner.text = text;
    }
  }

  /**
   * Stop spinner with success
   */
  succeedSpinner(text) {
    if (this.spinner) {
      this.spinner.succeed(text);
      this.spinner = null;
    }
  }

  /**
   * Stop spinner with failure
   */
  failSpinner(text) {
    if (this.spinner) {
      this.spinner.fail(text);
      this.spinner = null;
    }
  }

  /**
   * Stop spinner with warning
   */
  warnSpinner(text) {
    if (this.spinner) {
      this.spinner.warn(text);
      this.spinner = null;
    }
  }

  /**
   * Stop spinner with info
   */
  infoSpinner(text) {
    if (this.spinner) {
      this.spinner.info(text);
      this.spinner = null;
    }
  }

  /**
   * Stop spinner
   */
  stopSpinner() {
    if (this.spinner) {
      this.spinner.stop();
      this.spinner = null;
    }
  }

  /**
   * Print section header
   */
  header(text) {
    console.log();
    console.log(chalk.bold.cyan(text));
    console.log(chalk.gray('─'.repeat(text.length)));
  }

  /**
   * Print box with message
   */
  box(message, options = {}) {
    const boxen = require('boxen');
    console.log(boxen(message, {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: options.color || 'cyan',
      ...options
    }));
  }

  /**
   * Print list
   */
  list(items, options = {}) {
    const prefix = options.prefix || '  -';
    const color = options.color || 'white';

    items.forEach(item => {
      console.log(chalk[color](`${prefix} ${item}`));
    });
  }

  /**
   * Print table
   */
  table(data) {
    // Simple table implementation
    const maxKeyLength = Math.max(...Object.keys(data).map(k => k.length));

    Object.entries(data).forEach(([key, value]) => {
      const paddedKey = key.padEnd(maxKeyLength);
      console.log(`  ${chalk.gray(paddedKey)} ${value}`);
    });
  }

  /**
   * Print progress
   */
  progress(current, total, message) {
    const percentage = Math.round((current / total) * 100);
    const bar = this.createProgressBar(percentage);
    console.log(`${bar} ${percentage}% ${message}`);
  }

  /**
   * Create progress bar
   */
  createProgressBar(percentage) {
    const width = 20;
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;

    return (
      chalk.blue('█'.repeat(filled)) +
      chalk.gray('░'.repeat(empty))
    );
  }

  /**
   * Print key-value pair
   */
  keyValue(key, value, options = {}) {
    const keyColor = options.keyColor || 'gray';
    const valueColor = options.valueColor || 'white';
    const separator = options.separator || ':';

    console.log(
      chalk[keyColor](key) +
      chalk.gray(separator) +
      ' ' +
      chalk[valueColor](value)
    );
  }

  /**
   * Print multiline message with indent
   */
  indent(message, spaces = 2) {
    const indent = ' '.repeat(spaces);
    const lines = message.split('\n');
    lines.forEach(line => console.log(indent + line));
  }

  /**
   * Print diagnostic check result
   */
  checkResult(name, passed, message = '') {
    const icon = passed ? chalk.green('✔') : chalk.red('✖');
    const status = passed ? chalk.green('OK') : chalk.red('FAILED');
    console.log(`${icon}  ${name}: ${status}${message ? ' - ' + chalk.gray(message) : ''}`);
  }

  /**
   * Print file operation
   */
  fileOperation(operation, filePath, success = true) {
    const operations = {
      create: 'Created',
      update: 'Updated',
      delete: 'Deleted',
      download: 'Downloaded',
      copy: 'Copied'
    };

    const verb = operations[operation] || operation;
    const icon = success ? chalk.green('✔') : chalk.red('✖');

    console.log(`${icon}  ${verb}: ${chalk.cyan(filePath)}`);
  }

  /**
   * Print summary
   */
  summary(title, items) {
    console.log();
    console.log(chalk.bold(title));
    console.log();

    Object.entries(items).forEach(([key, value]) => {
      console.log(`  ${chalk.gray(key + ':')} ${value}`);
    });

    console.log();
  }

  /**
   * Clear console
   */
  clear() {
    console.clear();
  }

  /**
   * Start a progress bar for downloads
   */
  startProgressBar(total, options = {}) {
    // Stop any existing spinner first
    this.stopSpinner();

    const format = options.format ||
      chalk.cyan('{bar}') + ' {percentage}% | {value}/{total} files | {filename}';

    this.progressBar = new cliProgress.SingleBar({
      format,
      barCompleteChar: '█',
      barIncompleteChar: '░',
      hideCursor: true,
      clearOnComplete: false,
      stopOnComplete: true,
      forceRedraw: true
    }, cliProgress.Presets.shades_classic);

    this.progressBar.start(total, 0, { filename: 'Starting...' });
    return this.progressBar;
  }

  /**
   * Update progress bar
   */
  updateProgressBar(value, payload = {}) {
    if (this.progressBar) {
      this.progressBar.update(value, payload);
    }
  }

  /**
   * Increment progress bar
   */
  incrementProgressBar(payload = {}) {
    if (this.progressBar) {
      this.progressBar.increment(payload);
    }
  }

  /**
   * Stop progress bar
   */
  stopProgressBar() {
    if (this.progressBar) {
      this.progressBar.stop();
      this.progressBar = null;
    }
  }

  /**
   * Check if progress bar is active
   */
  hasProgressBar() {
    return this.progressBar !== null;
  }
}

// Export singleton instance
module.exports = new Logger();
