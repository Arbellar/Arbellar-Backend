import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config';
import { errorHandler } from './middleware';
import { healthRouter } from './health';
import { apiRouter } from './routes';

/**
 * Express application setup for Arbellar Backend
 *
 * This is the main application configuration that sets up middleware,
 * routes, and error handling for the Arbellar API.
 */
export const createApp = (): Express => {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: config.cors.origin,
      credentials: true,
    })
  );

  // Request parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Compression
  app.use(compression());

  // Request logging middleware (to be implemented in Phase 2)
  // app.use(requestLogger);

  // Health check route (no authentication required)
  app.use('/health', healthRouter);

  // API routes
  app.use(config.api.prefix, apiRouter);

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found',
      },
    });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
};

/**
 * Application instance for server startup
 */
export const app = createApp();
