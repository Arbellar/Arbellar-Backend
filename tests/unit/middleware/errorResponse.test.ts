/**
 * Unit tests for the error response sanitizer.
 *
 * Covers top-level deny-listed keys, nested deny-listed keys, arrays with
 * deny-listed keys, non-object input, and deeply nested recursive sanitization.
 */

import { describe, expect, it } from 'vitest';
import { sanitizeErrorDetails } from '../../../src/middleware/errorResponse';

describe('sanitizeErrorDetails', () => {
  it('removes deny-listed keys at the top level', () => {
    const input = {
      user: 'alice',
      password: 'hunter2',
      secret: 's3cret',
      token: 'abc123',
      apiKey: 'key',
    };
    const result = sanitizeErrorDetails(input) as Record<string, unknown>;

    expect(result.user).toBe('alice');
    expect(result.password).toBeUndefined();
    expect(result.secret).toBeUndefined();
    expect(result.token).toBeUndefined();
    expect(result.apiKey).toBeUndefined();
  });

  it('removes deny-listed keys at nested levels', () => {
    const input = {
      user: {
        name: 'bob',
        passwordHash: 'hash123',
        email: 'bob@example.com',
      },
      connection: {
        mongodbUri: 'mongodb://local',
        port: 27017,
      },
    };
    const result = sanitizeErrorDetails(input) as Record<string, any>;

    expect(result.user.name).toBe('bob');
    expect(result.user.passwordHash).toBeUndefined();
    expect(result.user.email).toBe('bob@example.com');
    expect(result.connection.mongodbUri).toBeUndefined();
    expect(result.connection.port).toBe(27017);
  });

  it('removes deny-listed keys inside arrays', () => {
    const input = {
      items: [
        { id: 1, token: 't1', name: 'a' },
        { id: 2, privateKey: 'pk', name: 'b' },
        { id: 3, name: 'c' },
      ],
    };
    const result = sanitizeErrorDetails(input) as Record<string, any>;

    expect(result.items[0].id).toBe(1);
    expect(result.items[0].token).toBeUndefined();
    expect(result.items[0].name).toBe('a');
    expect(result.items[1].privateKey).toBeUndefined();
    expect(result.items[1].name).toBe('b');
    expect(result.items[2].id).toBe(3);
  });

  it('returns non-object input unchanged', () => {
    expect(sanitizeErrorDetails(null)).toBe(null);
    expect(sanitizeErrorDetails(undefined)).toBe(undefined);
    expect(sanitizeErrorDetails(42)).toBe(42);
    expect(sanitizeErrorDetails('hello')).toBe('hello');
    expect(sanitizeErrorDetails(true)).toBe(true);
  });

  it('handles empty objects', () => {
    expect(sanitizeErrorDetails({})).toEqual({});
  });

  it('removes deeply nested deny-listed keys recursively', () => {
    const input = {
      level1: {
        level2: {
          level3: {
            jwt: 'jwt_token',
            safe: 'value',
          },
        },
      },
    };
    const result = sanitizeErrorDetails(input) as Record<string, any>;

    expect(result.level1.level2.level3.jwt).toBeUndefined();
    expect(result.level1.level2.level3.safe).toBe('value');
  });

  it('is case-insensitive for deny-listed keys', () => {
    const input = {
      PASSWORD: 'x',
      Token: 'y',
      ApiKey: 'z',
      safe: 'ok',
    };
    const result = sanitizeErrorDetails(input) as Record<string, unknown>;

    expect(result.PASSWORD).toBeUndefined();
    expect(result.Token).toBeUndefined();
    expect(result.ApiKey).toBeUndefined();
    expect(result.safe).toBe('ok');
  });

  it('handles arrays at the top level', () => {
    const input = [
      { password: 'a', safe: 1 },
      { secret: 'b', safe: 2 },
      { safe: 3 },
    ];
    const result = sanitizeErrorDetails(input) as Array<Record<string, unknown>>;

    expect(result[0].password).toBeUndefined();
    expect(result[0].safe).toBe(1);
    expect(result[1].secret).toBeUndefined();
    expect(result[1].safe).toBe(2);
    expect(result[2].safe).toBe(3);
  });

  it('handles nested arrays within objects', () => {
    const input = {
      logs: [
        { message: 'ok', stack: 'trace' },
        { message: 'warn' },
      ],
    };
    const result = sanitizeErrorDetails(input) as Record<string, any>;

    expect(result.logs[0].message).toBe('ok');
    expect(result.logs[0].stack).toBeUndefined();
    expect(result.logs[1].message).toBe('warn');
  });

  it('does not mutate the original input', () => {
    const original = { user: 'a', password: 'b', nested: { token: 'c', safe: 'd' } };
    const copy = JSON.parse(JSON.stringify(original));

    sanitizeErrorDetails(original);

    expect(original).toEqual(copy);
  });
});
