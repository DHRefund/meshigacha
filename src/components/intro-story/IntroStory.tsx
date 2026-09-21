'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  getGuestIntroScript,
  getMemberIntroScript,
} from '@/data/introScript';
import { ChevronsRight, FastForward, Radio, Settings, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useGame } from '@/context/GameContext';
import type { Language } from '@/lib/i18n';

interface IntroStoryProps {
  language?: Language;
  onComplete: () => void;
}

// CS2 Hangar Armory Background Scene
const CS2_ARMORY_BG = '/npc/cs2_military_armory_background.png';

export function IntroStory({ language = 'ja', onComplete }: IntroStoryProps) {
  const { user } = useAuth();
  const { finishIntro } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Dynamic script selection based on Auth State (Guest vs Official Member Captain) & Language
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Captain';
  const script = useMemo(() => {
    return user
      ? getMemberIntroScript(userName, language)
      : getGuestIntroScript(language);
  }, [user, userName, language]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopTypewriter = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTyping(false);
  }, []);

  const currentDialogue = script[currentIndex] || script[0];
  const textToType = currentDialogue?.text || '';

  // Typewriter Effect
  useEffect(() => {
    if (!textToType) return;

    setDisplayedText('');
    setIsTyping(true);

    if (timerRef.current) clearInterval(timerRef.current);

    let charIndex = 0;

    timerRef.current = setInterval(() => {
      if (charIndex < textToType.length) {
        setDisplayedText(textToType.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }, 25);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [textToType, currentIndex]);

  const handleFinish = useCallback(() => {
    stopTypewriter();
    finishIntro();
    onComplete();
  }, [stopTypewriter, finishIntro, onComplete]);

  const handleNext = useCallback(() => {
    if (isTyping && currentDialogue) {
      // 1. If currently typing, stop timer & immediately reveal the full sentence
      stopTypewriter();
      setDisplayedText(currentDialogue.text);
      return;
    }

    // 2. If sentence is already fully revealed, advance to the next line or finish
    if (currentIndex < script.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleFinish();
    }
  }, [isTyping, currentDialogue, currentIndex, script.length, stopTypewriter, handleFinish]);

  // Keyboard shortcut listener (Space or Enter to advance)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext]);

  if (!currentDialogue) return null;

  return (
    <div
      onClick={handleNext}
      className="fixed inset-0 z-50 bg-[#070c12] select-none cursor-pointer overflow-hidden animate-in fade-in duration-300 flex flex-col justify-between"
    >
      {/* 1. SEPARATE BACKGROUND LAYER (Full Screen CS2 Hangar Armory Background) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={CS2_ARMORY_BG}
          alt="CS2 Military Hangar Armory Background"
          className="w-full h-full object-cover object-center filter brightness-75 contrast-110"
        />
        {/* Dark Vignette & Dynamic Tactical Radar Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060a0f] via-black/45 to-[#060a0f]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      {/* 2. TOP HUD NAVIGATION CONTROLS (Options on left, Skip/Review on right) */}
      <div className="relative z-30 w-full p-4 sm:p-6 flex items-center justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black/70 border border-amber-500/40 text-xs font-mono font-semibold text-slate-300 hover:text-white hover:bg-black/90 transition-all backdrop-blur-md shadow-lg"
        >
          <Settings size={14} className="text-amber-400" />
          <span>Options</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFinish();
          }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-slate-900/85 border border-slate-700/80 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all backdrop-blur-md shadow-lg group"
        >
          <FastForward size={14} className="group-hover:translate-x-0.5 transition-transform text-amber-400" />
          <span>{language === 'ja' ? 'スキップ' : language === 'vi' ? 'Bỏ qua' : 'Skip'}</span>
        </button>
      </div>

      {/* 3. CENTERED BADASS TACTICAL CS2 DIALOGUE BOX CARD */}
      <div className="relative z-20 w-full max-w-4xl mx-auto my-auto px-4 flex flex-col items-center justify-center">
        <div className="w-full bg-gradient-to-b from-[#141f2d]/95 via-[#0e1724]/98 to-[#080f18]/98 border-2 border-[#dfc681] rounded-2xl p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl relative overflow-hidden flex flex-col justify-between">
          
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#dfc681_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.04] pointer-events-none" />

          {/* Heavy Metallic Gold Corner Tech Brackets */}
          <div className="absolute top-0 right-0 w-36 h-1.5 bg-[#dfc681] shadow-[0_0_12px_#dfc681]" />
          <div className="absolute bottom-0 left-0 w-28 h-1.5 bg-[#dfc681] shadow-[0_0_12px_#dfc681]" />
          <div className="absolute top-0 left-0 w-16 h-1.5 bg-[#dfc681]/60" />
          <div className="absolute bottom-0 right-0 w-16 h-1.5 bg-[#dfc681]/60" />

          {/* Tactical Header: Speaker Title & Role Badge (No THOẠI counter, No MOOD tag) */}
          <div className="flex items-center justify-between border-b border-slate-800/90 pb-3.5 mb-4 relative z-10">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h2 className="text-xl sm:text-2xl font-black text-[#dfc681] tracking-wider uppercase font-mono drop-shadow-[0_2px_10px_rgba(223,198,129,0.3)]">
                  {currentDialogue.speaker.toUpperCase()}
                </h2>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono font-bold text-amber-300 uppercase tracking-widest">
                <ShieldAlert size={13} className="text-amber-400" />
                <span>{currentDialogue.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400">
              <Radio size={13} className="text-emerald-400 animate-pulse" />
              <span className="tracking-widest font-bold uppercase text-slate-300">TAC-OPS // SECURE_COMMS</span>
            </div>
          </div>

          {/* Typewriter Text Content Box (Fixed min-height eliminates flex jump) */}
          <div className="min-h-[110px] sm:min-h-[135px] flex items-center py-2 relative z-10">
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-amber-50 leading-relaxed tracking-wide w-full font-sans">
              &ldquo;{displayedText}&rdquo;
              {isTyping && (
                <span className="inline-block w-3 h-6 ml-2 bg-[#dfc681] animate-pulse align-middle shadow-[0_0_10px_#dfc681]" />
              )}
            </p>
          </div>

          {/* Footer Action Prompt Bar (Glowing Double Arrows >>) */}
          <div className="flex items-center justify-between pt-3.5 border-t border-slate-800/80 mt-3 relative z-10">
            <span className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>
                {language === 'ja'
                  ? '司令官通信チャンネル稼働中'
                  : language === 'vi'
                  ? 'Kênh truyền tín hiệu Chỉ Huy đang hoạt động'
                  : 'Command communication channel active'}
              </span>
            </span>

            <div className="flex items-center gap-2 font-bold text-sm text-[#dfc681] uppercase tracking-wider animate-bounce px-4 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/40 shadow-[0_0_15px_rgba(223,198,129,0.2)]">
              <span>
                {language === 'ja'
                  ? 'クリックして次へ'
                  : language === 'vi'
                  ? 'BẤM ĐỂ TIẾP TỤC'
                  : 'CLICK TO CONTINUE'}
              </span>
              <ChevronsRight size={22} className="text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM CORNER HUD STATS */}
      <div className="relative z-30 px-6 pb-3 w-full flex items-center justify-between text-[11px] text-slate-400 font-mono pointer-events-none">
        <div>
          {user ? `CAPTAIN: ${userName.toUpperCase()}` : 'GUEST ROOKIE BRIEFING'}
        </div>
        <div>
          FPS: 144 | [{language === 'ja' ? 'Space / Enterキーで次へ' : language === 'vi' ? 'Nhấn Space / Enter để tiếp tục' : 'Press Space / Enter to continue'}]
        </div>
      </div>
    </div>
  );
}


