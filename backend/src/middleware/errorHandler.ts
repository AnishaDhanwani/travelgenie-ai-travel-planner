import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('[API Error]:', err);

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation error: please check your trip input parameters',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  const statusCode = err.statusCode || (err.status >= 400 && err.status < 600 ? err.status : 500);
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error occurred',
  });
};

