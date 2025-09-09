import { GameConfig } from "@/types/config";
import { Feedback, Attempt, GraphicalRangeData } from "@/types/game";

export type { Feedback, Attempt };

export type GameState = {
  gameId: string | null;
  attempts: number;
  feedback: Feedback | null;
  isFinished: boolean;
  isLoading: boolean;
  error: string | null;
  attemptsHistory: Attempt[];
  hint: string | null;
  graphicalRangeData: GraphicalRangeData | null;
  message: string | null;
  config: Partial<GameConfig> | null;
  effectsEnabled: boolean;
  startTime: number | null;
  totalTimeElapsed: number | null; // in seconds
  secretNumber: number | null;
};

export type GameContextType = {
  gameState: GameState;
  startGame: () => Promise<void>;
  submitGuess: (guess: number) => Promise<void>;
  resetGame: () => void;
  toggleEffects: () => void;
  rateMatch: (rating: number) => Promise<void>;
};

export type GameProviderProps = {
  children: React.ReactNode;
};
