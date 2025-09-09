import { api } from "@/utils/api";
import { API_ENDPOINTS } from "@/constants/api";
import { MatchHistoryPayload, MatchHistoryRecord } from "@/types/history";

/**
 * @function saveMatchHistory
 * @description Saves the result of a finished match to the backend.
 * @param {MatchHistoryPayload} payload - The match data to save.
 * @returns {Promise<MatchHistoryRecord>} The saved history record.
 */
export const saveMatchHistory = async (payload: MatchHistoryPayload): Promise<MatchHistoryRecord> => {
  const response = await api.post(API_ENDPOINTS.MATCH_HISTORY, payload);
  return response.data.data;
};
