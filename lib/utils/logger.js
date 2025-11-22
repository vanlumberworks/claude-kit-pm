/**
 * Logger utility for consistent console output
 * Uses picocolors for terminal styling and cli-progress for progress bars
 */

const pc = require('picocolors');
const cliProgress = require('cli-progress');

class Logger {
  constructor() {
    this.spinnerInterval = null;
    this.spinnerText = '';
    this.progressBar = null;
    this.spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    this.spinnerIndex = 0;
  }

  /**
   * Log success message
   */
  success(message) {
    console.log(pc.green('✔'), message);
  }

  /**
   * Log error message
   */
  error(message) {
    console.error(pc.red('✖'), message);
  }

  /**
   * Log warning message
   */
  warn(message) {
    console.warn(pc.yellow('⚠'), message);
  }

  /**
   * Log info message
   */
  info(message) {
    console.log(pc.blue('ℹ'), message);
  }

  /**
   * Log debug message (only if DEBUG env var is set)
   */
  debug(message) {
    if (process.env.DEBUG) {
      console.log(pc.gray('🐛'), pc.gray(message));
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
   * Start spinner (simple implementation without ora)
   */
  startSpinner(text) {
    this.stopSpinner(); // Stop any existing spinner
    this.spinnerText = text;
    this.spinnerIndex = 0;

    // Hide cursor
    process.stdout.write('\x1B[?25l');

    this.spinnerInterval = setInterval(() => {
      const frame = this.spinnerFrames[this.spinnerIndex];
      process.stdout.write(`\r${pc.blue(frame)} ${this.spinnerText}`);
      this.spinnerIndex = (this.spinnerIndex + 1) % this.spinnerFrames.length;
    }, 80);

    return this;
  }

  /**
   * Update spinner text
   */
  updateSpinner(text) {
    this.spinnerText = text;
  }

  /**
   * Stop spinner with success
   */
  succeedSpinner(text) {
    this.clearSpinner();
    console.log(`${pc.green('✔')} ${text || this.spinnerText}`);
  }

  /**
   * Stop spinner with failure
   */
  failSpinner(text) {
    this.clearSpinner();
    console.log(`${pc.red('✖')} ${text || this.spinnerText}`);
  }

  /**
   * Stop spinner with warning
   */
  warnSpinner(text) {
    this.clearSpinner();
    console.log(`${pc.yellow('⚠')} ${text || this.spinnerText}`);
  }

  /**
   * Stop spinner with info
   */
  infoSpinner(text) {
    this.clearSpinner();
    console.log(`${pc.blue('ℹ')} ${text || this.spinnerText}`);
  }

  /**
   * Clear spinner (internal)
   */
  clearSpinner() {
    if (this.spinnerInterval) {
      clearInterval(this.spinnerInterval);
      this.spinnerInterval = null;
      // Clear line and show cursor
      process.stdout.write('\r\x1B[K');
      process.stdout.write('\x1B[?25h');
    }
  }

  /**
   * Stop spinner
   */
  stopSpinner() {
    this.clearSpinner();
  }

  /**
   * Print section header
   */
  header(text) {
    console.log();
    console.log(pc.bold(pc.cyan(text)));
    console.log(pc.gray('─'.repeat(text.length)));
  }

  /**
   * Print box with message (simple implementation)
   */
  box(message, options = {}) {
    const lines = message.split('\n');
    const maxLength = Math.max(...lines.map(l => l.length));
    const padding = options.padding || 1;
    const width = maxLength + (padding * 2) + 2;

    const colorFn = options.borderColor === 'green' ? pc.green :
                    options.borderColor === 'red' ? pc.red :
                    options.borderColor === 'yellow' ? pc.yellow :
                    pc.cyan;

    console.log();
    console.log(colorFn('┌' + '─'.repeat(width - 2) + '┐'));

    // Top padding
    for (let i = 0; i < padding; i++) {
      console.log(colorFn('│') + ' '.repeat(width - 2) + colorFn('│'));
    }

    // Content
    for (const line of lines) {
      const paddedLine = ' '.repeat(padding) + line + ' '.repeat(maxLength - line.length + padding);
      console.log(colorFn('│') + paddedLine + colorFn('│'));
    }

    // Bottom padding
    for (let i = 0; i < padding; i++) {
      console.log(colorFn('│') + ' '.repeat(width - 2) + colorFn('│'));
    }

    console.log(colorFn('└' + '─'.repeat(width - 2) + '┘'));
    console.log();
  }

  /**
   * Print list
   */
  list(items, options = {}) {
    const prefix = options.prefix || '  -';
    const colorFn = options.color === 'green' ? pc.green :
                    options.color === 'red' ? pc.red :
                    options.color === 'yellow' ? pc.yellow :
                    options.color === 'cyan' ? pc.cyan :
                    options.color === 'gray' ? pc.gray :
                    (x) => x;

    items.forEach(item => {
      console.log(colorFn(`${prefix} ${item}`));
    });
  }

  /**
   * Print table
   */
  table(data) {
    const maxKeyLength = Math.max(...Object.keys(data).map(k => k.length));

    Object.entries(data).forEach(([key, value]) => {
      const paddedKey = key.padEnd(maxKeyLength);
      console.log(`  ${pc.gray(paddedKey)} ${value}`);
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
      pc.blue('█'.repeat(filled)) +
      pc.gray('░'.repeat(empty))
    );
  }

  /**
   * Print key-value pair
   */
  keyValue(key, value, options = {}) {
    const keyColorFn = options.keyColor === 'blue' ? pc.blue :
                       options.keyColor === 'cyan' ? pc.cyan :
                       pc.gray;
    const valueColorFn = options.valueColor === 'green' ? pc.green :
                         options.valueColor === 'cyan' ? pc.cyan :
                         (x) => x;
    const separator = options.separator || ':';

    console.log(
      keyColorFn(key) +
      pc.gray(separator) +
      ' ' +
      valueColorFn(value)
    );
  }

  /**
   * Print multiline message with indent
   */
  indent(message, spaces = 2) {
    const indentStr = ' '.repeat(spaces);
    const lines = message.split('\n');
    lines.forEach(line => console.log(indentStr + line));
  }

  /**
   * Print diagnostic check result
   */
  checkResult(name, passed, message = '') {
    const icon = passed ? pc.green('✔') : pc.red('✖');
    const status = passed ? pc.green('OK') : pc.red('FAILED');
    console.log(`${icon}  ${name}: ${status}${message ? ' - ' + pc.gray(message) : ''}`);
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
    const icon = success ? pc.green('✔') : pc.red('✖');

    console.log(`${icon}  ${verb}: ${pc.cyan(filePath)}`);
  }

  /**
   * Print summary
   */
  summary(title, items) {
    console.log();
    console.log(pc.bold(title));
    console.log();

    Object.entries(items).forEach(([key, value]) => {
      console.log(`  ${pc.gray(key + ':')} ${value}`);
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
      pc.cyan('{bar}') + ' {percentage}% | {value}/{total} files | {filename}';

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

  /**
   * Print step with number
   */
  step(number, total, message) {
    console.log(pc.gray(`[${number}/${total}]`) + ` ${message}`);
  }

  /**
   * Print dimmed text
   */
  dim(message) {
    console.log(pc.dim(message));
  }

  /**
   * Print link
   */
  link(text, url) {
    console.log(`${text}: ${pc.cyan(url)}`);
  }
}

// Export singleton instance
module.exports = new Logger();
