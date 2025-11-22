/**
 * PM Kit CLI - Main entry point
 * Exports all modules for programmatic usage
 */

// Services
const githubService = require('./services/github-service');
const mcpService = require('./services/mcp-service');
const credentialService = require('./services/credential-service');

// Utilities
const logger = require('./utils/logger');
const fileManager = require('./utils/file-manager');
const errorHandler = require('./utils/error-handler');
const prompts = require('./utils/prompts');
const validator = require('./utils/validator');

// Constants
const constants = require('./constants');

// Commands
const init = require('./commands/init');
const update = require('./commands/update');
const doctor = require('./commands/doctor');
const config = require('./commands/config');
const versions = require('./commands/versions');
const uninstall = require('./commands/uninstall');

module.exports = {
  // Services
  services: {
    github: githubService,
    mcp: mcpService,
    credentials: credentialService
  },

  // Utilities
  utils: {
    logger,
    fileManager,
    errorHandler,
    prompts,
    validator
  },

  // Constants
  constants,

  // Commands (for programmatic usage)
  commands: {
    init,
    update,
    doctor,
    config,
    versions,
    uninstall
  },

  // Direct exports for convenience
  logger,
  fileManager,
  githubService,
  credentialService,
  validator
};
