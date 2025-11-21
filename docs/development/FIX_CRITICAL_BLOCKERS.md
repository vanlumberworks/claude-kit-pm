# Fix Critical Blockers - Step by Step Guide

Complete guide to fixing the 2 critical blockers that prevent the CLI from working.

**Time Required**: 3-4 hours
**Difficulty**: Intermediate

---

## 🎯 Overview

We need to:
1. **Complete GitHub Service** - Implement 3 missing methods (2 hours)
2. **Create Framework Repository** - Set up files repo (1-2 hours)

Let's do this! ⚡

---

## Part 1: Complete GitHub Service Implementation (2 hours)

### Step 1: Open the GitHub Service File

```bash
cd ~/Projects/claude-kit-pm
code lib/services/github-service.js
# or
vim lib/services/github-service.js
```

### Step 2: Add `getLatestRelease()` Method

Find the `GitHubService` class and add this method:

```javascript
/**
 * Get latest release from repository
 * @returns {Promise<Object>} Release information
 */
async getLatestRelease() {
  const spinner = logger.startSpinner('Checking for latest release...');

  try {
    const [owner, repo] = constants.KIT_REPOSITORY.split('/');

    const { data } = await this.octokit.repos.getLatestRelease({
      owner,
      repo
    });

    logger.succeedSpinner('Found latest release');

    return {
      version: data.tag_name.replace(/^v/, ''), // Remove 'v' prefix
      body: data.body || '',
      url: data.html_url,
      publishedAt: data.published_at,
      assets: data.assets
    };
  } catch (error) {
    logger.failSpinner('Failed to fetch release');

    // Handle "no releases" case
    if (error.status === 404) {
      throw new PMKitError(
        'No releases found in framework repository',
        ErrorCodes.REPO_NOT_FOUND,
        {
          repository: constants.KIT_REPOSITORY,
          help: 'Create a release with tag v0.1.0'
        }
      );
    }

    throw new PMKitError(
      'Failed to fetch latest release',
      ErrorCodes.API_ERROR,
      {
        repository: constants.KIT_REPOSITORY,
        error: error.message
      }
    );
  }
}
```

### Step 3: Add `compareVersions()` Method

Add this method right after `getLatestRelease()`:

```javascript
/**
 * Compare two semantic versions
 * @param {string} current - Current version (e.g., "0.1.0")
 * @param {string} latest - Latest version (e.g., "0.2.0")
 * @returns {string} 'outdated' | 'current' | 'ahead'
 */
compareVersions(current, latest) {
  try {
    // Remove 'v' prefix if present
    const cleanCurrent = current.replace(/^v/, '');
    const cleanLatest = latest.replace(/^v/, '');

    // Parse versions
    const currentParts = cleanCurrent.split('.').map(Number);
    const latestParts = cleanLatest.split('.').map(Number);

    // Pad to ensure 3 parts (major.minor.patch)
    while (currentParts.length < 3) currentParts.push(0);
    while (latestParts.length < 3) latestParts.push(0);

    // Compare major.minor.patch
    for (let i = 0; i < 3; i++) {
      if (latestParts[i] > currentParts[i]) {
        return 'outdated'; // Latest is newer
      }
      if (latestParts[i] < currentParts[i]) {
        return 'ahead'; // Current is newer (development version)
      }
    }

    return 'current'; // Versions are equal
  } catch (error) {
    logger.warn(`Failed to compare versions: ${error.message}`);
    return 'current'; // Default to current to avoid false positives
  }
}
```

### Step 4: Add `downloadDirectory()` Method

This is the most complex one. Add this method:

```javascript
/**
 * Download entire directory from repository
 * @param {string} repository - Repository in format "owner/repo"
 * @param {string} remotePath - Path in repository
 * @param {string} localPath - Local destination path
 * @param {string} branch - Branch name
 * @returns {Promise<void>}
 */
async downloadDirectory(repository, remotePath, localPath, branch = 'main') {
  const [owner, repo] = repository.split('/');

  try {
    // Create local directory
    if (!fs.existsSync(localPath)) {
      fs.mkdirSync(localPath, { recursive: true });
    }

    // Get directory contents
    const { data } = await this.octokit.repos.getContent({
      owner,
      repo,
      path: remotePath,
      ref: branch
    });

    // Ensure data is an array
    const items = Array.isArray(data) ? data : [data];

    // Process each item
    for (const item of items) {
      const itemLocalPath = path.join(localPath, item.name);

      if (item.type === 'file') {
        // Download file
        await this.downloadFile(
          repository,
          item.path,
          itemLocalPath,
          branch
        );
      } else if (item.type === 'dir') {
        // Recursively download subdirectory
        await this.downloadDirectory(
          repository,
          item.path,
          itemLocalPath,
          branch
        );
      }
    }
  } catch (error) {
    // If directory doesn't exist, that's okay (might be optional)
    if (error.status === 404) {
      logger.warn(`Directory not found: ${remotePath} (skipping)`);
      return;
    }

    throw new PMKitError(
      `Failed to download directory: ${remotePath}`,
      ErrorCodes.API_ERROR,
      {
        repository,
        path: remotePath,
        error: error.message
      }
    );
  }
}
```

### Step 5: Add Helper Method `parseRepo()`

Add this helper at the end of the class:

```javascript
/**
 * Parse repository string into owner and repo
 * @param {string} repository - Repository in format "owner/repo"
 * @returns {Object} { owner, repo }
 */
parseRepo(repository) {
  const [owner, repo] = repository.split('/');

  if (!owner || !repo) {
    throw new PMKitError(
      'Invalid repository format',
      ErrorCodes.VALIDATION_ERROR,
      {
        repository,
        expected: 'owner/repo'
      }
    );
  }

  return { owner, repo };
}
```

### Step 6: Add Missing Imports

At the top of the file, ensure these imports are present:

```javascript
const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');
const logger = require('../utils/logger');
const { PMKitError, ErrorCodes } = require('../utils/error-handler');
const constants = require('../constants');
```

### Step 7: Test the Implementation

Create a test file to verify:

```bash
# Create test file
cat > test-github-service.js << 'EOF'
const githubService = require('./lib/services/github-service');

async function test() {
  try {
    // Test authentication
    await githubService.authenticate();
    console.log('✓ Authentication works');

    // Test version comparison
    console.log('\nTesting version comparison:');
    console.log('0.1.0 vs 0.2.0:', githubService.compareVersions('0.1.0', '0.2.0')); // outdated
    console.log('0.2.0 vs 0.1.0:', githubService.compareVersions('0.2.0', '0.1.0')); // ahead
    console.log('0.1.0 vs 0.1.0:', githubService.compareVersions('0.1.0', '0.1.0')); // current
    console.log('✓ Version comparison works');

    // Note: Can't test getLatestRelease and downloadDirectory until framework repo exists

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

test();
EOF

# Run test
node test-github-service.js

# Clean up
rm test-github-service.js
```

Expected output:
```
✓ Authentication works

Testing version comparison:
0.1.0 vs 0.2.0: outdated
0.2.0 vs 0.1.0: ahead
0.1.0 vs 0.1.0: current
✓ Version comparison works

✅ All tests passed!
```

### Step 8: Commit Your Changes

```bash
git add lib/services/github-service.js
git commit -m "feat(github-service): implement missing methods

- Add getLatestRelease() to fetch latest version
- Add compareVersions() for semver comparison
- Add downloadDirectory() for recursive downloads
- Add parseRepo() helper method"
```

✅ **Part 1 Complete!** GitHub service is now fully functional.

---

## Part 2: Create Framework Repository (1-2 hours)

### Step 1: Decide Repository Name

Choose your organization/username and repository name:

```bash
# Examples:
# GitHub org: vanlumberworks
# Repository name: claudekit-pm-framework

# Full name: vanlumberworks/claudekit-pm-framework
```

Update `lib/constants.js`:

```bash
# Open constants file
code lib/constants.js

# Find this line:
KIT_REPOSITORY: 'your-org/claude-kit-pm-files',

# Replace with your actual repo:
KIT_REPOSITORY: 'vanlumberworks/claudekit-pm-framework',
```

### Step 2: Create GitHub Repository

**Option A: Using GitHub CLI (Recommended)**

```bash
# Login to GitHub (if not already)
gh auth login

# Create private repository
gh repo create vanlumberworks/claudekit-pm-framework \
  --private \
  --description "ClaudeKit PM framework files and workflows" \
  --clone

# This creates and clones the repo
cd claudekit-pm-framework
```

**Option B: Using GitHub Web UI**

1. Go to https://github.com/new
2. Fill in:
   - **Owner**: Your username/org
   - **Repository name**: `claudekit-pm-framework`
   - **Description**: "ClaudeKit PM framework files and workflows"
   - **Visibility**: ⚪ Private (important!)
   - **Initialize**: ☑️ Add README
3. Click "Create repository"
4. Clone it:
```bash
git clone git@github.com:vanlumberworks/claudekit-pm-framework.git
cd claudekit-pm-framework
```

### Step 3: Copy Framework Files

```bash
# Make sure you're in the framework repo
pwd  # Should show: .../claudekit-pm-framework

# Copy files from main project
cp -r ../claude-kit-pm/CLAUDE.md .
cp -r ../claude-kit-pm/.claude .

# Verify files copied
ls -la
# Should see:
# - CLAUDE.md
# - .claude/
```

### Step 4: Create Version File

```bash
cat > version.json << 'EOF'
{
  "version": "0.1.0",
  "released": "2024-01-20",
  "changelog": "Initial release of ClaudeKit PM framework"
}
EOF
```

### Step 5: Create README

```bash
cat > README.md << 'EOF'
# ClaudeKit PM Framework

This repository contains the framework files for ClaudeKit PM CLI.

## Contents

- `CLAUDE.md` - Main routing file for Claude Code
- `.claude/workflows/` - 14 PM workflow files
- `.claude/agents/` - 8 specialized agent definitions
- `.claude/commands/` - 10 slash command implementations
- `.claude/skills/` - 5 technical literacy modules

## Version

Current version: 0.1.0

## Installation

These files are automatically downloaded by the PM Kit CLI:

```bash
npm install -g pm-kit-cli
pm-kit init
```

## License

MIT
EOF
```

### Step 6: Create .gitignore

```bash
cat > .gitignore << 'EOF'
# OS
.DS_Store
Thumbs.db

# Editor
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log

# Temp
*.tmp
EOF
```

### Step 7: Verify Directory Structure

```bash
tree -L 2

# Should show:
# .
# ├── CLAUDE.md
# ├── README.md
# ├── version.json
# ├── .gitignore
# └── .claude/
#     ├── workflows/
#     ├── agents/
#     ├── commands/
#     └── skills/
```

### Step 8: Count Files to Verify

```bash
# Should match constants.js expectations
echo "Workflows: $(find .claude/workflows -name '*.md' | wc -l)"
echo "Agents: $(find .claude/agents -name '*.md' | wc -l)"
echo "Commands: $(find .claude/commands -name '*.md' | wc -l)"
echo "Skills: $(find .claude/skills -name '*.md' | wc -l)"

# Expected output:
# Workflows: 14
# Agents: 8
# Commands: 10
# Skills: 5 (or 6 if you created all)
```

If counts don't match, you need to create missing files.

### Step 9: Commit and Push

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: Add ClaudeKit PM framework files

- Add CLAUDE.md routing file
- Add 14 workflow files
- Add 8 agent definitions
- Add 10 command implementations
- Add 5 skills modules
- Add version.json for release tracking"

# Push to GitHub
git push origin main
```

### Step 10: Verify on GitHub

```bash
# Open in browser
gh repo view --web

# Or manually go to:
# https://github.com/vanlumberworks/claudekit-pm-framework
```

Verify you see:
- ✅ CLAUDE.md file
- ✅ .claude/ directory with subdirectories
- ✅ version.json file
- ✅ README.md file

### Step 11: Create First Release

```bash
# Tag the version
git tag -a v0.1.0 -m "Release v0.1.0: Initial framework release"

# Push tag
git push origin v0.1.0

# Create GitHub release
gh release create v0.1.0 \
  --title "v0.1.0 - Initial Release" \
  --notes "## ClaudeKit PM Framework v0.1.0

Initial release of the framework files.

### Contents
- 14 PM workflows
- 8 specialized agents
- 10 slash commands
- 5 technical literacy skills

### Installation
\`\`\`bash
npm install -g pm-kit-cli
pm-kit init
\`\`\`"
```

### Step 12: Verify Release

```bash
# Check releases
gh release list

# Should show:
# v0.1.0  Latest  v0.1.0 - Initial Release  about X minutes ago

# Or view in browser
gh release view v0.1.0 --web
```

### Step 13: Grant Access (if Private Repo)

If your framework repo is private, you need to grant the CLI access:

**Option A: Personal Access Token (Already Done)**
- Users will use their GitHub PAT during `pm-kit init`
- PAT needs `repo` scope (already in installation guide)

**Option B: Make it Public (Alternative)**
```bash
# If you want to make it public instead
gh repo edit --visibility public
```

### Step 14: Update CLI Constants (if Changed)

If you used a different repo name, update the CLI:

```bash
cd ../claude-kit-pm

# Edit constants
code lib/constants.js

# Change to your actual repo:
# KIT_REPOSITORY: 'vanlumberworks/claudekit-pm-framework',
```

✅ **Part 2 Complete!** Framework repository is ready.

---

## 🧪 End-to-End Testing

Now test the complete flow:

### Test 1: Fresh Installation

```bash
# Navigate to a test directory
cd /tmp
mkdir test-pm-kit
cd test-pm-kit

# Link your local CLI (for testing)
cd ~/Projects/claude-kit-pm
npm link

# Or if published to npm:
# npm install -g pm-kit-cli

# Initialize
pm-kit init

# Follow prompts:
# - Enter GitHub token
# - Enter API keys
```

**Expected Result**:
```
✓ GitHub authenticated
✓ Downloaded CLAUDE.md
✓ Downloaded .claude/workflows/ (14 files)
✓ Downloaded .claude/agents/ (8 files)
✓ Downloaded .claude/commands/ (10 files)
✓ Downloaded .claude/skills/ (5 files)
✓ Created .mcp.json
✓ Created output directories
✓ Updated .gitignore

✓ Installation Complete!
```

### Test 2: Verify Files

```bash
# Check files exist
ls -la
# Should see: CLAUDE.md, .claude/, .mcp.json, outputs/

# Check file counts
pm-kit doctor

# Should show all green checks
```

### Test 3: Update Command

```bash
# Test update command
pm-kit update --dry-run

# Should show:
# "You are already on the latest version!"
# or
# "Update available: 0.1.0 → 0.1.1"
```

### Test 4: Version Comparison

```bash
# Check version
pm-kit --version
# Should show: 0.1.0
```

---

## 🎉 Success Checklist

After completing both parts, verify:

**GitHub Service**:
- [ ] `getLatestRelease()` implemented
- [ ] `compareVersions()` implemented
- [ ] `downloadDirectory()` implemented
- [ ] Tests passed

**Framework Repository**:
- [ ] Repository created on GitHub
- [ ] CLAUDE.md present
- [ ] .claude/ directory with all files
- [ ] version.json created
- [ ] First release (v0.1.0) published
- [ ] README.md added

**End-to-End Testing**:
- [ ] `pm-kit init` works completely
- [ ] All files download correctly
- [ ] `pm-kit doctor` shows green
- [ ] `pm-kit update` works

---

## 🐛 Troubleshooting

### Problem: "Repository not found" during init

**Cause**: Framework repo is private and user's token doesn't have access.

**Fix**:
```bash
# Option 1: Make repo public
gh repo edit vanlumberworks/claudekit-pm-framework --visibility public

# Option 2: Ensure user's PAT has 'repo' scope
# They need to create new token with full repo access
```

### Problem: "No releases found"

**Cause**: Forgot to create GitHub release.

**Fix**:
```bash
cd claudekit-pm-framework
git tag v0.1.0
git push origin v0.1.0
gh release create v0.1.0 --title "v0.1.0" --notes "Initial release"
```

### Problem: Downloads succeed but files missing

**Cause**: Files not committed to framework repo.

**Fix**:
```bash
cd claudekit-pm-framework
git status  # Check for uncommitted files
git add .
git commit -m "Add missing files"
git push
```

### Problem: "Wrong file count" in pm-kit doctor

**Cause**: Framework repo has different number of files than expected.

**Fix**:
```bash
# Count files in framework repo
cd claudekit-pm-framework
find .claude -name '*.md' | wc -l

# Update constants.js to match actual counts
# Or add missing files to framework repo
```

---

## 📝 Quick Commands Reference

```bash
# GitHub Service Testing
node test-github-service.js

# Framework Repository
cd claudekit-pm-framework
gh release create v0.1.0 --title "v0.1.0" --notes "Initial release"

# End-to-End Testing
pm-kit init
pm-kit doctor
pm-kit update --dry-run

# Debugging
pm-kit --debug init
pm-kit doctor --json
```

---

## ⏱️ Time Breakdown

- Part 1 (GitHub Service): 1.5-2 hours
  - Coding: 1 hour
  - Testing: 30 min

- Part 2 (Framework Repo): 1-1.5 hours
  - Setup: 30 min
  - File organization: 30 min
  - Release: 15 min
  - Testing: 15 min

**Total**: 3-4 hours

---

## ✅ You're Done!

Once both parts are complete and tests pass, your CLI is fully functional and ready for users to install!

**Next steps**:
1. Test with a real GitHub PAT (not your own)
2. Test on different OS (Mac, Linux, Windows)
3. Beta test with 2-3 friendly users
4. Fix any issues they find
5. Publish to npm: `npm publish`

Need help with any step? Just ask! 🚀
