# Routes

This directory contains the API route definitions for the Arbellar Backend application.

## Overview

Routes define the HTTP endpoints that the Arbellar API exposes. They serve as the entry points for client applications (frontend, mobile apps, external services) to interact with the backend.

## Route Architecture

### Structure
```
src/routes/
├── index.ts              # Main router that imports all domain routers
├── users/               # User-related routes (Phase 1)
├── wallets/             # Wallet-related routes (Phase 1)
├── vaults/              # Vault-related routes (Phase 1)
├── markets/             # Market data routes (Phase 1)
├── arbitrage/           # Arbitrage opportunity routes (Phase 1)
├── executions/          # Execution coordination routes (Phase 1)
├── trades/              # Trade history routes (Phase 1)
├── analytics/           # Analytics routes (Phase 1)
├── risk/                # Risk management routes (Phase 1)
├── fees/                # Fee tracking routes (Phase 1)
└── notifications/       # Notification routes (Phase 1)
```

### API Versioning
All routes are prefixed with `/api/v1/` as defined in the configuration:
```typescript
// From config/index.ts
export const apiConfig = {
  prefix: process.env.API_PREFIX || '/api/v1',
  version: '1.0.0',
};
```

## Route Categories

### 1. Health Routes (`/api/v1/health`)
- **Purpose**: Service health monitoring and orchestration
- **Authentication**: None required
- **Phase**: MVP (Phase 1)

**Endpoints**:
- `GET /health` - Basic health check
- `GET /health/ready` - Readiness check with dependencies
- `GET /health/detailed` - Detailed system metrics
- `GET /health/dependencies` - Dependency status
- `GET /health/info` - Application information

### 2. User Routes (`/api/v1/users`) - Phase 1
- **Purpose**: User management and authentication
- **Authentication**: Required (except registration/login)
- **Phase**: MVP (Phase 1)

**Planned Endpoints**:
- `POST /users/register` - User registration
- `POST /users/login` - User authentication
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/preferences` - Get user preferences
- `PUT /users/preferences` - Update user preferences

### 3. Wallet Routes (`/api/v1/wallets`) - Phase 1
- **Purpose**: Wallet association and management
- **Authentication**: Required
- **Phase**: MVP (Phase 1)

**Planned Endpoints**:
- `POST /wallets/associate` - Associate Stellar wallet
- `GET /wallets` - Get user wallets
- `GET /wallets/:address` - Get specific wallet
- `DELETE /wallets/:address` - Remove wallet association
- `GET /wallets/:address/balance` - Get wallet balance

### 4. Vault Routes (`/api/v1/vaults`) - Phase 1
- **Purpose**: Smart vault information and management
- **Authentication**: Required
- **Phase**: MVP (Phase 1)

**Planned Endpoints**:
- `GET /vaults` - Get user vaults
- `GET /vaults/:id` - Get specific vault
- `POST /vaults` - Create new vault
- `GET /vaults/:id/balance` - Get vault balance
- `GET /vaults/:id/activity` - Get vault activity
- `POST /vaults/:id/deposit` - Initiate deposit
- `POST /vaults/:id/withdraw` - Initiate withdrawal

### 5. Market Routes (`/api/v1/markets`) - Phase 1
- **Purpose**: Market data and intelligence
- **Authentication**: Optional (public data available)
- **Phase**: MVP (Phase 1)

**Planned Endpoints**:
- `GET /markets/assets` - Get available assets
- `GET /markets/pairs` - Get trading pairs
- `GET /markets/:pair/price` - Get current price
- `GET /markets/:pair/orderbook` - Get order book
- `GET /markets/:pair/history` - Get price history
- `GET /markets/liquidity/:asset` - Get liquidity information

### 6. Arbitrage Routes (`/api/v1/arbitrage`) - Phase 1
- **Purpose**: Arbitrage opportunity discovery and analysis
- **Authentication**: Required
- **Phase**: MVP (Phase 1)

**Planned Endpoints**:
- `GET /arbitrage/opportunities` - Get current opportunities
- `GET /arbitrage/opportunities/:id` - Get specific opportunity
- `POST /arbitrage/scan` - Trigger manual scan
- `GET /arbitrage/config` - Get scanner configuration
- `PUT /arbitrage/config` - Update scanner configuration
- `GET /arbitrage/stats` - Get scanner statistics

### 7. Execution Routes (`/api/v1/executions`) - Phase 1
- **Purpose**: Trade execution coordination
- **Authentication**: Required
- **Phase**: MVP (Phase 1)

**Planned Endpoints**:
- `POST /executions` - Submit execution request
- `GET /executions/:id` - Get execution status
- `GET /executions` - Get execution history
- `POST /executions/:id/cancel` - Cancel execution
- `GET /executions/stats` - Get execution statistics

### 8. Trade Routes (`/api/v1/trades`) - Phase 1
- **Purpose**: Trade history and management
- **Authentication**: Required
- **Phase**: MVP (Phase 1)

**Planned Endpoints**:
- `GET /trades` - Get trade history
- `GET /trades/:id` - Get specific trade
- `GET /trades/stats` - Get trade statistics
- `GET /trades/export` - Export trade history
- `GET /trades/summary` - Get trade summary

### 9. Analytics Routes (`/api/v1/analytics`) - Phase 1
- **Purpose**: Performance analytics and reporting
- **Authentication**: Required
- **Phase**: MVP (Phase 1)

**Planned Endpoints**:
- `GET /analytics/performance` - Get performance metrics
- `GET /analytics/profit` - Get profit analytics
- `GET /analytics/risk` - Get risk analytics
- `GET /analytics/reports` - Get analytics reports
- `POST /analytics/custom` - Create custom analytics query

### 10. Risk Routes (`/api/v1/risk`) - Phase 1
- **Purpose**: Risk management and configuration
- **Authentication**: Required
- **Phase**: MVP (Phase 1)

**Planned Endpoints**:
- `GET /risk/profile` - Get user risk profile
- `PUT /risk/profile` - Update risk profile
- `GET /risk/limits` - Get risk limits
- `PUT /risk/limits` - Update risk limits
- `GET /risk/alerts` - Get risk alerts
- `POST /risk/alerts/acknowledge` - Acknowledge risk alert

### 11. Fees Routes (`/api/v1/fees`) - Phase 1
- **Purpose**: Fee tracking and distribution
- **Authentication**: Required
- **Phase**: MVP (Phase 1)

**Planned Endpoints**:
- `GET /fees` - Get fee history
- `GET /fees/summary` - Get fee summary
- `GET /fees/distribution` - Get fee distribution
- `GET /fees/settings` - Get fee settings
- `PUT /fees/settings` - Update fee settings

### 12. Notification Routes (`/api/v1/notifications`) - Phase 1
- **Purpose**: Event notification and alerts
- **Authentication**: Required
- **Phase**: MVP (Phase 1)

**Planned Endpoints**:
- `GET /notifications` - Get notifications
- `GET /notifications/unread` - Get unread notifications
- `PUT /notifications/:id/read` - Mark as read
- `PUT /notifications/read-all` - Mark all as read
- `GET /notifications/settings` - Get notification settings
- `PUT /notifications/settings` - Update notification settings

## Route Design Patterns

### 1. RESTful Design
```typescript
// Resource-based routing
GET    /resource          // List resources
POST   /resource          // Create resource
GET    /resource/:id      // Get specific resource
PUT    /resource/:id      // Update resource
DELETE /resource/:id      // Delete resource

// Sub-resources
GET    /resource/:id/subresource  // List sub-resources
POST   /resource/:id/subresource  // Create sub-resource
```

### 2. Action-Oriented Routes
```typescript
// For operations that don't fit CRUD
POST   /resource/:id/action      // Perform action
POST   /resource/bulk-action     // Bulk operations
```

### 3. Query Parameters
```typescript
// Filtering
GET /resource?status=active&type=premium

// Pagination
GET /resource?page=1&limit=20

// Sorting
GET /resource?sort=createdAt&order=desc

// Date ranges
GET /resource?from=2024-01-01&to=2024-01-31
```

## Route Implementation

### Basic Route Structure
```typescript
import { Router } from 'express';
import { asyncHandler } from '../middleware';
import { UserController } from '../modules/users/user.controller';

const router = Router();
const userController = new UserController();

// Public routes
router.post('/register', asyncHandler(userController.register));
router.post('/login', asyncHandler(userController.login));

// Protected routes (with authentication middleware)
router.get('/profile', authenticate, asyncHandler(userController.getProfile));
router.put('/profile', authenticate, asyncHandler(userController.updateProfile));

export default router;
```

### Controller Integration
Routes delegate business logic to controllers:
```typescript
// Route handler
router.get('/:id', asyncHandler(userController.getUser));

// Controller method
class UserController {
  async getUser(req: Request, res: Response) {
    const userId = req.params.id;
    const user = await this.userService.getUserById(userId);
    res.json({ success: true, data: user });
  }
}
```

## Middleware Integration

### Authentication Middleware
```typescript
// Protected route
router.get('/profile', authenticate, userController.getProfile);

// Role-based access
router.get('/admin', authenticate, requireRole('admin'), adminController.getAdminData);
```

### Validation Middleware
```typescript
import { validateRequest } from '../middleware';
import { userSchema } from '../modules/users/user.validation';

// Request validation
router.post('/register', validateRequest(userSchema.register), userController.register);
```

### Rate Limiting Middleware
```typescript
import { rateLimit } from '../middleware';

// Rate limited route
router.post('/login', rateLimit('auth', 5, 60), userController.login);
```

## Error Handling

### Route-Level Error Handling
```typescript
// Using asyncHandler to catch async errors
router.get('/:id', asyncHandler(userController.getUser));

// Manual error handling
router.get('/:id', (req, res, next) => {
  try {
    // Route logic
  } catch (error) {
    next(error);
  }
});
```

### Error Responses
All routes should return consistent error responses:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found"
  }
}
```

## Phase Implementation

### Phase 1 (MVP)
- Basic route structure
- Health check endpoints
- Placeholder routes for all domains
- Basic error handling
- Route documentation
- API versioning

### Phase 2 (Expansion)
- Full RESTful implementations
- Advanced query parameters
- Bulk operations
- File upload endpoints
- WebSocket endpoints for real-time data
- GraphQL endpoint (optional)

### Phase 3 (AI & Automation)
- AI-powered route recommendations
- Dynamic route generation
- Predictive endpoint optimization
- Automated API documentation
- Intelligent rate limiting

### Phase 4 (Protocol)
- Governance endpoints
- Treasury management routes
- Protocol configuration endpoints
- Compliance reporting endpoints
- Audit trail endpoints

## Best Practices

### 1. Consistent Naming
- Use plural nouns for resources (`/users`, `/wallets`)
- Use kebab-case for multi-word resources (`/risk-profiles`)
- Use verbs for actions (`/users/:id/activate`)

### 2. Proper HTTP Methods
- GET: Retrieve resources
- POST: Create resources
- PUT: Update entire resources
- PATCH: Partial updates
- DELETE: Remove resources

### 3. Versioning Strategy
- URL versioning (`/api/v1/resource`)
- Header versioning (future consideration)
- Never break backward compatibility in same major version

### 4. Security Considerations
- Validate all inputs
- Sanitize output
- Use HTTPS in production
- Implement proper authentication
- Rate limit public endpoints

### 5. Performance
- Implement pagination for list endpoints
- Use caching where appropriate
- Minimize response payload size
- Consider compression for large responses

### 6. Documentation
- Document all endpoints
- Include example requests/responses
- Document error responses
- Keep OpenAPI specification updated

## Testing Routes

### Unit Tests
```typescript
describe('User Routes', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/v1/users/register')
      .send({ email: 'test@example.com', password: 'password123' });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

### Integration Tests
```typescript
describe('API Integration', () => {
  it('should complete user registration flow', async () => {
    // Test complete flow with database interaction
  });
});
```

## Monitoring and Logging

### Route Logging
```typescript
// Log all route access
app.use((req, res, next) => {
  logger.http('Route accessed', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });
  next();
});
```

### Performance Monitoring
- Monitor route response times
- Track error rates per endpoint
- Monitor usage patterns
- Alert on abnormal traffic

## Adding New Routes

### Steps to Add New Route
1. **Identify Domain**: Determine which module the route belongs to
2. **Create Controller**: Implement business logic in controller
3. **Define Route**: Add route definition in appropriate router
4. **Add Validation**: Create validation schema
5. **Add Tests**: Write unit and integration tests
6. **Update Documentation**: Update OpenAPI specification
7. **Monitor**: Set up monitoring and alerts

### Example: Adding User Search Route
```typescript
// 1. Add to user router
router.get('/search', authenticate, asyncHandler(userController.searchUsers));

// 2. Implement in controller
class UserController {
  async searchUsers(req: Request, res: Response) {
    const { query, page = 1, limit = 20 } = req.query;
    const users = await this.userService.searchUsers(query, page, limit);
    res.json({ success: true, data: users });
  }
}

// 3. Add validation
const searchSchema = {
  query: Joi.string().min(1).max(100),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
};
```

## Related Directories

- `src/controllers/`: Route controllers (future implementation)
- `src/middleware/`: Route middleware
- `src/modules/`: Domain modules with business logic
- `src/validation/`: Request validation schemas (future implementation)
- `tests/routes/`: Route tests