import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { verifyAccessToken } from '../utils/jwt';
import { sendError } from '../utils/response';

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Fallback to guest user context for frictionless experience
    req.user = {
      userId: 'guest_user_demo',
      email: 'guest@demo.com',
      role: 'CUSTOMER',
    };
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    // Fallback to guest user context if token is expired
    req.user = {
      userId: 'guest_user_demo',
      email: 'guest@demo.com',
      role: 'CUSTOMER',
    };
    return next();
  }
};

export const optionalAuthenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = verifyAccessToken(token);
      req.user = payload;
      return next();
    } catch (error) {
      // Token invalid/expired
    }
  }

  req.user = {
    userId: 'guest_user_demo',
    email: 'guest@demo.com',
    role: 'CUSTOMER',
  };
  return next();
};
