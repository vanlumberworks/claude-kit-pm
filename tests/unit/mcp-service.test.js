/**
 * Unit tests for mcp-service
 */

const fs = require('fs');
const path = require('path');
const mcpService = require('../../lib/services/mcp-service');
const constants = require('../../lib/constants');
const { TEST_DIR, createTempDir } = require('../setup');

describe('MCPService', () => {
  let testDir;
  let configPath;

  beforeEach(() => {
    testDir = createTempDir('mcp-service-test');
    configPath = path.join(testDir, '.mcp.json');
    process.chdir(testDir);
  });

  describe('generateConfig', () => {
    test('should generate valid config with all API keys', () => {
      const apiKeys = {
        braveKey: 'brave_test_key',
        perplexityKey: 'perplexity_test_key',
        geminiKey: 'gemini_test_key'
      };

      const config = mcpService.generateConfig(apiKeys);

      expect(config).toHaveProperty('mcpServers');
      expect(config.mcpServers).toHaveProperty('brave-search');
      expect(config.mcpServers).toHaveProperty('perplexity');
      expect(config.mcpServers).toHaveProperty('gemini');
    });

    test('should include correct command and args', () => {
      const apiKeys = {
        braveKey: 'brave_test_key'
      };

      const config = mcpService.generateConfig(apiKeys);

      expect(config.mcpServers['brave-search'].command).toBe('npx');
      expect(config.mcpServers['brave-search'].args).toContain('-y');
    });

    test('should set environment variables correctly', () => {
      const apiKeys = {
        braveKey: 'brave_test_key',
        perplexityKey: 'perplexity_test_key'
      };

      const config = mcpService.generateConfig(apiKeys);

      expect(config.mcpServers['brave-search'].env.BRAVE_API_KEY).toBe('brave_test_key');
      expect(config.mcpServers['perplexity'].env.PERPLEXITY_API_KEY).toBe('perplexity_test_key');
    });

    test('should throw error if required key is missing', () => {
      const apiKeys = {
        // Missing braveKey (required)
        perplexityKey: 'perplexity_test_key'
      };

      expect(() => mcpService.generateConfig(apiKeys)).toThrow();
    });

    test('should disable optional servers if key not provided', () => {
      const apiKeys = {
        braveKey: 'brave_test_key'
        // perplexity and gemini not provided
      };

      const config = mcpService.generateConfig(apiKeys);

      expect(config.mcpServers['perplexity']).toHaveProperty('disabled', true);
      expect(config.mcpServers['gemini']).toHaveProperty('disabled', true);
    });
  });

  describe('writeConfig', () => {
    test('should write config to file', () => {
      const config = {
        mcpServers: {
          'brave-search': {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-brave-search'],
            env: { BRAVE_API_KEY: 'test_key' }
          }
        }
      };

      mcpService.writeConfig(config, configPath);

      expect(fs.existsSync(configPath)).toBe(true);
    });

    test('should write valid JSON', () => {
      const config = {
        mcpServers: {
          'brave-search': {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-brave-search'],
            env: { BRAVE_API_KEY: 'test_key' }
          }
        }
      };

      mcpService.writeConfig(config, configPath);

      const content = fs.readFileSync(configPath, 'utf8');
      const parsed = JSON.parse(content);

      expect(parsed).toEqual(config);
    });

    test('should format JSON with indentation', () => {
      const config = {
        mcpServers: {
          'brave-search': {
            command: 'npx',
            args: ['-y'],
            env: { BRAVE_API_KEY: 'test' }
          }
        }
      };

      mcpService.writeConfig(config, configPath);

      const content = fs.readFileSync(configPath, 'utf8');
      expect(content).toContain('\n  ');
    });
  });

  describe('readConfig', () => {
    test('should read config from file', () => {
      const config = {
        mcpServers: {
          'brave-search': {
            command: 'npx',
            args: ['-y'],
            env: { BRAVE_API_KEY: 'test_key' }
          }
        }
      };

      fs.writeFileSync(configPath, JSON.stringify(config));

      const result = mcpService.readConfig(configPath);

      expect(result).toEqual(config);
    });

    test('should return null if file does not exist', () => {
      const result = mcpService.readConfig(configPath);

      expect(result).toBeNull();
    });

    test('should throw error for invalid JSON', () => {
      fs.writeFileSync(configPath, 'invalid json');

      expect(() => mcpService.readConfig(configPath)).toThrow();
    });
  });

  describe('validateConfig', () => {
    test('should return true for valid config', () => {
      const config = {
        mcpServers: {
          'brave-search': {
            command: 'npx',
            args: ['-y'],
            env: { BRAVE_API_KEY: 'test' }
          }
        }
      };

      expect(mcpService.validateConfig(config)).toBe(true);
    });

    test('should return false for missing mcpServers', () => {
      const config = {};

      expect(mcpService.validateConfig(config)).toBe(false);
    });

    test('should return false for invalid mcpServers', () => {
      const config = {
        mcpServers: 'invalid'
      };

      expect(mcpService.validateConfig(config)).toBe(false);
    });

    test('should return false for missing command', () => {
      const config = {
        mcpServers: {
          'brave-search': {
            args: ['-y'],
            env: { BRAVE_API_KEY: 'test' }
          }
        }
      };

      expect(mcpService.validateConfig(config)).toBe(false);
    });

    test('should return false for missing args', () => {
      const config = {
        mcpServers: {
          'brave-search': {
            command: 'npx',
            env: { BRAVE_API_KEY: 'test' }
          }
        }
      };

      expect(mcpService.validateConfig(config)).toBe(false);
    });

    test('should return false for missing env', () => {
      const config = {
        mcpServers: {
          'brave-search': {
            command: 'npx',
            args: ['-y']
          }
        }
      };

      expect(mcpService.validateConfig(config)).toBe(false);
    });
  });

  describe('updateAPIKey', () => {
    beforeEach(() => {
      const config = {
        mcpServers: {
          'brave-search': {
            command: 'npx',
            args: ['-y'],
            env: { BRAVE_API_KEY: 'old_key' },
            disabled: false
          }
        }
      };

      fs.writeFileSync(configPath, JSON.stringify(config));
    });

    test('should update API key', () => {
      mcpService.updateAPIKey('brave-search', 'new_key', configPath);

      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      expect(config.mcpServers['brave-search'].env.BRAVE_API_KEY).toBe('new_key');
    });

    test('should enable disabled server when updating key', () => {
      const config = {
        mcpServers: {
          'brave-search': {
            command: 'npx',
            args: ['-y'],
            env: { BRAVE_API_KEY: '' },
            disabled: true
          }
        }
      };

      fs.writeFileSync(configPath, JSON.stringify(config));

      mcpService.updateAPIKey('brave-search', 'new_key', configPath);

      const updatedConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      expect(updatedConfig.mcpServers['brave-search'].disabled).toBeUndefined();
    });

    test('should throw error if config file not found', () => {
      fs.unlinkSync(configPath);

      expect(() => mcpService.updateAPIKey('brave-search', 'new_key', configPath)).toThrow();
    });

    test('should throw error for unknown server', () => {
      expect(() => mcpService.updateAPIKey('unknown-server', 'new_key', configPath)).toThrow();
    });
  });

  describe('testServer', () => {
    test('should return success for configured server with API key', async () => {
      const config = {
        mcpServers: {
          'brave-search': {
            command: 'npx',
            args: ['-y'],
            env: { BRAVE_API_KEY: 'test_key' },
            disabled: false
          }
        }
      };

      fs.writeFileSync(configPath, JSON.stringify(config));

      const result = await mcpService.testServer('brave-search');

      expect(result.success).toBe(true);
    });

    test('should return failure for disabled server', async () => {
      const config = {
        mcpServers: {
          'brave-search': {
            command: 'npx',
            args: ['-y'],
            env: { BRAVE_API_KEY: 'test_key' },
            disabled: true
          }
        }
      };

      fs.writeFileSync(configPath, JSON.stringify(config));

      const result = await mcpService.testServer('brave-search');

      expect(result.success).toBe(false);
      expect(result.message).toContain('disabled');
    });

    test('should return failure for missing API key', async () => {
      const config = {
        mcpServers: {
          'brave-search': {
            command: 'npx',
            args: ['-y'],
            env: { BRAVE_API_KEY: '' },
            disabled: false
          }
        }
      };

      fs.writeFileSync(configPath, JSON.stringify(config));

      const result = await mcpService.testServer('brave-search');

      expect(result.success).toBe(false);
      expect(result.message).toContain('not set');
    });

    test('should return failure for non-configured server', async () => {
      fs.writeFileSync(configPath, JSON.stringify({ mcpServers: {} }));

      const result = await mcpService.testServer('brave-search');

      expect(result.success).toBe(false);
      expect(result.message).toContain('not configured');
    });
  });
});
