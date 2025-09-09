import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/apiError';
import { httpStatus } from '@/constants/httpStatus';

// Chave de API secreta para simular autenticação de administrador
const ADMIN_API_KEY = 'super-secret-admin-key';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-admin-token'];

  if (!apiKey || apiKey !== ADMIN_API_KEY) {
    return next(new ApiError(httpStatus.FORBIDDEN, 'Acesso negado. Requer privilégios de administrador.'));
  }

  next();
};
