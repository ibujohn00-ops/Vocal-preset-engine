/**
 * Global Error Handler Middleware
 * Catches and formats errors for consistent API responses
 */

import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  console.error(`[ERROR] ${statusCode}: ${message}`);
  console.error(error.stack);

  // Handle MongoDB validation errors
  if (error.name === 'ValidationError') {
    res.status(400).json({
      error: 'Validation Error',
      message: message,
      details: (error as any).details,
    });
    return;
  }

  // Handle MongoDB duplicate key errors
  if (error.code === 11000) {
    const field = Object.keys((error as any).keyPattern)[0];
    res.status(409).json({
      error: 'Duplicate Entry',
      message: `${field} already exists`,
    });
    return;
  }

  // Handle file upload errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    res.status(413).json({
      error: 'File Too Large',
      message: `File size exceeds maximum limit of ${process.env.MAX_FILE_SIZE || '100MB'}`,
    });
    return;
  }

  // Default error response
  res.status(statusCode).json({
    error: error.name || 'Error',
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

/**
 * Wrapper for async route handlers to catch errors
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
