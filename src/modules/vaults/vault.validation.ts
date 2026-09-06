import Joi from 'joi';
import { ValidationError } from '../../middleware/errorHandler';

/**
 * Vault configuration interface
 */
export interface VaultConfigInput {
  name: string;
  description?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'custom';
  minSpread: number;
  maxSlippage: number;
  tradeSizeLimit?: number;
  autoReinvest: boolean;
}

/**
 * Joi validation schema for Vault configuration
 */
export const vaultConfigSchema = Joi.object<VaultConfigInput>({
  name: Joi.string().trim().required().messages({
    'any.required': 'Vault name is required',
    'string.empty': 'Vault name cannot be empty',
  }),
  description: Joi.string().trim().allow('').optional(),
  riskLevel: Joi.string().valid('low', 'medium', 'high', 'custom').required().messages({
    'any.only': 'riskLevel must be one of: low, medium, high, custom',
    'any.required': 'riskLevel is required',
  }),
  minSpread: Joi.number().positive().required().messages({
    'number.positive': 'minSpread must be a positive number',
    'any.required': 'minSpread is required',
  }),
  maxSlippage: Joi.number().positive().required().messages({
    'number.positive': 'maxSlippage must be a positive number',
    'any.required': 'maxSlippage is required',
  }),
  tradeSizeLimit: Joi.number().positive().optional().messages({
    'number.positive': 'tradeSizeLimit must be a positive number',
  }),
  autoReinvest: Joi.boolean().strict().required().messages({
    'boolean.base': 'autoReinvest must be a boolean',
    'any.required': 'autoReinvest is required',
  }),
}).options({
  stripUnknown: true,
  convert: true,
});

/**
 * Validates a vault configuration object, returning cleaned data or throwing ValidationError.
 *
 * @param config Raw vault configuration input
 * @returns Cleaned VaultConfigInput
 * @throws ValidationError if validation fails
 */
export function validateVaultConfig(config: unknown): VaultConfigInput {
  const { error, value } = vaultConfigSchema.validate(config, {
    abortEarly: false,
  });

  if (error) {
    const details = error.details.map((d) => ({
      message: d.message,
      path: d.path,
      type: d.type,
    }));
    throw new ValidationError(error.message, details);
  }

  return value;
}

/**
 * Checks if a vault configuration object is valid without throwing.
 *
 * @param config Raw vault configuration input
 * @returns boolean indicating validity
 */
export function isValidVaultConfig(config: unknown): boolean {
  const { error } = vaultConfigSchema.validate(config);
  return !error;
}
