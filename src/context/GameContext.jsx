import { createContext, useContext } from 'react';
import { useGameData } from '../hooks/useGameData';
import { useXPAnimation } from '../hooks/useXP';
import { useAuth } from '../hooks/useAuth';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const auth = useAuth();
  const gameData = useGameData(auth.session);
  const xpAnimation = useXPAnimation();

  return (
    <GameContext.Provider value={{ ...auth, ...gameData, ...xpAnimation }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
