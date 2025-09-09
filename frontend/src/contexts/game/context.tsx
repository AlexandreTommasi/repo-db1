"use client";

import { createContext, useContext } from "react";
import { GameContextType } from "./types";

export const GameContext = createContext<GameContextType | undefined>(undefined);

/**
 * @hook useGameContext
 * @description Custom hook to access the GameContext.
 * Throws an error if used outside of a GameProvider.
 * @returns {GameContextType} The game context.
 */
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
