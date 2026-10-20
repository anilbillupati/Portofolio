import type { Focus, GroupTrack } from '@/types/portfolio';
import { LayersIcon, ServerIcon, SparklesIcon } from './Icons';

export function TrackIcon({ track, size = 18 }: { track: GroupTrack | Focus; size?: number }) {
  if (track === 'backend') return <ServerIcon size={size} />;
  if (track === 'ai') return <SparklesIcon size={size} />;
  return <LayersIcon size={size} />;
}
