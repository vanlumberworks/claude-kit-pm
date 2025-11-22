/**
 * Constants and configuration defaults for PM Kit CLI
 */

const path = require('path');
const os = require('os');

module.exports = {
  // Kit repository configuration
  KIT_REPOSITORY: process.env.PMKIT_REPO || 'kv0906/pm-kit',
  KIT_REPOSITORY_BRANCH: 'main',

  // Configuration paths
  GLOBAL_CONFIG_DIR: path.join(os.homedir(), '.pm-kit'),
  GLOBAL_CONFIG_FILE: path.join(os.homedir(), '.pm-kit', 'config.json'),
  LOCAL_CONFIG_DIR: '.pm-kit',
  LOCAL_CONFIG_FILE: '.pm-kit/local-config.json',

  // Installation paths
  CLAUDE_DIR: '.claude',
  MCP_CONFIG_FILE: '.mcp.json',

  // Required directories
  REQUIRED_DIRS: [
    '.claude/workflows',
    '.claude/agents',
    '.claude/commands',
    '.claude/templates',
    '.claude/skills',
    'templates',
    'prds/active',
    'prds/archive',
    'research/user-interviews',
    'research/surveys',
    'research/insights',
    'research/personas',
    'decisions/logs',
    'decisions/templates',
    'outputs/research-reports',
    'outputs/consensus-reports',
    'outputs/decision-matrices',
    'outputs/evidence-logs'
  ],

  // Expected file counts
  EXPECTED_FILES: {
    workflows: 18,
    agents: 10,
    commands: 16,
    templates: 4,
    skills: 5
  },

  // Files to download from kit repository
  DOWNLOAD_PATHS: [
    '.claude',
    'CLAUDE.md'
  ],

  // Default exclusion patterns (never overwrite)
  DEFAULT_EXCLUSIONS: [
    '.mcp.json',
    '.pm-kit/**',
    'docs/**',
    'prds/active/**',
    'prds/archive/**',
    'research/**',
    'decisions/logs/**',
    'outputs/**',
    '.claude/custom-prompts/**',
    'company/**'
  ],

  // Gitignore entries
  GITIGNORE_ENTRIES: `
# PM Kit - API Keys (DO NOT COMMIT)
.mcp.json
.env

# PM Kit - Local Configuration
.pm-kit/
local-config.json

# PM Kit - Generated Outputs
outputs/
`,

  // MCP servers configuration
  MCP_SERVERS: {
    'gemini': {
      required: false,
      command: 'npx',
      args: ['-y', '@anthropic-ai/claude-code-mcp-server-gemini'],
      envVar: 'GEMINI_API_KEY',
      apiKeyName: 'geminiKey',
      description: 'Gemini API for multi-modal analysis and enhanced AI capabilities'
    }
  },

  // API key URLs
  API_KEY_URLS: {
    gemini: 'https://ai.google.dev/'
  },

  // GitHub token scopes required
  GITHUB_TOKEN_SCOPES: ['repo'],

  // CLI version
  CLI_VERSION: require('../package.json').version,

  // Minimum required versions
  MIN_NODE_VERSION: '16.0.0',
  MIN_NPM_VERSION: '10.0.0',

  // Timeout settings (milliseconds)
  GITHUB_TIMEOUT: 30000,
  API_TEST_TIMEOUT: 10000,

  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,

  // Colors for console output
  COLORS: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    muted: '#6B7280'
  }
};
