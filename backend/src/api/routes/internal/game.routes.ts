import { Router } from 'express';
import { GameController } from '@/api/controllers/game/game.controller';
import { validate } from '@/api/middleware/validation.middleware';
import { guessSchema, getGameSchema } from '@/types/game.types';

const gameRouter = Router();
const gameController = new GameController();

/**
 * @route POST /api/v1/game/start
 * @description Inicia um novo jogo de adivinhação.
 */
gameRouter.post('/start', gameController.startNewGame);

/**
 * @route GET /api/v1/game/:gameId
 * @description Obtém o estado atual de um jogo.
 * @access Public
 */
gameRouter.get('/:gameId', validate(getGameSchema), gameController.getGameById);

/**
 * @route POST /api/v1/game/:gameId/guess
 * @description Submete uma tentativa para um jogo existente.
 */
gameRouter.post('/:gameId/guess', validate(guessSchema), gameController.submitGuess);

export { gameRouter };
