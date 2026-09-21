import { BarkLine } from "../types";
import type { Language } from "../lib/i18n";

export const BARK_LINES: BarkLine[] = [
  // spin_start
  {
    id: "b1",
    triggerType: "spin_start",
    emotion: "happy",
    text: "Báo cáo Captain! Đã nhận lệnh từ thuyền trưởng, kích hoạt máy quét hòm tiếp tế!",
    textJa: "キャプテン、了解です！補給ケースのスキャンを立ち上げます！",
    textEn: "Report Captain! Received command, launching the case scanner!",
  },
  {
    id: "b2",
    triggerType: "spin_start",
    emotion: "happy",
    text: "Mời Captain chọn mức ngân sách! Tôi đã chuẩn bị sẵn 228 món ăn hảo hạng rồi ạ!",
    textJa: "予算を設定してください！絶品料理228品を用意完了しております！",
    textEn: "Please select your budget! 228 delicacies are ready in the pool!",
  },
  {
    id: "b3",
    triggerType: "spin_start",
    emotion: "serious",
    text: "Báo cáo Captain! Hệ thống ra-da đã khoanh vùng tất cả quán ngon xung quanh!",
    textJa: "キャプテン！レーダーシステムが周辺の美味しいお店をロックオンしました！",
    textEn: "Report Captain! Radar has locked onto all nearby top food spots!",
  },

  // spinning
  {
    id: "b4",
    triggerType: "spinning",
    emotion: "serious",
    text: "Báo cáo Captain! Ra-da đang quét liên tục các quán trong bán kính 2km...",
    textJa: "キャプテン！半径2km以内の店舗を絶賛スキャン中…",
    textEn: "Report Captain! Scanning restaurants within 2km radius...",
  },
  {
    id: "b5",
    triggerType: "spinning",
    emotion: "serious",
    text: "Tốc độ cuộn hòm đang đạt đỉnh... Mời Captain hồi hộp chờ đón kết quả!",
    textJa: "ケースの回転速度が最高潮に達しています… 結果をお楽しみに！",
    textEn: "Reel scroll speed is reaching peak... Get ready for the drop!",
  },
  {
    id: "b6",
    triggerType: "spinning",
    emotion: "serious",
    text: "Gia tốc cuộn đang giảm dần... Điểm dừng kỳ diệu sắp xuất hiện thưa Captain!",
    textJa: "減速中… 運命のドロップポイントが近づいています、キャプテン！",
    textEn: "Decelerating... The winning item spot is appearing, Captain!",
  },

  // reveal_common
  {
    id: "b7",
    triggerType: "reveal_common",
    emotion: "happy",
    text: "Báo cáo Captain! Đã trúng món quốc dân chuẩn gu văn phòng! Ngon, bổ, tiếp sức chạy deadline!",
    textJa: "キャプテン！定番人気ランチがドロップしました！美味しくてスタミナバッチリです！",
    textEn: "Report Captain! Dropped a classic workplace lunch item! Delicious & energetic!",
  },
  {
    id: "b8",
    triggerType: "reveal_common",
    emotion: "happy",
    text: "Báo cáo Captain! Sự lựa chọn cực kỳ an toàn và ngon miệng cho bữa trưa hôm nay ạ!",
    textJa: "本日のランチに超おすすめの鉄板メニューです！間違いなしの逸品！",
    textEn: "Report Captain! An exceptionally safe and mouthwatering choice for lunch!",
  },
  {
    id: "b9",
    triggerType: "reveal_common",
    emotion: "happy",
    text: "Món này vừa nhanh vừa chất lượng! Mời Captain lên đồ ra trận thưởng thức bữa trưa!",
    textJa: "手軽でハイクオリティ！キャプテン、さっそくランチに出発しましょう！",
    textEn: "Fast and high quality! Captain, let's gear up for lunch!",
  },

  // reveal_rare
  {
    id: "b10",
    triggerType: "reveal_rare",
    emotion: "shocked",
    text: "Báo cáo Captain! ★ HÀNG HIẾM XUẤT HIỆN ★ Món tím siêu xịn xò cho bữa trưa hôm nay ạ!",
    textJa: "★ レアアイテム獲得 ★ 高級パープルランクの特製ランチがドロップしました！",
    textEn: "Report Captain! ★ RARE ITEM DROP ★ Premium Classified lunch unlocked!",
  },
  {
    id: "b11",
    triggerType: "reveal_rare",
    emotion: "happy",
    text: "Tuyệt vời quá Captain ơi! Vận may mỉm cười rồi, thưởng lớn cho bản thân thôi ạ!",
    textJa: "素晴らしいです、キャプテン！幸運が舞い降りました、自分へのご褒美ですね！",
    textEn: "Awesome Captain! Fortune smiles upon us, time to treat yourself!",
  },
  {
    id: "b12",
    triggerType: "reveal_rare",
    emotion: "shocked",
    text: "Tím lịm tìm sim! Bữa trưa thượng hạng đã được ra-da chọn riêng cho Captain!",
    textJa: "激レアパープル！極上ランチがキャプテンのために厳選されました！",
    textEn: "Classified Purple! Top-tier lunch selected exclusively for Captain!",
  },

  // reveal_legendary
  {
    id: "b13",
    triggerType: "reveal_legendary",
    emotion: "shocked",
    text: "★ NỔ HŨ VÀNG ★ Báo cáo Captain! Cực phẩm Hòm Vàng xuất hiện! Nhân phẩm ngút trời luôn ạ!",
    textJa: "★ 大当りゴールド ★ キャプテン、超激レア・ゴールド品がドロップ！神引きです！",
    textEn: "★ GOLDEN DROP ★ Report Captain! Legendary Gold Item appeared! Incredible luck!",
  },
  {
    id: "b14",
    triggerType: "reveal_legendary",
    emotion: "shocked",
    text: "★ LEGENDARY CỰC PHẨM ★ Thuyền trưởng uy lực nổ hũ rực rỡ! Cả phi đội nể Captain luôn!",
    textJa: "★ レジェンダリー ★ 最高峰ゴールド品を引き当てました！全隊員が憧れています！",
    textEn: "★ LEGENDARY DROP ★ Majestic golden pull! The whole squad is amazed!",
  },
  {
    id: "b15",
    triggerType: "reveal_legendary",
    emotion: "shocked",
    text: "★ VÀNG CHÍCH MẮT ★ Bữa trưa hoàng gia đặc biệt nhất dành riêng cho Captain hùng mạnh!",
    textJa: "★ 黄金の最高級品 ★ キャプテン専用のロイヤルプレミアムランチです！",
    textEn: "★ SHINING GOLD ★ Imperial special lunch crafted for the mighty Captain!",
  },
];

export const DEFAULT_BARK: BarkLine = BARK_LINES[0];

export function getBarkText(bark: BarkLine, language: Language): string {
  if (language === "ja" && bark.textJa) return bark.textJa;
  if (language === "en" && bark.textEn) return bark.textEn;
  return bark.text;
}

let lastBarkId = "";
export function getRandomBark(trigger: BarkLine["triggerType"]): BarkLine {
  const options = BARK_LINES.filter((b) => b.triggerType === trigger);
  if (options.length === 0) {
    return {
      id: "fallback",
      triggerType: trigger,
      emotion: "happy",
      text: "Báo cáo Captain! Hệ thống đã sẵn sàng ra lệnh!",
      textJa: "キャプテン、システム準備完了です！指示をお願いします！",
      textEn: "Report Captain! System ready for orders!",
    };
  }
  const filtered = options.filter((b) => b.id !== lastBarkId);
  const pool = filtered.length > 0 ? filtered : options;
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  lastBarkId = chosen.id;
  return chosen;
}

