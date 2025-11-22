/**
 * Integration tests for init command
 */

const fs = require('fs');
const path = require('path');
const initCommand = require('../../lib/commands/init');
const constants = require('../../lib/constants');
const { createTempDir } = require('../setup');

// Mock dependencies - must be before requiring modules that use them
jest.mock('../../lib/services/github-service', () => ({
  authenticate: jest.fn().mockResolvedValue(),
  downloadFile: jest.fn().mockResolvedValue(),
  downloadDirectory: jest.fn().mockResolvedValue(),
  countRemoteFiles: jest.fn().mockResolvedValue(5)
}));

jest.mock('../../lib/utils/prompts', () => ({
  promptForAPIKeys: jest.fn().mockResolvedValue({
    geminiKey: 'test_gemini_key'
  }),
  confirmAction: jest.fn().mockResolvedValue(true)
}));

// Mock logger to prevent progress bar issues in tests
jest.mock('../../lib/utils/logger', () => {
  return {
    success: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    log: jest.fn(),
    newline: jest.fn(),
    startSpinner: jest.fn().mockReturnValue({
      succeed: jest.fn(),
      fail: jest.fn(),
      stop: jest.fn(),
      text: ''
    }),
    updateSpinner: jest.fn(),
    succeedSpinner: jest.fn(),
    failSpinner: jest.fn(),
    stopSpinner: jest.fn(),
    header: jest.fn(),
    box: jest.fn(),
    list: jest.fn(),
    table: jest.fn(),
    checkResult: jest.fn(),
    fileOperation: jest.fn(),
    summary: jest.fn(),
    startProgressBar: jest.fn().mockReturnValue({ update: jest.fn(), stop: jest.fn() }),
    updateProgressBar: jest.fn(),
    incrementProgressBar: jest.fn(),
    stopProgressBar: jest.fn(),
    hasProgressBar: jest.fn().mockReturnValue(false)
  };
});

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

    // Clear mock call history
    jest.clearAllMocks();

    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(process, 'exit').mockImplementation();
  });

  afterEach(() => {
    // Restore working directory
    process.chdir(originalCwd);

    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }

    // Restore mocks
    jest.restoreAllMocks();
  });

  test('should initialize PM Kit successfully', async () => {
    await initCommand({ force: true });

    // Check that GitHub authentication was called
    expect(githubService.authenticate).toHaveBeenCalled();

    // Check that files were downloaded (path is now absolute due to installDir)
    expect(githubService.downloadFile).toHaveBeenCalledWith(
      constants.KIT_REPOSITORY,
      'CLAUDE.md',
      expect.stringContaining('CLAUDE.md'),
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
    expect(gitignoreContent).toContain('.mcp.json');
    expect(gitignoreContent).toContain('.env');
  });

  test('should create valid .mcp.json config', async () => {
    await initCommand({ force: true });

    expect(fs.existsSync('.mcp.json')).toBe(true);

    const config = JSON.parse(fs.readFileSync('.mcp.json', 'utf8'));

    expect(config).toHaveProperty('mcpServers');
    expect(config.mcpServers).toHaveProperty('gemini');
    expect(config.mcpServers['gemini']).toHaveProperty('command');
    expect(config.mcpServers['gemini']).toHaveProperty('args');
    expect(config.mcpServers['gemini']).toHaveProperty('env');
    expect(config.mcpServers['gemini'].env).toHaveProperty('GEMINI_API_KEY', 'test_gemini_key');
  });

  test('should prompt for confirmation if already initialized', async () => {
    // Create CLAUDE.md and .claude directory
    fs.writeFileSync('CLAUDE.md', '# CLAUDE');
    fs.mkdirSync('.claude');

    // Mock confirmation to return false
    prompts.confirmAction.mockResolvedValueOnce(false);

    // Mock process.exit to throw so execution stops
    const exitError = new Error('process.exit');
    process.exit.mockImplementationOnce(() => { throw exitError; });

    // Should exit early when user declines
    await expect(initCommand()).rejects.toThrow('process.exit');

    // Should have prompted for confirmation
    expect(prompts.confirmAction).toHaveBeenCalledWith(
      expect.stringContaining('Reinitialize'),
      false
    );

    // Should not have continued with initialization (exit was called)
    expect(process.exit).toHaveBeenCalledWith(0);
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

    // Check key output directories from constants.REQUIRED_DIRS
    const expectedDirs = [
      'outputs/research-reports',
      'outputs/consensus-reports',
      'outputs/decision-matrices',
      'outputs/evidence-logs',
      'prds/active',
      'prds/archive'
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
