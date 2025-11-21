# Claude Kit PM - User Workflow

## Overview

Claude Kit PM is a Product Manager toolkit distributed as a CLI installer that integrates with the Claude CLI. It provides project management capabilities including PRD drafting, user story creation, and competitive research.

---

## Installation & Setup

### Prerequisites

- Node.js installed (v16+)
- GitHub Personal Access Token with repo access
- Brave Search API Key (or other search service API key)
- Claude CLI installed (from https://claude.ai/code)

---

## Step-by-Step User Flow

### 1. Install the Global CLI

Users install the `pm-kit-cli` package globally via their preferred package manager:

```bash
# npm
npm install -g pm-kit-cli

# bun
bun add -g pm-kit-cli

# yarn
yarn global add pm-kit-cli

# pnpm
pnpm add -g pm-kit-cli
```

**Verify installation:**

```bash
pm-kit --version
```

---

### 2. Initialize a New PM Project

Navigate to your project root directory and run:

```bash
pm-kit init
```

#### What Happens During Init:

1. **GitHub Token Prompt:**
   - If `GITHUB_TOKEN` environment variable exists: uses it automatically
   - If not: prompts user interactively
     ```
     Enter your GitHub personal access token:
     (Create one at https://github.com/settings/tokens)

     Save this token for future use? (y/n):
     ```

2. **Clone Kit Files:**
   - Downloads from the private kit repository:
     - `.claude/` directory (agent prompts, skills, commands)
     - `CLAUDE.md` (routing configuration)
     - Template files
     - Example docs

3. **API Key Configuration:**
   - Prompts for Brave Search API Key
   - Optionally prompts for additional API keys:
     - Perplexity API Key
     - Gemini API Key
     - Other future integrations
   - Saves credentials to `.mcp.json`

4. **Success Message:**
   ```
   ✔️  Installed Product Manager Kit to: /path/to/your/project
   ✔️  Configured API access in .mcp.json
   ✔️  Ready to use!

   Next steps:
   1. Open your project
   2. Run `claude` CLI
   3. Use slash commands: /draft, /research, /stories, etc.
   ```

---

### 3. Daily Workflow

#### Start Claude CLI

In your project directory (where `.claude/` was installed):

```bash
claude
```

#### Use Slash Commands

The kit provides specialized slash commands for PM tasks:

```bash
# Draft a Product Requirements Document
/draft "New Feature Name"

# Research competitors or market
/research "Competitor Analysis Topic"

# Generate user stories
/stories "Feature Description"

# Create acceptance criteria
/acceptance-criteria "User Story"

# Market analysis
/market "Product Category"
```

#### Output Locations

All generated artifacts are saved to your local project:

```
your-project/
├── docs/
│   ├── prd/
│   │   └── new-feature.md
│   ├── research/
│   │   └── competitor-analysis.md
│   └── user-stories/
│       └── feature-stories.md
├── .claude/
│   ├── commands/
│   ├── prompts/
│   └── skills/
├── .mcp.json
└── CLAUDE.md
```

---

### 4. Update the Kit

When new features, fixes, or templates are released:

```bash
pm-kit update
```

#### Update Behavior:

1. **Pulls Latest Changes:**
   - Uses existing GitHub token (or prompts if missing)
   - Downloads updated files from central repository

2. **Preserves Custom Files:**
   - Default excludes: user's custom prompts, company-specific configs
   - Optional explicit exclusions:
     ```bash
     pm-kit update --exclude company/*
     pm-kit update --exclude .claude/custom-prompts/*
     ```

3. **Success Message:**
   ```
   ✔️  Product Manager Kit core files updated
   ✔️  Your custom files were preserved
   ✔️  Version: 1.2.0 → 1.3.0

   What's new:
   - Added /roadmap command
   - Improved /draft template
   - Bug fixes in research tool

   Run `claude` to access new features.
   ```

---

### 5. Troubleshooting & Diagnostics

Run system diagnostics to verify installation:

```bash
pm-kit doctor
```

#### Diagnostic Checks:

1. **File Structure:**
   - ✔️ `CLAUDE.md` found
   - ✔️ `.claude/` directory present
   - ✔️ `.mcp.json` exists

2. **API Configuration:**
   - ✔️ Brave Search Key configured and valid
   - ⚠️ Perplexity Key not configured (optional)
   - ✔️ GitHub Token valid

3. **Claude CLI:**
   - ✔️ Claude CLI installed and accessible
   - ⚠️ Claude CLI not detected. Install from https://claude.ai/code

4. **Permissions:**
   - ✔️ Write permissions for docs/ directory
   - ✔️ Read permissions for .claude/ directory

#### Example Output:

```
Running diagnostics...

✔️  CLAUDE.md found
✔️  .claude/ directory present (12 commands, 5 skills)
✔️  .mcp.json: Brave Search Key OK
✔️  GitHub Token: Valid (expires in 45 days)
⚠️  Claude CLI not detected in PATH
    Install from: https://claude.ai/code

1 warning found. Your kit is mostly functional.
```

---

## Command Reference

### Core Commands

| Command | Description |
|---------|-------------|
| `pm-kit --version` | Show CLI version |
| `pm-kit init` | Initialize kit in current directory |
| `pm-kit update` | Update kit files to latest version |
| `pm-kit doctor` | Run diagnostics |
| `pm-kit help` | Show help information |

### Update Options

| Option | Description |
|--------|-------------|
| `--exclude <pattern>` | Exclude files matching pattern from update |
| `--force` | Force update even if local changes detected |
| `--dry-run` | Show what would be updated without making changes |

---

## Configuration Files

### .mcp.json

Stores API credentials and MCP server configuration:

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "your-brave-api-key-here"
      }
    }
  }
}
```

### CLAUDE.md

Main routing configuration for Claude CLI. Defines how slash commands map to agent prompts and skills.

---

## Best Practices

### 1. Token Security

- Never commit `.mcp.json` to version control
- Add to `.gitignore`:
  ```
  .mcp.json
  .env
  ```

### 2. Regular Updates

- Check for updates weekly: `pm-kit update`
- Review changelogs before updating production workflows

### 3. Custom Configurations

- Store custom prompts in `.claude/custom-prompts/`
- Use `--exclude` flag during updates to preserve customizations

### 4. Team Sharing

For teams using the kit:
- Share installation instructions
- Standardize on API key management (e.g., team vault)
- Version control `CLAUDE.md` modifications
- Document custom slash commands

---

## Workflow Examples

### Example 1: Draft New Feature PRD

```bash
# Initialize project (first time)
cd my-product
pm-kit init

# Start Claude CLI
claude

# In Claude prompt:
/draft "AI-Powered Search Feature"

# Output: docs/prd/ai-powered-search-feature.md
```

### Example 2: Competitive Research

```bash
claude

# In Claude prompt:
/research "AI search competitors: Perplexity, You.com, Phind"

# Output: docs/research/ai-search-competitors.md
```

### Example 3: Generate User Stories

```bash
claude

# In Claude prompt:
/stories "As a user, I want to save my search history so I can refer back to previous queries"

# Output: docs/user-stories/search-history-feature.md
```

---

## Troubleshooting Common Issues

### Issue: "GitHub token invalid"

**Solution:**
```bash
# Regenerate token at github.com/settings/tokens
# Re-run init with new token
pm-kit init --reset-token
```

### Issue: "API key not configured"

**Solution:**
```bash
# Edit .mcp.json manually or re-run init
pm-kit init --reconfigure-api
```

### Issue: "Claude CLI not found"

**Solution:**
1. Install Claude CLI from https://claude.ai/code
2. Verify installation: `claude --version`
3. Ensure it's in your PATH

### Issue: "Permission denied writing to docs/"

**Solution:**
```bash
# Fix directory permissions
chmod -R u+w docs/
```

---

## Future Enhancements

Planned features for future releases:

- [ ] Cloud sync for team collaboration
- [ ] Template marketplace
- [ ] Integration with Jira/Linear
- [ ] Automated PRD review and scoring
- [ ] Multi-language support
- [ ] Custom command builder
- [ ] Analytics dashboard

---

## Support & Resources

- **Documentation:** [Link to docs site]
- **GitHub Issues:** [Link to issue tracker]
- **Community:** [Link to Discord/Slack]
- **Updates:** `pm-kit update` or check release notes

---

## Version History

Track your kit version:

```bash
pm-kit --version

# Example output:
# pm-kit version 1.2.0
# Last updated: 2024-01-15
```

---

**Your workflow is simple:**

1. `npm install -g pm-kit-cli`
2. `pm-kit init`
3. `claude` → use slash commands
4. `pm-kit update` when needed
5. `pm-kit doctor` if issues arise

**No manual file copying. No complex setup. Just install, init, and create.**
