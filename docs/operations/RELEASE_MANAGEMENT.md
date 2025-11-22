# Release Management Guide

This document defines the release process, versioning strategy, and hotfix procedures for PM Kit CLI.

---

## Versioning Strategy

We follow [Semantic Versioning](https://semver.org/) (SemVer):

```
MAJOR.MINOR.PATCH[-PRERELEASE]

Examples:
- 0.2.0       → Minor release (new features)
- 0.2.1       → Patch release (bug fixes)
- 1.0.0       → Major release (breaking changes)
- 1.0.0-beta.1 → Pre-release
```

### Version Increment Rules

| Change Type | Version Bump | Example |
|------------|--------------|---------|
| Breaking API changes | MAJOR | 0.x → 1.0 |
| New features (backwards compatible) | MINOR | 0.1 → 0.2 |
| Bug fixes | PATCH | 0.2.0 → 0.2.1 |
| Hotfixes (critical) | PATCH | 0.2.1 → 0.2.2 |
| Pre-release | PRERELEASE | 1.0.0-alpha.1 |

---

## Branch Strategy

```
main (production)
  │
  ├── release/v0.3.0 (release branch)
  │
  ├── hotfix/v0.2.1 (hotfix branch)
  │
  └── feature/* (feature branches)
```

### Branch Types

| Branch | Purpose | Base | Merges To |
|--------|---------|------|-----------|
| `main` | Production code | - | - |
| `release/vX.Y.Z` | Release preparation | main | main |
| `hotfix/vX.Y.Z` | Critical fixes | main | main |
| `feature/*` | New features | main | main (via PR) |

---

## Release Process

### Standard Release (Minor/Major)

#### 1. Prepare Release

```bash
# Ensure main is up to date
git checkout main
git pull origin main

# Create release branch (optional for complex releases)
git checkout -b release/v0.3.0

# Or work directly on main for simple releases
```

#### 2. Update Version & Changelog

```bash
# Update package.json version
npm version minor  # or major/patch

# Or manually edit package.json
```

Update `docs/operations/CHANGELOG.md`:
```markdown
## [0.3.0] - YYYY-MM-DD

### Added
- Feature description

### Changed
- Change description

### Fixed
- Fix description

### Removed
- Removal description
```

#### 3. Run Tests & Lint

```bash
pnpm test
pnpm lint
```

#### 4. Commit & Tag

```bash
# Stage all changes
git add -A

# Commit with conventional commit format
git commit -m "feat: Release v0.3.0 - Brief description

- Feature 1
- Feature 2
- Breaking change (if any)

🤖 Generated with [Claude Code](https://claude.ai/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Create annotated tag
git tag -a v0.3.0 -m "Release v0.3.0 - Brief description"
```

#### 5. Push & Publish

```bash
# Push to remote
git push origin main
git push origin v0.3.0

# Publish to npm
pnpm publish --no-git-checks
```

#### 6. Create GitHub Release (Optional)

```bash
gh release create v0.3.0 \
  --title "v0.3.0 - Release Title" \
  --notes "Release notes here"
```

---

### Hotfix Process (Critical Bugs)

For urgent fixes that can't wait for the next release:

#### 1. Create Hotfix Branch

```bash
git checkout main
git pull origin main
git checkout -b hotfix/v0.2.1
```

#### 2. Apply Fix

```bash
# Make the fix
# Write tests for the fix
pnpm test
```

#### 3. Update Version

```bash
# Bump patch version
npm version patch

# Update CHANGELOG.md
```

Add to CHANGELOG:
```markdown
## [0.2.1] - YYYY-MM-DD

### Fixed
- Critical bug description (#issue-number)
```

#### 4. Commit, Tag & Push

```bash
git add -A
git commit -m "fix: Critical bug description (#issue)

🤖 Generated with [Claude Code](https://claude.ai/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git tag -a v0.2.1 -m "Hotfix v0.2.1 - Critical bug fix"

# Merge to main
git checkout main
git merge hotfix/v0.2.1
git push origin main
git push origin v0.2.1

# Publish
pnpm publish --no-git-checks

# Clean up
git branch -d hotfix/v0.2.1
```

---

## Release Checklist

### Pre-Release
- [ ] All tests passing (`pnpm test`)
- [ ] Lint passing (`pnpm lint`)
- [ ] CHANGELOG.md updated
- [ ] package.json version bumped
- [ ] Documentation updated (if needed)
- [ ] Breaking changes documented

### Release
- [ ] Commit with conventional message
- [ ] Annotated tag created
- [ ] Pushed to origin (main + tag)
- [ ] Published to npm

### Post-Release
- [ ] GitHub release created (optional)
- [ ] Announcement made (if significant)
- [ ] Version logs updated

---

## Version Logs

Track all releases with context:

### Log Format

```
## v0.2.0 (2025-01-22)
- **Type**: Minor Release
- **Focus**: CLI enhancements & simplified onboarding
- **Key Changes**:
  - New commands: versions, uninstall
  - Download progress indicators
  - Simplified API config (Gemini only, optional)
- **Breaking**: Removed Brave/Perplexity API keys
- **npm**: https://www.npmjs.com/package/pm-kit-cli/v/0.2.0
- **Commit**: 1608058
- **Tag**: v0.2.0
```

---

## Version History Log

### v0.2.0 (2025-01-22)
- **Type**: Minor Release
- **Focus**: CLI enhancements & simplified onboarding
- **Key Changes**:
  - New commands: `versions`, `uninstall`
  - Download progress indicators with visual progress bar
  - Installation modes (`--global`, `--fresh`, `--no-animation`)
  - Update improvements (`--backup`, `--version`, `--exclude`, `--dry-run`)
  - Retry logic with exponential backoff
  - ASCII logo animation
  - Simplified to Gemini-only (optional) API config
- **Breaking**:
  - Removed Brave Search API key requirement
  - Removed Perplexity API key
- **npm**: https://www.npmjs.com/package/pm-kit-cli/v/0.2.0
- **Commit**: `1608058`
- **Tag**: `v0.2.0`
- **Released By**: Claude + Human

### v0.1.0 (2024-01-20)
- **Type**: Initial Release
- **Focus**: Core CLI functionality
- **Key Changes**:
  - `pm-kit init` command
  - `pm-kit update` command
  - `pm-kit doctor` command
  - `pm-kit config` command
  - GitHub authentication
  - MCP server configuration
  - 14 PM workflows, 8 agents, 10 commands
- **npm**: https://www.npmjs.com/package/pm-kit-cli/v/0.1.0
- **Tag**: `v0.1.0`

---

## Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat` | New feature | MINOR |
| `fix` | Bug fix | PATCH |
| `docs` | Documentation only | None |
| `style` | Code style (formatting) | None |
| `refactor` | Code refactoring | None |
| `perf` | Performance improvement | PATCH |
| `test` | Adding tests | None |
| `chore` | Maintenance tasks | None |
| `ci` | CI/CD changes | None |
| `build` | Build system changes | None |
| `revert` | Revert previous commit | Varies |

### Examples

```bash
# Feature
feat(cli): add versions command to list available releases

# Bug fix
fix(update): resolve file permission error on Windows

# Breaking change
feat(api)!: remove Brave Search API key requirement

BREAKING CHANGE: Brave Search API key is no longer required.
Users should update their .mcp.json configuration.

# Hotfix
fix(critical): resolve authentication loop causing infinite requests
```

---

## Quick Reference Commands

```bash
# Check current version
cat package.json | grep '"version"'

# List all tags
git tag -l

# View tag details
git show v0.2.0

# Compare versions
git log v0.1.0..v0.2.0 --oneline

# Create release (full flow)
npm version minor && \
git push origin main && \
git push origin --tags && \
pnpm publish --no-git-checks

# Rollback (if needed)
npm unpublish pm-kit-cli@0.2.1  # Within 72 hours
git tag -d v0.2.1
git push origin :refs/tags/v0.2.1
```

---

## Emergency Procedures

### Rollback a Release

If a release has critical issues:

```bash
# 1. Unpublish from npm (within 72 hours)
npm unpublish pm-kit-cli@0.2.1

# 2. Delete the tag
git tag -d v0.2.1
git push origin :refs/tags/v0.2.1

# 3. Revert the commit (if needed)
git revert HEAD
git push origin main

# 4. Publish hotfix
# ... follow hotfix process
```

### Deprecate a Version

```bash
npm deprecate pm-kit-cli@0.2.1 "Critical bug, please upgrade to 0.2.2"
```

---

## Automation (Future)

Planned GitHub Actions workflows:

- [ ] Auto-version bump based on commit messages
- [ ] Auto-generate changelog from commits
- [ ] Auto-publish on tag push
- [ ] Release notes generation
- [ ] npm publish with provenance

---

## Contact

For release questions or issues:
- Create an issue: [GitHub Issues](https://github.com/vanlumberworks/claude-kit-pm/issues)
- Tag: `release`, `hotfix`, or `versioning`
