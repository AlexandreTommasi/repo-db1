export type MatchHistoryPayload = {
  gameId: string;
  difficultyRating?: number;
};

export type MatchHistoryRecord = {
  id: string;
  gameId: string;
  attempts: number;
  timeElapsed: number; // in seconds
  difficultyRating?: number;
  createdAt: string;
};
