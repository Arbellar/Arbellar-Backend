import { Router, type Router as ExpressRouter } from 'express';
import { config } from '../config';

/**
 * Main API router for Arbellar Backend
 *
 * This file serves as the central routing configuration for the API.
 * It imports and mounts all domain-specific routers.
 */

const router: ExpressRouter = Router();

// API version prefix
const apiPrefix = config.api.prefix;

/**
 * Health routes - always available without authentication
 */
import { healthRouter } from '../health';
router.use('/health', healthRouter);

/**
 * Domain-specific routes will be added here as they are implemented.
 *
 * Phase 1 (MVP):
 * - Users
 * - Wallets
 * - Vaults
 * - Markets
 * - Arbitrage (basic)
 * - Executions (boundaries)
 * - Trades
 * - Analytics (basic)
 * - Risk (configuration)
 * - Fees (tracking)
 * - Notifications (basic)
 *
 * Each domain will have its own router that handles:
 * - Route definitions
 * - Request validation
 * - Response formatting
 * - Error handling
 */

// Placeholder routes for Phase 1 domains
router.get('/users', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Users endpoint - Implementation pending Phase 1',
      phase: 'MVP (Phase 1)',
      description: 'User management and authentication endpoints',
    },
  });
});

router.get('/wallets', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Wallets endpoint - Implementation pending Phase 1',
      phase: 'MVP (Phase 1)',
      description: 'Wallet association and management endpoints',
    },
  });
});

router.get('/vaults', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Vaults endpoint - Implementation pending Phase 1',
      phase: 'MVP (Phase 1)',
      description: 'Smart vault information and management endpoints',
    },
  });
});

router.get('/markets', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Markets endpoint - Implementation pending Phase 1',
      phase: 'MVP (Phase 1)',
      description: 'Market data and intelligence endpoints',
    },
  });
});

router.get('/arbitrage', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Arbitrage endpoint - Implementation pending Phase 1',
      phase: 'MVP (Phase 1)',
      description: 'Arbitrage opportunity discovery and analysis endpoints',
    },
  });
});

router.get('/executions', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Executions endpoint - Implementation pending Phase 1',
      phase: 'MVP (Phase 1)',
      description: 'Trade execution coordination endpoints',
    },
  });
});

router.get('/trades', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Trades endpoint - Implementation pending Phase 1',
      phase: 'MVP (Phase 1)',
      description: 'Trade history and management endpoints',
    },
  });
});

router.get('/analytics', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Analytics endpoint - Implementation pending Phase 1',
      phase: 'MVP (Phase 1)',
      description: 'Performance analytics and reporting endpoints',
    },
  });
});

router.get('/risk', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Risk endpoint - Implementation pending Phase 1',
      phase: 'MVP (Phase 1)',
      description: 'Risk management and configuration endpoints',
    },
  });
});

router.get('/fees', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Fees endpoint - Implementation pending Phase 1',
      phase: 'MVP (Phase 1)',
      description: 'Fee tracking and distribution endpoints',
    },
  });
});

router.get('/notifications', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Notifications endpoint - Implementation pending Phase 1',
      phase: 'MVP (Phase 1)',
      description: 'Event notification and alert endpoints',
    },
  });
});

/**
 * API documentation route
 */
router.get('/docs', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      api: {
        version: config.api.version,
        prefix: config.api.prefix,
        endpoints: {
          health: `${apiPrefix}/health`,
          users: `${apiPrefix}/users`,
          wallets: `${apiPrefix}/wallets`,
          vaults: `${apiPrefix}/vaults`,
          markets: `${apiPrefix}/markets`,
          arbitrage: `${apiPrefix}/arbitrage`,
          executions: `${apiPrefix}/executions`,
          trades: `${apiPrefix}/trades`,
          analytics: `${apiPrefix}/analytics`,
          risk: `${apiPrefix}/risk`,
          fees: `${apiPrefix}/fees`,
          notifications: `${apiPrefix}/notifications`,
        },
      },
      documentation: {
        repository: 'https://github.com/arbellar/arbellar-backend',
        api_docs: 'https://docs.arbellar.com/api',
        openapi_spec: `${apiPrefix}/openapi.json`, // Future implementation
      },
      status: {
        phase: 'Phase 1 (MVP)',
        environment: config.server.env,
        timestamp: new Date().toISOString(),
      },
    },
  });
});

/**
 * OpenAPI specification route (future implementation)
 */
router.get('/openapi.json', (req, res) => {
  res.status(200).json({
    openapi: '3.0.0',
    info: {
      title: 'Arbellar Backend API',
      version: config.api.version,
      description: 'API for Arbellar - Automated User-Funded Atomic Arbitrage Platform on Stellar',
    },
    servers: [
      {
        url: `http://localhost:${config.server.port}${config.api.prefix}`,
        description: 'Local development server',
      },
    ],
    paths: {
      // Paths will be generated dynamically in Phase 2
    },
    components: {
      // Components will be defined in Phase 2
    },
  });
});

/**
 * API version information
 */
router.get('/version', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      api: {
        version: config.api.version,
        prefix: config.api.prefix,
      },
      application: {
        name: 'Arbellar Backend',
        phase: 'Phase 1 (MVP)',
        environment: config.server.env,
      },
      dependencies: {
        node: process.version,
        express: '^4.18.2',
        typescript: '^5.0.0',
        mongodb: 'via mongoose',
        stellar_sdk: '^11.0.0',
      },
    },
  });
});

/**
 * API status endpoint
 */
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'operational',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.server.env,
      phase: 'Phase 1 (MVP)',
      features: {
        implemented: [
          'API foundation',
          'Health checks',
          'Database integration',
          'Error handling',
          'Structured logging',
          'Configuration management',
        ],
        pending: [
          'User authentication',
          'Market data integration',
          'Arbitrage scanner',
          'Execution engine',
          'Analytics system',
          'Notification system',
        ],
      },
    },
  });
});

export const apiRouter = router;
export default router;
