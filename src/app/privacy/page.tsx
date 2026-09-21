import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "プライバシーポリシー · 「今日何食べる？」キャプテンランチケース",
  description:
    "「今日何食べる？」キャプテンランチケースのプライバシーポリシーおよびローカルデータ保存について。",
};

export default function PrivacyPage() {
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
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            プライバシーポリシー
          </h1>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-[#c0c5c9]">
          <p>
            本アプリ<strong>「今日何食べる？」キャプテンランチケース</strong>は、ブラウザ上（Client-Side）で動作するアプリケーションであり、追跡ツールや不要な個人情報の自動収集は行っておりません。
          </p>

          <p>
            選択した料理、カスタム設定、フィルター、およびローカルの開封回数は、お使いの端末の<strong>Cookie / LocalStorage</strong>に直接保存されます。クッキーを削除するとデータはリセットされます。
          </p>

          <p>
            <strong>Google Maps</strong>、<strong>出前サービス</strong>、<strong>GitHub</strong>などの外部リンクは、お客様が直接クリックした場合にのみ開き、各サービスのプライバシーポリシーが適用されます。
          </p>

          <p>
            ご自身で追加するカスタム料理名に機密情報や個人情報を入力しないようご注意ください。
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-[#ffffff15] text-xs text-[#82857c]">
          「今日何食べる？」 · キャプテンランチケース · 100% Privacy Preserved
        </div>
      </div>
    </main>
  );
}
