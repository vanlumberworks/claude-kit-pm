# Installation Guide - ClaudeKit PM CLI

Complete installation guide for the ClaudeKit PM CLI installer.

## Prerequisites

### Required

- **Node.js** 16.0.0 or higher
- **npm** or **pnpm** package manager
- **GitHub account** with Personal Access Token (for private repository access)

### Recommended

- **Claude CLI** (for using PM workflows) - Install from [claude.ai/code](https://claude.ai/code)
- **Git** (for version control)

## Quick Install

```bash
# Install globally with npm
npm install -g pm-kit-cli

# Or with pnpm (recommended)
pnpm install -g pm-kit-cli

# Verify installation
pm-kit --version

# Initialize in your project directory
cd your-project
pm-kit init
```

## Step-by-Step Installation

### 1. Install the CLI

Choose your preferred package manager:

**Using pnpm (recommended)**:
```bash
pnpm install -g pm-kit-cli
```

**Using npm**:
```bash
npm install -g pm-kit-cli
```

**Using yarn**:
```bash
yarn global add pm-kit-cli
```

### 2. Verify Installation

```bash
pm-kit --version
# Output: 0.1.0

pm-kit --help
# Output: Available commands...
```

### 3. Obtain GitHub Personal Access Token

The CLI needs access to download framework files from the private GitHub repository.

**Create a token**:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: "PM Kit CLI"
4. Scopes: Select `repo` (Full control of private repositories)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

### 4. Prepare API Keys

ClaudeKit PM uses MCP servers that require API keys:

#### Required

**Brave Search API** (required for research workflows):
1. Visit https://brave.com/search/api/
2. Sign up for free tier
3. Copy your API key

#### Optional

**Perplexity API** (optional for enhanced research):
1. Visit https://www.perplexity.ai/settings/api
2. Generate API key
3. Copy your API key

**Google Gemini API** (optional for AI-powered features):
1. Visit https://makersuite.google.com/app/apikey
2. Create API key
3. Copy your API key

### 5. Initialize PM Kit

Navigate to your project directory and run:

```bash
cd your-project
pm-kit init
```

The installer will:
1. ✅ Check environment (Node.js, Claude CLI)
2. 🔐 Prompt for GitHub token (if not already saved)
3. 📥 Download framework files from GitHub
4. 🔑 Prompt for API keys (Brave, Perplexity, Gemini)
5. ⚙️  Generate `.mcp.json` configuration
6. 📁 Create output directories
7. 📝 Update `.gitignore`

**Example output**:
```
┌────────────────────────────────────────┐
│      ClaudeKit PM Installer           │
│                                        │
│      Version 0.1.0                     │
│      Simple installation for PMs      │
└────────────────────────────────────────┘

✓ Pre-flight checks passed
✓ GitHub authenticated
✓ Downloaded 4 components
✓ MCP configuration created
✓ Output directories created
✓ .gitignore updated

┌────────────────────────────────────────┐
│      ✓ Installation Complete!         │
│                                        │
│      Next steps:                      │
│      1. Run: claude                   │
│      2. Use: /prd, /research          │
│      3. Read: CLAUDE.md               │
└────────────────────────────────────────┘
```

## Installation Options

### Basic Installation

Install with minimal prompts:

```bash
pm-kit init --force
```

Skips confirmation if already initialized.

### Reset GitHub Token

If you need to change your GitHub token:

```bash
pm-kit init --reset-token
```

### Reconfigure API Keys Only

Update API keys without re-downloading:

```bash
pm-kit config set braveApiKey YOUR_NEW_KEY
pm-kit config set perplexityApiKey YOUR_NEW_KEY
```

## Post-Installation

### 1. Verify Installation

```bash
# Check files were created
pm-kit doctor

# Expected output:
# ✓ CLAUDE.md: Present
# ✓ .claude/ directory: Present
# ✓ .mcp.json: Present
# ✓ Workflows: 14/14 files
# ✓ Agents: 8/8 files
# ✓ Commands: 10/10 files
```

### 2. Test Claude CLI Integration

```bash
# Start Claude CLI
claude

# In Claude, try a command:
/help
```

### 3. Test PM Workflows

```bash
claude
# Inside Claude:
/prd
# Follow the prompts to generate a PRD
```

## Directory Structure After Installation

```
your-project/
├── CLAUDE.md                    # Main routing file for Claude
├── .mcp.json                   # MCP server configuration
├── .gitignore                  # Updated with sensitive files
├── .claude/
│   ├── workflows/              # 14 PM workflow files
│   ├── agents/                 # 8 specialized agents
│   ├── commands/               # 10 slash commands
│   └── skills/                 # 5 technical literacy modules
└── outputs/
    ├── prds/                   # Product requirements
    ├── research-reports/       # Research synthesis
    ├── consensus-reports/      # Stakeholder alignment
    ├── decision-matrices/      # Decision frameworks
    └── evidence-logs/          # Evidence assessments
```

## Troubleshooting

### Error: "GitHub authentication failed"

**Problem**: Invalid or expired GitHub token

**Solution**:
```bash
pm-kit init --reset-token
# Enter a new valid token
```

### Error: "Permission denied"

**Problem**: Missing npm global install permissions

**Solution**:
```bash
# Option 1: Use pnpm (recommended)
pnpm install -g pm-kit-cli

# Option 2: Fix npm permissions
# See: https://docs.npmjs.com/resolving-eacces-permissions-errors

# Option 3: Use sudo (not recommended)
sudo npm install -g pm-kit-cli
```

### Error: "Command not found: pm-kit"

**Problem**: CLI not in PATH

**Solution**:
```bash
# Check where npm installs global packages
npm config get prefix
# Should return /usr/local or similar

# Add to PATH (add to ~/.zshrc or ~/.bashrc)
export PATH="$PATH:$(npm config get prefix)/bin"

# Reload shell
source ~/.zshrc
```

### Error: "Repository not found"

**Problem**: GitHub token doesn't have access to private repository

**Solution**:
1. Verify token has `repo` scope
2. Verify you have access to the repository
3. Contact repository administrator for access

### Error: "API key invalid"

**Problem**: Brave Search API key is invalid

**Solution**:
```bash
# Update API key
pm-kit config set braveApiKey YOUR_NEW_KEY

# Or reinitialize
pm-kit init --force
```

### Error: "Claude CLI not found"

**Warning**: Claude CLI is recommended but not required

**Solution**:
```bash
# Install Claude CLI from
# https://claude.ai/code

# Or continue without it (workflows will be available but require manual copying)
```

## Updating PM Kit

To update to the latest version:

```bash
# Check for updates
pm-kit update

# View what would be updated (dry run)
pm-kit update --dry-run

# Update with backup
pm-kit update --backup

# Force update without confirmation
pm-kit update --force
```

## Uninstalling

To remove PM Kit:

```bash
# Uninstall CLI globally
npm uninstall -g pm-kit-cli
# or
pnpm uninstall -g pm-kit-cli

# Remove files from project (optional)
rm -rf .claude/
rm CLAUDE.md
rm .mcp.json
# Note: This preserves your outputs/ directory
```

## Environment Variables

Optional environment variables:

```bash
# Skip GitHub token prompt (use saved token or gh CLI)
export GITHUB_TOKEN=your_token_here

# Skip API key prompts
export BRAVE_API_KEY=your_key_here
export PERPLEXITY_API_KEY=your_key_here
export GEMINI_API_KEY=your_key_here

# Custom repository (for forks)
export PM_KIT_REPO=your-org/your-repo
export PM_KIT_BRANCH=main
```

## Next Steps

- Read [COMMANDS.md](./COMMANDS.md) for available commands
- Read [CLAUDE.md](./CLAUDE.md) for workflow documentation
- Try your first PRD: `claude` → `/prd`
- Join the community: [GitHub Discussions](https://github.com/your-org/pm-kit-cli/discussions)

## Support

- **Documentation**: [GitHub Wiki](https://github.com/your-org/pm-kit-cli/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-org/pm-kit-cli/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/pm-kit-cli/discussions)
