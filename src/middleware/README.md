# Middleware

## Overview
This directory contains Express middleware functions that handle cross-cutting concerns such as authentication, validation, error handling, logging, and security.

## Available Middleware

### Error Handling Middleware (`errorHandler.ts`)
Centralized error handling for the application.

**Features**:
- Catches all errors in Express pipeline
- Formats errors into consistent JSON responses
- Logs errors with appropriate severity
- Handles operational vs programming errors
- Development vs production error responses

**Custom Error Classes**:
- `OperationalError` - Base class for expected errors
- `ValidationError` - Request validation failures
- `AuthenticationError` - Authentication failures
- `AuthorizationError` - Permission denied
- `NotFoundError` - Resource not found
- `ConflictError` - Resource conflicts
- `RateLimitError` - Rate limit exceeded
- `ExternalServiceError` - Third-party service failures
- `BlockchainError` - Stellar/blockchain errors
- `MarketDataError` - Market data retrieval failures
- `ExecutionError` - Trade execution failures
- `DatabaseError` - Database operation failures

**Usage**:
```typescript
import { errorHandler, asyncHandler, ValidationError } from './middleware';

// Use asyncHandler for async route handlers
router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);
  if (!user) {
    throw new NotFoundError('User');
  }
  res.json({ success: true, data: user });
}));

// Error handler should be last middleware
app.use(errorHandler);
```

## Planned Middleware (Future Phases)

### Authentication Middleware (Phase 1)
Validates JWT tokens and authenticates requests.

```typescript
// Future implementation
import { authenticate } from './middleware';

router.get('/protected', authenticate, (req, res) => {
  // req.user is populated by authenticate middleware
  res.json({ user: req.user });
});
```

### Authorization Middleware (Phase 1)
Checks user permissions and roles.

```typescript
// Future implementation
import { authorize } from './middleware';

router.delete('/admin/users/:id', 
  authenticate, 
  authorize(['admin']), 
  deleteUser
);
```

### Validation Middleware (Phase 1)
Validates request data against schemas.

```typescript
// Future implementation
import { validate } from './middleware';
import { createUserSchema } from './schemas';

router.post('/users', 
  validate(createUserSchema), 
  createUser
);
```

### Rate Limiting Middleware (Phase 2)
Protects against abuse and DDoS attacks.

```typescript
// Future implementation
import { rateLimit } from './middleware';

router.post('/login', 
  rateLimit({ windowMs: 60000, max: 5 }), 
  login
);
```

### Request Logging Middleware (Phase 2)
Logs all API requests for monitoring and debugging.

```typescript
// Future implementation
import { requestLogger } from './middleware';

app.use(requestLogger);
```

### CORS Middleware
Already implemented via `cors` package in app.ts.

### Helmet Middleware
Already implemented for security headers in app.ts.

## Middleware Patterns

### Middleware Composition
```typescript
// Combine multiple middleware
const protectedRoute = [
  authenticate,
  authorize(['user', 'admin']),
  rateLimit({ max: 100 }),
];

router.get('/dashboard', ...protectedRoute, getDashboard);
```

### Conditional Middleware
```typescript
// Apply middleware conditionally
const conditionalAuth = (req, res, next) => {
  if (req.path.startsWith('/public')) {
    return next();
  }
  return authenticate(req, res, next);
};
```

### Parameterized Middleware
```typescript
// Middleware factory pattern
const requireRole = (role: string) => {
  return (req, res, next) => {
    if (req.user.role === role) {
      return next();
    }
    throw new AuthorizationError('Insufficient permissions');
  };
};
```

## Best Practices

### 1. Always Call next()
```typescript
// Good
const myMiddleware = (req, res, next) => {
  // Do something
  next();
};

// Bad - Request hangs
const myMiddleware = (req, res, next) => {
  // Do something
  // Forgot to call next()
};
```

### 2. Handle Errors Properly
```typescript
// Good
const myMiddleware = (req, res, next) => {
  try {
    // Operation
    next();
  } catch (error) {
    next(error); // Pass error to error handler
  }
};

// For async middleware
const myAsyncMiddleware = asyncHandler(async (req, res, next) => {
  // Async operation
  await doSomething();
  next();
});
```

### 3. Keep Middleware Focused
Each middleware should have a single responsibility.

```typescript
// Good - Single responsibility
const authenticateMiddleware = (req, res, next) => {
  // Only handles authentication
};

const authorizeMiddleware = (req, res, next) => {
  // Only handles authorization
};

// Bad - Multiple responsibilities
const authMiddleware = (req, res, next) => {
  // Handles both authentication and authorization
};
```

### 4. Order Matters
```typescript
app.use(helmet()); // Security headers first
app.use(cors()); // CORS next
app.use(express.json()); // Body parsing
app.use(requestLogger); // Request logging
app.use('/api', apiRoutes); // Routes
app.use(notFoundHandler); // 404 handler
app.use(errorHandler); // Error handler last
```

### 5. Type Safety
```typescript
import { Request, Response, NextFunction } from 'express';

// Good - Typed middleware
const myMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // TypeScript knows the types
};

// Better - Custom types
interface AuthRequest extends Request {
  user?: User;
}

const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  req.user = decodedUser;
  next();
};
```

## Testing Middleware

### Unit Testing
```typescript
import { describe, it, expect, vi } from 'vitest';
import { errorHandler } from './errorHandler';

describe('errorHandler', () => {
  it('should format error response correctly', () => {
    const error = new ValidationError('Invalid input');
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;
    const next = vi.fn();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
      },
    });
  });
});
```

### Integration Testing
```typescript
import request from 'supertest';
import { app } from '../app';

describe('Authentication Middleware', () => {
  it('should reject requests without token', async () => {
    const response = await request(app)
      .get('/api/v1/protected')
      .expect(401);

    expect(response.body.error.code).toBe('AUTHENTICATION_ERROR');
  });

  it('should accept valid tokens', async () => {
    const token = generateValidToken();
    
    const response = await request(app)
      .get('/api/v1/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
```

## Phase Implementation

### Phase 1 (MVP)
- Error handling middleware ✓
- Basic authentication middleware
- Request validation middleware
- Simple rate limiting

### Phase 2 (Expansion)
- Advanced authorization (RBAC)
- Comprehensive rate limiting
- Request logging and correlation
- API versioning middleware
- Cache control middleware

### Phase 3 (AI & Automation)
- AI-powered request analysis
- Intelligent rate limiting
- Predictive caching
- Automated threat detection

### Phase 4 (Protocol)
- Governance authorization
- Compliance middleware
- Audit logging middleware
- Advanced security middleware

## Related Directories
- `src/routes/`: Route definitions that use middleware
- `src/controllers/`: Controllers called after middleware
- `src/utils/`: Utility functions used by middleware
- `tests/middleware/`: Middleware tests