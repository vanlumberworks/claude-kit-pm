/**
 * Test setup and configuration
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Create temporary test directory
const TEST_DIR = path.join(os.tmpdir(), 'pm-kit-tests', Date.now().toString());

beforeAll(() => {
  // Create test directory
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  }

  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.PM_KIT_TEST = 'true';
});

afterAll(() => {
  // Cleanup test directory
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
});

// Export test utilities
module.exports = {
  TEST_DIR,

  /**
   * Create a temporary file with content
   */
  createTempFile(filename, content) {
    const filepath = path.join(TEST_DIR, filename);
    const dir = path.dirname(filepath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filepath, content);
    return filepath;
  },

  /**
   * Create a temporary directory
   */
  createTempDir(dirname) {
    const dirpath = path.join(TEST_DIR, dirname);
    if (!fs.existsSync(dirpath)) {
      fs.mkdirSync(dirpath, { recursive: true });
    }
    return dirpath;
  },

  /**
   * Read file content
   */
  readTempFile(filename) {
    const filepath = path.join(TEST_DIR, filename);
    return fs.readFileSync(filepath, 'utf8');
  },

  /**
   * Check if file exists
   */
  fileExists(filename) {
    const filepath = path.join(TEST_DIR, filename);
    return fs.existsSync(filepath);
  },

  /**
   * Mock console output
   */
  mockConsole() {
    const originalLog = console.log;
    const originalError = console.error;
    const logs = [];
    const errors = [];

    console.log = (...args) => logs.push(args.join(' '));
    console.error = (...args) => errors.push(args.join(' '));

    return {
      logs,
      errors,
      restore() {
        console.log = originalLog;
        console.error = originalError;
      }
    };
  }
};
