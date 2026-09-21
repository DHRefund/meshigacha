# ĐẶC TẢ KỸ THUẬT VÀ QUY CÁCH DỰ ÁN (PROJECT SPECIFICATION)

**Dự án**: Trưa Nay Ăn Gì (`angiday_captain`)  
**Mục tiêu**: Ứng dụng Web tương tác mở hòm / quay thưởng (CS:GO Case Opening) giúp người dùng lựa chọn món ăn trưa hằng ngày.  
**Triết lý cốt lõi**: 100% Client-side, không backend, an toàn riêng tư, lưu trữ local cookie.

---

## 🏛️ 1. Kiến trúc Hệ thống & Công nghệ (Tech Stack)

### Core Stack
- **Framework**: React 19 (`19.2.8`) với Concurrent Features.
- **Language**: TypeScript (`7.0.2`) với chế độ Type Safety tuyệt đối.
- **Build Tool**: Vite (`8.2.2`) cho dev server siêu tốc và tối ưu sản phẩm đóng gói.
- **Styling**: Tailwind CSS v4 (`4.3.3`) phối hợp CSS Variables và Glassmorphism CS:GO Dark Theme.
- **UI Components**: `@base-ui/react` (Headless primitives) & `lucide-react` (Biểu tượng vector).
- **Audio Engine**: Web Audio API (`AudioContext`, `GainNode`, `AudioBuffer`) cho phản hồi âm thanh siêu nhạy.
- **Package Manager**: `pnpm` (`12.3.4`).

---

## ⚡ 2. Các Tính năng & Mô hình Nghiệp vụ Chính

### 🎰 2.1. Thuật toán Quay & Phân bổ Xác suất (`src/lib/case-mechanics.ts`)
1. **Phân phối Log-Normal**: Giá món ăn được ánh xạ logarit `log(price / targetBudget)`.
2. **Cân bằng Ngân sách (Expected Value Calibration)**: Sử dụng phương pháp Bisection Search tự động cân chỉnh độ nghiêng (tilt) sao cho **giá trị kỳ vọng** của lượt quay khớp chính xác với ngân sách người dùng chọn.
3. **5 Phân cấp Độ hiếm (Rarity Tiers)**:
   - **Mil-Spec (Xanh dương - Quốc Dân)**: Giá <= 40k.
   - **Restricted (Tím - Hiếm)**: Giá 41k - 65k.
   - **Classified (Hồng - Cực Phẩm)**: Giá 66k - 100k.
   - **Covert (Đỏ - Tối Mật)**: Giá 101k - 130k.
   - **Special Item (Vàng - ★ Đặc Biệt)**: Giá > 130k.
4. **Mô phỏng Chuyển động Cuộn CS:GO Panorama**:
   - `OPENING_DELAY_MS` = 2400ms.
   - `SPIN_DURATION_MS` = 6000ms.
   - Đường cong gia tốc Cubic Bezier mượt mà được tính toán trực tiếp qua Bisection.

### 🎵 2.2. Hệ thống Âm thanh Chuyên dụng (`src/lib/case-audio.ts`)
- Phát âm thanh mở hòm CS:GO chuẩn xác bằng **Web Audio API** thay vì tạo thẻ HTML5 Audio liên tục.
- Cơ chế `unlock()` tự động giải mã `AudioContext` ngay sau tương tác click đầu tiên (khắc phục giới hạn Autoplay trên iOS Safari & Chrome).
- Hỗ trợ Mute / Unmute linh hoạt qua công tắc âm lượng trên giao diện.

### 🍪 2.3. Lưu trữ Dữ liệu Cookie (`src/lib/cookies.ts`)
- Mọi dữ liệu cài đặt (ngân sách, tùy chọn ăn chay, món tự thêm) lưu trong trình duyệt với tiền tố `tnag-community-v1-`.
- Giới hạn an toàn dung lượng `< 3500 bytes` để chống lỗi trình duyệt từ chối ghi cookie.
- Tự động báo lỗi trên UI nếu lưu trữ bị chặn hoặc quá tải.

### 🌐 2.4. Đa Ngôn ngữ & Format Tiền tệ (`src/lib/i18n.ts`)
- Hỗ trợ Tiếng Việt (`vi`) và Tiếng Anh (`en`).
- Tự động format hiển thị tiền tệ theo chuẩn locale (VD: `50.000đ` đối với Việt Nam, `₫50,000` đối với Tiếng Anh).

### 🍲 2.5. Quản lý Món ăn & Tự định nghĩa (`src/lib/foods.ts` & `src/lib/personal-pool.ts`)
- Cơ sở dữ liệu mặc định hơn 130 món ăn Việt Nam truyền thống & hiện đại.
- Cho phép người dùng thêm tối đa 50 món cá nhân.
- Tự động làm sạch dữ liệu nhập (Sanitization chống XSS, kiểm tra độ dài tên <= 60 ký tự, khoảng giá 10k - 500k).

---

## 📂 3. Cấu trúc Dự án (Project Structure)

```text
angiday_captain/
├── public/                    # SFX audio (.mp3), favicon
├── src/
│   ├── app/
│   │   ├── globals.css        # Tailwind v4, animation, custom styling
│   │   └── page.tsx           # Main application view (Wheel UI, Modals)
│   ├── components/            # UI components (Preferences panel, Base UI)
│   ├── hooks/                 # React custom hooks
│   ├── lib/                   # Business logic core (Audio, Mechanics, Cookies, Foods, i18n)
│   └── main.tsx               # Entry point
├── tests/                     # Automated unit tests (Cookies, Mechanics, Personal pool)
├── Project spec.md            # Tài liệu đặc tả này
├── AI Rules.md                # Quy chuẩn mã nguồn & AI Best Practices
├── package.json               # Dependancies & Scripts
└── vite.config.ts             # Dev server (127.0.0.1) & Bundler setup
```

---

## 🛠️ 4. Định hướng Mở rộng & Best Practices

1. **Modular Code Design**: Giữ các module trong `src/lib/` hoàn toàn độc lập với UI. Logics toán học và âm thanh không phụ thuộc vào React state.
2. **Strict Type Safety**: Không dùng `any`, đảm bảo tất cả interfaces (`FoodItem`, `CaseRollResult`, `UserPreferences`) được định nghĩa rõ ràng.
3. **Performance First**: Sử dụng CSS Transitions & `requestAnimationFrame` kết hợp Web Audio API để đạt 60fps mượt mà khi cuộn hòm.
