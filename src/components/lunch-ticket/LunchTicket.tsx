'use client';

import React, { useEffect, useState } from 'react';
import type { Food } from '@/lib/foods';
import type { Language } from '@/lib/i18n';
import { foodName, priceLabel } from '@/lib/i18n';
import { CheckCircle, X, Sparkles } from 'lucide-react';
import { FoodImage } from '@/components/food-image/FoodImage';

interface LunchTicketProps {
  confirmedDish: Food | null;
  language: Language;
  onClearTicket?: () => void;
  durationMs?: number;
}

export function LunchTicket({
  confirmedDish,
  language,
  onClearTicket,
  durationMs = 4500,
}: LunchTicketProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!confirmedDish) {
      setVisible(false);
      return;
    }

    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClearTicket?.();
      }, 300); // wait for fade out transition
    }, durationMs);

    return () => clearTimeout(timer);
  }, [confirmedDish, durationMs, onClearTicket]);

  if (!confirmedDish || !visible) return null;

  return (
    <div className="fixed bottom-4 sm:bottom-5 left-4 right-4 sm:left-auto sm:right-5 z-50 max-w-sm w-auto sm:w-full transition-all duration-300 transform translate-y-0 opacity-100 select-none animate-slide-up">

      <div className="relative p-3.5 rounded-2xl bg-[#12141a]/95 border border-emerald-500/50 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl text-slate-100 overflow-hidden">
        {/* Animated Progress Timer Line */}
        <div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 transition-all ease-linear"
          style={{
            animation: `toast-progress ${durationMs}ms linear forwards`,
          }}
        />

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-emerald-500/40 shadow-inner">
            <FoodImage food={confirmedDish} language={language} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-extrabold uppercase tracking-wide">
              <CheckCircle size={13} />
              <span>
                {language === 'ja'
                  ? '本日のランチに確定！'
                  : language === 'vi'
                  ? 'ĐÃ CHỐT ĐƠN BỮA TRƯA!'
                  : 'LUNCH CONFIRMED!'}
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-100 truncate mt-0.5">
              {foodName(confirmedDish, language)}
            </h4>

            <div className="flex items-center gap-2 mt-0.5 text-xs">
              <span className="text-amber-300 font-semibold">
                {priceLabel(confirmedDish.price, language, true)}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Sparkles size={10} className="text-amber-400" />
                {language === 'ja' ? '履歴に保存済み' : language === 'vi' ? 'Đã lưu lịch sử' : 'Saved'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setVisible(false);
              onClearTicket?.();
            }}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors shrink-0"
            title="Đóng"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

