import { describe, expect, it } from 'vitest';
import { isValidVaultConfig, validateVaultConfig, vaultConfigSchema } from './vault.validation';
import { ValidationError } from '../../middleware/errorHandler';

describe('Vault Configuration Validation', () => {
  const validConfig = {
    name: 'Yield Arbitrage Vault',
    description: 'Automated XLM/USDC arbitrage vault',
    riskLevel: 'medium',
    minSpread: 0.5,
    maxSlippage: 0.2,
    tradeSizeLimit: 1000,
    autoReinvest: true,
  };

  it('validates a correct vault configuration and returns cleaned data', () => {
    expect(vaultConfigSchema).toBeDefined();
    const result = validateVaultConfig(validConfig);
    expect(result).toEqual(validConfig);
    expect(isValidVaultConfig(validConfig)).toBe(true);
  });

  it('strips unknown fields during validation', () => {
    const inputWithExtra = {
      ...validConfig,
      unknownProperty: 'should be stripped',
    };
    const result = validateVaultConfig(inputWithExtra);
    expect(result).not.toHaveProperty('unknownProperty');
    expect(result.name).toBe(validConfig.name);
  });

  it('fails when name is missing', () => {
    const { name: _name, ...invalidConfig } = validConfig;
    expect(() => validateVaultConfig(invalidConfig)).toThrow(ValidationError);
    expect(isValidVaultConfig(invalidConfig)).toBe(false);
  });

  it('fails when riskLevel is invalid', () => {
    const invalidConfig = {
      ...validConfig,
      riskLevel: 'ultra-high',
    };
    expect(() => validateVaultConfig(invalidConfig)).toThrow(ValidationError);
    expect(isValidVaultConfig(invalidConfig)).toBe(false);
  });

  it('fails when minSpread is zero or negative', () => {
    expect(() => validateVaultConfig({ ...validConfig, minSpread: 0 })).toThrow(ValidationError);
    expect(() => validateVaultConfig({ ...validConfig, minSpread: -1 })).toThrow(ValidationError);
  });

  it('fails when maxSlippage is zero or negative', () => {
    expect(() => validateVaultConfig({ ...validConfig, maxSlippage: 0 })).toThrow(ValidationError);
    expect(() => validateVaultConfig({ ...validConfig, maxSlippage: -0.5 })).toThrow(
      ValidationError
    );
  });

  it('fails when autoReinvest is not a boolean', () => {
    expect(() => validateVaultConfig({ ...validConfig, autoReinvest: 'yes' })).toThrow(
      ValidationError
    );
    expect(() => validateVaultConfig({ ...validConfig, autoReinvest: 1 })).toThrow(ValidationError);
  });

  it('allows optional description and tradeSizeLimit to be omitted', () => {
    const minimalConfig = {
      name: 'Minimal Vault',
      riskLevel: 'low',
      minSpread: 0.1,
      maxSlippage: 0.1,
      autoReinvest: false,
    };
    const result = validateVaultConfig(minimalConfig);
    expect(result.name).toBe('Minimal Vault');
    expect(isValidVaultConfig(minimalConfig)).toBe(true);
  });
});
