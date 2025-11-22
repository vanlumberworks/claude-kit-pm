/**
 * Interactive prompts for PM Kit CLI
 * Uses @clack/prompts for beautiful CLI interactions
 */

const clack = require('@clack/prompts');
const pc = require('picocolors');
const constants = require('../constants');

/**
 * Show intro banner
 */
function intro(message) {
  clack.intro(pc.bgCyan(pc.black(` ${message} `)));
}

/**
 * Show outro message
 */
function outro(message) {
  clack.outro(message);
}

/**
 * Prompt for API keys
 */
async function promptForAPIKeys() {
  clack.note(
    `Configure optional API keys for enhanced functionality.\n` +
    `You can skip this step and configure later with: ${pc.cyan('pm-kit config')}`,
    'API Configuration'
  );

  console.log();
  console.log(pc.cyan('Gemini API') + pc.gray(' (Optional)'));
  console.log(pc.gray('   Used for: Multi-modal analysis and enhanced AI capabilities'));
  console.log(pc.gray('   Get key at:'), pc.cyan(constants.API_KEY_URLS.gemini));
  console.log();

  const geminiKey = await clack.password({
    message: 'Gemini API Key (press Enter to skip):',
  });

  if (clack.isCancel(geminiKey)) {
    handleCancel();
  }

  return {
    geminiKey: geminiKey || null
  };
}

/**
 * Confirm action
 */
async function confirmAction(message, initial = false) {
  const result = await clack.confirm({
    message,
    initialValue: initial
  });

  if (clack.isCancel(result)) {
    handleCancel();
  }

  return result;
}

/**
 * Select from options
 */
async function selectOption(message, choices) {
  const options = choices.map(choice => ({
    value: choice.value,
    label: choice.title || choice.label || choice.value,
    hint: choice.description || choice.hint
  }));

  const result = await clack.select({
    message,
    options
  });

  if (clack.isCancel(result)) {
    handleCancel();
  }

  return result;
}

/**
 * Multi-select from options
 */
async function multiSelect(message, choices, required = false) {
  const options = choices.map(choice => ({
    value: choice.value,
    label: choice.title || choice.label || choice.value,
    hint: choice.description || choice.hint,
    selected: choice.selected || false
  }));

  const result = await clack.multiselect({
    message,
    options,
    required
  });

  if (clack.isCancel(result)) {
    handleCancel();
  }

  return result;
}

/**
 * Text input
 */
async function textInput(message, options = {}) {
  const result = await clack.text({
    message,
    placeholder: options.placeholder || '',
    initialValue: options.initial || '',
    validate: options.validate
  });

  if (clack.isCancel(result)) {
    handleCancel();
  }

  return result;
}

/**
 * Password input
 */
async function passwordInput(message, options = {}) {
  const result = await clack.password({
    message,
    mask: options.mask || '*',
    validate: options.validate
  });

  if (clack.isCancel(result)) {
    handleCancel();
  }

  return result;
}

/**
 * Start a spinner
 */
function spinner() {
  return clack.spinner();
}

/**
 * Group of prompts
 */
async function group(prompts, options = {}) {
  const result = await clack.group(prompts, {
    onCancel: options.onCancel || handleCancel
  });

  return result;
}

/**
 * Show a note/message box
 */
function note(message, title) {
  clack.note(message, title);
}

/**
 * Show a log message
 */
function log(message) {
  clack.log.message(message);
}

/**
 * Show info message
 */
function logInfo(message) {
  clack.log.info(message);
}

/**
 * Show success message
 */
function logSuccess(message) {
  clack.log.success(message);
}

/**
 * Show warning message
 */
function logWarn(message) {
  clack.log.warn(message);
}

/**
 * Show error message
 */
function logError(message) {
  clack.log.error(message);
}

/**
 * Show step message
 */
function logStep(message) {
  clack.log.step(message);
}

/**
 * Handle Ctrl+C gracefully
 */
function handleCancel() {
  clack.cancel('Operation cancelled.');
  process.exit(0);
}

/**
 * Ask for GitHub token
 */
async function promptForGitHubToken() {
  note(
    `A GitHub token is needed to download framework files.\n` +
    `Create one at: ${pc.cyan('https://github.com/settings/tokens')}\n` +
    `Required scope: ${pc.yellow('repo')} (for private repos) or none (for public)`,
    'GitHub Authentication'
  );

  const token = await passwordInput('Enter your GitHub token:', {
    validate: (value) => {
      if (!value) return 'Token is required';
      if (!value.startsWith('ghp_') && !value.startsWith('github_pat_') && !value.startsWith('gho_')) {
        return 'Invalid token format. Should start with ghp_, github_pat_, or gho_';
      }
    }
  });

  return token;
}

/**
 * Prompt for installation options
 */
async function promptForInstallOptions() {
  const installType = await selectOption('Choose installation type:', [
    { value: 'full', label: 'Full', hint: 'All workflows, agents, and commands' },
    { value: 'minimal', label: 'Minimal', hint: 'Core workflows only' },
    { value: 'custom', label: 'Custom', hint: 'Select specific components' }
  ]);

  return { installType };
}

/**
 * Prompt for update confirmation with changes preview
 */
async function promptForUpdateConfirmation(changes) {
  if (changes.added.length > 0) {
    note(
      changes.added.map(f => pc.green(`+ ${f}`)).join('\n'),
      'New files'
    );
  }

  if (changes.modified.length > 0) {
    note(
      changes.modified.map(f => pc.yellow(`~ ${f}`)).join('\n'),
      'Modified files'
    );
  }

  if (changes.deleted.length > 0) {
    note(
      changes.deleted.map(f => pc.red(`- ${f}`)).join('\n'),
      'Deleted files'
    );
  }

  return confirmAction('Proceed with update?', true);
}

module.exports = {
  // UI helpers
  intro,
  outro,
  note,
  spinner,
  handleCancel,

  // Logging
  log,
  logInfo,
  logSuccess,
  logWarn,
  logError,
  logStep,

  // Prompts
  confirmAction,
  selectOption,
  multiSelect,
  textInput,
  passwordInput,
  group,

  // Specialized prompts
  promptForAPIKeys,
  promptForGitHubToken,
  promptForInstallOptions,
  promptForUpdateConfirmation,

  // Re-export clack for advanced usage
  clack
};
