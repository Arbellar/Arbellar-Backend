# Utilities

This directory contains utility functions, helpers, and shared components used throughout the Arbellar Backend application.

## Overview

Utilities provide reusable functionality that doesn't belong to any specific domain or module. They are designed to be independent, testable, and focused on specific tasks.

## Utility Categories

### 1. Logging (`logger.ts`)
Structured logging system with domain-specific loggers.

**Features:**
- Environment-aware formatting (JSON in production, colored in development)
- Multiple log levels (error, warn, info, http, debug)
- Domain-specific loggers (database, stellar, scanner, execution)
- Performance timing utilities
- Request logging middleware

**Usage:**
```typescript
import { logger, scannerLogger, createTimer } from './utils/logger';

// General logging
logger.info('Application started');
logger.error('Something went wrong', { error: error.message });

// Domain-specific logging
scannerLogger.opportunity('USDC/XLM', 0.75, ['SDEX', 'Soroswap']);

// Performance timing
const timer = createTimer('database-query');
// ... operation
const duration = timer.end();
```

### 2. Error Handling (Future - Phase 2)
Standardized error classes and error handling utilities.

**Planned Features:**
- Custom error classes (ValidationError, AuthenticationError, etc.)
- Error formatting utilities
- Error response generation
- Error logging utilities

### 3. Validation (Future - Phase 2)
Input validation and sanitization utilities.

**Planned Features:**
- Request validation schemas
- Type validation utilities
- Sanitization functions
- Custom validation rules

### 4. Date/Time Utilities (Future - Phase 2)
Date and time manipulation utilities.

**Planned Features:**
- Timezone handling
- Date formatting
- Duration calculations
- Timestamp utilities

### 5. String Utilities (Future - Phase 2)
String manipulation and formatting utilities.

**Planned Features:**
- Template formatting
- String validation
- Encoding/decoding
- Formatting utilities

### 6. Number Utilities (Future - Phase 2)
Number formatting and calculation utilities.

**Planned Features:**
- Financial calculations
- Percentage formatting
- Rounding utilities
- Mathematical helpers

### 7. Object Utilities (Future - Phase 2)
Object manipulation and validation utilities.

**Planned Features:**
- Deep cloning
- Object merging
- Property validation
- Type checking

### 8. Array Utilities (Future - Phase 2)
Array manipulation and processing utilities.

**Planned Features:**
- Filtering and sorting
- Batch processing
- Unique operations
- Array transformations

### 9. File Utilities (Future - Phase 2)
File system operation utilities.

**Planned Features:**
- File reading/writing
- File validation
- Path manipulation
- File type checking

### 10. Crypto Utilities (Future - Phase 3)
Cryptographic and security utilities.

**Planned Features:**
- Hash functions
- Encryption/decryption
- Token generation
- Security helpers

## Design Principles

### 1. Single Responsibility
Each utility function should do one thing well.

```typescript
// GOOD: Single responsibility
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

// BAD: Multiple responsibilities
export function processAndFormatCurrency(amount: number, validate: boolean): string {
  if (validate && amount < 0) throw new Error('Invalid amount');
  return `$${amount.toFixed(2)}`;
}
```

### 2. Pure Functions
Utilities should be pure functions where possible (no side effects).

```typescript
// GOOD: Pure function
export function calculateSpread(bid: number, ask: number): number {
  return ((ask - bid) / bid) * 100;
}

// BAD: Side effect
export function calculateAndLogSpread(bid: number, ask: number): number {
  const spread = ((ask - bid) / bid) * 100;
  console.log(`Spread: ${spread}%`); // Side effect
  return spread;
}
```

### 3. Type Safety
All utilities should have proper TypeScript types.

```typescript
// GOOD: Type safety
export interface SpreadResult {
  percentage: number;
  absolute: number;
}

export function calculateSpread(bid: number, ask: number): SpreadResult {
  return {
    percentage: ((ask - bid) / bid) * 100,
    absolute: ask - bid,
  };
}
```

### 4. Error Handling
Utilities should handle errors gracefully.

```typescript
// GOOD: Error handling
export function safeParseJson(jsonString: string): any {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}
```

### 5. Performance
Utilities should be optimized for performance.

```typescript
// GOOD: Performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
```

## Usage Patterns

### Importing Utilities
```typescript
// Import specific utilities
import { logger } from './utils/logger';
import { formatCurrency } from './utils/formatters';

// Import utility module
import * as validation from './utils/validation';
```

### Testing Utilities
Utilities should have comprehensive unit tests.

```typescript
// Example test for a utility function
describe('formatCurrency', () => {
  it('should format positive amounts correctly', () => {
    expect(formatCurrency(100)).toBe('$100.00');
    expect(formatCurrency(99.99)).toBe('$99.99');
  });
  
  it('should format negative amounts correctly', () => {
    expect(formatCurrency(-50)).toBe('-$50.00');
  });
});
```

### Error Handling in Utilities
```typescript
export function divideSafely(a: number, b: number): number | null {
  if (b === 0) {
    logger.warn('Division by zero attempted', { a, b });
    return null;
  }
  return a / b;
}
```

## Phase Implementation

### Phase 1 (MVP)
- Basic logging utilities
- Simple validation helpers
- Date/time formatting
- String manipulation basics

### Phase 2 (Expansion)
- Advanced error handling utilities
- Comprehensive validation library
- Financial calculation utilities
- Performance monitoring utilities

### Phase 3 (AI & Automation)
- AI-powered utility functions
- Automated optimization utilities
- Predictive analysis utilities
- Advanced crypto utilities

### Phase 4 (Protocol)
- Compliance validation utilities
- Regulatory reporting utilities
- Audit trail utilities
- Protocol-specific utilities

## Adding New Utilities

### Steps to Add a New Utility
1. **Identify Need**: Determine what functionality is needed
2. **Create File**: Create new utility file in `src/utils/`
3. **Implement Function**: Write pure, typed utility functions
4. **Add Tests**: Create comprehensive unit tests
5. **Export**: Add exports to utility index (if creating new module)
6. **Document**: Update this README with new utility information
7. **Use**: Implement usage in relevant parts of application

### Example: Adding a Formatter Utility
```typescript
// src/utils/formatters.ts
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatLargeNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}
```

## Best Practices

### 1. Keep Utilities Small
Utilities should be focused and small. If a utility grows too large, consider splitting it.

### 2. Avoid Dependencies
Utilities should have minimal dependencies. Avoid importing large libraries for small tasks.

### 3. Document Exceptions
Document any exceptions or edge cases in utility functions.

### 4. Performance First
Optimize utilities for performance, especially those used frequently.

### 5. Test Thoroughly
Utilities should have near-100% test coverage since they're used throughout the application.

### 6. Consistent Naming
Use consistent naming conventions for utility functions.

### 7. Avoid Global State
Utilities should not maintain global state unless absolutely necessary.

## Common Utility Patterns

### Factory Functions
```typescript
export function createValidator(rules: ValidationRule[]) {
  return (data: any) => {
    // Validation logic
  };
}
```

### Composition
```typescript
export function compose<T>(...functions: Function[]): (x: T) => T {
  return (x: T) => functions.reduceRight((acc, fn) => fn(acc), x);
}
```

### Memoization
```typescript
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}
```

## Related Directories

- `src/types/`: Type definitions used by utilities
- `src/config/`: Configuration used by utilities
- `tests/utils/`: Unit tests for utilities
- `src/middleware/`: Middleware that uses utilities

## Testing Utilities

Utilities should be tested in isolation:

```typescript
// tests/utils/logger.test.ts
import { logger } from '../../src/utils/logger';

describe('Logger', () => {
  it('should log messages at appropriate levels', () => {
    // Test logging functionality
  });
  
  it('should format logs correctly for environment', () => {
    // Test formatting based on NODE_ENV
  });
});
```

## Performance Considerations

- **Memory Usage**: Utilities should be memory-efficient
- **Execution Time**: Critical utilities should be optimized for speed
- **Bundle Size**: Keep utility dependencies minimal
- **Caching**: Consider caching for expensive operations