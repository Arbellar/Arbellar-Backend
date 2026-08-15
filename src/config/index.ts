import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Configuration module for Arbellar Backend
 *
 * Centralized configuration management that validates and provides
 * typed access to environment variables and application settings.
 */

// Environment validation
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'API_PREFIX',
  'CORS_ORIGIN',
  'STELLAR_NETWORK',
  'STELLAR_HORIZON_URL',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Server configuration
export const serverConfig = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
};

// API configuration
export const apiConfig = {
  prefix: process.env.API_PREFIX || '/api/v1',
  version: '1.0.0',
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
};

// Database configuration
export const databaseConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/arbellar',
  options: {
    maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10', 10),
  },
};

// CORS configuration
export const corsConfig = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

// Stellar configuration
export const stellarConfig = {
  network: process.env.STELLAR_NETWORK || 'testnet',
  horizonUrl: process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org',
  rpcUrl: process.env.STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org',
  sorobanRpcUrl: process.env.STELLAR_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org',
};

// Market data configuration
export const marketConfig = {
  sdex: {
    apiUrl: process.env.SDEX_API_URL || 'https://horizon.stellar.org',
  },
  soroswap: {
    apiUrl: process.env.SOROSWAP_API_URL || 'https://api.soroswap.finance',
    graphqlUrl:
      process.env.SOROSWAP_GRAPHQL_URL || 'https://api.thegraph.com/subgraphs/name/soroswap',
  },
};

// Redis configuration (optional for Phase 1)
export const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  cacheTtl: parseInt(process.env.REDIS_CACHE_TTL || '300', 10),
  enabled: !!process.env.REDIS_URL,
};

// Scanner configuration
export const scannerConfig = {
  intervalMs: parseInt(process.env.SCANNER_INTERVAL_MS || '1000', 10),
  minSpreadThreshold: parseFloat(process.env.MIN_SPREAD_THRESHOLD || '0.5'),
  maxSlippageGuard: parseFloat(process.env.MAX_SLIPPAGE_GUARD || '0.3'),
};

// Risk configuration
export const riskConfig = {
  defaultTradeSizeLimit: parseFloat(process.env.DEFAULT_TRADE_SIZE_LIMIT || '1000'),
  defaultMaxSlippage: parseFloat(process.env.DEFAULT_MAX_SLIPPAGE || '0.5'),
};

// Platform fees configuration
export const feesConfig = {
  platformFeePercentage: parseFloat(process.env.PLATFORM_FEE_PERCENTAGE || '20'),
  userProfitPercentage: parseFloat(process.env.USER_PROFIT_PERCENTAGE || '80'),
};

// Logging configuration
export const loggingConfig = {
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.LOG_FORMAT || 'json',
};

// Security configuration
export const securityConfig = {
  jwtSecret: process.env.JWT_SECRET || 'change_this_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
};

// Health check configuration
export const healthConfig = {
  timeout: parseInt(process.env.HEALTH_CHECK_TIMEOUT || '5000', 10),
  readinessTimeout: parseInt(process.env.READINESS_CHECK_TIMEOUT || '10000', 10),
};

// Export consolidated configuration
export const config = {
  server: serverConfig,
  api: apiConfig,
  database: databaseConfig,
  cors: corsConfig,
  stellar: stellarConfig,
  market: marketConfig,
  redis: redisConfig,
  scanner: scannerConfig,
  risk: riskConfig,
  fees: feesConfig,
  logging: loggingConfig,
  security: securityConfig,
  health: healthConfig,
};

// Type definitions for configuration
export type Config = typeof config;
export type ServerConfig = typeof serverConfig;
export type ApiConfig = typeof apiConfig;
export type DatabaseConfig = typeof databaseConfig;
export type StellarConfig = typeof stellarConfig;
export type MarketConfig = typeof marketConfig;
export type ScannerConfig = typeof scannerConfig;
export type RiskConfig = typeof riskConfig;

export default config;
