/**
 * Global Error Handler Middleware
 * Catches all errors passed via next(error) and returns standardized responses
 * Must be the LAST middleware registered in Express
 */

import type { Request, Response, NextFunction } from 'express';
import { AppError, isAppError } from '../utils/AppError';
import { ENV } from '../config/env';

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log the error
  console.error(`[ERROR] ${req.method} ${req.path}`, {
    message: error.message,
    stack: ENV.IS_DEV ? error.stack : undefined,
    ...(isAppError(error) && { code: error.code, statusCode: error.statusCode }),
  });

  // Handle AppError (our own business errors)
  if (isAppError(error)) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
        ...(ENV.IS_DEV && error.details && { details: error.details }),
      },
    });
    return;
  }

  // Handle Mongoose Validation Errors
  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        statusCode: 400,
        ...(ENV.IS_DEV && { details: { raw: error.message } }),
      },
    });
    return;
  }

  // Handle Mongoose Duplicate Key Errors (code 11000)
  if ((error as any).code === 11000) {
    const field = Object.keys((error as any).keyPattern || {})[0] || 'field';
    res.status(409).json({
      success: false,
      error: {
        code: 'CONFLICT',
        message: `Duplicate value for ${field}`,
        statusCode: 409,
      },
    });
    return;
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
        statusCode: 401,
      },
    });
    return;
  }

  // Catch-all: unexpected server error
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: ENV.IS_DEV ? error.message : 'An unexpected error occurred',
      statusCode: 500,
    },
  });
};

/**
 * 404 Not Found handler — register BEFORE errorHandler, AFTER all routes
 */
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError('NOT_FOUND', 404, `Route ${req.method} ${req.path} not found`));
};
