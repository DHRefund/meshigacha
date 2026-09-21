import { readCookie, writeCookie } from './cookies';
import type { Food } from './foods';
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  limit,
} from 'firebase/firestore';

export interface HistoryEntry {
  id: string;
  name: string;
  sub: string;
  price: number;
  rarity: number;
  category?: string;
  imageUrl?: string;
  image?: number;
  quip?: string;
  confirmedAt: number;
  userId?: string;
  userName?: string;
}

const HISTORY_KEY = 'meal-history';
const MAX_HISTORY = 50;

/** Local Cookie Storage */
export function getMealHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = readCookie<HistoryEntry[]>(HISTORY_KEY);
    if (Array.isArray(data)) {
      return data;
    }
  } catch {}
  return [];
}

export function addMealToHistory(food: Food): HistoryEntry[] {
  const current = getMealHistory();
  const newEntry: HistoryEntry = {
    id: `meal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: food.name,
    sub: food.sub,
    price: food.price,
    rarity: food.rarity,
    category: food.category,
    imageUrl: food.imageUrl,
    image: food.image,
    quip: food.quip,
    confirmedAt: Date.now(),
  };

  const updated = [newEntry, ...current].slice(0, MAX_HISTORY);
  try {
    writeCookie(HISTORY_KEY, updated);
  } catch {
    try {
      writeCookie(HISTORY_KEY, updated.slice(0, 15));
    } catch {}
  }
  return updated;
}

export function clearMealHistory(): void {
  try {
    writeCookie(HISTORY_KEY, []);
  } catch {}
}

export function removeMealFromHistory(id: string): HistoryEntry[] {
  const current = getMealHistory();
  const updated = current.filter((item) => item.id !== id);
  try {
    writeCookie(HISTORY_KEY, updated);
  } catch {}
  return updated;
}

/** Firebase Firestore Operations */

export async function saveMealToFirebase(
  food: Food,
  userId?: string,
  userName?: string,
): Promise<string | null> {
  // Always save to local cookie history as well
  addMealToHistory(food);

  try {
    const docRef = await addDoc(collection(db, 'confirmed_meals'), {
      userId: userId || 'guest',
      userName: userName || 'Captain Guest',
      name: food.name,
      sub: food.sub || '',
      price: food.price,
      rarity: food.rarity,
      category: food.category || 'main',
      imageUrl: food.imageUrl || '',
      image: food.image ?? 0,
      quip: food.quip || '',
      confirmedAt: Date.now(),
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    console.warn('Firebase Firestore write warning:', err);
    return null;
  }
}

export async function fetchMealHistoryFromFirebase(
  userId?: string,
): Promise<HistoryEntry[]> {
  try {
    const mealsRef = collection(db, 'confirmed_meals');
    let q;
    if (userId) {
      q = query(
        mealsRef,
        where('userId', '==', userId),
        orderBy('confirmedAt', 'desc'),
        limit(MAX_HISTORY),
      );
    } else {
      q = query(mealsRef, orderBy('confirmedAt', 'desc'), limit(MAX_HISTORY));
    }

    const snapshot = await getDocs(q);
    const list: HistoryEntry[] = [];
    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      list.push({
        id: docSnap.id,
        name: d.name,
        sub: d.sub,
        price: d.price,
        rarity: d.rarity,
        category: d.category,
        imageUrl: d.imageUrl,
        image: d.image,
        quip: d.quip,
        confirmedAt: d.confirmedAt || Date.now(),
        userId: d.userId,
        userName: d.userName,
      });
    });

    if (list.length > 0) return list;
  } catch (err) {
    console.warn('Firebase Firestore query fallback:', err);
  }

  // Fallback to local cookie history
  return getMealHistory();
}

export async function deleteMealFromFirebase(id: string): Promise<void> {
  // Remove from local cookie
  removeMealFromHistory(id);

  // If id is a firebase doc ID (not starting with 'meal-')
  if (!id.startsWith('meal-')) {
    try {
      await deleteDoc(doc(db, 'confirmed_meals', id));
    } catch (err) {
      console.warn('Firebase Firestore delete warning:', err);
    }
  }
}
