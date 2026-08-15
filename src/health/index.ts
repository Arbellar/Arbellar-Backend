import { type Router as ExpressRouter, Router } from 'express';
import { healthLogger, logger } from '../utils/logger';
import { config } from '../config';
import { isDatabaseConnected } from '../config/database';

/**
 * Health check module for Arbellar Backend
 *
 * Provides health check endpoints for monitoring and orchestration.
 * Used by container orchestration systems, load balancers, and monitoring tools.
 */

const router: ExpressRouter = Router();

/**
 * Basic health check endpoint
 *
 * Returns simple health status for container liveness probes.
 * This endpoint should be lightweight and respond quickly.
 */
router.get('/', (req, res) => {
  const startTime = Date.now();

  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'arbellar-backend',
      version: config.api.version,
      environment: config.server.env,
      uptime: process.uptime(),
    };

    const duration = Date.now() - startTime;
    healthLogger.check('basic', 'healthy', duration);

    res.status(200).json(healthStatus);
  } catch (error) {
    const duration = Date.now() - startTime;
    healthLogger.check('basic', 'unhealthy', duration);

    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    });
  }
});

/**
 * Readiness check endpoint
 *
 * Returns comprehensive readiness status for startup probes.
 * Checks all required dependencies and services.
 */
router.get('/ready', async (req, res) => {
  const startTime = Date.now();
  const checks: Record<string, any> = {};

  try {
    // Database connection check
    const dbStartTime = Date.now();
    const dbConnected = isDatabaseConnected();
    checks.database = {
      status: dbConnected ? 'connected' : 'disconnected',
      latency: Date.now() - dbStartTime,
    };

    // Redis connection check (Phase 2)
    // checks.redis = await checkRedisConnection();

    // Stellar Horizon check (Phase 2)
    // checks.stellar_horizon = await checkStellarHorizon();

    // Stellar Soroban RPC check (Phase 2)
    // checks.stellar_soroban = await checkStellarSoroban();

    // External service checks (Phase 2)
    // checks.sdex = await checkSdexApi();
    // checks.soroswap = await checkSoroswapApi();

    // Determine overall status
    const allHealthy = Object.values(checks).every(
      (check: any) => check.status === 'connected' || check.status === 'healthy'
    );

    const overallStatus = allHealthy ? 'ready' : 'not_ready';
    const duration = Date.now() - startTime;

    const readinessStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks,
      duration,
    };

    healthLogger.check('readiness', overallStatus, duration);

    res.status(allHealthy ? 200 : 503).json(readinessStatus);
  } catch (error) {
    const duration = Date.now() - startTime;
    healthLogger.check('readiness', 'error', duration);

    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Readiness check failed',
      checks,
      duration,
    });
  }
});

/**
 * Detailed health check endpoint
 *
 * Returns detailed health information including system metrics.
 * This endpoint is more expensive and should be used sparingly.
 */
router.get('/detailed', (req, res) => {
  const startTime = Date.now();

  try {
    // System metrics
    const memoryUsage = process.memoryUsage();
    const memoryPercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

    const detailedHealth = {
      status: 'healthy',
      timestamp: new Date().toISOString(),

      // Application info
      application: {
        name: 'arbellar-backend',
        version: config.api.version,
        environment: config.server.env,
        nodeVersion: process.version,
        pid: process.pid,
        uptime: process.uptime(),
      },

      // System metrics
      system: {
        memory: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
          external: Math.round(memoryUsage.external / 1024 / 1024), // MB
          arrayBuffers: Math.round(memoryUsage.arrayBuffers / 1024 / 1024), // MB
          heapUsagePercent: Math.round(memoryPercent * 100) / 100,
        },
        cpu: {
          usage: process.cpuUsage(),
          // System CPU usage would require external libraries
        },
        uptime: process.uptime(),
      },

      // Process metrics
      process: {
        argv: process.argv.slice(2), // Hide sensitive info
        execArgv: process.execArgv,
        execPath: process.execPath,
        platform: process.platform,
        arch: process.arch,
        cwd: process.cwd(),
      },

      // Configuration (safe parts only)
      config: {
        server: {
          env: config.server.env,
          port: config.server.port,
        },
        api: {
          prefix: config.api.prefix,
          version: config.api.version,
        },
        stellar: {
          network: config.stellar.network,
        },
      },

      // Performance metrics
      performance: {
        checkDuration: Date.now() - startTime,
        eventLoopDelay: 'N/A', // Would require measurement
        activeHandles: 'N/A', // Would require measurement
        activeRequests: 'N/A', // Would require measurement
      },
    };

    const duration = Date.now() - startTime;
    healthLogger.check('detailed', 'healthy', duration);

    res.status(200).json(detailedHealth);
  } catch (error) {
    const duration = Date.now() - startTime;
    healthLogger.check('detailed', 'error', duration);

    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Detailed health check failed',
      duration,
    });
  }
});

/**
 * Dependency health check endpoint
 *
 * Checks external dependencies individually.
 * Useful for debugging specific service issues.
 */
router.get('/dependencies', async (req, res) => {
  const startTime = Date.now();
  const dependencies: Record<string, any> = {};

  try {
    // Database dependency
    const dbStartTime = Date.now();
    dependencies.database = {
      type: 'mongodb',
      status: isDatabaseConnected() ? 'connected' : 'disconnected',
      latency: Date.now() - dbStartTime,
      config: {
        host: 'configured', // Don't expose actual URI
        poolSize: config.database.options.maxPoolSize,
      },
    };

    // Redis dependency (Phase 2)
    dependencies.redis = {
      type: 'redis',
      status: config.redis.enabled ? 'enabled' : 'disabled',
      config: {
        enabled: config.redis.enabled,
        cacheTtl: config.redis.cacheTtl,
      },
    };

    // Stellar dependencies (Phase 2)
    dependencies.stellar = {
      type: 'stellar',
      network: config.stellar.network,
      services: {
        horizon: {
          url: config.stellar.horizonUrl,
          status: 'not_checked', // Phase 2
        },
        soroban_rpc: {
          url: config.stellar.sorobanRpcUrl,
          status: 'not_checked', // Phase 2
        },
      },
    };

    // Market data dependencies (Phase 2)
    dependencies.market_data = {
      sdex: {
        type: 'sdex',
        url: config.market.sdex.apiUrl,
        status: 'not_checked', // Phase 2
      },
      soroswap: {
        type: 'soroswap',
        api_url: config.market.soroswap.apiUrl,
        graphql_url: config.market.soroswap.graphqlUrl,
        status: 'not_checked', // Phase 2
      },
    };

    const duration = Date.now() - startTime;
    const response = {
      status: 'success',
      timestamp: new Date().toISOString(),
      dependencies,
      duration,
    };

    healthLogger.check('dependencies', 'success', duration);

    res.status(200).json(response);
  } catch (error) {
    const duration = Date.now() - startTime;
    healthLogger.check('dependencies', 'error', duration);

    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Dependency check failed',
      duration,
    });
  }
});

/**
 * Metrics endpoint (Phase 3)
 *
 * Returns application metrics for monitoring and observability.
 * This will be implemented in Phase 3 with proper metrics collection.
 */
router.get('/metrics', (req, res) => {
  // Placeholder for Phase 3 implementation
  res.status(200).json({
    status: 'metrics_not_implemented',
    message: 'Metrics endpoint will be implemented in Phase 3',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Info endpoint
 *
 * Returns basic application information.
 */
router.get('/info', (req, res) => {
  res.status(200).json({
    name: 'Arbellar Backend',
    description: 'Automated User-Funded Atomic Arbitrage Platform on Stellar',
    version: config.api.version,
    environment: config.server.env,
    repository: 'https://github.com/arbellar/arbellar-backend',
    documentation: 'https://docs.arbellar.com',
    phase: '1 (MVP)',
    features: [
      'API Foundation',
      'Database Integration',
      'Health Monitoring',
      'Error Handling',
      'Structured Logging',
    ],
    roadmap: {
      phase1: 'Core MVP - Current',
      phase2: 'Multi-DEX & Multi-Asset Expansion',
      phase3: 'AI Strategy & Automation',
      phase4: 'Flash Loans & Decentralized Governance',
    },
  });
});

export const healthRouter = router;
export default router;
