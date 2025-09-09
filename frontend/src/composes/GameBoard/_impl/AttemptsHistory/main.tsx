import { AttemptsHistoryProps } from "./types";
import { Feedback } from "@/types/game";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/utils/cn";

const feedbackMap: Record<string, { text: string; icon: JSX.Element; color: string }> = {
  [Feedback.LOWER]: { text: "Muito baixo!", icon: <ArrowDown className="h-4 w-4 text-blue-400" />, color: "text-blue-400" },
  [Feedback.HIGHER]: { text: "Muito alto!", icon: <ArrowUp className="h-4 w-4 text-red-400" />, color: "text-red-400" },
};

/**
 * @component AttemptsHistory
 * @description Displays a list of the user's past guesses and their feedback.
 */
export const AttemptsHistory = ({ attempts }: AttemptsHistoryProps) => {
  // #region Renderers
  if (attempts.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 w-full pt-6 border-t border-gray-700">
      <h4 className="text-lg font-semibold text-center mb-2">Histórico de Tentativas</h4>
      <ul className="space-y-2 max-h-40 overflow-y-auto rounded-md bg-gray-800 p-3">
        {attempts.map((attempt, index) => {
          const feedbackInfo = feedbackMap[attempt.feedback];
          return (
            <li 
              key={index} 
              className={cn(
                "flex justify-between items-center text-gray-300 bg-gray-700/50 p-2 rounded transition-all",
                attempt.is_current && "ring-2 ring-yellow-400 scale-105"
              )}
            >
              <span>Tentativa #{index + 1}: <span className="font-bold text-white">{attempt.guess}</span></span>
              {feedbackInfo && (
                <span className={`flex items-center text-sm ${feedbackInfo.color}`}>
                  {feedbackInfo.icon}
                  <span className="ml-1 font-medium">{feedbackInfo.text}</span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
  // #endregion
};
