"use client";

import React, { useState, useCallback, useEffect } from "react";
import { GameContext } from "./context";
import { GameState, GameProviderProps, Attempt } from "./types";
import * as gameService from "@/services/gameService";
import * as configService from "@/services/configService";
import * as historyService from "@/services/historyService";
import * as localStorage from "@/utils/localStorage";
import { MatchHistoryRecord } from "@/types/history";

const initialState: GameState = {
  gameId: null,
  attempts: 0,
  feedback: null,
  isFinished: false,
  isLoading: false,
  error: null,
  attemptsHistory: [],
  hint: null,
  graphicalRangeData: null,
  message: null,
  config: null,
  effectsEnabled: true,
  startTime: null,
  totalTimeElapsed: null,
  secretNumber: null,
};

/**
 * @component GameProvider
 * @description Provides the game state and actions to its children.
 */
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  // #region States
  const [gameState, setGameState] = useState<GameState>(initialState);
  // #endregion

  // #region Effects
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await configService.getConfig();
        setGameState(prev => ({ ...prev, config }));
      } catch (error) {
        console.error("Failed to load game config, using defaults.");
      }
    };
    fetchConfig();
  }, []);
  // #endregion

  // #region Callbacks
  const handleGameEnd = useCallback(async (gameId: string, attempts: number, secretNumber: number) => {
    const endTime = Date.now();
    const totalTime = gameState.startTime ? Math.round((endTime - gameState.startTime) / 1000) : 0;

    setGameState(prev => ({
      ...prev,
      isFinished: true,
      totalTimeElapsed: totalTime,
      secretNumber,
    }));

    // Asynchronously save history
    try {
      // For now, we assume anonymous users and save to backend.
      // A real implementation would check for a user session.
      await historyService.saveMatchHistory({ gameId });
    } catch (error) {
      // If backend fails, save to local storage as a fallback for anonymous users
      console.error("Failed to save history to backend, saving locally.", error);
      const localHistory = localStorage.getItem<MatchHistoryRecord[]>('matchHistory') || [];
      const newRecord: MatchHistoryRecord = {
        id: `local-${Date.now()}`,
        gameId,
        attempts,
        timeElapsed: totalTime,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('matchHistory', [...localHistory, newRecord]);
    }
  }, [gameState.startTime]);

  const startGame = useCallback(async () => {
    setGameState(prev => ({ ...initialState, config: prev.config, effectsEnabled: prev.effectsEnabled, isLoading: true }));
    try {
      const data = await gameService.startGame();
      setGameState((prev) => ({
        ...initialState,
        config: prev.config,
        effectsEnabled: prev.effectsEnabled,
        isLoading: false,
        gameId: data.gameId,
        startTime: Date.now(),
      }));
    } catch (err) {
      setGameState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Falha ao iniciar um novo jogo. Tente novamente.",
      }));
    }
  }, []);

  const submitGuess = useCallback(async (guess: number) => {
    if (!gameState.gameId) return;

    setGameState((prev) => ({ ...prev, isLoading: true, error: null, hint: null }));
    try {
      const data = await gameService.submitGuess(gameState.gameId, guess);
      
      const newHistory: Attempt[] = data.attemptsHistory.map((item, index) => ({
        guess: item.guess,
        feedback: item.feedback,
        is_current: index === data.attemptsHistory.length - 1,
      }));

      if (data.isCorrect) {
        handleGameEnd(gameState.gameId, data.attempts, data.secretNumber ?? guess);
      }

      setGameState((prev) => ({
        ...prev,
        isLoading: false,
        attempts: data.attempts,
        feedback: data.isCorrect ? null : data.feedback,
        attemptsHistory: newHistory,
        hint: data.hint ?? null,
        graphicalRangeData: data.graphicalRangeData,
        message: data.message ?? null,
      }));

    } catch (err) {
      setGameState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Falha ao enviar a tentativa. Verifique sua conexão.",
      }));
    }
  }, [gameState.gameId, handleGameEnd]);

  const resetGame = useCallback(() => {
    setGameState(prev => ({ ...initialState, config: prev.config, effectsEnabled: prev.effectsEnabled }));
  }, []);

  const toggleEffects = useCallback(() => {
    setGameState(prev => ({ ...prev, effectsEnabled: !prev.effectsEnabled }));
  }, []);

  const rateMatch = useCallback(async (rating: number) => {
    if (!gameState.gameId) return;
    try {
      await historyService.saveMatchHistory({ gameId: gameState.gameId, difficultyRating: rating });
    } catch (error) {
      console.error("Failed to submit rating.", error);
      // Optionally, show an error to the user
    }
  }, [gameState.gameId]);
  // #endregion

  const value = {
    gameState,
    startGame,
    submitGuess,
    resetGame,
    toggleEffects,
    rateMatch,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
