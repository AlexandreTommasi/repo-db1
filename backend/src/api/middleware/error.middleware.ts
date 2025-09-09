import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '@/utils/apiError';
import { logger } from '@/utils/logger';
import { config } from '@/config';
import { httpStatus } from '@/constants/httpStatus';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: 'Erro de validação.',
      errors: err.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
    });
  }

  const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  const message = config.nodeEnv === 'production' ? 'Ocorreu um erro interno no servidor.' : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};
