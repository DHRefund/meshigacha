export type Rarity = "common" | "rare" | "legendary";
export type EmotionType = "happy" | "serious" | "teasing" | "shocked";

export type GameState =
  | "INTRO"
  | "IDLE"
  | "SPINNING"
  | "REVEAL"
  | "LIMIT_REACHED";

export interface Food {
  id: string;
  name: string;
  image: string;
  rarity: Rarity;
  category?: string;
  priceEstimate?: number;
}

export interface Shop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  foodId: string;
  distanceKm?: number;
}

export type TriggerType =
  | "spin_start"
  | "spinning"
  | "reveal_common"
  | "reveal_rare"
  | "reveal_legendary";

export interface BarkLine {
  id: string;
  triggerType: TriggerType;
  text: string;
  textJa?: string;
  textEn?: string;
  emotion?: EmotionType;
}

export interface SpinHistoryItem {
  foodId: string;
  shopId: string;
  timestamp: number;
  rarity: Rarity;
}

export interface SpinResult {
  food: Food;
  shop: Shop;
  rarity: Rarity;
  bark: BarkLine;
}
