# New Engineer Onboarding - ClaudeKit PM

Welcome to the team! This guide will get you up and running in 15 minutes.

## 🎯 Project in 60 Seconds

**ClaudeKit PM** is a CLI tool that installs AI-enhanced product management workflows for use with Claude Code.

**Two main components:**
1. **CLI Tool** - Node.js app for installing/managing the framework
2. **Framework Files** - Workflows, agents, commands used by Claude

## 🚀 Quick Setup (15 min)

### Step 1: Prerequisites (2 min)

```bash
# Check Node.js (need 16+)
node --version

# Install pnpm if needed
npm install -g pnpm

# Install GitHub CLI (optional but recommended)
brew install gh  # macOS
# or visit: https://cli.github.com/
```

### Step 2: Clone & Install (3 min)

```bash
# Clone repository
git clone https://github.com/vanlumberworks/claude-kit-pm.git
cd claude-kit-pm

# Install dependencies
pnpm install

# Link CLI globally for testing
pnpm link --global

# Verify it works
pm-kit --version
pm-kit --help
```

### Step 3: Run Tests (2 min)

```bash
# Run all tests
pnpm test

# Should see:
# ✓ All tests passing
# ✓ Coverage > 70%
```

### Step 4: Understand the Structure (5 min)

```
claude-kit-pm/
├── .claude/              ← Framework files (EDIT HERE)
│   ├── workflows/        ← PM workflows
│   ├── agents/           ← Specialized agents
│   ├── commands/         ← Slash commands
│   ├── templates/        ← Document templates
│   └── skills/           ← Technical literacy modules
│
├── lib/                  ← CLI implementation
│   ├── commands/         ← init, update, doctor, config
│   ├── services/         ← GitHub, MCP services
│   └── utils/            ← Utilities
│
├── framework-repo-setup/ ← Distribution copy (DON'T EDIT DIRECTLY)
│   └── .claude/          ← Synced from main .claude/
│
├── tests/                ← Test suite
│   ├── unit/
│   └── integration/
│
└── docs/                 ← Documentation
    ├── DEVELOPER_GUIDE.md
    ├── FRAMEWORK_ARCHITECTURE.md
    └── ONBOARDING.md     ← You are here!
```

### Step 5: Make Your First Change (3 min)

```bash
# Edit a framework file
vim .claude/workflows/prd-framework.md
# Make a small change (add a comment or fix typo)

# Test locally
claude
/prd

# Sync to distribution repo
./scripts/sync-framework.sh

# See what changed
cd framework-repo-setup
git status
git diff
```

## 🧠 Key Concepts

### Concept 1: Two-Location System

**CRITICAL TO UNDERSTAND:**

```
.claude/                    ← 📝 EDIT HERE (Source)
framework-repo-setup/.claude/ ← 🔄 AUTO-SYNCED (Distribution)
```

**Rule:** Always edit in `.claude/`, then run `./scripts/sync-framework.sh`

### Concept 2: Framework vs CLI

```
Framework Files (.claude/)
├── For: Claude to use
├── Language: Markdown
├── Release: GitHub (vanlumberworks/claudekit-pm-framework)
└── Update: ./scripts/sync-framework.sh → create release

CLI Tool (lib/)
├── For: Users to install framework
├── Language: JavaScript
├── Release: npm (pm-kit-cli)
└── Update: Code changes → npm publish
```

### Concept 3: Development Workflow

```
1. Edit in .claude/                    ← Your work happens here
         ↓
2. Test with: claude                   ← Verify locally
         ↓
3. Sync: ./scripts/sync-framework.sh   ← Copy to distribution
         ↓
4. Release: Update version.json        ← Create GitHub release
         ↓
5. Users: pm-kit update                ← They get your changes
```

## 💻 Common Tasks

### Task: Update a Workflow

```bash
# 1. Edit
vim .claude/workflows/prd-framework.md

# 2. Test
claude
/prd

# 3. Done! (or sync if releasing)
./scripts/sync-framework.sh
```

### Task: Fix a Bug in CLI

```bash
# 1. Fix
vim lib/commands/init.js

# 2. Test
pnpm test

# 3. Verify locally
pm-kit init --help

# 4. Commit
git commit -m "fix: handle edge case in init"
```

### Task: Add a New Feature

```bash
# Framework feature (new workflow):
vim .claude/workflows/new-workflow.md
./scripts/sync-framework.sh

# CLI feature (new command):
vim lib/commands/new-command.js
vim tests/unit/new-command.test.js
pnpm test
```

## 🧪 Testing Workflow

```bash
# Run all tests
pnpm test

# Run specific test
pnpm test tests/unit/file-manager.test.js

# Watch mode (auto-run on changes)
pnpm test:watch

# Coverage report
pnpm test:coverage
open coverage/lcov-report/index.html
```

## 📚 Next Steps

After this onboarding:

1. **Read:** [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Complete guide
2. **Understand:** [FRAMEWORK_ARCHITECTURE.md](./FRAMEWORK_ARCHITECTURE.md) - Architecture
3. **Learn:** [FRAMEWORK_UPDATE_WORKFLOW.md](./FRAMEWORK_UPDATE_WORKFLOW.md) - Update process
4. **Contribute:** [../CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines

## 🆘 Common Questions

### Q: Where do I edit framework files?

**A:** Always in `.claude/` directory, never in `framework-repo-setup/.claude/`

### Q: How do I test my changes?

**A:** Run `claude` and test the commands (like `/prd`, `/research`, etc.)

### Q: When do I run the sync script?

**A:** When you're ready to release framework changes to users

### Q: How do I release a new version?

**A:** See [FRAMEWORK_UPDATE_WORKFLOW.md](./FRAMEWORK_UPDATE_WORKFLOW.md#release-process)

### Q: Tests are failing, what do I do?

**A:**
```bash
# Clear cache and reinstall
pnpm install
pnpm test --clearCache
pnpm test
```

### Q: How do I get help?

**A:**
- Check docs in `docs/` folder
- Ask in team chat
- Create GitHub Discussion
- Review existing issues

## 🎯 Your First Week

### Day 1-2: Setup & Exploration
- [ ] Complete this onboarding
- [ ] Run tests successfully
- [ ] Make a small change to a workflow
- [ ] Test with Claude

### Day 3-4: Deep Dive
- [ ] Read DEVELOPER_GUIDE.md
- [ ] Understand the architecture
- [ ] Review test suite
- [ ] Fix a small bug or improve docs

### Day 5: First Contribution
- [ ] Pick a "good first issue"
- [ ] Create a branch
- [ ] Make changes + tests
- [ ] Submit PR

## ✅ Onboarding Checklist

Complete setup:
- [ ] Cloned repository
- [ ] Installed dependencies
- [ ] Linked CLI globally
- [ ] Tests passing
- [ ] Can run `pm-kit` commands

Understanding:
- [ ] Know the two-location system
- [ ] Understand framework vs CLI
- [ ] Know when to sync
- [ ] Understand testing workflow

First contribution:
- [ ] Made a small change
- [ ] Tested locally
- [ ] Synced (if framework change)
- [ ] Committed with good message

## 🎉 You're Ready!

You now know:
- ✅ Project structure
- ✅ Where to edit files
- ✅ How to test changes
- ✅ When to sync
- ✅ How to get help

**Next:** Pick an issue or ask your team lead for a task!

---

**Questions?** Ask in team chat or check [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)

**Welcome to the team! 🚀**
