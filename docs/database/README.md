# Database Architecture

## Overview

This document describes the MongoDB database architecture for the Arbellar Backend. MongoDB serves as the off-chain persistence layer for user data, vault metadata, market snapshots, arbitrage opportunities, execution records, and analytics.

## Database Design Principles

### 1. Off-Chain Persistence Only
- MongoDB stores **metadata** and **off-chain state**
- **On-chain financial state** remains on Stellar/Soroban
- Database records reference blockchain transactions via hashes
- No private keys, seed phrases, or sensitive signing information stored

### 2. Document-Oriented Design
- Each domain has its own collections
- Embedded documents for related data
- Denormalization for read performance
- Schema evolution support

### 3. Auditability & Traceability
- All financial records reference blockchain transactions
- Timestamps on all documents
- Change tracking where appropriate
- Audit trail for critical operations

### 4. Performance Optimization
- Indexes on frequently queried fields
- Compound indexes for common query patterns
- TTL indexes for time-based data expiration
- Read/write optimization based on access patterns

## Collections Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,              // Unique, indexed
  username: String,           // Optional display name
  passwordHash: String,       // Bcrypt hash
  isActive: Boolean,
  isVerified: Boolean,
  
  // Embedded documents
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String,
    location: String,
    timezone: String,
  },
  
  preferences: {
    notifications: {
      email: Boolean,
      push: Boolean,
      sms: Boolean,
    },
    privacy: {
      showEmail: Boolean,
      showActivity: Boolean,
    },
    language: String,
    currency: String,
    theme: String,
  },
  
  security: {
    twoFactorEnabled: Boolean,
    lastPasswordChange: Date,
    failedLoginAttempts: Number,
    lockUntil: Date,
  },
  
  // References
  walletIds: [ObjectId],      // References to wallets
  vaultIds: [ObjectId],       // References to vaults
  riskProfileId: ObjectId,    // Reference to risk profile
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date,
  deletedAt: Date,            // Soft delete timestamp
}
```

### Wallets Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to user, indexed
  address: String,            // Stellar public address (G...), unique indexed
  network: String,           // 'testnet' or 'mainnet'
  type: String,              // 'personal', 'vault', 'institutional'
  status: String,            // 'pending', 'verified', 'suspended', 'revoked'
  
  verification: {
    method: String,          // 'signature', 'transaction', 'manual'
    verifiedAt: Date,
    expiresAt: Date,        // For temporary verifications
    proof: String,          // Verification proof data
  },
  
  metadata: {
    nickname: String,
    description: String,
    tags: [String],
    isDefault: Boolean,
    isHidden: Boolean,
  },
  
  balance: {
    lastUpdated: Date,
    xlm: Number,
    usdc: Number,
    aqua: Number,
    totalValueUSD: Number,
  },
  
  security: {
    requireConfirmation: Boolean,
    maxTransactionValue: Number,
    allowedOperations: [String],
  },
  
  activity: {
    lastActive: Date,
    transactionCount: Number,
    totalVolume: Number,
  },
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  verifiedAt: Date,
  lastBalanceCheck: Date,
}
```

### Vaults Collection
```javascript
{
  _id: ObjectId,
  contractAddress: String,      // Soroban contract address, unique indexed
  network: String,             // 'testnet' or 'mainnet'
  type: String,               // 'usdc-xlm', 'multi-asset', 'institutional'
  status: String,              // 'active', 'paused', 'closed', 'migrated'
  
  // Ownership
  ownerId: ObjectId,          // Primary owner, indexed
  managers: [ObjectId],       // Additional managers
  viewers: [ObjectId],        // Read-only access
  
  config: {
    name: String,
    description: String,
    strategy: String,
    riskLevel: String,        // 'low', 'medium', 'high', 'custom'
    maxSlippage: Number,
    minSpread: Number,
    tradeSizeLimit: Number,
    autoReinvest: Boolean,
  },
  
  balance: {
    lastUpdated: Date,
    totalValueUSD: Number,
    assets: {
      xlm: { amount: Number, valueUSD: Number },
      usdc: { amount: Number, valueUSD: Number },
      aqua: { amount: Number, valueUSD: Number },
    },
    allocations: {
      active: Number,         // Funds in active arbitrage
      available: Number,      // Available for new opportunities
      reserved: Number,       // Reserved for pending executions
    },
  },
  
  performance: {
    totalDeposits: Number,
    totalWithdrawals: Number,
    netProfit: Number,
    roi: Number,
    successRate: Number,
    avgSpreadCaptured: Number,
    totalFeesPaid: Number,
    lastArbitrageAt: Date,
  },
  
  activity: {
    depositCount: Number,
    withdrawalCount: Number,
    arbitrageCount: Number,
    lastActivityAt: Date,
    pendingActions: Number,
  },
  
  security: {
    requireConfirmation: Boolean,
    withdrawalDelay: Number,
    maxDailyWithdrawal: Number,
    allowedAssets: [String],
  },
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  activatedAt: Date,
  lastBalanceSync: Date,
  lastPerformanceUpdate: Date,
}
```

### Market Snapshots Collection
```javascript
{
  _id: ObjectId,
  pair: String,               // Trading pair, indexed
  source: String,            // 'sdex', 'soroswap', 'aqua', 'phoenix'
  timestamp: Date,           // Indexed for time-based queries
  
  // SDEX-specific data
  sdex: {
    bestBid: Number,
    bestAsk: Number,
    bidDepth: Number,
    askDepth: Number,
    spread: Number,
    orderbook: {
      bids: [{ price: Number, amount: Number }],
      asks: [{ price: Number, amount: Number }],
    },
  },
  
  // Soroswap-specific data
  soroswap: {
    poolAddress: String,
    liquidity: Number,
    volume24h: Number,
    feeTier: Number,
    token0Price: Number,
    token1Price: Number,
  },
  
  // Normalized data
  normalized: {
    bestBid: Number,
    bestAsk: Number,
    effectiveSpread: Number,
    availableLiquidity: Number,
    priceImpact1k: Number,     // Price impact for $1000 trade
    priceImpact10k: Number,   // Price impact for $10,000 trade
  },
  
  // Metadata
  metadata: {
    confidenceScore: Number,   // Data reliability score
    sourceLatency: Number,     // How fresh is the data
    aggregationMethod: String, // How data was aggregated
  },
}
```

### Arbitrage Opportunities Collection
```javascript
{
  _id: ObjectId,
  pair: String,               // Trading pair, indexed
  timestamp: Date,            // Opportunity detection time, indexed
  
  // Source data
  sources: {
    buySource: String,       // 'sdex', 'soroswap'
    sellSource: String,       // 'sdex', 'soroswap'
    buyPrice: Number,
    sellPrice: Number,
    buyLiquidity: Number,
    sellLiquidity: Number,
  },
  
  // Calculated metrics
  metrics: {
    spread: Number,           // Percentage spread
    potentialProfit: Number,  // Estimated profit in USD
    maxTradeSize: Number,     // Maximum trade size before significant slippage
    priceImpact: Number,      // Estimated price impact
    executionRisk: Number,    // Risk score (0-100)
    confidence: Number,       // Confidence score (0-100)
  },
  
  // Risk assessment
  risk: {
    meetsMinSpread: Boolean,
    withinSlippageTolerance: Boolean,
    sufficientLiquidity: Boolean,
    networkConditions: String, // 'good', 'fair', 'poor'
    riskLevel: String,         // 'low', 'medium', 'high'
  },
  
  // Status tracking
  status: String,            // 'detected', 'expired', 'executed', 'failed'
  expiresAt: Date,           // When opportunity expires
  executedAt: Date,          // If/when executed
  executionId: ObjectId,     // Reference to execution
  
  // Additional data
  vaultEligible: [ObjectId],  // Vaults eligible for this opportunity
  notes: String,             // Additional notes or analysis
}
```

### Executions Collection
```javascript
{
  _id: ObjectId,
  opportunityId: ObjectId,   // Reference to arbitrage opportunity
  vaultId: ObjectId,         // Vault executing the trade
  userId: ObjectId,          // User who initiated (for audit)
  
  // Execution details
  details: {
    pair: String,
    amount: Number,           // Amount to trade (in base currency)
    expectedProfit: Number,
    maxSlippage: Number,
    feePercentage: Number,
  },
  
  // Transaction information
  transactions: {
    buyTxHash: String,       // Buy transaction hash
    sellTxHash: String,      // Sell transaction hash
    buyConfirmedAt: Date,
    sellConfirmedAt: Date,
    buyBlockHeight: Number,
    sellBlockHeight: Number,
  },
  
  // Status tracking
  status: String,            // 'pending', 'submitted', 'confirmed', 'failed'
  statusHistory: [{
    status: String,
    timestamp: Date,
    reason: String,
  }],
  
  // Results
  results: {
    actualProfit: Number,
    actualSlippage: Number,
    feesPaid: Number,
    success: Boolean,
    failureReason: String,   // If failed
    executionTimeMs: Number, // Total execution time
  },
  
  // Audit trail
  audit: {
    createdBy: ObjectId,
    approvedBy: ObjectId,     // If manual approval required
    executedBy: String,       // 'system', 'user', 'ai'
    ipAddress: String,       // For security audit
  },
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  submittedAt: Date,
  completedAt: Date,
}
```

### Trades Collection (Aggregated Execution Results)
```javascript
{
  _id: ObjectId,
  executionId: ObjectId,     // Reference to execution
  vaultId: ObjectId,         // Vault that executed
  userId: ObjectId,          // User who owns vault
  
  // Trade details
  pair: String,
  direction: String,         // 'buy-then-sell' or 'sell-then-buy'
  entryPrice: Number,
  exitPrice: Number,
  amount: Number,
  
  // Financials
  grossProfit: Number,
  fees: {
    platform: Number,
    network: Number,
    total: Number,
  },
  netProfit: Number,
  
  // Performance metrics
  roi: Number,               // Return on investment
  spreadCaptured: Number,    // Actual spread captured
  executionQuality: Number,  // 0-100 score
  
  // Timing
  entryTimestamp: Date,
  exitTimestamp: Date,
  durationMs: Number,
  
  // Audit
  transactionHashes: [String], // Blockchain transaction hashes
  confirmed: Boolean,          // Blockchain confirmation status
  
  // Metadata
  notes: String,
  tags: [String],
}
```

## Indexing Strategy

### Users Collection
- `email`: Unique index for login and lookup
- `createdAt`: For sorting and time-based queries
- `isActive`: For filtering active users
- Compound index: `email + isActive` for login queries

### Wallets Collection
- `address`: Unique index for wallet lookup
- `userId`: For user-wallet queries
- `status`: For filtering by verification status
- `network`: For network-specific queries
- Compound index: `userId + isDefault` for primary wallet lookup

### Vaults Collection
- `contractAddress`: Unique index for contract lookup
- `ownerId`: For owner-specific queries
- `status`: For filtering by vault status
- `network`: For network-specific queries
- Compound index: `ownerId + status` for user's active vaults
- Index on `balance.totalValueUSD` for sorting/ranking

### Market Snapshots Collection
- `pair`: For trading pair queries
- `timestamp`: TTL index for auto-expiration (e.g., 7 days)
- Compound index: `pair + timestamp` for time-series queries
- Compound index: `source + timestamp` for source-specific queries

### Arbitrage Opportunities Collection
- `timestamp`: TTL index for auto-cleanup (e.g., 24 hours)
- `status`: For filtering by opportunity status
- Compound index: `pair + timestamp` for pair-specific history
- Compound index: `status + expiresAt` for expiring opportunities

### Executions Collection
- `vaultId`: For vault-specific execution history
- `status`: For filtering by execution status
- `createdAt`: For chronological queries
- Compound index: `vaultId + status` for active executions per vault

### Trades Collection
- `vaultId`: For vault trade history
- `userId`: For user trade history
- `entryTimestamp`: For time-based trade queries
- Compound index: `userId + entryTimestamp` for user trade history
- Compound index: `pair + entryTimestamp` for pair trade history

## Data Retention Policy

### Short-Term Data (Days to Weeks)
- **Market snapshots**: 7 days (TTL index)
- **Arbitrage opportunities**: 24 hours (TTL index)
- **Execution logs**: 30 days

### Medium-Term Data (Months)
- **User activity logs**: 90 days
- **System logs**: 90 days
- **API request logs**: 30 days

### Long-Term Data (Years)
- **User accounts**: Indefinite (with soft delete)
- **Vault metadata**: Indefinite
- **Trade history**: Indefinite (financial records)
- **Performance analytics**: Indefinite

### Archival Strategy
- Old data archived to cold storage
- Summary statistics kept in operational database
- GDPR compliance for user data deletion

## Migration Strategy

### Schema Evolution
- Use Mongoose schema versioning
- Gradual migration of existing data
- Backward compatibility for API changes
- Migration scripts for breaking changes

### Example Migration Script
```typescript
// scripts/migrate-v1-to-v2.ts
import { migrateVaultSchema } from './migrations/vault-v2';

async function migrateAllVaults() {
  const vaults = await Vault.find({});
  
  for (const vault of vaults) {
    const migrated = migrateVaultSchema(vault);
    await migrated.save();
  }
}
```

## Backup Strategy

### Automated Backups
- Daily full backups
- Hourly incremental backups
- Backup verification
- Retention: 30 days of daily, 7 days of hourly

### Backup Storage
- Primary: Cloud storage (AWS S3, Azure Blob)
- Secondary: Local storage
- Encryption at rest and in transit

### Recovery Testing
- Monthly recovery drills
- Automated recovery testing
- Documentation for manual recovery

## Performance Optimization

### Query Optimization
- Use covered indexes where possible
- Avoid collection scans
- Use projection to limit returned fields
- Implement pagination for large result sets

### Connection Management
- Connection pooling
- Read/write preference configuration
- Replica set for read scaling

### Caching Strategy
- Redis cache for frequently accessed data
- Cache invalidation strategies
- Stale-while-revalidate patterns

## Security Considerations

### Data Encryption
- At-rest encryption (MongoDB Enterprise or application-level)
- In-transit encryption (TLS)
- Field-level encryption for sensitive data

### Access Control
- Database user with least privilege
- IP whitelisting for database access
- Regular access reviews

### Audit Logging
- Database audit logs enabled
- Access pattern monitoring
- Alerting for suspicious queries

## Monitoring

### Key Metrics
- Query performance (slow query logs)
- Connection pool utilization
- Replication lag
- Disk usage and growth

### Alerts
- High latency queries
- Connection pool exhaustion
- Replication issues
- Disk space thresholds

## Phase Implementation

### Phase 1 (MVP)
- Core collections (users, wallets, vaults, market snapshots)
- Basic indexes
- Simple backup strategy
- Development database configuration

### Phase 2 (Expansion)
- Additional collections (opportunities, executions, trades)
- Advanced indexes
- Production backup and recovery
- Performance optimization

### Phase 3 (AI & Automation)
- Analytics collections
- Machine learning feature stores
- Automated schema optimization
- Intelligent caching

### Phase 4 (Protocol)
- Governance data structures
- Compliance reporting collections
- Institutional features
- Advanced security features

## Related Documentation
- [MongoDB Configuration](../src/config/database.ts)
- [Database Migration Scripts](../scripts/README.md)
- [Backup Procedures](../scripts/README.md)
- [Performance Monitoring](../../monitoring/README.md)