import React from 'react';
import Link from 'next/link';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0c131a] text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-amber-500 selection:text-black font-sans select-none">
      <div className="max-w-md w-full bg-gradient-to-b from-[#1c2732] to-[#141e27] border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col items-center text-center relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 left-0 -translate-y-12 -translate-x-12 w-48 h-48 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* 404 Radar Compass Badge */}
        <div className="w-20 h-20 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-5 shadow-lg shadow-black/50">
          <Compass size={40} className="animate-spin" style={{ animationDuration: '12s' }} />
        </div>

        {/* 404 Code & Titles */}
        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 tracking-widest font-mono mb-1">
          404
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide mb-1">
          ページが見つかりません
        </h1>
        <p className="text-xs font-mono text-amber-400/80 uppercase tracking-widest mb-6">
          TARGET UNKNOWN // 404 NOT FOUND
        </p>

        <p className="text-xs text-slate-400 mb-6 leading-relaxed max-w-sm">
          お探しのページは削除されたか、URLが変更された可能性があります。ガチャホーム画面に戻って美味しい料理を開封しましょう！
        </p>

        {/* Action Button */}
        <Link
          href="/"
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 border border-amber-300/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home size={16} />
          <span>ガチャホームに戻る</span>
        </Link>
      </div>
    </div>
  );
}
