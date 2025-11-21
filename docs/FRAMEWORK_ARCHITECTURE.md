# Framework Architecture & Update Guide

## 🎯 Quick Answer to Your Question

**Q: Should I update framework files in `framework-repo-setup/.claude/` or in the main `.claude/`?**

**A: Always update in the MAIN `.claude/` directory, then sync to `framework-repo-setup/`**

```
✅ CORRECT - Edit here:
   /Users/tranvan/Projects/claude-kit-pm/.claude/

❌ WRONG - Don't edit here directly:
   /Users/tranvan/Projects/claude-kit-pm/framework-repo-setup/.claude/
```

---

## 📁 Directory Structure Explained

```
claude-kit-pm/                           (Your Development Project)
│
├── .claude/                             ← 📝 EDIT FILES HERE (Source)
│   ├── workflows/                       ← Update workflows here
│   ├── agents/                          ← Update agents here
│   ├── commands/                        ← Update commands here
│   ├── templates/                       ← Update templates here
│   └── skills/                          ← Update skills here
│
├── CLAUDE.md                            ← 📝 EDIT HERE (Source)
│
├── lib/                                 (CLI Implementation)
│   ├── commands/                        ← CLI commands (init, update, doctor)
│   ├── services/                        ← GitHub service, MCP service
│   ├── utils/                           ← Utilities
│   └── constants.js                     ← Configuration constants
│
├── framework-repo-setup/                (Distribution Repository)
│   ├── .claude/                         ← 🔄 SYNCED COPY (Auto-generated)
│   ├── CLAUDE.md                        ← 🔄 SYNCED COPY (Auto-generated)
│   ├── version.json                     ← Update for releases
│   ├── README.md                        ← Repository documentation
│   └── ...                              ← Other distribution files
│
└── scripts/
    └── sync-framework.sh                ← 🔄 Run this to sync files
```

---

## 🔄 The Complete Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  STEP 1: DEVELOP IN MAIN PROJECT                                │
│  ════════════════════════════                                    │
│                                                                  │
│  📝 Edit:  .claude/workflows/prd-framework.md                    │
│  🧪 Test:  claude → /prd                                         │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STEP 2: SYNC TO DISTRIBUTION REPO                              │
│  ══════════════════════════════                                  │
│                                                                  │
│  🔄 Run:   ./scripts/sync-framework.sh                           │
│  📋 Does:  Copies .claude/ → framework-repo-setup/.claude/       │
│           Copies CLAUDE.md → framework-repo-setup/CLAUDE.md     │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STEP 3: CREATE RELEASE                                         │
│  ═══════════════════                                             │
│                                                                  │
│  📝 Edit:  framework-repo-setup/version.json                     │
│           (update version: 0.1.0 → 0.1.1)                       │
│  💾 Commit & Tag: git tag v0.1.1                                 │
│  🚀 Release: gh release create v0.1.1                            │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STEP 4: USERS GET UPDATE                                       │
│  ═════════════════════                                           │
│                                                                  │
│  💻 User runs:  pm-kit update                                    │
│  📥 Downloads:  from GitHub (framework-repo-setup)               │
│  📂 Installs:   to their-project/.claude/                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start Guide

### Making Changes to Framework Files

```bash
# 1. Edit in main project
vim .claude/workflows/prd-framework.md

# 2. Test locally
claude
/prd

# 3. Sync to distribution repo
./scripts/sync-framework.sh

# 4. Review changes
cd framework-repo-setup
git status

# 5. Update version (if releasing)
vim version.json
# Change version from 0.1.0 to 0.1.1

# 6. Commit and release
git add .
git commit -m "Update: PRD workflow improvements"
git tag -a v0.1.1 -m "Release v0.1.1"
git push origin main v0.1.1
gh release create v0.1.1

# Done! Users can now: pm-kit update
```

---

## 🎯 Common Scenarios

### Scenario 1: Update an Existing Workflow

```bash
# ✅ CORRECT
vim .claude/workflows/prd-framework.md
./scripts/sync-framework.sh

# ❌ WRONG - Changes will be lost!
vim framework-repo-setup/.claude/workflows/prd-framework.md
```

### Scenario 2: Add a New Agent

```bash
# 1. Create in main project
vim .claude/agents/new-agent.md

# 2. Sync
./scripts/sync-framework.sh

# 3. Update version.json (file count changed!)
cd framework-repo-setup
vim version.json
# Increment "agents": 10 → 11
# Change "version": "0.1.0" → "0.2.0" (new feature)

# 4. Release
git add . && git commit -m "Add new agent"
git tag -a v0.2.0 -m "Release v0.2.0"
git push origin main v0.2.0
gh release create v0.2.0
```

### Scenario 3: Fix a Typo

```bash
# 1. Fix in main project
vim .claude/commands/prd.md

# 2. Sync
./scripts/sync-framework.sh

# 3. Update version (patch for small fixes)
cd framework-repo-setup
vim version.json
# Change "version": "0.1.0" → "0.1.1"

# 4. Quick release
git add . && git commit -m "Fix typo in PRD command"
git tag -a v0.1.1 -m "Fix typo"
git push origin main v0.1.1
gh release create v0.1.1
```

---

## 🔍 Why This Architecture?

### Separation of Concerns

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  MAIN PROJECT (claude-kit-pm/)                                │
│  ══════════════════════════════                                │
│                                                                │
│  Purpose:  Development & Testing                              │
│  Contains: Framework files + CLI tool + Tests + Docs          │
│  You use:  For daily work, testing, development               │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  DISTRIBUTION REPO (framework-repo-setup/)                    │
│  ══════════════════════════════════════════                    │
│                                                                │
│  Purpose:  Distribution to End Users                          │
│  Contains: Framework files ONLY (clean, release-ready)        │
│  Users get: Via pm-kit init / pm-kit update                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Benefits

1. ✅ **Clean Development**: Work with all your tools in main project
2. ✅ **Easy Testing**: Test changes locally before releasing
3. ✅ **Version Control**: Release only stable, tested versions
4. ✅ **Clean Distribution**: Users get only what they need
5. ✅ **Rollback Safety**: Can revert to previous releases easily

---

## 📦 What Goes Where?

### Main Project (`.claude/`)

**Framework Files:**
- ✅ All workflow markdown files
- ✅ All agent definitions
- ✅ All command implementations
- ✅ All templates
- ✅ All skills
- ✅ CLAUDE.md routing file

**CLI Tool:**
- ✅ `lib/` - CLI implementation
- ✅ `bin/` - Executable scripts
- ✅ `tests/` - Test suite
- ✅ `package.json` - npm configuration

**Documentation:**
- ✅ User guides (GETTING_STARTED.md, etc.)
- ✅ Developer docs (CONTRIBUTING.md, etc.)
- ✅ This file (FRAMEWORK_ARCHITECTURE.md)

### Distribution Repo (`framework-repo-setup/`)

**Only Framework Files:**
- ✅ `.claude/` directory (synced copy)
- ✅ `CLAUDE.md` (synced copy)
- ✅ `version.json` (manually maintained)
- ✅ `README.md` (repository documentation)
- ✅ `LICENSE`, `.gitignore`

**NOT included:**
- ❌ CLI tool (`lib/`, `bin/`)
- ❌ Tests
- ❌ Development documentation
- ❌ npm package.json

---

## 🛠️ Sync Script Details

### What `./scripts/sync-framework.sh` Does

```bash
# Copies main project files to distribution repo
.claude/          → framework-repo-setup/.claude/
CLAUDE.md         → framework-repo-setup/CLAUDE.md

# Counts files and warns if counts changed
# Shows you what to do next
```

### When to Run It

Run `sync-framework.sh` whenever you:
- ✅ Update any workflow
- ✅ Modify any agent
- ✅ Change any command
- ✅ Add/remove any framework file
- ✅ Update CLAUDE.md

**Don't run for:**
- ❌ Changes to CLI tool (`lib/`, `bin/`)
- ❌ Updates to user documentation
- ❌ Test modifications
- ❌ Changes to package.json

---

## 📚 Complete Documentation

- **This File:** Architecture overview and quick reference
- **Detailed Workflow:** `FRAMEWORK_UPDATE_WORKFLOW.md` - Complete update guide
- **Initial Setup:** `docs/status/NEXT_STEPS.md` - First-time deployment
- **Implementation Status:** `docs/status/IMPLEMENTATION_COMPLETE.md` - What's done
- **Visual Status:** `CRITICAL_BLOCKERS_STATUS.md` - Current state

---

## 🎯 Remember

```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  📝 DEVELOP in:  .claude/                                      ║
║  🔄 SYNC with:   ./scripts/sync-framework.sh                   ║
║  🚀 RELEASE in:  framework-repo-setup/                         ║
║  💻 USERS get:   via pm-kit update                             ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

**Never edit files in `framework-repo-setup/.claude/` directly - they will be overwritten on next sync!**

---

For detailed workflow instructions, see: **`FRAMEWORK_UPDATE_WORKFLOW.md`**
