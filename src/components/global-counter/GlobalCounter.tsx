import React, { useEffect, useState, useRef } from 'react';
import { Flame, Radio, Sparkles } from 'lucide-react';
import type { Language } from '@/lib/i18n';

interface GlobalCounterProps {
  count: number;
  language: Language;
  compact?: boolean;
}

export function GlobalCounter({
  count,
  language,
  compact = true,
}: GlobalCounterProps) {
  const [displayCount, setDisplayCount] = useState(count);
  const prevCount = useRef(count);
  const animFrame = useRef<number | null>(null);

  useEffect(() => {
    const startValue = prevCount.current;
    const endValue = count;
    const duration = 1200; // 1.2s smooth animation
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(startValue + (endValue - startValue) * easeOut);

      setDisplayCount(current);

      if (progress < 1) {
        animFrame.current = requestAnimationFrame(animate);
      } else {
        setDisplayCount(endValue);
        prevCount.current = endValue;
      }
    };

    if (startValue !== endValue) {
      animFrame.current = requestAnimationFrame(animate);
    } else {
      setDisplayCount(count);
    }

    return () => {
      if (animFrame.current) {
        cancelAnimationFrame(animFrame.current);
      }
    };
  }, [count]);

  const formattedNumber = new Intl.NumberFormat(
    language === 'ja' ? 'ja-JP' : language === 'vi' ? 'vi-VN' : 'en-US',
  ).format(displayCount);

  if (compact) {
    return (
      <div className="group relative inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-gradient-to-r from-[#0d141c]/95 via-[#162230]/95 to-[#0d141c]/95 border-2 border-amber-500/70 hover:border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:shadow-[0_0_40px_rgba(245,158,11,0.55)] backdrop-blur-xl transition-all duration-300 select-none cursor-default">
        {/* Live Status Radar Badge */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
          <div className="relative flex items-center justify-center w-2.5 h-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-90" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          </div>
          <span className="text-[10px] font-mono font-black text-emerald-300 tracking-wider">
            LIVE
          </span>
        </div>

        {/* Counter Text - Ultra Bold Esports Ticker */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-300 uppercase tracking-wider font-extrabold text-xs hidden lg:inline">
            {language === 'ja'
              ? '全軍確定済み:'
              : language === 'vi'
              ? 'TOÀN QUÂN ĐÃ CHỐT:'
              : 'SQUAD CONFIRMED:'}
          </span>
          <span className="font-mono font-black text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-400 drop-shadow-[0_0_16px_rgba(245,158,11,0.8)] tracking-tight">
            {formattedNumber}
          </span>
          <span className="font-black text-amber-300 text-xs uppercase tracking-wide">
            {language === 'ja' ? '食' : language === 'vi' ? 'bữa' : 'meals'}
          </span>
        </div>

        {/* Glowing Flame Emblem */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-yellow-200/50">
          <Flame size={15} className="text-slate-950 animate-bounce fill-slate-950" />
          <Sparkles size={11} className="text-amber-100 hidden sm:inline-block animate-pulse" />
        </div>

        {/* Top & Bottom Neon Laser Lines */}
        <div className="absolute -top-[2px] left-1/6 right-1/6 h-[2px] bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_12px_#fde047]" />
        <div className="absolute -bottom-[2px] left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_10px_#f59e0b]" />
      </div>
    );
  }

  return (
    <div className="w-full my-4 flex items-center justify-center">
      <div className="group relative inline-flex items-center gap-3.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0d141c] via-[#162230] to-[#0d141c] border-2 border-amber-500/70 hover:border-amber-300 shadow-[0_0_35px_rgba(245,158,11,0.4)] backdrop-blur-xl transition-all duration-300">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
          <div className="relative flex items-center justify-center w-3 h-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-90" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          </div>
          <span className="text-xs font-mono font-black text-emerald-300 tracking-wider">
            LIVE SYNC
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-xs select-none">
          <span className="font-mono text-slate-300 uppercase tracking-wider font-extrabold text-sm">
            {language === 'ja'
              ? '全チーム確定済み:'
              : language === 'vi'
              ? 'Toàn Phi Đội Đã Chốt:'
              : 'Total Squad Confirmed:'}
          </span>
          <span className="font-mono font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.9)]">
            {formattedNumber}
          </span>
          <span className="font-black text-amber-300 text-sm">
            {language === 'ja' ? '食' : language === 'vi' ? 'bữa trưa' : 'meals'}
          </span>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-[0_0_18px_rgba(245,158,11,0.6)] border border-yellow-200/50">
          <Flame size={16} className="text-slate-950 animate-bounce fill-slate-950" />
        </div>

        <div className="absolute -top-[2px] left-1/6 right-1/6 h-[2px] bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_12px_#fde047]" />
        <div className="absolute -bottom-[2px] left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_10px_#f59e0b]" />
      </div>
    </div>
  );
}

