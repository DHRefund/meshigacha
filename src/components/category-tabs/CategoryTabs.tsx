'use client';

import React from 'react';
import type { CategoryType } from '@/lib/foods';
import type { Language } from '@/lib/i18n';

export interface CategoryTabsProps {
  selectedCategory: CategoryType | 'all';
  onSelectCategory: (category: CategoryType | 'all') => void;
  categoryCounts: Record<CategoryType | 'all', number>;
  language: Language;
  disabled?: boolean;
}

const CATEGORIES: { id: CategoryType | 'all'; labelVi: string; labelJa: string; labelEn: string; icon: string }[] = [
  { id: 'all', labelVi: 'Tất cả', labelJa: '全メニュー', labelEn: 'All Arsenal', icon: '⚡' },
  { id: 'main', labelVi: 'Món chính', labelJa: '主食・定食', labelEn: 'Main Dishes', icon: '🍴' },
  { id: 'drinks', labelVi: 'Đồ uống', labelJa: 'ドリンク・茶', labelEn: 'Drinks & Tea', icon: '☕' },
  { id: 'snacks', labelVi: 'Ăn vặt', labelJa: 'スナック・お菓子', labelEn: 'Snacks & Desserts', icon: '🍪' },
  { id: 'pub', labelVi: 'Món nhậu', labelJa: '居酒屋・おつまみ', labelEn: 'Pub & Beer', icon: '🍱' },
];

export function CategoryTabs({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  language,
  disabled = false,
}: CategoryTabsProps) {
  return (
    <div className="w-full mb-6 select-none">
      <div className="w-full bg-[#161f28]/90 border border-[#283747] rounded-2xl p-1.5 shadow-xl shadow-black/50 backdrop-blur-md">
        <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto no-scrollbar px-1 py-0.5 scroll-smooth">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            const label = language === 'ja' ? cat.labelJa : language === 'vi' ? cat.labelVi : cat.labelEn;

            return (
              <button
                key={cat.id}
                type="button"
                disabled={disabled}
                onClick={() => onSelectCategory(cat.id)}
                className={`group relative flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/25 via-amber-500/15 to-yellow-500/10 text-amber-300 border border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#202d3a] border border-transparent'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="text-sm sm:text-base transition-transform group-hover:scale-110">
                  {cat.icon}
                </span>
                <span>{label}</span>
                <span
                  className={`ml-0.5 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-mono font-extrabold transition-colors ${
                    isActive
                      ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50'
                      : 'bg-slate-800/80 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                  }`}
                >
                  {count}
                </span>

                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-7 h-[2.5px] bg-amber-400 rounded-full shadow-[0_0_10px_#f59e0b]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
