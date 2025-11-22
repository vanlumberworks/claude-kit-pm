/**
 * Secure credential storage service using keytar
 * Falls back to file-based storage if keytar is unavailable
 */

const path = require('path');
const os = require('os');
const fs = require('fs-extra');

const SERVICE_NAME = 'pm-kit-cli';
const CONFIG_DIR = path.join(os.homedir(), '.pm-kit');
const FALLBACK_FILE = path.join(CONFIG_DIR, '.credentials');

let keytar = null;
let keytarAvailable = false;

// Try to load keytar (may fail on some systems)
try {
  keytar = require('keytar');
  keytarAvailable = true;
} catch {
  keytarAvailable = false;
}

/**
 * Check if secure storage is available
 */
function isSecureStorageAvailable() {
  return keytarAvailable;
}

/**
 * Get credential from secure storage or fallback
 */
async function getCredential(key) {
  if (keytarAvailable) {
    try {
      return await keytar.getPassword(SERVICE_NAME, key);
    } catch {
      // Fall through to file-based storage
    }
  }

  // Fallback to file-based storage
  return getFromFile(key);
}

/**
 * Set credential in secure storage or fallback
 */
async function setCredential(key, value) {
  if (keytarAvailable) {
    try {
      await keytar.setPassword(SERVICE_NAME, key, value);
      // Also remove from fallback file if it exists
      await removeFromFile(key);
      return true;
    } catch {
      // Fall through to file-based storage
    }
  }

  // Fallback to file-based storage
  return saveToFile(key, value);
}

/**
 * Delete credential from secure storage or fallback
 */
async function deleteCredential(key) {
  let deleted = false;

  if (keytarAvailable) {
    try {
      deleted = await keytar.deletePassword(SERVICE_NAME, key);
    } catch {
      // Continue to try file-based deletion
    }
  }

  // Also try to remove from fallback file
  const fileDeleted = await removeFromFile(key);
  return deleted || fileDeleted;
}

/**
 * Get all stored credentials
 */
async function getAllCredentials() {
  const credentials = {};

  if (keytarAvailable) {
    try {
      const entries = await keytar.findCredentials(SERVICE_NAME);
      for (const entry of entries) {
        credentials[entry.account] = entry.password;
      }
    } catch {
      // Fall through to file-based storage
    }
  }

  // Merge with file-based storage
  const fileCredentials = await getAllFromFile();
  return { ...fileCredentials, ...credentials };
}

/**
 * Migrate credentials from file to secure storage
 */
async function migrateToSecureStorage() {
  if (!keytarAvailable) {
    return { migrated: 0, failed: 0 };
  }

  const fileCredentials = await getAllFromFile();
  let migrated = 0;
  let failed = 0;

  for (const [key, value] of Object.entries(fileCredentials)) {
    try {
      await keytar.setPassword(SERVICE_NAME, key, value);
      await removeFromFile(key);
      migrated++;
    } catch {
      failed++;
    }
  }

  return { migrated, failed };
}

// --- File-based fallback storage ---

/**
 * Get credential from file
 */
async function getFromFile(key) {
  try {
    if (!await fs.pathExists(FALLBACK_FILE)) {
      return null;
    }
    const data = await fs.readJson(FALLBACK_FILE);
    return data[key] || null;
  } catch {
    return null;
  }
}

/**
 * Save credential to file
 */
async function saveToFile(key, value) {
  try {
    await fs.ensureDir(CONFIG_DIR);

    let data = {};
    if (await fs.pathExists(FALLBACK_FILE)) {
      data = await fs.readJson(FALLBACK_FILE);
    }

    data[key] = value;
    await fs.writeJson(FALLBACK_FILE, data, { mode: 0o600 });

    // Set restrictive permissions on the file
    await fs.chmod(FALLBACK_FILE, 0o600);

    return true;
  } catch {
    return false;
  }
}

/**
 * Remove credential from file
 */
async function removeFromFile(key) {
  try {
    if (!await fs.pathExists(FALLBACK_FILE)) {
      return false;
    }

    const data = await fs.readJson(FALLBACK_FILE);
    if (!(key in data)) {
      return false;
    }

    delete data[key];

    if (Object.keys(data).length === 0) {
      await fs.remove(FALLBACK_FILE);
    } else {
      await fs.writeJson(FALLBACK_FILE, data, { mode: 0o600 });
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Get all credentials from file
 */
async function getAllFromFile() {
  try {
    if (!await fs.pathExists(FALLBACK_FILE)) {
      return {};
    }
    return await fs.readJson(FALLBACK_FILE);
  } catch {
    return {};
  }
}

// --- Convenience methods for specific credentials ---

/**
 * Get GitHub token
 */
async function getGitHubToken() {
  return getCredential('github-token');
}

/**
 * Set GitHub token
 */
async function setGitHubToken(token) {
  return setCredential('github-token', token);
}

/**
 * Delete GitHub token
 */
async function deleteGitHubToken() {
  return deleteCredential('github-token');
}

/**
 * Get Gemini API key
 */
async function getGeminiKey() {
  return getCredential('gemini-key');
}

/**
 * Set Gemini API key
 */
async function setGeminiKey(key) {
  return setCredential('gemini-key', key);
}

/**
 * Delete Gemini API key
 */
async function deleteGeminiKey() {
  return deleteCredential('gemini-key');
}

module.exports = {
  // Core methods
  isSecureStorageAvailable,
  getCredential,
  setCredential,
  deleteCredential,
  getAllCredentials,
  migrateToSecureStorage,

  // Convenience methods
  getGitHubToken,
  setGitHubToken,
  deleteGitHubToken,
  getGeminiKey,
  setGeminiKey,
  deleteGeminiKey
};
