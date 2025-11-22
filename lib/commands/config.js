/**
 * Manage PM Kit configuration
 */

const fs = require('fs-extra');
const pc = require('picocolors');
const logger = require('../utils/logger');
const githubService = require('../services/github-service');
const mcpService = require('../services/mcp-service');
const { textInput } = require('../utils/prompts');
const { PMKitError, ErrorCodes } = require('../utils/error-handler');
const constants = require('../constants');

async function configCommand(action, key, value, options = {}) {
  const validActions = ['list', 'get', 'set', 'delete', 'reset'];

  if (!validActions.includes(action)) {
    throw new PMKitError(
      `Invalid action: ${action}`,
      ErrorCodes.VALIDATION_ERROR,
      { validActions: validActions.join(', ') }
    );
  }

  // Route to appropriate handler
  switch (action) {
    case 'list':
      await listConfig();
      break;

    case 'get':
      if (!key) {
        throw new PMKitError('Key is required for get action', ErrorCodes.VALIDATION_ERROR);
      }
      await getConfig(key);
      break;

    case 'set':
      if (!key) {
        throw new PMKitError('Key is required for set action', ErrorCodes.VALIDATION_ERROR);
      }
      if (!value) {
        // Prompt for value if not provided
        value = await textInput(`Enter value for ${key}:`, '');
      }
      await setConfig(key, value);
      break;

    case 'delete':
      if (!key) {
        throw new PMKitError('Key is required for delete action', ErrorCodes.VALIDATION_ERROR);
      }
      await deleteConfig(key);
      break;

    case 'reset':
      await resetConfig();
      break;
  }
}

/**
 * List all configuration
 */
async function listConfig() {
  logger.header('PM Kit Configuration');

  // Load global config
  const globalConfig = loadConfig(constants.GLOBAL_CONFIG_FILE);

  // Load local config (if exists)
  const localConfig = loadConfig(constants.LOCAL_CONFIG_FILE);

  // Display global config
  logger.log(pc.bold('Global Configuration') + pc.gray(` (${constants.GLOBAL_CONFIG_FILE})`));
  logger.newline();

  if (Object.keys(globalConfig).length === 0) {
    logger.log(pc.gray('  No global configuration found'));
  } else {
    displayConfig(globalConfig);
  }

  logger.newline();

  // Display local config
  logger.log(pc.bold('Local Configuration') + pc.gray(` (${constants.LOCAL_CONFIG_FILE})`));
  logger.newline();

  if (Object.keys(localConfig).length === 0) {
    logger.log(pc.gray('  No local configuration found'));
  } else {
    displayConfig(localConfig);
  }

  logger.newline();
}

/**
 * Get specific configuration value
 */
async function getConfig(key) {
  logger.header(`Get Configuration: ${key}`);

  // Try local config first
  let config = loadConfig(constants.LOCAL_CONFIG_FILE);
  let source = 'local';

  if (!(key in config)) {
    // Fall back to global config
    config = loadConfig(constants.GLOBAL_CONFIG_FILE);
    source = 'global';
  }

  if (key in config) {
    const value = config[key];
    const displayValue = key.toLowerCase().includes('token') || key.toLowerCase().includes('key')
      ? maskSensitiveValue(value)
      : value;

    logger.success(`${key} (${source}): ${displayValue}`);
  } else {
    logger.warn(`Configuration key not found: ${key}`);
  }

  logger.newline();
}

/**
 * Set configuration value
 */
async function setConfig(key, value) {
  logger.header(`Set Configuration: ${key}`);

  // Determine which config file to use
  const configFile = key.startsWith('global.')
    ? constants.GLOBAL_CONFIG_FILE
    : constants.LOCAL_CONFIG_FILE;

  // Remove 'global.' prefix if present
  const actualKey = key.replace(/^global\./, '');

  // Handle special keys
  if (actualKey === 'githubToken' || actualKey === 'github-token') {
    await githubService.saveToken(value);
    logger.success('GitHub token saved');
  } else if (actualKey.endsWith('ApiKey') || actualKey.endsWith('-api-key')) {
    // API key for MCP server
    const serverName = actualKey.replace(/[-_]?api[-_]?key$/i, '').toLowerCase();
    await mcpService.updateAPIKey(serverName, value);
    logger.success(`API key updated for ${serverName}`);
  } else {
    // Generic config value
    const config = loadConfig(configFile);
    config[actualKey] = value;
    config.lastUpdated = new Date().toISOString();
    saveConfig(configFile, config);

    const displayValue = actualKey.toLowerCase().includes('token') || actualKey.toLowerCase().includes('key')
      ? maskSensitiveValue(value)
      : value;

    logger.success(`Set ${actualKey} = ${displayValue}`);
  }

  logger.newline();
}

/**
 * Delete configuration value
 */
async function deleteConfig(key) {
  logger.header(`Delete Configuration: ${key}`);

  // Try local config first
  let config = loadConfig(constants.LOCAL_CONFIG_FILE);
  let configFile = constants.LOCAL_CONFIG_FILE;
  let found = key in config;

  if (!found) {
    // Try global config
    config = loadConfig(constants.GLOBAL_CONFIG_FILE);
    configFile = constants.GLOBAL_CONFIG_FILE;
    found = key in config;
  }

  if (found) {
    delete config[key];
    config.lastUpdated = new Date().toISOString();
    saveConfig(configFile, config);
    logger.success(`Deleted ${key}`);
  } else {
    logger.warn(`Configuration key not found: ${key}`);
  }

  logger.newline();
}

/**
 * Reset configuration to defaults
 */
async function resetConfig() {
  logger.header('Reset Configuration');

  const { confirmAction } = require('../utils/prompts');

  const confirmed = await confirmAction(
    'This will delete all configuration. Continue?',
    false
  );

  if (!confirmed) {
    logger.info('Reset cancelled');
    return;
  }

  // Delete global config
  if (fs.existsSync(constants.GLOBAL_CONFIG_FILE)) {
    fs.unlinkSync(constants.GLOBAL_CONFIG_FILE);
    logger.success('Deleted global configuration');
  }

  // Delete local config
  if (fs.existsSync(constants.LOCAL_CONFIG_FILE)) {
    fs.unlinkSync(constants.LOCAL_CONFIG_FILE);
    logger.success('Deleted local configuration');
  }

  logger.newline();
  logger.info('Configuration reset to defaults');
  logger.log('Run', pc.cyan('pm-kit init'), 'to set up again');
  logger.newline();
}

/**
 * Load configuration from file
 */
function loadConfig(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    logger.warn(`Failed to read config from ${filePath}: ${error.message}`);
    return {};
  }
}

/**
 * Save configuration to file
 */
function saveConfig(filePath, config) {
  try {
    // Ensure directory exists
    const dir = require('path').dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(config, null, 2));

    // Secure the file (Unix/Mac only)
    if (process.platform !== 'win32') {
      fs.chmodSync(filePath, 0o600); // rw-------
    }
  } catch (error) {
    throw new PMKitError(
      `Failed to save config to ${filePath}`,
      ErrorCodes.FS_ERROR,
      { error: error.message }
    );
  }
}

/**
 * Display configuration object
 */
function displayConfig(config) {
  const entries = Object.entries(config);

  if (entries.length === 0) {
    logger.log(pc.gray('  (empty)'));
    return;
  }

  for (const [key, value] of entries) {
    const displayValue = key.toLowerCase().includes('token') || key.toLowerCase().includes('key')
      ? maskSensitiveValue(value)
      : typeof value === 'object'
      ? JSON.stringify(value)
      : value;

    logger.keyValue(`  ${key}`, displayValue, { keyColor: 'cyan', valueColor: 'white' });
  }
}

/**
 * Mask sensitive values
 */
function maskSensitiveValue(value) {
  if (typeof value !== 'string' || value.length === 0) {
    return '(not set)';
  }

  if (value.length <= 8) {
    return '***';
  }

  const firstFour = value.substring(0, 4);
  const lastFour = value.substring(value.length - 4);
  const masked = '*'.repeat(Math.min(value.length - 8, 20));

  return `${firstFour}${masked}${lastFour}`;
}

module.exports = configCommand;
