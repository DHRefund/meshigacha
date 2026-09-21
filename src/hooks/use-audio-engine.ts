'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { CaseAudio, type CaseSound } from '@/lib/case-audio';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function useAudioEngine(initialSoundEnabled = true) {
  const [soundEnabled, setSoundEnabled] = useState(initialSoundEnabled);
  const audioRef = useRef<CaseAudio | null>(null);

  useEffect(() => {
    const audio = new CaseAudio(basePath);
    audioRef.current = audio;
    audio.preload();

    const handleVisibility = () => {
      if (document.hidden) {
        audio.pause();
      } else {
        audio.recover();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      audio.dispose();
      audioRef.current = null;
    };
  }, []);

  const toggleSound = useCallback(() => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (audioRef.current) {
      audioRef.current.setMuted(!nextState);
    }
  }, [soundEnabled]);

  const unlockAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.unlock();
    }
  }, []);

  const playSound = useCallback(
    (soundName: CaseSound) => {
      if (soundEnabled && audioRef.current) {
        audioRef.current.play(soundName);
      }
    },
    [soundEnabled],
  );

  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  return {
    soundEnabled,
    toggleSound,
    unlockAudio,
    playSound,
    pauseAudio,
    audioRef,
  };
}
