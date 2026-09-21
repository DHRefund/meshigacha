/**
 * Tính toán vị trí offset pixel để dải quay dừng chính xác ở giữa card thắng giải
 * @param winnerIndex Chỉ số index của món ăn trúng thưởng trong dải quay
 * @param itemWidth Bề rộng của mỗi item card (px)
 * @param containerWidth Bề rộng của khung chứa container (px)
 */
export function calculateSpinOffset(
  winnerIndex: number,
  itemWidth: number = 140,
  containerWidth: number = 360,
): number {
  const centerPosition = containerWidth / 2 - itemWidth / 2;
  const targetOffset = winnerIndex * itemWidth - centerPosition;
  return -targetOffset;
}

/**
 * Cấu hình thời gian và Easing chuẩn phong cách CS2 Case Opening
 */
export const SPIN_ANIMATION_CONFIG = {
  duration: 4.5, // 4.5 giây cuộn mượt mà
  ease: "power4.out", // Gia tốc giảm dần kéo dài
};
