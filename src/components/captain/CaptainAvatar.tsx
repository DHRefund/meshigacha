'use client';

import React from 'react';
import type { BarkLine } from '@/types';
import type { Language } from '@/lib/i18n';
import { getBarkText } from '@/data/barkLines';

interface CaptainAvatarProps {
  bark: BarkLine;
  language?: Language;
}

const CAPTAIN_AVATAR_IMAGE = '/npc/npc_happy.webp';

export function CaptainAvatar({ bark, language = 'vi' }: CaptainAvatarProps) {
  const currentEmotion = bark.emotion || 'happy';
  const avatarSrc = CAPTAIN_AVATAR_IMAGE;
  const dialogueText = getBarkText(bark, language);

  return (
    <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-5 md:p-6 rounded-2xl bg-gradient-to-b from-[#162432]/95 to-[#0c1620]/98 border-2 border-[#dfc681]/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] w-full max-w-3xl sm:max-w-4xl mx-auto my-6 min-h-[116px] sm:min-h-[124px] relative overflow-hidden">
      {/* Decorative Gold Corner Tech Brackets */}
      <div className="absolute top-0 right-0 w-28 h-1 bg-[#dfc681]" />
      <div className="absolute bottom-0 left-0 w-20 h-1 bg-[#dfc681]" />

      {/* Dynamic NPC Assistant Avatar Image */}
      <div className="relative flex-shrink-0">
        <div className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-[#dfc681] p-1 shadow-xl shadow-amber-950/50 overflow-hidden">
          <img
            key={avatarSrc}
            src={avatarSrc}
            alt={`NPC Binh Nhất - ${currentEmotion}`}
            className="w-full h-full object-cover rounded-full transition-transform duration-300 transform hover:scale-105 animate-in fade-in duration-200"
          />
        </div>
        <span className="absolute -bottom-1 -right-1 bg-[#dfc681] text-[10px] font-black text-slate-950 px-2 py-0.5 rounded-full uppercase border border-slate-950 shadow-md">
          NPC
        </span>
      </div>

      {/* Dialogue Live Comment Box */}
      <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[64px] sm:min-h-[72px]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs sm:text-sm md:text-base font-black text-[#dfc681] tracking-wider uppercase flex items-center gap-2 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            {language === 'ja'
              ? '助手犬キャプテン (NPC)'
              : language === 'en'
                ? 'First Class Assistant'
                : 'Binh Nhất Trợ Lý'}
          </span>
        </div>

        <div className="min-h-[48px] sm:min-h-[56px] flex items-center">
          <p
            key={dialogueText}
            className="text-sm sm:text-base md:text-lg font-bold text-slate-100 leading-snug font-sans animate-in fade-in duration-200"
          >
            &ldquo;{dialogueText}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

