import mongoose from 'mongoose';
import { config } from '.';
import { logger } from '../utils/logger';

/**
 * Database configuration and connection management for Arbellar Backend
 *
 * This module handles MongoDB connection setup, error handling, and
 * connection state management using Mongoose ODM.
 */

// Connection state tracking
let isConnected = false;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 5;
const RECONNECT_INTERVAL = 5000; // 5 seconds

/**
 * Establishes connection to MongoDB database
 * @returns Promise that resolves when connection is established
 */
export const connectToDatabase = async (): Promise<void> => {
  if (isConnected) {
    logger.debug('Database already connected');
    return;
  }

  if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
    throw new Error(`Maximum database connection attempts (${MAX_CONNECTION_ATTEMPTS}) exceeded`);
  }

  try {
    connectionAttempts++;

    logger.info(
      `Connecting to MongoDB (attempt ${connectionAttempts}/${MAX_CONNECTION_ATTEMPTS})...`
    );

    await mongoose.connect(config.database.uri, config.database.options);

    isConnected = true;
    connectionAttempts = 0;

    logger.info('MongoDB connected successfully');

    // Set up connection event handlers
    setupConnectionEventHandlers();
  } catch (error) {
    logger.error(`Failed to connect to MongoDB (attempt ${connectionAttempts}):`, error);

    if (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
      logger.info(`Retrying connection in ${RECONNECT_INTERVAL / 1000} seconds...`);
      setTimeout(connectToDatabase, RECONNECT_INTERVAL);
    } else {
      throw error;
    }
  }
};

/**
 * Sets up MongoDB connection event handlers
 */
const setupConnectionEventHandlers = (): void => {
  mongoose.connection.on('connected', () => {
    logger.debug('Mongoose connected to MongoDB');
    isConnected = true;
  });

  mongoose.connection.on('error', (error) => {
    logger.error('Mongoose connection error:', error);
    isConnected = false;
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('Mongoose disconnected from MongoDB');
    isConnected = false;

    // Attempt to reconnect
    if (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
      logger.info('Attempting to reconnect to MongoDB...');
      setTimeout(connectToDatabase, RECONNECT_INTERVAL);
    }
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('Mongoose reconnected to MongoDB');
    isConnected = true;
    connectionAttempts = 0;
  });

  // Close the Mongoose connection when the application exits
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    logger.info('Mongoose connection closed through app termination');
    process.exit(0);
  });
};

/**
 * Closes the database connection
 * @returns Promise that resolves when connection is closed
 */
export const closeDatabaseConnection = async (): Promise<void> => {
  if (!isConnected) {
    logger.debug('Database already disconnected');
    return;
  }

  try {
    await mongoose.connection.close();
    isConnected = false;
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
    throw error;
  }
};

/**
 * Checks if the database is currently connected
 * @returns boolean indicating connection status
 */
export const isDatabaseConnected = (): boolean => {
  return isConnected && mongoose.connection.readyState === 1;
};

/**
 * Gets database connection statistics
 * @returns Object with connection statistics
 */
export const getDatabaseStats = (): {
  connected: boolean;
  readyState: number;
  host: string;
  name: string;
  models: number;
} => {
  const connection = mongoose.connection;

  return {
    connected: isDatabaseConnected(),
    readyState: connection.readyState,
    host: connection.host || 'unknown',
    name: connection.name || 'unknown',
    models: Object.keys(connection.models).length,
  };
};

/**
 * Performs a database health check
 * @returns Promise that resolves to health check result
 */
export const checkDatabaseHealth = async (): Promise<{
  status: 'healthy' | 'unhealthy';
  latency?: number;
  error?: string;
}> => {
  const startTime = Date.now();

  try {
    // Simple ping command to check database responsiveness
    // Check if connection is established and db is available
    if (!mongoose.connection.db) {
      return {
        status: 'unhealthy',
        error: 'Database connection not established',
      };
    }

    await mongoose.connection.db.admin().ping();

    const latency = Date.now() - startTime;

    return {
      status: 'healthy',
      latency,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown database error',
    };
  }
};

// Export mongoose for schema/model creation
export { mongoose };

// Export connection for advanced usage
export const connection = mongoose.connection;
