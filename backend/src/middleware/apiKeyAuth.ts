/**
 * API Key Authentication Middleware
 * Validates API key in Authorization header or query parameter
 * Allows bypass of JWT authentication for public endpoints like AI analysis
 */

import type { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env';
import { AppError } from '../utils/AppError';

export interface ApiKeyPayload {
  type: 'API_KEY';
  source: 'header' | 'query';
  isApiKey: true;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      apiKey?: ApiKeyPayload;
    }
  }
}

const VALID_API_KEYS = [
  ENV.GOOGLE_CLIENT_ID,
  ENV.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_FIT_API_KEY || 'google-fit-api-key',
];

/**
 * apiKeyAuth — validates API key, allows requests with valid key
 * Use for public endpoints that don't need user authentication
 */
export const apiKeyAuth = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    // Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('X-API-Key ')) {
      const apiKey = authHeader.substring(10); // Remove "X-API-Key "
      if (VALID_API_KEYS.includes(apiKey) && apiKey !== '') {
        req.apiKey = { type: 'API_KEY', source: 'header', isApiKey: true };
        return next();
      }
    }

    // Check query parameter
    const queryApiKey = req.query['api_key'] as string | undefined;
    if (queryApiKey && VALID_API_KEYS.includes(queryApiKey)) {
      req.apiKey = { type: 'API_KEY', source: 'query', isApiKey: true };
      return next();
    }

    // No valid API key found
    throw new AppError('UNAUTHORIZED', 401, 'Valid API key required');
  } catch (error: any) {
    if (error instanceof AppError) {
      next(error);
      return;
    }
    next(new AppError('UNAUTHORIZED', 401, 'Invalid API key'));
  }
};

/**
 * optionalApiKeyAuth — allows requests with valid API key but does NOT fail if missing
 * Use for endpoints that have different behavior when API key is provided
 */
export const optionalApiKeyAuth = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('X-API-Key ')) {
      const apiKey = authHeader.substring(10);
      if (VALID_API_KEYS.includes(apiKey) && apiKey !== '') {
        req.apiKey = { type: 'API_KEY', source: 'header', isApiKey: true };
      }
    }

    const queryApiKey = req.query['api_key'] as string | undefined;
    if (queryApiKey && VALID_API_KEYS.includes(queryApiKey)) {
      req.apiKey = { type: 'API_KEY', source: 'query', isApiKey: true };
    }
  } catch {
    // Silently ignore invalid API keys for optional auth
  }
  next();
};
