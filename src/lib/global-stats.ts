import { db } from './firebase';
import {
  doc,
  setDoc,
  updateDoc,
  increment,
  onSnapshot,
} from 'firebase/firestore';

const STATS_DOC_REF = doc(db, 'app_stats', 'global');

export async function incrementGlobalMealCount(): Promise<void> {
  try {
    await updateDoc(STATS_DOC_REF, {
      totalConfirmedMeals: increment(1),
      updatedAt: Date.now(),
    });
  } catch {
    try {
      await setDoc(
        STATS_DOC_REF,
        {
          totalConfirmedMeals: 1,
          updatedAt: Date.now(),
        },
        { merge: true },
      );
    } catch (err) {
      console.warn('Global stats increment warning:', err);
    }
  }
}

export function subscribeToGlobalStats(
  onUpdate: (count: number) => void,
): () => void {
  try {
    const unsubscribe = onSnapshot(
      STATS_DOC_REF,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (typeof data.totalConfirmedMeals === 'number') {
            onUpdate(data.totalConfirmedMeals);
            return;
          }
        }
        onUpdate(0);
      },
      (err) => {
        console.warn('Global stats listener warning:', err);
        onUpdate(0);
      },
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Global stats subscribe warning:', err);
    onUpdate(0);
    return () => {};
  }
}
