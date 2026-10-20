import { SAVE_ENDPOINT, STORAGE_KEYS } from '@/config/site';
import type { Portfolio } from '@/types/portfolio';

function isPortfolio(value: unknown): value is Portfolio {
  const v = value as Partial<Portfolio> | null;
  return !!v && typeof v === 'object' && !!v.profile && Array.isArray(v.skills) && Array.isArray(v.experience);
}

/** Fills fields missing from older data with the defaults so the UI never reads undefined. */
export function withDefaults(data: Portfolio, defaults: Portfolio): Portfolio {
  return {
    ...defaults,
    ...data,
    profile: {
      ...defaults.profile,
      ...data.profile,
      links: { ...defaults.profile.links, ...data.profile.links },
    },
  };
}

export function loadDraft(defaults: Portfolio): Portfolio | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.draft);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isPortfolio(parsed) ? withDefaults(parsed, defaults) : null;
  } catch {
    return null;
  }
}

export function saveDraft(data: Portfolio): void {
  try {
    localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(data));
  } catch {
    // Storage full or blocked; in-memory state still works.
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.draft);
  } catch {
    // ignore
  }
}

export function downloadJson(data: Portfolio, filename = 'portfolio.json'): void {
  const blob = new Blob([JSON.stringify(data, null, 2) + '\n'], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function readJsonFile(file: File, defaults: Portfolio): Promise<Portfolio> {
  const parsed: unknown = JSON.parse(await file.text());
  if (!isPortfolio(parsed)) throw new Error('not a portfolio file');
  return withDefaults(parsed, defaults);
}

/** Dev server only: writes the data into src/data/portfolio.json. */
export async function saveToProject(data: Portfolio): Promise<void> {
  const res = await fetch(SAVE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.text()) || res.statusText);
}

/** Center-crops (biased toward the top, where faces usually are) and downsizes to a square JPEG. */
export async function resizeImage(file: File, size = 480): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Unreadable image'));
      el.src = url;
    });
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const sx = (img.naturalWidth - side) / 2;
    const sy = (img.naturalHeight - side) * 0.3;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');
    ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
    return canvas.toDataURL('image/jpeg', 0.86);
  } finally {
    URL.revokeObjectURL(url);
  }
}
