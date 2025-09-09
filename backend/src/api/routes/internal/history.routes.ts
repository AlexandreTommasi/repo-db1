import { Router } from 'express';
import { HistoryController } from '@/api/controllers/history/history.controller';
import { validate } from '@/api/middleware/validation.middleware';
import { saveHistorySchema } from '@/types/history.types';

const historyRouter = Router();
const historyController = new HistoryController();

/**
 * @route POST /api/v1/matches/history
 * @description Salva o resultado de uma partida finalizada no histórico.
 * @access Public (em um sistema real, seria protegido)
 */
historyRouter.post('/history', validate(saveHistorySchema), historyController.save);

export { historyRouter };
