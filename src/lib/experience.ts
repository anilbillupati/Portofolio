import type { Experience } from '@/types/portfolio';

const YM = /^(\d{4})-(\d{2})$/;

/** Month index (year * 12 + month) for "YYYY-MM" or "Present"; null if unparseable. */
function monthIndex(value: string, now: Date): number | null {
  const m = YM.exec(value);
  if (m) return Number(m[1]) * 12 + Number(m[2]) - 1;
  return /^present$/i.test(value.trim()) ? now.getFullYear() * 12 + now.getMonth() : null;
}

/** Inclusive month count, matching how LinkedIn counts tenure. */
export function monthsBetween(start: string, end: string, now = new Date()): number {
  const s = monthIndex(start, now);
  const e = monthIndex(end, now);
  return s === null || e === null ? 0 : Math.max(0, e - s + 1);
}

/** Span from the earliest start to the latest end across all roles. */
export function totalExperienceMonths(experience: Experience[], now = new Date()): number {
  const starts = experience.map((j) => monthIndex(j.start, now)).filter((n): n is number => n !== null);
  const ends = experience.map((j) => monthIndex(j.end, now)).filter((n): n is number => n !== null);
  if (!starts.length || !ends.length) return 0;
  return Math.max(0, Math.max(...ends) - Math.min(...starts) + 1);
}

/**
 * Rounds down to the nearest half year so every place on the site says the same thing:
 * 31 months -> "2.5+", 36 months -> "3".
 */
export function yearsLabel(months: number): string {
  const years = Math.floor(months / 6) / 2;
  const text = Number.isInteger(years) ? String(years) : years.toFixed(1);
  return months % 6 === 0 ? text : `${text}+`;
}

export function fillTemplate(text: string, vars: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key: string) => vars[key] ?? match);
}
