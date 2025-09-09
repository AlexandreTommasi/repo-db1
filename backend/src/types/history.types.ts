import { z } from 'zod';

// BACK-011: Estrutura de dados para o histórico
export interface MatchRecord {
  historyId: string;
  gameId: string;
  // user_id seria adicionado aqui em um sistema com autenticação
  attempts: number;
  totalTimeElapsed: number;
  difficultyRating: number | null;
  savedAt: Date;
}

// Schema de validação para salvar o histórico
export const saveHistorySchema = z.object({
  body: z.object({
    gameId: z.string({ required_error: 'O ID do jogo é obrigatório.' }).uuid('O ID do jogo é inválido.'),
    // FI-010 / RU-008
    difficultyRating: z
      .number({ invalid_type_error: 'A avaliação deve ser um número.' })
      .int('A avaliação deve ser um número inteiro.')
      .min(1, 'A avaliação deve ser no mínimo 1.')
      .max(5, 'A avaliação deve ser no máximo 5.')
      .optional(),
  }),
});
