/**
 * Error response sanitization module
 *
 * Strips sensitive fields (credentials, internal DB connection details, keys, etc.)
 * from error payloads before they leave the backend.
 */

/**
 * Deny-list of sensitive keys to strip from error responses (compared case-insensitively).
 */
export const DENY_LISTED_KEYS = new Set([
  'password',
  'passwordhash',
  'secret',
  'token',
  'apikey',
  'privatekey',
  'private_key',
  'keypair',
  'seed',
  'mnemonic',
  'jwt',
  'authorization',
  'mongodburi',
  'connectionstring',
  'uri',
  'cursor',
  'stacktrace',
  'stack',
  'internal',
  'env',
  'process',
]);

/**
 * Pure recursive helper that strips sensitive fields from details objects or arrays.
 *
 * @param details Any error details payload
 * @returns Sanitized details or undefined if empty/unusable
 */
export function sanitizeErrorDetails<T = unknown>(details: T): T {
  if (details === null || details === undefined) {
    return details;
  }

  if (typeof details !== 'object') {
    return details;
  }

  if (Array.isArray(details)) {
    return details.map((item) => sanitizeErrorDetails(item)) as unknown as T;
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(details as Record<string, unknown>)) {
    const normalizedKey = key.toLowerCase();
    if (DENY_LISTED_KEYS.has(normalizedKey)) {
      continue;
    }

    if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeErrorDetails(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}
