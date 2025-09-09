import { v4 as uuidv4 } from 'uuid';
import { MatchRecord } from '@/types/history.types';
import { ApiError } from '@/utils/apiError';
import { httpStatus } from '@/constants/httpStatus';
import { GAME_MESSAGES } from '@/constants/game.constants';
import { GameStatus } from '@/types/game.types';
import { gameSessions } from '@/services/game/game.service';

// Simulação de um banco de dados em memória para o histórico de partidas
const matchHistories: Map<string, MatchRecord> = new Map();

interface SavePayload {
  gameId: string;
  difficultyRating?: number;
}

export class HistoryService {
  public async saveMatchHistory(payload: SavePayload): Promise<MatchRecord> {
    const { gameId, difficultyRating } = payload;

    const session = gameSessions.get(gameId);

    if (!session) {
      throw new ApiError(httpStatus.NOT_FOUND, GAME_MESSAGES.GAME_NOT_FOUND);
    }

    if (session.gameState !== GameStatus.FINISHED) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'A partida ainda não foi finalizada.');
    }

    if (matchHistories.has(gameId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'O histórico para esta partida já foi salvo.');
    }

    const newRecord: MatchRecord = {
      historyId: uuidv4(),
      gameId: session.gameId,
      attempts: session.attempts,
      totalTimeElapsed: session.totalTimeElapsed!,
      difficultyRating: difficultyRating ?? null,
      savedAt: new Date(),
    };

    matchHistories.set(gameId, newRecord);

    return newRecord;
  }
}
