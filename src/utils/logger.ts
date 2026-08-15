import winston from 'winston';
import { config } from '../config';

/**
 * Logger utility for Arbellar Backend
 *
 * Provides structured logging with different log levels and formats
 * based on the environment (development vs production).
 */

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for console output
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to winston
winston.addColors(colors);

// Define log format based on environment
const getLogFormat = () => {
  if (config.server.isProduction) {
    return winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    );
  }

  // Development format - more human readable
  return winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
      let log = `${timestamp} [${level}]: ${message}`;

      if (stack) {
        log += `\n${stack}`;
      }

      if (Object.keys(meta).length > 0) {
        log += `\n${JSON.stringify(meta, null, 2)}`;
      }

      return log;
    })
  );
};

// Define transports based on environment
const getTransports = () => {
  const transports: winston.transport[] = [
    new winston.transports.Console({
      level: config.logging.level,
    }),
  ];

  // In production, also log to files
  if (config.server.isProduction) {
    transports.push(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      })
    );
  }

  return transports;
};

// Create the logger instance
export const logger = winston.createLogger({
  level: config.logging.level,
  levels,
  format: getLogFormat(),
  transports: getTransports(),
  // Silently fail if logging fails
  exitOnError: false,
});

/**
 * Structured logging utility functions
 */

// Request logging middleware (to be used in Express middleware)
export const requestLogger = {
  success: (req: any, res: any, responseTime: number) => {
    logger.http('Request completed', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  },

  error: (req: any, error: Error) => {
    logger.error('Request failed', {
      method: req.method,
      url: req.originalUrl,
      error: error.message,
      stack: error.stack,
      ip: req.ip,
    });
  },
};

/**
 * Domain-specific logging utilities
 */

// Database logging
export const dbLogger = {
  query: (collection: string, operation: string, duration: number, filter?: any) => {
    logger.debug('Database query', {
      collection,
      operation,
      duration: `${duration}ms`,
      filter,
    });
  },

  error: (collection: string, operation: string, error: Error) => {
    logger.error('Database error', {
      collection,
      operation,
      error: error.message,
    });
  },
};

// Stellar integration logging
export const stellarLogger = {
  transaction: (hash: string, operation: string, status: string) => {
    logger.info('Stellar transaction', {
      hash,
      operation,
      status,
    });
  },

  error: (operation: string, error: Error) => {
    logger.error('Stellar integration error', {
      operation,
      error: error.message,
    });
  },
};

// Arbitrage scanner logging
export const scannerLogger = {
  opportunity: (pair: string, spread: number, sources: string[]) => {
    logger.info('Arbitrage opportunity detected', {
      pair,
      spread: `${spread.toFixed(2)}%`,
      sources,
      timestamp: new Date().toISOString(),
    });
  },

  scan: (duration: number, opportunities: number) => {
    logger.debug('Scanner completed', {
      duration: `${duration}ms`,
      opportunities,
    });
  },
};

// Execution engine logging
export const executionLogger = {
  started: (opportunityId: string, amount: number) => {
    logger.info('Execution started', {
      opportunityId,
      amount,
      timestamp: new Date().toISOString(),
    });
  },

  completed: (opportunityId: string, profit: number, status: string) => {
    logger.info('Execution completed', {
      opportunityId,
      profit,
      status,
      timestamp: new Date().toISOString(),
    });
  },

  failed: (opportunityId: string, error: Error) => {
    logger.error('Execution failed', {
      opportunityId,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  },
};

// Health check logging
export const healthLogger = {
  check: (service: string, status: string, duration: number) => {
    logger.debug('Health check', {
      service,
      status,
      duration: `${duration}ms`,
    });
  },

  warning: (service: string, issue: string) => {
    logger.warn('Health check warning', {
      service,
      issue,
    });
  },
};

/**
 * Performance monitoring utilities
 */

// Performance timer
export const createTimer = (operation: string) => {
  const startTime = Date.now();

  return {
    end: () => {
      const duration = Date.now() - startTime;
      logger.debug('Operation completed', {
        operation,
        duration: `${duration}ms`,
      });
      return duration;
    },

    log: (level: keyof typeof levels = 'debug', metadata?: any) => {
      const duration = Date.now() - startTime;
      logger.log(level, 'Operation timing', {
        operation,
        duration: `${duration}ms`,
        ...metadata,
      });
      return duration;
    },
  };
};

/**
 * Logging middleware for Express
 * (To be implemented as actual middleware in Phase 2)
 */
export const loggingMiddleware = () => {
  return (req: any, res: any, next: any) => {
    const startTime = Date.now();

    // Log request start
    logger.http('Request started', {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    // Capture response finish
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      requestLogger.success(req, res, responseTime);
    });

    // Capture errors
    res.on('error', (error: Error) => {
      requestLogger.error(req, error);
    });

    next();
  };
};

export default logger;
