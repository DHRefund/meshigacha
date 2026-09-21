import { foods as mainFoods, type Food, type CategoryType } from "@/data/foods";
import { drinks } from "@/data/drinks";
import { snacks } from "@/data/snacks";
import { pub } from "@/data/pub";

export type { CategoryType, Food };

// Combine all category datasets into the master foods list
export const foods: Food[] = [
  ...mainFoods,
  ...drinks,
  ...snacks,
  ...pub,
];

export const SEED_FOODS: any = foods;
export const SEED_SHOPS: any = {};
