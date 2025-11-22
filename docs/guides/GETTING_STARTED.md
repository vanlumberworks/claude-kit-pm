# Getting Started with ClaudeKit PM

A complete guide to installing and using the ClaudeKit PM CLI - from zero to your first PRD in 10 minutes.

## 📋 Table of Contents

- [What You'll Get](#what-youll-get)
- [Before You Start](#before-you-start)
- [Installation (5 minutes)](#installation-5-minutes)
- [First-Time Setup (5 minutes)](#first-time-setup-5-minutes)
- [Your First PRD (10 minutes)](#your-first-prd-10-minutes)
- [Daily Workflow](#daily-workflow)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

## What You'll Get

After following this guide, you'll have:

✅ PM Kit CLI installed globally on your machine
✅ Complete PM framework downloaded to your project
✅ 14 workflows (PRD, research, prioritization, etc.)
✅ 8 specialized AI agents
✅ 10 slash commands ready to use in Claude
✅ 5 technical literacy modules
✅ Working MCP server configuration

**Time investment**: 15 minutes
**Result**: Professional PM toolkit at your fingertips

## Before You Start

### What You Need

**Required** (must have):
- [ ] Computer with macOS, Linux, or Windows
- [ ] Node.js 16 or higher ([download here](https://nodejs.org/))
- [ ] GitHub account (free) ([sign up here](https://github.com/signup))
- [ ] 15 minutes of uninterrupted time

**Recommended** (nice to have):
- [ ] Claude CLI ([install here](https://claude.ai/code))
- [ ] Basic terminal/command line knowledge
- [ ] Text editor (VS Code recommended)

### Check If You're Ready

Open your terminal and run these commands:

```bash
# Check Node.js (should show v16.0.0 or higher)
node --version

# Check npm (should show 8.0.0 or higher)
npm --version

# Check if you have a package manager
pnpm --version  # Recommended, or use npm
```

**Don't have Node.js?**
```bash
# macOS (with Homebrew)
brew install node

# Windows (with Chocolatey)
choco install nodejs

# Or download from: https://nodejs.org/
```

---

## Installation (5 minutes)

### Step 1: Install the CLI

Open your terminal and run:

```bash
# Option A: Using pnpm (recommended - faster)
pnpm install -g pm-kit-cli

# Option B: Using npm (comes with Node.js)
npm install -g pm-kit-cli

# Option C: Using yarn
yarn global add pm-kit-cli
```

**What this does**: Installs the `pm-kit` command globally so you can use it anywhere.

### Step 2: Verify Installation

```bash
pm-kit --version
# Should show: 0.1.0 (or higher)

pm-kit --help
# Should show: Available commands...
```

✅ **Checkpoint**: You should see version number and help text. If not, see [Troubleshooting](#troubleshooting).

### Step 3: Get Your GitHub Token

You need a GitHub Personal Access Token to download the PM framework files.

**Create your token** (2 minutes):

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Settings:
   - **Note**: `PM Kit CLI`
   - **Expiration**: `No expiration` (or 90 days)
   - **Scopes**: Check ✅ `repo` (Full control of private repositories)
4. Click **"Generate token"** (green button at bottom)
5. **COPY THE TOKEN** (you won't see it again!) - looks like: `ghp_xxxxxxxxxxxxxxxxxxxx`

**Save it somewhere safe** - you'll need it in the next step.

### Step 4: Get Your API Keys (Optional)

All API keys are optional - you can skip this step and configure later!

#### Google Gemini (Optional - For Multi-Modal Analysis)

1. Go to: https://ai.google.dev/
2. Sign in with Google account
3. Click **"Create API key"**
4. Copy your key - looks like: `AIzaxxxxxxxxxxxxxxxx`

✅ **Checkpoint**: You have your GitHub token ready. API keys can be added later via `pm-kit config`.

---

## First-Time Setup (5 minutes)

### Step 1: Navigate to Your Project

```bash
# Go to your project directory
cd ~/Projects/my-product

# Or create a new directory
mkdir ~/Projects/my-product
cd ~/Projects/my-product
```

### Step 2: Initialize PM Kit

```bash
pm-kit init
```

You'll see a welcome screen:

```
┌────────────────────────────────────────┐
│      ClaudeKit PM Installer           │
│                                        │
│      Version 0.1.0                     │
│      Simple installation for PMs      │
└────────────────────────────────────────┘
```

### Step 3: Follow the Prompts

The installer will guide you through:

**1. Environment Check** (automatic)
```
✓ Pre-flight Checks
✓ Node.js: v20.10.0
⚠ Claude CLI: Not found (recommended but optional)
```

**2. GitHub Authentication**
```
? GitHub Personal Access Token:
```
Paste your GitHub token (the one starting with `ghp_`) and press Enter.

**Tip**: The token won't show as you type - this is normal for security!

**3. Downloading Framework Files**
```
⠸ Downloading framework files...
✓ Downloaded CLAUDE.md
✓ Downloaded .claude/workflows/ (14 files)
✓ Downloaded .claude/agents/ (8 files)
✓ Downloaded .claude/commands/ (10 files)
```

**4. API Key Configuration (Optional)**
```
? Gemini API Key (press Enter to skip): [paste or press Enter to skip]
```

**5. Final Setup** (automatic)
```
✓ Created .mcp.json
✓ Created output directories
✓ Updated .gitignore
```

### Step 4: Success!

You should see:

```
┌────────────────────────────────────────┐
│      ✓ Installation Complete!         │
│                                        │
│      Next steps:                      │
│      1. Run: claude                   │
│      2. Use: /prd, /research          │
│      3. Read: CLAUDE.md               │
└────────────────────────────────────────┘
```

✅ **Checkpoint**: Your directory should now have:
```bash
ls -la
# You should see:
# CLAUDE.md
# .claude/
# .mcp.json
# .gitignore (updated)
# outputs/
```

### Step 5: Verify Installation

```bash
pm-kit doctor
```

You should see all green checkmarks:

```
File Structure
✓  CLAUDE.md: Present
✓  .claude/ directory: Present
✓  Workflows: 14/14 files
✓  Agents: 8/8 files
✓  Commands: 10/10 files

API Configuration
✓  MCP Configuration: Valid
ℹ  gemini: Not configured (optional)

Summary
✓ All checks passed! ✨
```

🎉 **You're all set!** The PM Kit is installed and ready to use.

---

## Your First PRD (10 minutes)

Let's create your first Product Requirements Document using Claude.

### Step 1: Start Claude CLI

```bash
# In your project directory
claude
```

You should see Claude start up and load your PM Kit configuration.

### Step 2: Use the /prd Command

In Claude, type:

```
/prd
```

Claude will guide you through creating a PRD with a structured interview:

```
I'll help you create a comprehensive PRD. Let me gather information:

1. What product/feature are you building?
```

**Example responses**:

**Your input**:
> A feature that allows users to export their analytics data to CSV format

**Claude continues**:
```
2. Who is this for? (target users)
```

**Your input**:
> Data analysts and PMs who need to create custom reports in Excel

**Claude continues** through:
- 3. What problem does this solve?
- 4. What are the success metrics?
- 5. What are the key user stories?
- 6. What are the technical constraints?
- 7. What are the non-goals?

### Step 3: Review Generated PRD

After answering questions, Claude will generate a complete PRD:

```markdown
# PRD: Analytics Export to CSV

## Overview
Feature that enables users to export analytics data to CSV format for
custom analysis in Excel or other tools.

## Target Users
- Data analysts needing custom reports
- Product managers creating executive summaries
- Business intelligence teams

## Problem Statement
Users currently cannot export raw data for custom analysis, forcing them
to manually copy data or take screenshots.

## Success Metrics
- 30% of users export data within first month
- Average export time < 5 seconds
- 90% successful export rate

## User Stories

### Story 1: Export Dashboard Data
As a data analyst
I want to export my dashboard data to CSV
So I can create custom reports in Excel

**Acceptance Criteria:**
- [ ] User clicks "Export" button on dashboard
- [ ] CSV file downloads immediately
- [ ] File includes all visible data with headers
- [ ] Filename: analytics_export_YYYY-MM-DD.csv

... (full PRD continues)
```

The PRD is automatically saved to `outputs/prds/analytics-export-to-csv.md`

### Step 4: Review and Refine

```
Can you add a section about data privacy considerations?
```

Claude will update the PRD with a new section:

```markdown
## Data Privacy & Security

### Considerations
- CSV exports contain sensitive user data
- Must comply with GDPR right to erasure
- Require authentication to download

### Requirements
- [ ] Implement rate limiting (10 exports/hour)
- [ ] Log all export events with user ID
- [ ] Auto-delete export files after 7 days
- [ ] Add warning: "Exported data contains PII"
```

### Step 5: Share with Your Team

The PRD is saved as markdown and ready to share:

```bash
# View the file
cat outputs/prds/analytics-export-to-csv.md

# Or open in your editor
code outputs/prds/analytics-export-to-csv.md

# Or commit to git
git add outputs/prds/analytics-export-to-csv.md
git commit -m "Add PRD for CSV export feature"
git push
```

🎉 **Congratulations!** You've created your first PRD with PM Kit.

---

## Daily Workflow

### Morning Routine

**1. Check what needs doing** (2 min)
```bash
cd ~/Projects/my-product
claude

# In Claude:
/daily
```

Gets your daily PM workflow checklist.

**2. Prioritize your backlog** (5 min)
```
/prioritize

# Claude will ask:
What features are in your backlog?

# List them:
1. CSV export
2. Dashboard redesign
3. Mobile app
4. API rate limiting
5. Dark mode
```

Claude applies multiple prioritization frameworks (RICE, MoSCoW, Value vs. Effort) and gives recommendations.

### During the Day

**Research a feature**:
```
/research

Topic: Best practices for CSV export in web applications
```

**Make a decision**:
```
/decide

Decision: Should we build mobile app in-house or outsource?
```

**Create comparison matrix**:
```
/matrix

Compare: Stripe vs. Braintree vs. PayPal for payment processing
```

### End of Day

**Review progress**:
```bash
# Check what you created today
ls -lt outputs/prds/
ls -lt outputs/research-reports/
ls -lt outputs/decision-matrices/
```

**Commit your work**:
```bash
git add outputs/
git commit -m "PM work for $(date +%Y-%m-%d)"
git push
```

---

## Common Workflows

### 1. User Research Synthesis

You've conducted 10 user interviews. Now synthesize:

```
/synthesize

# Claude asks:
What research data do you want to synthesize?

# You respond:
I have notes from 10 user interviews about our dashboard. Here are the key quotes:
[paste your interview notes]

# Claude extracts:
- Top 3 pain points
- Top 5 feature requests
- Common workflows
- User personas
- Recommendations

# Saved to: outputs/research-reports/dashboard-user-interviews.md
```

### 2. Stakeholder Consensus Building

You need alignment from engineering, design, and sales:

```
/consensus

# Claude guides you through:
1. Who are the stakeholders?
2. What's the decision?
3. What are their concerns?
4. What are the trade-offs?

# Generates:
- Stakeholder map
- Concern summary
- Proposed solution
- Communication plan

# Saved to: outputs/consensus-reports/mobile-app-decision.md
```

### 3. Problem Decomposition

You have a complex problem:

```
/decompose

Problem: Our signup conversion rate dropped from 45% to 30%

# Claude creates:
- Problem tree diagram
- Root cause analysis
- Sub-problems identified
- Investigation plan
- Success metrics
```

### 4. Strategic Planning

Quarterly planning time:

```
/strategy

# Claude helps create:
- Vision statement
- Quarterly themes
- OKRs
- Roadmap
- Risk assessment

# Saved to: outputs/strategy/q2-2024-strategic-plan.md
```

---

## Troubleshooting

### "Command not found: pm-kit"

**Problem**: CLI not in your PATH

**Fix**:
```bash
# Find where npm installs global packages
npm config get prefix
# Returns something like: /usr/local

# Add to your PATH (add to ~/.zshrc or ~/.bashrc)
export PATH="$PATH:$(npm config get prefix)/bin"

# Reload shell
source ~/.zshrc  # or source ~/.bashrc
```

### "GitHub authentication failed"

**Problem**: Invalid or expired token

**Fix**:
```bash
# Reset your token
pm-kit init --reset-token

# Or set environment variable
export GITHUB_TOKEN=ghp_your_new_token_here
pm-kit init
```

### "Permission denied"

**Problem**: Can't install globally

**Fix**:
```bash
# Option 1: Use pnpm (recommended)
pnpm install -g pm-kit-cli

# Option 2: Fix npm permissions
# See: https://docs.npmjs.com/resolving-eacces-permissions-errors

# Option 3: Use sudo (not recommended)
sudo npm install -g pm-kit-cli
```

### "API key invalid"

**Problem**: Wrong key or expired

**Fix**:
```bash
# Update your API key
pm-kit config set geminiApiKey YOUR_NEW_KEY

# Verify
pm-kit doctor
```

### "Claude CLI not found"

**Warning**: Not critical, but recommended

**Fix**:
```bash
# Install Claude CLI from:
# https://claude.ai/code

# Or continue without it
# (You can manually copy workflows from .claude/ directory)
```

### Still having issues?

```bash
# Run diagnostics
pm-kit doctor

# Auto-fix common issues
pm-kit doctor --fix

# Get help
pm-kit --help
pm-kit init --help

# Report a bug
# https://github.com/your-org/pm-kit-cli/issues
```

---

## Next Steps

### Learn More

**Technical Literacy** (for non-technical PMs):
```
# In Claude:
/learn-json       # Understand JSON basics
/learn-api        # Learn about APIs
/test-api         # Test API endpoints
/visualize        # Create ASCII diagrams
/debug            # Debug without code
```

**Explore All Commands**:
```bash
# See all available commands
pm-kit --help

# See all Claude slash commands
# In Claude:
/help
```

**Read Documentation**:
- `COMMANDS.md` - Full CLI reference
- `CLAUDE.md` - All workflows explained
- `INSTALLATION.md` - Advanced installation

### Customize Your Setup

**Add custom workflows**:
```bash
# Create custom workflow
cat > .claude/workflows/my-custom-workflow.md << 'EOF'
# My Custom Workflow

[Your workflow instructions]
EOF

# Use it in Claude:
# /my-custom-workflow
```

**Exclude files from updates**:
```bash
# Preserve custom files during updates
pm-kit update --exclude ".claude/workflows/custom-*"
```

### Join the Community

- **GitHub Discussions**: Ask questions, share tips
- **Report Issues**: Found a bug? Let us know
- **Contribute**: See CONTRIBUTING.md

### Keep Your Kit Updated

```bash
# Check for updates
pm-kit update --dry-run

# Apply updates
pm-kit update

# With backup
pm-kit update --backup
```

---

## Quick Reference Card

```bash
# Installation
npm install -g pm-kit-cli

# Setup
cd your-project
pm-kit init

# Check health
pm-kit doctor

# Update
pm-kit update

# Configure
pm-kit config list
pm-kit config set key value

# Use in Claude
claude
/prd          # Create PRD
/research     # Research synthesis
/prioritize   # Prioritize features
/decide       # Make decisions
/help         # See all commands
```

---

## Success Metrics

After using PM Kit for a week, you should:

- ✅ Create PRDs 3x faster
- ✅ Make evidence-based decisions
- ✅ Build technical literacy
- ✅ Communicate clearly with engineers
- ✅ Maintain consistent documentation

---

## Getting Help

**Documentation**:
- This guide: `GETTING_STARTED.md`
- Installation: `INSTALLATION.md`
- Commands: `COMMANDS.md`
- Contributing: `CONTRIBUTING.md`

**Community**:
- GitHub Issues: Bug reports
- GitHub Discussions: Questions
- Discord: Real-time chat (if available)

**Emergency**:
```bash
pm-kit doctor --fix    # Auto-fix issues
pm-kit config reset    # Reset everything
pm-kit init --force    # Reinstall
```

---

Welcome to ClaudeKit PM! 🎉

Now go build amazing products with AI-assisted PM workflows.
