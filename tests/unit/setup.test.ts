import { describe, it, expect } from 'vitest';

describe('Node.js 22+ Compatibility', () => {
  it('should be running on Node.js 22 or higher', () => {
    const nodeVersion = process.versions.node;
    const majorVersion = parseInt(nodeVersion.split('.')[0], 10);
    
    expect(majorVersion).toBeGreaterThanOrEqual(22);
  });
  
  it('should support ES2022 features', () => {
    // Test ES2022 features
    const privateFieldExample = new (class {
      #privateField = 'private';
      
      getPrivateField() {
        return this.#privateField;
      }
    })();
    
    expect(privateFieldExample.getPrivateField()).toBe('private');
    
    // Test top-level await (if needed)
    // Note: This test file itself doesn't use top-level await
    // but TypeScript config allows it
  });
  
  it('should have proper test environment', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(import.meta.vitest).toBeDefined();
  });
});