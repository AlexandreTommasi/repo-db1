import { z } from 'zod';

// FC-005: Adicionando novos campos de configuração
export interface GameConfig {
  minRange: number;
  maxRange: number;
  customMessageHigher?: string;
  customMessageLower?: string;
  customMessageEqual?: string;
  hintTriggerCount?: number;
}

export const updateConfigSchema = z.object({
  body: z.object({
    // Campos existentes
    min_range_setting: z.number({
      required_error: 'O valor mínimo é obrigatório.',
      invalid_type_error: 'O valor mínimo deve ser um número inteiro.',
    }).int(),
    max_range_setting: z.number({
      required_error: 'O valor máximo é obrigatório.',
      invalid_type_error: 'O valor máximo deve ser um número inteiro.',
    }).int(),
    // FC-005 / FI-009, FI-010, FI-011: Mensagens customizadas (opcionais)
    custom_message_higher: z.string().optional(),
    custom_message_lower: z.string().optional(),
    custom_message_equal: z.string().optional(),
    // FC-005 / FI-012 / VA-001: Gatilho de dicas (opcional, inteiro > 0)
    hint_trigger_count: z.number({
      invalid_type_error: 'O gatilho de dicas deve ser um número inteiro.',
    }).int().positive('O gatilho de dicas deve ser um número maior que zero.').optional(),
  }).refine(data => data.min_range_setting < data.max_range_setting, {
    message: 'O valor mínimo deve ser menor que o valor máximo.',
    path: ['min_range_setting'], // Path to show the error on
  }),
});
