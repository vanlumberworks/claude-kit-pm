# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

This is the **pm-kit-cli** repository - the CLI installer for ClaudeKit PM framework. This repo contains ONLY the CLI tool code that downloads and installs framework files from a separate repository.

**Important**: Framework content (workflows, agents, commands, prompts, skills) is maintained in a separate framework repository. Do NOT add framework content to this repo.

## Repository Architecture

```
claude-kit-pm/                    # CLI INSTALLER REPO (this repo)
├── bin/
│   └── pm-kit.js                # CLI entry point
├── lib/
│   ├── commands/                # CLI commands (init, update, doctor, etc.)
│   ├── services/                # GitHub, MCP, credential services
│   └── utils/                   # Logger, prompts, file-manager, validator
├── tests/                       # Jest test suite
├── docs/                        # CLI documentation
├── package.json                 # npm package definition
└── CLAUDE.md                    # This file

claudekit-pm-framework/          # FRAMEWORK REPO (separate repository)
├── .claude/
│   ├── workflows/               # PM workflow implementations
│   ├── agents/                  # Specialized agent definitions
│   ├── commands/                # Slash commands
│   ├── templates/               # Reusable templates
│   └── skills/                  # Technical literacy modules
├── CLAUDE.md                    # Framework routing file
└── version.json                 # Framework version tracking
```

## Development Commands

```bash
# Package Management (use pnpm)
pnpm install              # Install dependencies
pnpm test                 # Run tests with Jest
pnpm test:watch           # Run tests in watch mode
pnpm test:coverage        # Generate coverage report
pnpm lint                 # Lint code with ESLint
pnpm lint:fix             # Fix linting issues
pnpm format               # Format code with Prettier
```

## CLI Commands

The CLI provides these commands:

| Command | Description |
|---------|-------------|
| `pm-kit init` | Initialize PM Kit in current directory |
| `pm-kit update` | Update to latest framework version |
| `pm-kit doctor` | Run diagnostics and health checks |
| `pm-kit config` | Manage API keys and settings |
| `pm-kit versions` | List available framework versions |
| `pm-kit uninstall` | Remove PM Kit installation |

## Key Files

### CLI Entry Point
- `bin/pm-kit.js` - Main CLI using cac framework

### Commands (lib/commands/)
- `init.js` - Downloads framework from GitHub, configures MCP
- `update.js` - Updates framework with change detection
- `doctor.js` - Validates installation health
- `config.js` - API key and settings management
- `versions.js` - Lists available releases
- `uninstall.js` - Clean removal

### Services (lib/services/)
- `github-service.js` - GitHub API, downloads, releases
- `mcp-service.js` - MCP server configuration
- `credential-service.js` - Secure keychain storage (keytar)

### Utilities (lib/utils/)
- `logger.js` - Console output with picocolors
- `prompts.js` - Interactive prompts with @clack/prompts
- `file-manager.js` - File operations with fs-extra
- `validator.js` - Schema validation with zod
- `error-handler.js` - Error codes and handling

## Dependencies

| Package | Purpose |
|---------|---------|
| `cac` | CLI framework (lightweight) |
| `picocolors` | Terminal colors |
| `@clack/prompts` | Interactive prompts |
| `@octokit/rest` | GitHub API |
| `fs-extra` | Enhanced file operations |
| `zod` | Runtime validation |
| `keytar` | OS keychain storage |

## Testing

```bash
pnpm test                 # Run all tests
pnpm test -- --watch      # Watch mode
pnpm test -- --coverage   # Coverage report
```

Test structure:
- `tests/unit/` - Unit tests for utilities and services
- `tests/integration/` - Integration tests for commands
- `tests/setup.js` - Test utilities and temp directories

## Release Process

See `docs/operations/RELEASE_MANAGEMENT.md` for detailed release procedures.

Quick release:
```bash
pnpm test && pnpm lint
npm version patch|minor|major
git push origin main --tags
pnpm publish --no-git-checks
```

## Configuration

### Constants (lib/constants.js)
- `KIT_REPOSITORY` - Framework repo location
- `DOWNLOAD_PATHS` - Files to download from framework
- `CLI_VERSION` - Current CLI version

### GitHub Token
Stored securely via keytar or in `~/.pm-kit/github-token`

## Important Notes

1. **Framework content is NOT in this repo** - Don't add workflows, agents, or commands here
2. **Use pnpm** - Project uses pnpm for package management
3. **Test before release** - All tests must pass before publishing
4. **Follow SemVer** - Use semantic versioning for releases

## Documentation

- `docs/operations/RELEASE_MANAGEMENT.md` - Release procedures
- `docs/operations/CHANGELOG.md` - Version history
- `docs/guides/INSTALLATION.md` - User installation guide
- `docs/reference/ARCHITECTURE.md` - Technical architecture

---

**This is a CLI tool repository.** For framework content (workflows, agents, commands), work in the separate framework repository.
