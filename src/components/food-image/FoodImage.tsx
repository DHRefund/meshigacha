"use client";

import React from "react";
import { Utensils } from "lucide-react";
import type { Food } from "@/lib/foods";

import type { Language } from "@/lib/i18n";

interface FoodImageProps {
  food: Food;
  language?: Language;
}

export function FoodImage({ food }: FoodImageProps) {
  // 1. Custom uploaded image URL
  if (food.imageUrl) {
    return (
      <div
        role="img"
        aria-label={food.name}
        className="food-image w-full h-full bg-cover bg-center rounded-lg shadow-inner"
        style={{
          backgroundImage: `url(${food.imageUrl})`,
        }}
      />
    );
  }

  // 2. Custom user item fallback icon
  if (food.customId) {
    return (
      <div
        className="food-image custom-food-art flex items-center justify-center bg-slate-800 text-slate-400 rounded-lg"
        role="img"
        aria-label={food.name}
      >
        <Utensils size={48} />
      </div>
    );
  }

  // 3. Universal 4x3 Grid Sprite Atlas Cropping per Category
  const cat = food.category || "main";
  let subfolder = "foods";
  let prefix = "food";

  if (cat === "drinks") {
    subfolder = "drinks";
    prefix = "drink";
  } else if (cat === "snacks") {
    subfolder = "snacks";
    prefix = "snack";
  } else if (cat === "pub") {
    subfolder = "pubs";
    prefix = "pub";
  }

  // Calculate sheet range (12 items per sheet: 0..11, 12..23, 24..35, etc.)
  const imageIndex = Math.max(0, food.image || 0);
  const sheetIndex = Math.floor(imageIndex / 12);
  const startIdx = sheetIndex * 12;
  const endIdx = startIdx + 11;
  const atlasUrl = `/new/${subfolder}/${prefix}-${startIdx}-${endIdx}.webp`;

  // Calculate 4x3 grid position inside sheet
  const localIndex = imageIndex % 12;
  const col = localIndex % 4; // 0, 1, 2, 3
  const row = Math.floor(localIndex / 4); // 0, 1, 2

  const posX = `${(col / 3) * 100}%`;
  const posY = `${(row / 2) * 100}%`;

  return (
    <div
      role="img"
      aria-label={food.name}
      className="food-image w-full h-full bg-no-repeat rounded-lg"
      style={{
        backgroundImage: `url(${atlasUrl})`,
        backgroundSize: "400% 300%",
        backgroundPosition: `${posX} ${posY}`,
      }}
    />
  );
}
