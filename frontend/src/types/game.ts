export enum Feedback {
  LOWER = 'menor',
  HIGHER = 'maior',
  CORRECT = 'correto',
}

export type Attempt = {
  guess: number;
  feedback: Feedback;
  is_current: boolean;
};

export type StartGameResponse = {
  gameId: string;
  attempts: number;
  startTime: string;
  isFinished: boolean;
};

export type GraphicalRangeData = {
  min: number;
  max: number;
  guess_position_percent: number;
};

export type SubmitGuessResponse = {
  isCorrect: boolean;
  feedback: Feedback;
  attempts: number;
  secretNumber?: number; // Provided on correct guess
  message?: string;
  hint?: string | null;
  graphicalRangeData: GraphicalRangeData;
  attemptsHistory: (Omit<Attempt, 'is_current'> & { feedback: Feedback })[];
};

export type GuessPayload = {
  guess: number;
};
