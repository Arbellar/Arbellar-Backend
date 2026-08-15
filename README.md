# Arbellar Backend

## Project Overview

Arbellar is an automated **User-Funded Atomic Arbitrage Platform** built on the Stellar blockchain. This repository contains the backend infrastructure that powers the Arbellar platform, providing market intelligence, opportunity discovery, risk analysis, and execution coordination for atomic arbitrage opportunities.

## Core Problem

Traditional arbitrage opportunities in decentralized finance (DeFi) are often inaccessible to retail users due to:
- High capital requirements
- Technical complexity
- Fast-paced execution requirements
- Risk of partial execution
- Infrastructure costs

Arbellar solves this by enabling users to pool capital through smart vaults while the platform's backend infrastructure identifies and executes arbitrage opportunities atomically.

## Solution

Arbellar employs a **user-funded atomic arbitrage architecture** where:
1. Users deposit funds into smart vaults
2. The backend continuously scans for arbitrage opportunities
3. Opportunities are evaluated for profitability and risk
4. Atomic transactions are constructed and coordinated
5. Profits are distributed automatically between users and the platform

## How the Platform Works

```
User Wallet → Smart Vault → Market Intelligence → Opportunity Discovery → 
Profitability Analysis → Risk Validation → Atomic Execution → 
Profit Distribution → Analytics
```

### Key Components:
1. **Market Intelligence**: SDEX orderbook data + Soroswap liquidity routing
2. **Opportunity Discovery**: Independent arbitrage logic layer
3. **Risk Engine**: Slippage, liquidity, and safety evaluations
4. **Execution Coordinator**: Atomic transaction construction and submission
5. **Analytics Engine**: Performance tracking and reporting

## Financial Inclusion Benefits

- **Lower Barriers**: No minimum capital requirements through pooled vaults
- **Reduced Risk**: Atomic execution prevents partial transaction failures
- **Automated**: No need for constant monitoring or manual execution
- **Transparent**: All operations are verifiable on-chain
- **Accessible**: Retail users can participate in sophisticated arbitrage strategies

## Target Market

- **Retail traders** seeking passive yield opportunities
- **Stellar ecosystem users** looking to maximize asset utilization
- **DeFi enthusiasts** interested in automated strategies
- **Passive yield seekers** wanting automated arbitrage exposure
- **Developers** building on Stellar's DeFi ecosystem
- **Future institutional participants** (Phase 3+)

## Revenue Model

- **Performance Fee**: 10–20% of profitable arbitrage executions
- **Zero fees when no positive arbitrage occurs**
- **Execution/Relayer Surcharge** (Phase 2+)
- **Treasury Routing** for protocol sustainability
- **Future Flash-Loan Revenue** (Phase 4)

## Platform Features

### Phase 1 — Core MVP
- User accounts and wallet association
- Vault information management
- USDC/XLM market intelligence
- SDEX orderbook monitoring
- Soroswap liquidity analysis
- Basic profitability analysis
- Risk and slippage evaluation
- Trade execution coordination
- P&L analytics
- Platform fee tracking

### Phase 2 — Multi-DEX & Multi-Asset Expansion
- Additional liquidity sources (Aqua DEX, Phoenix DEX)
- Additional Soroban AMM pools
- Multi-asset support (AQUA/USDC, BTC/USDC, ETH/XLM, EURC/USDC)
- Dynamic spread thresholds
- Network-condition awareness
- User risk profiles
- Advanced analytics and reporting

### Phase 3 — AI Strategy & Automation
- AI strategy engine integration
- Multi-hop arbitrage strategies
- Automated alerts and notifications
- Telegram/Discord integration
- Network optimization
- Predictive market analysis

### Phase 4 — Flash Loans & Decentralized Governance
- Flash-loan protocol integration
- Arbellar token ecosystem
- DAO governance and voting
- Treasury management
- Protocol configuration governance

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Package Manager**: pnpm
- **Blockchain**: Stellar SDK
- **Market Data**: Stellar Horizon API, Soroswap API
- **Smart Contracts**: Soroban RPC
- **Caching**: Redis-ready architecture
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Testing**: Vitest
- **Code Quality**: ESLint, Prettier, TypeScript

## Competitive Advantage

1. **Stellar Infrastructure**: Fast finality (3-5 seconds) and low transaction costs
2. **SDEX Integration**: Direct access to Stellar's native decentralized exchange
3. **Soroban Smart Contracts**: Advanced DeFi capabilities through Soroban
4. **User-Funded Architecture**: Capital efficiency through pooled vaults
5. **Atomic Execution**: Guaranteed all-or-nothing transaction execution
6. **Non-Custodial Design**: Users retain control of their funds
7. **Independent Profitability Engine**: Not reliant on single DEX logic
8. **Progressive Roadmap**: Clear path from MVP to advanced features

## Architecture

### Repository Responsibilities

```
┌───────────────────────────┐
│     Arbellar Frontend     │
│ Next.js / TypeScript      │
└─────────────┬─────────────┘
              │
              │ REST / Realtime APIs
              ▼
┌───────────────────────────┐
│     Arbellar Backend      │
│ Express / Node / TS       │
│                           │
│ API                       │
│ Market Intelligence       │
│ Scanner                   │
│ Risk Engine               │
│ Execution Coordinator     │
│ Analytics                 │
│ Persistence               │
└─────────────┬─────────────┘
        │                │
        ▼                ▼
┌─────────────┐   ┌──────────────────┐
│ Stellar      │   │ Arbellar         │
│ Ecosystem    │   │ Smart Contracts  │
│              │   │ Soroban / Rust   │
│ SDEX         │   │                  │
│ Soroswap     │   │ Vaults           │
│ Horizon/RPC  │   │ Fees             │
└─────────────┘   │ On-chain State   │
                   └──────────────────┘
```

### Frontend Responsibilities
- User interface and interaction
- Wallet connection and management
- Transaction approval/signing UX
- Data visualization and dashboards

### Backend Responsibilities
- API orchestration and versioning
- Market intelligence gathering
- Opportunity discovery and analysis
- Risk evaluation and validation
- Execution coordination and monitoring
- Persistence and analytics
- Off-chain service management

### Smart Contract Responsibilities
- On-chain vault state management
- Atomic fund movement execution
- Fee distribution logic
- Treasury routing
- Emergency protocol controls

## Database Architecture

MongoDB serves as the **off-chain persistence layer** for:
- User profiles and preferences
- Vault metadata and activity
- Market snapshots and historical data
- Arbitrage opportunity tracking
- Trade execution records
- Analytics and performance metrics
- System events and audit logs

**Important**: MongoDB is NOT the source of truth for financial state. Stellar/Soroban remains authoritative for on-chain financial transactions.

## API Architecture

Versioned REST API available at `/api/v1/` with the following resource groups:

- `/api/v1/users` - User management
- `/api/v1/wallets` - Wallet association
- `/api/v1/vaults` - Vault information
- `/api/v1/markets` - Market data and intelligence
- `/api/v1/arbitrage` - Opportunity discovery
- `/api/v1/executions` - Execution coordination
- `/api/v1/trades` - Trade history
- `/api/v1/analytics` - Performance analytics
- `/api/v1/risk` - Risk configuration
- `/api/v1/fees` - Fee tracking
- `/api/v1/notifications` - Event notifications
- `/api/v1/health` - System health checks

## Security Principles

- **Environment Variable Protection**: No secrets in code
- **Request Validation**: All inputs validated using Joi
- **Authentication Boundary**: JWT-based auth (future implementation)
- **Authorization Boundary**: Role-based access control
- **Rate Limiting**: Protection against API abuse
- **CORS Configuration**: Strict origin policies
- **HTTP Security Headers**: Helmet middleware
- **Input Sanitization**: Protection against injection attacks
- **MongoDB Query Safety**: Parameterized queries
- **Structured Error Responses**: No sensitive information leakage
- **Wallet-Address Validation**: Proper Stellar address validation
- **Transaction Verification**: On-chain transaction verification
- **Replay Protection**: Idempotency considerations

## Risk Disclosure

**Important**: Arbitrage opportunities are not guaranteed and involve risk:

- **Market Risk**: Arbitrage spreads can disappear rapidly
- **Liquidity Risk**: Insufficient liquidity for desired trade size
- **Slippage Risk**: Price movement during execution
- **Execution Risk**: Transactions may fail or revert
- **Smart Contract Risk**: Potential vulnerabilities in smart contracts
- **Infrastructure Risk**: Platform or network outages
- **Financial Risk**: Users can lose funds in unsuccessful arbitrage attempts
- **Regulatory Risk**: Changing regulatory environments

Arbellar employs multiple safety mechanisms but cannot eliminate all risks. Users should only participate with funds they can afford to lose.

## Development Roadmap

| Phase | Product Area | Backend Responsibility | Status |
|-------|--------------|------------------------|--------|
| Phase 1 | Core MVP | API, market intelligence, opportunity architecture, risk, execution boundaries, persistence | **Current** |
| Phase 2 | Multi-DEX & Multi-Asset | Expanded market sources, assets, risk profiles, analytics | Planned |
| Phase 3 | AI Strategy & Automation | AI orchestration boundaries, multi-hop strategies, alerts | Planned |
| Phase 4 | Flash Loans & Governance | Liquidity pools, flash-loan APIs, token/governance services | Planned |

## Development Commands

This repository uses **pnpm** for package and dependency management. `npm` and `yarn` are not supported.

### Installation
```bash
pnpm install
```

### Development
```bash
pnpm dev
```

### Building
```bash
pnpm build
```

### Code Quality
```bash
pnpm lint          # Run ESLint
pnpm lint:fix      # Fix ESLint issues
pnpm typecheck     # TypeScript type checking
pnpm format        # Format code with Prettier
pnpm format:check  # Check formatting
```

### Testing
```bash
pnpm test          # Run tests once
pnpm test:watch    # Run tests in watch mode
pnpm test:coverage # Run tests with coverage
```

### Production
```bash
pnpm start
```

### Docker
```bash
docker-compose up  # Start development environment
docker-compose up -d # Start in detached mode
docker-compose down # Stop development environment
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For technical support or questions:
- Create an issue in this repository
- Join our Discord community (coming soon)
- Follow updates on Twitter/X (coming soon)

---

**Disclaimer**: Arbellar is an experimental platform. Use at your own risk. The team is not responsible for any financial losses incurred while using the platform.