import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  MAX_MOVES,
  START_POSITION_X,
  START_POSITION_Y,
} from '../components/GameScreen/constants';

interface GameContextProps {
  remainingMoves: number;
  setRemainingMoves: React.Dispatch<React.SetStateAction<number>>;
  positionX: number;
  setPositionX: React.Dispatch<React.SetStateAction<number>>;
  positionY: number;
  setPositionY: React.Dispatch<React.SetStateAction<number>>;
  savedPositionX: number | null;
  setSavesPositionX: React.Dispatch<React.SetStateAction<number | null>>;
  savedPositionY: number | null;
  setSavesPositionY: React.Dispatch<React.SetStateAction<number | null>>;
  resetGame: () => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [remainingMoves, setRemainingMoves] = useState<number>(MAX_MOVES);
  const [positionX, setPositionX] = useState<number>(START_POSITION_X);
  const [positionY, setPositionY] = useState<number>(START_POSITION_Y);

  const [savedPositionX, setSavesPositionX] = useState<number | null>(null);
  const [savedPositionY, setSavesPositionY] = useState<number | null>(null);

  const resetGame = () => {
    setRemainingMoves(MAX_MOVES);
    setPositionX(START_POSITION_X);
    setPositionY(START_POSITION_Y);
  };

  return (
    <GameContext.Provider
      value={{
        remainingMoves,
        setRemainingMoves,
        positionX,
        setPositionX,
        positionY,
        setPositionY,
        savedPositionX,
        setSavesPositionX,
        savedPositionY,
        setSavesPositionY,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextProps => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
