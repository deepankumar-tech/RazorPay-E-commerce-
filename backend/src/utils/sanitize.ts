/**
 * Sanitizes input text before saving to PostgreSQL database tables with WIN1252/ASCII compatibility.
 * Converts Rupee '₹' -> 'INR ', Star '★' -> '*', and strips incompatible unicode sequences.
 */
export function sanitizeUtf8ForDb(text: string): string {
  if (!text) return '';
  return text
    .replace(/₹/g, 'INR ')
    .replace(/★/g, '*')
    .replace(/☆/g, '*')
    .replace(/[^\x00-\x7F]/g, ''); // strip non-ASCII characters to guarantee 100% database storage safety
}

export function sanitizeObjectForDb(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return sanitizeUtf8ForDb(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeObjectForDb);
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key of Object.keys(obj)) {
      cleaned[key] = sanitizeObjectForDb(obj[key]);
    }
    return cleaned;
  }
  return obj;
}
