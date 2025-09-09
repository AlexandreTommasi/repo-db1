export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const API_ENDPOINTS = {
  GAME_START: '/game/start',
  GAME_GUESS: (gameId: string) => `/game/${gameId}/guess`,
  GAME_CONFIG: '/config/game',
  MATCH_HISTORY: '/matches/history',
};
