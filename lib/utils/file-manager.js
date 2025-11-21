/**
 * File management utilities
 */

const fs = require('fs');
const path = require('path');
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

    // Append PM Kit entries
    this.appendFile(gitignorePath, entries);
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
}

module.exports = new FileManager();
