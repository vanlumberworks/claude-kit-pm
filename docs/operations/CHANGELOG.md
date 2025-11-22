# Changelog

All notable changes to ClaudeKit PM CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- GitHub Actions for automated releases
- Windows support testing
- Plugin system for custom commands
- Interactive tutorial mode

## [0.2.1] - 2025-01-22

### Changed
- **Modernized CLI Dependencies**
  - Replaced `commander` with `cac` (lighter CLI framework, 3.5KB vs 50KB)
  - Replaced `chalk` with `picocolors` (14x smaller, faster terminal colors)
  - Replaced `prompts` with `@clack/prompts` (better UX, cleaner output)
  - Added `fs-extra` for enhanced file operations
  - Added `zod` for runtime schema validation
  - Added `keytar` for secure OS keychain credential storage
  - Added `ignore` for .gitignore pattern matching
  - Added `extract-zip` and `tar` for archive extraction
- **Improved Completion Output**
  - Replaced ASCII box with `@clack/prompts` `note()` styling
  - Cleaner, consistent output across all commands (init, update, uninstall)
  - Fixed broken box characters caused by ANSI escape code width calculations

### Fixed
- Terminal output rendering issues with colored text in boxes
- Test mocks updated for new @clack/prompts functions

## [0.2.0] - 2025-01-22

### Added
- **New Commands**
  - `pm-kit versions` - List available versions with filtering options
  - `pm-kit uninstall` - Clean removal with confirmation and backup options
- **Download Progress Indicators**
  - Visual progress bar during file downloads
  - File count tracking with percentage display
  - Individual filename display during download
- **Installation Modes**
  - `--global` flag for global installation to `~/.claude`
  - `--fresh` flag for clean installation (removes existing files)
  - `--no-animation` flag to skip logo animation
- **Update Improvements**
  - Change detection with SHA-256 hash comparison
  - `--backup` flag creates timestamped backups before updates
  - `--version <tag>` flag to update to specific version
  - `--exclude` flag for custom file exclusions
  - `--dry-run` mode to preview changes
- **Retry Logic**
  - Exponential backoff for GitHub API requests
  - Automatic retry on network errors (429, 500, 502, 503, 504)
  - Rate limit handling with retry-after header support
- **Update Notifications**
  - Check for updates on `--version` command
  - Non-intrusive notification when new version available
- **ASCII Logo Animation**
  - Beautiful animated logo on startup using oh-my-logo
  - Graceful fallback for terminals without animation support

### Changed
- **Simplified API Configuration**
  - Removed Brave Search API key requirement
  - Removed Perplexity API key
  - Gemini API key is now optional (press Enter to skip)
  - Fast onboarding - no required API keys during installation
  - Configure API keys later with `pm-kit config`
- **FileManager Enhancements**
  - Added `copyFile()` and `copyDirectory()` methods
  - Added `getStats()` for file metadata
  - Added hash comparison for change detection
  - Added `saveDirectoryHashes()` and `loadDirectoryHashes()`

### Fixed
- Integration tests now properly mock all logger methods
- MCP service tests updated for new API key structure
- Progress bar compatibility with spinner operations

### Removed
- Brave Search MCP server configuration
- Perplexity MCP server configuration
- Required API key validation during initialization

## [0.1.0] - 2024-01-20

### Added
- Initial release of PM Kit CLI
- `pm-kit init` command for installation
  - GitHub authentication with multiple fallbacks
  - Automatic framework file download
  - API key configuration (Brave, Perplexity, Gemini)
  - MCP server configuration generation
  - Output directory creation
  - .gitignore auto-update
- `pm-kit update` command for updates
  - Version comparison
  - Local change detection
  - Selective file exclusions
  - Dry-run mode
  - Backup creation option
- `pm-kit doctor` command for diagnostics
  - File structure checks
  - API configuration validation
  - Claude CLI detection
  - Permission checks
  - Connectivity tests
  - Auto-fix capability
- `pm-kit config` command for configuration management
  - List, get, set, delete actions
  - Local and global configuration
  - Sensitive value masking
  - API key management
- Core services
  - GitHub service for repository access
  - MCP service for configuration
- Utilities
  - Error handler with codes
  - File manager
  - Logger with spinners and formatting
  - Prompts for user input
- 14 PM workflows in `.claude/workflows/`
  - Problem decomposition
  - PRD framework
  - Strategic planning
  - Feature prioritization
  - User research synthesis
  - Research synthesis
  - Consensus building
  - Matrix generation
  - Evidence-based decisions
  - Metrics & analytics
  - Stakeholder management
  - Cross-functional coordination
  - Risk assessment
  - Documentation standards
- 8 specialized agents in `.claude/agents/`
  - Problem decomposer
  - PRD writer
  - User researcher
  - Research synthesizer
  - Consensus builder
  - Matrix generator
  - Prioritization engine
  - Analytics synthesizer
- 10 slash commands
  - `/decompose`, `/prd`, `/synthesize`, `/prioritize`
  - `/strategy`, `/decide`, `/research`, `/consensus`
  - `/matrix`, `/evidence`
- 5 technical literacy skills
  - JSON fundamentals
  - API basics
  - ASCII diagrams
  - Frontend prompts
  - Debug without code
- Comprehensive test suite
  - Unit tests for core modules
  - Integration tests for commands
  - Test utilities and setup
  - Jest configuration
  - 70% coverage threshold
- Documentation
  - README.md with quick start
  - INSTALLATION.md guide
  - COMMANDS.md reference
  - CONTRIBUTING.md for developers
  - ARCHITECTURE.md for technical details
  - CHANGELOG.md for version tracking

### Changed
- N/A (initial release)

### Deprecated
- N/A (initial release)

### Removed
- N/A (initial release)

### Fixed
- N/A (initial release)

### Security
- GitHub token stored with 0600 permissions
- API keys masked in console output
- Sensitive files auto-added to .gitignore

## Release Notes

### v0.1.0 - Initial Release

The first version of ClaudeKit PM CLI provides a simple, maintainable way to install and manage the PM Kit framework.

**Key Features**:
- One-command installation: `pm-kit init`
- Automatic GitHub repository downloads
- MCP server configuration
- Self-diagnostic tool
- Easy updates

**For Product Managers**:
- No manual file copying
- Simple API key configuration
- Immediate access to 14 workflows
- 10 ready-to-use slash commands
- Technical literacy modules

**For Maintainers**:
- Single source of truth (GitHub repository)
- Version-controlled framework files
- Easy rollout of updates
- User installation analytics (coming soon)

**Getting Started**:
```bash
npm install -g pm-kit-cli
cd your-project
pm-kit init
```

See [INSTALLATION.md](./INSTALLATION.md) for detailed setup instructions.

**Feedback Welcome**:
- Report bugs: [GitHub Issues](https://github.com/your-org/pm-kit-cli/issues)
- Request features: [GitHub Discussions](https://github.com/your-org/pm-kit-cli/discussions)
- Contribute: See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| 0.2.1 | 2025-01-22 | Modernized dependencies (cac, picocolors, @clack/prompts), improved output |
| 0.2.0 | 2025-01-22 | New commands (versions, uninstall), progress indicators, simplified API config |
| 0.1.0 | 2024-01-20 | Initial release with init, update, doctor, config commands |

## Upcoming Releases

### v0.3.0 (Planned)
- [ ] Plugin system for custom commands
- [ ] Windows installer
- [ ] Interactive setup wizard
- [ ] Usage analytics (opt-in)
- [ ] Team collaboration features
- [ ] Shared configuration
- [ ] Custom workflow templates
- [ ] Multi-project management

## Migration Guides

### From Manual Installation to CLI

If you previously installed PM Kit manually:

1. **Backup your customizations**:
```bash
cp -r .claude .claude-backup
cp CLAUDE.md CLAUDE-backup.md
```

2. **Install CLI**:
```bash
npm install -g pm-kit-cli
```

3. **Initialize** (will detect existing installation):
```bash
pm-kit init
```

4. **Restore customizations**:
```bash
# Copy back custom workflows
cp .claude-backup/workflows/custom-* .claude/workflows/

# Merge CLAUDE.md changes if needed
```

5. **Verify**:
```bash
pm-kit doctor
```

---

## Support

For questions about specific versions or changes, please see:
- [Documentation](https://github.com/your-org/pm-kit-cli/wiki)
- [Discussions](https://github.com/your-org/pm-kit-cli/discussions)
- [Issues](https://github.com/your-org/pm-kit-cli/issues)
