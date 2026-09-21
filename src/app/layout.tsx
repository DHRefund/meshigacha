import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0c131a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://truanayangi.com"),
  title: "MeshiGacha (メシガチャ) | 「今日何食べる？」迷ったら、回せ！",
  description:
    "CS2スタイルのケース開封演出で本日の絶品料理をランダム決定！「今日何食べる？」迷ったら、回せ！助手犬キャプテンがご案内します。",
  keywords: ["MeshiGacha", "メシガチャ", "今日何食べる", "ランチガチャ", "グルメ", "CS2ガチャ"],
  authors: [{ name: "MeshiGacha Team" }],
  openGraph: {
    title: "MeshiGacha (メシガチャ) | 「今日何食べる？」迷ったら、回せ！",
    description:
      "CS2スタイルのケース開封演出で本日の絶品料理をランダム決定！「今日何食べる？」迷ったら、回せ！",
    url: "https://truanayangi.com",
    siteName: "MeshiGacha",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "MeshiGacha Preview",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MeshiGacha (メシガチャ) | 「今日何食べる？」迷ったら、回せ！",
    description: "CS2スタイルのケース開封演出で本日の絶品料理をランダム決定！",
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MeshiGacha (メシガチャ)",
  url: "https://truanayangi.com",
  description:
    "CS2スタイルのケース開封演出で本日の絶品料理をランダム決定！「今日何食べる？」迷ったら、回せ！",
  applicationCategory: "EntertainmentApplication",
  operatingSystem: "All",
  inLanguage: ["ja", "vi", "en"],
  author: {
    "@type": "Organization",
    name: "MeshiGacha",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
