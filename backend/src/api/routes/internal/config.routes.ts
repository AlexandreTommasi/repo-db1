import { Router } from 'express';
import { ConfigController } from '@/api/controllers/config/config.controller';
import { isAdmin } from '@/api/middleware/auth.middleware';
import { validate } from '@/api/middleware/validation.middleware';
import { updateConfigSchema } from '@/types/config.types';

const configRouter = Router();
const configController = new ConfigController();

/**
 * @route GET /api/v1/config/game
 * @description Obtém a configuração atual do jogo (intervalo de números).
 * @access Public
 */
configRouter.get('/game', configController.getConfig);

/**
 * @route PUT /api/v1/config/game
 * @description Atualiza a configuração do jogo (intervalo de números).
 * @access Admin
 */
configRouter.put('/game', isAdmin, validate(updateConfigSchema), configController.updateConfig);

export { configRouter };
