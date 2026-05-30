/**
 * Standardized HTTP Response Helpers
 * Use these in all controllers for consistent API responses
 */

import type { Response } from 'express';

interface SuccessOptions<T> {
  data: T;
  message?: string;
  statusCode?: number;
  meta?: Record<string, unknown>;
}

interface PaginatedOptions<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  message?: string;
}

/**
 * Send a success response
 */
export const sendSuccess = <T>(
  res: Response,
  { data, message, statusCode = 200, meta }: SuccessOptions<T>
): void => {
  res.status(statusCode).json({
    success: true,
    ...(message && { message }),
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0',
      ...meta,
    },
  });
};

/**
 * Send a paginated success response
 */
export const sendPaginated = <T>(
  res: Response,
  { data, page, limit, total, message }: PaginatedOptions<T>
): void => {
  res.status(200).json({
    success: true,
    ...(message && { message }),
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0',
    },
  });
};

/**
 * Send a created response (201)
 */
export const sendCreated = <T>(res: Response, data: T, message?: string): void => {
  sendSuccess(res, { data, message, statusCode: 201 });
};
