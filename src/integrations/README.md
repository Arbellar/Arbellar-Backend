# Integrations

This directory contains external service integrations for the Arbellar Backend application. Each integration module handles communication with specific external systems, providing abstraction layers and consistent interfaces for the core application.

## Overview

Integrations serve as the bridge between Arbellar's backend and external systems, including blockchain networks, market data providers, and third-party services. They abstract away implementation details and provide clean, consistent interfaces for the application to use.

## Integration Architecture

### Structure
```
src/integrations/
├── stellar/                    # Stellar blockchain integration
│   ├── stellar.integration.ts  # Main Stellar SDK integration
│   ├── horizon.client.ts       # Horizon API client
│   ├── soroban.client.ts       # Soroban RPC client
│   ├── sdk.config.ts          # Stellar SDK configuration
│   └── README.md
├── sdex/                       # Stellar DEX integration
│   ├── sdex.client.ts         # SDEX API client
│   ├── orderbook.service.ts   # Orderbook data processing
│   ├── market.data.ts         # Market data aggregation
│   └── README.md
├── soroswap/                   # Soroswap integration
│   ├── soroswap.client.ts     # Soroswap API client
│   ├── liquidity.service.ts   # Liquidity pool data
│   ├── routing.engine.ts      # Multi-hop routing logic
│   └── README.md
├── soroban/                    # Soroban smart contract integration
│   ├── contract.client.ts     # Generic contract client
│   ├── vault.contract.ts      # Vault contract integration
│   ├── factory.contract.ts    # Factory contract integration
│   └── README.md
├── rpc/                        # RPC infrastructure
│   ├── rpc.client.ts          # Generic RPC client
│   ├── stellar.rpc.ts         # Stellar-specific RPC
│   ├── soroban.rpc.ts         # Soroban RPC implementation
│   └── README.md
└── index.ts                   # Integration exports
```

## Integration Categories

### 1. Stellar Integration (`stellar/`)
**Purpose**: Core Stellar blockchain interaction and SDK management.

**Responsibilities**:
- Stellar SDK initialization and configuration
- Network management (testnet/mainnet switching)
- Account management and validation
- Transaction construction and submission
- Event streaming from Horizon
- Fee estimation and optimization

**Key Components**:
- `StellarIntegration`: Main integration class
- `HorizonClient`: Horizon API wrapper
- `SorobanClient`: Soroban RPC wrapper
- `TransactionBuilder`: Transaction construction utilities
- `EventStreamer`: Real-time event streaming

### 2. SDEX Integration (`sdex/`)
**Purpose**: Stellar Decentralized Exchange market data and orderbook intelligence.

**Responsibilities**:
- SDEX orderbook data retrieval
- Market depth analysis
- Price aggregation and normalization
- Trading pair information
- Historical market data
- Liquidity analysis

**Key Components**:
- `SDEXClient`: SDEX API client
- `OrderbookService`: Orderbook processing
- `MarketDataService`: Market data aggregation
- `PriceNormalizer`: Price normalization across sources
- `LiquidityAnalyzer`: Liquidity analysis utilities

### 3. Soroswap Integration (`soroswap/`)
**Purpose**: Soroswap AMM liquidity and routing intelligence.

**Responsibilities**:
- Soroswap pool data retrieval
- Liquidity pool analysis
- Multi-hop routing calculations
- Price impact estimation
- Slippage calculation
- Gas optimization for swaps

**Key Components**:
- `SoroswapClient`: Soroswap API client
- `LiquidityService`: Pool liquidity analysis
- `RoutingEngine`: Multi-hop routing logic
- `SwapCalculator`: Swap parameter calculation
- `PoolAnalyzer`: Pool performance analysis

### 4. Soroban Integration (`soroban/`)
**Purpose**: Soroban smart contract interaction and management.

**Responsibilities**:
- Smart contract client initialization
- Contract method invocation
- Event listening and processing
- Contract state management
- Gas estimation and optimization
- Error handling for contract interactions

**Key Components**:
- `ContractClient`: Generic contract client
- `VaultContract`: Vault-specific contract methods
- `FactoryContract`: Factory contract interactions
- `EventProcessor`: Contract event handling
- `StateManager`: Contract state synchronization

### 5. RPC Integration (`rpc/`)
**Purpose**: RPC infrastructure management and optimization.

**Responsibilities**:
- RPC connection management
- Request pooling and optimization
- Load balancing across RPC endpoints
- Error handling and retry logic
- Performance monitoring
- Health checking

**Key Components**:
- `RPCClient`: Generic RPC client with retry logic
- `StellarRPC`: Stellar-specific RPC implementation
- `SorobanRPC`: Soroban RPC implementation
- `RPCPool`: Connection pooling and load balancing
- `RPCHealthMonitor`: Health checking and failover

## Integration Patterns

### Client Abstraction Pattern
```typescript
// Abstract client interface
interface BlockchainClient {
  getBalance(address: string): Promise<number>;
  submitTransaction(tx: string): Promise<string>;
}

// Concrete implementation
class StellarClient implements BlockchainClient {
  async getBalance(address: string): Promise<number> {
    // Implementation using Stellar SDK
  }
}
```

### Service Layer Pattern
```typescript
// Service that uses integration clients
class MarketDataService {
  constructor(
    private sdexClient: SDEXClient,
    private soroswapClient: SoroswapClient
  ) {}
  
  async getBestPrice(pair: string): Promise<BestPrice> {
    const sdexPrice = await this.sdexClient.getPrice(pair);
    const soroswapPrice = await this.soroswapClient.getPrice(pair);
    
    return this.calculateBestPrice(sdexPrice, soroswapPrice);
  }
}
```

### Factory Pattern for Network Switching
```typescript
class IntegrationFactory {
  static createStellarIntegration(network: 'testnet' | 'mainnet'): StellarIntegration {
    const config = this.getNetworkConfig(network);
    return new StellarIntegration(config);
  }
  
  private static getNetworkConfig(network: string) {
    return {
      testnet: { horizonUrl: 'https://horizon-testnet.stellar.org' },
      mainnet: { horizonUrl: 'https://horizon.stellar.org' },
    }[network];
  }
}
```

## Configuration Management

### Environment-Based Configuration
```typescript
export const integrationConfig = {
  stellar: {
    network: process.env.STELLAR_NETWORK || 'testnet',
    horizonUrl: process.env.STELLAR_HORIZON_URL,
    rpcUrl: process.env.STELLAR_RPC_URL,
    sorobanRpcUrl: process.env.STELLAR_SOROBAN_RPC_URL,
  },
  sdex: {
    apiUrl: process.env.SDEX_API_URL || 'https://horizon.stellar.org',
    cacheTtl: parseInt(process.env.SDEX_CACHE_TTL || '5', 10), // seconds
  },
  soroswap: {
    apiUrl: process.env.SOROSWAP_API_URL,
    graphqlUrl: process.env.SOROSWAP_GRAPHQL_URL,
    cacheTtl: parseInt(process.env.SOROSWAP_CACHE_TTL || '10', 10),
  },
  rpc: {
    maxConnections: parseInt(process.env.RPC_MAX_CONNECTIONS || '10', 10),
    timeout: parseInt(process.env.RPC_TIMEOUT_MS || '30000', 10),
    retryAttempts: parseInt(process.env.RPC_RETRY_ATTEMPTS || '3', 10),
  },
};
```

### Dynamic Configuration
```typescript
// Configuration that can change at runtime
export const dynamicConfig = {
  stellar: {
    currentHorizonUrl: 'https://horizon.stellar.org',
    backupHorizonUrls: [
      'https://horizon1.stellar.org',
      'https://horizon2.stellar.org',
    ],
    failoverEnabled: true,
  },
};
```

## Error Handling

### Integration-Specific Errors
```typescript
export class IntegrationError extends Error {
  constructor(
    message: string,
    public integration: string,
    public operation: string,
    public originalError?: Error
  ) {
    super(`${integration} ${operation} failed: ${message}`);
  }
}

export class BlockchainError extends IntegrationError {
  constructor(operation: string, message: string, originalError?: Error) {
    super(message, 'blockchain', operation, originalError);
  }
}

export class MarketDataError extends IntegrationError {
  constructor(source: string, message: string, originalError?: Error) {
    super(message, 'market-data', source, originalError);
  }
}
```

### Retry Logic
```typescript
class RetryableIntegration {
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxRetries) {
          const delay = this.calculateBackoff(attempt);
          await this.sleep(delay);
          continue;
        }
      }
    }
    
    throw lastError!;
  }
  
  private calculateBackoff(attempt: number): number {
    return Math.min(1000 * Math.pow(2, attempt), 10000); // Exponential backoff
  }
}
```

## Performance Optimization

### Caching Strategy
```typescript
class CachedIntegration {
  private cache = new Map<string, { data: any; expires: number }>();
  
  async getWithCache<T>(
    key: string,
    fetch: () => Promise<T>,
    ttl: number = 300000 // 5 minutes default
  ): Promise<T> {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() < cached.expires) {
      return cached.data as T;
    }
    
    const data = await fetch();
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    });
    
    return data;
  }
}
```

### Connection Pooling
```typescript
class ConnectionPool {
  private connections: Connection[] = [];
  private maxConnections: number;
  
  async getConnection(): Promise<Connection> {
    // Return idle connection or create new one
    const idle = this.connections.find(c => c.idle);
    
    if (idle) {
      idle.idle = false;
      return idle;
    }
    
    if (this.connections.length < this.maxConnections) {
      const newConn = await this.createConnection();
      this.connections.push(newConn);
      return newConn;
    }
    
    // Wait for connection to become available
    return this.waitForConnection();
  }
}
```

### Batch Processing
```typescript
class BatchProcessor {
  private batch: BatchItem[] = [];
  private batchSize: number = 100;
  private flushInterval: number = 1000; // ms
  
  async addToBatch(item: BatchItem): Promise<void> {
    this.batch.push(item);
    
    if (this.batch.length >= this.batchSize) {
      await this.flushBatch();
    }
  }
  
  private async flushBatch(): Promise<void> {
    if (this.batch.length === 0) return;
    
    const batchToProcess = this.batch;
    this.batch = [];
    
    await this.processBatch(batchToProcess);
  }
}
```

## Monitoring and Observability

### Metrics Collection
```typescript
class IntegrationMetrics {
  private metrics = {
    requestCount: 0,
    errorCount: 0,
    successCount: 0,
    averageLatency: 0,
    lastError: null as Error | null,
  };
  
  recordRequest(startTime: number): void {
    this.metrics.requestCount++;
    
    const latency = Date.now() - startTime;
    this.metrics.averageLatency = 
      (this.metrics.averageLatency * (this.metrics.successCount - 1) + latency) / 
      this.metrics.successCount;
  }
  
  recordSuccess(): void {
    this.metrics.successCount++;
  }
  
  recordError(error: Error): void {
    this.metrics.errorCount++;
    this.metrics.lastError = error;
  }
  
  getMetrics(): IntegrationMetricsData {
    return { ...this.metrics };
  }
}
```

### Health Checking
```typescript
class IntegrationHealth {
  async checkHealth(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkStellarHealth(),
      this.checkSDEXHealth(),
      this.checkSoroswapHealth(),
      this.checkSorobanHealth(),
    ]);
    
    const status: HealthStatus = {
      overall: 'healthy',
      checks: {},
    };
    
    checks.forEach((check, index) => {
      const service = ['stellar', 'sdex', 'soroswap', 'soroban'][index];
      
      if (check.status === 'fulfilled') {
        status.checks[service] = { status: 'healthy', details: check.value };
      } else {
        status.checks[service] = { status: 'unhealthy', error: check.reason };
        status.overall = 'unhealthy';
      }
    });
    
    return status;
  }
}
```

## Phase Implementation

### Phase 1 (MVP)
- Basic Stellar SDK integration
- SDEX orderbook data retrieval
- Simple Soroswap price checking
- Basic Soroban contract interaction
- RPC client with retry logic

### Phase 2 (Expansion)
- Advanced Stellar event streaming
- SDEX market depth analysis
- Soroswap routing engine
- Advanced Soroban contract features
- RPC connection pooling and load balancing
- Multi-DEX integration (Aqua, Phoenix)

### Phase 3 (AI & Automation)
- Intelligent data source selection
- Predictive latency optimization
- Automated failover management
- AI-powered error recovery
- Smart caching strategies

### Phase 4 (Protocol)
- Cross-protocol integration
- Advanced compliance features
- Institutional-grade connectivity
- Protocol-specific optimizations
- Regulatory reporting integration

## Security Considerations

### API Key Management
```typescript
class SecureIntegration {
  private apiKey: string;
  
  constructor() {
    this.apiKey = this.loadApiKey();
  }
  
  private loadApiKey(): string {
    const key = process.env.INTEGRATION_API_KEY;
    if (!key) {
      throw new Error('Integration API key not configured');
    }
    return key;
  }
  
  async makeSecureRequest(endpoint: string, data: any): Promise<any> {
    const signature = this.signRequest(data);
    
    return this.makeRequest(endpoint, {
      ...data,
      signature,
      apiKey: this.apiKey,
    });
  }
  
  private signRequest(data: any): string {
    // Implement secure request signing
    return crypto.createHmac('sha256', this.apiKey)
      .update(JSON.stringify(data))
      .digest('hex');
  }
}
```

### Data Validation
```typescript
class ValidatedIntegration {
  async validateAndProcess(data: any): Promise<ProcessedData> {
    // Validate input data
    const validated = await this.validate(data);
    
    // Sanitize data
    const sanitized = this.sanitize(validated);
    
    // Process data
    return this.process(sanitized);
  }
  
  private async validate(data: any): Promise<ValidatedData> {
    // Implement comprehensive validation
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Invalid data format');
    }
    
    // Validate specific fields
    // ...
    
    return data as ValidatedData;
  }
}
```

## Testing Strategies

### Unit Tests
```typescript
describe('StellarIntegration', () => {
  let integration: StellarIntegration;
  let mockHorizon: jest.Mocked<HorizonClient>;
  
  beforeEach(() => {
    mockHorizon = createMockHorizonClient();
    integration = new StellarIntegration(mockHorizon);
  });
  
  it('should get account balance', async () => {
    mockHorizon.getAccountBalance.mockResolvedValue(1000);
    
    const balance = await integration.getBalance('G...');
    
    expect(balance).toBe(1000);
    expect(mockHorizon.getAccountBalance).toHaveBeenCalledWith('G...');
  });
});
```

### Integration Tests
```typescript
describe('SDEX Integration', () => {
  it('should fetch real orderbook data', async () => {
    const client = new SDEXClient();
    const orderbook = await client.getOrderbook('USDC/XLM');
    
    expect(orderbook).toHaveProperty('bids');
    expect(orderbook).toHaveProperty('asks');
    expect(orderbook.bids.length).toBeGreaterThan(0);
  });
});
```

### Mock Testing
```typescript
class MockIntegration extends RealIntegration {
  constructor(private mockData: any) {
    super();
  }
  
  async getData(): Promise<any> {
    return this.mockData;
  }
}

// Use in tests
const mockIntegration = new MockIntegration({ test: 'data' });
const service = new BusinessService(mockIntegration);
```

## Best Practices

### 1. Abstraction Layers
- Keep integration details hidden from business logic
- Use interfaces for integration contracts
- Implement adapter patterns for different providers

### 2. Error Handling
- Implement comprehensive error handling
- Use custom error types for different failure modes
- Include retry logic with exponential backoff
- Log integration errors with context

### 3. Performance
- Implement caching where appropriate
- Use connection pooling for external services
- Batch requests when possible
- Monitor and optimize latency

### 4. Security
- Never hardcode API keys or secrets
- Validate all incoming data from integrations
- Implement proper authentication and authorization
- Monitor for suspicious integration activity

### 5. Observability
- Log all integration calls
- Track performance metrics
- Monitor error rates
- Implement health checks

### 6. Maintainability
- Keep integrations modular and focused
- Document integration interfaces
- Version integration APIs
- Plan for integration changes and deprecations

## Adding New Integrations

### Steps to Add New Integration
1. **Identify Need**: Determine what external service needs integration
2. **Research API**: Study the external service's API documentation
3. **Design Interface**: Define clean abstraction interface
4. **Implement Client**: Create integration client with error handling
5. **Add Configuration**: Add environment variables and configuration
6. **Implement Tests**: Create unit and integration tests
7. **Add Documentation**: Document integration usage and limitations
8. **Monitor**: Set up monitoring and alerts

### Example: Adding New DEX Integration
```typescript
// 1. Define interface
interface DEXIntegration {
  getOrderbook(pair: string): Promise<Orderbook>;
  getPrice(pair: string): Promise<Price>;
  submitOrder(order: Order): Promise<OrderResult>;
}

// 2. Implement client
class NewDEXClient implements DEXIntegration {
  constructor(private config: DEXConfig) {}
  
  async getOrderbook(pair: string): Promise<Orderbook> {
    // Implementation using DEX API
  }
}

// 3. Add to integration factory
class IntegrationFactory {
  static createDEXIntegration(name: string): DEXIntegration {
    switch (name) {
      case 'sdex':
        return new SDEXClient();
      case 'soroswap':
        return new SoroswapClient();
      case 'newdex':
        return new NewDEXClient(this.getDEXConfig('newdex'));
      default:
        throw new Error(`Unknown DEX: ${name}`);
    }
  }
}
```

## Related Directories
- `src/config/`: Integration configuration
- `src/utils/`: Shared utilities for integrations
- `src/modules/`: Business modules using integrations
- `tests/integrations/`: Integration tests
- `src/middleware/`: Integration-related middleware