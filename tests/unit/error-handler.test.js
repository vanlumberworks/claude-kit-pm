/**
 * Unit tests for error-handler
 */

const { PMKitError, ErrorCodes, handleError } = require('../../lib/utils/error-handler');

describe('PMKitError', () => {
  test('should create error with message and code', () => {
    const error = new PMKitError('Test error', ErrorCodes.VALIDATION_ERROR);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('PMKitError');
    expect(error.message).toBe('Test error');
    expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR);
  });

  test('should include details if provided', () => {
    const details = { field: 'email', value: 'invalid' };
    const error = new PMKitError('Validation failed', ErrorCodes.VALIDATION_ERROR, details);

    expect(error.details).toEqual(details);
  });

  test('should have undefined details if not provided', () => {
    const error = new PMKitError('Test error', ErrorCodes.VALIDATION_ERROR);

    expect(error.details).toEqual({});
  });
});

describe('ErrorCodes', () => {
  test('should have all required error codes', () => {
    expect(ErrorCodes).toHaveProperty('VALIDATION_ERROR');
    expect(ErrorCodes).toHaveProperty('NOT_INITIALIZED');
    expect(ErrorCodes).toHaveProperty('FS_ERROR');
    expect(ErrorCodes).toHaveProperty('API_ERROR');
    expect(ErrorCodes).toHaveProperty('AUTH_FAILED');
    expect(ErrorCodes).toHaveProperty('NETWORK_ERROR');
    expect(ErrorCodes).toHaveProperty('CONFIG_ERROR');
  });

  test('error codes should be unique strings', () => {
    const codes = Object.values(ErrorCodes);
    const uniqueCodes = new Set(codes);

    expect(codes.length).toBe(uniqueCodes.size);
    codes.forEach(code => expect(typeof code).toBe('string'));
  });
});

describe('handleError', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('should handle PMKitError', () => {
    const error = new PMKitError('Test error', ErrorCodes.VALIDATION_ERROR, { field: 'email' });

    handleError(error);

    expect(consoleSpy).toHaveBeenCalled();
  });

  test('should handle generic Error', () => {
    const error = new Error('Generic error');

    handleError(error);

    expect(consoleSpy).toHaveBeenCalled();
  });

  test('should handle PMKitError with details', () => {
    const error = new PMKitError('Test error', ErrorCodes.NOT_INITIALIZED, {
      help: 'Run pm-kit init first'
    });

    handleError(error, 'test-context');

    expect(consoleSpy).toHaveBeenCalled();
  });
});
