'use client';

import { useRef, useState, useCallback } from 'react';
import type { Food, CategoryType } from '@/lib/foods';
import { foods } from '@/lib/foods';
import { personalSelector, personalFoods } from '@/lib/personal-pool';
import { createSpinProfile, spinProgress, stopFraction } from '@/lib/case-mechanics';
import type { CaseSound } from '@/lib/case-audio';

interface UseSpinEngineOptions {
  category: CategoryType | 'all';
  budget: string;
  customBudget: string;
  vegOnly: boolean;
  userDisabledFoods?: string[];
  playSound: (soundName: CaseSound) => void;
  unlockAudio: () => void;
  onSpinFinish: (winner: Food) => void;
}

export function useSpinEngine({
  category,
  budget,
  customBudget,
  vegOnly,
  userDisabledFoods = [],
  playSound,
  unlockAudio,
  onSpinFinish,
}: UseSpinEngineOptions) {
  const [spinning, setSpinning] = useState(false);
  const [reel, setReel] = useState(() =>
    foods.slice(0, 12).map((food, id) => ({ food, id })),
  );

  const busyRef = useRef(false);
  const positionRef = useRef(-400);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);

  const filterFoods = useCallback(() => {
    let pool = foods.filter((f) => !userDisabledFoods.includes(f.name));

    if (category !== 'all') {
      pool = pool.filter((f) => f.category === category);
    }

    if (vegOnly) {
      pool = pool.filter((f) => f.veg);
    }

    const effectiveBudget = budget === 'custom' ? Number(customBudget) || 800 : Number(budget);
    if (effectiveBudget > 0) {
      pool = pool.filter((f) => f.price <= effectiveBudget);
    }

    return pool.length > 0 ? pool : foods;
  }, [category, budget, customBudget, vegOnly, userDisabledFoods]);

  const spin = useCallback(() => {
    if (busyRef.current) return;
    unlockAudio();
    busyRef.current = true;
    setSpinning(true);

    const candidates = filterFoods();
    const selector = personalSelector(candidates, 800);

    // Generate 60-card reel sequence
    const reelItems: { food: Food; id: number }[] = [];
    for (let i = 0; i < 60; i++) {
      const selected = selector ? selector.choose(candidates) : candidates[i % candidates.length];
      reelItems.push({ food: selected, id: i });
    }

    setReel(reelItems);

    // Winner card is at index 48
    const winnerItem = reelItems[48].food;
    const targetOffset = -(48 * 140 - 150 + stopFraction() * 120);

    const profile = createSpinProfile();
    const startPos = -400;
    const distance = targetOffset - startPos;
    const startTime = performance.now();
    let lastTickCardIndex = -1;

    playSound('csgo_ui_crate_open');

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / profile.durationMs);
      const currentPos = startPos + distance * spinProgress(progress, profile.friction);

      positionRef.current = currentPos;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${currentPos}px, 0, 0)`;
      }

      // Play tick sound when crossing card boundary
      const currentCardIndex = Math.floor((-currentPos + 150) / 140);
      if (currentCardIndex !== lastTickCardIndex) {
        lastTickCardIndex = currentCardIndex;
        playSound('csgo_ui_crate_item_scroll');
      }

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        // Spin finished
        busyRef.current = false;
        setSpinning(false);

        // Play reveal sound based on rarity
        const revealSounds: CaseSound[] = [
          'item_reveal3_rare',
          'item_reveal4_mythical',
          'item_reveal5_legendary',
          'item_reveal6_ancient',
        ];
        const soundToPlay = revealSounds[Math.min(winnerItem.rarity ?? 0, 3)];
        playSound(soundToPlay);

        onSpinFinish(winnerItem);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
  }, [filterFoods, unlockAudio, playSound, onSpinFinish]);

  return {
    spinning,
    reel,
    spin,
    viewportRef,
    trackRef,
    filterFoods,
  };
}
