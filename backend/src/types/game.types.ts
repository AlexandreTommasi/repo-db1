import { z } from 'zod';

// FC-001 / FI-003: Enum para o resultado da comparação
export enum Feedback {
  LOWER = 'LOWER',
  HIGHER = 'HIGHER',
  EQUAL = 'EQUAL',
}

// FC-001 / FI-001: Enum para o estado do jogo
export enum GameStatus {
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
}

// FC-004 / FI-006: Tipo para uma única tentativa no histórico
export type Attempt = {
  guess: number;
  feedback: Feedback;
};

// FC-001 & FC-004: Estrutura da sessão de jogo atualizada
export interface GameSession {
  gameId: string;
  secretNumber: number;
  attempts: number;
  startTime: Date;
  endTime?: Date;
  gameState: GameStatus; // Substitui isFinished
  totalTimeElapsed: number | null; // FC-001 / FI-003
  minRange: number;
  maxRange: number;
  attemptsHistory: Attempt[];
  consecutiveIncorrectAttempts: number;
  hintsUsed: number;
}

// Tipo de resposta para um novo jogo, sem o número secreto
export type NewGameResponse = Omit<GameSession, 'secretNumber'>;

// FC-002 & FC-006: Atualiza a estrutura do resultado da tentativa
export interface GuessResult {
  gameId: string;
  isCorrect: boolean;
  feedback: Feedback;
  message: string; // Mensagem textual para o usuário
  attempts: number;
  attemptsHistory: Attempt[];
  gameState: GameStatus;
  totalTimeElapsed?: number;
  hint?: string; // FI-014
  graphicalRangeData: { // FI-004
    min: number;
    max: number;
    guessPositionPercent: number;
  };
}

// Schema de validação para a tentativa (guess)
export const guessSchema = z.object({
  body: z.object({
    guess: z.number({
      required_error: 'O número da tentativa é obrigatório.',
      invalid_type_error: 'A tentativa deve ser um número.',
    }).int('A tentativa deve ser um número inteiro.'),
  }),
  params: z.object({
    gameId: z.string().uuid('O ID do jogo é inválido.'),
  }),
});

// Schema de validação para buscar um jogo por ID
export const getGameSchema = z.object({
  params: z.object({
    gameId: z.string().uuid('O ID do jogo é inválido.'),
  }),
});
