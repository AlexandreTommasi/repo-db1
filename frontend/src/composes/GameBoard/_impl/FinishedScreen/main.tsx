import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import { CheckCircle, Clock, Target, Award } from 'lucide-react';
import { AttemptsHistory } from '../AttemptsHistory';
import { Rating } from '../Rating';
import { ShareButton } from '../ShareButton';
import { FinishedScreenProps } from './types';
import { Confetti } from '@/components/Confetti';

/**
 * @component FinishedScreen
 * @description Displays the end-of-game summary and interactions.
 */
export const FinishedScreen = ({ gameState, onPlayAgain, onRateMatch }: FinishedScreenProps) => {
  // #region States
  const [showRatingMessage, setShowRatingMessage] = useState(false);
  // #endregion

  // #region Handlers
  const handleRate = (rating: number) => {
    onRateMatch(rating);
    setShowRatingMessage(true);
  };
  // #endregion

  // #region Constants
  const message = gameState.config?.custom_message_equal || 'Parabéns, você acertou!';
  // #endregion

  return (
    <Card className="w-full max-w-md text-center relative overflow-hidden">
      {gameState.effectsEnabled && <Confetti />}
      <CardHeader>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
          <Award className="h-8 w-8 text-green-400" />
        </div>
        <CardTitle>{message}</CardTitle>
        <CardDescription>Aqui está o resumo da sua partida.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center justify-center rounded-lg bg-gray-700/50 p-3">
            <Target className="h-6 w-6 text-yellow-400" />
            <span className="text-2xl font-bold">{gameState.secretNumber}</span>
            <span className="text-xs text-gray-400">Número Secreto</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg bg-gray-700/50 p-3">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <span className="text-2xl font-bold">{gameState.attempts}</span>
            <span className="text-xs text-gray-400">Tentativas</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg bg-gray-700/50 p-3">
            <Clock className="h-6 w-6 text-blue-400" />
            <span className="text-2xl font-bold">{gameState.totalTimeElapsed}s</span>
            <span className="text-xs text-gray-400">Tempo</span>
          </div>
        </div>

        <AttemptsHistory attempts={gameState.attemptsHistory} />

        <div className="space-y-2 pt-4 border-t border-gray-700">
          <h4 className="text-md font-semibold">Achou a partida difícil?</h4>
          <Rating onRate={handleRate} />
          {showRatingMessage && <p className="text-sm text-green-400">Obrigado pelo seu feedback!</p>}
        </div>
      </CardContent>
      <CardFooter className="flex-col sm:flex-row gap-2">
        <Button onClick={onPlayAgain} className="w-full sm:w-auto flex-grow">
          Jogar Novamente
        </Button>
        {gameState.totalTimeElapsed !== null && (
          <ShareButton attempts={gameState.attempts} time={gameState.totalTimeElapsed} />
        )}
      </CardFooter>
    </Card>
  );
};
