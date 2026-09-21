import type { Food, Rarity } from "../types/index.ts";

/**
 * Tỷ lệ Rarity chuẩn theo Model A (CS2 Case Opening style)
 * Common: 70%
 * Rare: 25%
 * Legendary: 5%
 */
export const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 70,
  rare: 25,
  legendary: 5,
};

/**
 * Chọn ngẫu nhiên Rarity theo trọng số 70/25/5
 * @param randomFn Hàm tạo số ngẫu nhiên [0, 1), phục vụ mock testing
 */
export function selectRandomRarity(
  randomFn: () => number = Math.random,
): Rarity {
  const randVal = randomFn() * 100;
  if (randVal < RARITY_WEIGHTS.legendary) {
    return "legendary"; // 0 -> 5
  }
  if (randVal < RARITY_WEIGHTS.legendary + RARITY_WEIGHTS.rare) {
    return "rare"; // 5 -> 30 (25%)
  }
  return "common"; // 30 -> 100 (70%)
}

/**
 * Chọn ngẫu nhiên món ăn từ danh sách phù hợp với Rarity đã random ra
 * @param foods Danh sách tất cả món ăn khả dụng
 * @param randomFn Hàm random
 */
export function selectRandomFood(
  foods: Food[],
  randomFn: () => number = Math.random,
): { food: Food; rarity: Rarity } {
  if (!foods || foods.length === 0) {
    throw new Error("Danh sách món ăn không được rỗng");
  }

  const selectedRarity = selectRandomRarity(randomFn);
  const matchingFoods = foods.filter((f) => f.rarity === selectedRarity);

  // Nếu bậc rarity không có món nào, fallback lấy trong toàn bộ danh sách
  const pool = matchingFoods.length > 0 ? matchingFoods : foods;
  const foodIndex = Math.floor(randomFn() * pool.length);
  const food = pool[foodIndex];

  return {
    food,
    rarity: food.rarity,
  };
}
