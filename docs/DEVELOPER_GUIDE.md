# Developer Guide - ClaudeKit PM

This guide is for engineers working on the ClaudeKit PM project. It explains the architecture, development workflow, and how to contribute effectively.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Setup for Development](#setup-for-development)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Release Process](#release-process)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

ClaudeKit PM is a CLI tool that provides AI-enhanced product management workflows via Claude Code. It consists of two main components:

1. **CLI Tool** (`pm-kit-cli`) - Node.js CLI for installation and management
2. **Framework Files** - Workflows, agents, commands, templates, and skills for Claude

### Repository Structure

```
claude-kit-pm/
├── bin/                        # CLI executables
│   └── pm-kit.js              # Main CLI entry point
│
├── lib/                        # CLI implementation
│   ├── commands/              # Command implementations (init, update, doctor, config)
│   ├── services/              # Services (GitHub, MCP, file management)
│   ├── utils/                 # Utilities (logger, error handler, validator)
│   └── constants.js           # Configuration constants
│
├── .claude/                    # Framework files (SOURCE OF TRUTH)
│   ├── workflows/             # 18 PM workflow files
│   ├── agents/                # 10 specialized agents
│   ├── commands/              # 16 slash commands
│   ├── templates/             # 4 document templates
│   └── skills/                # 5 technical literacy modules
│
├── framework-repo-setup/       # Distribution repository
│   ├── .claude/               # Synced copy of framework files
│   ├── CLAUDE.md              # Synced routing file
│   ├── version.json           # Version tracking
│   └── README.md              # Repository documentation
│
├── tests/                      # Test suite
│   ├── unit/                  # Unit tests
│   ├── integration/           # Integration tests
│   └── setup.js               # Test configuration
│
├── scripts/                    # Utility scripts
│   ├── sync-framework.sh      # Sync framework files to distribution repo
│   └── setup-framework-repo.sh # Initial framework repo setup
│
├── docs/                       # Documentation
│   ├── DEVELOPER_GUIDE.md     # This file
│   ├── INSTALLATION_VISUAL_GUIDE.md
│   └── FIX_CRITICAL_BLOCKERS.md
│
├── .github/                    # GitHub Actions and templates
│   ├── workflows/             # CI/CD pipelines
│   └── ISSUE_TEMPLATE/        # Issue templates
│
├── CLAUDE.md                   # Main routing file (SOURCE)
├── package.json                # npm package configuration
├── jest.config.js              # Test configuration
└── README.md                   # User-facing documentation
```

---

## 🏗️ Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  USER SYSTEM                                                    │
│  ├── their-project/                                             │
│  │   ├── .claude/          ← Installed framework files         │
│  │   ├── CLAUDE.md         ← Routing file                      │
│  │   └── .mcp.json         ← API configuration                 │
│  │                                                              │
│  └── runs: claude          ← Uses installed framework          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↑
                              │ pm-kit init / pm-kit update
                              │
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  GITHUB REPOSITORY (Distribution)                              │
│  vanlumberworks/claudekit-pm-framework                         │
│  ├── .claude/              ← Framework files                   │
│  ├── CLAUDE.md             ← Routing file                      │
│  └── version.json          ← Version tracking                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↑
                              │ Sync & Release
                              │
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  DEVELOPMENT PROJECT                                            │
│  claude-kit-pm/                                                │
│  ├── .claude/              ← Framework source (DEVELOP HERE)   │
│  ├── lib/                  ← CLI implementation                │
│  ├── framework-repo-setup/ ← Distribution staging              │
│  └── scripts/sync-framework.sh ← Sync tool                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Developer Makes Change
         ↓
   Edit .claude/workflows/prd-framework.md
         ↓
   Test locally with: claude
         ↓
   ./scripts/sync-framework.sh
         ↓
   framework-repo-setup/.claude/ updated
         ↓
   Update version.json, commit, tag
         ↓
   Push to GitHub (vanlumberworks/claudekit-pm-framework)
         ↓
   Users run: pm-kit update
         ↓
   Downloads to: their-project/.claude/
```

---

## 🚀 Setup for Development

### Prerequisites

- Node.js 16+ (verify: `node --version`)
- pnpm (recommended) or npm (verify: `pnpm --version`)
- Git (verify: `git --version`)
- GitHub CLI (optional but recommended): `gh --version`

### Initial Setup

```bash
# 1. Clone repository
git clone https://github.com/vanlumberworks/claude-kit-pm.git
cd claude-kit-pm

# 2. Install dependencies
pnpm install

# 3. Link CLI globally for testing
pnpm link --global

# 4. Verify installation
pm-kit --version
pm-kit --help

# 5. Run tests to verify setup
pnpm test

# 6. Authenticate with GitHub (for testing downloads)
gh auth login
```

### Environment Variables

Create `.env` file (optional, for development):

```bash
# GitHub token (if not using gh CLI)
GITHUB_TOKEN=ghp_your_token_here

# Framework repository (can override default)
PMKIT_REPO=vanlumberworks/claudekit-pm-framework

# Logging level
LOG_LEVEL=debug
```

---

## 💻 Development Workflow

### Understanding the Two-Location System

**CRITICAL:** Framework files exist in TWO locations:

1. **Source** (`.claude/`) - Where you DEVELOP
2. **Distribution** (`framework-repo-setup/.claude/`) - Where you RELEASE

**Golden Rule:** Always edit in `.claude/`, never in `framework-repo-setup/.claude/`

### Typical Development Cycle

#### 1. Working on Framework Files (Workflows, Agents, etc.)

```bash
# Edit framework files
vim .claude/workflows/prd-framework.md

# Test locally
claude
# In Claude, test your changes:
/prd

# If satisfied, sync to distribution repo
./scripts/sync-framework.sh

# Review changes
cd framework-repo-setup
git status
git diff

# If ready to release, continue to release process...
```

#### 2. Working on CLI Tool (Commands, Services, etc.)

```bash
# Edit CLI code
vim lib/commands/init.js

# Run locally (already linked with pnpm link)
pm-kit init --help

# Test in a temp directory
mkdir -p /tmp/test-pm-kit
cd /tmp/test-pm-kit
pm-kit init

# Write unit tests
vim tests/unit/init.test.js

# Run tests
pnpm test

# Commit changes
git add lib/commands/init.js tests/unit/init.test.js
git commit -m "feat: improve init command error handling"
```

#### 3. Adding a New Framework Component

**Example: Adding a new workflow**

```bash
# 1. Create workflow in main project
vim .claude/workflows/my-new-workflow.md

# 2. Add corresponding command (if needed)
vim .claude/commands/my-command.md

# 3. Test locally
claude
/my-command

# 4. Update file counts in constants
vim lib/constants.js
# Update EXPECTED_FILES.workflows: 18 → 19

# 5. Sync to distribution
./scripts/sync-framework.sh

# 6. Update version (new feature = minor version bump)
cd framework-repo-setup
vim version.json
# Change: "version": "0.1.0" → "0.2.0"
# Increment: "workflows": 18 → 19
# Add changelog entry

# 7. Commit
git add .
git commit -m "feat: add new workflow for [purpose]"

# 8. Create release (see Release Process below)
```

---

## 🧪 Testing

### Test Structure

```
tests/
├── setup.js               # Test utilities and configuration
├── unit/                  # Unit tests
│   ├── error-handler.test.js
│   ├── file-manager.test.js
│   └── mcp-service.test.js
└── integration/           # Integration tests
    └── init.test.js
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run specific test file
pnpm test tests/unit/file-manager.test.js

# Run in watch mode
pnpm test:watch

# Run tests matching pattern
pnpm test -- --testNamePattern="should create directory"
```

### Writing Tests

**Unit Test Example:**

```javascript
// tests/unit/file-manager.test.js
const fileManager = require('../../lib/utils/file-manager');
const fs = require('fs');
const path = require('path');

describe('FileManager', () => {
  const testDir = path.join(process.cwd(), '.test-temp');

  beforeEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  test('should create directory', () => {
    const dir = path.join(testDir, 'new-dir');
    fileManager.createDir(dir);
    expect(fs.existsSync(dir)).toBe(true);
  });
});
```

### Coverage Requirements

- Minimum coverage: 70% across all metrics
- Defined in `jest.config.js`
- Check coverage: `pnpm test:coverage`
- View HTML report: `open coverage/lcov-report/index.html`

---

## 📦 Release Process

### Version Numbering (Semantic Versioning)

```
vMAJOR.MINOR.PATCH

Examples:
- Bug fix:        0.1.0 → 0.1.1
- New feature:    0.1.0 → 0.2.0
- Breaking change: 0.1.0 → 1.0.0
```

### Framework Release (Distribution Repo)

When you've made changes to framework files (`.claude/` directory):

```bash
# 1. Ensure all changes are synced
./scripts/sync-framework.sh

# 2. Navigate to distribution repo
cd framework-repo-setup

# 3. Update version.json
vim version.json
```

**version.json updates:**
```json
{
  "version": "0.2.0",  // ← Increment based on change type
  "releaseDate": "2024-11-22T00:00:00Z",  // ← Update date
  "minimumCliVersion": "0.1.0",
  "files": {
    "workflows": 19,  // ← Update if counts changed
    "agents": 10,
    "commands": 16,
    "templates": 4,
    "skills": 5
  },
  "changelog": [
    {
      "version": "0.2.0",  // ← Add new entry at top
      "date": "2024-11-22",
      "changes": [
        "Added new workflow for [feature]",
        "Improved agent performance",
        "Fixed bug in [component]"
      ]
    },
    // ... previous entries
  ]
}
```

```bash
# 4. Commit changes
git add .
git commit -m "chore: release v0.2.0

- Added new workflow for [feature]
- Improved agent performance
- Fixed bug in [component]"

# 5. Create tag
git tag -a v0.2.0 -m "Release v0.2.0

Added new workflow for [feature]
Improved agent performance
Fixed bug in [component]

Compatible with pm-kit-cli v0.1.0+"

# 6. Push
git push origin main
git push origin v0.2.0

# 7. Create GitHub release
gh release create v0.2.0 \
  --title "v0.2.0 - New Workflow & Improvements" \
  --notes "## What's Changed

- Added new workflow for [feature]
- Improved agent performance
- Fixed bug in [component]

## Installation

\`\`\`bash
pm-kit update
\`\`\`

## Compatibility

- pm-kit-cli: v0.1.0+
- Node.js: 16+

**Full Changelog**: https://github.com/vanlumberworks/claudekit-pm-framework/compare/v0.1.0...v0.2.0"

# 8. Test the release
cd /tmp/test-release
pm-kit init
pm-kit update  # Should download new version
pm-kit doctor  # Verify file counts
```

### CLI Tool Release (npm)

When you've made changes to the CLI tool (`lib/`, `bin/`):

```bash
# 1. Update version in package.json
vim package.json
# Change: "version": "0.1.0" → "0.1.1"

# 2. Update CHANGELOG.md
vim CHANGELOG.md

# 3. Commit
git add package.json CHANGELOG.md
git commit -m "chore: release v0.1.1"

# 4. Create tag
git tag -a v0.1.1 -m "Release v0.1.1"

# 5. Push
git push origin main
git push origin v0.1.1

# 6. Publish to npm
npm publish

# 7. Verify
npm view pm-kit-cli version
```

**Note:** GitHub Actions can automate npm publishing on tag push (see `.github/workflows/release.yml`)

---

## 🛠️ Common Tasks

### Task 1: Update an Existing Workflow

```bash
# 1. Edit
vim .claude/workflows/prd-framework.md

# 2. Test
claude
/prd

# 3. Sync
./scripts/sync-framework.sh

# 4. Release (see Release Process)
cd framework-repo-setup
# ... update version.json and create release
```

### Task 2: Add a New Agent

```bash
# 1. Create agent
vim .claude/agents/new-agent.md

# 2. Test
claude
# Test the agent

# 3. Update constants
vim lib/constants.js
# EXPECTED_FILES.agents: 10 → 11

# 4. Sync
./scripts/sync-framework.sh

# 5. Release with updated file counts
cd framework-repo-setup
vim version.json
# "version": "0.1.0" → "0.2.0" (new feature)
# "agents": 10 → 11
# ... create release
```

### Task 3: Fix a Bug in CLI

```bash
# 1. Fix bug
vim lib/commands/init.js

# 2. Add test
vim tests/unit/init.test.js

# 3. Verify
pnpm test

# 4. Commit
git add lib/commands/init.js tests/unit/init.test.js
git commit -m "fix: handle edge case in init command"

# 5. No need to sync (CLI change, not framework change)

# 6. Release new CLI version (see CLI Release Process)
```

### Task 4: Update MCP Server Configuration

```bash
# 1. Edit constants
vim lib/constants.js
# Update MCP_SERVERS object

# 2. Update MCP service
vim lib/services/mcp-service.js

# 3. Test
pnpm test tests/unit/mcp-service.test.js

# 4. Commit
git commit -m "feat: add new MCP server configuration"

# 5. Release CLI (not framework)
```

### Task 5: Add Documentation

```bash
# User-facing docs (README, GETTING_STARTED, etc.)
vim GETTING_STARTED.md
git commit -m "docs: improve getting started guide"

# Developer docs
vim docs/DEVELOPER_GUIDE.md
git commit -m "docs: add troubleshooting section"

# Framework docs (will be synced)
vim .claude/workflows/README.md
./scripts/sync-framework.sh
# ... release framework
```

---

## 🐛 Troubleshooting

### Problem: "Command not found: pm-kit" after making changes

**Solution:**
```bash
# Re-link the CLI
pnpm link --global

# Or reinstall
pnpm install && pnpm link --global
```

### Problem: Sync script shows file count mismatches

**Solution:**
```bash
# This is expected when you add/remove files
# Update version.json to match actual counts:
cd framework-repo-setup
vim version.json
# Update the "files" section to match the numbers shown
```

### Problem: Tests failing after pulling latest changes

**Solution:**
```bash
# Reinstall dependencies
pnpm install

# Clear test cache
pnpm test --clearCache

# Run tests
pnpm test
```

### Problem: GitHub authentication fails during testing

**Solution:**
```bash
# Re-authenticate with GitHub CLI
gh auth logout
gh auth login

# Or set token manually
export GITHUB_TOKEN=ghp_your_token_here
```

### Problem: Framework files not syncing correctly

**Solution:**
```bash
# Check you're in the right directory
pwd  # Should be /path/to/claude-kit-pm

# Check sync script is executable
chmod +x scripts/sync-framework.sh

# Run with explicit path
./scripts/sync-framework.sh

# Check for errors in output
```

### Problem: Users report outdated framework files

**Solution:**
```bash
# Verify latest release on GitHub
gh release view --repo vanlumberworks/claudekit-pm-framework

# Check version.json in distribution repo
cat framework-repo-setup/version.json

# Verify files were pushed
cd framework-repo-setup
git log --oneline | head -5

# Users should run:
pm-kit update
```

---

## 📚 Additional Resources

### Documentation

- **User Guides:**
  - `GETTING_STARTED.md` - Beginner walkthrough
  - `INSTALLATION.md` - Installation reference
  - `COMMANDS.md` - CLI command reference

- **Developer Guides:**
  - `docs/DEVELOPER_GUIDE.md` - This file
  - `FRAMEWORK_UPDATE_WORKFLOW.md` - Framework update process
  - `FRAMEWORK_ARCHITECTURE.md` - Architecture overview
  - `CONTRIBUTING.md` - Contribution guidelines

- **Technical Docs:**
  - `PRODUCTION_READINESS.md` - Production deployment
  - `docs/FIX_CRITICAL_BLOCKERS.md` - Critical issues and fixes

### Scripts

- `scripts/sync-framework.sh` - Sync framework to distribution
- `scripts/setup-framework-repo.sh` - Initial framework repo setup
- `install.sh` - One-line installation script

### CI/CD

- `.github/workflows/ci.yml` - Multi-OS testing
- `.github/workflows/release.yml` - Automated npm publishing

---

## ✅ Pre-Commit Checklist

Before committing changes:

**For Framework Changes:**
- [ ] Edited in main `.claude/` directory (not `framework-repo-setup/`)
- [ ] Tested locally with `claude`
- [ ] Run sync script if ready to release
- [ ] Updated `version.json` if creating release
- [ ] Updated file counts if added/removed files

**For CLI Changes:**
- [ ] Added/updated tests
- [ ] Tests passing (`pnpm test`)
- [ ] Updated documentation if needed
- [ ] Updated `package.json` version if releasing

**For All Changes:**
- [ ] Meaningful commit message
- [ ] No sensitive data (API keys, tokens)
- [ ] Code follows project style
- [ ] Documentation updated

---

## 🤝 Getting Help

- **Issues:** Check existing issues or create new one
- **Discussions:** GitHub Discussions for questions
- **Documentation:** Search all `.md` files in repo
- **Code Review:** Request review from team members

---

## 🎯 Quick Reference

### Common Commands

```bash
# Development
pnpm install              # Install dependencies
pnpm link --global        # Link CLI globally
pnpm test                 # Run tests
pnpm test:coverage        # Run tests with coverage

# Framework Workflow
vim .claude/workflows/    # Edit framework
claude                    # Test locally
./scripts/sync-framework.sh  # Sync to distribution

# Release
cd framework-repo-setup
vim version.json          # Update version
git commit && git tag     # Commit and tag
git push origin main vX.Y.Z  # Push
gh release create vX.Y.Z  # Create release
```

### File Locations

```bash
# Framework Source
.claude/                  # Edit here

# CLI Source
lib/commands/             # Command implementations
lib/services/             # Services
lib/utils/                # Utilities

# Tests
tests/unit/               # Unit tests
tests/integration/        # Integration tests

# Distribution
framework-repo-setup/     # Synced copy
```

---

**Welcome to the team! Happy coding! 🚀**
