import assert from 'node:assert';
import { test } from 'node:test';
import { getSpinHistory, saveSpinHistory, clearSpinHistory } from '../src/lib/storage';

// Mock localStorage in Node.js test environment
const memoryStore: Record<string, string> = {};
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (key: string) => memoryStore[key] || null,
  setItem: (key: string, value: string) => {
    memoryStore[key] = value;
  },
  removeItem: (key: string) => {
    delete memoryStore[key];
  },
  clear: () => {
    Object.keys(memoryStore).forEach((k) => delete memoryStore[k]);
  },
  length: 0,
  key: () => null,
};

test('getSpinHistory returns empty array initially', () => {
  clearSpinHistory();
  const history = getSpinHistory();
  assert.strictEqual(history.length, 0);
});

test('saveSpinHistory adds item to local storage history', () => {
  clearSpinHistory();
  saveSpinHistory({
    foodId: 'com-tam',
    shopId: 's1',
    timestamp: 12345678,
    rarity: 'common',
  });

  const history = getSpinHistory();
  assert.strictEqual(history.length, 1);
  assert.strictEqual(history[0].foodId, 'com-tam');
  assert.strictEqual(history[0].rarity, 'common');
});

test('saveSpinHistory caps history at 20 items maximum', () => {
  clearSpinHistory();
  for (let i = 0; i < 25; i++) {
    saveSpinHistory({
      foodId: `food-${i}`,
      shopId: `shop-${i}`,
      timestamp: Date.now() + i,
      rarity: 'common',
    });
  }

  const history = getSpinHistory();
  assert.strictEqual(history.length, 20);
});
