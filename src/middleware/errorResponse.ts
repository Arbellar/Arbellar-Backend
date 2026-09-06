/**
 * Error response sanitizer
 *
 * Strips sensitive fields from JSON error details before they leave the
 * application, preventing accidental leakage of internal state, credentials,
 * or connection metadata through error responses.
 */

/**
 * Keys that must never be exposed in an error response.
 *
 * Compared case-insensitively. Extend as new sensitive fields are introduced.
 */
const DENY_LIST = new Set<string>([
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
 * Sanitize error details by recursively removing sensitive keys.
 *
 * This helper is pure: it performs no I/O, imports, or side effects, and is
 * safe to call from any error handler.
 *
 * @param details - Arbitrary error details to sanitize.
 * @returns A sanitized copy with all deny-listed keys removed, or `undefined`
 *          when the input is not a plain object or is `null`.
 *
 * @example
 * ```ts
 * sanitizeErrorDetails({ user: { password: 'x' }, safe: 1 })
 * // { user: {}, safe: 1 }
 * ```
 */
export function sanitizeErrorDetails(details: unknown): unknown {
    if (details == null || typeof details !== 'object') {
        return details;
    }

    if (Array.isArray(details)) {
        return details.map(sanitizeErrorDetails);
    }

    const source = details as Record<string, unknown>;
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(source)) {
        if (DENY_LIST.has(key.toLowerCase())) {
            continue;
        }
        result[key] = sanitizeErrorDetails(value);
    }

    return result;
}

export default { sanitizeErrorDetails };
