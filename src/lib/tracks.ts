import type { Focus, GroupTrack, Track } from '@/types/portfolio';

export function matchesFocus(tracks: Track[], focus: Focus): boolean {
  return focus === 'all' || tracks.includes(focus);
}

/** 0 = primary match, 1 = shared, 2 = other track. */
export function groupRelevance(track: GroupTrack, focus: Focus): number {
  if (focus === 'all' || track === focus) return 0;
  return track === 'both' ? 1 : 2;
}

export function trackClass(tracks: Track[]): string {
  return tracks.length > 1 ? 't-both' : `t-${tracks[0] ?? 'both'}`;
}
