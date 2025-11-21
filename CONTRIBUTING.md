# Contributing to ClaudeKit PM CLI

Thank you for your interest in contributing! This document provides guidelines for contributing to the PM Kit CLI project.

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- pnpm (recommended) or npm
- Git
- GitHub account

### Development Setup

1. **Fork and clone**:
```bash
git clone https://github.com/your-username/pm-kit-cli.git
cd pm-kit-cli
```

2. **Install dependencies**:
```bash
pnpm install
```

3. **Link for local testing**:
```bash
pnpm link --global
```

4. **Run tests**:
```bash
pnpm test
```

5. **Create a branch**:
```bash
git checkout -b feature/your-feature-name
```

## Project Structure

```
pm-kit-cli/
├── bin/
│   └── pm-kit.js           # CLI entry point
├── lib/
│   ├── commands/           # Command implementations
│   ├── services/           # External service integrations
│   ├── utils/              # Utility functions
│   └── constants.js        # Configuration constants
├── tests/
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── setup.js            # Test utilities
├── docs/                   # Additional documentation
└── .claude/                # PM workflow templates
```

## Development Workflow

### 1. Pick an Issue

- Check [open issues](https://github.com/your-org/pm-kit-cli/issues)
- Comment to claim an issue
- Or create a new issue to discuss your idea

### 2. Create a Branch

Branch naming convention:
```bash
feature/short-description    # New features
fix/short-description        # Bug fixes
docs/short-description       # Documentation
refactor/short-description   # Code refactoring
test/short-description       # Test improvements
```

### 3. Make Changes

**Code style**:
- Follow existing code conventions
- Use ESLint and Prettier (automatic with git hooks)
- Write descriptive variable/function names
- Add comments for complex logic

**Testing**:
- Write tests for new features
- Update tests for bug fixes
- Ensure all tests pass: `pnpm test`
- Aim for >70% code coverage

**Documentation**:
- Update README.md if needed
- Update COMMANDS.md for new commands
- Add inline JSDoc comments
- Update CHANGELOG.md

### 4. Commit Changes

**Commit message format**:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semi colons, etc
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples**:
```bash
git commit -m "feat(init): add --reconfigure-api flag"
git commit -m "fix(update): handle network timeouts"
git commit -m "docs(commands): add examples for config command"
```

**Commit guidelines**:
- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor" not "moves cursor")
- Keep first line under 72 characters
- Reference issues: "fixes #123" or "closes #456"

### 5. Push and Create PR

```bash
git push origin your-branch-name
```

Then create a Pull Request on GitHub.

## Pull Request Guidelines

### PR Title

Follow the same format as commit messages:
```
feat(init): add --reconfigure-api flag
fix(update): handle network timeouts
```

### PR Description

Use this template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged and published
```

### Review Process

1. Automated checks must pass (tests, linting)
2. At least one maintainer review required
3. Address review feedback
4. Once approved, maintainer will merge

## Testing Guidelines

### Unit Tests

Test individual functions/modules in isolation:

```javascript
// tests/unit/my-module.test.js
const myModule = require('../../lib/utils/my-module');

describe('myModule', () => {
  test('should do something', () => {
    const result = myModule.doSomething('input');
    expect(result).toBe('expected');
  });
});
```

### Integration Tests

Test complete workflows:

```javascript
// tests/integration/my-command.test.js
const myCommand = require('../../lib/commands/my-command');

describe('myCommand (integration)', () => {
  test('should execute successfully', async () => {
    await myCommand(options);
    // Assert side effects
  });
});
```

### Running Tests

```bash
# All tests
pnpm test

# Watch mode
pnpm test:watch

# With coverage
pnpm test:coverage

# Specific file
pnpm test tests/unit/file-manager.test.js
```

## Code Style

### JavaScript

**Use modern JavaScript**:
```javascript
// Good
const result = await fetchData();
const { name, email } = user;

// Avoid
var result = fetchData().then(...);
```

**Error handling**:
```javascript
// Good
try {
  await operation();
} catch (error) {
  throw new PMKitError('Operation failed', ErrorCodes.API_ERROR, {
    error: error.message
  });
}

// Avoid
try {
  await operation();
} catch (e) {
  throw new Error('Something went wrong');
}
```

**Async/await over promises**:
```javascript
// Good
async function fetchUser(id) {
  const user = await api.getUser(id);
  return user;
}

// Avoid
function fetchUser(id) {
  return api.getUser(id).then(user => user);
}
```

### Linting

```bash
# Run linter
pnpm lint

# Auto-fix
pnpm lint:fix

# Format code
pnpm format
```

## Documentation

### Inline Comments

Use JSDoc for functions:

```javascript
/**
 * Download file from GitHub repository
 * @param {string} repository - Repository in format "owner/repo"
 * @param {string} path - Path to file in repository
 * @param {string} destination - Local destination path
 * @param {string} branch - Branch name (default: 'main')
 * @returns {Promise<void>}
 * @throws {PMKitError} If download fails
 */
async function downloadFile(repository, path, destination, branch = 'main') {
  // Implementation
}
```

### README Updates

Update README.md if your changes:
- Add new commands
- Change installation steps
- Modify prerequisites
- Add new features

### CHANGELOG

Add entry to CHANGELOG.md:

```markdown
## [Unreleased]

### Added
- New `--reconfigure-api` flag for init command

### Fixed
- Network timeout handling in update command

### Changed
- Improved error messages for authentication failures
```

## Release Process

Maintainers handle releases:

1. Update version in package.json
2. Update CHANGELOG.md
3. Create git tag: `git tag v0.2.0`
4. Push tag: `git push origin v0.2.0`
5. GitHub Actions publishes to npm
6. Create GitHub Release with notes

## Common Tasks

### Adding a New Command

1. Create command file:
```javascript
// lib/commands/my-command.js
async function myCommand(options = {}) {
  logger.header('My Command');
  // Implementation
}

module.exports = myCommand;
```

2. Register in CLI:
```javascript
// bin/pm-kit.js
program
  .command('my-command')
  .description('Description of command')
  .option('--my-option', 'Option description')
  .action(async (options) => {
    const myCommand = require('../lib/commands/my-command');
    await myCommand(options);
  });
```

3. Add tests:
```javascript
// tests/integration/my-command.test.js
describe('myCommand', () => {
  test('should work', async () => {
    // Test implementation
  });
});
```

4. Update documentation:
- Add to COMMANDS.md
- Update README.md if needed

### Adding a New Utility

1. Create utility file:
```javascript
// lib/utils/my-utility.js
function doSomething(input) {
  // Implementation
  return result;
}

module.exports = {
  doSomething
};
```

2. Add tests:
```javascript
// tests/unit/my-utility.test.js
const { doSomething } = require('../../lib/utils/my-utility');

describe('my-utility', () => {
  test('should do something', () => {
    expect(doSomething('input')).toBe('result');
  });
});
```

### Fixing a Bug

1. Add a failing test that reproduces the bug
2. Fix the bug
3. Verify the test now passes
4. Add regression test if needed

## Getting Help

- **Questions**: [GitHub Discussions](https://github.com/your-org/pm-kit-cli/discussions)
- **Bugs**: [GitHub Issues](https://github.com/your-org/pm-kit-cli/issues)
- **Chat**: [Discord](https://discord.gg/your-discord) (if available)

## Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Invited to contributor discussions

Thank you for contributing to ClaudeKit PM CLI!
