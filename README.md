# Claude Kit PM - Product Manager Toolkit

> A CLI installer and workflow toolkit that brings Product Manager superpowers to Claude CLI

## What is Claude Kit PM?

Claude Kit PM is a specialized toolkit that integrates with the Claude CLI to provide Product Managers with powerful AI-assisted workflows for:

- **PRD Drafting** - Generate comprehensive Product Requirements Documents
- **Competitive Research** - Conduct deep market and competitor analysis
- **User Stories** - Create detailed user stories and acceptance criteria
- **Market Analysis** - Analyze market trends and opportunities
- **Documentation** - Maintain consistent, high-quality PM documentation

## Quick Start

```bash
# 1. Install the CLI
npm install -g pm-kit-cli

# 2. Initialize in your project
cd your-project
pm-kit init

# 3. Start using Claude with PM commands
claude
# Then use: /draft, /research, /stories, etc.
```

## Features

### 🚀 One-Command Installation
- No manual file copying
- Automated setup and configuration
- Secure credential management

### 🔄 Easy Updates
- Update kit files with a single command
- Preserves your customizations
- Version tracking and changelogs

### 🛠️ Powerful PM Commands
- `/draft` - Create Product Requirements Documents
- `/research` - Conduct competitive analysis
- `/stories` - Generate user stories
- `/acceptance-criteria` - Define acceptance criteria
- `/market` - Perform market analysis

### 🔍 Built-in Diagnostics
- Health checks for your installation
- API configuration validation
- Troubleshooting guidance

### 🔒 Secure by Default
- Encrypted credential storage
- Automatic .gitignore configuration
- No API keys in version control

## Documentation

- **[User Workflow](./USER_WORKFLOW.md)** - Complete guide for end users
- **[Architecture](./ARCHITECTURE.md)** - Technical implementation details
- **[Contributing](./CONTRIBUTING.md)** - Development guidelines (coming soon)

## Requirements

- Node.js v16 or higher
- Claude CLI installed (from https://claude.ai/code)
- GitHub Personal Access Token (for kit file access)
- Brave Search API Key (for research features)

## Commands

| Command | Description |
|---------|-------------|
| `pm-kit init` | Initialize kit in current directory |
| `pm-kit update` | Update kit files to latest version |
| `pm-kit doctor` | Run system diagnostics |
| `pm-kit --version` | Show CLI version |
| `pm-kit --help` | Display help information |

## Project Structure

After initialization, your project will contain:

```
your-project/
├── .claude/              # Claude CLI configuration
│   ├── commands/         # Slash command definitions
│   ├── prompts/          # Agent persona and prompts
│   └── skills/           # Specialized skills
├── docs/                 # Generated documentation
│   ├── prd/             # Product Requirements Docs
│   ├── research/        # Research reports
│   └── user-stories/    # User stories
├── CLAUDE.md            # Main routing configuration
└── .mcp.json           # MCP server & API configuration
```

## Example Workflows

### Create a Product Requirements Document

```bash
claude
# In Claude prompt:
/draft "AI-Powered Search Feature"
```

Output: `docs/prd/ai-powered-search-feature.md`

### Conduct Competitive Research

```bash
claude
/research "AI search competitors: Perplexity, You.com, Phind"
```

Output: `docs/research/ai-search-competitors.md`

### Generate User Stories

```bash
claude
/stories "As a user, I want to save search history"
```

Output: `docs/user-stories/search-history-feature.md`

## Support & Community

- **Issues:** [GitHub Issues](https://github.com/your-org/pm-kit-cli/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-org/pm-kit-cli/discussions)
- **Documentation:** [Full Docs](https://docs.pm-kit.dev)

## License

MIT License - see [LICENSE](./LICENSE) for details

## Roadmap

- [ ] Cloud sync for team collaboration
- [ ] Template marketplace
- [ ] Jira/Linear integration
- [ ] Multi-language support
- [ ] Custom command builder
- [ ] Analytics dashboard

---

**Made with ❤️ for Product Managers using Claude**
