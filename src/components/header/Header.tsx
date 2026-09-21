'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Volume2,
  VolumeX,
  MessageSquareQuote,
  User as UserIcon,
  LogOut,
  History,
  ChevronDown,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import type { Language } from '@/lib/i18n';
import { copy } from '@/lib/i18n';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  language: Language;
  sound: boolean;
  spinning: boolean;
  globalCount?: number;
  onChangeLanguage: (lang: Language) => void;
  onToggleSound: () => void;
  onShowIntro?: () => void;
  onOpenAuth?: () => void;
}

export function Header({
  language,
  sound,
  spinning,
  globalCount = 0,
  onChangeLanguage,
  onToggleSound,
  onShowIntro,
  onOpenAuth,
}: HeaderProps) {
  const { user, logout } = useAuth();
  const t = copy[language];

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImgError(false);
  }, [user?.photoURL]);

  // Close user dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const userName =
    user?.displayName || user?.email?.split('@')[0] || 'Captain';

  return (
    <header className="relative flex items-center justify-between w-full min-w-0">
      <a href="/" className="brand flex items-center gap-2 sm:gap-2.5 no-underline group z-10 shrink-0">
        <div className="flex items-center gap-2 sm:gap-2.5 select-none">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black text-lg sm:text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200 border border-amber-300/40">
            🍱
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 drop-shadow-sm">
              Meshi<span className="text-amber-400 font-black">Gacha</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold text-amber-400/80 tracking-widest uppercase mt-0.5 sm:mt-1">
              メシガチャ
            </span>
          </div>
        </div>
      </a>

      <div className="header-actions flex items-center gap-1.5 sm:gap-3 z-10 shrink-0">
        {/* Unified Sleek Action Toolbar */}
        <div className="flex items-center bg-[#18232c]/90 border border-[#2b3a48] rounded-xl p-0.5 sm:p-1 gap-0.5 sm:gap-1 shadow-md backdrop-blur-sm">
          {/* Sound Toggle (Icon-only compact) */}
          <button
            className="sound-button !px-1.5 sm:!px-2.5 !py-1 sm:!py-1.5 !border-0 !bg-transparent hover:!bg-[#263746] !text-slate-300 hover:!text-amber-300 rounded-lg transition-colors flex items-center justify-center"
            onClick={onToggleSound}
            aria-label={sound ? t.turnSoundOff : t.turnSoundOn}
            title={sound ? (language === 'ja' ? 'ミュートにする' : 'Mute sound') : (language === 'ja' ? 'サウンドを有効化' : 'Enable sound')}
          >
            {sound ? <Volume2 size={16} className="text-amber-400 shrink-0" /> : <VolumeX size={16} className="text-slate-500 shrink-0" />}
          </button>

          <span className="w-px h-3.5 sm:h-4 bg-slate-700/60" />

          {/* Meal History Navigation Link */}
          <Link
            href="/history"
            className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg hover:bg-[#263746] text-slate-200 hover:text-amber-300 text-xs font-semibold transition-colors"
            title={language === 'ja' ? '食事履歴を見る' : language === 'vi' ? 'Xem Lịch Sử Bữa Ăn Captain' : 'Meal History'}
          >
            <History size={15} className="text-amber-400 shrink-0" />
            <span className="hidden sm:inline">{language === 'ja' ? '履歴' : language === 'vi' ? 'Lịch Sử' : 'History'}</span>
          </Link>

          {/* NPC Intro Report Button */}
          {onShowIntro && (
            <>
              <span className="w-px h-3.5 sm:h-4 bg-slate-700/60" />
              <button
                className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg hover:bg-[#263746] text-slate-200 hover:text-amber-300 text-xs font-semibold transition-colors"
                onClick={onShowIntro}
                title={language === 'ja' ? 'キャプテン助手の報告を見る' : language === 'vi' ? 'Xem lời thoại NPC Binh Nhất' : 'Replay Intro Story'}
              >
                <MessageSquareQuote size={15} className="text-sky-400 shrink-0" />
                <span className="hidden sm:inline">{language === 'ja' ? '報告' : language === 'vi' ? 'Báo Cáo' : 'Intro'}</span>
              </button>
            </>
          )}
        </div>

        {/* Pro Gamer User Auth & Profile Dropdown Section */}
        {user ? (
          <div className="relative" ref={userMenuRef}>
            {/* Trigger Button */}
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-1.5 sm:gap-2.5 p-1 sm:p-1.5 sm:pr-3 rounded-xl bg-[#141d26]/90 border border-amber-500/50 hover:border-amber-400 text-slate-100 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] group select-none cursor-pointer"
            >
              {/* Avatar with Active Online Status Ring */}
              <div className="relative shrink-0">
                {user.photoURL && !imgError ? (
                  <img
                    src={user.photoURL}
                    alt="Avatar"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover border border-amber-400/80 shadow-sm"
                  />
                ) : (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black text-[11px] sm:text-xs border border-amber-300/80 shadow-sm">
                    {userName[0]?.toUpperCase() || 'C'}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 border-2 border-[#141d26]" />
              </div>

              {/* Username & VIP Status Tag (Hidden on small mobile screens to fit header perfectly) */}
              <div className="hidden sm:flex flex-col items-start leading-none min-w-0">
                <span className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors truncate max-w-[95px]">
                  {userName}
                </span>
                <span className="text-[9px] font-extrabold text-amber-400 uppercase tracking-wider mt-0.5 flex items-center gap-0.5">
                  <Sparkles size={8} className="text-amber-300" /> VIP
                </span>
              </div>

              <ChevronDown
                size={14}
                className={`text-slate-400 group-hover:text-amber-300 transition-transform duration-200 shrink-0 ${
                  userMenuOpen ? 'rotate-180 text-amber-400' : ''
                }`}
              />
            </button>

            {/* Glassmorphism Dropdown Menu Overlay */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#121921]/95 border border-[#2b3a4a] shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User Header Profile Info Card */}
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#1b2633] to-[#141d27] border border-[#283747] mb-2 flex items-center gap-3">
                  <div className="relative shrink-0">
                    {user.photoURL && !imgError ? (
                      <img
                        src={user.photoURL}
                        alt="Avatar"
                        referrerPolicy="no-referrer"
                        onError={() => setImgError(true)}
                        className="w-10 h-10 rounded-xl object-cover border-2 border-amber-400/80 shadow-md"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black text-lg border-2 border-amber-300/80 shadow-md">
                        {userName[0]?.toUpperCase() || 'C'}
                      </div>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#121921]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-white truncate">
                        {userName}
                      </span>
                      <ShieldCheck size={14} className="text-amber-400 shrink-0" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 truncate block mt-0.5">
                      {user.email || 'Captain Guest User'}
                    </span>
                    <span className="inline-block mt-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      ★ MESHI GACHA VIP
                    </span>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="space-y-1">
                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-amber-300 hover:bg-[#1f2d3d] border border-transparent hover:border-[#2d4054] transition-all"
                  >
                    <UserIcon size={15} className="text-amber-400" />
                    <span>
                      {language === 'ja'
                        ? 'マイプロフィール'
                        : language === 'vi'
                        ? 'Hồ sơ Captain'
                        : 'My Profile'}
                    </span>
                  </Link>

                  <Link
                    href="/history"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-amber-300 hover:bg-[#1f2d3d] border border-transparent hover:border-[#2d4054] transition-all"
                  >
                    <History size={15} className="text-amber-400" />
                    <span>
                      {language === 'ja'
                        ? '食事履歴'
                        : language === 'vi'
                        ? 'Lịch sử ăn uống'
                        : 'Meal History'}
                    </span>
                  </Link>
                </div>

                <div className="my-2 border-t border-[#233140]" />

                {/* Logout Action */}
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-100 hover:bg-rose-950/60 border border-transparent hover:border-rose-800/50 transition-all cursor-pointer"
                >
                  <LogOut size={15} className="text-rose-400" />
                  <span>
                    {language === 'ja'
                      ? 'ログアウト'
                      : language === 'vi'
                      ? 'Đăng xuất'
                      : 'Logout'}
                  </span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="relative group overflow-hidden px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:via-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_28px_rgba(245,158,11,0.5)] border border-amber-300/60 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <UserIcon size={15} className="text-slate-950" />
            <span>
              {language === 'ja'
                ? 'ログイン'
                : language === 'vi'
                ? 'Đăng Nhập'
                : 'Login'}
            </span>
          </button>
        )}
      </div>
    </header>
  );
}

