"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { Food, Rarity, SpinResult } from "@/types";
import { SEED_FOODS, SEED_SHOPS } from "@/data/foods";
import { selectRandomFood } from "@/lib/random";
import { getRandomBark } from "@/data/barkLines";
import {
  calculateSpinOffset,
  SPIN_ANIMATION_CONFIG,
} from "@/lib/gsap-timelines";
import { saveSpinHistory } from "@/lib/storage";
import { CaseAudio, CaseSound } from "@/lib/case-audio";

interface SpinMachineProps {
  audioEngine?: CaseAudio | null;
  onSpinStart: () => void;
  onSpinning: () => void;
  onSpinComplete: (result: SpinResult) => void;
  isSpinning: boolean;
}

export const SpinMachine: React.FC<SpinMachineProps> = ({
  audioEngine,
  onSpinStart,
  onSpinComplete,
  isSpinning,
}) => {
  const stripRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayItems, setDisplayItems] = useState<Food[]>([]);

  const handleStartSpin = () => {
    if (isSpinning) return;

    // 1. Unlock Web Audio API on click gesture (Crucial for iOS Safari / Mobile Autoplay)
    audioEngine?.unlock();
    audioEngine?.play("csgo_ui_crate_open");

    onSpinStart();

    // 2. RANDOM RESULT FIRST
    const { food: winnerFood, rarity } = selectRandomFood(SEED_FOODS);
    const winnerShop = SEED_SHOPS[winnerFood.id] || {
      id: "default",
      name: "Quán Ăn Phổ Thông",
      lat: 10.7769,
      lng: 106.7009,
      address: "Trung tâm thành phố",
      foodId: winnerFood.id,
      distanceKm: 0.5,
    };
    const winnerBark = getRandomBark(
      rarity === "legendary"
        ? "reveal_legendary"
        : rarity === "rare"
          ? "reveal_rare"
          : "reveal_common",
    );

    // 3. Prepare 45 items strip
    const WINNER_INDEX = 38;
    const reelItems: Food[] = [];
    for (let i = 0; i < 45; i++) {
      if (i === WINNER_INDEX) {
        reelItems.push(winnerFood);
      } else {
        const randomItem =
          SEED_FOODS[Math.floor(Math.random() * SEED_FOODS.length)];
        reelItems.push(randomItem);
      }
    }
    setDisplayItems(reelItems);

    if (stripRef.current) {
      gsap.set(stripRef.current, { x: 0 });
    }

    const containerWidth = containerRef.current?.offsetWidth || 360;
    const itemWidth = 254; // 240px + 14px gap
    const targetX = calculateSpinOffset(
      WINNER_INDEX,
      itemWidth,
      containerWidth,
    );

    let lastTickIndex = 0;

    // 4. Animate GSAP reel with scroll tick sounds
    setTimeout(() => {
      if (!stripRef.current) return;

      gsap.to(stripRef.current, {
        x: targetX,
        duration: SPIN_ANIMATION_CONFIG.duration,
        ease: SPIN_ANIMATION_CONFIG.ease,
        onUpdate: function () {
          // Play scroll tick sound as cards cross index threshold
          const currentX = Math.abs(
            gsap.getProperty(stripRef.current, "x") as number,
          );
          const currentCardIndex = Math.floor(currentX / itemWidth);
          if (currentCardIndex !== lastTickIndex) {
            audioEngine?.play("csgo_ui_crate_item_scroll");
            lastTickIndex = currentCardIndex;
          }
        },
        onComplete: () => {
          // Play reveal sound based on Rarity
          const revealSound: CaseSound =
            rarity === "legendary"
              ? "item_reveal5_legendary"
              : rarity === "rare"
                ? "item_reveal3_rare"
                : "csgo_ui_crate_item_scroll";
          audioEngine?.play(revealSound);

          // Save history
          saveSpinHistory({
            foodId: winnerFood.id,
            shopId: winnerShop.id,
            timestamp: Date.now(),
            rarity,
          });

          // Trigger result callback
          onSpinComplete({
            food: winnerFood,
            shop: winnerShop,
            rarity,
            bark: winnerBark,
          });
        },
      });
    }, 50);
  };

  const getRarityStyle = (rarity: Rarity) => {
    switch (rarity) {
      case "legendary":
        return "#e4ae39";
      case "rare":
        return "#8847ff";
      default:
        return "#4b69ff";
    }
  };

  return (
    <div className="w-full my-4 flex flex-col items-center">
      {/* Reel Window Container */}
      <div ref={containerRef} className="reel-window w-full">
        {/* CS2 Target Indicator Pointer */}
        <div className="selector-line" />

        {/* Outer Shadow Fades */}
        <div className="reel-fade left" />
        <div className="reel-fade right" />

        {/* Reel Moving Strip */}
        <div
          ref={stripRef}
          className="reel-track"
          style={{ width: `${displayItems.length * 254}px` }}
        >
          {displayItems.length > 0 ? (
            displayItems.map((item, idx) => (
              <div
                key={idx}
                className="food-card"
                style={
                  {
                    "--rarity": getRarityStyle(item.rarity),
                  } as React.CSSProperties
                }
              >
                <div className="text-6xl mb-4 select-none">{item.image}</div>
                <div className="card-copy">
                  <strong>{item.name}</strong>
                  <span>~{item.priceEstimate}.000đ</span>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">
              Sẵn sàng mở hòm... Nhấn &ldquo;QUAY MÓN HÔM NAY&rdquo; bên dưới!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
