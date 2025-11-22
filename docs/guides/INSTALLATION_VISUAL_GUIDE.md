# Visual Installation Guide

A step-by-step visual guide to installing ClaudeKit PM CLI.

## Installation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    INSTALLATION FLOW                        │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Start      │
└──────┬───────┘
       │
       ↓
┌──────────────────────┐
│ Check Prerequisites  │
│ • Node.js 16+        │
│ • npm/pnpm           │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│ Install CLI          │
│ npm install -g       │
│ pm-kit-cli           │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│ Get GitHub Token     │
│ github.com/settings/ │
│ tokens               │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│ Get API Keys         │
│ • Brave (required)   │
│ • Perplexity (opt)   │
│ • Gemini (optional)  │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│ Navigate to Project  │
│ cd your-project      │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│ Initialize PM Kit    │
│ pm-kit init          │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│ Follow Prompts       │
│ • Enter GitHub token │
│ • Enter API keys     │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│ Verify Installation  │
│ pm-kit doctor        │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│ Start Using          │
│ claude               │
│ /prd                 │
└──────┬───────────────┘
       │
       ↓
┌──────────────┐
│   Success!   │
└──────────────┘
```

## Step 1: Check Prerequisites

```
╔════════════════════════════════════════╗
║         Check Prerequisites            ║
╚════════════════════════════════════════╝

Terminal:
┌─────────────────────────────────────┐
│ $ node --version                    │
│ v20.10.0 ✓                          │
│                                     │
│ $ npm --version                     │
│ 10.2.3 ✓                            │
└─────────────────────────────────────┘

✅ Node.js 16+ installed
✅ npm available
✅ Ready to proceed
```

## Step 2: Install CLI

```
╔════════════════════════════════════════╗
║           Install PM Kit CLI           ║
╚════════════════════════════════════════╝

Terminal:
┌─────────────────────────────────────┐
│ $ npm install -g pm-kit-cli         │
│                                     │
│ ⠸ Installing...                     │
│                                     │
│ added 25 packages in 8s             │
│                                     │
│ ✓ pm-kit-cli@0.1.0                  │
└─────────────────────────────────────┘

Verify:
┌─────────────────────────────────────┐
│ $ pm-kit --version                  │
│ 0.1.0 ✓                             │
│                                     │
│ $ pm-kit --help                     │
│ Usage: pm-kit <command> [options]  │
│ ...                                 │
└─────────────────────────────────────┘

✅ CLI installed successfully
```

## Step 3: Get GitHub Token

```
╔════════════════════════════════════════╗
║          Get GitHub Token              ║
╚════════════════════════════════════════╝

Browser:
┌─────────────────────────────────────────────┐
│ GitHub Settings                             │
│ https://github.com/settings/tokens         │
├─────────────────────────────────────────────┤
│                                             │
│  Personal access tokens (classic)          │
│                                             │
│  [ Generate new token ▼ ]                  │
│                                             │
│  Note: PM Kit CLI                           │
│  Expiration: No expiration                  │
│                                             │
│  Select scopes:                             │
│  ☑ repo                                     │
│    Full control of private repositories    │
│                                             │
│  [ Generate token ]                         │
│                                             │
└─────────────────────────────────────────────┘

After clicking "Generate token":
┌─────────────────────────────────────────────┐
│ ⚠️  Make sure to copy your personal access  │
│    token now. You won't be able to see it  │
│    again!                                   │
│                                             │
│ ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    │
│ [ Copy to clipboard ]                       │
└─────────────────────────────────────────────┘

✅ Token copied: ghp_xxxx...xxxx
```

## Step 4: Get API Keys

### Gemini API (Optional)

```
╔════════════════════════════════════════╗
║      Get Gemini API Key (Optional)     ║
╚════════════════════════════════════════╝

Browser:
┌─────────────────────────────────────────────┐
│ Google AI Studio                            │
│ https://ai.google.dev/                      │
├─────────────────────────────────────────────┤
│                                             │
│  [ Get API Key ]                            │
│                                             │
│  Sign in with Google account                │
│  [ Create API Key ]                         │
│                                             │
└─────────────────────────────────────────────┘

After signup:
┌─────────────────────────────────────────────┐
│ Your API Key:                               │
│ AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx        │
│ [ Copy ]                                    │
└─────────────────────────────────────────────┘

✅ API key copied (or skip - configure later)
```

> Note: All API keys are optional. You can skip and configure later with `pm-kit config`.

## Step 5: Initialize PM Kit

```
╔════════════════════════════════════════╗
║         Initialize PM Kit              ║
╚════════════════════════════════════════╝

Terminal:
┌─────────────────────────────────────┐
│ $ cd ~/Projects/my-product          │
│ $ pm-kit init                       │
│                                     │
│ ┌────────────────────────────────┐ │
│ │   ClaudeKit PM Installer       │ │
│ │   Version 0.1.0                │ │
│ └────────────────────────────────┘ │
│                                     │
│ ✓ Pre-flight checks passed          │
│                                     │
│ ? GitHub Personal Access Token:    │
│ ●●●●●●●●●●●●●●●●●●●●                │
│                                     │
│ ✓ GitHub authenticated              │
│                                     │
│ ⠸ Downloading framework files...    │
│ ✓ Downloaded CLAUDE.md              │
│ ✓ Downloaded .claude/ (32 files)    │
│                                     │
│ ? Gemini API Key (optional):       │
│ [Enter to skip]                     │
│                                     │
│ ✓ Created .mcp.json                 │
│ ✓ Created output directories        │
│ ✓ Updated .gitignore                │
│                                     │
│ ┌────────────────────────────────┐ │
│ │  ✓ Installation Complete!      │ │
│ │                                │ │
│ │  Next steps:                   │ │
│ │  1. Run: claude                │ │
│ │  2. Use: /prd, /research       │ │
│ └────────────────────────────────┘ │
└─────────────────────────────────────┘

✅ Installation complete!
```

## Step 6: Verify Installation

```
╔════════════════════════════════════════╗
║        Verify Installation             ║
╚════════════════════════════════════════╝

Terminal:
┌─────────────────────────────────────┐
│ $ pm-kit doctor                     │
│                                     │
│ File Structure                      │
│ ✓ CLAUDE.md: Present                │
│ ✓ .claude/ directory: Present       │
│ ✓ .mcp.json: Present                │
│ ✓ Workflows: 14/14 files            │
│ ✓ Agents: 8/8 files                 │
│ ✓ Commands: 10/10 files             │
│ ✓ Skills: 5/5 files                 │
│                                     │
│ API Configuration                   │
│ ✓ MCP Configuration: Valid          │
│ ℹ gemini: Not configured (optional) │
│                                     │
│ Claude CLI                          │
│ ✓ Claude CLI: Installed (v1.2.0)    │
│                                     │
│ Permissions                         │
│ ✓ .claude/ directory: RW            │
│ ✓ outputs/ directory: RW            │
│                                     │
│ Connectivity                        │
│ ✓ GitHub API: Reachable             │
│                                     │
│ Summary                             │
│ ✓ All checks passed! ✨             │
└─────────────────────────────────────┘

✅ Everything working perfectly!
```

## Step 7: Create Your First PRD

```
╔════════════════════════════════════════╗
║         Create First PRD               ║
╚════════════════════════════════════════╝

Terminal:
┌─────────────────────────────────────┐
│ $ claude                            │
│                                     │
│ Claude Code is starting...          │
│ Loading PM Kit configuration...     │
│ ✓ Ready                              │
│                                     │
│ >                                   │
└─────────────────────────────────────┘

In Claude:
┌─────────────────────────────────────┐
│ > /prd                              │
│                                     │
│ I'll help you create a              │
│ comprehensive PRD.                  │
│                                     │
│ 1. What product/feature are you     │
│    building?                        │
│                                     │
│ > Export analytics to CSV           │
│                                     │
│ 2. Who is this for?                 │
│                                     │
│ > Data analysts who need custom     │
│   reports in Excel                  │
│                                     │
│ ... (continues with questions)      │
│                                     │
│ ✓ PRD generated and saved to        │
│   outputs/prds/export-csv.md        │
└─────────────────────────────────────┘

✅ First PRD created!
```

## File Structure After Installation

```
your-project/
├── CLAUDE.md ........................ Main routing file
├── .mcp.json ....................... MCP server config
├── .gitignore ...................... Updated
│
├── .claude/
│   ├── workflows/ .................. 14 PM workflows
│   ├── agents/ ..................... 8 specialized agents
│   ├── commands/ ................... 10 slash commands
│   └── skills/ ..................... 5 technical modules
│
└── outputs/
    ├── prds/ ....................... Your PRDs here
    ├── research-reports/ ........... Research synthesis
    ├── consensus-reports/ .......... Stakeholder alignment
    ├── decision-matrices/ .......... Comparison matrices
    └── evidence-logs/ .............. Evidence assessments
```

## Troubleshooting Visual Guide

### Problem: "Command not found: pm-kit"

```
Terminal shows:
┌─────────────────────────────────────┐
│ $ pm-kit --version                  │
│ zsh: command not found: pm-kit      │
└─────────────────────────────────────┘

Solution:
┌─────────────────────────────────────┐
│ $ export PATH="$PATH:$(npm config  │
│   get prefix)/bin"                  │
│                                     │
│ $ source ~/.zshrc                   │
│                                     │
│ $ pm-kit --version                  │
│ 0.1.0 ✓                             │
└─────────────────────────────────────┘

✅ Fixed!
```

### Problem: "GitHub authentication failed"

```
Terminal shows:
┌─────────────────────────────────────┐
│ ✗ GitHub authentication failed      │
│   Invalid or expired token          │
└─────────────────────────────────────┘

Solution:
┌─────────────────────────────────────┐
│ $ pm-kit init --reset-token         │
│                                     │
│ ? GitHub Personal Access Token:    │
│ [paste new token]                   │
│                                     │
│ ✓ GitHub authenticated              │
└─────────────────────────────────────┘

✅ Fixed!
```

## Success Indicators

After successful installation, you should see:

```
✓ pm-kit --version works
✓ pm-kit doctor shows all green
✓ claude command loads PM Kit
✓ /prd command is available
✓ Files created in .claude/
✓ .mcp.json exists
✓ outputs/ directories created
```

## Next Steps

```
┌─────────────────────────────────────────────┐
│         You're Ready! What's Next?          │
├─────────────────────────────────────────────┤
│                                             │
│  1️⃣  Read GETTING_STARTED.md              │
│     Complete walkthrough with examples     │
│                                             │
│  2️⃣  Try workflows:                        │
│     /prd     → Create PRD                  │
│     /research → Research synthesis         │
│     /decide   → Make decision              │
│                                             │
│  3️⃣  Explore slash commands:               │
│     /help    → See all commands            │
│                                             │
│  4️⃣  Customize your setup:                 │
│     Edit .claude/workflows/                │
│                                             │
│  5️⃣  Join community:                       │
│     GitHub Discussions                     │
│                                             │
└─────────────────────────────────────────────┘
```

---

**Questions?** See [GETTING_STARTED.md](GETTING_STARTED.md) for detailed guide.
