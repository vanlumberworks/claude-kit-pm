# PM Kit Tests

Comprehensive test suite for PM Kit CLI.

## Test Structure

```
tests/
├── setup.js                    # Test configuration and utilities
├── unit/                       # Unit tests for individual modules
│   ├── error-handler.test.js  # Error handling tests
│   ├── file-manager.test.js   # File operations tests
│   └── mcp-service.test.js    # MCP configuration tests
├── integration/                # Integration tests for commands
│   └── init.test.js           # Init command integration tests
└── fixtures/                   # Test data and mock files
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test tests/unit/file-manager.test.js

# Run tests matching pattern
pnpm test -- --testNamePattern="should create directory"
```

## Writing Tests

### Unit Tests

Unit tests should test individual functions/modules in isolation:

```javascript
const myModule = require('../../lib/utils/my-module');

describe('myModule', () => {
  test('should do something', () => {
    const result = myModule.doSomething('input');
    expect(result).toBe('expected output');
  });
});
```

### Integration Tests

Integration tests should test complete workflows:

```javascript
const command = require('../../lib/commands/my-command');

describe('myCommand (integration)', () => {
  beforeEach(() => {
    // Setup test environment
  });

  test('should execute command successfully', async () => {
    await command(options);
    // Assert side effects
  });
});
```

## Test Utilities

The `setup.js` file provides utilities:

- `TEST_DIR`: Temporary directory for tests
- `createTempFile(filename, content)`: Create test file
- `createTempDir(dirname)`: Create test directory
- `readTempFile(filename)`: Read test file
- `fileExists(filename)`: Check file existence
- `mockConsole()`: Mock console output

## Coverage Requirements

Minimum coverage thresholds:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Mocking

### Mocking Dependencies

```javascript
jest.mock('../../lib/services/github-service');
const githubService = require('../../lib/services/github-service');

githubService.authenticate = jest.fn().mockResolvedValue();
```

### Mocking Console

```javascript
const consoleMock = mockConsole();

// Your code that logs

expect(consoleMock.logs).toContain('expected message');
consoleMock.restore();
```

## CI/CD

Tests run automatically on:
- Every commit (pre-commit hook)
- Pull requests
- Before npm publish

## Adding New Tests

1. Create test file in appropriate directory
2. Follow naming convention: `*.test.js`
3. Import test utilities from `../setup`
4. Write descriptive test names
5. Ensure tests are isolated (no shared state)
6. Run `pnpm test` to verify

## Best Practices

- ✅ Test behavior, not implementation
- ✅ Use descriptive test names
- ✅ One assertion per test (when possible)
- ✅ Clean up after tests (use afterEach)
- ✅ Mock external dependencies
- ❌ Don't test third-party libraries
- ❌ Don't share state between tests
- ❌ Don't test private functions directly
