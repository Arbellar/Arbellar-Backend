# Vaults Module

## Overview
The Vaults module manages smart vault information, fund tracking, and vault-user relationships for the Arbellar platform. This module handles the off-chain representation of on-chain smart vaults, providing users with vault information, activity tracking, and coordination services.

## Responsibilities

### Core Responsibilities
- **Vault Metadata Management**: Store and manage off-chain vault information
- **Vault-User Relationships**: Link vaults to user accounts and manage permissions
- **Balance Indexing**: Track vault balances from on-chain data (off-chain cache)
- **Activity Tracking**: Record vault deposit, withdrawal, and arbitrage activity
- **State Synchronization**: Synchronize off-chain state with on-chain smart contracts
- **Coordination Services**: Facilitate deposit/withdrawal coordination with frontend

### Phase-Specific Responsibilities
- **Phase 1 (MVP)**: Basic vault metadata, balance tracking, activity logging
- **Phase 2 (Expansion)**: Multi-vault support, advanced analytics, enhanced coordination
- **Phase 3 (AI)**: Vault performance optimization, intelligent fund allocation
- **Phase 4 (Protocol)**: Protocol vault integration, treasury management, governance

## Data Model

### Vault Document Structure
```typescript
interface Vault {
  _id: ObjectId;
  contractAddress: string;          // Soroban smart contract address
  network: 'testnet' | 'mainnet';   // Stellar network
  type: 'usdc-xlm' | 'multi-asset' | 'institutional';  // Vault type
  status: 'active' | 'paused' | 'closed' | 'migrated';
  
  // Ownership and permissions
  ownerId: ObjectId;                // Primary owner (user reference)
  managers: ObjectId[];             // Additional managers
  viewers: ObjectId[];              // Read-only access users
  
  // Configuration
  config: {
    name: string;                   // User-defined vault name
    description?: string;           // Optional description
    strategy?: string;              // Investment strategy (future)
    riskLevel: 'low' | 'medium' | 'high' | 'custom';
    maxSlippage: number;            // Maximum allowed slippage (%)
    minSpread: number;              // Minimum spread threshold (%)
    tradeSizeLimit?: number;        // Maximum trade size
    autoReinvest: boolean;          // Auto-reinvest profits
  };
  
  // Balance information (off-chain cache)
  balance: {
    lastUpdated: Date;
    totalValueUSD: number;          // Total vault value in USD
    assets: {
      xlm: { amount: number; valueUSD: number };
      usdc: { amount: number; valueUSD: number };
      aqua?: { amount: number; valueUSD: number };
      // Additional assets as needed
    };
    allocations: {
      active: number;               // Funds in active arbitrage
      available: number;            // Available for new opportunities
      reserved: number;             // Reserved for pending executions
    };
  };
  
  // Performance metrics
  performance: {
    totalDeposits: number;          // Total deposits (USD)
    totalWithdrawals: number;       // Total withdrawals (USD)
    netProfit: number;              // Net profit (USD)
    roi: number;                    // Return on investment (%)
    successRate: number;            // Successful arbitrage rate (%)
    avgSpreadCaptured: number;      // Average spread captured (%)
    totalFeesPaid: number;          // Total fees paid to platform
    lastArbitrageAt?: Date;         // Last successful arbitrage
  };
  
  // Activity tracking
  activity: {
    depositCount: number;
    withdrawalCount: number;
    arbitrageCount: number;
    lastActivityAt: Date;
    pendingActions: number;         // Pending deposits/withdrawals
  };
  
  // Security settings
  security: {
    requireConfirmation: boolean;   // Require confirmation for large actions
    withdrawalDelay: number;        // Withdrawal delay (hours)
    maxDailyWithdrawal?: number;    // Maximum daily withdrawal limit
    allowedAssets: string[];        // Allowed assets in vault
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  activatedAt?: Date;               // When vault became active
  lastBalanceSync: Date;            // Last balance synchronization
  lastPerformanceUpdate: Date;      // Last performance calculation
}
```

### Indexes
- `contractAddress`: Unique index for contract lookup
- `ownerId`: For owner-specific queries
- `status`: For filtering by vault status
- `network`: For network-specific queries
- Compound index: `ownerId + status` for user's active vaults
- Index on `balance.totalValueUSD` for sorting/ranking

## API Endpoints

### Vault Management Endpoints
- `POST /api/v1/vaults` - Create new vault (initiates on-chain creation)
- `GET /api/v1/vaults` - Get user vaults
- `GET /api/v1/vaults/:vaultId` - Get specific vault
- `PUT /api/v1/vaults/:vaultId` - Update vault configuration
- `POST /api/v1/vaults/:vaultId/archive` - Archive/close vault

### Balance & Performance Endpoints
- `GET /api/v1/vaults/:vaultId/balance` - Get vault balance
- `GET /api/v1/vaults/:vaultId/performance` - Get performance metrics
- `POST /api/v1/vaults/:vaultId/balance/refresh` - Refresh balance from chain
- `GET /api/v1/vaults/:vaultId/performance/history` - Get performance history

### Activity Endpoints
- `GET /api/v1/vaults/:vaultId/activity` - Get vault activity
- `GET /api/v1/vaults/:vaultId/deposits` - Get deposit history
- `GET /api/v1/vaults/:vaultId/withdrawals` - Get withdrawal history
- `GET /api/v1/vaults/:vaultId/arbitrage` - Get arbitrage history

### Deposit/Withdrawal Coordination
- `POST /api/v1/vaults/:vaultId/deposit/initiate` - Initiate deposit
- `POST /api/v1/vaults/:vaultId/deposit/confirm` - Confirm deposit
- `POST /api/v1/vaults/:vaultId/withdraw/initiate` - Initiate withdrawal
- `POST /api/v1/vaults/:vaultId/withdraw/confirm` - Confirm withdrawal
- `GET /api/v1/vaults/:vaultId/pending-actions` - Get pending actions

### Permission Management
- `POST /api/v1/vaults/:vaultId/managers` - Add manager
- `DELETE /api/v1/vaults/:vaultId/managers/:userId` - Remove manager
- `POST /api/v1/vaults/:vaultId/viewers` - Add viewer
- `DELETE /api/v1/vaults/:vaultId/viewers/:userId` - Remove viewer

### Analytics Endpoints
- `GET /api/v1/vaults/:vaultId/analytics/daily` - Daily performance analytics
- `GET /api/v1/vaults/:vaultId/analytics/comparison` - Compare with other vaults
- `GET /api/v1/vaults/:vaultId/analytics/export` - Export vault data

## Business Logic

### Vault Creation Flow
1. Validate vault configuration parameters
2. Generate unique vault identifier
3. Create off-chain vault document with 'pending' status
4. Trigger on-chain vault creation via smart contract
5. Monitor on-chain creation completion
6. Update vault status to 'active' upon successful creation
7. Emit vault creation event

### Balance Synchronization
1. Query vault contract state via Soroban RPC
2. Parse asset balances from contract data
3. Fetch current market prices for asset valuation
4. Calculate total vault value in USD
5. Update off-chain balance cache
6. Calculate performance metrics
7. Store balance history for tracking
8. Emit balance update events

### Deposit Coordination
1. Validate deposit request (amount, asset, user permissions)
2. Generate deposit transaction parameters
3. Create pending deposit record
4. Return transaction details to frontend for user signing
5. Monitor blockchain for deposit transaction
6. Update vault balance upon confirmation
7. Record deposit activity
8. Emit deposit completion event

### Withdrawal Coordination
1. Validate withdrawal request (amount, user permissions, limits)
2. Check vault has sufficient balance
3. Apply withdrawal delay if configured
4. Generate withdrawal transaction parameters
5. Create pending withdrawal record
6. Return transaction details to frontend for user signing
7. Monitor blockchain for withdrawal transaction
8. Update vault balance upon confirmation
9. Record withdrawal activity
10. Emit withdrawal completion event

### Performance Calculation
1. Calculate ROI: (net profit / total deposits) * 100
2. Calculate success rate: (successful arbitrage / total attempts) * 100
3. Track average spread captured
4. Calculate fee efficiency: (fees paid / net profit) * 100
5. Compare performance against benchmarks
6. Generate performance insights and recommendations

## Integration Points

### Dependencies
- **Users Module**: Vault ownership and permission management
- **Wallets Module**: User wallet addresses for transactions
- **Smart Contract Integration**: Soroban contract interaction
- **Market Module**: Asset price data for valuation
- **Arbitrage Module**: Vault participation in arbitrage
- **Execution Module**: Vault fund usage in executions
- **Analytics Module**: Performance analytics and reporting

### Events Published
- `vault.created` - When new vault is created
- `vault.balance.updated` - When vault balance is updated
- `vault.deposit.completed` - When deposit is completed
- `vault.withdrawal.completed` - When withdrawal is completed
- `vault.performance.updated` - When performance metrics are updated
- `vault.config.updated` - When vault configuration is changed
- `vault.permission.updated` - When permissions are changed

### Events Consumed
- `arbitrage.execution.completed` - To update vault performance
- `market.price.updated` - To update vault valuation
- `user.registered` - To initialize user vault preferences
- `risk.profile.updated` - To adjust vault risk settings

## Configuration

### Environment Variables
```bash
# Vault module configuration
VAULT_BALANCE_SYNC_INTERVAL=300          # 5 minutes between balance syncs
VAULT_PERFORMANCE_UPDATE_INTERVAL=3600   # 1 hour between performance updates
VAULT_MAX_VAULTS_PER_USER=5              # Maximum vaults per user
VAULT_MIN_DEPOSIT_USD=100                # Minimum deposit amount
VAULT_WITHDRAWAL_DELAY_HOURS=24          # Default withdrawal delay
VAULT_AUTO_REINVEST_DEFAULT=true         # Default auto-reinvest setting
```

### Smart Contract Configuration
```typescript
export const vaultContractConfig = {
  networks: {
    testnet: {
      factoryAddress: process.env.VAULT_FACTORY_TESTNET,
      defaultVaultType: 'usdc-xlm',
      creationFeeXLM: 1.0,
    },
    mainnet: {
      factoryAddress: process.env.VAULT_FACTORY_MAINNET,
      defaultVaultType: 'usdc-xlm',
      creationFeeXLM: 1.0,
    },
  },
  supportedAssets: ['XLM', 'USDC', 'AQUA', 'EURC'],
  defaultConfig: {
    minSpread: 0.5,
    maxSlippage: 0.3,
    platformFee: 20,
  },
};
```

## Testing

### Unit Tests
- Vault configuration validation
- Balance calculation logic
- Performance metric calculations
- Permission management logic
- Deposit/withdrawal validation

### Integration Tests
- Vault creation flow with smart contract
- Balance synchronization with Soroban RPC
- Deposit/withdrawal coordination flow
- Permission management integration
- Performance calculation integration

### Smart Contract Integration Tests
- Contract state reading/writing
- Event emission and handling
- Error handling for contract failures
- Gas estimation and optimization

## Phase Implementation

### Phase 1 (MVP)
- Basic vault metadata management
- Balance synchronization with USDC/XLM vaults
- Simple deposit/withdrawal coordination
- Basic performance tracking
- Single-vault per user (initially)

### Phase 2 (Expansion)
- Multi-vault support per user
- Advanced asset support (multi-asset vaults)
- Enhanced performance analytics
- Sophisticated permission system
- Vault grouping and organization

### Phase 3 (AI)
- Intelligent fund allocation across vaults
- Predictive performance optimization
- Risk-adjusted vault recommendations
- Automated configuration optimization
- Anomaly detection and alerting

### Phase 4 (Protocol)
- Protocol treasury vaults
- Governance voting vaults
- Institutional vault features
- Advanced compliance features
- Cross-protocol vault integration

## Error Handling

### Common Errors
- `INSUFFICIENT_BALANCE`: Vault doesn't have sufficient funds
- `WITHDRAWAL_DELAY`: Withdrawal within delay period
- `PERMISSION_DENIED`: User lacks required permissions
- `VAULT_NOT_ACTIVE`: Vault is not in active state
- `CONTRACT_ERROR`: Smart contract interaction failed
- `BALANCE_SYNC_FAILED`: Failed to sync balance from chain
- `DEPOSIT_LIMIT_EXCEEDED`: Deposit exceeds limits
- `WITHDRAWAL_LIMIT_EXCEEDED`: Withdrawal exceeds limits

### Error Responses
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Vault has insufficient balance for this withdrawal",
    "details": {
      "available": 950.50,
      "requested": 1000.00,
      "shortfall": 49.50
    }
  }
}
```

## Performance Considerations

### Database Optimization
- Index on contractAddress for fast lookups
- Index on ownerId for user-specific queries
- Compound indexes for common query patterns
- Consider sharding for large-scale deployments

### Caching Strategy
- Cache vault balances (short TTL)
- Cache performance metrics
- Cache vault configuration
- Implement cache invalidation on updates

### Smart Contract Optimization
- Batch contract calls where possible
- Implement request pooling for RPC calls
- Cache contract state data
- Implement retry logic with exponential backoff

## Security Considerations

### Permission Management
- Implement robust permission checking
- Validate all permission changes
- Audit permission modifications
- Implement role-based access control

### Transaction Security
- Validate all transaction parameters
- Implement proper authorization checks
- Monitor for suspicious transaction patterns
- Implement withdrawal delays and limits

### Data Integrity
- Validate off-chain/on-chain state consistency
- Implement reconciliation processes
- Monitor for data discrepancies
- Regular audit of vault data

### API Security
- Validate all input parameters
- Implement proper authorization checks
- Rate limit sensitive operations
- Monitor for suspicious patterns
- Implement comprehensive logging

## Monitoring

### Key Metrics
- Vault creation rate
- Total vault value under management
- Average vault performance (ROI)
- Deposit/withdrawal success rate
- Balance synchronization success rate

### Alerts
- Failed balance synchronizations
- Suspicious vault activity
- Permission changes
- Performance anomalies
- Contract interaction failures

### Logging
- Vault creation events
- Balance update events
- Deposit/withdrawal events
- Permission change events
- Security-related events

## Migration Considerations

### Data Migration
- Plan for contract address format changes
- Consider vault type schema evolution
- Plan for performance metric calculation changes
- Consider network migration (testnet to mainnet)

### Feature Rollout
- Gradual feature enablement
- A/B testing for new vault features
- Feature flag management
- User education for new features

## Related Modules
- **Users Module**: Vault ownership and permissions
- **Wallets Module**: Transaction coordination
- **Smart Contract Integration**: On-chain vault management
- **Market Module**: Asset pricing for valuation
- **Arbitrage Module**: Vault participation in opportunities
- **Execution Module**: Vault fund usage
- **Analytics Module**: Performance analytics
- **Risk Module**: Vault risk assessment