import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { GameSession, GuessResult, Feedback, NewGameResponse, Attempt, GameStatus } from '@/types/game.types';
import { ApiError } from '@/utils/apiError';
import { httpStatus } from '@/constants/httpStatus';
import { GAME_MESSAGES, FEEDBACK_DEFAULTS } from '@/constants/game.constants';
import { configService } from '@/services/config/config.service';
import { logger } from '@/utils/logger';

// Simulação de um banco de dados em memória para as sessões de jogo
export const gameSessions: Map<string, GameSession> = new Map();

export class GameService {
  public async startGame(): Promise<NewGameResponse> {
    const { minRange, maxRange } = await configService.getConfig();

    if (minRange >= maxRange) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Configuração de intervalo do jogo inválida no servidor.');
    }

    // SE-001: Utilizar um gerador de números pseudoaleatórios criptograficamente seguro (CSPRNG)
    const secretNumber = crypto.randomInt(minRange, maxRange + 1);

    const newGame: GameSession = {
      gameId: uuidv4(),
      secretNumber,
      attempts: 0,
      startTime: new Date(),
      gameState: GameStatus.IN_PROGRESS,
      totalTimeElapsed: null,
      minRange,
      maxRange,
      attemptsHistory: [],
      consecutiveIncorrectAttempts: 0, // FC-004 / FI-008
      hintsUsed: 0, // FC-006
    };

    gameSessions.set(newGame.gameId, newGame);

    // BR-004: Registrar o número gerado em um log de auditoria
    logger.info(`[AUDIT] Novo jogo iniciado. gameId: ${newGame.gameId}, secretNumber: ${newGame.secretNumber}`);

    // BR-002: Não expor o número secreto na resposta da API
    const { secretNumber: _, ...response } = newGame;
    return response;
  }

  // BACK-057: Endpoint para receber o palpite
  public async makeGuess(gameId: string, guess: number): Promise<GuessResult> {
    const session = gameSessions.get(gameId);
    const config = await configService.getConfig();

    // BACK-040: Verifica se o jogo está ativo
    if (!session) {
      throw new ApiError(httpStatus.NOT_FOUND, GAME_MESSAGES.GAME_NOT_FOUND);
    }

    if (session.gameState === GameStatus.FINISHED) {
      throw new ApiError(httpStatus.BAD_REQUEST, GAME_MESSAGES.GAME_ALREADY_FINISHED);
    }

    // BACK-069 / BR-004: Validar se o palpite está dentro do intervalo do jogo
    if (guess < session.minRange || guess > session.maxRange) {
        // VA-002: Mensagem de erro para palpite fora do intervalo
        throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, `O número deve estar entre ${session.minRange} e ${session.maxRange}.`);
    }

    // FC-004 / BR-016: Incrementar contador de tentativas
    session.attempts += 1;

    let feedback: Feedback;
    let isCorrect = false;
    let message: string;
    let hint: string | undefined = undefined;

    // FC-001 / BR-001 a BR-004: Lógica de comparação
    if (guess < session.secretNumber) {
      feedback = Feedback.LOWER;
      session.consecutiveIncorrectAttempts += 1; // FC-004 / BR-020
      message = config.customMessageLower || FEEDBACK_DEFAULTS.LOWER;
    } else if (guess > session.secretNumber) {
      feedback = Feedback.HIGHER;
      session.consecutiveIncorrectAttempts += 1; // FC-004 / BR-020
      message = config.customMessageHigher || FEEDBACK_DEFAULTS.HIGHER;
    } else {
      feedback = Feedback.EQUAL;
      isCorrect = true;
      session.endTime = new Date();
      session.gameState = GameStatus.FINISHED;
      session.totalTimeElapsed = session.endTime.getTime() - session.startTime.getTime();
      session.consecutiveIncorrectAttempts = 0; // FC-004 / BR-021
      const equalMessageTemplate = config.customMessageEqual || FEEDBACK_DEFAULTS.EQUAL(session.attempts);
      // Substitui um placeholder {attempts} se existir na mensagem customizada
      message = equalMessageTemplate.replace('{attempts}', session.attempts.toString());
    }

    // FC-004 / BR-017: Adicionar ao histórico
    const newAttempt: Attempt = { guess, feedback };
    session.attemptsHistory.push(newAttempt);

    // FC-006: Lógica de geração de dicas
    const hintTrigger = config.hintTriggerCount || 5;
    if (!isCorrect && session.consecutiveIncorrectAttempts > 0 && session.consecutiveIncorrectAttempts % hintTrigger === 0) {
      session.hintsUsed += 1;
      if (session.hintsUsed === 1) { // BR-026: Primeira dica é de paridade
        hint = `Dica: O número secreto é ${session.secretNumber % 2 === 0 ? 'par' : 'ímpar'}.`;
      } else { // BR-027: Dicas subsequentes reduzem o intervalo
        const lowerBound = session.attemptsHistory
          .filter(a => a.guess < session.secretNumber)
          .map(a => a.guess)
          .reduce((max, current) => Math.max(max, current), session.minRange - 1);
        
        const upperBound = session.attemptsHistory
          .filter(a => a.guess > session.secretNumber)
          .map(a => a.guess)
          .reduce((min, current) => Math.min(min, current), session.maxRange + 1);

        hint = `Dica: O número está entre ${lowerBound + 1} e ${upperBound - 1}.`;
      }
    }

    gameSessions.set(gameId, session); // Atualiza a sessão

    // FC-002 / BR-013: Calcular dados para representação gráfica
    const guessPositionPercent = ((guess - session.minRange) / (session.maxRange - session.minRange)) * 100;

    // BACK-051: Formata a resposta
    const result: GuessResult = {
      gameId: session.gameId,
      isCorrect,
      feedback,
      message,
      attempts: session.attempts,
      attemptsHistory: session.attemptsHistory,
      gameState: session.gameState,
      totalTimeElapsed: session.totalTimeElapsed ?? undefined,
      hint,
      graphicalRangeData: {
        min: session.minRange,
        max: session.maxRange,
        guessPositionPercent: Math.round(guessPositionPercent),
      },
    };

    return result;
  }

  public async getGame(gameId: string): Promise<NewGameResponse> {
    const session = gameSessions.get(gameId);

    if (!session) {
      throw new ApiError(httpStatus.NOT_FOUND, GAME_MESSAGES.GAME_NOT_FOUND);
    }

    const { secretNumber: _, ...response } = session;
    return response;
  }
}
