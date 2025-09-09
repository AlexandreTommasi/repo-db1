import { Request, Response, NextFunction } from 'express';
import { GameService } from '@/services/game/game.service';
import { ApiResponse } from '@/utils/apiResponse';
import { httpStatus } from '@/constants/httpStatus';

export class GameController {
  private gameService: GameService;

  constructor() {
    this.gameService = new GameService();
    // Bind dos métodos para garantir o 'this' correto
    this.startNewGame = this.startNewGame.bind(this);
    this.submitGuess = this.submitGuess.bind(this);
    this.getGameById = this.getGameById.bind(this);
  }

  public async startNewGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // A chamada ao serviço agora é assíncrona
      const newGame = await this.gameService.startGame();
      new ApiResponse(res).send(httpStatus.CREATED, newGame, 'Novo jogo iniciado com sucesso.');
    } catch (error) {
      next(error);
    }
  }

  // A chamada ao serviço agora é assíncrona
  public async submitGuess(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { gameId } = req.params;
      const { guess } = req.body;

      // A chamada agora é 'await'
      const result = await this.gameService.makeGuess(gameId, guess);
      new ApiResponse(res).send(httpStatus.OK, result, 'Tentativa processada.');
    } catch (error) {
      next(error);
    }
  }

  public async getGameById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { gameId } = req.params;
      const gameData = await this.gameService.getGame(gameId);
      new ApiResponse(res).send(httpStatus.OK, gameData, 'Dados do jogo recuperados com sucesso.');
    } catch (error) {
      next(error);
    }
  }
}
