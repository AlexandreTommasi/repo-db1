"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useGameContext } from "@/contexts/game";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/Card";
import { AlertCircle, HelpCircle, Lightbulb, Volume2, VolumeX } from "lucide-react";
import { Feedback } from "@/types/game";
import { AttemptsHistory, FinishedScreen } from "./_impl";
import { RangeIndicator } from "@/components/RangeIndicator";
import { Toggle } from "@/components/Toggle";
import { useAudio } from "@/hooks/useAudio";
import { cn } from "@/utils/cn";

/**
 * @component GameBoard
 * @description The main user interface for the GuessNumber game.
 * It handles rendering different game states: start, playing, and finished.
 */
export const GameBoard = () => {
  // #region Contexts
  const { gameState, startGame, submitGuess, resetGame, toggleEffects, rateMatch } = useGameContext();
  // #endregion

  // #region Hooks
  const { play } = useAudio({ success: '/sounds/success.mp3', error: '/sounds/error.mp3' });
  // #endregion

  // #region States
  const [guessValue, setGuessValue] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [feedbackAnimation, setFeedbackAnimation] = useState('');
  // #endregion

  // #region Effects
  useEffect(() => {
    if (gameState.feedback && gameState.effectsEnabled) {
      play('error');
      setFeedbackAnimation('animate-shake');
      const timer = setTimeout(() => setFeedbackAnimation(''), 820);
      return () => clearTimeout(timer);
    }
  }, [gameState.attempts, gameState.feedback, gameState.effectsEnabled, play]);

  useEffect(() => {
    if (gameState.isFinished && gameState.effectsEnabled) {
      play('success');
    }
  }, [gameState.isFinished, gameState.effectsEnabled, play]);
  // #endregion

  // #region Memos
  const feedbackInfo = useMemo(() => {
    if (!gameState.feedback) return null;

    const customMessage = gameState.feedback === Feedback.LOWER 
      ? gameState.config?.custom_message_lower 
      : gameState.config?.custom_message_higher;

    if (gameState.feedback === Feedback.LOWER) {
      return { text: customMessage || 'Muito baixo!', color: 'text-blue-400', Icon: HelpCircle };
    }
    if (gameState.feedback === Feedback.HIGHER) {
      return { text: customMessage || 'Muito alto!', color: 'text-red-400', Icon: HelpCircle };
    }
    return null;
  }, [gameState.feedback, gameState.config]);
  // #endregion

  // #region Handlers
  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputError(null);
    setGuessValue(e.target.value);
  };

  const handleGuessSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputError(null);

    const min = gameState.config?.min_range_setting ?? 1;
    const max = gameState.config?.max_range_setting ?? 100;

    if (!guessValue.trim()) {
      setInputError("Por favor, insira um número.");
      return;
    }

    const num = Number(guessValue);

    if (!Number.isInteger(num)) {
      setInputError("Entrada inválida. Por favor, insira um número inteiro.");
      return;
    }

    if (num < min || num > max) {
      setInputError(`O número deve estar entre ${min} e ${max}.`);
      return;
    }

    submitGuess(num);
    setGuessValue("");
  };

  const handlePlayAgain = () => {
    resetGame();
    startGame();
  };
  // #endregion

  // #region Renderers
  const renderStartScreen = () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Bem-vindo ao GuessNumber!</CardTitle>
        <CardDescription>Adivinhe o número para começar.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center">Clique no botão abaixo para começar um novo jogo.</p>
      </CardContent>
      <CardFooter>
        <Button onClick={startGame} className="w-full" disabled={gameState.isLoading}>
          {gameState.isLoading ? "Iniciando..." : "Começar Jogo"}
        </Button>
      </CardFooter>
    </Card>
  );

  const renderGameScreen = () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Faça sua tentativa!</CardTitle>
            <CardDescription>Tentativa #{gameState.attempts + 1}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="effects-toggle" className="text-sm text-gray-400 cursor-pointer">
              {gameState.effectsEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </label>
            <Toggle id="effects-toggle" checked={gameState.effectsEnabled} onCheckedChange={toggleEffects} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {gameState.graphicalRangeData && (
          <RangeIndicator 
            min={gameState.graphicalRangeData.min}
            max={gameState.graphicalRangeData.max}
            guessPositionPercent={gameState.graphicalRangeData.guess_position_percent}
          />
        )}
        <form onSubmit={handleGuessSubmit} className="space-y-4">
          <Input
            type="number"
            value={guessValue}
            onChange={handleGuessChange}
            placeholder={`Digite um número entre ${gameState.config?.min_range_setting ?? 1} e ${gameState.config?.max_range_setting ?? 100}`}
            autoFocus
            disabled={gameState.isLoading || gameState.isFinished}
          />
          {inputError && <p className="text-sm text-red-400">{inputError}</p>}
          {feedbackInfo && (
            <div className={cn("flex items-center justify-center space-x-2 rounded-md bg-gray-700 p-3", feedbackAnimation)}>
              <feedbackInfo.Icon className={cn("h-5 w-5", feedbackInfo.color)} />
              <p className={feedbackInfo.color}><span className="font-bold">{feedbackInfo.text}</span></p>
            </div>
          )}
          {gameState.hint && (
             <div className="flex items-center justify-center space-x-2 rounded-md bg-purple-900/50 border border-purple-700 p-3">
              <Lightbulb className="h-5 w-5 text-purple-400" />
              <p className="text-purple-300"><span className="font-bold">Dica:</span> {gameState.hint}</p>
            </div>
          )}
          <Button type="submit" className="w-full" disabled={gameState.isLoading || gameState.isFinished}>
            {gameState.isLoading ? "Enviando..." : "Adivinhar"}
          </Button>
        </form>
        <AttemptsHistory attempts={gameState.attemptsHistory} />
      </CardContent>
    </Card>
  );

  const renderErrorScreen = () => (
    <Card className="w-full max-w-md text-center border-red-500">
      <CardHeader>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <CardTitle>Ocorreu um Erro</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-red-300">{gameState.error}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={resetGame} className="w-full" variant="secondary">
          Tentar Novamente
        </Button>
      </CardFooter>
    </Card>
  );
  // #endregion

  if (gameState.error) {
    return renderErrorScreen();
  }

  if (gameState.isFinished) {
    return <FinishedScreen gameState={gameState} onPlayAgain={handlePlayAgain} onRateMatch={rateMatch} />;
  }

  if (gameState.gameId) {
    return renderGameScreen();
  }

  return renderStartScreen();
};
