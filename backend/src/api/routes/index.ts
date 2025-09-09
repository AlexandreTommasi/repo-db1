import { Router } from 'express';
import { gameRouter } from './internal/game.routes';
import { configRouter } from './internal/config.routes';
import { historyRouter } from './internal/history.routes';

const mainRouter = Router();

// Ponto de integração para futuras features
mainRouter.use('/game', gameRouter);
mainRouter.use('/config', configRouter);
mainRouter.use('/matches', historyRouter);

export { mainRouter };
