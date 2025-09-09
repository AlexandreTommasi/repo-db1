import { Request, Response, NextFunction } from 'express';
import { HistoryService } from '@/services/history/history.service';
import { ApiResponse } from '@/utils/apiResponse';
import { httpStatus } from '@/constants/httpStatus';

export class HistoryController {
  private historyService: HistoryService;

  constructor() {
    this.historyService = new HistoryService();
    this.save = this.save.bind(this);
  }

  public async save(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { gameId, difficultyRating } = req.body;
      const savedRecord = await this.historyService.saveMatchHistory({ gameId, difficultyRating });
      new ApiResponse(res).send(httpStatus.CREATED, savedRecord, 'Histórico da partida salvo com sucesso.');
    } catch (error) {
      next(error);
    }
  }
}
