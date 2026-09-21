"use client";

import React from "react";
import { Food, Rarity, Shop } from "@/types";
import { Share2, MapPin } from "lucide-react";

interface DishDetailModalProps {
  food: Food;
  shop?: Shop;
  rarity?: Rarity;
  onClose: () => void;
}

export const ResultCard: React.FC<DishDetailModalProps> = ({
  food,
  shop,
  onClose,
}) => {
  const currentRarity = food.rarity || "common";
  const rarityColor =
    currentRarity === "legendary"
      ? "#e4ae39"
      : currentRarity === "rare"
        ? "#8847ff"
        : "#4b69ff";

  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
    shop ? `${shop.name} ${shop.address}` : `${food.name} gần đây`,
  )}`;

  const grabFoodUrl = `https://food.grab.com/vn/vi/restaurants?search=${encodeURIComponent(
    food.name,
  )}`;

  const shopeeFoodUrl = `https://shopeefood.vn/ho-chi-minh/list?q=${encodeURIComponent(
    food.name,
  )}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: food.name,
          text: `Trưa nay ăn ${food.name} nhé!`,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Đã sao chép liên kết!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17232ceb] backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg flex flex-col items-center text-center animate-scale-up">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-normal text-[#f3f3ef] mb-1">
          {food.name}
        </h2>
        <p className="text-sm font-normal text-[#96989f] mb-6">
          Giá tham khảo · {food.priceEstimate || 45}.000đ / phần
        </p>

        {/* Large Food Image Frame with Rarity Glow & Bottom Line */}
        <div
          className="relative w-72 h-72 md:w-80 md:h-80 rounded-lg overflow-hidden bg-[#202126] border border-[#ffffff15] shadow-2xl flex items-center justify-center mb-6"
          style={
            {
              borderBottom: `4px solid ${rarityColor}`,
              boxShadow: `0 12px 30px -10px ${rarityColor}44`,
            } as React.CSSProperties
          }
        >
          <div className="text-8xl select-none">{food.image}</div>
        </div>

        {/* Location Status Badge */}
        <div className="flex items-center justify-center gap-2 mb-6 text-xs text-[#b6c2ca]">
          <span>Vị trí đang được kết nối</span>
          <button className="px-2 py-0.5 rounded bg-[#ffffff10] text-[#dec989] text-[11px] flex items-center gap-1 border border-[#ffffff15]">
            <MapPin size={12} /> Bán kính 2km
          </button>
        </div>

        {/* 4 Action Buttons Grid (Google Maps, GrabFood, ShopeeFood, Chia sẻ) */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {/* Google Maps Button */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-lg bg-white text-slate-900 font-semibold text-xs hover:bg-slate-100 transition-colors shadow"
          >
            <span className="text-base">📍</span> Google Maps
          </a>

          {/* GrabFood Button */}
          <a
            href={grabFoodUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-lg bg-white text-emerald-600 font-bold text-xs hover:bg-slate-100 transition-colors shadow"
          >
            <span className="text-base">🟢</span> GrabFood
          </a>

          {/* ShopeeFood Button */}
          <a
            href={shopeeFoodUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-lg bg-white text-orange-600 font-bold text-xs hover:bg-slate-100 transition-colors shadow"
          >
            <span className="text-base">🟠</span> ShopeeFood
          </a>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-lg bg-[#25333d] text-white border border-[#ffffff20] font-semibold text-xs hover:bg-[#324350] transition-colors"
          >
            <Share2 size={15} /> Chia sẻ
          </button>
        </div>

        {/* Big Green TIẾP TỤC Button */}
        <button
          onClick={onClose}
          className="w-full py-4 rounded-lg bg-[#6b9545] hover:bg-[#7ba951] text-white font-bold text-base uppercase tracking-wider shadow-lg transition-colors"
        >
          TIẾP TỤC
        </button>
      </div>
    </div>
  );
};
