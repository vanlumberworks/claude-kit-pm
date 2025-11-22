/**
 * Error handling utilities for PM Kit CLI
 */

const pc = require('picocolors');

class PMKitError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'PMKitError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Error codes
 */
const ErrorCodes = {
  // Authentication errors
  AUTH_FAILED: 'AUTH_FAILED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',

  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  RATE_LIMIT: 'RATE_LIMIT',

  // File system errors
  FS_ERROR: 'FS_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',

  // GitHub errors
  GITHUB_ERROR: 'GITHUB_ERROR',
  REPO_NOT_FOUND: 'REPO_NOT_FOUND',
  RELEASE_NOT_FOUND: 'RELEASE_NOT_FOUND',

  // Configuration errors
  CONFIG_ERROR: 'CONFIG_ERROR',
  INVALID_CONFIG: 'INVALID_CONFIG',
  MISSING_CONFIG: 'MISSING_CONFIG',

  // Installation errors
  ALREADY_INITIALIZED: 'ALREADY_INITIALIZED',
  NOT_INITIALIZED: 'NOT_INITIALIZED',
  VERSION_MISMATCH: 'VERSION_MISMATCH',

  // API errors
  API_ERROR: 'API_ERROR',
  API_KEY_INVALID: 'API_KEY_INVALID',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',

  // Unknown errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

/**
 * Handle errors with user-friendly messages
 */
function handleError(error, context = '') {
  console.error();

  // PMKit errors
  if (error instanceof PMKitError) {
    console.error(pc.red(`✖ ${error.message}`));

    if (error.details && Object.keys(error.details).length > 0) {
      console.error();
      Object.entries(error.details).forEach(([key, value]) => {
        console.error(pc.gray(`  ${key}: ${value}`));
      });
    }

    // Provide helpful guidance based on error code
    console.error();
    console.error(getErrorGuidance(error.code));
    return;
  }

  // GitHub API errors
  if (error.status) {
    handleGitHubError(error);
    return;
  }

  // File system errors
  if (error.code && error.code.startsWith('E')) {
    handleFileSystemError(error);
    return;
  }

  // Network errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
    handleNetworkError(error);
    return;
  }

  // Generic error
  console.error(pc.red(`✖ An error occurred${context ? ` during ${context}` : ''}:`));
  console.error(pc.gray(error.message));

  if (error.stack && process.env.DEBUG) {
    console.error();
    console.error(pc.gray('Stack trace:'));
    console.error(pc.gray(error.stack));
  }

  console.error();
  console.error(pc.yellow('For help, please visit:'));
  console.error(pc.cyan('https://github.com/your-org/claude-kit-pm/issues'));
  console.error();
}

/**
 * Handle GitHub API errors
 */
function handleGitHubError(error) {
  console.error(pc.red('✖ GitHub API Error:'));

  switch (error.status) {
    case 401:
      console.error(pc.gray('  Authentication failed. Your GitHub token is invalid or expired.'));
      console.error();
      console.error(pc.yellow('To fix this:'));
      console.error('  1. Generate a new token at:', pc.cyan('https://github.com/settings/tokens'));
      console.error('  2. Ensure the token has', pc.bold('repo'), 'scope');
      console.error('  3. Run:', pc.cyan('pm-kit init --reset-token'));
      break;

    case 403:
      if (error.message && error.message.includes('rate limit')) {
        console.error(pc.gray('  GitHub API rate limit exceeded.'));
        console.error();
        console.error(pc.yellow('To fix this:'));
        console.error('  1. Wait for the rate limit to reset');
        console.error('  2. Use an authenticated token for higher limits');
      } else {
        console.error(pc.gray('  Access forbidden. You may not have permission to access this repository.'));
        console.error();
        console.error(pc.yellow('To fix this:'));
        console.error('  1. Verify you have access to the private repository');
        console.error('  2. Ensure your token has the correct permissions');
      }
      break;

    case 404:
      console.error(pc.gray('  Repository or resource not found.'));
      console.error();
      console.error(pc.yellow('To fix this:'));
      console.error('  1. Verify the repository name is correct');
      console.error('  2. Ensure you have access to the private repository');
      console.error('  3. Check your GitHub token permissions');
      break;

    default:
      console.error(pc.gray(`  Status: ${error.status}`));
      console.error(pc.gray(`  Message: ${error.message}`));
  }

  console.error();
}

/**
 * Handle file system errors
 */
function handleFileSystemError(error) {
  console.error(pc.red('✖ File System Error:'));

  switch (error.code) {
    case 'EACCES':
      console.error(pc.gray(`  Permission denied: ${error.path}`));
      console.error();
      console.error(pc.yellow('To fix this:'));
      console.error('  1. Check file/directory permissions');
      console.error('  2. Try running with appropriate permissions');
      console.error('  3. On Unix/Linux:', pc.cyan('chmod -R u+w <directory>'));
      break;

    case 'ENOENT':
      console.error(pc.gray(`  File or directory not found: ${error.path}`));
      console.error();
      console.error(pc.yellow('To fix this:'));
      console.error('  1. Verify the path exists');
      console.error('  2. Check for typos in the path');
      console.error('  3. Ensure PM Kit is properly initialized');
      break;

    case 'EEXIST':
      console.error(pc.gray(`  File or directory already exists: ${error.path}`));
      console.error();
      console.error(pc.yellow('To fix this:'));
      console.error('  1. Remove or rename the existing file/directory');
      console.error('  2. Use the --force flag to overwrite');
      break;

    case 'ENOSPC':
      console.error(pc.gray('  No space left on device'));
      console.error();
      console.error(pc.yellow('To fix this:'));
      console.error('  1. Free up disk space');
      console.error('  2. Remove unnecessary files');
      break;

    default:
      console.error(pc.gray(`  Code: ${error.code}`));
      console.error(pc.gray(`  Message: ${error.message}`));
      if (error.path) {
        console.error(pc.gray(`  Path: ${error.path}`));
      }
  }

  console.error();
}

/**
 * Handle network errors
 */
function handleNetworkError(error) {
  console.error(pc.red('✖ Network Error:'));

  switch (error.code) {
    case 'ECONNREFUSED':
      console.error(pc.gray('  Connection refused. The server is not responding.'));
      console.error();
      console.error(pc.yellow('To fix this:'));
      console.error('  1. Check your internet connection');
      console.error('  2. Verify the service is available');
      console.error('  3. Try again in a few moments');
      break;

    case 'ETIMEDOUT':
      console.error(pc.gray('  Connection timed out.'));
      console.error();
      console.error(pc.yellow('To fix this:'));
      console.error('  1. Check your internet connection');
      console.error('  2. Try again with a more stable connection');
      console.error('  3. Check if you\'re behind a proxy or firewall');
      break;

    case 'ENOTFOUND':
      console.error(pc.gray('  Could not resolve hostname. DNS lookup failed.'));
      console.error();
      console.error(pc.yellow('To fix this:'));
      console.error('  1. Check your internet connection');
      console.error('  2. Verify DNS settings');
      console.error('  3. Try using a different network');
      break;

    default:
      console.error(pc.gray(`  Code: ${error.code}`));
      console.error(pc.gray(`  Message: ${error.message}`));
  }

  console.error();
}

/**
 * Get error guidance based on error code
 */
function getErrorGuidance(code) {
  const guidance = {
    [ErrorCodes.AUTH_FAILED]: 'Run: pm-kit config set github-token YOUR_TOKEN',
    [ErrorCodes.TOKEN_INVALID]: 'Generate a new token at: https://github.com/settings/tokens',
    [ErrorCodes.ALREADY_INITIALIZED]: 'Use: pm-kit update to update existing installation',
    [ErrorCodes.NOT_INITIALIZED]: 'Run: pm-kit init to initialize PM Kit first',
    [ErrorCodes.API_KEY_INVALID]: 'Run: pm-kit init --reconfigure-api to set up API keys',
    [ErrorCodes.VERSION_MISMATCH]: 'Run: pm-kit update to sync versions'
  };

  return pc.yellow(guidance[code] || 'For help, visit: https://github.com/your-org/claude-kit-pm/issues');
}

module.exports = {
  PMKitError,
  ErrorCodes,
  handleError,
  handleGitHubError,
  handleFileSystemError,
  handleNetworkError
};
