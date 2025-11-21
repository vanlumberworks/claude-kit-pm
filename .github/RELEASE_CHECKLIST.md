# Release Checklist

Use this checklist when preparing a new release.

## Pre-Release

### Version & Documentation

- [ ] Decide on version number (following semver)
  - Patch (0.1.X) - Bug fixes
  - Minor (0.X.0) - New features, backwards compatible
  - Major (X.0.0) - Breaking changes

- [ ] Update version in `package.json`
  ```bash
  # Use npm version command
  npm version patch  # or minor, or major
  ```

- [ ] Update CHANGELOG.md
  - [ ] Move items from [Unreleased] to new version section
  - [ ] Add release date
  - [ ] Organize by Added, Changed, Fixed, etc.
  - [ ] Write release notes summary

- [ ] Review and update documentation
  - [ ] README.md - Any new features?
  - [ ] COMMANDS.md - New commands or options?
  - [ ] INSTALLATION.md - Any changes to install process?

### Testing

- [ ] All tests pass locally
  ```bash
  pnpm test
  ```

- [ ] Linter passes
  ```bash
  pnpm lint
  ```

- [ ] Test installation locally
  ```bash
  pnpm link --global
  pm-kit --version
  pm-kit init --help
  ```

- [ ] Test on multiple OS (if possible)
  - [ ] macOS
  - [ ] Linux
  - [ ] Windows

- [ ] Test with multiple Node.js versions
  - [ ] Node 16.x
  - [ ] Node 18.x
  - [ ] Node 20.x

### Manual Testing Checklist

Test all commands:

- [ ] `pm-kit init`
  - [ ] Fresh installation
  - [ ] Reinitialize existing
  - [ ] With --force flag
  - [ ] With --reset-token flag

- [ ] `pm-kit update`
  - [ ] Check for updates
  - [ ] --dry-run mode
  - [ ] --backup option
  - [ ] --exclude option

- [ ] `pm-kit doctor`
  - [ ] All checks
  - [ ] --fix option
  - [ ] --json output

- [ ] `pm-kit config`
  - [ ] list
  - [ ] get
  - [ ] set
  - [ ] delete
  - [ ] reset

## Release

### Create Release

- [ ] Commit all changes
  ```bash
  git add .
  git commit -m "chore: prepare release v0.X.Y"
  ```

- [ ] Push to main branch
  ```bash
  git push origin main
  ```

- [ ] Create and push git tag
  ```bash
  git tag v0.X.Y
  git push origin v0.X.Y
  ```

- [ ] Wait for GitHub Actions to complete
  - [ ] CI workflow passes
  - [ ] Release workflow publishes to npm
  - [ ] GitHub Release is created

### Verify Release

- [ ] Check npm package published
  ```bash
  npm view pm-kit-cli version
  # Should show new version
  ```

- [ ] Test installation from npm
  ```bash
  npm install -g pm-kit-cli@latest
  pm-kit --version
  # Should show new version
  ```

- [ ] Verify GitHub Release created
  - [ ] Release notes included
  - [ ] Assets attached (if any)
  - [ ] Tagged correctly

## Post-Release

### Documentation

- [ ] Update GitHub Releases page if needed
- [ ] Add any additional release notes
- [ ] Update wiki if applicable

### Communication

- [ ] Announce release (if significant)
  - [ ] GitHub Discussions
  - [ ] Discord/Slack (if applicable)
  - [ ] Twitter/Social media (if applicable)
  - [ ] Email newsletter (if applicable)

- [ ] Create announcement template:
  ```markdown
  🎉 PM Kit CLI v0.X.Y released!

  **Highlights:**
  - New feature 1
  - Bug fix 2
  - Improvement 3

  **Install:**
  npm install -g pm-kit-cli@latest

  **What's Changed:**
  [Link to CHANGELOG]

  **Full Release Notes:**
  [Link to GitHub Release]
  ```

### Cleanup

- [ ] Close related issues
  - Link them to release
  - Thank contributors

- [ ] Update project board
  - Move items to "Done"
  - Plan next milestone

- [ ] Start [Unreleased] section in CHANGELOG.md
  ```markdown
  ## [Unreleased]

  ### Added

  ### Changed

  ### Fixed
  ```

## Rollback Procedure

If something goes wrong:

### npm

```bash
# Unpublish within 72 hours (use cautiously)
npm unpublish pm-kit-cli@0.X.Y

# Or deprecate
npm deprecate pm-kit-cli@0.X.Y "Version has critical bugs, please use 0.X.Z"
```

### GitHub

```bash
# Delete tag locally
git tag -d v0.X.Y

# Delete tag remotely
git push origin :refs/tags/v0.X.Y
```

- Delete GitHub Release from web UI

### Notify Users

- [ ] Post notice in GitHub Discussions
- [ ] Update README with warning
- [ ] Notify via other channels

## Version Numbering Guide

**Semantic Versioning (MAJOR.MINOR.PATCH)**:

- **MAJOR** (X.0.0) - Breaking changes
  - API changes that break backwards compatibility
  - Removed features
  - Changed behavior that affects existing users
  - Examples: Removing commands, changing required parameters

- **MINOR** (0.X.0) - New features, backwards compatible
  - New commands
  - New options
  - New features
  - Deprecations (but not removals)
  - Examples: Adding new flags, new workflows

- **PATCH** (0.0.X) - Bug fixes only
  - Bug fixes
  - Documentation updates
  - Performance improvements
  - Examples: Fixing error handling, typos

## Release Frequency

- **Patch releases** - As needed for critical bugs
- **Minor releases** - Every 2-4 weeks for new features
- **Major releases** - Only when necessary for breaking changes

## Emergency Hotfix Process

For critical security issues or breaking bugs:

1. Create hotfix branch from latest release tag
2. Fix the issue
3. Test thoroughly
4. Increment patch version
5. Release immediately
6. Backport to main branch if needed
