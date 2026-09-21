'use client';

import React from 'react';
import { AudioLines, Sparkles, Leaf, Lock, Utensils, Coins, Plus, Minus } from 'lucide-react';
import type { Language } from '@/lib/i18n';
import { copy, priceLabel } from '@/lib/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface ControlBarProps {
  language: Language;
  budget: string;
  custom: string;
  veg: boolean;
  spinning: boolean;
  validTarget: boolean;
  eligibleCount: number;
  filteredMean: number;
  targetPrice: number;
  result: unknown | null;
  isGuest: boolean;
  remainingGuestSpins: number;
  isGuestLimitReached: boolean;
  onBudgetChange: (val: string) => void;
  onCustomChange: (val: string) => void;
  onVegChange: (val: boolean) => void;
  onOpen: () => void;
}

export function ControlBar({
  language,
  budget,
  custom,
  veg,
  spinning,
  validTarget,
  eligibleCount,
  filteredMean,
  targetPrice,
  result,
  isGuest,
  remainingGuestSpins,
  isGuestLimitReached,
  onBudgetChange,
  onCustomChange,
  onVegChange,
  onOpen,
}: ControlBarProps) {
  const t = copy[language];

  return (
    <div className="control-bar">
      <div className="filters">
        {/* Modern CS:GO Esports Budget Selector Chips */}
        <div className="budget-selector-wrapper">
          <div className="budget-header">
            <span className="budget-label flex items-center gap-1.5">
              <Coins size={14} className="text-amber-400 shrink-0" />
              <span>{language === 'ja' ? '予算設定' : language === 'vi' ? 'Ngân sách' : 'Budget'}</span>
            </span>
            {validTarget && eligibleCount > 0 && (
              <span className="budget-mean-badge">
                {language === 'ja' ? 'Ký vọng' : language === 'vi' ? 'Kỳ vọng' : 'Target'}: ~{priceLabel(Math.round(filteredMean), language, true)}
              </span>
            )}
          </div>

          <div className="budget-chips-container">
            {['500', '800', '1000', '1200', '1500'].map((v) => {
              const isActive = budget === v;
              return (
                <button
                  key={v}
                  type="button"
                  disabled={spinning}
                  onClick={() => onBudgetChange(v)}
                  className={`budget-chip ${isActive ? 'is-active' : ''}`}
                >
                  <span>{priceLabel(v, language)}</span>
                </button>
              );
            })}
            <button
              type="button"
              disabled={spinning}
              onClick={() => onBudgetChange('custom')}
              className={`budget-chip ${budget === 'custom' ? 'is-active' : ''}`}
            >
              <span>{t.custom}</span>
            </button>
          </div>

          {budget === 'custom' && (
            <div className="custom-spend-box">
              <button
                type="button"
                disabled={spinning || Number(custom) <= 300}
                onClick={() => onCustomChange(String(Math.max(300, Number(custom) - 50)))}
                className="step-btn"
                title="-50"
              >
                <Minus size={14} />
              </button>
              <div className="custom-input-wrapper">
                <input
                  aria-label={t.customSpend}
                  aria-invalid={!validTarget}
                  type="number"
                  inputMode="numeric"
                  min="300"
                  max="2500"
                  step="50"
                  value={custom}
                  disabled={spinning}
                  onChange={(e) => onCustomChange(e.target.value)}
                  className="custom-input"
                />
                <span className="unit-label">{language === 'ja' ? '円' : language === 'vi' ? 'k' : '¥'}</span>
              </div>
              <button
                type="button"
                disabled={spinning || Number(custom) >= 2500}
                onClick={() => onCustomChange(String(Math.min(2500, Number(custom) + 50)))}
                className="step-btn"
                title="+50"
              >
                <Plus size={14} />
              </button>
            </div>
          )}

          {!validTarget && (
            <small className="spend-note text-rose-400 font-semibold" role="alert">
              {t.spendError}
            </small>
          )}
        </div>

        {/* Modern Dual-Segment Vegetarian / All Foods Toggle */}
        <div className="veg-toggle-wrapper">
          <label className="veg-toggle-label">
            {language === 'ja' ? 'メニューモード' : language === 'vi' ? 'Chế độ ăn' : 'Diet Mode'}
          </label>
          <button
            type="button"
            role="switch"
            aria-checked={veg}
            disabled={spinning}
            onClick={() => onVegChange(!veg)}
            className={`veg-toggle-pill ${veg ? 'is-veg' : 'is-all'} ${spinning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="veg-toggle-bg" />
            <span className={`veg-toggle-option ${!veg ? 'active' : ''}`}>
              <Utensils size={14} />
              <span>{language === 'ja' ? '全メニュー' : language === 'vi' ? 'Tất cả' : 'All'}</span>
            </span>
            <span className={`veg-toggle-option ${veg ? 'active' : ''}`}>
              <Leaf size={14} />
              <span>{language === 'ja' ? '精進料理' : language === 'vi' ? 'Món chay' : 'Veg'}</span>
            </span>
          </button>
        </div>
      </div>

      <div className="open-wrap">
        <button
          className={`open-button ${isGuestLimitReached ? '!bg-amber-600 !border-amber-400 !text-white' : ''}`}
          disabled={spinning || !validTarget || !eligibleCount}
          onClick={onOpen}
        >
          {spinning ? (
            <AudioLines size={22} />
          ) : isGuestLimitReached ? (
            <Lock size={21} />
          ) : (
            <Sparkles size={21} />
          )}
          {spinning
            ? t.opening
            : isGuestLimitReached
            ? language === 'ja'
              ? 'ログインして無制限で引く'
              : 'ĐĂNG NHẬP MỞ KHÔNG GIỚI HẠN'
            : result
            ? t.openAgain
            : t.open}{' '}
          <span>↗</span>
        </button>

        {isGuest ? (
          <span className="block mt-2 text-xs text-amber-300 font-medium">
            {language === 'ja'
              ? `無料お試し残り: ${remainingGuestSpins}/5回`
              : language === 'vi'
              ? `Lượt quay thử còn lại: ${remainingGuestSpins}/5`
              : `Free guest spins left: ${remainingGuestSpins}/5`}
          </span>
        ) : (
          <span className="block mt-2 text-xs text-emerald-400 font-medium">
            {language === 'ja'
              ? '★ ログイン済み: 無制限ガチャ有効'
              : language === 'vi'
              ? '★ Thành viên: Quay không giới hạn'
              : '★ Member: Unlimited spins'}
          </span>
        )}
      </div>
    </div>
  );
}
