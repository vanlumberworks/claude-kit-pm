# Framework Update Workflow

This guide explains how to update the ClaudeKit PM framework files and release new versions.

## 📁 Understanding the Architecture

### Two Locations, One Purpose

```
claude-kit-pm/
├── .claude/                    ← MAIN (Source of Truth)
│   ├── workflows/              ← Edit files HERE
│   ├── agents/
│   ├── commands/
│   ├── templates/
│   └── skills/
├── CLAUDE.md                   ← Edit HERE
│
└── framework-repo-setup/       ← DISTRIBUTION (Snapshot)
    ├── .claude/                ← Synced copy
    ├── CLAUDE.md               ← Synced copy
    └── version.json            ← Update for releases
```

### The Flow

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  1. DEVELOP                                                 │
│  ──────────                                                 │
│  Edit in: claude-kit-pm/.claude/                            │
│  Test with: claude                                          │
│                                                             │
│  ↓                                                          │
│                                                             │
│  2. SYNC                                                    │
│  ────────                                                   │
│  Run: ./scripts/sync-framework.sh                           │
│  Copies: .claude/ → framework-repo-setup/.claude/           │
│                                                             │
│  ↓                                                          │
│                                                             │
│  3. RELEASE                                                 │
│  ─────────                                                  │
│  Update: version.json                                       │
│  Commit & Tag: git tag v0.1.1                               │
│  Push: git push origin v0.1.1                               │
│  Release: gh release create v0.1.1                          │
│                                                             │
│  ↓                                                          │
│                                                             │
│  4. USERS GET UPDATE                                        │
│  ──────────────────                                         │
│  Run: pm-kit update                                         │
│  Downloads: from GitHub release                             │
│  Installs: to their-project/.claude/                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Development Workflow

### Scenario 1: Update an Existing Workflow

```bash
# 1. Edit in main project
vim .claude/workflows/prd-framework.md

# 2. Test locally
claude
/prd  # Test your changes

# 3. Sync to distribution repo
./scripts/sync-framework.sh

# 4. Create release (see "Creating Releases" below)
```

### Scenario 2: Add a New Agent

```bash
# 1. Create new agent in main project
vim .claude/agents/new-agent.md

# 2. Test locally
claude
# Test the new agent

# 3. Sync to distribution repo
./scripts/sync-framework.sh

# 4. Update version.json (file count increased!)
cd framework-repo-setup
# Edit version.json - increment agent count
# Change version from 0.1.0 to 0.2.0 (minor version for new features)

# 5. Create release
```

### Scenario 3: Fix a Bug in a Command

```bash
# 1. Edit in main project
vim .claude/commands/prd.md

# 2. Test locally
claude
/prd  # Verify fix

# 3. Sync to distribution repo
./scripts/sync-framework.sh

# 4. Update version.json
cd framework-repo-setup
# Change version from 0.1.0 to 0.1.1 (patch version for bug fixes)

# 5. Create release
```

## 📦 Creating Releases

### Version Numbering (Semantic Versioning)

```
v0.1.0
 │ │ │
 │ │ └─ Patch (bug fixes, typos)
 │ └─── Minor (new features, backward compatible)
 └───── Major (breaking changes)
```

**Examples:**
- Bug fix in workflow: `0.1.0` → `0.1.1`
- New agent added: `0.1.0` → `0.2.0`
- Major restructure: `0.1.0` → `1.0.0`

### Step-by-Step Release Process

#### 1. Sync Framework Files

```bash
# From claude-kit-pm root
./scripts/sync-framework.sh
```

#### 2. Update version.json

```bash
cd framework-repo-setup

# Edit version.json
vim version.json
```

**Update these fields:**
```json
{
  "version": "0.1.1",  ← Change this
  "releaseDate": "2024-11-22T00:00:00Z",  ← Update date
  "files": {
    "workflows": 18,  ← Update if count changed
    "agents": 10,
    "commands": 16,
    "templates": 4,
    "skills": 5
  },
  "changelog": [
    {
      "version": "0.1.1",  ← Add new entry
      "date": "2024-11-22",
      "changes": [
        "Fixed bug in PRD workflow step 3",
        "Updated research synthesis confidence scoring",
        "Improved error handling in matrix generation"
      ]
    },
    {
      "version": "0.1.0",  ← Previous entries
      "date": "2024-11-21",
      "changes": [...]
    }
  ]
}
```

#### 3. Commit Changes

```bash
# Still in framework-repo-setup
git add .
git commit -m "Release v0.1.1: Bug fixes and improvements

- Fixed bug in PRD workflow step 3
- Updated research synthesis confidence scoring
- Improved error handling in matrix generation"
```

#### 4. Create Tag

```bash
git tag -a v0.1.1 -m "Release v0.1.1: Bug fixes and improvements

Changes:
- Fixed bug in PRD workflow step 3
- Updated research synthesis confidence scoring
- Improved error handling in matrix generation

Compatible with pm-kit-cli v0.1.0+"
```

#### 5. Push to GitHub

```bash
git push origin main
git push origin v0.1.1
```

#### 6. Create GitHub Release

```bash
gh release create v0.1.1 \
  --title "v0.1.1 - Bug Fixes and Improvements" \
  --notes "## What's Changed

- Fixed bug in PRD workflow step 3
- Updated research synthesis confidence scoring
- Improved error handling in matrix generation

## Installation

\`\`\`bash
pm-kit update
\`\`\`

## Compatibility

- pm-kit-cli: v0.1.0+
- Claude Code: Latest
- Node.js: 16+

**Full Changelog**: https://github.com/vanlumberworks/claudekit-pm-framework/compare/v0.1.0...v0.1.1"
```

#### 7. Test the Release

```bash
# Create test directory
mkdir -p /tmp/test-update
cd /tmp/test-update

# Initialize with old version
pm-kit init

# Update to new version
pm-kit update

# Verify
pm-kit doctor
```

## 🔄 Sync Script Usage

### Basic Usage

```bash
# From claude-kit-pm root
./scripts/sync-framework.sh
```

### What It Does

1. ✅ Copies `.claude/` → `framework-repo-setup/.claude/`
2. ✅ Copies `CLAUDE.md` → `framework-repo-setup/CLAUDE.md`
3. ✅ Counts files and shows summary
4. ⚠️ Warns if file counts changed
5. 📝 Shows next steps

### Example Output

```
╔════════════════════════════════════════╗
║  Sync Framework to Distribution Repo  ║
╚════════════════════════════════════════╝

Will sync:
  .claude/ → framework-repo-setup/.claude/
  CLAUDE.md → framework-repo-setup/CLAUDE.md

Continue? (y/n): y

ℹ Syncing .claude/ directory...
✓ .claude/ synced
ℹ Syncing CLAUDE.md...
✓ CLAUDE.md synced

Framework file counts:
  Workflows: 18
  Agents: 10
  Commands: 16
  Templates: 4
  Skills: 5

╔════════════════════════════════════════╗
║          ✓ Sync Complete!              ║
╚════════════════════════════════════════╝
```

## 🎯 Common Scenarios

### Q: I updated a workflow. Which file do I edit?

**A:** Edit in the main project:
```bash
vim .claude/workflows/prd-framework.md  # ← Edit here
# NOT: framework-repo-setup/.claude/workflows/prd-framework.md
```

Then sync:
```bash
./scripts/sync-framework.sh
```

### Q: I added a new skill. What do I need to update?

**A:** After syncing:
1. ✅ Update file count in `framework-repo-setup/version.json`
2. ✅ Increment version number (0.1.0 → 0.2.0 for new feature)
3. ✅ Add changelog entry
4. ✅ Create release

### Q: Users report a bug. How do I fix and release?

**A:**
```bash
# 1. Fix in main project
vim .claude/workflows/problematic-workflow.md

# 2. Test locally
claude
# Verify fix

# 3. Sync
./scripts/sync-framework.sh

# 4. Release
cd framework-repo-setup
# Update version.json (0.1.0 → 0.1.1 for bug fix)
git add .
git commit -m "Fix: [bug description]"
git tag -a v0.1.1 -m "Fix: [bug description]"
git push origin main v0.1.1
gh release create v0.1.1
```

### Q: Can I edit files directly in framework-repo-setup?

**A:** ⚠️ **Not recommended!**

If you edit in `framework-repo-setup/`, those changes will be **overwritten** next time you run `sync-framework.sh`.

**Always edit in the main `.claude/` directory.**

## 📋 Pre-Release Checklist

Before creating a release:

- [ ] All changes tested locally with `claude`
- [ ] Synced to distribution repo with `./scripts/sync-framework.sh`
- [ ] Updated `version.json` with new version number
- [ ] Updated `version.json` with file counts (if changed)
- [ ] Added changelog entry to `version.json`
- [ ] Committed all changes
- [ ] Created and pushed tag
- [ ] Created GitHub release
- [ ] Tested release with fresh install

## 🛡️ Best Practices

### 1. Test Before Syncing
```bash
# Always test in main project first
cd /Users/tranvan/Projects/claude-kit-pm
claude
# Test your changes thoroughly
```

### 2. Use Descriptive Commit Messages
```bash
# Good
git commit -m "Fix: PRD workflow step 3 validation logic"

# Bad
git commit -m "fix"
```

### 3. Keep Changelog Updated
Document all user-facing changes in `version.json`:
```json
"changes": [
  "Fixed validation bug in PRD workflow",  ← User benefit
  "Updated error messages for clarity",     ← User benefit
  "Improved documentation examples"        ← User benefit
]
```

### 4. Follow Semantic Versioning
```
Bug fixes only:         0.1.0 → 0.1.1
New features:          0.1.0 → 0.2.0
Breaking changes:      0.1.0 → 1.0.0
```

## 🆘 Troubleshooting

### "Files already up to date" but I made changes

**Solution:** You edited in `framework-repo-setup/` instead of main project.

1. Copy your changes to main project
2. Run sync script again

### File counts don't match

**Solution:**
1. Run sync script: `./scripts/sync-framework.sh`
2. It will show actual counts
3. Update `framework-repo-setup/version.json` to match

### Git says "nothing to commit"

**Solution:** You haven't synced yet.
```bash
./scripts/sync-framework.sh
cd framework-repo-setup
git status  # Should now show changes
```

## 📚 Related Documentation

- **Main README:** `README.md` - Project overview
- **Next Steps:** `NEXT_STEPS.md` - Initial deployment
- **Production Guide:** `PRODUCTION_READINESS.md` - Production checklist

---

## 🎯 Quick Reference

**Development:**
```bash
vim .claude/workflows/my-workflow.md  # Edit in main project
claude                                 # Test locally
./scripts/sync-framework.sh            # Sync to distribution
```

**Release:**
```bash
cd framework-repo-setup
vim version.json                       # Update version & changelog
git add . && git commit -m "Release vX.Y.Z"
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin main vX.Y.Z
gh release create vX.Y.Z
```

**Update Main Project Constants (if needed):**
```bash
# If file counts changed, update:
vim lib/constants.js
# Update EXPECTED_FILES to match actual counts
```

---

**Remember:** Always develop in the main `.claude/` directory, then sync to `framework-repo-setup/` for distribution! 🚀
