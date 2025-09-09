import { api } from "@/utils/api";
import { API_ENDPOINTS } from "@/constants/api";
import { StartGameResponse, SubmitGuessResponse, GuessPayload } from "@/types/game";

/**
 * @function startGame
 * @description Initiates a new game session on the backend.
 * @returns {Promise<StartGameResponse>} The initial game state.
 */
export const startGame = async (): Promise<StartGameResponse> => {
  const response = await api.post(API_ENDPOINTS.GAME_START);
  return response.data.data;
};

/**
 * @function submitGuess
 * @description Submits a user's guess to the backend for a specific game session.
 * @param {string} gameId - The ID of the current game session.
 * @param {number} guess - The number guessed by the user.
 * @returns {Promise<SubmitGuessResponse>} The result of the guess.
 */
export const submitGuess = async (gameId: string, guess: number): Promise<SubmitGuessResponse> => {
  const payload: GuessPayload = { guess };
  const response = await api.post(API_ENDPOINTS.GAME_GUESS(gameId), payload);
  return response.data.data;
};
