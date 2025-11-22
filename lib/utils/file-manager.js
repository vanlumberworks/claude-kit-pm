/**
 * File management utilities
 * Uses fs-extra for enhanced file operations and ignore for pattern matching
 */

const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const ignore = require('ignore');
const { PMKitError, ErrorCodes } = require('./error-handler');

class FileManager {
  constructor() {
    this.ignoreInstance = null;
  }

  /**
   * Check if file/directory exists
   */
  exists(filePath) {
    return fs.existsSync(filePath);
  }

  /**
   * Check if file/directory exists (async)
   */
  async pathExists(filePath) {
    return fs.pathExists(filePath);
  }

  /**
   * Create directory recursively
   */
  createDir(dirPath) {
    fs.ensureDirSync(dirPath);
  }

  /**
   * Create directory recursively (async)
   */
  async ensureDir(dirPath) {
    await fs.ensureDir(dirPath);
  }

  /**
   * Create multiple directories
   */
  createDirs(dirPaths) {
    dirPaths.forEach(dirPath => this.createDir(dirPath));
  }

  /**
   * Create multiple directories (async)
   */
  async ensureDirs(dirPaths) {
    await Promise.all(dirPaths.map(dirPath => fs.ensureDir(dirPath)));
  }

  /**
   * Read file content
   */
  readFile(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      throw new PMKitError(
        `Failed to read file: ${filePath}`,
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Read file content (async)
   */
  async readFileAsync(filePath) {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      throw new PMKitError(
        `Failed to read file: ${filePath}`,
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Read JSON file
   */
  readJson(filePath) {
    try {
      return fs.readJsonSync(filePath);
    } catch (error) {
      throw new PMKitError(
        `Failed to read JSON file: ${filePath}`,
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Read JSON file (async)
   */
  async readJsonAsync(filePath) {
    try {
      return await fs.readJson(filePath);
    } catch (error) {
      throw new PMKitError(
        `Failed to read JSON file: ${filePath}`,
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Write file content
   */
  writeFile(filePath, content) {
    try {
      fs.outputFileSync(filePath, content);
    } catch (error) {
      throw new PMKitError(
        `Failed to write file: ${filePath}`,
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Write file content (async)
   */
  async writeFileAsync(filePath, content) {
    try {
      await fs.outputFile(filePath, content);
    } catch (error) {
      throw new PMKitError(
        `Failed to write file: ${filePath}`,
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Write JSON file
   */
  writeJson(filePath, data, options = { spaces: 2 }) {
    try {
      fs.outputJsonSync(filePath, data, options);
    } catch (error) {
      throw new PMKitError(
        `Failed to write JSON file: ${filePath}`,
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Write JSON file (async)
   */
  async writeJsonAsync(filePath, data, options = { spaces: 2 }) {
    try {
      await fs.outputJson(filePath, data, options);
    } catch (error) {
      throw new PMKitError(
        `Failed to write JSON file: ${filePath}`,
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Append to file
   */
  appendFile(filePath, content) {
    try {
      fs.appendFileSync(filePath, content);
    } catch (error) {
      throw new PMKitError(
        `Failed to append to file: ${filePath}`,
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Check if file/directory is writable
   */
  isWritable(filePath) {
    try {
      fs.accessSync(filePath, fs.constants.W_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if file/directory is readable
   */
  isReadable(filePath) {
    try {
      fs.accessSync(filePath, fs.constants.R_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Update .gitignore with PM Kit entries
   */
  updateGitignore(entries) {
    const gitignorePath = '.gitignore';
    let content = '';

    if (this.exists(gitignorePath)) {
      content = this.readFile(gitignorePath);

      if (content.includes('# PM Kit')) {
        return;
      }
    }

    const existingEntries = new Set(
      content.split('\n').map(line => line.trim()).filter(Boolean)
    );

    const entryLines = Array.isArray(entries)
      ? entries
      : entries.split('\n');

    const newEntries = entryLines
      .filter(line => {
        const trimmed = (line || '').trim();
        if (!trimmed || trimmed.startsWith('#')) return true;
        return !existingEntries.has(trimmed);
      })
      .join('\n');

    if (newEntries.trim()) {
      this.appendFile(gitignorePath, newEntries);
    }
  }

  /**
   * Check if PM Kit is already initialized
   */
  isInitialized() {
    return (
      this.exists('.claude') &&
      this.exists('CLAUDE.md') &&
      this.exists('.mcp.json')
    );
  }

  /**
   * Count files in directory matching pattern
   */
  countFiles(dirPath, pattern = null) {
    if (!this.exists(dirPath)) {
      return 0;
    }

    const files = fs.readdirSync(dirPath);

    if (!pattern) {
      return files.length;
    }

    return files.filter(file => {
      if (pattern instanceof RegExp) {
        return pattern.test(file);
      }
      return file.includes(pattern);
    }).length;
  }

  /**
   * Copy file
   */
  copyFile(source, destination) {
    try {
      fs.copySync(source, destination);
    } catch (error) {
      throw new PMKitError(
        `Failed to copy file: ${source} -> ${destination}`,
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Copy file (async)
   */
  async copyFileAsync(source, destination) {
    try {
      await fs.copy(source, destination);
    } catch (error) {
      throw new PMKitError(
        `Failed to copy file: ${source} -> ${destination}`,
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Delete file
   */
  deleteFile(filePath) {
    try {
      if (this.exists(filePath)) {
        fs.removeSync(filePath);
      }
    } catch (error) {
      throw new PMKitError(
        `Failed to delete file: ${filePath}`,
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Delete file (async)
   */
  async removeAsync(filePath) {
    try {
      await fs.remove(filePath);
    } catch (error) {
      throw new PMKitError(
        `Failed to delete: ${filePath}`,
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Get file stats
   */
  getStats(filePath) {
    try {
      return fs.statSync(filePath);
    } catch (error) {
      throw new PMKitError(
        `Failed to get file stats: ${filePath}`,
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Check if path is directory
   */
  isDirectory(filePath) {
    try {
      return fs.statSync(filePath).isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Check if path is file
   */
  isFile(filePath) {
    try {
      return fs.statSync(filePath).isFile();
    } catch {
      return false;
    }
  }

  /**
   * Copy directory recursively
   */
  copyDirectory(source, destination, options = {}) {
    try {
      fs.copySync(source, destination, {
        overwrite: options.overwrite !== false,
        filter: options.filter
      });
    } catch (error) {
      throw new PMKitError(
        `Failed to copy directory: ${source} -> ${destination}`,
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Copy directory with ignore patterns
   */
  async copyWithIgnore(source, destination, ignorePatterns = []) {
    const ig = ignore().add(ignorePatterns);

    const filter = (src) => {
      const relativePath = path.relative(source, src);
      if (!relativePath) return true;
      return !ig.ignores(relativePath);
    };

    try {
      await fs.copy(source, destination, { filter });
    } catch (error) {
      throw new PMKitError(
        `Failed to copy directory: ${source} -> ${destination}`,
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Delete directory recursively
   */
  deleteDirectory(dirPath) {
    try {
      if (this.exists(dirPath) && this.isDirectory(dirPath)) {
        fs.removeSync(dirPath);
      }
    } catch (error) {
      throw new PMKitError(
        `Failed to delete directory: ${dirPath}`,
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Move file or directory
   */
  move(source, destination) {
    try {
      fs.moveSync(source, destination, { overwrite: true });
    } catch (error) {
      throw new PMKitError(
        `Failed to move: ${source} -> ${destination}`,
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Move file or directory (async)
   */
  async moveAsync(source, destination) {
    try {
      await fs.move(source, destination, { overwrite: true });
    } catch (error) {
      throw new PMKitError(
        `Failed to move: ${source} -> ${destination}`,
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Empty directory (remove all contents but keep directory)
   */
  emptyDir(dirPath) {
    try {
      fs.emptyDirSync(dirPath);
    } catch (error) {
      throw new PMKitError(
        `Failed to empty directory: ${dirPath}`,
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Get SHA-256 hash of file contents
   */
  getFileHash(filePath) {
    try {
      const content = fs.readFileSync(filePath);
      return crypto.createHash('sha256').update(content).digest('hex');
    } catch (error) {
      throw new PMKitError(
        `Failed to hash file: ${filePath}`,
        ErrorCodes.FS_ERROR,
        { error: error.message }
      );
    }
  }

  /**
   * Compare two files by hash
   */
  compareFiles(file1, file2) {
    try {
      if (!this.exists(file1) || !this.exists(file2)) {
        return false;
      }
      return this.getFileHash(file1) === this.getFileHash(file2);
    } catch {
      return false;
    }
  }

  /**
   * Get all files in directory recursively
   */
  getAllFiles(dirPath, relativeTo = null) {
    const files = [];
    const basePath = relativeTo || dirPath;

    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const relativePath = path.relative(basePath, itemPath);

      if (this.isDirectory(itemPath)) {
        files.push(...this.getAllFiles(itemPath, basePath));
      } else {
        files.push(relativePath);
      }
    }

    return files;
  }

  /**
   * Get all files excluding patterns
   */
  getAllFilesWithIgnore(dirPath, ignorePatterns = [], relativeTo = null) {
    const ig = ignore().add(ignorePatterns);
    const allFiles = this.getAllFiles(dirPath, relativeTo);
    return allFiles.filter(file => !ig.ignores(file));
  }

  /**
   * Create ignore instance from patterns
   */
  createIgnore(patterns) {
    return ignore().add(patterns);
  }

  /**
   * Check if path should be ignored
   */
  shouldIgnore(filePath, ignorePatterns) {
    const ig = ignore().add(ignorePatterns);
    return ig.ignores(filePath);
  }

  /**
   * Filter files by ignore patterns
   */
  filterIgnored(files, ignorePatterns) {
    const ig = ignore().add(ignorePatterns);
    return files.filter(file => !ig.ignores(file));
  }

  /**
   * Detect local modifications compared to original
   */
  detectModifications(localDir, originalHashes = {}) {
    const modifications = [];

    if (!this.exists(localDir)) {
      return modifications;
    }

    const files = this.getAllFiles(localDir);

    for (const file of files) {
      const fullPath = path.join(localDir, file);
      const currentHash = this.getFileHash(fullPath);
      const originalHash = originalHashes[file];

      if (!originalHash) {
        modifications.push({ file, status: 'added' });
      } else if (currentHash !== originalHash) {
        modifications.push({ file, status: 'modified' });
      }
    }

    for (const file of Object.keys(originalHashes)) {
      const fullPath = path.join(localDir, file);
      if (!this.exists(fullPath)) {
        modifications.push({ file, status: 'deleted' });
      }
    }

    return modifications;
  }

  /**
   * Save file hashes for a directory
   */
  saveDirectoryHashes(dirPath, outputPath) {
    const hashes = {};
    const files = this.getAllFiles(dirPath);

    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      hashes[file] = this.getFileHash(fullPath);
    }

    this.writeJson(outputPath, hashes);
    return hashes;
  }

  /**
   * Load directory hashes from file
   */
  loadDirectoryHashes(hashFilePath) {
    if (!this.exists(hashFilePath)) {
      return {};
    }

    try {
      return this.readJson(hashFilePath);
    } catch {
      return {};
    }
  }

  /**
   * Ensure file exists, create with default content if not
   */
  ensureFile(filePath, defaultContent = '') {
    if (!this.exists(filePath)) {
      this.writeFile(filePath, defaultContent);
    }
  }

  /**
   * Ensure file exists (async)
   */
  async ensureFileAsync(filePath) {
    await fs.ensureFile(filePath);
  }
}

module.exports = new FileManager();
