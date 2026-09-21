'use client';

import React, { memo } from 'react';
import type { Food } from '@/lib/foods';
import { copy, foodName, foodSubtitle, priceLabel, type Language } from '@/lib/i18n';
import { FoodImage } from '@/components/food-image/FoodImage';

export const rarityColors = ['#4b69ff', '#8847ff', '#d32ce6', '#eb4b4b', '#e4ae39'];

export function MysteryArt({ language }: { language: Language }) {
  return (
    <div className="mystery-art" role="img" aria-label={copy[language].mysteryAlt}>
      <div className="mystery-rays" />
      <svg className="mystery-emblem" viewBox="0 0 240 150" aria-hidden="true">
        <path className="gold-orbit" d="M120 5 174 27 193 75 174 123 120 145 66 123 47 75 66 27Z" />
        <path
          fill="#b27a16"
          d="m120 10 16 38 44-18-18 38 55 7-55 14 18 34-44-16-16 33-16-33-44 16 18-34-55-14 55-7-18-38 44 18Z"
        />
        <path
          fill="#ffe59a"
          d="m120 18 13 41 38-21-23 35 49 2-49 10 23 31-38-18-13 34-13-34-38 18 23-31-49-10 49-2-23-35 38 21Z"
        />
        <path fill="#372414" stroke="#eac366" strokeWidth="2" d="m120 34 35 20 0 42-35 20-35-20V54Z" />
        <path
          fill="#fff3ba"
          d="M104 61c0-22 36-24 36-2 0 10-12 13-13 20v4h-13v-6c0-9 12-12 12-18 0-8-11-7-11 2zm10 28h13v13h-13z"
        />
        <path
          fill="#fff5ce"
          d="m34 29 3 7 8 2-8 3-3 8-2-8-8-3 8-2zm164 66 3 9 10 2-10 3-3 10-3-10-9-3 9-2zM186 19l3 3-3 3-3-3zM52 117l3 3-3 3-3-3z"
        />
      </svg>
      <div className="mystery-sheen" />
    </div>
  );
}

interface FoodCardProps {
  food: Food;
  language: Language;
  small?: boolean;
  slot?: number;
  onClick?: () => void;
}

export const FoodCard = memo(function FoodCard({
  food,
  language,
  small = false,
  slot,
  onClick,
}: FoodCardProps) {
  const mystery = !small && food.rarity === 4;
  const t = copy[language];

  return (
    <div
      className={`food-card ${small ? 'small' : ''} ${mystery ? 'mystery-card' : ''}`}
      data-slot-id={slot}
      data-food-id={food.image}
      onClick={onClick}
      style={
        {
          '--rarity': rarityColors[food.rarity],
          ...(slot === undefined ? {} : { position: 'absolute', left: slot * 254 }),
        } as React.CSSProperties
      }
    >
      <span className="tier">{t.tiers[food.rarity]}</span>
      {food.veg && (
        <span
          className="veg-badge"
          title={language === 'ja' ? '精進料理（ベジタリアン）' : language === 'vi' ? 'Món chay' : 'Vegetarian'}
        >
          🌱
        </span>
      )}
      {mystery ? (
        <MysteryArt language={language} />
      ) : (
        <FoodImage food={food} language={language} />
      )}
      <div className="card-copy">
        <strong>{mystery ? t.mystery : foodName(food, language)}</strong>
        <span>
          {small
            ? priceLabel(food.price, language, true)
            : foodSubtitle(food, language)}
        </span>
      </div>
    </div>
  );
});
