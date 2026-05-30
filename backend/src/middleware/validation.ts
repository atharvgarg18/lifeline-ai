/**
 * Request Validation Middleware
 * Validates request body, params, or query using Joi schemas
 *
 * Usage:
 *   router.post('/sos/trigger', validateRequest(schema), controller.handler)
 *   router.get('/:id', validateRequest(schema, 'params'), controller.handler)
 */

import type { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/AppError';

type ValidationTarget = 'body' | 'params' | 'query';

export const validateRequest = (schema: Joi.Schema, target: ValidationTarget = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const data = req[target];

    const { error, value } = schema.validate(data, {
      abortEarly: false, // Collect ALL validation errors, not just first
      stripUnknown: true, // Remove unknown fields silently
      convert: true,      // Allow type coercion (string "5" → number 5)
    });

    if (error) {
      const details: Record<string, string> = {};
      error.details.forEach((detail) => {
        const key = detail.path.join('.');
        details[key] = detail.message.replace(/['"]/g, '');
      });

      next(
        new AppError('VALIDATION_ERROR', 400, 'Request validation failed', details as any)
      );
      return;
    }

    // Replace the request data with the validated (and stripped) value
    (req as any)[target] = value;
    next();
  };
};
