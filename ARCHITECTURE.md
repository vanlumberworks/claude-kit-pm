# Claude Kit PM - Technical Architecture

## System Overview

Claude Kit PM is a CLI-based installer and management tool that provides Product Manager workflows through the Claude CLI. It consists of:

1. **CLI Installer** (`pm-kit-cli` npm package)
2. **Kit Files Repository** (private GitHub repo with prompts, commands, skills)
3. **Claude CLI Integration** (leverages existing Claude CLI infrastructure)
4. **MCP Server Configuration** (for search and external tool access)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         User Machine                         │
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │   pm-kit     │────────▶│  Kit Files   │                 │
│  │     CLI      │         │  Repository  │                 │
│  │  (npm pkg)   │◀────────│  (private)   │                 │
│  └──────────────┘         └──────────────┘                 │
│         │                                                   │
│         │ installs/manages                                 │
│         ▼                                                   │
│  ┌──────────────────────────────────────┐                 │
│  │       Project Directory               │                 │
│  │  ┌────────────────────────────────┐  │                 │
│  │  │  .claude/                       │  │                 │
│  │  │  ├── commands/                  │  │                 │
│  │  │  ├── prompts/                   │  │                 │
│  │  │  └── skills/                    │  │                 │
│  │  │                                 │  │                 │
│  │  │  CLAUDE.md                      │  │                 │
│  │  │  .mcp.json                      │  │                 │
│  │  │                                 │  │                 │
│  │  │  docs/                          │  │                 │
│  │  │  ├── prd/                       │  │                 │
│  │  │  ├── research/                  │  │                 │
│  │  │  └── user-stories/              │  │                 │
│  │  └────────────────────────────────┘  │                 │
│  └──────────────────────────────────────┘                 │
│                    │                                        │
│                    │ reads config                          │
│                    ▼                                        │
│  ┌──────────────────────────────────────┐                 │
│  │         Claude CLI                    │                 │
│  │  (user runs `claude`)                 │                 │
│  │                                       │                 │
│  │  Executes slash commands:             │                 │
│  │  /draft, /research, /stories, etc.   │                 │
│  └──────────────────────────────────────┘                 │
│                    │                                        │
│                    │ uses                                  │
│                    ▼                                        │
│  ┌──────────────────────────────────────┐                 │
│  │         MCP Servers                   │                 │
│  │  (configured in .mcp.json)            │                 │
│  │  - Brave Search                       │                 │
│  │  - Perplexity (future)                │                 │
│  │  - Gemini (future)                    │                 │
│  └──────────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. CLI Installer (`pm-kit-cli`)

**Technology Stack:**
- Node.js (v16+)
- Package managers: npm, yarn, pnpm, bun
- Distribution: npm registry (public package)

**Core Responsibilities:**
- Install kit files to user's project directory
- Manage GitHub authentication
- Configure API keys and MCP servers
- Update kit files from remote repository
- Run diagnostics and health checks

**File Structure:**

```
pm-kit-cli/
├── bin/
│   └── pm-kit.js              # CLI entry point
├── lib/
│   ├── commands/
│   │   ├── init.js            # Initialize project
│   │   ├── update.js          # Update kit files
│   │   ├── doctor.js          # Run diagnostics
│   │   └── version.js         # Show version
│   ├── utils/
│   │   ├── github.js          # GitHub API operations
│   │   ├── prompts.js         # Interactive prompts
│   │   ├── config.js          # Configuration management
│   │   └── file-manager.js    # File operations
│   └── index.js               # Main CLI router
├── package.json
└── README.md
```

---

### 2. Commands Implementation

#### `pm-kit init`

**Flow:**

1. **Pre-flight Checks:**
   ```javascript
   // Check if already initialized
   if (fs.existsSync('.claude') || fs.existsSync('CLAUDE.md')) {
     prompt: "Kit already installed. Reinitialize? (y/n)"
   }
   ```

2. **GitHub Authentication:**
   ```javascript
   // Priority order:
   // 1. GITHUB_TOKEN env variable
   // 2. ~/.pm-kit/config.json (saved from previous init)
   // 3. Interactive prompt

   const token = process.env.GITHUB_TOKEN
     || loadSavedToken()
     || await promptForToken();

   // Validate token
   await validateGitHubToken(token);

   // Optionally save
   if (await promptSaveToken()) {
     saveToken(token);
   }
   ```

3. **Clone Kit Files:**
   ```javascript
   // Options:
   // A. Git clone (if user has git)
   // B. GitHub API download (no git required)

   const kitRepo = 'your-org/claude-kit-pm-files';
   const targetDir = process.cwd();

   // Download specific directories
   await downloadGitHubDirectory(kitRepo, '.claude', targetDir);
   await downloadGitHubFile(kitRepo, 'CLAUDE.md', targetDir);
   await downloadGitHubDirectory(kitRepo, 'templates', targetDir);
   ```

4. **API Key Configuration:**
   ```javascript
   const braveApiKey = await prompt({
     type: 'password',
     message: 'Enter your Brave Search API key:',
     validate: (value) => value.length > 0
   });

   // Optional keys
   const perplexityKey = await prompt({
     type: 'password',
     message: 'Enter Perplexity API key (optional, press enter to skip):'
   });

   // Generate .mcp.json
   const mcpConfig = {
     mcpServers: {
       'brave-search': {
         command: 'npx',
         args: ['-y', '@modelcontextprotocol/server-brave-search'],
         env: {
           BRAVE_API_KEY: braveApiKey
         }
       }
     }
   };

   if (perplexityKey) {
     mcpConfig.mcpServers['perplexity'] = {
       command: 'npx',
       args: ['-y', '@modelcontextprotocol/server-perplexity'],
       env: {
         PERPLEXITY_API_KEY: perplexityKey
       }
     };
   }

   fs.writeFileSync('.mcp.json', JSON.stringify(mcpConfig, null, 2));
   ```

5. **Create Output Directories:**
   ```javascript
   const directories = [
     'docs/prd',
     'docs/research',
     'docs/user-stories',
     'docs/acceptance-criteria'
   ];

   directories.forEach(dir => {
     fs.mkdirSync(dir, { recursive: true });
   });
   ```

6. **Add to .gitignore:**
   ```javascript
   const gitignoreEntries = `
# PM Kit - API Keys
.mcp.json

# PM Kit - Local Config
.pm-kit/
`;

   fs.appendFileSync('.gitignore', gitignoreEntries);
   ```

7. **Success Output:**
   ```javascript
   console.log(chalk.green('✔️  Installed Product Manager Kit'));
   console.log(chalk.green('✔️  Configured API access'));
   console.log('\nNext steps:');
   console.log('  1. Run: claude');
   console.log('  2. Use: /draft, /research, /stories');
   ```

---

#### `pm-kit update`

**Flow:**

1. **Check for Local Changes:**
   ```javascript
   // Detect if user has modified core files
   const modifiedFiles = await detectLocalChanges();

   if (modifiedFiles.length > 0 && !options.force) {
     console.warn('Local changes detected in:');
     modifiedFiles.forEach(f => console.log(`  - ${f}`));
     const proceed = await confirm('Proceed with update?');
     if (!proceed) return;
   }
   ```

2. **Fetch Latest Version:**
   ```javascript
   const currentVersion = readLocalVersion();
   const latestVersion = await fetchLatestVersion(kitRepo);

   if (currentVersion === latestVersion) {
     console.log('Already up to date!');
     return;
   }

   console.log(`Updating ${currentVersion} → ${latestVersion}`);
   ```

3. **Download Updates:**
   ```javascript
   // Respect exclusion patterns
   const excludePatterns = options.exclude || [];

   const filesToUpdate = await getUpdateableFiles(kitRepo, excludePatterns);

   for (const file of filesToUpdate) {
     await downloadAndReplace(file);
   }
   ```

4. **Preserve Custom Files:**
   ```javascript
   // Default exclusions
   const defaultExcludes = [
     '.claude/custom-prompts/**',
     'company/**',
     '.mcp.json',
     'docs/**'
   ];

   // Merge with user-provided excludes
   const allExcludes = [...defaultExcludes, ...excludePatterns];
   ```

5. **Show Changelog:**
   ```javascript
   const changelog = await fetchChangelog(currentVersion, latestVersion);

   console.log('\nWhat\'s new:');
   changelog.forEach(change => {
     console.log(`  - ${change}`);
   });
   ```

---

#### `pm-kit doctor`

**Diagnostic Checks:**

```javascript
async function runDiagnostics() {
  const results = {
    fileStructure: await checkFileStructure(),
    apiConfig: await checkAPIConfiguration(),
    claudeCLI: await checkClaudeCLI(),
    permissions: await checkPermissions(),
    connectivity: await checkConnectivity()
  };

  return results;
}

// Individual check functions

async function checkFileStructure() {
  const requiredFiles = [
    'CLAUDE.md',
    '.claude/commands',
    '.claude/prompts',
    '.claude/skills',
    '.mcp.json'
  ];

  const checks = requiredFiles.map(file => ({
    name: file,
    exists: fs.existsSync(file),
    type: fs.existsSync(file) ? (fs.statSync(file).isDirectory() ? 'dir' : 'file') : null
  }));

  return checks;
}

async function checkAPIConfiguration() {
  const mcpConfig = JSON.parse(fs.readFileSync('.mcp.json', 'utf8'));

  const checks = [];

  // Check Brave Search
  if (mcpConfig.mcpServers['brave-search']) {
    const apiKey = mcpConfig.mcpServers['brave-search'].env.BRAVE_API_KEY;
    const valid = await testBraveAPI(apiKey);
    checks.push({
      name: 'Brave Search API',
      configured: !!apiKey,
      valid: valid
    });
  }

  // Check other APIs...

  return checks;
}

async function checkClaudeCLI() {
  try {
    const { stdout } = await exec('claude --version');
    return {
      installed: true,
      version: stdout.trim()
    };
  } catch (error) {
    return {
      installed: false,
      message: 'Install from https://claude.ai/code'
    };
  }
}

async function checkPermissions() {
  const dirsToCheck = ['docs/', '.claude/', './'];

  const checks = dirsToCheck.map(dir => ({
    path: dir,
    readable: fs.accessSync(dir, fs.constants.R_OK),
    writable: fs.accessSync(dir, fs.constants.W_OK)
  }));

  return checks;
}

async function checkConnectivity() {
  const endpoints = [
    { name: 'GitHub API', url: 'https://api.github.com' },
    { name: 'Brave API', url: 'https://api.search.brave.com' }
  ];

  const checks = await Promise.all(
    endpoints.map(async ({ name, url }) => {
      try {
        await fetch(url);
        return { name, reachable: true };
      } catch (error) {
        return { name, reachable: false, error: error.message };
      }
    })
  );

  return checks;
}
```

**Output Formatting:**

```javascript
function formatDiagnosticResults(results) {
  console.log('\n' + chalk.bold('Running diagnostics...\n'));

  // File Structure
  console.log(chalk.bold('File Structure:'));
  results.fileStructure.forEach(check => {
    const icon = check.exists ? chalk.green('✔️') : chalk.red('✖️');
    console.log(`  ${icon}  ${check.name}`);
  });

  // API Configuration
  console.log('\n' + chalk.bold('API Configuration:'));
  results.apiConfig.forEach(check => {
    const icon = check.valid ? chalk.green('✔️') : chalk.yellow('⚠️');
    const status = check.valid ? 'OK' : 'Invalid/Not configured';
    console.log(`  ${icon}  ${check.name}: ${status}`);
  });

  // Claude CLI
  console.log('\n' + chalk.bold('Claude CLI:'));
  if (results.claudeCLI.installed) {
    console.log(`  ${chalk.green('✔️')}  Installed (${results.claudeCLI.version})`);
  } else {
    console.log(`  ${chalk.red('✖️')}  Not found`);
    console.log(`      ${results.claudeCLI.message}`);
  }

  // Permissions
  console.log('\n' + chalk.bold('Permissions:'));
  results.permissions.forEach(check => {
    const readable = check.readable ? 'R' : '-';
    const writable = check.writable ? 'W' : '-';
    const icon = (check.readable && check.writable) ? chalk.green('✔️') : chalk.yellow('⚠️');
    console.log(`  ${icon}  ${check.path}: ${readable}${writable}`);
  });

  // Connectivity
  console.log('\n' + chalk.bold('Connectivity:'));
  results.connectivity.forEach(check => {
    const icon = check.reachable ? chalk.green('✔️') : chalk.red('✖️');
    console.log(`  ${icon}  ${check.name}`);
  });

  // Summary
  const issues = countIssues(results);
  if (issues === 0) {
    console.log('\n' + chalk.green.bold('All checks passed! ✨'));
  } else {
    console.log('\n' + chalk.yellow.bold(`${issues} issue(s) found.`));
  }
}
```

---

### 3. GitHub Integration

**Authentication Methods:**

```javascript
class GitHubManager {
  constructor() {
    this.token = null;
    this.octokit = null;
  }

  async authenticate() {
    // Try multiple sources in order
    this.token =
      process.env.GITHUB_TOKEN ||
      this.loadSavedToken() ||
      await this.promptForToken();

    // Initialize Octokit
    const { Octokit } = require('@octokit/rest');
    this.octokit = new Octokit({ auth: this.token });

    // Validate
    await this.validateToken();
  }

  async validateToken() {
    try {
      const { data } = await this.octokit.users.getAuthenticated();
      console.log(chalk.green(`✔️  Authenticated as ${data.login}`));
      return true;
    } catch (error) {
      console.error(chalk.red('✖️  Invalid GitHub token'));
      throw error;
    }
  }

  loadSavedToken() {
    const configPath = path.join(os.homedir(), '.pm-kit', 'config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return config.githubToken;
    }
    return null;
  }

  async promptForToken() {
    const { token } = await prompts({
      type: 'password',
      name: 'token',
      message: 'Enter GitHub Personal Access Token:',
      validate: value => value.length > 0 || 'Token required'
    });

    const { save } = await prompts({
      type: 'confirm',
      name: 'save',
      message: 'Save token for future use?',
      initial: true
    });

    if (save) {
      this.saveToken(token);
    }

    return token;
  }

  saveToken(token) {
    const configDir = path.join(os.homedir(), '.pm-kit');
    fs.mkdirSync(configDir, { recursive: true });

    const configPath = path.join(configDir, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify({ githubToken: token }, null, 2));

    // Secure the file (Unix-like systems)
    if (process.platform !== 'win32') {
      fs.chmodSync(configPath, 0o600);
    }
  }

  async downloadDirectory(repo, remotePath, localPath) {
    const [owner, repoName] = repo.split('/');

    const { data } = await this.octokit.repos.getContent({
      owner,
      repo: repoName,
      path: remotePath
    });

    for (const item of data) {
      if (item.type === 'file') {
        await this.downloadFile(repo, item.path, path.join(localPath, item.name));
      } else if (item.type === 'dir') {
        await this.downloadDirectory(repo, item.path, path.join(localPath, item.name));
      }
    }
  }

  async downloadFile(repo, remotePath, localPath) {
    const [owner, repoName] = repo.split('/');

    const { data } = await this.octokit.repos.getContent({
      owner,
      repo: repoName,
      path: remotePath
    });

    const content = Buffer.from(data.content, 'base64').toString('utf8');

    fs.mkdirSync(path.dirname(localPath), { recursive: true });
    fs.writeFileSync(localPath, content);
  }
}
```

---

### 4. MCP Configuration

**`.mcp.json` Structure:**

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "${BRAVE_API_KEY}"
      }
    },
    "perplexity": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-perplexity"],
      "env": {
        "PERPLEXITY_API_KEY": "${PERPLEXITY_API_KEY}"
      },
      "disabled": true
    },
    "gemini": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gemini"],
      "env": {
        "GEMINI_API_KEY": "${GEMINI_API_KEY}"
      },
      "disabled": true
    }
  }
}
```

**API Key Management:**

```javascript
class MCPConfigManager {
  constructor(configPath = '.mcp.json') {
    this.configPath = configPath;
    this.config = this.load();
  }

  load() {
    if (fs.existsSync(this.configPath)) {
      return JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
    }
    return { mcpServers: {} };
  }

  save() {
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
  }

  addServer(name, config) {
    this.config.mcpServers[name] = config;
    this.save();
  }

  removeServer(name) {
    delete this.config.mcpServers[name];
    this.save();
  }

  setAPIKey(serverName, apiKey) {
    if (this.config.mcpServers[serverName]) {
      this.config.mcpServers[serverName].env = {
        ...this.config.mcpServers[serverName].env,
        [`${serverName.toUpperCase().replace('-', '_')}_API_KEY`]: apiKey
      };
      this.save();
    }
  }

  enableServer(serverName) {
    if (this.config.mcpServers[serverName]) {
      delete this.config.mcpServers[serverName].disabled;
      this.save();
    }
  }

  disableServer(serverName) {
    if (this.config.mcpServers[serverName]) {
      this.config.mcpServers[serverName].disabled = true;
      this.save();
    }
  }
}
```

---

### 5. Kit Files Repository Structure

**Private GitHub Repository:**

```
claude-kit-pm-files/
├── .claude/
│   ├── commands/
│   │   ├── draft.md              # /draft command
│   │   ├── research.md           # /research command
│   │   ├── stories.md            # /stories command
│   │   ├── acceptance.md         # /acceptance-criteria command
│   │   └── market.md             # /market command
│   ├── prompts/
│   │   ├── pm-persona.md         # PM agent persona
│   │   ├── prd-template.md       # PRD structure
│   │   └── research-template.md  # Research format
│   └── skills/
│       ├── web-research.md       # Research skill
│       └── document-writer.md    # Document generation
├── templates/
│   ├── prd/
│   │   └── default.md
│   ├── user-story/
│   │   └── default.md
│   └── research/
│       └── competitive-analysis.md
├── CLAUDE.md                      # Main routing config
├── version.json                   # Version tracking
└── CHANGELOG.md                   # Release notes
```

**version.json:**

```json
{
  "version": "1.2.0",
  "releaseDate": "2024-01-15",
  "minCliVersion": "1.0.0",
  "changes": [
    "Added /roadmap command",
    "Improved /draft template",
    "Bug fixes in research tool"
  ]
}
```

---

### 6. Update Mechanism

**Version Comparison:**

```javascript
class VersionManager {
  compareVersions(current, latest) {
    const [currMajor, currMinor, currPatch] = current.split('.').map(Number);
    const [latestMajor, latestMinor, latestPatch] = latest.split('.').map(Number);

    if (latestMajor > currMajor) return 'major';
    if (latestMinor > currMinor) return 'minor';
    if (latestPatch > currPatch) return 'patch';
    return 'current';
  }

  async fetchLatestVersion(repo) {
    const versionData = await githubManager.downloadFile(repo, 'version.json');
    return JSON.parse(versionData);
  }

  async getChangelog(repo, fromVersion, toVersion) {
    const changelog = await githubManager.downloadFile(repo, 'CHANGELOG.md');

    // Parse changelog between versions
    const changes = this.parseChangelogBetween(changelog, fromVersion, toVersion);
    return changes;
  }

  parseChangelogBetween(changelog, from, to) {
    // Extract version sections
    const sections = changelog.split(/^## /m);

    const fromIndex = sections.findIndex(s => s.startsWith(from));
    const toIndex = sections.findIndex(s => s.startsWith(to));

    return sections.slice(toIndex, fromIndex).join('\n');
  }
}
```

**Selective Update:**

```javascript
class UpdateManager {
  constructor(excludePatterns = []) {
    this.excludePatterns = [
      ...excludePatterns,
      '.mcp.json',           // Never update API keys
      'docs/**',             // Never update user docs
      '.claude/custom-prompts/**'  // Never update custom prompts
    ];
  }

  shouldUpdateFile(filePath) {
    return !this.excludePatterns.some(pattern =>
      minimatch(filePath, pattern)
    );
  }

  async updateFiles(repo, dryRun = false) {
    const remoteFiles = await githubManager.listAllFiles(repo);
    const filesToUpdate = remoteFiles.filter(f => this.shouldUpdateFile(f));

    if (dryRun) {
      console.log('Files that would be updated:');
      filesToUpdate.forEach(f => console.log(`  - ${f}`));
      return;
    }

    for (const file of filesToUpdate) {
      await githubManager.downloadFile(repo, file, file);
      console.log(chalk.green(`✔️  Updated ${file}`));
    }
  }
}
```

---

### 7. Error Handling

**Graceful Degradation:**

```javascript
class ErrorHandler {
  static async handle(error, context) {
    // Network errors - retry logic
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.warn(chalk.yellow('⚠️  Network error, retrying...'));
      await this.retryWithBackoff(context.operation, 3);
      return;
    }

    // GitHub API errors
    if (error.status === 401) {
      console.error(chalk.red('✖️  GitHub authentication failed'));
      console.log('Please check your token and try again.');
      console.log('Create token at: https://github.com/settings/tokens');
      process.exit(1);
    }

    if (error.status === 404) {
      console.error(chalk.red('✖️  Repository not found'));
      console.log('Ensure you have access to the private kit repository.');
      process.exit(1);
    }

    // File system errors
    if (error.code === 'EACCES') {
      console.error(chalk.red('✖️  Permission denied'));
      console.log(`Cannot write to: ${error.path}`);
      console.log('Try running with appropriate permissions.');
      process.exit(1);
    }

    // Generic errors
    console.error(chalk.red('✖️  Unexpected error:'));
    console.error(error.message);
    console.log('\nFor help, visit: https://github.com/your-org/pm-kit-cli/issues');
    process.exit(1);
  }

  static async retryWithBackoff(operation, maxRetries) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
}
```

---

### 8. Security Considerations

**Token Storage:**

```javascript
// Unix: ~/.pm-kit/config.json with 600 permissions
// Windows: %USERPROFILE%\.pm-kit\config.json with user-only access

function secureTokenStorage(token) {
  const configDir = path.join(os.homedir(), '.pm-kit');
  const configFile = path.join(configDir, 'config.json');

  // Create directory
  fs.mkdirSync(configDir, { recursive: true });

  // Write config
  fs.writeFileSync(configFile, JSON.stringify({
    githubToken: token,
    createdAt: new Date().toISOString()
  }, null, 2));

  // Secure permissions (Unix)
  if (process.platform !== 'win32') {
    fs.chmodSync(configFile, 0o600);  // rw-------
  } else {
    // Windows: use icacls to set user-only permissions
    exec(`icacls "${configFile}" /inheritance:r /grant:r "%username%:F"`);
  }
}
```

**API Key Protection:**

```javascript
// .mcp.json should NEVER be committed
// Automatically add to .gitignore during init

function protectAPIKeys() {
  const gitignorePath = '.gitignore';
  const entries = [
    '',
    '# PM Kit - API Keys (DO NOT COMMIT)',
    '.mcp.json',
    '.env',
    '.pm-kit/',
    ''
  ].join('\n');

  if (fs.existsSync(gitignorePath)) {
    const current = fs.readFileSync(gitignorePath, 'utf8');
    if (!current.includes('.mcp.json')) {
      fs.appendFileSync(gitignorePath, entries);
    }
  } else {
    fs.writeFileSync(gitignorePath, entries);
  }
}
```

---

### 9. Testing Strategy

**Unit Tests:**

```javascript
// tests/commands/init.test.js
describe('pm-kit init', () => {
  it('should create .claude directory', async () => {
    await init();
    expect(fs.existsSync('.claude')).toBe(true);
  });

  it('should create CLAUDE.md', async () => {
    await init();
    expect(fs.existsSync('CLAUDE.md')).toBe(true);
  });

  it('should prompt for GitHub token if not in env', async () => {
    delete process.env.GITHUB_TOKEN;
    const promptSpy = jest.spyOn(prompts, 'prompt');

    await init();

    expect(promptSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'password' })
    );
  });
});
```

**Integration Tests:**

```javascript
// tests/integration/full-workflow.test.js
describe('Full workflow', () => {
  it('should init, update, and run doctor successfully', async () => {
    // Init
    await exec('pm-kit init', { env: { GITHUB_TOKEN: TEST_TOKEN } });

    // Verify files
    expect(fs.existsSync('.claude')).toBe(true);
    expect(fs.existsSync('.mcp.json')).toBe(true);

    // Update
    await exec('pm-kit update');

    // Doctor
    const { stdout } = await exec('pm-kit doctor');
    expect(stdout).toContain('All checks passed');
  });
});
```

---

### 10. Deployment & Distribution

**Publishing to npm:**

```bash
# Build and publish
npm version patch  # or minor/major
npm publish

# For scoped packages
npm publish --access public
```

**Package.json:**

```json
{
  "name": "pm-kit-cli",
  "version": "1.2.0",
  "description": "Product Manager Kit CLI installer for Claude",
  "bin": {
    "pm-kit": "./bin/pm-kit.js"
  },
  "keywords": [
    "claude",
    "product-management",
    "pm",
    "cli",
    "prd",
    "ai"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/pm-kit-cli"
  },
  "dependencies": {
    "@octokit/rest": "^20.0.0",
    "chalk": "^5.3.0",
    "prompts": "^2.4.2",
    "minimatch": "^9.0.3",
    "commander": "^11.0.0"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

---

## Performance Considerations

### Caching

```javascript
// Cache downloaded files to avoid repeated downloads
class CacheManager {
  constructor() {
    this.cacheDir = path.join(os.tmpdir(), 'pm-kit-cache');
    fs.mkdirSync(this.cacheDir, { recursive: true });
  }

  getCached(key) {
    const cachePath = path.join(this.cacheDir, key);
    if (fs.existsSync(cachePath)) {
      const { data, timestamp } = JSON.parse(fs.readFileSync(cachePath, 'utf8'));

      // Cache valid for 1 hour
      if (Date.now() - timestamp < 3600000) {
        return data;
      }
    }
    return null;
  }

  set(key, data) {
    const cachePath = path.join(this.cacheDir, key);
    fs.writeFileSync(cachePath, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  }
}
```

---

## Future Enhancements

1. **Cloud Sync:**
   - Sync user customizations across machines
   - Team templates sharing

2. **Plugin System:**
   - Third-party extensions
   - Custom command marketplace

3. **Analytics:**
   - Usage tracking (opt-in)
   - Popular commands/templates

4. **GUI Installer:**
   - Electron app for non-CLI users
   - Visual configuration

5. **Multi-repo Support:**
   - Install multiple kits simultaneously
   - Kit versioning per project

---

**This architecture provides:**
- Simple user experience (one command to install/update)
- Secure credential management
- Extensible design for future features
- Robust error handling
- Easy maintenance and updates
