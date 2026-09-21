'use client';

import React, { RefObject } from 'react';
import type { Food } from '@/lib/foods';
import type { Language } from '@/lib/i18n';
import { copy } from '@/lib/i18n';
import { FoodCard } from '@/components/food-card/FoodCard';

interface ReelItem {
  id: number;
  food: Food;
}

interface SpinReelProps {
  language: Language;
  moving: boolean;
  visibleStart: number;
  reelItems: ReelItem[];
  viewportRef: RefObject<HTMLDivElement | null>;
  attachTrackRef: (node: HTMLDivElement | null) => void;
}

export function SpinReel({
  language,
  moving,
  reelItems,
  viewportRef,
  attachTrackRef,
}: SpinReelProps) {
  const t = copy[language];

  return (
    <section className="case-panel" aria-label={t.caseLabel}>
      <div className={`reel-window ${moving ? 'is-spinning' : ''}`} ref={viewportRef}>
        <div className="selector-line" />
        <div className="reel-track" ref={attachTrackRef}>
          {reelItems.map(({ food, id }) => (
            <FoodCard key={id} food={food} language={language} slot={id} />
          ))}
        </div>
        <div className="reel-fade left" />
        <div className="reel-fade right" />
      </div>
    </section>
  );
}
