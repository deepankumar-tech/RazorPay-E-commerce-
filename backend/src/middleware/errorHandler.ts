import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('💥 Express Global Error Handler:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred.';
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  // Do not expose stack traces in production
  const details = process.env.NODE_ENV === 'development' ? err.stack : undefined;

  return sendError(res, message, code, statusCode, details);
};
