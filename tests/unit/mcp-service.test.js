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
  let originalCwd;

  beforeEach(() => {
    originalCwd = process.cwd();
    testDir = createTempDir(`mcp-service-test-${Date.now()}`);
    configPath = path.join(testDir, '.mcp.json');
    process.chdir(testDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('generateConfig', () => {
    test('should generate valid config with Gemini API key', () => {
      const apiKeys = {
        geminiKey: 'gemini_test_key'
      };

      const config = mcpService.generateConfig(apiKeys);

      expect(config).toHaveProperty('mcpServers');
      expect(config.mcpServers).toHaveProperty('gemini');
      expect(config.mcpServers['gemini'].env.GEMINI_API_KEY).toBe('gemini_test_key');
    });

    test('should include correct command and args', () => {
      const apiKeys = {
        geminiKey: 'gemini_test_key'
      };

      const config = mcpService.generateConfig(apiKeys);

      expect(config.mcpServers['gemini'].command).toBe('npx');
      expect(config.mcpServers['gemini'].args).toContain('-y');
    });

    test('should set environment variables correctly', () => {
      const apiKeys = {
        geminiKey: 'gemini_test_key'
      };

      const config = mcpService.generateConfig(apiKeys);

      expect(config.mcpServers['gemini'].env.GEMINI_API_KEY).toBe('gemini_test_key');
    });

    test('should generate config with empty API keys (all optional)', () => {
      const apiKeys = {};

      const config = mcpService.generateConfig(apiKeys);

      expect(config).toHaveProperty('mcpServers');
      expect(config.mcpServers['gemini']).toHaveProperty('disabled', true);
    });

    test('should disable optional server if key not provided', () => {
      const apiKeys = {
        // gemini not provided
      };

      const config = mcpService.generateConfig(apiKeys);

      expect(config.mcpServers['gemini']).toHaveProperty('disabled', true);
      expect(config.mcpServers['gemini'].env.GEMINI_API_KEY).toBe('');
    });
  });

  describe('writeConfig', () => {
    test('should write config to file', () => {
      const config = {
        mcpServers: {
          'gemini': {
            command: 'npx',
            args: ['-y', '@anthropic-ai/claude-code-mcp-server-gemini'],
            env: { GEMINI_API_KEY: 'test_key' }
          }
        }
      };

      mcpService.writeConfig(config, configPath);

      expect(fs.existsSync(configPath)).toBe(true);
    });

    test('should write valid JSON', () => {
      const config = {
        mcpServers: {
          'gemini': {
            command: 'npx',
            args: ['-y', '@anthropic-ai/claude-code-mcp-server-gemini'],
            env: { GEMINI_API_KEY: 'test_key' }
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
          'gemini': {
            command: 'npx',
            args: ['-y'],
            env: { GEMINI_API_KEY: 'test' }
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
          'gemini': {
            command: 'npx',
            args: ['-y'],
            env: { GEMINI_API_KEY: 'test_key' }
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
          'gemini': {
            command: 'npx',
            args: ['-y'],
            env: { GEMINI_API_KEY: 'test' }
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
          'gemini': {
            args: ['-y'],
            env: { GEMINI_API_KEY: 'test' }
          }
        }
      };

      expect(mcpService.validateConfig(config)).toBe(false);
    });

    test('should return false for missing args', () => {
      const config = {
        mcpServers: {
          'gemini': {
            command: 'npx',
            env: { GEMINI_API_KEY: 'test' }
          }
        }
      };

      expect(mcpService.validateConfig(config)).toBe(false);
    });

    test('should return false for missing env', () => {
      const config = {
        mcpServers: {
          'gemini': {
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
          'gemini': {
            command: 'npx',
            args: ['-y'],
            env: { GEMINI_API_KEY: 'old_key' },
            disabled: false
          }
        }
      };

      fs.writeFileSync(configPath, JSON.stringify(config));
    });

    test('should update API key', () => {
      mcpService.updateAPIKey('gemini', 'new_key', configPath);

      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      expect(config.mcpServers['gemini'].env.GEMINI_API_KEY).toBe('new_key');
    });

    test('should enable disabled server when updating key', () => {
      const config = {
        mcpServers: {
          'gemini': {
            command: 'npx',
            args: ['-y'],
            env: { GEMINI_API_KEY: '' },
            disabled: true
          }
        }
      };

      fs.writeFileSync(configPath, JSON.stringify(config));

      mcpService.updateAPIKey('gemini', 'new_key', configPath);

      const updatedConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      expect(updatedConfig.mcpServers['gemini'].disabled).toBeUndefined();
    });

    test('should throw error if config file not found', () => {
      fs.unlinkSync(configPath);

      expect(() => mcpService.updateAPIKey('gemini', 'new_key', configPath)).toThrow();
    });

    test('should throw error for unknown server', () => {
      expect(() => mcpService.updateAPIKey('unknown-server', 'new_key', configPath)).toThrow();
    });
  });

  describe('testServer', () => {
    test('should return success for configured server with API key', async () => {
      const config = {
        mcpServers: {
          'gemini': {
            command: 'npx',
            args: ['-y'],
            env: { GEMINI_API_KEY: 'test_key' },
            disabled: false
          }
        }
      };

      fs.writeFileSync(configPath, JSON.stringify(config));

      const result = await mcpService.testServer('gemini');

      expect(result.success).toBe(true);
    });

    test('should return failure for disabled server', async () => {
      const config = {
        mcpServers: {
          'gemini': {
            command: 'npx',
            args: ['-y'],
            env: { GEMINI_API_KEY: 'test_key' },
            disabled: true
          }
        }
      };

      fs.writeFileSync(configPath, JSON.stringify(config));

      const result = await mcpService.testServer('gemini');

      expect(result.success).toBe(false);
      expect(result.message).toContain('disabled');
    });

    test('should return failure for missing API key', async () => {
      const config = {
        mcpServers: {
          'gemini': {
            command: 'npx',
            args: ['-y'],
            env: { GEMINI_API_KEY: '' },
            disabled: false
          }
        }
      };

      fs.writeFileSync(configPath, JSON.stringify(config));

      const result = await mcpService.testServer('gemini');

      expect(result.success).toBe(false);
      expect(result.message).toContain('not set');
    });

    test('should return failure for non-configured server', async () => {
      fs.writeFileSync(configPath, JSON.stringify({ mcpServers: {} }));

      const result = await mcpService.testServer('gemini');

      expect(result.success).toBe(false);
      expect(result.message).toContain('not configured');
    });
  });
});
