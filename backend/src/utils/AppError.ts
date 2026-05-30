/**
 * AppError — Custom Application Error
 * Use this for all business-level errors to get standardized HTTP responses
 *
 * Usage:
 *   throw new AppError('PATIENT_NOT_FOUND', 404, 'Patient not found');
 *   throw new AppError('VALIDATION_ERROR', 400, 'Invalid email', { field: 'email' });
 */

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;
  public readonly isOperational: boolean;

  constructor(
    code: string,
    statusCode: number,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // distinguishes from unexpected errors

    // Capture stack trace (V8 engines)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Type guard — check if an error is an AppError
 */
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};
