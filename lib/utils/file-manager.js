/**
 * File management utilities
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { PMKitError, ErrorCodes } = require('./error-handler');

class FileManager {
  /**
   * Check if directory exists
   */
  exists(filePath) {
    return fs.existsSync(filePath);
  }

  /**
   * Create directory recursively
   */
  createDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Create multiple directories
   */
  createDirs(dirPaths) {
    dirPaths.forEach(dirPath => this.createDir(dirPath));
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
   * Write file content
   */
  writeFile(filePath, content) {
    try {
      // Create directory if it doesn't exist
      const dir = path.dirname(filePath);
      this.createDir(dir);

      fs.writeFileSync(filePath, content);
    } catch (error) {
      throw new PMKitError(
        `Failed to write file: ${filePath}`,
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

    // Read existing .gitignore if it exists
    if (this.exists(gitignorePath)) {
      content = this.readFile(gitignorePath);

      // Check if entries already exist
      if (content.includes('# PM Kit')) {
        return; // Already added
      }
    }

    // Parse existing entries
    const existingEntries = new Set(
      content.split('\n').map(line => line.trim()).filter(Boolean)
    );

    // Handle both array and string entries
    const entryLines = Array.isArray(entries)
      ? entries
      : entries.split('\n');

    // Filter out entries that already exist
    const newEntries = entryLines
      .filter(line => {
        const trimmed = (line || '').trim();
        // Keep comments and non-empty lines that don't already exist
        if (!trimmed || trimmed.startsWith('#')) return true;
        return !existingEntries.has(trimmed);
      })
      .join('\n');

    // Append deduplicated PM Kit entries
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
      const dir = path.dirname(destination);
      this.createDir(dir);
      fs.copyFileSync(source, destination);
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
        fs.unlinkSync(filePath);
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
  copyDirectory(source, destination) {
    try {
      // Create destination if it doesn't exist
      this.createDir(destination);

      const items = fs.readdirSync(source);

      for (const item of items) {
        const sourcePath = path.join(source, item);
        const destPath = path.join(destination, item);

        if (this.isDirectory(sourcePath)) {
          // Recursively copy subdirectory
          this.copyDirectory(sourcePath, destPath);
        } else {
          // Copy file
          this.copyFile(sourcePath, destPath);
        }
      }
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
        fs.rmSync(dirPath, { recursive: true, force: true });
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
   * Returns true if files are identical
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
   * Detect local modifications compared to original
   * Returns list of modified files with their status
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

    // Check for deleted files
    for (const file of Object.keys(originalHashes)) {
      const fullPath = path.join(localDir, file);
      if (!this.exists(fullPath)) {
        modifications.push({ file, status: 'deleted' });
      }
    }

    return modifications;
  }

  /**
   * Save file hashes for a directory (for later comparison)
   */
  saveDirectoryHashes(dirPath, outputPath) {
    const hashes = {};
    const files = this.getAllFiles(dirPath);

    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      hashes[file] = this.getFileHash(fullPath);
    }

    this.writeFile(outputPath, JSON.stringify(hashes, null, 2));
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
      const content = this.readFile(hashFilePath);
      return JSON.parse(content);
    } catch {
      return {};
    }
  }
}

module.exports = new FileManager();
