'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, History, Sparkles, RotateCcw, Share2, Check, Coffee, Cookie } from 'lucide-react';
import { fireVictoryConfetti } from '@/lib/confetti';
import type { Food, CategoryType } from '@/lib/foods';
import type { Language } from '@/lib/i18n';
import { copy, foodName, foodQuip, priceLabel } from '@/lib/i18n';
import { rarityColors } from '@/components/food-card/FoodCard';
import { FoodImage } from '@/components/food-image/FoodImage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

interface WinnerModalProps {
  result: Food | null;
  revealed: boolean;
  language: Language;
  onClose: () => void;
  onConfirmDish?: (food: Food) => void;
  onReroll?: () => void;
  onSideQuestRoll?: (category: CategoryType) => void;
  isSpinResult?: boolean;
}

export function WinnerModal({
  result,
  revealed,
  language,
  onClose,
  onConfirmDish,
  onReroll,
  onSideQuestRoll,
  isSpinResult = true,
}: WinnerModalProps) {
  const t = copy[language];
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConfirm = () => {
    if (result && onConfirmDish) {
      onConfirmDish(result);
      setConfirmed(true);
      fireVictoryConfetti();
    }
  };

  const handleModalClose = () => {
    setConfirmed(false);
    setCopied(false);
    onClose();
  };

  const handleShare = async () => {
    if (!result) return;
    const name = foodName(result, language);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareText =
      language === 'ja'
        ? `🎯 本日のランチ決定：「${name}」（${priceLabel(result.price, 'ja')}）！\n一緒に何食べるかケースを引こう：${origin}`
        : language === 'vi'
        ? `🎯 Trưa nay tui chọn món "${name}" (${result.price}k)!\nVào mở hòm chọn món ăn trưa cùng tui nè: ${origin}`
        : `🎯 Lunch pick: "${name}" (${result.price}k)!\nFind out what to eat for lunch: ${origin}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch { }
  };

  return (
    <Dialog open={revealed} onOpenChange={(open) => !open && handleModalClose()}>
      <DialogContent
        className="winner-dialog"
        showCloseButton={false}
        style={{ '--rarity': rarityColors[result?.rarity ?? 0] } as React.CSSProperties}
      >
        {result && (
          <>
            {/* Top Stage Label & VIP Tier Badge */}
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`winner-label px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase border ${
                  isSpinResult
                    ? 'text-amber-300 bg-amber-950/80 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)] animate-pulse'
                    : 'text-sky-300 bg-sky-950/80 border-sky-500/50'
                }`}
              >
                {isSpinResult
                  ? language === 'ja'
                    ? '✨ 当たりアイテムゲット！'
                    : language === 'vi'
                    ? '✨ VẬT PHẨM TRÚNG THƯỞNG!'
                    : '✨ YOU WON A NEW ITEM!'
                  : language === 'ja'
                  ? '🔍 料理の詳細'
                  : language === 'vi'
                  ? '🔍 CHI TIẾT VẬT PHẨM'
                  : '🔍 DISH DETAILS'}
              </span>

              <div className="flex items-center gap-2 mt-1">
                <span
                  className="px-2.5 py-0.5 rounded-md text-[11px] font-black tracking-wider uppercase border shadow-sm"
                  style={{
                    color: rarityColors[result.rarity],
                    borderColor: rarityColors[result.rarity],
                    backgroundColor: `color-mix(in srgb, ${rarityColors[result.rarity]}, transparent 85%)`,
                  }}
                >
                  {t.tiers[result.rarity]}
                </span>
                {result.veg && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40">
                    🌱 {language === 'ja' ? '精進料理' : language === 'vi' ? 'Món chay' : 'Vegetarian'}
                  </span>
                )}
              </div>
            </div>

            {/* Dish Title */}
            <DialogTitle className="winner-title text-center text-slate-100">
              {foodName(result, language)}
            </DialogTitle>

            <DialogDescription className="winner-description text-center">
              {t.referencePrice} · {priceLabel(result.price, language, true)}{' '}
              {t.perPerson}
            </DialogDescription>

            {/* Quip Display */}
            {foodQuip(result, language) && (
              <div className="winner-quip">
                <Sparkles size={16} className="text-amber-400 shrink-0 animate-pulse" />
                <span>“{foodQuip(result, language)}”</span>
              </div>
            )}

            {/* CS:GO Stage Showcase Card */}
            <div className="winner-art-container">
              <div
                className="winner-aura-rays"
                style={
                  {
                    '--rarity': rarityColors[result.rarity],
                  } as React.CSSProperties
                }
              />
              <div
                className="winner-art"
                style={
                  {
                    '--rarity': rarityColors[result.rarity],
                  } as React.CSSProperties
                }
              >
                <FoodImage food={result} language={language} />
              </div>
            </div>

            {/* Action Bar */}
            <div className="winner-actions-wrapper">
              {confirmed && (
                <div className="w-full flex flex-col items-center gap-1.5 p-2 bg-[#171922] border border-amber-500/40 rounded-xl animate-fade-in text-center shadow-lg">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 size={15} />
                    <span>
                      {language === 'ja'
                        ? '本日のランチに確定しました！'
                        : language === 'vi'
                        ? 'ĐÃ CHỐT MÓN CHÍNH THÀNH CÔNG!'
                        : 'MAIN DISH CONFIRMED!'}
                    </span>
                  </div>

                  {onSideQuestRoll && (
                    <div className="flex items-center justify-center gap-2 mt-0.5 w-full">
                      <button
                        type="button"
                        onClick={() => {
                          handleModalClose();
                          onSideQuestRoll('drinks');
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-sky-950/80 hover:bg-sky-900 border border-sky-500/50 text-sky-200 text-xs font-bold transition-all shadow-md active:scale-95"
                      >
                        <Coffee size={14} className="text-sky-400" />
                        <span>{language === 'ja' ? '☕ ドリンクを引く' : language === 'vi' ? '☕ Quay Đồ Uống' : '☕ Roll Drink'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          handleModalClose();
                          onSideQuestRoll('snacks');
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-200 text-xs font-bold transition-all shadow-md active:scale-95"
                      >
                        <Cookie size={14} className="text-amber-400" />
                        <span>{language === 'ja' ? '🍪 デザートを引く' : language === 'vi' ? '🍪 Quay Tráng Miệng' : '🍪 Roll Snack'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="winner-actions-secondary">
                {/* Reroll Button */}
                {isSpinResult && onReroll && (
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmed(false);
                      onReroll();
                    }}
                    className="winner-reroll-btn"
                    title={language === 'ja' ? '別の料理をもう一度引く' : language === 'vi' ? 'Thử vận may món khác' : 'Spin again'}
                  >
                    <RotateCcw size={14} />
                    <span>{language === 'ja' ? '🎲 別の料理を引く' : language === 'vi' ? '🎲 Quay món khác' : '🎲 Spin Again'}</span>
                  </button>
                )}

                {/* Share Button */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="winner-share-btn"
                  title={language === 'ja' ? '友達にシェアする' : language === 'vi' ? 'Khoe món này với bạn bè' : 'Share with friends'}
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                  <span>
                    {copied
                      ? language === 'ja'
                        ? 'コピー完了！'
                        : language === 'vi'
                        ? 'Đã copy lời rủ!'
                        : 'Link copied!'
                      : language === 'ja'
                      ? '📸 友達に共有'
                      : language === 'vi'
                      ? '📸 Khoe bạn bè'
                      : '📸 Share'}
                  </span>
                </button>
              </div>

              <div className="winner-actions">
                {/* CHỐT MÓN NÀY BUTTON */}
                {!confirmed && (
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs tracking-wide transition-all uppercase shadow-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 border border-amber-300/60 shadow-[0_0_20px_rgba(245,158,11,0.35)] active:scale-95"
                  >
                    <CheckCircle2 size={16} />
                    <span>
                      {isSpinResult
                        ? language === 'ja'
                          ? '🎯 このメニューに決定'
                          : language === 'vi'
                          ? '🎯 CHỐT MÓN NÀY'
                          : '🎯 CONFIRM THIS MEAL'
                        : language === 'ja'
                        ? '🎯 これをランチに選ぶ'
                        : language === 'vi'
                        ? '🎯 CHỌN MÓN NÀY ĂN TRƯA'
                        : '🎯 PICK THIS FOR LUNCH'}
                    </span>
                  </button>
                )}

                <a
                  className="find-button"
                  href={`https://www.google.com/maps/search/${encodeURIComponent(
                    foodName(result, language) + ' ' + t.nearby,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.find} <ArrowUpRight size={14} />
                </a>

                <a
                  className="grabfood-button"
                  href={`https://food.grab.com/vn/vi/restaurants?${new URLSearchParams(
                    {
                      search: result.name,
                      'support-deeplink': 'true',
                      searchParameter: result.name,
                    },
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={
                    language === 'ja'
                      ? `${foodName(result, language)}を出前検索`
                      : language === 'vi'
                      ? `Đặt ${result.name} qua GrabFood`
                      : `Find ${foodName(result, language)} on GrabFood`
                  }
                >
                  <span className="grabfood-label">
                    {language === 'ja' ? '検索する' : language === 'vi' ? 'Đặt qua' : 'Order'}{' '}
                    <strong>GrabFood</strong>
                  </span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>

                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  {isSpinResult ? t.continue : language === 'ja' ? '閉じる' : language === 'vi' ? 'Đóng' : 'Close'}
                </button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}


