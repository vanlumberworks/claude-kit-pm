/**
 * Integration tests for init command
 */

const fs = require('fs');
const path = require('path');
const initCommand = require('../../lib/commands/init');
const constants = require('../../lib/constants');
const { createTempDir } = require('../setup');

// Mock dependencies
jest.mock('../../lib/services/github-service');
jest.mock('../../lib/utils/prompts');

const githubService = require('../../lib/services/github-service');
const prompts = require('../../lib/utils/prompts');

describe('initCommand (integration)', () => {
  let testDir;
  let originalCwd;

  beforeEach(() => {
    // Create test directory and change to it
    testDir = createTempDir(`init-test-${Date.now()}`);
    originalCwd = process.cwd();
    process.chdir(testDir);

    // Mock github service
    githubService.authenticate = jest.fn().mockResolvedValue();
    githubService.downloadFile = jest.fn().mockResolvedValue();
    githubService.downloadDirectory = jest.fn().mockResolvedValue();

    // Mock prompts
    prompts.promptForAPIKeys = jest.fn().mockResolvedValue({
      braveKey: 'test_brave_key',
      perplexityKey: 'test_perplexity_key',
      geminiKey: 'test_gemini_key'
    });
    prompts.confirmAction = jest.fn().mockResolvedValue(true);

    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(process, 'exit').mockImplementation();
  });

  afterEach(() => {
    // Restore working directory
    process.chdir(originalCwd);

    // Restore mocks
    jest.restoreAllMocks();
  });

  test('should initialize PM Kit successfully', async () => {
    await initCommand({ force: true });

    // Check that GitHub authentication was called
    expect(githubService.authenticate).toHaveBeenCalled();

    // Check that files were downloaded
    expect(githubService.downloadFile).toHaveBeenCalledWith(
      constants.KIT_REPOSITORY,
      'CLAUDE.md',
      'CLAUDE.md',
      constants.KIT_REPOSITORY_BRANCH
    );

    expect(githubService.downloadDirectory).toHaveBeenCalledTimes(
      constants.DOWNLOAD_PATHS.length - 1 // minus CLAUDE.md
    );

    // Check that API keys were prompted
    expect(prompts.promptForAPIKeys).toHaveBeenCalled();

    // Check that .mcp.json was created
    expect(fs.existsSync('.mcp.json')).toBe(true);

    // Check that required directories were created
    constants.REQUIRED_DIRS.forEach(dir => {
      expect(fs.existsSync(dir)).toBe(true);
    });

    // Check that .gitignore was updated
    expect(fs.existsSync('.gitignore')).toBe(true);
    const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
    constants.GITIGNORE_ENTRIES.forEach(entry => {
      expect(gitignoreContent).toContain(entry);
    });
  });

  test('should create valid .mcp.json config', async () => {
    await initCommand({ force: true });

    expect(fs.existsSync('.mcp.json')).toBe(true);

    const config = JSON.parse(fs.readFileSync('.mcp.json', 'utf8'));

    expect(config).toHaveProperty('mcpServers');
    expect(config.mcpServers).toHaveProperty('brave-search');
    expect(config.mcpServers['brave-search']).toHaveProperty('command');
    expect(config.mcpServers['brave-search']).toHaveProperty('args');
    expect(config.mcpServers['brave-search']).toHaveProperty('env');
    expect(config.mcpServers['brave-search'].env).toHaveProperty('BRAVE_API_KEY', 'test_brave_key');
  });

  test('should prompt for confirmation if already initialized', async () => {
    // Create CLAUDE.md and .claude directory
    fs.writeFileSync('CLAUDE.md', '# CLAUDE');
    fs.mkdirSync('.claude');

    // Mock confirmation to return false
    prompts.confirmAction.mockResolvedValueOnce(false);

    await initCommand();

    // Should have prompted for confirmation
    expect(prompts.confirmAction).toHaveBeenCalledWith(
      expect.stringContaining('Reinitialize'),
      false
    );

    // Should not have continued with initialization
    expect(githubService.authenticate).not.toHaveBeenCalled();
  });

  test('should reinitialize if confirmed', async () => {
    // Create CLAUDE.md and .claude directory
    fs.writeFileSync('CLAUDE.md', '# CLAUDE');
    fs.mkdirSync('.claude');

    // Mock confirmation to return true
    prompts.confirmAction.mockResolvedValueOnce(true);

    await initCommand();

    // Should have continued with initialization
    expect(githubService.authenticate).toHaveBeenCalled();
  });

  test('should skip confirmation with --force flag', async () => {
    // Create CLAUDE.md and .claude directory
    fs.writeFileSync('CLAUDE.md', '# CLAUDE');
    fs.mkdirSync('.claude');

    await initCommand({ force: true });

    // Should not have prompted for confirmation
    expect(prompts.confirmAction).not.toHaveBeenCalled();

    // Should have continued with initialization
    expect(githubService.authenticate).toHaveBeenCalled();
  });

  test('should handle authentication failure', async () => {
    githubService.authenticate.mockRejectedValueOnce(new Error('Auth failed'));

    await expect(initCommand({ force: true })).rejects.toThrow('Auth failed');
  });

  test('should handle download failure', async () => {
    githubService.downloadFile.mockRejectedValueOnce(new Error('Download failed'));

    await expect(initCommand({ force: true })).rejects.toThrow('Download failed');
  });

  test('should create all required output directories', async () => {
    await initCommand({ force: true });

    const expectedDirs = [
      'outputs/prds',
      'outputs/research-reports',
      'outputs/consensus-reports',
      'outputs/decision-matrices',
      'outputs/evidence-logs'
    ];

    expectedDirs.forEach(dir => {
      expect(fs.existsSync(dir)).toBe(true);
    });
  });

  test('should not duplicate .gitignore entries', async () => {
    // Pre-populate .gitignore with some entries
    fs.writeFileSync('.gitignore', '.env\nnode_modules/\n');

    await initCommand({ force: true });

    const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');

    // Check that .env appears only once
    const envMatches = gitignoreContent.match(/^\.env$/gm);
    expect(envMatches).toHaveLength(1);
  });

  test('should handle reset token flag', async () => {
    await initCommand({ resetToken: true, force: true });

    expect(githubService.authenticate).toHaveBeenCalledWith(true);
  });
});
