'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception for monitoring
    console.error('MeshiGacha Tactical System Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0c131a] text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-amber-500 selection:text-black font-sans">
      <div className="max-w-md w-full bg-gradient-to-b from-[#1c2732] to-[#141e27] border border-rose-500/40 rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col items-center text-center relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-48 h-48 bg-rose-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Warning Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 mb-5 shadow-lg shadow-rose-950/50">
          <AlertTriangle size={32} />
        </div>

        {/* Header Titles */}
        <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide mb-1">
          システムエラー発生
        </h1>
        <p className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-4">
          SYSTEM ERROR // RECOVERY REQUIRED
        </p>

        {/* Error Detail Message */}
        <div className="w-full bg-[#101720] border border-slate-800 rounded-xl p-3 text-xs text-slate-400 font-mono mb-6 text-left break-words">
          {error.message || '予期せぬシステムエラーが発生しました。'}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            onClick={() => reset()}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 border border-amber-300/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>再試行 (Retry)</span>
          </button>

          <Link
            href="/"
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#1b2734] hover:bg-[#243445] border border-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-center"
          >
            <Home size={16} />
            <span>ホームへ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
