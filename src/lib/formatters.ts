/**
 * Centralized Formatter & Helper Utilities
 * MeshiGacha (メシガチャ)
 */

/**
 * Format JPY currency cleanly
 * @param amount Price in Japanese Yen
 */
export function formatJPY(amount: number): string {
  const safeAmount = Math.max(0, Math.round(amount));
  return `¥${safeAmount.toLocaleString('ja-JP')}`;
}

/**
 * Format price estimate label
 * @param amount Price in JPY
 */
export function formatEstimatePrice(amount: number): string {
  const displayPrice = amount > 200 ? amount : amount * 10;
  return `約${Math.round(displayPrice)}円`;
}

/**
 * Safe date time formatter (prevents Invalid Date)
 * @param timestamp Timestamp in milliseconds or Date object
 * @param locale Locale string (default 'ja-JP')
 */
export function formatTime(timestamp?: number | string | Date, locale: string = 'ja-JP'): string {
  if (!timestamp) return '';
  const dateObj = new Date(timestamp);
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
}

/**
 * Safe full date formatter
 * @param timestamp Timestamp in milliseconds or Date object
 * @param locale Locale string (default 'ja-JP')
 */
export function formatDate(timestamp?: number | string | Date, locale: string = 'ja-JP'): string {
  if (!timestamp) return '';
  const dateObj = new Date(timestamp);
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });
}
