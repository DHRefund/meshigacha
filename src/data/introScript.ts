import type { Language } from '@/lib/i18n';

export interface IntroDialogue {
  id: number;
  speaker: string;
  role: string;
  text: string;
}

// Intro dành cho Tân Binh Captain (Chưa đăng nhập / Guest)
export function getGuestIntroScript(language: Language = 'vi'): IntroDialogue[] {
  if (language === 'ja') {
    return [
      {
        id: 1,
        speaker: '助手犬キャプテン (NPC)',
        role: '新兵ナビゲーター',
        text: 'キャプテン、報告です！食いしん坊作戦の最高顧問・助手犬キャプテン参上いたしました！',
      },
      {
        id: 2,
        speaker: '助手犬キャプテン (NPC)',
        role: '新兵ナビゲーター',
        text: '補給ケースに絶品日本料理228品をぎゅうぎゅうに詰め込みました！財布と相談して予算を選ぶだけ！',
      },
      {
        id: 3,
        speaker: '助手犬キャプテン (NPC)',
        role: '新兵ナビゲーター',
        text: 'まずは無料ケース開封が5回お試し可能！ログインすれば「無限ケース開封」特権で食べ放題モード突入です！',
      },
      {
        id: 4,
        speaker: '助手犬キャプテン (NPC)',
        role: '新兵ナビゲーター',
        text: '至高の極上飯を引き当てて、エネルギー200%超充電！さあキャプテン、開封命令をドカンとどうぞ！',
      },
    ];
  }

  if (language === 'en') {
    return [
      {
        id: 1,
        speaker: 'Assistant Captain',
        role: 'SENIOR TACTICAL ADVISOR',
        text: 'Report Captain! I am First Class Assistant - your senior "hunger destroyer" tactical advisor!',
      },
      {
        id: 2,
        speaker: 'Assistant Captain',
        role: 'SENIOR TACTICAL ADVISOR',
        text: 'Supply Case loaded with 228 mouthwatering Japanese dishes! Just check your wallet and pick a budget!',
      },
      {
        id: 3,
        speaker: 'Assistant Captain',
        role: 'SENIOR TACTICAL ADVISOR',
        text: 'You have 5 free "luck check" spins! Log in to unlock UNLIMITED SPINS and feast endlessly with the squad!',
      },
      {
        id: 4,
        speaker: 'Assistant Captain',
        role: 'SENIOR TACTICAL ADVISOR',
        text: 'May you loot absolute top-tier food and recharge 200% energy! Captain, issue the order: OPEN CASE AND FEAST!',
      },
    ];
  }

  // Mặc định: Tiếng Việt
  return [
    {
      id: 1,
      speaker: 'Binh Nhất Trợ Lý',
      role: 'CỐ VẤN ĐÁNH CHÉN',
      text: 'Báo cáo Captain! Em là Binh Nhất Trợ Lý - hoa tiêu kiêm cố vấn diệt mồi cao cấp của ngài đây ạ!',
    },
    {
      id: 2,
      speaker: 'Binh Nhất Trợ Lý',
      role: 'CỐ VẤN ĐÁNH CHÉN',
      text: 'Hòm Tiếp Tế đã nạp sẵn 228 món ăn Nhật Bản ngon nhung nhúc! Captain chỉ việc ngắm ví rồi chọn ngân sách thôi!',
    },
    {
      id: 3,
      speaker: 'Binh Nhất Trợ Lý',
      role: 'CỐ VẤN ĐÁNH CHÉN',
      text: 'Captain có 5 lượt mở hòm "test nhân phẩm" miễn phí! Đăng nhập ngay để mở hòm KHÔNG GIỚI HẠN - ăn sập hòm cùng phi đội nhé!',
    },
    {
      id: 4,
      speaker: 'Binh Nhất Trợ Lý',
      role: 'CỐ VẤN ĐÁNH CHÉN',
      text: 'Chúc Captain quay trúng món đỉnh của chóp và nạp 200% năng lượng! Xin mời ngài hô lệnh: MỞ HÒM BẮT ĐẦU ĐÁNH CHÉN!',
    },
  ];
}

// Intro dành cho Captain Chính Thức (Đã đăng nhập)
export function getMemberIntroScript(name: string, language: Language = 'vi'): IntroDialogue[] {
  if (language === 'ja') {
    return [
      {
        id: 1,
        speaker: '助手犬キャプテン (NPC)',
        role: '直属作戦参謀',
        text: `キャプテン ${name}、報告です！超VIP大指揮官の識別シグナルを検知！全隊員、敬礼っ！`,
      },
      {
        id: 2,
        speaker: '助手犬キャプテン (NPC)',
        role: '直属作戦参謀',
        text: '本格日本料理228品が準備完了！「無制限ケース開封」特権はフルスピードで100%稼働中！',
      },
      {
        id: 3,
        speaker: '助手犬キャプテン (NPC)',
        role: '直属作戦参謀',
        text: 'キャプテンは予算を選ぶだけ！お腹ペコペコ退治ミッションは、この助手犬にお任せあれ！',
      },
      {
        id: 4,
        speaker: '助手犬キャプテン (NPC)',
        role: '直属作戦参謀',
        text: `キャプテン ${name}、本日も最高峰ゴールド品が大爆発しますように！全隊員、開封＆いただきます命令を待機中！`,
      },
    ];
  }

  if (language === 'en') {
    return [
      {
        id: 1,
        speaker: 'Assistant Captain',
        role: 'TACTICAL COMMAND ASSISTANT',
        text: `Report Captain ${name}! Ultra-VIP Commander signal identified! All units, salute!`,
      },
      {
        id: 2,
        speaker: 'Assistant Captain',
        role: 'TACTICAL COMMAND ASSISTANT',
        text: '228 authentic Japanese dishes ready on the plate. UNLIMITED CASE OPENING privileges are 100% unlocked!',
      },
      {
        id: 3,
        speaker: 'Assistant Captain',
        role: 'TACTICAL COMMAND ASSISTANT',
        text: 'Captain just set your budget, leave the battle against your rumbling belly to your loyal Assistant!',
      },
      {
        id: 4,
        speaker: 'Assistant Captain',
        role: 'TACTICAL COMMAND ASSISTANT',
        text: `May Captain ${name} score a legendary Golden Drop today! SQUAD AWAITING OPEN & FEAST COMMAND!`,
      },
    ];
  }

  // Mặc định: Tiếng Việt
  return [
    {
      id: 1,
      speaker: 'Binh Nhất Trợ Lý',
      role: 'TRỢ LÝ CHỈ HUY TRỰC CHIẾN',
      text: `Báo cáo Captain ${name}! Ra-da đã quét thấy Chỉ Huy VIP Đẳng Cấp! Toàn phi đội nghiêm chỉnh chào!`,
    },
    {
      id: 2,
      speaker: 'Binh Nhất Trợ Lý',
      role: 'TRỢ LÝ CHỈ HUY TRỰC CHIẾN',
      text: '228 món ăn Nhật chuẩn vị đã sẵn sàng lên đĩa. Mọi đặc quyền MỞ HÒM KHÔNG GIỚI HẠN đã mở khóa 100%!',
    },
    {
      id: 3,
      speaker: 'Binh Nhất Trợ Lý',
      role: 'TRỢ LÝ CHỈ HUY TRỰC CHIẾN',
      text: 'Captain chỉ cần chốt ngân sách, phần tiêu diệt cái bụng đói cồn cào cứ để em trợ chiến lo từ A tới Z ạ!',
    },
    {
      id: 4,
      speaker: 'Binh Nhất Trợ Lý',
      role: 'TRỢ LÝ CHỈ HUY TRỰC CHIẾN',
      text: `Chúc Captain ${name} hôm nay nổ hũ Hòm Vàng Cực Phẩm ngon ngất ngây! TOÀN ĐỘI CHỜ LỆNH MỞ HÒM ĐÁNH CHÉN!`,
    },
  ];
}

// Alias mặc định để giữ tính tương thích
export const GUEST_INTRO_SCRIPT = getGuestIntroScript('vi');
export const INTRO_SCRIPT = GUEST_INTRO_SCRIPT;



