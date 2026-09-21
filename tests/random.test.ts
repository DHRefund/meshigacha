import assert from 'node:assert';
import { test } from 'node:test';
import { selectRandomRarity, selectRandomFood } from '../src/lib/random';
import type { Food } from '../src/types/index';

const mockFoods: Food[] = [
  { id: '1', name: 'Cơm Tấm', image: '/images/comtam.jpg', rarity: 'common' },
  { id: '2', name: 'Phở Bò', image: '/images/pho.jpg', rarity: 'common' },
  { id: '3', name: 'Bún Chả', image: '/images/buncha.jpg', rarity: 'rare' },
  { id: '4', name: 'Sườn Nướng BBQ', image: '/images/bbq.jpg', rarity: 'legendary' },
];

test('selectRandomRarity returns deterministic rarity based on mock random values', () => {
  // Test Legendary (rand < 0.05)
  assert.strictEqual(selectRandomRarity(() => 0.02), 'legendary');
  
  // Test Rare (0.05 <= rand < 0.30)
  assert.strictEqual(selectRandomRarity(() => 0.15), 'rare');
  
  // Test Common (rand >= 0.30)
  assert.strictEqual(selectRandomRarity(() => 0.50), 'common');
});

test('Statistical distribution over 10,000 iterations roughly matches 70/25/5', () => {
  const counts = { common: 0, rare: 0, legendary: 0 };
  const TOTAL_RUNS = 10000;

  for (let i = 0; i < TOTAL_RUNS; i++) {
    const r = selectRandomRarity();
    counts[r]++;
  }

  // Margin of error allowance ~3%
  assert.ok(counts.common > 6500 && counts.common < 7500, `Common count: ${counts.common}`);
  assert.ok(counts.rare > 2000 && counts.rare < 3000, `Rare count: ${counts.rare}`);
  assert.ok(counts.legendary > 300 && counts.legendary < 700, `Legendary count: ${counts.legendary}`);
});

test('selectRandomFood selects valid food item matching rarity', () => {
  // Force legendary
  const { food, rarity } = selectRandomFood(mockFoods, () => 0.01);
  assert.strictEqual(rarity, 'legendary');
  assert.strictEqual(food.id, '4');
});
