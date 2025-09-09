import { GameState } from "@/contexts/game/types";

export type FinishedScreenProps = {
  gameState: GameState;
  onPlayAgain: () => void;
  onRateMatch: (rating: number) => void;
};
