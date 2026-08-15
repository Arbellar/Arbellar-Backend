import { vi } from 'vitest';

// Global test setup
beforeAll(() => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  // Mock console methods to reduce noise
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'debug').mockImplementation(() => {});
  vi.spyOn(console, 'info').mockImplementation(() => {});
  
  // Keep errors visible
  vi.spyOn(console, 'error').mockImplementation((...args) => {
    // Allow errors to be seen during tests
    console.warn('Error during test:', ...args);
  });
});

afterAll(() => {
  // Restore console methods
  vi.restoreAllMocks();
});

// Clear mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});