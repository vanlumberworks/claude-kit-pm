# Commands Reference - ClaudeKit PM CLI

Complete reference for all PM Kit CLI commands.

## Overview

```bash
pm-kit <command> [options]
```

## Global Options

```bash
--help, -h     Show help for command
--version, -v  Show version number
--debug        Enable debug logging
--quiet, -q    Suppress non-error output
```

## Commands

### `pm-kit init`

Initialize PM Kit in the current directory.

**Usage**:
```bash
pm-kit init [options]
```

**Options**:
- `--force` - Skip confirmation if already initialized
- `--reset-token` - Reset GitHub authentication token
- `--reconfigure-api` - Only reconfigure API keys (skip download)

**Examples**:
```bash
# Basic initialization
pm-kit init

# Force reinitialize
pm-kit init --force

# Reset GitHub token
pm-kit init --reset-token
```

**What it does**:
1. Checks environment (Node.js version, Claude CLI)
2. Authenticates with GitHub
3. Downloads framework files (CLAUDE.md, .claude/ directory)
4. Prompts for API keys (Brave, Perplexity, Gemini)
5. Generates `.mcp.json` configuration
6. Creates output directories
7. Updates `.gitignore`

**Exit codes**:
- `0` - Success
- `1` - Failed (authentication, network, or file system error)

---

### `pm-kit update`

Update PM Kit to the latest version.

**Usage**:
```bash
pm-kit update [options]
```

**Options**:
- `--force` - Skip confirmation prompts
- `--dry-run` - Show what would be updated without applying changes
- `--backup` - Create backup before updating
- `--exclude <pattern>` - Exclude files matching pattern (can be used multiple times)

**Examples**:
```bash
# Check for and apply updates
pm-kit update

# Preview updates
pm-kit update --dry-run

# Update with backup
pm-kit update --backup

# Update but preserve custom workflows
pm-kit update --exclude ".claude/workflows/custom-*"

# Multiple exclusions
pm-kit update --exclude "docs/**" --exclude "custom-prompts/**"
```

**What it does**:
1. Checks current vs. latest version
2. Shows release notes
3. Detects local modifications
4. Confirms with user
5. Downloads updated files
6. Preserves excluded files
7. Shows summary of changes

**Default exclusions** (always preserved):
- `.mcp.json` - Your API keys
- `outputs/**` - Your generated documents
- `docs/**` - Your custom documentation
- `custom-prompts/**` - Your custom prompts

**Exit codes**:
- `0` - Up to date or successfully updated
- `1` - Update failed

---

### `pm-kit doctor`

Run diagnostics on PM Kit installation.

**Usage**:
```bash
pm-kit doctor [options]
```

**Options**:
- `--fix` - Automatically fix issues where possible
- `--json` - Output results in JSON format

**Examples**:
```bash
# Run diagnostics
pm-kit doctor

# Run and auto-fix issues
pm-kit doctor --fix

# Get JSON output
pm-kit doctor --json
```

**What it checks**:
1. **File Structure**
   - CLAUDE.md present
   - .claude/ directory present
   - .mcp.json present
   - Expected file counts (workflows, agents, commands, skills)
   - Output directories exist

2. **API Configuration**
   - .mcp.json valid structure
   - Brave Search API configured
   - Perplexity API configured (optional)
   - Gemini API configured (optional)

3. **Claude CLI**
   - Claude CLI installed
   - Claude CLI in PATH
   - Version information

4. **Permissions**
   - .claude/ directory readable/writable
   - docs/ directory writable
   - outputs/ directory writable
   - Current directory writable

5. **Connectivity**
   - GitHub API reachable
   - Brave Search API reachable (optional)

**Output format**:
```
File Structure
✓  CLAUDE.md: Present
✓  .claude/ directory: Present
✓  .mcp.json: Present
✓  Workflows: 14/14 files
✓  Agents: 8/8 files
✓  Commands: 10/10 files
✓  Skills: 6/6 files

API Configuration
✓  MCP Configuration: Valid
✓  gemini: Server configured (optional)

Claude CLI
⚠  Claude CLI: Not found (recommended but not required)

Permissions
✓  .claude/ directory: RW
✓  outputs/ directory: RW

Connectivity
✓  GitHub API: Reachable

Summary
✓ All checks passed!
```

**Exit codes**:
- `0` - All checks passed
- `1` - One or more checks failed

---

### `pm-kit config`

Manage PM Kit configuration.

**Usage**:
```bash
pm-kit config <action> [key] [value] [options]
```

**Actions**:
- `list` - Show all configuration
- `get <key>` - Get specific value
- `set <key> <value>` - Set configuration value
- `delete <key>` - Delete configuration value
- `reset` - Reset all configuration (prompts for confirmation)

**Examples**:
```bash
# List all configuration
pm-kit config list

# Get specific value
pm-kit config get githubToken

# Set configuration value
pm-kit config set githubToken ghp_new_token_here

# Set API key (special handling)
pm-kit config set geminiApiKey new_key_here

# Delete configuration
pm-kit config delete customSetting

# Reset everything
pm-kit config reset
```

**Configuration keys**:

Global keys (prefix with `global.` to save globally):
- `githubToken` - GitHub Personal Access Token
- `geminiApiKey` - Google Gemini API key (optional)
- Custom keys - Any other settings

**Local vs. Global**:
```bash
# Save locally (project-specific)
pm-kit config set myKey myValue

# Save globally (user-wide)
pm-kit config set global.myKey myValue
```

**Configuration files**:
- Local: `.pm-kit/config.json` (project directory)
- Global: `~/.pm-kit/config.json` (home directory)

**Security**:
- Sensitive values (tokens, keys) are masked when displayed
- Configuration files have restricted permissions (0600)
- `.pm-kit/config.json` is in `.gitignore`

**Exit codes**:
- `0` - Success
- `1` - Invalid action, missing key, or file system error

---

## CLI Environment Variables

The CLI respects these environment variables:

```bash
# GitHub authentication
GITHUB_TOKEN=ghp_your_token_here

# API keys (optional)
GEMINI_API_KEY=your_key_here

# Custom repository (for forks)
PM_KIT_REPO=your-org/your-repo
PM_KIT_BRANCH=main

# Behavior
PM_KIT_DEBUG=true          # Enable debug logging
PM_KIT_NO_UPDATE_CHECK=true  # Skip update checks
```

##Slash Commands (Claude CLI)

After initialization, these commands are available in Claude CLI:

### Core PM Commands

```bash
/decompose         # Systematic problem decomposition
/prd               # Generate comprehensive PRD
/synthesize        # Synthesize research data
/prioritize        # Apply prioritization frameworks
/strategy          # Create strategic planning documents
/decide            # Quick decision framework
/research          # Multi-source research synthesis
/consensus         # Build stakeholder consensus
/matrix            # Generate comparison matrices
/evidence          # Gather and assess evidence
```

### Technical Literacy Commands

```bash
/learn-json        # Interactive JSON fundamentals
/learn-api         # Step-by-step API basics
/test-api          # Guide for testing APIs
/visualize         # Create ASCII flow diagrams
/prototype         # Generate frontend design prompts
/debug             # Non-technical debugging guide
```

### Productivity Commands

```bash
/daily             # Daily PM workflow
/timeblock         # Create optimized time blocks
```

See [CLAUDE.md](./CLAUDE.md) for detailed command documentation.

## Exit Codes Reference

All commands use standardized exit codes:

- `0` - Success
- `1` - General error
- `2` - Invalid arguments
- `130` - Interrupted by user (Ctrl+C)

## Getting Help

```bash
# General help
pm-kit --help

# Command-specific help
pm-kit init --help
pm-kit update --help
pm-kit doctor --help
pm-kit config --help

# Version information
pm-kit --version
```

## Examples by Use Case

### First-Time Setup

```bash
# Install CLI
pnpm install -g pm-kit-cli

# Initialize in project
cd my-project
pm-kit init

# Verify installation
pm-kit doctor

# Start using
claude
```

### Updating Your Installation

```bash
# Check for updates
pm-kit update --dry-run

# Apply updates with backup
pm-kit update --backup

# Verify update
pm-kit doctor
```

### Troubleshooting Issues

```bash
# Run diagnostics
pm-kit doctor

# Auto-fix issues
pm-kit doctor --fix

# Reset configuration
pm-kit config reset

# Reinitialize
pm-kit init --force
```

### Managing API Keys

```bash
# View all configuration
pm-kit config list

# Update specific API key
pm-kit config set geminiApiKey new_key_here

# Remove old key
pm-kit config delete oldKey
```

### Working with Forks

```bash
# Set custom repository
export PM_KIT_REPO=your-org/your-fork
export PM_KIT_BRANCH=custom-branch

# Initialize from fork
pm-kit init

# Update from fork
pm-kit update
```

## Advanced Usage

### Automation & CI/CD

```bash
# Non-interactive initialization
export GITHUB_TOKEN=ghp_token

pm-kit init --force

# Check installation in CI
pm-kit doctor --json | jq '.success'
```

### Custom Exclusions

```bash
# Create .pm-kit-exclude file
cat > .pm-kit-exclude << EOF
.claude/workflows/custom-*
docs/**
custom-prompts/**
EOF

# Update will respect exclusions
pm-kit update
```

### Scripting

```bash
#!/bin/bash
# setup-pm-kit.sh

set -e

echo "Installing PM Kit..."
pnpm install -g pm-kit-cli

echo "Initializing..."
pm-kit init --force

echo "Running diagnostics..."
pm-kit doctor --fix

echo "Setup complete!"
```

## Related Documentation

- [INSTALLATION.md](./INSTALLATION.md) - Installation guide
- [CLAUDE.md](./CLAUDE.md) - Workflow documentation
- [README.md](./README.md) - Project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture

## Support

- Report bugs: [GitHub Issues](https://github.com/your-org/pm-kit-cli/issues)
- Ask questions: [GitHub Discussions](https://github.com/your-org/pm-kit-cli/discussions)
- Documentation: [GitHub Wiki](https://github.com/your-org/pm-kit-cli/wiki)
