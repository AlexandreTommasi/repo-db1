import React, { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { ShareButtonProps } from './types';

/**
 * @component ShareButton
 * @description A button to share game results using the Web Share API.
 */
export const ShareButton = ({ attempts, time, className }: ShareButtonProps) => {
  // #region States
  const [isSupported, setIsSupported] = useState(false);
  // #endregion

  // #region Effects
  useEffect(() => {
    if ('share' in navigator) {
      setIsSupported(true);
    }
  }, []);
  // #endregion

  // #region Handlers
  const handleShare = async () => {
    const shareData = {
      title: 'GuessNumber Resultado!',
      text: `Eu adivinhei o número em ${attempts} tentativas e ${time} segundos! Você consegue me vencer?`,
      url: window.location.href,
    };

    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };
  // #endregion

  if (!isSupported) {
    return null;
  }

  return (
    <Button onClick={handleShare} variant="secondary" size="sm" className={className}>
      <Share2 className="mr-2 h-4 w-4" />
      Compartilhar
    </Button>
  );
};
