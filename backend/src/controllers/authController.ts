import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { AuthService } from '../services/authService';
import { sendSuccess, sendError } from '../utils/response';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validators/authSchemas';

export class AuthController {
  static async register(req: AuthenticatedRequest, res: Response) {
    try {
      const validated = registerSchema.parse(req.body);
      const result = await AuthService.register(validated);
      return sendSuccess(res, result, 'User registered successfully', 201);
    } catch (error: any) {
      if (error.statusCode) return sendError(res, error.message, error.code, error.statusCode);
      return sendError(res, error.message || 'Validation or registration failed', 'VALIDATION_ERROR', 400, error.errors);
    }
  }

  static async login(req: AuthenticatedRequest, res: Response) {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await AuthService.login(validated.email, validated.password);
      return sendSuccess(res, result, 'Login successful');
    } catch (error: any) {
      if (error.statusCode) return sendError(res, error.message, error.code, error.statusCode);
      return sendError(res, error.message || 'Login failed', 'AUTH_ERROR', 400);
    }
  }

  static async refresh(req: AuthenticatedRequest, res: Response) {
    try {
      const validated = refreshTokenSchema.parse(req.body);
      const result = await AuthService.refresh(validated.refreshToken);
      return sendSuccess(res, result, 'Token refreshed successfully');
    } catch (error: any) {
      if (error.statusCode) return sendError(res, error.message, error.code, error.statusCode);
      return sendError(res, error.message || 'Token refresh failed', 'REFRESH_ERROR', 401);
    }
  }

  static async logout(req: AuthenticatedRequest, res: Response) {
    try {
      const { refreshToken } = req.body;
      await AuthService.logout(refreshToken);
      return sendSuccess(res, null, 'Logged out successfully');
    } catch (error: any) {
      return sendError(res, 'Logout failed', 'LOGOUT_ERROR', 400);
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response) {
    if (!req.user) return sendError(res, 'User context missing', 'UNAUTHORIZED', 401);
    return sendSuccess(res, { user: req.user });
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'User context missing', 'UNAUTHORIZED', 401);
      const { name, email, password } = req.body;
      const updatedUser = await AuthService.updateProfile(req.user.userId, { name, email, password });
      return sendSuccess(res, { user: updatedUser }, 'Profile updated successfully');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update profile', 'PROFILE_UPDATE_ERROR', 400);
    }
  }
}
