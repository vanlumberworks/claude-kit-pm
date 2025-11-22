/**
 * Interactive prompts for PM Kit CLI
 */

const prompts = require('prompts');
const chalk = require('chalk');
const { PMKitError, ErrorCodes } = require('./error-handler');
const constants = require('../constants');

/**
 * Prompt for API keys
 */
async function promptForAPIKeys() {
  console.log();
  console.log(chalk.bold('API Configuration'));
  console.log(chalk.gray('Configure optional API keys for enhanced functionality'));
  console.log(chalk.gray('You can skip this step and configure later with: pm-kit config'));
  console.log();

  // Gemini (optional)
  console.log(chalk.cyan('Gemini API') + chalk.gray(' (Optional)'));
  console.log(chalk.gray('   Used for: Multi-modal analysis and enhanced AI capabilities'));
  console.log(chalk.gray('   Get key at:'), chalk.cyan(constants.API_KEY_URLS.gemini));
  console.log();

  const { geminiKey } = await prompts({
    type: 'password',
    name: 'geminiKey',
    message: 'Gemini API Key (press Enter to skip):'
  });

  return {
    geminiKey: geminiKey || null
  };
}

/**
 * Confirm action
 */
async function confirmAction(message, initial = false) {
  const { confirmed } = await prompts({
    type: 'confirm',
    name: 'confirmed',
    message,
    initial
  });

  return confirmed;
}

/**
 * Select from options
 */
async function selectOption(message, choices) {
  const { selected } = await prompts({
    type: 'select',
    name: 'selected',
    message,
    choices
  });

  return selected;
}

/**
 * Text input
 */
async function textInput(message, initial = '', validate = null) {
  const { value } = await prompts({
    type: 'text',
    name: 'value',
    message,
    initial,
    validate
  });

  return value;
}

/**
 * Handle Ctrl+C gracefully
 */
prompts.override({
  onCancel: () => {
    console.log();
    console.log(chalk.yellow('Operation cancelled by user'));
    process.exit(0);
  }
});

module.exports = {
  promptForAPIKeys,
  confirmAction,
  selectOption,
  textInput
};
