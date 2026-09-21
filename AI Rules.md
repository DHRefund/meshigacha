# AI Coding Rules — "Đi Ăn Thôi Captain"

> Đặt file này ở root repo. Dùng làm rules cho AI coding agent (Antigravity).
> Nếu repo có thêm `repo_example/AGENTS.md`, đọc cả 2 — file này là nguồn quyết định cuối cùng khi có mâu thuẫn.

---

## 1. Bối cảnh dự án

**Tên**: Đi Ăn Thôi Captain
**Mô tả**: App quay ngẫu nhiên món ăn (áp dụng cả ngày, không chỉ bữa trưa) cho nhân viên văn phòng, phong cách "mở case" CS2. Nhân vật "Captain" bình luận bằng text theo trigger. Kết quả gắn với quán ăn thật, bấm vào mở Google Maps.

**Stack cố định — KHÔNG tự ý đổi:**
- Next.js (deploy Vercel)
- GSAP cho toàn bộ animation
- Firebase / Firestore cho data cần đồng bộ
- Cookie/localStorage cho preferences cá nhân (không cần round-trip Firestore cho thứ không cần real-time)
- Google Places API cho vị trí quán + deep link Google Maps

**Scope V1 — CHỈ làm đúng phạm vi này:**
- Quay random có trọng số theo rarity (Common/Rare/Legendary)
- Animation case-opening bằng GSAP
- Text bark của Captain (dạng subtitle/dialogue box) — **KHÔNG làm voice/TTS**
- Card kết quả: món ăn + quán + khoảng cách + nút mở Maps
- Lưu lịch sử quay đơn giản

**KHÔNG làm ở V1** (AI tự đề xuất các mục này thì từ chối, ghi chú lại cho V2/V3):
- Voice/TTS cho Captain (kéo theo Web Audio API — chưa cần ở V1)
- AI chat tự do / tích hợp Claude API cá nhân hóa
- Bộ lọc giá/giờ mở cửa
- Leaderboard, tính năng nhóm, mời đồng nghiệp
- Giới hạn lượt quay/ngày

---

## 2. Repo tham khảo (`repo_example/`)

Thư mục `repo_example/` chứa 1 project khác (`truanayangi`) đã làm xong, scope đơn giản hơn nhưng code có chất lượng — có tách logic/UI tốt, có test, có thuật toán random đáng học.

**Nguyên tắc dùng repo tham khảo:**
1. Chỉ đọc để hiểu **ý tưởng & kiến trúc**, không copy nguyên code/asset vào source chính.
2. Không sửa, không xóa, không build/run `repo_example/` trong pipeline chính — chỉ đọc.
3. Khi giao task liên quan phần đã có trong repo mẫu, chỉ định rõ: *"Xem cách `repo_example/src/lib/xxx.ts` xử lý, áp dụng ý tưởng, viết lại theo stack GSAP + Firebase của mình."*
4. Nếu `repo_example/AGENTS.md` mâu thuẫn với file này → **file này (AI_RULES.md) luôn thắng.**

---

## 3. Cấu trúc thư mục chuẩn

```
/src
  /app                   → Next.js app router
  /components
    /spin-machine        → component quay case (GSAP)
    /captain              → nhân vật Captain + bark text
    /result-card          → card kết quả + link Maps
    /ui                   → UI primitives dùng chung
  /hooks                  → custom React hooks (VD: useSpinTimeline)
  /lib
    /firebase.ts           → config & init Firebase
    /random.ts              → thuật toán weighted random (pure function)
    /gsap-timelines.ts      → GSAP timeline tái sử dụng, easing/bisection cho vị trí dừng
    /storage.ts              → wrapper đọc/ghi cookie hoặc localStorage cho preferences
    /i18n.ts                  → dictionary UI + tên món (dù V1 chỉ tiếng Việt)
    /validate.ts               → validate input (nếu có tính năng user tự thêm món/quán)
  /data
    /foods.ts                  → seed data món ăn (nếu chưa cần Firestore ngay)
    /barkLines.ts                → text bark theo triggerType
  /types                          → Food, Shop, BarkLine, SpinHistory
/tests
  random.test.ts                   → test thuật toán random/rarity
  storage.test.ts                    → test đọc/ghi preferences
repo_example/                        → chỉ đọc, không sửa
```

AI phải hỏi lại nếu task yêu cầu tạo file ngoài cấu trúc này mà không có lý do rõ ràng.

---

## 4. Quy tắc code — Best Practice bắt buộc

### 4.1 Tách logic khỏi UI (bắt buộc, ưu tiên cao nhất)
- `random.ts`, `gsap-timelines.ts` phải là pure logic — **không import React, không đụng DOM trực tiếp**.
- Component chỉ gọi hàm từ `/lib`, không viết random logic hay tính toán easing lồng trong JSX/component.
- Lý do: đổi UI hoặc animation approach sau này không phải sửa logic random; test được độc lập không cần render component.

### 4.2 Thứ tự xử lý spin — KHÔNG được đảo ngược
1. Random kết quả (item + rarity) **trước tiên**, lưu vào state/biến.
2. Animation GSAP chỉ là "diễn" để khớp với kết quả đã biết — tính vị trí dừng ngược từ index item đã random ra (không random sau khi animation dừng).
3. Không có pity timer / cơ chế bù trừ tỷ lệ theo lịch sử quay — mỗi lần quay là random độc lập, giữ đúng chất CS2 nếu không có lý do nghiệp vụ để đổi.

### 4.3 Rarity — chọn 1 trong 2 mô hình, không trộn lẫn
- **Mô hình A (đơn giản, khớp CS2 gốc)**: tỷ lệ % cố định theo bậc (VD Common 80% / Rare 16% / Legendary 4%), random trong bậc trước rồi chọn item trong bậc.
- **Mô hình B (nâng cao, học từ repo_example)**: đặt "ngân sách kỳ vọng" (expected value) mục tiêu, ánh xạ giá trị món ăn (hoặc độ hiếm) vào thang log, dùng phân phối Gauss + Bisection Search để tự động cân bằng tỷ lệ sao cho giá trị trung bình các lượt quay khớp mục tiêu — công bằng hơn, tránh cảm giác "server thiên vị món rẻ".
- **Khuyến nghị**: V1 dùng Mô hình A cho đơn giản, dễ debug. Ghi chú rõ trong code nếu để dành nâng cấp lên Mô hình B ở V2.
- AI không được tự ý trộn 2 mô hình hoặc đổi mô hình giữa chừng task mà không hỏi.

### 4.4 Animation GSAP
- Tách timeline ra khỏi component (`/lib/gsap-timelines.ts` hoặc custom hook `useSpinTimeline`).
- Dùng easing dạng ease-out mạnh, kéo dài (VD `power4.out` hoặc cubic-bezier tùy chỉnh) — mô phỏng nhịp giảm tốc của case CS2, không dùng easing tuyến tính.
- Vị trí dừng của thanh quay phải tính toán từ index item đã random, không hard-code animation cố định rồi map ngược ra kết quả.
- Hiệu ứng dừng (rung/flash/particle) map theo rarity — rarity càng cao hiệu ứng càng mạnh.

### 4.5 Data & Firestore
- Không query random trực tiếp trên Firestore — load list Food (toàn bộ hoặc theo category) về client/Cloud Function, random ở tầng ứng dụng.
- Firestore chỉ dùng cho data cần đồng bộ nhiều thiết bị/nhiều người (Food, Shop, SpinHistory nếu cần lưu lâu dài).
- Preferences cá nhân (ngân sách, món chay, tuỳ chỉnh nhỏ) ưu tiên lưu cookie/localStorage qua `/lib/storage.ts`, tránh gọi Firestore cho thứ không cần real-time.
- Nếu dùng cookie: luôn prefix key riêng cho dự án, set expiry rõ ràng, kiểm tra giới hạn dung lượng (~4KB) trước khi ghi.

### 4.6 Validate input
- Bất kỳ tính năng nào cho phép user tự nhập (thêm món, thêm quán, tên hiển thị...) đều phải qua `/lib/validate.ts`: giới hạn độ dài, giới hạn khoảng giá trị hợp lý, chống XSS cơ bản (không render raw HTML từ input user).
- Áp dụng validate cả ở client và Firestore Rules (không tin tưởng client-side validate là đủ).

### 4.7 i18n — cấu trúc sẵn dù V1 chỉ 1 ngôn ngữ
- Text UI và tên món/bark lines đặt trong dictionary (`/lib/i18n.ts`), không hard-code chuỗi tiếng Việt rải rác trong component.
- Lý do: công ty có yếu tố Nhật (đối tượng dùng có thể mở rộng), tách sẵn từ đầu đỡ phải refactor toàn bộ sau.

### 4.8 Text bark (Captain)
- Có ít nhất 2-3 biến thể câu / mỗi `triggerType`, tránh lặp câu vừa hiện ở lượt liền trước nếu có thể.
- Hiển thị dạng subtitle/dialogue box cạnh nhân vật Captain — chưa cần lipsync/voice ở V1.
- Cấu trúc data bark tách riêng khỏi component hiển thị, dễ mở rộng khi lên V2 (thêm voice) mà không phải sửa logic chọn câu.

### 4.9 Testing tối thiểu nhưng đúng chỗ
Không cần test toàn bộ UI. Bắt buộc có test cho các phần dễ lỗi âm thầm:
- `random.ts` — đảm bảo tỷ lệ rarity đúng như thiết kế qua nhiều lần chạy giả lập (statistical test)
- `storage.ts` — đảm bảo đọc/ghi/giới hạn dung lượng cookie hoạt động đúng
- `validate.ts` — nếu có tính năng user input

### 4.10 Môi trường dev
- Dev server bind `127.0.0.1` (không dùng `0.0.0.0`) để tránh máy khác trong mạng LAN công ty truy cập khi đang code.
- Không đưa API key, config nhạy cảm vào repo — dùng `.env.local`, thêm vào `.gitignore`.

### 4.11 Giới hạn chung khi AI code
- Không tự thêm dependency mới nếu chưa cần thiết cho task hiện tại — hỏi trước khi cài package lạ.
- Không tự đổi convention/tên biến đã có trong codebase khi làm task khác, trừ khi task yêu cầu refactor.
- Không tự ý mở rộng sang tính năng V2/V3 khi đang làm task V1.

---

## 5. Cách giao task cho AI (prompt convention)

```
Context: [phần nào của app đang làm]
Scope: [chỉ làm đúng phần này, không mở rộng]
Reference: [có tham khảo repo_example/... hay không, chỉ rõ file]
Constraint: [stack bắt buộc, mô hình rarity đang dùng]
Output: [component/file cụ thể cần tạo/sửa]
```

Ví dụ:
> Context: thuật toán random món ăn theo rarity.
> Scope: chỉ viết `/src/lib/random.ts`, dùng Mô hình A (tỷ lệ % cố định theo bậc), chưa cần Mô hình B.
> Reference: xem `repo_example/src/lib/case-mechanics.ts` để hiểu cách họ tách hàm `createFoodSelector`, nhưng viết lại theo cấu trúc rarity 3 bậc của mình, không copy nguyên logic ngân sách log-price.
> Constraint: pure function, không import React, phải test được độc lập.
> Output: `/src/lib/random.ts` + `/tests/random.test.ts`

---

## 6. Checklist trước khi merge/chấp nhận code AI viết

- [ ] Đúng scope V1, không lẫn tính năng V2/V3
- [ ] Không copy nguyên code từ `repo_example/`
- [ ] Random chạy trước, animation chỉ hiển thị lại kết quả đã biết
- [ ] Không có pity timer ẩn (trừ khi được yêu cầu rõ)
- [ ] Không query random trực tiếp Firestore
- [ ] Preferences cá nhân dùng cookie/localStorage, không lạm dụng Firestore
- [ ] Logic (`/lib`) tách biệt hoàn toàn khỏi component UI
- [ ] Đúng cấu trúc thư mục đã định
- [ ] Không thêm dependency ngoài dự kiến mà không hỏi
- [ ] Text bark có ít nhất 2-3 biến thể/trigger
- [ ] Input từ user (nếu có) đã qua validate
- [ ] Có test cho `random.ts` và `storage.ts` nếu đã tạo/sửa 2 file này

---

## 7. Ghi chú riêng

- Nhân vật dẫn dắt: "Captain" — xưng hô kiểu giao nhiệm vụ vui vẻ, không nghiêm túc quá.
- App dùng cả ngày (sáng/trưa/tối), khi viết bark text hoặc logic hiển thị, cân nhắc buổi trong ngày nếu có yêu cầu sau này.
- Nếu sau này nâng lên Mô hình B (expected-value budget) hoặc thêm voice/TTS, tham khảo lại `repo_example` cho phần Web Audio API (`case-audio.ts`) — họ dùng `AudioContext`/`AudioBuffer` đúng chuẩn, có `unlock()` cho autoplay restriction trên iOS.