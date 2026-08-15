# Configuration

This directory contains configuration management for the Arbellar Backend application.

## Overview

The configuration system provides centralized, typed access to environment variables and application settings. It validates required environment variables, provides sensible defaults, and ensures type safety throughout the application.

## Configuration Structure

### Core Configuration Categories

1. **Server Configuration** (`server`)
   - Environment (development, production, test)
   - Port number
   - Environment flags

2. **API Configuration** (`api`)
   - API prefix (e.g., `/api/v1`)
   - Version information
   - Rate limiting settings

3. **Database Configuration** (`database`)
   - MongoDB connection URI
   - Connection pool settings
   - Database options

4. **CORS Configuration** (`cors`)
   - Allowed origins
   - CORS options

5. **Stellar Configuration** (`stellar`)
   - Network (testnet/mainnet)
   - Horizon API URL
   - RPC endpoints
   - Soroban RPC URL

6. **Market Configuration** (`market`)
   - SDEX API endpoints
   - Soroswap API and GraphQL endpoints

7. **Redis Configuration** (`redis`)
   - Redis connection URL
   - Cache TTL settings
   - Enabled/disabled flag

8. **Scanner Configuration** (`scanner`)
   - Scanning interval
   - Minimum spread threshold
   - Maximum slippage guard

9. **Risk Configuration** (`risk`)
   - Default trade size limits
   - Default maximum slippage

10. **Fees Configuration** (`fees`)
    - Platform fee percentage
    - User profit percentage

11. **Logging Configuration** (`logging`)
    - Log level
    - Log format

12. **Security Configuration** (`security`)
    - JWT secret
    - JWT expiration

13. **Health Configuration** (`health`)
    - Health check timeouts
    - Readiness check settings

## Environment Variables

### Required Variables
The following environment variables are required:

```bash
NODE_ENV=development          # Application environment
PORT=3001                     # Server port
MONGODB_URI=mongodb://...    # MongoDB connection string
API_PREFIX=/api/v1           # API prefix
CORS_ORIGIN=http://localhost:3000  # Allowed CORS origin
STELLAR_NETWORK=testnet      # Stellar network
STELLAR_HORIZON_URL=https://...  # Stellar Horizon URL
```

### Optional Variables with Defaults
```bash
# Server
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Database
MONGODB_MAX_POOL_SIZE=10

# Stellar
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
STELLAR_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Market Data
SDEX_API_URL=https://horizon.stellar.org
SOROSWAP_API_URL=https://api.soroswap.finance
SOROSWAP_GRAPHQL_URL=https://api.thegraph.com/subgraphs/name/soroswap

# Redis (Optional)
REDIS_URL=redis://localhost:6379
REDIS_CACHE_TTL=300

# Scanner
SCANNER_INTERVAL_MS=1000
MIN_SPREAD_THRESHOLD=0.5
MAX_SLIPPAGE_GUARD=0.3

# Risk
DEFAULT_TRADE_SIZE_LIMIT=1000
DEFAULT_MAX_SLIPPAGE=0.5

# Fees
PLATFORM_FEE_PERCENTAGE=20
USER_PROFIT_PERCENTAGE=80

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Security
JWT_SECRET=change_this_in_production
JWT_EXPIRES_IN=24h

# Health Checks
HEALTH_CHECK_TIMEOUT=5000
READINESS_CHECK_TIMEOUT=10000
```

## Usage

### Importing Configuration
```typescript
import { config } from './config';

// Access configuration
const port = config.server.port;
const mongoUri = config.database.uri;
const apiPrefix = config.api.prefix;
```

### Type Safety
The configuration is fully typed:
```typescript
import { Config, ServerConfig } from './config';

function setupServer(config: ServerConfig) {
  // Type-safe access to server configuration
}
```

### Environment Validation
The configuration module validates required environment variables at startup:
```typescript
// Throws error if required variables are missing
import './config';
```

## Configuration Files

### `index.ts`
Main configuration module that:
- Loads environment variables
- Validates required variables
- Provides typed configuration objects
- Exports default values

### `database.ts` (to be implemented in Phase 2)
Database-specific configuration and connection management.

### `redis.ts` (to be implemented in Phase 2)
Redis configuration and client management.

### `stellar.ts` (to be implemented in Phase 2)
Stellar SDK configuration and initialization.

## Phase Implementation

### Phase 1 (MVP)
- Basic environment variable validation
- Type-safe configuration objects
- Sensible defaults for optional variables
- Core configuration categories

### Phase 2 (Expansion)
- Advanced validation with Joi
- Configuration schema definitions
- Environment-specific configuration files
- Secret management integration
- Configuration reloading

### Phase 3 (AI & Automation)
- Dynamic configuration based on AI analysis
- Automated configuration optimization
- Predictive configuration adjustments
- Configuration change tracking

### Phase 4 (Protocol)
- Compliance configuration validation
- Regulatory requirement configuration
- Multi-environment configuration management
- Advanced secret management

## Best Practices

### 1. Never Hardcode Values
```typescript
// BAD
const port = 3001;

// GOOD
const port = config.server.port;
```

### 2. Use Type Safety
```typescript
// Access with type safety
const stellarConfig: StellarConfig = config.stellar;
```

### 3. Validate Early
```typescript
// Configuration validation happens at module import
import './config'; // Validates environment variables
```

### 4. Provide Sensible Defaults
```typescript
// Provide defaults for optional variables
const cacheTtl = parseInt(process.env.REDIS_CACHE_TTL || '300', 10);
```

### 5. Keep Secrets Secure
```typescript
// Secrets should only come from environment variables
const jwtSecret = process.env.JWT_SECRET;
```

## Environment-Specific Configuration

### Development
```bash
NODE_ENV=development
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
```

### Production
```bash
NODE_ENV=production
LOG_LEVEL=warn
CORS_ORIGIN=https://app.arbellar.com
```

### Test
```bash
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/arbellar-test
```

## Testing Configuration

### Unit Tests
```typescript
// Mock configuration for tests
jest.mock('./config', () => ({
  config: {
    server: { env: 'test', port: 3001 },
    database: { uri: 'mongodb://localhost:27017/arbellar-test' },
    // ... other mocked config
  },
}));
```

### Integration Tests
```typescript
// Use test environment variables
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/arbellar-test';

// Re-import configuration
import { config } from './config';
```

## Security Considerations

### 1. Secret Management
- Never commit secrets to version control
- Use environment variables for secrets
- Consider using secret management services (Phase 3+)

### 2. Configuration Validation
- Validate all configuration values
- Sanitize input values
- Check for configuration errors

### 3. Access Control
- Limit configuration access based on environment
- Use different configurations for different environments
- Implement configuration encryption for sensitive data (Phase 3+)

## Adding New Configuration

### Steps to Add New Configuration
1. **Define Environment Variable**: Add to `.env.example`
2. **Add to Configuration Module**: Update `index.ts`
3. **Add Type Definitions**: Update type exports
4. **Add Validation**: Add to required or optional validation
5. **Update Documentation**: Update this README
6. **Test**: Verify configuration works in all environments

### Example: Adding Redis Configuration
```typescript
// 1. Add to .env.example
REDIS_URL=redis://localhost:6379

// 2. Add to index.ts
export const redisConfig = {
  url: process.env.REDIS_URL,
  enabled: !!process.env.REDIS_URL,
};

// 3. Add to consolidated config
export const config = {
  // ... existing config
  redis: redisConfig,
};

// 4. Add type export
export type RedisConfig = typeof redisConfig;
```

## Troubleshooting

### Common Issues

**Missing Environment Variables**
```bash
Error: Missing required environment variable: MONGODB_URI
```
Solution: Ensure all required variables are set in `.env` file or environment.

**Type Errors**
```typescript
Property 'newConfig' does not exist on type 'Config'
```
Solution: Update TypeScript type definitions when adding new configuration.

**Configuration Not Loading**
```typescript
console.log(process.env.PORT); // undefined
```
Solution: Ensure `.env` file is in root directory or environment variables are set.

### Debugging
```typescript
// Log configuration (be careful with secrets)
console.log({
  env: config.server.env,
  port: config.server.port,
  apiPrefix: config.api.prefix,
});

// Check environment variables
console.log('Environment variables:', Object.keys(process.env));
```

## Related Files

- `.env.example`: Template for environment variables
- `package.json`: Scripts and dependencies
- `src/server.ts`: Server startup using configuration
- `src/app.ts`: Application setup using configuration