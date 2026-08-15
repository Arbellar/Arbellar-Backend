# Wallets Module

## Overview
The Wallets module manages Stellar wallet association, verification, and metadata storage for Arbellar users. This module handles the link between user accounts and their Stellar wallets while maintaining security and data integrity.

## Responsibilities

### Core Responsibilities
- **Wallet Association**: Link Stellar wallets to user accounts with proper validation
- **Wallet Verification**: Verify wallet ownership through cryptographic proofs
- **Metadata Management**: Store and manage wallet metadata (nicknames, descriptions)
- **Balance Tracking**: Track wallet balances (off-chain, for display purposes)
- **Security Validation**: Validate wallet addresses and ensure security standards
- **Relationship Management**: Manage user-wallet relationships and permissions

### Phase-Specific Responsibilities
- **Phase 1 (MVP)**: Basic wallet association, address validation, metadata storage
- **Phase 2 (Expansion)**: Advanced verification, multi-wallet support, enhanced security
- **Phase 3 (AI)**: Wallet behavior analysis, risk scoring, intelligent recommendations
- **Phase 4 (Protocol)**: Protocol wallet integration, governance wallet support

## Data Model

### Wallet Document Structure
```typescript
interface Wallet {
  _id: ObjectId;
  userId: ObjectId;                // Reference to user
  address: string;                 // Stellar public address (G...)
  network: 'testnet' | 'mainnet';  // Stellar network
  type: 'personal' | 'vault' | 'institutional';  // Wallet type
  status: 'pending' | 'verified' | 'suspended' | 'revoked';
  
  // Verification information
  verification: {
    method: 'signature' | 'transaction' | 'manual';
    verifiedAt: Date;
    expiresAt?: Date;              // For temporary verifications
    proof?: string;                // Verification proof data
  };
  
  // Metadata
  metadata: {
    nickname?: string;            // User-defined nickname
    description?: string;         // Optional description
    tags: string[];               // Categorization tags
    isDefault: boolean;           // Primary/default wallet
    isHidden: boolean;            // Hidden from UI
  };
  
  // Balance information (off-chain cache)
  balance: {
    lastUpdated: Date;
    xlm: number;                  // XLM balance
    usdc: number;                 // USDC balance
    aqua?: number;                // AQUA balance
    // Additional assets as needed
    totalValueUSD?: number;       // Estimated total value
  };
  
  // Security settings
  security: {
    requireConfirmation: boolean;  // Require confirmation for transactions
    maxTransactionValue?: number;  // Maximum transaction value limit
    allowedOperations: string[];   // Allowed operation types
  };
  
  // Activity tracking
  activity: {
    lastActive: Date;
    transactionCount: number;
    totalVolume: number;          // Total transaction volume
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  verifiedAt?: Date;
  lastBalanceCheck: Date;
}
```

### Indexes
- `address`: Unique index for wallet lookup
- `userId`: For user-wallet queries
- `status`: For filtering by verification status
- `network`: For network-specific queries
- Compound index: `userId + isDefault` for primary wallet lookup

## API Endpoints

### Wallet Management Endpoints
- `POST /api/v1/wallets` - Associate new wallet
- `GET /api/v1/wallets` - Get user wallets
- `GET /api/v1/wallets/:walletId` - Get specific wallet
- `PUT /api/v1/wallets/:walletId` - Update wallet metadata
- `DELETE /api/v1/wallets/:walletId` - Remove wallet association

### Verification Endpoints
- `POST /api/v1/wallets/:walletId/verify` - Initiate wallet verification
- `POST /api/v1/wallets/:walletId/verify/callback` - Verification callback
- `GET /api/v1/wallets/:walletId/verification-status` - Check verification status

### Balance Endpoints
- `GET /api/v1/wallets/:walletId/balance` - Get wallet balance
- `POST /api/v1/wallets/:walletId/balance/refresh` - Refresh balance
- `GET /api/v1/wallets/:walletId/balance/history` - Get balance history

### Security Endpoints
- `PUT /api/v1/wallets/:walletId/security` - Update security settings
- `POST /api/v1/wallets/:walletId/suspend` - Suspend wallet
- `POST /api/v1/wallets/:walletId/reactivate` - Reactivate wallet

### Utility Endpoints
- `POST /api/v1/wallets/validate` - Validate Stellar address
- `GET /api/v1/wallets/stats` - Get wallet statistics
- `POST /api/v1/wallets/:walletId/set-default` - Set as default wallet

## Business Logic

### Wallet Association Flow
1. Validate Stellar address format (G... starting with G)
2. Check address doesn't already exist in system
3. Create wallet document with 'pending' status
4. Generate verification challenge (signature request)
5. Store verification proof requirements
6. Return wallet data with verification instructions

### Wallet Verification Flow
1. User signs verification message with wallet private key
2. Submit signed message to verification endpoint
3. Verify signature matches wallet address
4. Update wallet status to 'verified'
5. Store verification proof and timestamp
6. Fetch initial balance from Stellar network
7. Emit wallet verification event

### Balance Synchronization
1. Scheduled job fetches balances from Stellar Horizon
2. Parse account data for asset balances
3. Convert to USD equivalents using market rates
4. Update wallet balance cache
5. Store balance history for tracking
6. Emit balance update events

### Security Validation
1. Validate all Stellar addresses (format, checksum)
2. Implement rate limiting for verification attempts
3. Monitor for suspicious association patterns
4. Implement wallet suspension for security issues
5. Maintain audit trail of all wallet operations

## Integration Points

### Dependencies
- **Users Module**: User-wallet relationship management
- **Stellar Integration**: Horizon API for balance checks
- **Market Module**: Asset price data for USD conversion
- **Risk Module**: Wallet risk scoring and monitoring

### Events Published
- `wallet.associated` - When wallet is associated
- `wallet.verified` - When wallet verification completes
- `wallet.balance.updated` - When balance is updated
- `wallet.suspended` - When wallet is suspended
- `wallet.removed` - When wallet association is removed

### Events Consumed
- `user.registered` - To initialize user wallet preferences
- `market.price.updated` - To update USD balance values
- `risk.alert.triggered` - To potentially suspend risky wallets
- `vault.created` - To link vault wallets

## Configuration

### Environment Variables
```bash
# Wallet module configuration
WALLET_VERIFICATION_TIMEOUT=300           # 5 minutes for verification
WALLET_BALANCE_REFRESH_INTERVAL=300       # 5 minutes between balance checks
WALLET_MAX_ASSOCIATIONS_PER_USER=10       # Maximum wallets per user
WALLET_MIN_BALANCE_XLM=1                  # Minimum XLM balance requirement
WALLET_VERIFICATION_REQUIRED=true         # Require wallet verification
```

### Stellar Network Configuration
```typescript
export const walletStellarConfig = {
  networks: {
    testnet: {
      horizonUrl: 'https://horizon-testnet.stellar.org',
      networkPassphrase: 'Test SDF Network ; September 2015',
    },
    mainnet: {
      horizonUrl: 'https://horizon.stellar.org',
      networkPassphrase: 'Public Global Stellar Network ; September 2015',
    },
  },
  defaultNetwork: process.env.STELLAR_NETWORK || 'testnet',
};
```

## Testing

### Unit Tests
- Stellar address validation
- Wallet association logic
- Verification signature validation
- Balance calculation logic
- Security rule enforcement

### Integration Tests
- Complete wallet association flow
- Verification with Stellar testnet
- Balance synchronization with Horizon
- User-wallet relationship management
- Security feature integration

### Security Tests
- Address validation security
- Signature verification security
- Rate limiting effectiveness
- Data privacy validation
- Authorization checks

## Phase Implementation

### Phase 1 (MVP)
- Basic wallet association with address validation
- Simple verification via transaction or signature
- Balance fetching from Stellar Horizon
- Basic metadata management
- User-wallet relationship management

### Phase 2 (Expansion)
- Advanced verification methods
- Multi-wallet support with primary/secondary
- Enhanced balance tracking with history
- Wallet grouping and organization
- Advanced security features

### Phase 3 (AI)
- Wallet behavior analysis
- Risk scoring based on activity
- Intelligent wallet recommendations
- Predictive balance forecasting
- Anomaly detection

### Phase 4 (Protocol)
- Protocol wallet integration
- Governance voting wallet support
- Advanced compliance features
- Institutional wallet support
- Protocol-specific wallet features

## Error Handling

### Common Errors
- `INVALID_ADDRESS`: Invalid Stellar address format
- `ADDRESS_EXISTS`: Wallet already associated
- `VERIFICATION_FAILED`: Wallet verification failed
- `VERIFICATION_EXPIRED`: Verification timeout
- `WALLET_NOT_FOUND`: Wallet does not exist
- `INSUFFICIENT_PERMISSION`: User doesn't own wallet
- `BALANCE_FETCH_FAILED`: Failed to fetch balance

### Error Responses
```json
{
  "success": false,
  "error": {
    "code": "VERIFICATION_FAILED",
    "message": "Wallet verification failed. Please try again."
  }
}
```

## Performance Considerations

### Database Optimization
- Index on address field for fast lookups
- Index on userId for user-specific queries
- Compound indexes for common query patterns
- Consider sharding for large-scale deployments

### Caching Strategy
- Cache wallet balances (short TTL)
- Cache verification status
- Cache wallet metadata
- Implement cache invalidation on updates

### Stellar API Optimization
- Batch balance requests where possible
- Implement request pooling for Horizon API
- Cache Stellar account data
- Implement retry logic with exponential backoff

## Security Considerations

### Address Validation
- Validate Stellar address format (G...)
- Verify address checksum
- Reject obviously invalid addresses
- Implement address normalization

### Verification Security
- Use cryptographically secure random challenges
- Implement proper signature verification
- Set reasonable verification timeouts
- Limit verification attempts
- Store verification proofs securely

### Data Privacy
- Never store private keys or seeds
- Minimize stored wallet data
- Encrypt sensitive metadata
- Implement proper access controls
- Regular security audits

### API Security
- Validate all input parameters
- Implement proper authorization checks
- Rate limit sensitive operations
- Monitor for suspicious patterns
- Implement comprehensive logging

## Monitoring

### Key Metrics
- Wallet association rate
- Verification success rate
- Balance synchronization success rate
- Average wallet balance
- Wallet activity levels

### Alerts
- Failed verification attempts
- Balance synchronization failures
- Suspicious association patterns
- Security rule violations
- API rate limit breaches

### Logging
- Wallet association events
- Verification attempts (success/failure)
- Balance update events
- Security-related events
- Administrative actions

## Migration Considerations

### Data Migration
- Plan for address format changes
- Consider verification method updates
- Plan for balance history schema evolution
- Consider network migration (testnet to mainnet)

### Feature Rollout
- Gradual verification requirement enforcement
- A/B testing for new wallet features
- Feature flag management
- User education for new features

## Related Modules
- **Users Module**: User account relationships
- **Vaults Module**: Vault wallet relationships
- **Stellar Integration**: Network communication
- **Market Module**: Asset price data
- **Risk Module**: Wallet risk assessment
- **Analytics Module**: Wallet activity analytics