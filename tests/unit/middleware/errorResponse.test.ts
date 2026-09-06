import { describe, it, expect } from 'vitest';
import { sanitizeErrorDetails, DENY_LISTED_KEYS } from '../../../src/middleware/errorResponse';

describe('sanitizeErrorDetails', () => {
  it('should export expected deny-listed keys', () => {
    expect(DENY_LISTED_KEYS.has('password')).toBe(true);
    expect(DENY_LISTED_KEYS.has('secret')).toBe(true);
    expect(DENY_LISTED_KEYS.has('token')).toBe(true);
    expect(DENY_LISTED_KEYS.has('apikey')).toBe(true);
    expect(DENY_LISTED_KEYS.has('privatekey')).toBe(true);
    expect(DENY_LISTED_KEYS.has('private_key')).toBe(true);
    expect(DENY_LISTED_KEYS.has('mongodburi')).toBe(true);
    expect(DENY_LISTED_KEYS.has('connectionstring')).toBe(true);
    expect(DENY_LISTED_KEYS.has('jwt')).toBe(true);
    expect(DENY_LISTED_KEYS.has('authorization')).toBe(true);
    expect(DENY_LISTED_KEYS.has('stack')).toBe(true);
    expect(DENY_LISTED_KEYS.has('stacktrace')).toBe(true);
  });

  it('should return non-object inputs directly (primitives, null, undefined)', () => {
    expect(sanitizeErrorDetails(null)).toBe(null);
    expect(sanitizeErrorDetails(undefined)).toBe(undefined);
    expect(sanitizeErrorDetails('simple string')).toBe('simple string');
    expect(sanitizeErrorDetails(12345)).toBe(12345);
    expect(sanitizeErrorDetails(true)).toBe(true);
  });

  it('should strip top-level deny-listed keys (case-insensitive)', () => {
    const input = {
      password: 'super-secret-pw',
      PasswordHash: 'hash123',
      SECRET: 'my-secret',
      token: 'bearer-xyz',
      apiKey: 'api-123',
      privateKey: 'pk-abc',
      private_key: 'pk-underscore',
      keypair: { pub: '1', priv: '2' },
      seed: 'seed123',
      mnemonic: 'word1 word2 word3',
      jwt: 'jwt-token',
      authorization: 'Bearer foo',
      mongodbUri: 'mongodb://localhost:27017',
      connectionString: 'postgres://...',
      uri: 'http://secret.url',
      cursor: 'cursor-id',
      stackTrace: 'trace...',
      stack: 'error stack',
      internal: { reason: 'db fail' },
      env: { NODE_ENV: 'dev' },
      process: { pid: 1234 },
      validField: 'safe data',
      status: 400,
    };

    const sanitized = sanitizeErrorDetails(input);

    expect(sanitized).toEqual({
      validField: 'safe data',
      status: 400,
    });
  });

  it('should strip nested deny-listed keys recursively', () => {
    const input = {
      user: {
        id: 'user-1',
        name: 'Alice',
        password: 'nested-password',
        auth: {
          token: 'nested-token',
          refreshToken: 'keep-or-strip',
          privateKey: 'secret-key',
        },
      },
      meta: {
        connectionString: 'mongodb://admin:pass@host',
        requestCount: 42,
      },
    };

    const sanitized = sanitizeErrorDetails(input);

    expect(sanitized).toEqual({
      user: {
        id: 'user-1',
        name: 'Alice',
        auth: {
          refreshToken: 'keep-or-strip',
        },
      },
      meta: {
        requestCount: 42,
      },
    });
  });

  it('should sanitize arrays with deny-listed keys within objects', () => {
    const input = [
      { id: 1, token: 'token-1', label: 'item 1' },
      { id: 2, secret: 'secret-2', label: 'item 2' },
      'plain-string-in-array',
      42,
    ];

    const sanitized = sanitizeErrorDetails(input);

    expect(sanitized).toEqual([
      { id: 1, label: 'item 1' },
      { id: 2, label: 'item 2' },
      'plain-string-in-array',
      42,
    ]);
  });

  it('should handle deeply nested structures', () => {
    const input = {
      level1: {
        level2: {
          level3: {
            sensitive: {
              password: 'xyz',
              seed: 'seed-phrase',
            },
            safe: 'deep-safe-value',
          },
        },
      },
    };

    const sanitized = sanitizeErrorDetails(input);

    expect(sanitized).toEqual({
      level1: {
        level2: {
          level3: {
            sensitive: {},
            safe: 'deep-safe-value',
          },
        },
      },
    });
  });
});
