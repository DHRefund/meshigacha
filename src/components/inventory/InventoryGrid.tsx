'use client';

import React, { useState, useMemo } from 'react';
import type { Food } from '@/lib/foods';
import type { Language } from '@/lib/i18n';
import { copy, foodName } from '@/lib/i18n';
import { rarityColors, FoodCard } from '@/components/food-card/FoodCard';
import { PreferencesPanel } from '@/components/preferences-panel';
import { usePreferences } from '@/hooks/use-preferences';
import { ChevronDown, UtensilsCrossed, RefreshCw } from 'lucide-react';

interface InventoryGridProps {
  eligibleFoods: Food[];
  language: Language;
  spinning: boolean;
  onCardClick?: (food: Food) => void;
  onResetFilters?: () => void;
}

const INITIAL_BATCH_SIZE = 27; // 3 rows of 9 columns

export function InventoryGrid({
  eligibleFoods,
  language,
  spinning,
  onCardClick,
  onResetFilters,
}: InventoryGridProps) {
  const preferences = usePreferences();
  const t = copy[language];
  const [displayLimit, setDisplayLimit] = useState(INITIAL_BATCH_SIZE);

  const sortedFoods = useMemo(() => {
    return [...eligibleFoods].sort(
      (a, b) =>
        a.rarity - b.rarity ||
        a.price - b.price ||
        foodName(a, language).localeCompare(foodName(b, language), language),
    );
  }, [eligibleFoods, language]);

  const visibleFoods = useMemo(() => {
    return sortedFoods.slice(0, displayLimit);
  }, [sortedFoods, displayLimit]);

  const hasMore = displayLimit < sortedFoods.length;

  const handleLoadMore = () => {
    setDisplayLimit((prev) => Math.min(prev + 36, sortedFoods.length));
  };

  const handleShowAll = () => {
    setDisplayLimit(sortedFoods.length);
  };

  // Reset display batch size whenever eligible foods / tab changes
  React.useEffect(() => {
    setDisplayLimit(INITIAL_BATCH_SIZE);
  }, [eligibleFoods]);

  return (
    <section className="inventory">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{t.whatsInside}</span>
          <div className="inventory-title-row">
            <h2>
              {t.items}{' '}
              <span>{eligibleFoods.length.toString().padStart(2, '0')}</span>
            </h2>
            <PreferencesPanel
              preferences={preferences}
              language={language}
              disabled={spinning}
              variant="inventory"
            />
          </div>
        </div>

        <div className="rarity-legend">
          {t.tiers.map((tier, i) => (
            <span key={tier}>
              <i style={{ background: rarityColors[i] }} />
              {tier}
            </span>
          ))}
        </div>
      </div>

      {eligibleFoods.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 my-6 bg-[#16171b] border border-amber-500/20 rounded-2xl text-center shadow-xl">
          <div className="p-4 bg-amber-500/10 text-amber-400 rounded-full mb-4 border border-amber-500/30">
            <UtensilsCrossed size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-2">
            {language === 'ja'
              ? '該当するメニューがありません'
              : language === 'vi'
              ? 'Không tìm thấy món ăn phù hợp'
              : 'No matching dishes found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            {language === 'ja'
              ? '精進料理（ベジタリアン）フィルターまたはカテゴリー設定を解除して再試行してください。'
              : language === 'vi'
              ? 'Vui lòng tắt bộ lọc chay hoặc chuyển sang danh mục khác để xem danh sách món ăn.'
              : 'Try turning off the vegetarian filter or switching to another category.'}
          </p>
          {onResetFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <RefreshCw size={15} />
              {language === 'ja'
                ? 'フィルターを解除'
                : language === 'vi'
                ? 'Đặt lại bộ lọc'
                : 'Reset Filters'}
            </button>
          )}
        </div>
      ) : (
        <div className="inventory-grid">
          {visibleFoods.map((food) => (
            <FoodCard
              key={food.customId ?? food.id ?? `${food.category ?? 'main'}-${food.image}`}
              food={food}
              language={language}
              small
              onClick={() => onCardClick?.(food)}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={handleLoadMore}
            className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#24323e] hover:bg-[#2e3e4d] text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <ChevronDown size={16} />
            {language === 'ja'
              ? `もっと見る (あと${sortedFoods.length - displayLimit}品)`
              : language === 'vi'
              ? `Xem thêm (${sortedFoods.length - displayLimit} món nữa)`
              : `Show more (${sortedFoods.length - displayLimit} more)`}
          </button>
          <button
            onClick={handleShowAll}
            className="px-4 py-2.5 rounded-md bg-transparent hover:bg-slate-800 text-slate-400 text-xs font-medium transition-colors"
          >
            {language === 'ja' ? '全件表示' : language === 'vi' ? 'Xem tất cả' : 'Show all'}
          </button>
        </div>
      )}
    </section>
  );
}

