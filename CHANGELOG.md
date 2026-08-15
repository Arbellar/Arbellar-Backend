# Changelog

All notable changes to the Arbellar Backend project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Updated
- Node.js requirement upgraded from 20.x to 22.x
- CI/CD workflows updated to use Node.js 22.x only (removed deprecated Node.js 20.x)
- ESLint configuration migrated to flat config format (`eslint.config.js`) for ESLint v9 compatibility
- TypeScript module resolution updated to `node16` for modern Node.js compatibility
- Test coverage thresholds adjusted for current development stage
- `pnpm-lock.yaml` now tracked in version control for CI reproducibility

### Fixed
- CI pipeline failing due to missing `pnpm-lock.yaml` in repository
- ESLint v9 not finding configuration file (migrated from `.eslintrc.js` to `eslint.config.js`)
- TypeScript deprecation warnings for `moduleResolution` and `baseUrl` options

## [0.1.0] - 2024-08-15

### Added
- Initial project structure and architecture
- Complete TypeScript configuration with modern ES2022 target
- Express.js application foundation with modular architecture
- MongoDB integration with Mongoose ODM
- Comprehensive error handling middleware with custom error classes
- Structured logging with Winston
- Health check endpoints for container orchestration
- Versioned REST API foundation (/api/v1)
- Docker containerization with multi-stage builds
- GitHub Actions CI/CD workflows
- Complete documentation structure with README files
- Four-phase product roadmap (MVP → Expansion → AI → Protocol)
- Domain module structure (Users, Wallets, Vaults, Markets, Arbitrage, etc.)
- Integration layer architecture (Stellar, SDEX, Soroswap, Soroban)
- Security architecture with environment variable management
- Non-custodial design documentation
- Testing foundation with Vitest configuration
- Code quality tools (ESLint, Prettier)
- Development scripts and utilities
- Contribution guidelines

### Updated
- Node.js requirement upgraded from 18.x to 20.x (22.x recommended)
- All dependencies updated to latest versions compatible with Node.js 20+
- CI/CD workflows updated to test on Node.js 20.x and 22.x
- Docker images updated to use Node.js 22 Alpine base
- TypeScript configuration optimized for modern Node.js features
- ESLint configuration updated for ES2024 features
- Development environment setup for Node.js 20+ compatibility

### Fixed
- Package manager specification to use pnpm exclusively
- Removed any references to npm or yarn lockfiles
- Updated all documentation to reflect Node.js 20+ requirements
- Ensured compatibility with modern Node.js features (ES2022+)
- CI pipeline configuration for reliable builds and tests

### Technical Features
- **Node.js**: 20.x or higher (22.x recommended)
- **TypeScript**: 5.5.0 with strict configuration
- **Express**: 4.18.2 with middleware chain
- **MongoDB**: 8.0.0 with connection pooling
- **Testing**: Vitest with coverage reporting
- **Containerization**: Docker with multi-stage builds
- **CI/CD**: GitHub Actions with automated testing and builds
- **Code Quality**: ESLint + Prettier with TypeScript support
- **Logging**: Structured JSON logging with Winston
- **Error Handling**: Custom error classes with operational vs programming errors
- **Health Checks**: Comprehensive health monitoring endpoints
- **API Versioning**: REST API with /api/v1 prefix
- **Documentation**: Complete architectural documentation
- **Modular Design**: Domain-driven architecture with clean separation

### Architecture Highlights
- **Four-Phase Roadmap**: Clear progression from MVP to advanced features
- **Non-Custodial Design**: Backend coordinates but doesn't control funds
- **Modular Structure**: Self-contained domain modules with clear interfaces
- **Integration Layer**: Abstracted external service communication
- **Event-Driven**: Boundaries for future event-driven architecture
- **Observability**: Comprehensive logging, monitoring, and health checks
- **Security-First**: Environment variables, validation, no secrets in code
- **Scalability**: Stateless design, connection pooling, caching boundaries
- **Type Safety**: Full TypeScript support with strict configuration
- **Maintainability**: Consistent patterns, comprehensive documentation

### Phase 1 (MVP) Foundation Complete
- All architectural boundaries established for future implementation
- No actual arbitrage algorithms implemented (as per requirements)
- Ready for implementation of:
  - User authentication and management
  - Wallet association and verification
  - Vault metadata and fund tracking
  - Market intelligence gathering
  - Arbitrage opportunity discovery
  - Execution coordination
  - Risk management
  - Analytics and reporting

### Next Steps
- Begin Phase 1 implementation following established architecture
- Implement user authentication and registration
- Add Stellar wallet integration
- Develop market data aggregation
- Build arbitrage scanner foundation
- Create execution coordination system
- Implement analytics and reporting

[0.1.0]: https://github.com/arbellar/arbellar-backend/releases/tag/v0.1.0