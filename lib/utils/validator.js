/**
 * Validation utilities using Zod
 */

const { z } = require('zod');

// Config schema
const configSchema = z.object({
  githubToken: z.string().optional(),
  geminiKey: z.string().optional(),
  installedVersion: z.string().optional(),
  installDate: z.string().datetime().optional(),
  lastUpdateCheck: z.string().datetime().optional(),
  excludePatterns: z.array(z.string()).optional(),
  preferences: z.object({
    autoUpdate: z.boolean().optional(),
    showAnimations: z.boolean().optional(),
    verboseMode: z.boolean().optional()
  }).optional()
});

// MCP server config schema
const mcpServerSchema = z.object({
  command: z.string(),
  args: z.array(z.string()).optional(),
  env: z.record(z.string()).optional()
});

const mcpConfigSchema = z.object({
  mcpServers: z.record(mcpServerSchema).optional()
});

// File hash schema (for tracking changes)
const fileHashSchema = z.object({
  path: z.string(),
  hash: z.string(),
  timestamp: z.number()
});

const fileHashesSchema = z.object({
  version: z.string(),
  files: z.array(fileHashSchema)
});

// API key validation
const apiKeySchemas = {
  gemini: z.string().min(30).regex(/^[A-Za-z0-9_-]+$/, 'Invalid Gemini API key format'),
  github: z.string().min(10).regex(/^(ghp_|github_pat_|gho_)/, 'Invalid GitHub token format')
};

/**
 * Validate configuration object
 */
function validateConfig(config) {
  return configSchema.safeParse(config);
}

/**
 * Validate MCP configuration
 */
function validateMcpConfig(config) {
  return mcpConfigSchema.safeParse(config);
}

/**
 * Validate file hashes
 */
function validateFileHashes(hashes) {
  return fileHashesSchema.safeParse(hashes);
}

/**
 * Validate API key format
 */
function validateApiKey(type, key) {
  if (!apiKeySchemas[type]) {
    return { success: false, error: { message: `Unknown API key type: ${type}` } };
  }
  return apiKeySchemas[type].safeParse(key);
}

/**
 * Validate semver version string
 */
function validateVersion(version) {
  const semverRegex = /^v?\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
  return semverRegex.test(version);
}

/**
 * Validate GitHub repository format
 */
function validateRepository(repo) {
  const repoRegex = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;
  return repoRegex.test(repo);
}

/**
 * Validate file path (no directory traversal)
 */
function validateFilePath(filePath) {
  // Prevent directory traversal attacks
  const normalized = filePath.replace(/\\/g, '/');
  if (normalized.includes('..') || normalized.startsWith('/')) {
    return false;
  }
  return true;
}

/**
 * Validate glob pattern
 */
function validateGlobPattern(pattern) {
  // Basic glob pattern validation
  try {
    // Check for valid glob characters
    const invalidChars = /[<>:"|?]/;
    return !invalidChars.test(pattern);
  } catch {
    return false;
  }
}

/**
 * Create a custom validator with error messages
 */
function createValidator(schema) {
  return (data) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const errors = result.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      return { valid: false, errors };
    }
    return { valid: true, data: result.data };
  };
}

// Export schemas for reuse
module.exports = {
  // Schemas
  configSchema,
  mcpConfigSchema,
  mcpServerSchema,
  fileHashSchema,
  fileHashesSchema,
  apiKeySchemas,

  // Validators
  validateConfig,
  validateMcpConfig,
  validateFileHashes,
  validateApiKey,
  validateVersion,
  validateRepository,
  validateFilePath,
  validateGlobPattern,
  createValidator,

  // Zod re-export for custom schemas
  z
};
