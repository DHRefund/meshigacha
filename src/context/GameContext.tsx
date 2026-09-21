'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { GameState } from '@/types';

interface GameContextType {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  startIntro: () => void;
  finishIntro: () => void;
  startSpin: () => void;
  finishSpin: () => void;
  setLimitReached: () => void;
}

const GameContext = createContext<GameContextType>({
  gameState: 'INTRO',
  setGameState: () => {},
  startIntro: () => {},
  finishIntro: () => {},
  startSpin: () => {},
  finishSpin: () => {},
  setLimitReached: () => {},
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameStateState] = useState<GameState>('INTRO');

  const setGameState = useCallback((nextState: GameState) => {
    setGameStateState(nextState);
  }, []);

  const startIntro = useCallback(() => {
    setGameStateState('INTRO');
  }, []);

  const finishIntro = useCallback(() => {
    setGameStateState('IDLE');
  }, []);

  const startSpin = useCallback(() => {
    setGameStateState('SPINNING');
  }, []);

  const finishSpin = useCallback(() => {
    setGameStateState('REVEAL');
  }, []);

  const setLimitReached = useCallback(() => {
    setGameStateState('LIMIT_REACHED');
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        startIntro,
        finishIntro,
        startSpin,
        finishSpin,
        setLimitReached,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
