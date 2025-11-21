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
  console.log(chalk.gray('Configure API keys for PM Kit functionality'));
  console.log();

  // Brave Search (required)
  console.log(chalk.cyan('1. Brave Search API') + chalk.red(' (Required)'));
  console.log(chalk.gray('   Used for: /research, /market commands'));
  console.log(chalk.gray('   Get key at:'), chalk.cyan(constants.API_KEY_URLS.brave));
  console.log();

  const { braveKey } = await prompts({
    type: 'password',
    name: 'braveKey',
    message: 'Brave Search API Key:',
    validate: value => value.length > 0 || 'Brave Search API key is required'
  });

  if (!braveKey) {
    throw new PMKitError(
      'Brave Search API key is required to continue',
      ErrorCodes.API_KEY_INVALID,
      {
        help: `Get your API key at: ${constants.API_KEY_URLS.brave}`
      }
    );
  }

  console.log();

  // Perplexity (optional)
  console.log(chalk.cyan('2. Perplexity API') + chalk.gray(' (Optional)'));
  console.log(chalk.gray('   Used for: Enhanced research synthesis'));
  console.log(chalk.gray('   Get key at:'), chalk.cyan(constants.API_KEY_URLS.perplexity));
  console.log();

  const { perplexityKey } = await prompts({
    type: 'password',
    name: 'perplexityKey',
    message: 'Perplexity API Key (press Enter to skip):'
  });

  console.log();

  // Gemini (optional)
  console.log(chalk.cyan('3. Gemini API') + chalk.gray(' (Optional)'));
  console.log(chalk.gray('   Used for: Multi-modal analysis'));
  console.log(chalk.gray('   Get key at:'), chalk.cyan(constants.API_KEY_URLS.gemini));
  console.log();

  const { geminiKey } = await prompts({
    type: 'password',
    name: 'geminiKey',
    message: 'Gemini API Key (press Enter to skip):'
  });

  return {
    braveKey,
    perplexityKey: perplexityKey || null,
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
