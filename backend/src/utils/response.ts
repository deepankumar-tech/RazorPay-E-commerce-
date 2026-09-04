import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendSuccess = <T>(res: Response, data?: T, message?: string, statusCode: number = 200) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

export const sendError = (res: Response, message: string, code: string = 'BAD_REQUEST', statusCode: number = 400, details?: any) => {
  const response: ApiResponse = {
    success: false,
    message,
    code,
    error: details,
  };
  return res.status(statusCode).json(response);
};
