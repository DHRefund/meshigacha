import type { SpinHistoryItem } from "../types/index.ts";

const STORAGE_KEY_HISTORY = "dianthoi_captain_history_v1";

/**
 * Đọc lịch sử quay từ LocalStorage / Cookie
 */
export function getSpinHistory(): SpinHistoryItem[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("Lỗi khi đọc lịch sử quay:", err);
    return [];
  }
}

/**
 * Lưu 1 lượt quay mới vào lịch sử (giới hạn tối đa 20 lượt gần nhất)
 */
export function saveSpinHistory(item: SpinHistoryItem): void {
  if (typeof localStorage === "undefined") return;
  try {
    const current = getSpinHistory();
    const updated = [item, ...current].slice(0, 20); // Giữ tối đa 20 items
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  } catch (err) {
    console.error("Lỗi khi ghi lịch sử quay:", err);
  }
}

/**
 * Xóa sạch lịch sử quay
 */
export function clearSpinHistory(): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  } catch (err) {
    console.error("Lỗi khi xóa lịch sử quay:", err);
  }
}
