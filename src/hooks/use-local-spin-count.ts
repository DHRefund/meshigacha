import { useEffect, useState, useCallback, useRef } from 'react';
import type { Food } from '@/lib/foods';
import { readCookie, writeCookie } from '@/lib/cookies';

export const MAX_GUEST_SPINS = 5;

function savedCount(): number {
  const n = readCookie<number>('spins');
  return Number.isSafeInteger(n) && Number(n) >= 0 ? Number(n) : 0;
}

export function useLocalSpinCount() {
  const [count, setCount] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    current.current = savedCount();
    setCount(current.current);
  }, []);

  const recordSpin = useCallback((food: Food) => {
    const next = Math.min(
      Number.MAX_SAFE_INTEGER,
      Math.max(current.current, savedCount()) + 1,
    );
    try {
      writeCookie('spins', next);
      writeCookie('last-choice', {
        name: food.name,
        price: food.price,
        veg: !!food.veg,
        at: Date.now(),
      });
    } catch {
      /* Choosing lunch remains available when cookies are disabled. */
    }
    current.current = next;
    setCount(next);
  }, []);

  const remainingGuestSpins = Math.max(0, MAX_GUEST_SPINS - count);
  const isGuestLimitReached = count >= MAX_GUEST_SPINS;

  return {
    count,
    enabled: true,
    recordSpin,
    remainingGuestSpins,
    isGuestLimitReached,
  };
}
