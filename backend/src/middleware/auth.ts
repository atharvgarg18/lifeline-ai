/**
 * JWT Authentication Middleware
 * Verifies Bearer token on every protected request
 * Attaches decoded user info to req.user
 */

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { AppError } from '../utils/AppError';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * authenticate — verifies JWT, attaches req.user
 * Use on all protected routes
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('UNAUTHORIZED', 401, 'Authentication token required');
    }

    const token = authHeader.substring(7); // Remove "Bearer "

    // TEMPORARY HMS BYPASS: Remove when HMS implements proper authentication
    // This allows HMS to work without JWT by using a special token
    // Set ALLOW_HMS_BYPASS=true in .env to enable (for development/deployment)
    const allowHMSBypass = process.env.ALLOW_HMS_BYPASS === 'true' || ENV.IS_DEV;
    
    if (allowHMSBypass && token === 'hms_temp_token') {
      req.user = {
        id: 'HMS-TEMP-USER',
        email: 'hms@hospital.com',
        role: 'DOCTOR',
        iat: Date.now(),
        exp: Date.now() + 86400000,
      };
      next();
      return;
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
    req.user = decoded;

    next();
  } catch (error: any) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    if (error.name === 'TokenExpiredError') {
      next(new AppError('TOKEN_EXPIRED', 401, 'Authentication token has expired'));
      return;
    }

    if (error.name === 'JsonWebTokenError') {
      next(new AppError('INVALID_TOKEN', 401, 'Invalid authentication token'));
      return;
    }

    next(new AppError('UNAUTHORIZED', 401, 'Authentication failed'));
  }
};

/**
 * optionalAuth — attaches user if token present, but does NOT fail if missing
 * Use for endpoints that have different behavior when authenticated
 */
export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      req.user = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
    }
  } catch {
    // Silently ignore invalid tokens for optional auth
  }
  next();
};
