import { Request, Response, NextFunction } from 'express';

/**
 * Centralized error handling middleware for Express.
 *
 * Logs the error and sends a standardized JSON error response.
 */
const errorHandler = (
  err: Error, 
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  console.error('Error Handler Caught:', err.stack || err); 

  const statusCode = 
    err && typeof err === 'object' && 'statusCode' in err && typeof err.statusCode === 'number'
      ? err.statusCode 
      : 500;

  res.status(statusCode).json({
    message: err.message || 'An unexpected server error occurred.',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler; 