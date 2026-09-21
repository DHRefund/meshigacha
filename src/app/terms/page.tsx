import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "利用規約 · 「今日何食べる？」キャプテンランチケース",
  description:
    "「今日何食べる？」キャプテンランチケースの利用規約およびサービス情報。",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#27323b] text-[#e3e5e7] p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-[#1d2932] border border-[#ffffff20] rounded-2xl p-6 md:p-10 shadow-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#739b4d] hover:underline mb-6"
        >
          <ArrowLeft size={16} /> トップページに戻る
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#739b4d]/20 border border-[#739b4d]/40 flex items-center justify-center text-[#739b4d]">
            <FileText size={24} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            利用規約 — 「今日何食べる？」
          </h1>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-[#c0c5c9]">
          <p>
            本アプリは、毎日の食事メニュー選びを楽しんで決定するためのサポートエンターテインメントアプリです。
          </p>

          <p>
            アプリ内に表示される価格帯は市場の平均的な参考価格です。ケース開封数は本ブラウザ上のローカル統計であり、リアルタイム合計とは異なる場合があります。
          </p>

          <p>
            本アプリには、<strong>いかなる形式の課金、ゲーム内アイテムの売買、賭博、または金銭的価値のある報酬機能は含まれておりません</strong>。
          </p>

          <p>
            効果音やデザインスタイルは CS:GO / SourceSounds のアセットを参考にしています。すべての著作権はそれぞれの所有者に帰属します（ATTRIBUTION.md を参照）。
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-[#ffffff15] text-xs text-[#82857c]">
          「今日何食べる？」 · キャプテンランチケース · Community Edition
        </div>
      </div>
    </main>
  );
}
