'use client';

import React from 'react';
import type { Language } from '@/lib/i18n';
import { copy } from '@/lib/i18n';

interface FooterProps {
  language: Language;
}

export function Footer({ language }: FooterProps) {
  const t = copy[language];
  const basePath = typeof window !== 'undefined' ? window.location.pathname.replace(/\/$/, '') : '';

  return (
    <footer className="w-full bg-gradient-to-b from-[#0e141b] to-[#090d12] border-t border-[#1e2d3d] py-6 px-4 sm:px-6 mt-16 text-slate-400 text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Studio Team Badge & App Branding */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs shadow-md backdrop-blur-sm">
            <span className="text-sm">🎬</span>
            <span className="tracking-wide uppercase">POROCIA Studio</span>
          </div>

          <div className="text-slate-300 text-center sm:text-left flex items-center gap-2">
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400">
              Meshi<span className="text-amber-400">Gacha</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 font-medium">
              {language === 'ja'
                ? '「今日何食べる？」迷ったら、回せ！'
                : language === 'vi'
                ? 'Gacha Ẩm Thực Nhật Bản Thượng Hạng'
                : 'Ultimate Japanese Food Case Opening'}
            </span>
          </div>
        </div>

        {/* Center: Legal Policy Links */}
        <div className="flex items-center gap-3 text-slate-400 font-medium">
          <a
            href={`${basePath}/privacy.html`}
            className="hover:text-amber-300 transition-colors underline-offset-4 hover:underline"
          >
            {language === 'ja' ? 'プライバシーポリシー' : language === 'vi' ? 'Quyền riêng tư' : 'Privacy Policy'}
          </a>
          <span className="text-slate-700">·</span>
          <a
            href={`${basePath}/terms.html`}
            className="hover:text-amber-300 transition-colors underline-offset-4 hover:underline"
          >
            {language === 'ja' ? '利用規約' : language === 'vi' ? 'Điều khoản sử dụng' : 'Terms of Service'}
          </a>
        </div>

        {/* Right: Clean Esports Copyright */}
        <div className="flex items-center gap-2 text-slate-500 text-center sm:text-right font-mono text-[11px]">
          <span>© 2026 MeshiGacha (メシガチャ) · All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
