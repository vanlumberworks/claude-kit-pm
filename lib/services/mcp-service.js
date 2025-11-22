/**
 * MCP Service - Manage MCP server configuration
 */

const fs = require('fs');
const { PMKitError, ErrorCodes } = require('../utils/error-handler');
const constants = require('../constants');
const logger = require('../utils/logger');

class MCPService {
  /**
   * Generate .mcp.json configuration
   */
  generateConfig(apiKeys = {}) {
    const config = {
      mcpServers: {}
    };

    // Ensure apiKeys is an object
    const keys = apiKeys || {};

    // Add servers based on provided API keys
    Object.entries(constants.MCP_SERVERS).forEach(([serverName, serverConfig]) => {
      const apiKey = keys[serverConfig.apiKeyName];

      if (serverConfig.required && !apiKey) {
        throw new PMKitError(
          `Required API key missing: ${serverConfig.apiKeyName}`,
          ErrorCodes.API_KEY_INVALID,
          {
            server: serverName,
            description: serverConfig.description
          }
        );
      }

      if (apiKey) {
        config.mcpServers[serverName] = {
          command: serverConfig.command,
          args: serverConfig.args,
          env: {
            [serverConfig.envVar]: apiKey
          }
        };
      } else if (!serverConfig.required) {
        // Add disabled optional server
        config.mcpServers[serverName] = {
          command: serverConfig.command,
          args: serverConfig.args,
          env: {
            [serverConfig.envVar]: ''
          },
          disabled: true
        };
      }
    });

    return config;
  }

  /**
   * Write .mcp.json file
   */
  writeConfig(config, filePath = constants.MCP_CONFIG_FILE) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
      logger.fileOperation('create', filePath);
    } catch (error) {
      throw new PMKitError(
        'Failed to write .mcp.json',
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Read .mcp.json file
   */
  readConfig(filePath = constants.MCP_CONFIG_FILE) {
    try {
      if (!fs.existsSync(filePath)) {
        return null;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      throw new PMKitError(
        'Failed to read .mcp.json',
        ErrorCodes.CONFIG_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Validate .mcp.json structure
   */
  validateConfig(config) {
    if (!config || typeof config !== 'object') {
      return false;
    }

    if (!config.mcpServers || typeof config.mcpServers !== 'object') {
      return false;
    }

    // Check each server configuration
    for (const [serverName, serverConfig] of Object.entries(config.mcpServers)) {
      if (!serverConfig.command || !Array.isArray(serverConfig.args)) {
        return false;
      }

      if (!serverConfig.env || typeof serverConfig.env !== 'object') {
        return false;
      }
    }

    return true;
  }

  /**
   * Update API key for specific server
   */
  updateAPIKey(serverName, apiKey, filePath = constants.MCP_CONFIG_FILE) {
    const config = this.readConfig(filePath);

    if (!config) {
      throw new PMKitError(
        '.mcp.json not found',
        ErrorCodes.NOT_INITIALIZED,
        {
          help: 'Run pm-kit init first'
        }
      );
    }

    if (!config.mcpServers[serverName]) {
      throw new PMKitError(
        `Server not found in configuration: ${serverName}`,
        ErrorCodes.CONFIG_ERROR
      );
    }

    // Get server config
    const serverConfig = constants.MCP_SERVERS[serverName];
    if (!serverConfig) {
      throw new PMKitError(
        `Unknown server: ${serverName}`,
        ErrorCodes.CONFIG_ERROR
      );
    }

    // Update API key
    config.mcpServers[serverName].env[serverConfig.envVar] = apiKey;

    // Enable server if it was disabled
    if (config.mcpServers[serverName].disabled) {
      delete config.mcpServers[serverName].disabled;
    }

    // Write updated config
    this.writeConfig(config, filePath);

    logger.success(`Updated API key for ${serverName}`);
  }

  /**
   * Enable server
   */
  enableServer(serverName, filePath = constants.MCP_CONFIG_FILE) {
    const config = this.readConfig(filePath);

    if (!config || !config.mcpServers[serverName]) {
      throw new PMKitError(
        `Server not found: ${serverName}`,
        ErrorCodes.CONFIG_ERROR
      );
    }

    delete config.mcpServers[serverName].disabled;
    this.writeConfig(config, filePath);

    logger.success(`Enabled ${serverName}`);
  }

  /**
   * Disable server
   */
  disableServer(serverName, filePath = constants.MCP_CONFIG_FILE) {
    const config = this.readConfig(filePath);

    if (!config || !config.mcpServers[serverName]) {
      throw new PMKitError(
        `Server not found: ${serverName}`,
        ErrorCodes.CONFIG_ERROR
      );
    }

    config.mcpServers[serverName].disabled = true;
    this.writeConfig(config, filePath);

    logger.success(`Disabled ${serverName}`);
  }

  /**
   * Get enabled servers
   */
  getEnabledServers(filePath = constants.MCP_CONFIG_FILE) {
    const config = this.readConfig(filePath);

    if (!config) {
      return [];
    }

    return Object.entries(config.mcpServers)
      .filter(([_, serverConfig]) => !serverConfig.disabled)
      .map(([serverName, _]) => serverName);
  }

  /**
   * Test server configuration (check if API key works)
   */
  async testServer(serverName) {
    // This would require actually testing the MCP server
    // For now, just check if it's configured
    const config = this.readConfig();

    if (!config || !config.mcpServers[serverName]) {
      return {
        success: false,
        message: 'Server not configured'
      };
    }

    if (config.mcpServers[serverName].disabled) {
      return {
        success: false,
        message: 'Server is disabled'
      };
    }

    const serverConfig = constants.MCP_SERVERS[serverName];
    const envVar = serverConfig.envVar;
    const apiKey = config.mcpServers[serverName].env[envVar];

    if (!apiKey || apiKey.length === 0) {
      return {
        success: false,
        message: 'API key not set'
      };
    }

    return {
      success: true,
      message: 'Server configured'
    };
  }
}

module.exports = new MCPService();
