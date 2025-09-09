import React from 'react';
import './styles.css';

/**
 * @component Confetti
 * @description A simple CSS-based confetti animation component.
 */
export const Confetti: React.FC = () => {
  const confettiCount = 150;
  const confetti = Array.from({ length: confettiCount }).map((_, i) => (
    <div key={i} className={`confetti-piece`} />
  ));

  return <div className="confetti-container">{confetti}</div>;
};
