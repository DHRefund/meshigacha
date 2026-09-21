'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Award,
  LogOut,
  ArrowLeft,
  User as UserIcon,
  Sparkles,
  Utensils,
  Zap,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLocalSpinCount } from '@/hooks/use-local-spin-count';
import { readCookie } from '@/lib/cookies';
import { Header } from '@/components/header/Header';
import { AuthModal } from '@/components/auth/AuthModal';
import { foodName } from '@/lib/i18n';

interface LastChoice {
  name: string;
  price: number;
  veg: boolean;
  at?: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { count: localSpins } = useLocalSpinCount();
  const [lastChoice, setLastChoice] = useState<LastChoice | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [user?.photoURL]);

  useEffect(() => {
    try {
      const choice = readCookie<LastChoice>('last-choice');
      if (choice && choice.name) {
        setLastChoice(choice);
      }
    } catch {
      // Cookie read fail fallback
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const userName = user?.displayName || user?.email?.split('@')[0] || 'Captain';

  return (
    <div className="min-h-screen bg-[#0e161c] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Header */}
      <Header
        language="ja"
        sound={true}
        spinning={false}
        onChangeLanguage={() => {}}
        onToggleSound={() => {}}
        onOpenAuth={() => setShowAuthModal(true)}
      />
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} language="ja" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#1c2936] hover:bg-[#253748] border border-amber-500/30 text-amber-300 text-sm font-semibold transition-all shadow-md group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>ガチャ画面に戻る</span>
          </Link>
          <div className="text-xs uppercase tracking-widest text-slate-400 font-mono">
            セキュリティプロファイル // CAPTAIN HQ
          </div>
        </div>

        {/* Profile Card Main */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[#182531] to-[#121c25] border border-[#dfc681]/40 shadow-2xl p-6 sm:p-8">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            {/* Captain Avatar Frame */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-[#0f171e] border-2 border-amber-400/80 p-1 flex items-center justify-center overflow-hidden shadow-lg group-hover:border-amber-300 transition-all">
                {user?.photoURL && !imgError ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Captain Avatar'}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 rounded-xl flex items-center justify-center text-slate-950 font-black text-3xl sm:text-4xl shadow-md border border-amber-300/80">
                    {userName[0]?.toUpperCase() || 'C'}
                  </div>
                )}
              </div>
              {/* Badge Rank Icon Overlay */}
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-600 p-2 rounded-lg border border-black shadow-md text-black">
                <Award size={18} />
              </div>
            </div>

            {/* Profile Information */}
            <div className="flex-1 text-center md:text-left flex flex-col justify-center">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wide">
                  {user ? '正規司令官アカウント' : 'お試しゲスト'}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  {user ? '無制限でガチャ引き放題' : '無料お試し5回制限'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide mb-1">
                {user?.displayName || (user?.email ? user.email.split('@')[0] : '名無しキャプテン')}
              </h1>
              <p className="text-slate-400 text-sm mb-4 font-mono">
                {user?.email ? user.email : 'メールアドレス未連携'}
              </p>

              {/* Status Message from NPC */}
              <div className="p-3 rounded-lg bg-[#111922] border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2 max-w-xl">
                <span className="text-base">🎖️</span>
                <div>
                  <strong className="text-amber-400">キャプテン助手からの報告:</strong>{' '}
                  {user
                    ? 'キャプテンのプロファイルがHQシステムに認証されました！食事ケースの無制限開封権限が有効化されています。'
                    : '現在はゲスト見学モード（お試し5回）です。ログインすると履歴保存と無制限ガチャが解放されます！'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Statistics & History Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stat 1: Total Spins */}
          <div className="rounded-xl bg-[#14202b] border border-slate-700/80 p-5 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                ガチャ開封累計
              </span>
              <Zap className="text-amber-400" size={20} />
            </div>
            <div className="text-3xl font-black text-white font-mono">{localSpins}</div>
            <div className="text-xs text-slate-400 mt-2">
              {user ? '★ 特権メンバー' : `お試し残り ${Math.max(0, 5 - localSpins)}/5回`}
            </div>
          </div>

          {/* Stat 2: Squad Rank */}
          <div className="rounded-xl bg-[#14202b] border border-slate-700/80 p-5 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                階級
              </span>
              <Shield className="text-emerald-400" size={20} />
            </div>
            <div className="text-2xl font-extrabold text-amber-300">
              {localSpins > 20 ? 'グルメ大佐' : localSpins > 5 ? '実戦キャプテン' : '新兵中尉'}
            </div>
            <div className="text-xs text-slate-400 mt-2">POROCIA Studio チーム</div>
          </div>

          {/* Stat 3: Special Perks */}
          <div className="rounded-xl bg-[#14202b] border border-slate-700/80 p-5 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                ガチャ特典
              </span>
              <Sparkles className="text-yellow-400" size={20} />
            </div>
            <div className="text-lg font-bold text-emerald-400">
              {user ? 'UNLIMITED ACCESS' : '回数制限あり'}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              {user ? '空腹の心配はありません' : '全機能解放にはログインが必要'}
            </div>
          </div>
        </div>

        {/* Last Choice / Recent Victory */}
        {lastChoice && (
          <div className="rounded-xl bg-[#14202b] border border-amber-500/30 p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-bold uppercase tracking-wider">
              <Utensils size={18} />
              <span>直前に当選した料理</span>
            </div>
            <div className="flex items-center justify-between bg-[#0e161c] p-4 rounded-lg border border-slate-800">
              <div>
                <div className="text-lg font-extrabold text-white">
                  {foodName(
                    {
                      name: lastChoice.name,
                      sub: '',
                      price: lastChoice.price,
                      rarity: 0,
                      image: 0,
                      category: 'main',
                      quip: '',
                    },
                    'ja',
                  )}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2 mt-1 font-mono">
                  <span>
                    目安価格: 約{lastChoice.price > 200 ? lastChoice.price : lastChoice.price * 10}円
                  </span>
                  {lastChoice.veg && (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-400 text-[10px]">
                      精進料理
                    </span>
                  )}
                </div>
              </div>
              {lastChoice.at && !isNaN(new Date(lastChoice.at).getTime()) ? (
                <div className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                  <Clock size={12} />
                  <span>
                    {new Date(lastChoice.at).toLocaleTimeString('ja-JP', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#6b9545] hover:bg-[#7ba951] text-white font-bold text-sm tracking-wide uppercase shadow-lg border border-white/20 transition-all text-center"
          >
            ガチャを回す
          </Link>

          {user ? (
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 font-bold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              <span>ログアウト</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#dfc681] hover:bg-[#ebd79b] text-black font-bold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <UserIcon size={16} />
              <span>ログイン / 新規登録</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
