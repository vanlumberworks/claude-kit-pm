/**
 * Unit tests for file-manager
 */

const fs = require('fs');
const path = require('path');
const fileManager = require('../../lib/utils/file-manager');
const { TEST_DIR, createTempFile, createTempDir } = require('../setup');

describe('fileManager', () => {
  let testDir;
  let originalCwd;

  beforeEach(() => {
    originalCwd = process.cwd();
    // Create unique test directory for each test
    testDir = createTempDir(`file-manager-test-${Date.now()}`);
    process.chdir(testDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('exists', () => {
    test('should return true for existing file', () => {
      const filepath = path.join(testDir, 'test.txt');
      fs.writeFileSync(filepath, 'content');

      expect(fileManager.exists('test.txt')).toBe(true);
    });

    test('should return false for non-existing file', () => {
      expect(fileManager.exists('nonexistent.txt')).toBe(false);
    });

    test('should return true for existing directory', () => {
      const dirpath = path.join(testDir, 'testdir');
      fs.mkdirSync(dirpath);

      expect(fileManager.exists('testdir')).toBe(true);
    });
  });

  describe('isDirectory', () => {
    test('should return true for directory', () => {
      const dirpath = path.join(testDir, 'testdir');
      fs.mkdirSync(dirpath);

      expect(fileManager.isDirectory('testdir')).toBe(true);
    });

    test('should return false for file', () => {
      const filepath = path.join(testDir, 'test.txt');
      fs.writeFileSync(filepath, 'content');

      expect(fileManager.isDirectory('test.txt')).toBe(false);
    });

    test('should return false for non-existing path', () => {
      expect(fileManager.isDirectory('nonexistent')).toBe(false);
    });
  });

  describe('createDir', () => {
    test('should create directory', () => {
      fileManager.createDir('newdir');

      expect(fs.existsSync(path.join(testDir, 'newdir'))).toBe(true);
    });

    test('should create nested directories', () => {
      fileManager.createDir('parent/child/grandchild');

      expect(fs.existsSync(path.join(testDir, 'parent/child/grandchild'))).toBe(true);
    });

    test('should not throw if directory already exists', () => {
      fileManager.createDir('testdir');
      expect(() => fileManager.createDir('testdir')).not.toThrow();
    });
  });

  describe('createDirs', () => {
    test('should create multiple directories', () => {
      fileManager.createDirs(['dir1', 'dir2', 'dir3']);

      expect(fs.existsSync(path.join(testDir, 'dir1'))).toBe(true);
      expect(fs.existsSync(path.join(testDir, 'dir2'))).toBe(true);
      expect(fs.existsSync(path.join(testDir, 'dir3'))).toBe(true);
    });

    test('should create nested directories', () => {
      fileManager.createDirs(['parent/child1', 'parent/child2']);

      expect(fs.existsSync(path.join(testDir, 'parent/child1'))).toBe(true);
      expect(fs.existsSync(path.join(testDir, 'parent/child2'))).toBe(true);
    });
  });

  describe('readFile', () => {
    test('should read file content', () => {
      const filepath = path.join(testDir, 'test.txt');
      fs.writeFileSync(filepath, 'Hello World');

      const content = fileManager.readFile('test.txt');
      expect(content).toBe('Hello World');
    });

    test('should throw error for non-existing file', () => {
      expect(() => fileManager.readFile('nonexistent.txt')).toThrow();
    });
  });

  describe('writeFile', () => {
    test('should write file content', () => {
      fileManager.writeFile('test.txt', 'Hello World');

      const content = fs.readFileSync(path.join(testDir, 'test.txt'), 'utf8');
      expect(content).toBe('Hello World');
    });

    test('should create parent directories if needed', () => {
      fileManager.writeFile('parent/child/test.txt', 'content');

      expect(fs.existsSync(path.join(testDir, 'parent/child/test.txt'))).toBe(true);
    });

    test('should overwrite existing file', () => {
      fileManager.writeFile('test.txt', 'First');
      fileManager.writeFile('test.txt', 'Second');

      const content = fs.readFileSync(path.join(testDir, 'test.txt'), 'utf8');
      expect(content).toBe('Second');
    });
  });

  describe('isInitialized', () => {
    test('should return true if CLAUDE.md, .claude directory, and .mcp.json exist', () => {
      fs.writeFileSync(path.join(testDir, 'CLAUDE.md'), '# CLAUDE.md');
      fs.mkdirSync(path.join(testDir, '.claude'));
      fs.writeFileSync(path.join(testDir, '.mcp.json'), '{}');

      expect(fileManager.isInitialized()).toBe(true);
    });

    test('should return false if CLAUDE.md missing', () => {
      fs.mkdirSync(path.join(testDir, '.claude'));

      expect(fileManager.isInitialized()).toBe(false);
    });

    test('should return false if .claude directory missing', () => {
      fs.writeFileSync(path.join(testDir, 'CLAUDE.md'), '# CLAUDE.md');

      expect(fileManager.isInitialized()).toBe(false);
    });
  });

  describe('countFiles', () => {
    test('should count files with extension', () => {
      fs.mkdirSync(path.join(testDir, 'testdir'));
      fs.writeFileSync(path.join(testDir, 'testdir/file1.md'), '');
      fs.writeFileSync(path.join(testDir, 'testdir/file2.md'), '');
      fs.writeFileSync(path.join(testDir, 'testdir/file3.txt'), '');

      const count = fileManager.countFiles('testdir', '.md');
      expect(count).toBe(2);
    });

    test('should return 0 for non-existing directory', () => {
      const count = fileManager.countFiles('nonexistent', '.md');
      expect(count).toBe(0);
    });

    test('should return 0 for empty directory', () => {
      fs.mkdirSync(path.join(testDir, 'empty'));

      const count = fileManager.countFiles('empty', '.md');
      expect(count).toBe(0);
    });
  });

  describe('updateGitignore', () => {
    test('should create .gitignore if not exists', () => {
      fileManager.updateGitignore(['.env', '.mcp.json']);

      expect(fs.existsSync(path.join(testDir, '.gitignore'))).toBe(true);
    });

    test('should add entries to .gitignore', () => {
      fileManager.updateGitignore(['.env', '.mcp.json']);

      const content = fs.readFileSync(path.join(testDir, '.gitignore'), 'utf8');
      expect(content).toContain('.env');
      expect(content).toContain('.mcp.json');
    });

    test('should not duplicate existing entries', () => {
      fs.writeFileSync(path.join(testDir, '.gitignore'), '.env\n');

      fileManager.updateGitignore(['.env', '.mcp.json']);

      const content = fs.readFileSync(path.join(testDir, '.gitignore'), 'utf8');
      const envCount = (content.match(/\.env/g) || []).length;
      expect(envCount).toBe(1);
    });

    test('should preserve existing content', () => {
      fs.writeFileSync(path.join(testDir, '.gitignore'), '# Existing content\nnode_modules/\n');

      fileManager.updateGitignore(['.env']);

      const content = fs.readFileSync(path.join(testDir, '.gitignore'), 'utf8');
      expect(content).toContain('# Existing content');
      expect(content).toContain('node_modules/');
      expect(content).toContain('.env');
    });
  });
});
