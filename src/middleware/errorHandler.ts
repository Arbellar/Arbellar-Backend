import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Error types for Arbellar Backend
 *
 * These error types define the standard error structure
 * used throughout the application.
 */

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
  isOperational?: boolean;
}

/**
 * Base error class for operational errors
 */
export class OperationalError extends Error implements AppError {
  statusCode: number;
  code: string;
  details?: any;
  isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error for request validation failures
 */
export class ValidationError extends OperationalError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

/**
 * Authentication error for unauthorized access
 */
export class AuthenticationError extends OperationalError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

/**
 * Authorization error for insufficient permissions
 */
export class AuthorizationError extends OperationalError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

/**
 * Not found error for missing resources
 */
export class NotFoundError extends OperationalError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERROR');
  }
}

/**
 * Conflict error for resource conflicts
 */
export class ConflictError extends OperationalError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

/**
 * Rate limit error for too many requests
 */
export class RateLimitError extends OperationalError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR');
  }
}

/**
 * External service error for third-party service failures
 */
export class ExternalServiceError extends OperationalError {
  constructor(service: string, message: string) {
    super(`External service error: ${service} - ${message}`, 502, 'EXTERNAL_SERVICE_ERROR');
  }
}

/**
 * Blockchain error for Stellar/blockchain-related failures
 */
export class BlockchainError extends OperationalError {
  constructor(message: string, details?: any) {
    super(message, 503, 'BLOCKCHAIN_ERROR', details);
  }
}

/**
 * Market data error for market data retrieval failures
 */
export class MarketDataError extends OperationalError {
  constructor(source: string, message: string) {
    super(`Market data error: ${source} - ${message}`, 502, 'MARKET_DATA_ERROR');
  }
}

/**
 * Execution error for trade execution failures
 */
export class ExecutionError extends OperationalError {
  constructor(message: string, details?: any) {
    super(message, 500, 'EXECUTION_ERROR', details);
  }
}

/**
 * Database error for database operation failures
 */
export class DatabaseError extends OperationalError {
  constructor(operation: string, message: string) {
    super(`Database error: ${operation} - ${message}`, 500, 'DATABASE_ERROR');
  }
}

/**
 * Global error handler middleware
 *
 * This middleware catches all errors in the Express application
 * and formats them into a consistent JSON response.
 */
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default error structure
  let statusCode = 500;
  let errorCode = 'INTERNAL_ERROR';
  let message = 'Internal server error';
  let details: any = undefined;
  let isOperational = false;

  // Handle known error types
  if (error instanceof OperationalError) {
    statusCode = error.statusCode;
    errorCode = error.code || 'INTERNAL_ERROR';
    message = error.message;
    details = error.details;
    isOperational = error.isOperational;
  } else if (error instanceof Error) {
    message = error.message;

    // Check for common HTTP status codes from external libraries
    if ('statusCode' in error && typeof (error as any).statusCode === 'number') {
      statusCode = (error as any).statusCode;
    }

    // Check for Mongoose validation errors
    if (error.name === 'ValidationError') {
      statusCode = 400;
      errorCode = 'VALIDATION_ERROR';
      details = (error as any).errors;
    }

    // Check for Mongoose duplicate key errors
    if (error.name === 'MongoServerError' && (error as any).code === 11000) {
      statusCode = 409;
      errorCode = 'CONFLICT_ERROR';
      message = 'Duplicate key error';
      details = (error as any).keyValue;
    }
  }

  // Log the error
  if (statusCode >= 500) {
    // Server errors should be logged as errors
    logger.error('Server error:', {
      method: req.method,
      url: req.originalUrl,
      statusCode,
      errorCode,
      message,
      details,
      stack: error.stack,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  } else if (statusCode >= 400) {
    // Client errors should be logged as warnings
    logger.warn('Client error:', {
      method: req.method,
      url: req.originalUrl,
      statusCode,
      errorCode,
      message,
      details,
      ip: req.ip,
    });
  }

  // Prepare error response
  const errorResponse: any = {
    success: false,
    error: {
      code: errorCode,
      message,
    },
  };

  // Add details if present
  if (details) {
    errorResponse.error.details = details;
  }

  // Include stack trace in development for debugging
  if (process.env.NODE_ENV === 'development' && error.stack) {
    errorResponse.error.stack = error.stack;
  }

  // Send response
  res.status(statusCode).json(errorResponse);
};

/**
 * Async handler wrapper for Express routes
 *
 * This wrapper catches async errors and passes them to the
 * errorHandler middleware.
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Validation middleware helper
 *
 * Creates middleware that validates request data against a schema
 * and throws ValidationError if validation fails.
 */
export const validateRequest = (validator: (data: any) => any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body, params, and query
      const data = {
        body: req.body,
        params: req.params,
        query: req.query,
      };

      const result = validator(data);

      // If validation returns cleaned data, replace the request data
      if (result.body) req.body = result.body;
      if (result.params) req.params = result.params;
      if (result.query) req.query = result.query;

      next();
    } catch (error) {
      if (error instanceof Error) {
        next(new ValidationError(error.message));
      } else {
        next(new ValidationError('Validation failed'));
      }
    }
  };
};

/**
 * Not found middleware
 *
 * This middleware catches requests to undefined routes
 * and throws a NotFoundError.
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl}`));
};

export default {
  errorHandler,
  asyncHandler,
  validateRequest,
  notFoundHandler,
  OperationalError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ExternalServiceError,
  BlockchainError,
  MarketDataError,
  ExecutionError,
  DatabaseError,
};
