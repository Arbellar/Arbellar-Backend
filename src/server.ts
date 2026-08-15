import 'dotenv/config';
import { config } from './config';
import { app } from './app';
import { logger } from './utils/logger';
import { connectToDatabase } from './config/database';

/**
 * Arbellar Backend Server
 *
 * Main entry point for the Arbellar backend application.
 * Handles server startup, graceful shutdown, and system initialization.
 */

const server = app.listen(config.server.port, () => {
  logger.info(`🚀 Arbellar Backend server started`);
  logger.info(`   Environment: ${config.server.env}`);
  logger.info(`   Port: ${config.server.port}`);
  logger.info(`   API Prefix: ${config.api.prefix}`);
  logger.info(`   CORS Origin: ${config.cors.origin}`);
  logger.info(`   Node Version: ${process.version}`);
  logger.info(`   PID: ${process.pid}`);
});

// Database connection
connectToDatabase().catch((error) => {
  logger.error('Failed to connect to database:', error);
  process.exit(1);
});

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  try {
    // Close server
    server.close(() => {
      logger.info('HTTP server closed');
    });

    // Close database connections (to be implemented in Phase 2)
    // await closeDatabaseConnections();

    // Close Redis connections (to be implemented in Phase 2)
    // await closeRedisConnections();

    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Signal handlers for graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // In production, might want to restart the process
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // In production, might want to restart the process
  process.exit(1);
});

// Health check endpoint for container orchestration
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// Readiness check (more comprehensive than health check)
app.get('/ready', async (req, res) => {
  // Check database connection
  // Check Redis connection
  // Check external service dependencies

  // For Phase 1, we'll implement basic readiness
  res.status(200).json({
    status: 'ready',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected', // Will be dynamic in Phase 2
      // redis: 'connected', // Phase 2
      // stellar_horizon: 'connected', // Phase 2
    },
  });
});

export default server;
