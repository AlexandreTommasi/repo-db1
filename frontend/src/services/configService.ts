import { api } from "@/utils/api";
import { API_ENDPOINTS } from "@/constants/api";
import { GameConfig, UpdateConfigPayload } from "@/types/config";

/**
 * @function getConfig
 * @description Fetches the current game configuration from the backend.
 * @returns {Promise<GameConfig>} The current game configuration.
 */
export const getConfig = async (): Promise<GameConfig> => {
  const response = await api.get(API_ENDPOINTS.GAME_CONFIG);
  return response.data.data;
};

/**
 * @function updateConfig
 * @description Updates the game configuration on the backend.
 * @param {UpdateConfigPayload} payload - The new configuration values.
 * @returns {Promise<GameConfig>} The updated game configuration.
 */
export const updateConfig = async (payload: UpdateConfigPayload): Promise<GameConfig> => {
  const response = await api.put(API_ENDPOINTS.GAME_CONFIG, payload);
  return response.data.data;
};
