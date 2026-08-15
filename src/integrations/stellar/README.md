# Stellar Integration

## Overview
The Stellar integration provides comprehensive blockchain interaction capabilities for the Arbellar platform. This module handles all Stellar SDK operations, Horizon API communication, and Soroban smart contract interactions.

## Responsibilities

### Core Responsibilities
- **Stellar SDK Management**: Initialize and configure Stellar SDK for different networks
- **Account Operations**: Account creation, validation, and balance queries
- **Transaction Management**: Transaction construction, signing coordination, and submission
- **Horizon API Integration**: Efficient communication with Stellar Horizon servers
- **Soroban RPC Integration**: Smart contract interaction via Soroban RPC
- **Event Streaming**: Real-time blockchain event monitoring
- **Network Management**: Testnet/mainnet switching and configuration

### Key Features
- Network-agnostic operations (testnet/mainnet)
- Connection pooling and retry logic
- Event streaming with reconnection
- Transaction fee optimization
- Error handling with detailed diagnostics
- Performance monitoring and metrics

## Architecture

### Components
```
stellar/
├── stellar.integration.ts    # Main integration class
├── horizon.client.ts        # Horizon API client
├── soroban.client.ts        # Soroban RPC client
├── account.manager.ts       # Account operations
├── transaction.builder.ts   # Transaction construction
├── event.streamer.ts        # Event streaming
├── fee.calculator.ts        # Fee estimation
└── types.ts                # Stellar-specific types
```

### Integration Class Structure
```typescript
export class StellarIntegration {
  private horizonClient: HorizonClient;
  private sorobanClient: SorobanClient;
  private accountManager: AccountManager;
  private transactionBuilder: TransactionBuilder;
  private eventStreamer: EventStreamer;
  private feeCalculator: FeeCalculator;

  constructor(config: StellarConfig) {
    // Initialize components based on configuration
  }

  // Account operations
  async getAccount(address: string): Promise<AccountResponse>;
  async getBalance(address: string, asset?: Asset): Promise<number>;
  async validateAddress(address: string): Promise<boolean>;

  // Transaction operations
  async buildTransaction(operations: Operation[]): Promise<Transaction>;
  async submitTransaction(transaction: Transaction): Promise<TransactionResult>;
  async estimateFee(operations: Operation[]): Promise<number>;

  // Contract operations
  async callContract(contractId: string, method: string, params: any[]): Promise<any>;
  async deployContract(wasmHash: string, initParams: any[]): Promise<string>;

  // Event operations
  async streamEvents(cursor?: string): Promise<EventStream>;
  async getEvents(filters: EventFilter): Promise<Event[]>;
}
```

## Configuration

### Environment Variables
```bash
# Stellar network configuration
STELLAR_NETWORK=testnet                              # testnet | mainnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Connection settings
STELLAR_REQUEST_TIMEOUT=30000                        # Request timeout (ms)
STELLAR_MAX_RETRIES=3                                # Maximum retry attempts
STELLAR_RETRY_DELAY=1000                            # Retry delay (ms)

# Performance settings
STELLAR_CONNECTION_POOL_SIZE=10                      # Connection pool size
STELLAR_RATE_LIMIT_REQUESTS=100                     # Requests per minute
STELLAR_CACHE_TTL=60                                # Cache TTL (seconds)

# Feature flags
STELLAR_ENABLE_STREAMING=true                       # Enable event streaming
STELLAR_ENABLE_CACHING=true                         # Enable response caching
STELLAR_ENABLE_METRICS=true                         # Enable metrics collection
```

### Network Configuration
```typescript
export const stellarNetworkConfig = {
  testnet: {
    networkPassphrase: Networks.TESTNET,
    horizonUrl: 'https://horizon-testnet.stellar.org',
    sorobanRpcUrl: 'https://soroban-testnet.stellar.org',
    friendbotUrl: 'https://friendbot.stellar.org',
  },
  mainnet: {
    networkPassphrase: Networks.PUBLIC,
    horizonUrl: 'https://horizon.stellar.org',
    sorobanRpcUrl: 'https://soroban-mainnet.stellar.org',
    friendbotUrl: null, // No friendbot on mainnet
  },
};
```

## Usage Examples

### Basic Account Operations
```typescript
import { StellarIntegration } from './integrations/stellar';

const stellar = new StellarIntegration({
  network: 'testnet',
  horizonUrl: 'https://horizon-testnet.stellar.org',
});

// Get account information
const account = await stellar.getAccount('GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ');

// Get XLM balance
const xlmBalance = await stellar.getBalance('GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ');

// Get USDC balance
const usdcAsset = new Asset('USDC', 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN');
const usdcBalance = await stellar.getBalance(accountId, usdcAsset);
```

### Transaction Construction and Submission
```typescript
// Build payment transaction
const sourceKeypair = Keypair.fromSecret('S...');
const destination = 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ';

const operations = [
  Operation.payment({
    destination,
    asset: Asset.native(), // XLM
    amount: '100',
  }),
];

const transaction = await stellar.buildTransaction(operations);

// Sign transaction (this would be done by user in real scenario)
transaction.sign(sourceKeypair);

// Submit transaction
const result = await stellar.submitTransaction(transaction);
console.log('Transaction hash:', result.hash);
```

### Smart Contract Interaction
```typescript
// Call smart contract method
const contractId = 'CA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ';
const result = await stellar.callContract(contractId, 'get_balance', ['user123']);

// Deploy new contract
const wasmHash = '1a2b3c4d5e6f...';
const initParams = ['initial_value'];
const newContractId = await stellar.deployContract(wasmHash, initParams);
```

### Event Streaming
```typescript
// Start streaming events
const eventStream = await stellar.streamEvents();

eventStream.on('transaction', (transaction) => {
  console.log('New transaction:', transaction.hash);
});

eventStream.on('operation', (operation) => {
  console.log('New operation:', operation.type);
});

eventStream.on('error', (error) => {
  console.error('Stream error:', error);
});
```

## Error Handling

### Error Types
```typescript
export class StellarError extends Error {
  constructor(message: string, public code?: string, public details?: any) {
    super(message);
    this.name = 'StellarError';
  }
}

export class HorizonError extends StellarError {
  constructor(message: string, public status?: number, public response?: any) {
    super(message, 'HORIZON_ERROR', { status, response });
  }
}

export class SorobanError extends StellarError {
  constructor(message: string, public contractError?: any) {
    super(message, 'SOROBAN_ERROR', contractError);
  }
}

export class TransactionError extends StellarError {
  constructor(message: string, public resultCodes?: any) {
    super(message, 'TRANSACTION_ERROR', resultCodes);
  }
}
```

### Error Handling Patterns
```typescript
class StellarIntegration {
  async getAccount(address: string): Promise<AccountResponse> {
    try {
      return await this.horizonClient.loadAccount(address);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new StellarError(`Account not found: ${address}`, 'ACCOUNT_NOT_FOUND');
      }
      
      if (error.response?.status >= 500) {
        throw new HorizonError('Horizon server error', error.response.status);
      }
      
      throw new StellarError(`Failed to load account: ${error.message}`);
    }
  }

  async submitTransaction(transaction: Transaction): Promise<TransactionResult> {
    try {
      return await this.horizonClient.submitTransaction(transaction);
    } catch (error) {
      const resultCodes = error.response?.data?.extras?.result_codes;
      
      if (resultCodes) {
        throw new TransactionError(
          `Transaction failed: ${resultCodes.transaction}`,
          resultCodes
        );
      }
      
      throw new StellarError(`Transaction submission failed: ${error.message}`);
    }
  }
}
```

## Performance Optimization

### Connection Pooling
```typescript
class HorizonClient {
  private connectionPool: ConnectionPool;

  constructor(config: HorizonConfig) {
    this.connectionPool = new ConnectionPool({
      maxConnections: config.maxConnections || 10,
      keepAlive: true,
      timeout: config.timeout || 30000,
    });
  }

  async makeRequest(url: string, options: RequestOptions): Promise<any> {
    const connection = await this.connectionPool.acquire();
    try {
      return await connection.request(url, options);
    } finally {
      this.connectionPool.release(connection);
    }
  }
}
```

### Response Caching
```typescript
class CachedHorizonClient {
  private cache = new Map<string, CacheEntry>();

  async getAccountWithCache(address: string): Promise<AccountResponse> {
    const cacheKey = `account:${address}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }

    const account = await this.horizonClient.loadAccount(address);
    
    this.cache.set(cacheKey, {
      data: account,
      expiresAt: Date.now() + this.cacheTtl,
    });

    return account;
  }
}
```

### Batch Operations
```typescript
class BatchProcessor {
  async batchLoadAccounts(addresses: string[]): Promise<AccountResponse[]> {
    const chunks = this.chunkArray(addresses, 10); // Process in chunks of 10
    const results: AccountResponse[] = [];

    for (const chunk of chunks) {
      const promises = chunk.map(address => this.getAccount(address));
      const chunkResults = await Promise.allSettled(promises);
      
      results.push(...chunkResults
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<AccountResponse>).value)
      );
    }

    return results;
  }
}
```

## Monitoring and Metrics

### Performance Metrics
```typescript
class StellarMetrics {
  private metrics = {
    requestCount: 0,
    errorCount: 0,
    averageLatency: 0,
    cacheHitRate: 0,
    connectionPoolUtilization: 0,
  };

  recordRequest(startTime: number, success: boolean): void {
    const latency = Date.now() - startTime;
    
    this.metrics.requestCount++;
    if (success) {
      this.updateLatency(latency);
    } else {
      this.metrics.errorCount++;
    }
  }

  recordCacheHit(): void {
    // Update cache hit rate
  }

  getMetrics(): StellarMetricsData {
    return { ...this.metrics };
  }
}
```

### Health Monitoring
```typescript
class StellarHealthMonitor {
  async checkHealth(): Promise<HealthStatus> {
    try {
      // Test Horizon connectivity
      const horizonHealth = await this.checkHorizonHealth();
      
      // Test Soroban RPC connectivity
      const sorobanHealth = await this.checkSorobanHealth();
      
      // Check connection pool status
      const poolHealth = this.checkConnectionPool();

      return {
        status: 'healthy',
        details: {
          horizon: horizonHealth,
          soroban: sorobanHealth,
          connectionPool: poolHealth,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
      };
    }
  }

  private async checkHorizonHealth(): Promise<any> {
    const startTime = Date.now();
    await this.horizonClient.ledgers().limit(1).call();
    return { latency: Date.now() - startTime };
  }
}
```

## Testing

### Unit Tests
```typescript
describe('StellarIntegration', () => {
  let integration: StellarIntegration;
  let mockHorizon: jest.Mocked<HorizonClient>;

  beforeEach(() => {
    mockHorizon = createMockHorizonClient();
    integration = new StellarIntegration({ horizonClient: mockHorizon });
  });

  describe('getAccount', () => {
    it('should return account data for valid address', async () => {
      const mockAccount = { id: 'GA...', sequence: '123' };
      mockHorizon.loadAccount.mockResolvedValue(mockAccount);

      const result = await integration.getAccount('GA...');

      expect(result).toEqual(mockAccount);
      expect(mockHorizon.loadAccount).toHaveBeenCalledWith('GA...');
    });

    it('should throw error for invalid address', async () => {
      mockHorizon.loadAccount.mockRejectedValue(new Error('Invalid address'));

      await expect(integration.getAccount('invalid')).rejects.toThrow('Invalid address');
    });
  });
});
```

### Integration Tests
```typescript
describe('Stellar Integration - Real Network', () => {
  let integration: StellarIntegration;

  beforeAll(() => {
    integration = new StellarIntegration({
      network: 'testnet',
      horizonUrl: 'https://horizon-testnet.stellar.org',
    });
  });

  it('should fetch real account data from testnet', async () => {
    const testAccount = 'GA2HGBJIJKI6O4XEM7CZWY5PS6GKSXL6D34ERAJYQSPYA6X6AI7HYW36';
    
    const account = await integration.getAccount(testAccount);
    
    expect(account).toHaveProperty('id', testAccount);
    expect(account).toHaveProperty('sequence');
    expect(account).toHaveProperty('balances');
  });
});
```

## Security Considerations

### Private Key Handling
```typescript
// NEVER store private keys in the integration
class SecureStellarIntegration {
  // Only work with public keys and unsigned transactions
  async prepareTransaction(operations: Operation[]): Promise<Transaction> {
    // Build transaction without signing
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: await this.estimateFee(operations),
      networkPassphrase: this.networkPassphrase,
    });

    operations.forEach(op => transaction.addOperation(op));
    
    return transaction.setTimeout(300).build(); // Return unsigned transaction
  }
}
```

### Input Validation
```typescript
class ValidatedStellarIntegration {
  async getBalance(address: string, asset?: Asset): Promise<number> {
    // Validate Stellar address format
    if (!StrKey.isValidEd25519PublicKey(address)) {
      throw new StellarError('Invalid Stellar address format');
    }

    // Validate asset if provided
    if (asset && !this.isValidAsset(asset)) {
      throw new StellarError('Invalid asset format');
    }

    return this.fetchBalance(address, asset);
  }

  private isValidAsset(asset: Asset): boolean {
    if (asset.isNative()) return true;
    
    return StrKey.isValidEd25519PublicKey(asset.getIssuer()) &&
           asset.getCode().length <= 12;
  }
}
```

## Phase Implementation

### Phase 1 (MVP)
- Basic Horizon API integration
- Account and balance operations
- Simple transaction construction
- Basic error handling
- Testnet support

### Phase 2 (Expansion)
- Soroban smart contract integration
- Event streaming implementation
- Advanced transaction features
- Connection pooling and caching
- Mainnet support
- Performance optimization

### Phase 3 (AI & Automation)
- Intelligent fee estimation
- Predictive caching
- Automated failover
- Performance analytics
- Smart retry logic

### Phase 4 (Protocol)
- Advanced contract features
- Protocol-specific optimizations
- Institutional features
- Compliance integration
- Advanced monitoring

## Related Modules
- **SDEX Integration**: Uses Stellar integration for market data
- **Soroban Integration**: Extends Stellar for smart contracts
- **Vault Module**: Uses for on-chain operations
- **Execution Module**: Uses for transaction submission
- **Market Module**: Uses for price and liquidity data