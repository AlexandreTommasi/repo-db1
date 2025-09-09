export const GAME_MESSAGES = {
  GAME_NOT_FOUND: 'Sessão de jogo não encontrada.',
  GAME_ALREADY_FINISHED: 'Este jogo já foi finalizado.',
};

// FC-002: Mensagens de feedback padrão
export const FEEDBACK_DEFAULTS = {
  HIGHER: 'Muito alto!',
  LOWER: 'Muito baixo!',
  EQUAL: (attempts: number) => `Parabéns, você acertou em ${attempts} tentativas!`,
};
