# ClaudeKit PM - Product Management Framework

A comprehensive, AI-enhanced product management system implementing Long Chain-of-Thought methodology for systematic problem-solving, strategic planning, and product development.

[![npm version](https://img.shields.io/npm/v/pm-kit-cli.svg)](https://www.npmjs.com/package/pm-kit-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Quick Start

```bash
# Install the CLI globally
npm install -g pm-kit-cli

# Initialize in your project
cd your-project
pm-kit init

# Start using PM workflows in Claude
claude
/prd  # Create your first PRD
```

**That's it!** No API keys required - just press Enter to skip during setup.

## What's New in v0.2.0

- **New Commands**: `pm-kit versions` and `pm-kit uninstall`
- **Progress Indicators**: Visual progress bar during downloads
- **Simplified Setup**: All API keys are now optional
- **Installation Modes**: `--global`, `--fresh`, `--no-animation` flags
- **Smart Updates**: `--backup`, `--dry-run`, `--exclude` options
- **Retry Logic**: Automatic retry with exponential backoff
- **ASCII Logo**: Beautiful animated logo on startup

## CLI Commands

| Command | Description |
|---------|-------------|
| `pm-kit init` | Initialize PM Kit in your project |
| `pm-kit update` | Update framework files to latest version |
| `pm-kit doctor` | Run diagnostics and health checks |
| `pm-kit config` | Manage configuration and API keys |
| `pm-kit versions` | List available versions |
| `pm-kit uninstall` | Remove PM Kit from project |

### Installation Options

```bash
# Standard installation (in current directory)
pm-kit init

# Global installation (to ~/.claude)
pm-kit init --global

# Fresh install (removes existing files first)
pm-kit init --fresh

# Skip animation
pm-kit init --no-animation

# Force reinstall without prompts
pm-kit init --force
```

### Update Options

```bash
# Update to latest version
pm-kit update

# Preview changes without applying
pm-kit update --dry-run

# Create backup before updating
pm-kit update --backup

# Update to specific version
pm-kit update --version v0.1.0

# Exclude files from update
pm-kit update --exclude "custom-*.md"
```

## Documentation

| Guide | Description |
|-------|-------------|
| [Getting Started](./docs/guides/GETTING_STARTED.md) | Complete setup guide (15 min) |
| [Installation Guide](./docs/guides/INSTALLATION.md) | Detailed installation instructions |
| [Commands Reference](./docs/reference/COMMANDS.md) | All CLI commands explained |
| [Architecture](./docs/reference/ARCHITECTURE.md) | Technical architecture details |
| [Release Management](./docs/operations/RELEASE_MANAGEMENT.md) | Versioning and release process |
| [Changelog](./docs/operations/CHANGELOG.md) | Version history |

## PM Workflows & Slash Commands

After installation, these commands are available in Claude CLI:

### Core Commands

| Command | Description | Use Case |
|---------|-------------|----------|
| `/prd` | Generate comprehensive PRD | New feature requirements |
| `/decompose` | Problem decomposition | Root cause analysis |
| `/prioritize` | Feature prioritization | Backlog ranking |
| `/research` | Multi-source research | Market analysis |
| `/strategy` | Strategic planning | OKR development |
| `/decide` | Quick decision framework | Fast decisions |

### Research & Analysis

| Command | Description |
|---------|-------------|
| `/synthesize` | Synthesize research data |
| `/consensus` | Build stakeholder consensus |
| `/matrix` | Generate comparison matrices |
| `/evidence` | Evidence quality assessment |

### Technical Understanding

| Command | Description |
|---------|-------------|
| `/architecture` | PM-friendly architecture docs |
| `/explain-code` | Translate code to plain English |
| `/tech-impact` | Technical feasibility assessment |

### Rapid Prototyping

| Command | Description |
|---------|-------------|
| `/mockup` | ASCII wireframes |
| `/flow` | User flow diagrams (Mermaid) |
| `/design-spec` | Design handoff specs |

## Project Structure

After initialization, your project will have:

```
your-project/
├── CLAUDE.md                    # Main routing file for Claude
├── .mcp.json                    # MCP server configuration
├── .claude/
│   ├── workflows/               # 18 PM workflow files
│   ├── agents/                  # 10 specialized agents
│   ├── commands/                # 16 slash commands
│   ├── templates/               # Reusable templates
│   └── skills/                  # Technical literacy modules
├── outputs/
│   ├── research-reports/        # Research synthesis
│   ├── consensus-reports/       # Stakeholder alignment
│   ├── decision-matrices/       # Decision frameworks
│   └── evidence-logs/           # Evidence assessments
└── prds/
    ├── active/                  # Current PRDs
    └── archive/                 # Completed PRDs
```

## Key Features

### Long Chain-of-Thought Methodology
- 15+ systematic steps with validation checkpoints
- Multi-phase verification and backtracking capabilities
- Error correction mechanisms
- Cross-validation between components

### Multi-Agent Orchestration
- **Problem Decomposer** - Root cause analysis
- **PRD Writer** - Comprehensive requirements docs
- **Research Synthesizer** - Multi-source research
- **Consensus Builder** - Stakeholder alignment
- **Prioritization Engine** - Framework-based prioritization
- **Matrix Generator** - Decision matrices
- **Analytics Synthesizer** - Data insights
- **Technical Translator** - Code to PM-friendly explanations
- **Rapid Prototyper** - ASCII wireframes, Mermaid diagrams

### Prioritization Frameworks
- RICE (Reach × Impact × Confidence / Effort)
- ICE (Impact × Confidence × Ease)
- Kano Model
- MoSCoW Method
- Value vs. Effort Matrix

## Example Usage

```bash
# Start Claude in your project
claude

# Create a PRD for a new feature
/prd User authentication system

# Analyze a problem
/decompose Users are abandoning checkout

# Prioritize your backlog
/prioritize Q1 feature backlog

# Research a topic
/research AI chatbot market trends 2025

# Make a quick decision
/decide Build vs buy payment processing
```

## Configuration

### API Keys (Optional)

All API keys are optional. Configure them anytime:

```bash
# Add Gemini API key for multi-modal analysis
pm-kit config set geminiApiKey YOUR_KEY

# View current configuration
pm-kit config list
```

### Environment Variables

```bash
# GitHub authentication
export GITHUB_TOKEN=ghp_your_token

# Optional API key
export GEMINI_API_KEY=your_key

# Custom repository (for forks)
export PM_KIT_REPO=your-org/your-repo
```

## Troubleshooting

```bash
# Run diagnostics
pm-kit doctor

# Check installation status
pm-kit doctor --verbose

# Auto-fix common issues
pm-kit doctor --fix
```

### Common Issues

| Issue | Solution |
|-------|----------|
| "GitHub auth failed" | `pm-kit init --reset-token` |
| "Command not found" | Check npm global path |
| "Permission denied" | Use `pnpm` or fix npm permissions |

## Contributing

See [CONTRIBUTING.md](./docs/development/CONTRIBUTING.md) for development setup and guidelines.

```bash
# Clone the repository
git clone https://github.com/vanlumberworks/claude-kit-pm.git
cd claude-kit-pm

# Install dependencies
pnpm install

# Run tests
pnpm test

# Run linter
pnpm lint
```

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| [0.2.0](https://github.com/vanlumberworks/claude-kit-pm/releases/tag/v0.2.0) | 2025-01-22 | New commands, progress indicators, simplified setup |
| [0.1.0](https://github.com/vanlumberworks/claude-kit-pm/releases/tag/v0.1.0) | 2024-01-20 | Initial release |

See [CHANGELOG.md](./docs/operations/CHANGELOG.md) for full details.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/vanlumberworks/claude-kit-pm/issues)
- **Discussions**: [GitHub Discussions](https://github.com/vanlumberworks/claude-kit-pm/discussions)

---

**Built for Product Managers** | Powered by [Claude](https://claude.ai)
