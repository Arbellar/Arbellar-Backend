# Architecture Documentation

## Overview

This document describes the architectural design and principles of the Arbellar Backend system. The architecture is designed to support a user-funded atomic arbitrage platform on Stellar with modularity, scalability, and maintainability as core principles.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Arbellar Frontend                        │
│              (Next.js + TypeScript)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API / WebSockets
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  Arbellar Backend                            │
│           (Node.js + Express + TypeScript)                   │
│                                                              │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────┐        │
│  │   API      │  │  Business   │  │ Background   │        │
│  │   Layer    │  │   Logic     │  │    Jobs      │        │
│  └────────────┘  └─────────────┘  └──────────────┘        │
│                                                              │
│  ┌──────────────────────────────────────────────┐          │
│  │           Domain Modules                      │          │
│  │  Users│Wallets│Vaults│Markets│Arbitrage      │          │
│  │  Execution│Trades│Analytics│Risk│Fees         │          │
│  └──────────────────────────────────────────────┘          │
│                                                              │
│  ┌──────────────────────────────────────────────┐          │
│  │         Integration Layer                     │          │
│  │  Stellar│SDEX│Soroswap│Soroban│RPC           │          │
│  └──────────────────────────────────────────────┘          │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │               │
        ▼              ▼               ▼
┌──────────────┐ ┌──────────┐  ┌─────────────────┐
│   MongoDB    │ │  Redis   │  │ Stellar Network │
│  (Database)  │ │ (Cache)  │  │  SDEX/Soroswap  │
└──────────────┘ └──────────┘  │    Soroban      │
                                └─────────────────┘
```

## Architectural Principles

### 1. Separation of Concerns
- **API Layer**: Handles HTTP requests, validation, and response formatting
- **Business Logic Layer**: Contains core domain logic and business rules
- **Data Access Layer**: Manages database interactions and persistence
- **Integration Layer**: Abstracts external service communication

### 2. Modularity
Each domain is organized as a self-contained module with:
- Controllers for request handling
- Services for business logic
- Repositories for data access
- Models for data structure
- Types for TypeScript definitions

### 3. Dependency Injection
Components depend on abstractions (interfaces) rather than concrete implementations, enabling:
- Easier testing with mocks
- Flexible component replacement
- Better maintainability

### 4. Event-Driven Architecture (Phase 2+)
- Modules communicate through events
- Loose coupling between components
- Asynchronous processing capabilities
- Scalability through message queues

### 5. Non-Custodial Design
- Backend never stores private keys
- Transactions are prepared but signed by users
- Smart contracts manage on-chain fund custody
- Backend coordinates but doesn't control funds

## Layer Architecture

### API Layer

**Responsibilities**:
- HTTP request/response handling
- Input validation
- Authentication and authorization
- Rate limiting
- Error formatting
- API versioning

**Components**:
- Express routes
- Middleware (auth, validation, error handling)
- Controllers (thin layer delegating to services)

**Design Pattern**: MVC (Model-View-Controller) with controllers as entry points

### Business Logic Layer

**Responsibilities**:
- Core arbitrage logic
- Market analysis
- Risk assessment
- Execution planning
- Performance calculation
- Business rule enforcement

**Components**:
- Domain services
- Business entities
- Calculation engines
- Strategy implementations

**Design Pattern**: Domain-Driven Design (DDD) with service-oriented architecture

### Data Access Layer

**Responsibilities**:
- Database queries and mutations
- Data persistence
- Transaction management
- Query optimization
- Data mapping

**Components**:
- Repositories
- MongoDB models (Mongoose)
- Query builders
- Data mappers

**Design Pattern**: Repository pattern with Active Record (Mongoose)

### Integration Layer

**Responsibilities**:
- External API communication
- Blockchain interaction
- Smart contract calls
- Data normalization
- Error handling for external services

**Components**:
- Integration clients
- API wrappers
- Protocol adapters
- Data transformers

**Design Pattern**: Adapter pattern and Facade pattern

## Domain Architecture

### Core Domains

#### User Domain
- User authentication and management
- Profile and preferences
- Security and sessions
- Account lifecycle

#### Wallet Domain
- Stellar wallet association
- Wallet verification
- Balance tracking
- Security validation

#### Vault Domain
- Smart vault management
- Fund tracking
- Performance monitoring
- Activity logging

#### Market Domain
- Market data aggregation
- Price tracking
- Liquidity analysis
- Multi-source intelligence

#### Arbitrage Domain
- Opportunity discovery
- Profitability analysis
- Spread calculation
- Risk evaluation

#### Execution Domain
- Transaction coordination
- Execution monitoring
- Status tracking
- Result processing

#### Analytics Domain
- Performance metrics
- Reporting and insights
- Historical analysis
- Data visualization support

#### Risk Domain
- Risk assessment
- Limit enforcement
- Alert generation
- Safety controls

## Data Architecture

### Database Design

**MongoDB Collections**:
```
users
  - Authentication and profiles
  - Preferences and settings
  - Security information

wallets
  - Wallet associations
  - Verification status
  - Balance cache

vaults
  - Vault metadata
  - Performance metrics
  - Activity logs

marketSnapshots
  - SDEX orderbook data
  - Soroswap liquidity data
  - Price history

arbitrageOpportunities
  - Discovered opportunities
  - Profitability analysis
  - Status tracking

executions
  - Execution records
  - Transaction hashes
  - Status and results

trades
  - Trade history
  - Profit/loss records
  - Fee information

analytics
  - Aggregated metrics
  - Performance data
  - Reports
```

**Indexing Strategy**:
- Primary indexes on frequently queried fields
- Compound indexes for common query patterns
- TTL indexes for time-based data expiration
- Text indexes for search functionality

### Caching Strategy

**Redis Usage** (Phase 2+):
- Market data caching (short TTL)
- User session storage
- Rate limiting counters
- Distributed locks
- Real-time data

**In-Memory Caching**:
- Configuration data
- Frequently accessed reference data
- Computed values with short validity

## Integration Architecture

### Stellar Integration

**Components**:
- Horizon API client for ledger data
- Soroban RPC client for smart contracts
- Transaction builder for operation construction
- Event streamer for real-time updates

**Data Flow**:
```
Backend → Horizon API → Stellar Ledger Data
Backend → Soroban RPC → Smart Contract State
Backend → Transaction → User Wallet → Stellar Network
```

### SDEX Integration

**Components**:
- Orderbook fetcher
- Market data normalizer
- Price aggregator
- Depth analyzer

**Data Flow**:
```
SDEX Orderbook → Backend Cache → Market Module
Price Updates → Real-time Stream → Frontend
```

### Soroswap Integration

**Components**:
- Pool data fetcher
- Liquidity analyzer
- Routing engine
- Swap calculator

**Data Flow**:
```
Soroswap Pools → Backend Analysis → Arbitrage Scanner
Liquidity Data → Cache → Opportunity Evaluation
```

## Security Architecture

### Authentication & Authorization

**Authentication**:
- JWT-based token authentication
- Refresh token rotation
- Session management
- Two-factor authentication (Phase 2)

**Authorization**:
- Role-based access control (RBAC)
- Resource-level permissions
- Vault ownership validation
- Operation authorization

### Data Security

**Encryption**:
- HTTPS/TLS for all communications
- At-rest encryption for sensitive data
- Secure key management
- No private key storage

**Input Validation**:
- Request validation middleware
- Schema-based validation (Joi)
- SQL/NoSQL injection prevention
- XSS protection

**Rate Limiting**:
- API endpoint rate limiting
- IP-based throttling
- User-based limits
- Adaptive rate limiting

## Scalability Architecture

### Horizontal Scaling

**Stateless Design**:
- No server-side session storage (use JWT)
- Shared cache (Redis) for state
- Database connection pooling
- Load balancer ready

**Database Scaling**:
- Read replicas for read-heavy operations
- Sharding strategy for large datasets
- Connection pooling
- Query optimization

### Vertical Scaling

**Performance Optimization**:
- Code profiling and optimization
- Database query optimization
- Caching strategies
- Async processing

### Microservices Consideration (Phase 3+)

**Potential Service Boundaries**:
- Market Data Service
- Arbitrage Scanner Service
- Execution Engine Service
- Analytics Service
- User Management Service

## Observability Architecture

### Logging

**Structured Logging**:
- JSON format for production
- Log levels (error, warn, info, debug)
- Context-rich log entries
- Log aggregation ready

**Log Categories**:
- Application logs
- Access logs
- Security logs
- Audit logs
- Performance logs

### Monitoring

**Metrics Collection**:
- Request rates and latency
- Error rates
- Database performance
- External API latency
- Business metrics (arbitrage opportunities, execution success rate)

**Alerting**:
- Error threshold alerts
- Performance degradation alerts
- Security event alerts
- Business metric alerts

### Tracing

**Distributed Tracing** (Phase 3):
- Request correlation IDs
- Cross-service tracing
- Performance bottleneck identification
- Dependency analysis

## Deployment Architecture

### Development Environment

```
Docker Compose:
  - Backend container
  - MongoDB container
  - Redis container
  - Mongo Express (DB GUI)
```

### Production Environment (Future)

```
Kubernetes Cluster:
  - Backend pods (replicas)
  - MongoDB (managed service or StatefulSet)
  - Redis (managed service or StatefulSet)
  - Load Balancer
  - Ingress Controller
```

### CI/CD Pipeline

```
GitHub Actions:
  - Code checkout
  - Dependency installation (pnpm)
  - Type checking
  - Linting
  - Unit tests
  - Integration tests
  - Build
  - Docker image creation
  - Deployment (production)
```

## API Architecture

### RESTful API Design

**Endpoint Structure**:
```
/api/v1/resource          - Collection operations
/api/v1/resource/:id      - Item operations
/api/v1/resource/:id/subresource - Nested resources
```

**HTTP Methods**:
- GET: Retrieve resources
- POST: Create resources
- PUT: Update resources
- PATCH: Partial updates
- DELETE: Remove resources

**Response Format**:
```json
{
  "success": true,
  "data": { /* resource data */ },
  "meta": { /* pagination, etc */ }
}
```

**Error Format**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": { /* additional context */ }
  }
}
```

### WebSocket Architecture (Phase 2+)

**Real-time Events**:
- Market data updates
- Arbitrage opportunities
- Execution status updates
- Notification delivery

**Connection Management**:
- Authentication via JWT
- Heartbeat/ping-pong
- Reconnection logic
- Event subscription management

## Phase-Based Architecture Evolution

### Phase 1 (MVP)
- Monolithic architecture
- RESTful API
- MongoDB persistence
- Basic Stellar integration
- Foundation for all domains

### Phase 2 (Expansion)
- Event-driven components
- Redis caching
- WebSocket support
- Background job processing
- Enhanced integrations

### Phase 3 (AI & Automation)
- AI service integration
- Advanced event processing
- Predictive analytics
- Automated optimization
- Enhanced monitoring

### Phase 4 (Protocol)
- Microservices consideration
- Advanced protocol features
- Governance integration
- Institutional features
- Compliance architecture

## Design Patterns

### Creational Patterns
- **Factory Pattern**: Creating integration clients
- **Singleton Pattern**: Configuration management
- **Builder Pattern**: Transaction construction

### Structural Patterns
- **Adapter Pattern**: External service integration
- **Facade Pattern**: Complex subsystem abstraction
- **Decorator Pattern**: Middleware chaining

### Behavioral Patterns
- **Strategy Pattern**: Different arbitrage strategies
- **Observer Pattern**: Event-driven communication
- **Chain of Responsibility**: Middleware pipeline

## Technology Decisions

### Why Node.js + Express?
- JavaScript/TypeScript ecosystem
- Excellent async I/O performance
- Large community and libraries
- Easy integration with frontend
- Good for I/O-bound operations

### Why MongoDB?
- Flexible schema for evolving data models
- Excellent performance for read-heavy workloads
- Built-in horizontal scaling (sharding)
- Good fit for time-series data
- JSON-like document structure

### Why TypeScript?
- Type safety and better IDE support
- Catch errors at compile time
- Better code documentation
- Easier refactoring
- Improved maintainability

### Why pnpm?
- Faster installations
- Disk space efficiency
- Strict dependency management
- Better security
- Monorepo support

## Anti-Patterns to Avoid

### Architectural Anti-Patterns
- ❌ God objects with too many responsibilities
- ❌ Tight coupling between modules
- ❌ Business logic in controllers
- ❌ Direct database access from routes
- ❌ Storing private keys in backend

### Code Anti-Patterns
- ❌ Callback hell
- ❌ Global state
- ❌ Magic numbers and strings
- ❌ Premature optimization
- ❌ Not handling errors properly

## Best Practices

### Code Organization
- ✅ Clear module boundaries
- ✅ Consistent naming conventions
- ✅ Comprehensive documentation
- ✅ Type-safe interfaces
- ✅ Unit and integration tests

### Performance
- ✅ Database query optimization
- ✅ Appropriate caching
- ✅ Connection pooling
- ✅ Async/await patterns
- ✅ Batch processing where appropriate

### Security
- ✅ Input validation
- ✅ Output sanitization
- ✅ Proper authentication
- ✅ Authorization checks
- ✅ Security headers

## Related Documentation
- [API Documentation](../api/README.md)
- [Database Schema](../database/README.md)
- [Security Guidelines](../security/README.md)
- [Deployment Guide](../../README.md)