# Health Module

This module provides health check and monitoring endpoints for the Arbellar Backend application.

## Overview

Health checks are essential for:
- **Container orchestration** (Kubernetes, Docker Swarm) liveness and readiness probes
- **Load balancers** determining service availability
- **Monitoring systems** tracking service health and performance
- **Debugging** identifying service dependencies and issues
- **Observability** providing insights into system state

## Health Check Endpoints

### 1. Basic Health Check (`GET /health`)
**Purpose**: Simple liveness probe for container orchestration.

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "service": "arbellar-backend",
  "version": "1.0.0",
  "environment": "development",
  "uptime": 3600
}
```

**Use Cases**:
- Kubernetes liveness probes
- Simple service availability checks
- Quick status verification

### 2. Readiness Check (`GET /health/ready`)
**Purpose**: Comprehensive readiness check for startup probes and dependency validation.

**Response**:
```json
{
  "status": "ready",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "checks": {
    "database": {
      "status": "connected",
      "latency": 15
    },
    "redis": {
      "status": "connected",
      "latency": 5
    }
  },
  "duration": 25
}
```

**Use Cases**:
- Kubernetes readiness probes
- Service startup validation
- Dependency health verification

### 3. Detailed Health Check (`GET /health/detailed`)
**Purpose**: Detailed system metrics and performance information.

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "application": { /* ... */ },
  "system": { /* ... */ },
  "process": { /* ... */ },
  "config": { /* ... */ },
  "performance": { /* ... */ }
}
```

**Use Cases**:
- Performance monitoring
- System diagnostics
- Capacity planning
- Debugging complex issues

### 4. Dependency Health Check (`GET /health/dependencies`)
**Purpose**: Individual dependency status and configuration.

**Response**:
```json
{
  "status": "success",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "dependencies": {
    "database": { /* ... */ },
    "redis": { /* ... */ },
    "stellar": { /* ... */ },
    "market_data": { /* ... */ }
  }
}
```

**Use Cases**:
- Dependency debugging
- Configuration verification
- External service monitoring
- Network connectivity testing

### 5. Metrics Endpoint (`GET /health/metrics`)
**Purpose**: Application metrics for monitoring systems (Phase 3).

**Response**:
```json
{
  "status": "metrics_not_implemented",
  "message": "Metrics endpoint will be implemented in Phase 3",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Use Cases**:
- Prometheus metrics scraping
- Performance monitoring
- Business metrics collection

### 6. Info Endpoint (`GET /health/info`)
**Purpose**: Basic application information and metadata.

**Response**:
```json
{
  "name": "Arbellar Backend",
  "description": "Automated User-Funded Atomic Arbitrage Platform on Stellar",
  "version": "1.0.0",
  "environment": "development",
  "repository": "https://github.com/arbellar/arbellar-backend",
  "documentation": "https://docs.arbellar.com",
  "phase": "1 (MVP)",
  "features": [ /* ... */ ],
  "roadmap": { /* ... */ }
}
```

**Use Cases**:
- Service discovery
- Version verification
- Documentation links
- Feature awareness

## Health Check Logic

### Basic Health Check
- **Response Time**: Should be < 100ms
- **Logic**: Simple application state verification
- **Dependencies**: None (should work even if dependencies are down)
- **HTTP Codes**: 200 (healthy), 500 (unhealthy)

### Readiness Check
- **Response Time**: Should be < 5 seconds (configurable)
- **Logic**: Checks all required dependencies
- **Dependencies**: Database, Redis, external APIs
- **HTTP Codes**: 200 (ready), 503 (not ready)

### Detailed Health Check
- **Response Time**: May be slower due to metrics collection
- **Logic**: Comprehensive system inspection
- **Dependencies**: Minimal (should not depend on external services)
- **HTTP Codes**: 200 (success), 500 (error)

## Phase Implementation

### Phase 1 (MVP)
- Basic health check endpoint
- Readiness check with database connectivity
- Info endpoint with application metadata
- Simple dependency reporting
- Error handling and logging

### Phase 2 (Expansion)
- Redis connectivity check
- Stellar Horizon API check
- Soroban RPC check
- External market data API checks
- Performance metrics collection
- Custom health check configuration

### Phase 3 (AI & Automation)
- AI-powered health analysis
- Predictive health monitoring
- Automated remediation suggestions
- Advanced performance metrics
- Machine learning anomaly detection

### Phase 4 (Protocol)
- Compliance health checks
- Regulatory requirement validation
- Protocol-specific health metrics
- Governance health monitoring
- Treasury health verification

## Configuration

### Environment Variables
```bash
# Health check timeouts
HEALTH_CHECK_TIMEOUT=5000           # Basic health check timeout (ms)
READINESS_CHECK_TIMEOUT=10000       # Readiness check timeout (ms)

# Dependency check intervals
HEALTH_CHECK_INTERVAL=30000         # How often to run background checks (ms)

# Feature flags
ENABLE_DETAILED_HEALTH=true         # Enable detailed health endpoint
ENABLE_METRICS_ENDPOINT=false       # Enable metrics endpoint (Phase 3)
```

### Health Check Configuration
Health checks can be configured through the application configuration:
```typescript
// In config/index.ts
export const healthConfig = {
  timeout: 5000,
  readinessTimeout: 10000,
  checks: {
    database: true,
    redis: true,
    stellar: true,
    marketData: true,
  },
};
```

## Integration with Container Orchestration

### Kubernetes Configuration
```yaml
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
      - name: arbellar-backend
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 1
```

### Docker Compose Configuration
```yaml
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## Monitoring Integration

### Prometheus (Phase 3)
```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'arbellar-backend'
    static_configs:
      - targets: ['arbellar-backend:3001']
    metrics_path: '/health/metrics'
    scrape_interval: 15s
```

### Grafana Dashboards (Phase 3)
Pre-built dashboards for:
- Service health status
- Response times
- Error rates
- Dependency health
- System metrics

## Best Practices

### 1. Keep Basic Checks Simple
- Should not depend on external services
- Should respond quickly (< 100ms)
- Should verify core application functionality

### 2. Comprehensive Readiness Checks
- Check all required dependencies
- Include latency measurements
- Provide detailed status information
- Handle partial failures gracefully

### 3. Secure Health Endpoints
- Consider authentication for detailed endpoints
- Don't expose sensitive information
- Rate limit health endpoints
- Monitor health endpoint access

### 4. Meaningful Status Codes
- 200: Healthy/Ready
- 503: Not Ready/Unhealthy
- 500: Internal Error
- 429: Rate Limited (if applicable)

### 5. Include Timestamps
All health responses should include ISO 8601 timestamps for correlation.

### 6. Log Health Check Activity
- Log health check requests
- Track check durations
- Monitor failure patterns
- Alert on repeated failures

### 7. Cache Where Appropriate
- Cache dependency check results
- Consider TTL for expensive checks
- Invalidate cache on configuration changes

## Adding New Health Checks

### Steps to Add a New Health Check
1. **Identify Dependency**: Determine what needs to be checked
2. **Create Check Function**: Implement check logic
3. **Add to Configuration**: Update health check configuration
4. **Integrate with Endpoints**: Add to appropriate health endpoints
5. **Add Tests**: Create unit and integration tests
6. **Update Documentation**: Update this README
7. **Monitor**: Set up monitoring and alerts

### Example: Adding Redis Health Check
```typescript
// 1. Create check function
async function checkRedisConnection(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  try {
    const client = redis.createClient({ url: config.redis.url });
    await client.connect();
    const pingResult = await client.ping();
    await client.quit();
    
    return {
      status: pingResult === 'PONG' ? 'connected' : 'error',
      latency: Date.now() - startTime,
      details: { response: pingResult },
    };
  } catch (error) {
    return {
      status: 'disconnected',
      latency: Date.now() - startTime,
      error: error.message,
    };
  }
}

// 2. Add to readiness check
checks.redis = await checkRedisConnection();
```

## Troubleshooting

### Common Issues

**Health Check Timeouts**
```bash
# Check network connectivity
curl -v http://localhost:3001/health
curl -v http://localhost:3001/health/ready

# Check individual dependencies
mongosh --eval "db.adminCommand('ping')"
redis-cli ping
```

**Readiness Check Failures**
1. Check database connection
2. Verify Redis connectivity (if enabled)
3. Check external API endpoints
4. Review application logs
5. Check resource constraints (memory, CPU)

**High Response Times**
1. Monitor system resources
2. Check for database query performance
3. Review external API response times
4. Consider implementing caching
5. Optimize health check logic

### Debugging Commands
```bash
# Basic health check
curl http://localhost:3001/health

# Readiness check with timing
time curl http://localhost:3001/health/ready

# Detailed health information
curl http://localhost:3001/health/detailed | jq .

# Dependency status
curl http://localhost:3001/health/dependencies | jq .
```

## Security Considerations

### Information Disclosure
- Don't expose sensitive configuration
- Sanitize error messages
- Consider authentication for detailed endpoints
- Log health check access

### Denial of Service
- Rate limit health endpoints
- Implement request timeouts
- Monitor health check frequency
- Consider caching strategies

### Authentication
For production environments, consider:
- API key authentication for health endpoints
- IP whitelisting for health checks
- JWT authentication for detailed endpoints
- Role-based access control

## Related Modules

- `src/config/`: Health check configuration
- `src/utils/logger.ts`: Health check logging
- `src/middleware/`: Error handling for health endpoints
- `src/config/database.ts`: Database health checks
- `src/integrations/`: External service health checks

## Performance Considerations

### Response Time Targets
- Basic health: < 100ms
- Readiness check: < 5 seconds
- Detailed health: < 10 seconds
- Dependency check: < 30 seconds (with timeouts)

### Caching Strategy
- Cache external dependency checks
- TTL: 30 seconds for most checks
- Invalidate on configuration changes
- Consider stale-while-revalidate pattern

### Resource Usage
- Health checks should be lightweight
- Avoid expensive operations in basic checks
- Monitor health check resource consumption
- Consider dedicated health check instances for large deployments