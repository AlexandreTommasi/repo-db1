import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/apiError';
import { httpStatus } from '@/constants/httpStatus';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(httpStatus.NOT_FOUND, `Rota não encontrada - ${req.method} ${req.originalUrl}`);
  next(error);
};
