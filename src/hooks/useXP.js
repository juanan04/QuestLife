import { useState, useCallback } from 'react';

export function useXPAnimation() {
  const [xpPopups, setXpPopups] = useState([]);

  const showXPGain = useCallback((amount) => {
    const id = Date.now();
    setXpPopups(prev => [...prev, { id, amount }]);
    setTimeout(() => {
      setXpPopups(prev => prev.filter(p => p.id !== id));
    }, 1500);
  }, []);

  return { xpPopups, showXPGain };
}
