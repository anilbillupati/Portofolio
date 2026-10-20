import type { Focus, GroupTrack } from '@/types/portfolio';

export const NAV_SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
] as const;

export const FOCUS_OPTIONS: { value: Focus; label: string; short: string }[] = [
  { value: 'all', label: 'Full profile', short: 'All' },
  { value: 'backend', label: 'Java Backend', short: 'Backend' },
  { value: 'ai', label: 'Generative AI', short: 'GenAI' },
];

export const TRACK_LABEL: Record<GroupTrack, string> = {
  backend: 'Backend',
  ai: 'GenAI',
  both: 'Shared',
};

export const STORAGE_KEYS = {
  // Bump the version whenever the Portfolio shape changes so stale drafts are ignored.
  draft: 'portfolio:draft:v3',
  theme: 'theme',
} as const;

export const SAVE_ENDPOINT = '/__save-portfolio';
