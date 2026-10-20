import { useState, type FormEvent } from 'react';
import { TRACK_LABEL } from '@/config/site';
import type { GroupTrack, SkillGroup } from '@/types/portfolio';
import { PlusIcon } from '@/components/ui/Icons';

const TRACKS: GroupTrack[] = ['backend', 'ai', 'both'];

function slug(title: string): string {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
}

export function AddSkillGroup({ onAdd }: { onAdd: (g: SkillGroup) => void }) {
  const [title, setTitle] = useState('');
  const [track, setTrack] = useState<GroupTrack>('both');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    onAdd({ id: slug(t), title: t, track, skills: [] });
    setTitle('');
  };

  return (
    <form className="add-group" onSubmit={submit}>
      <strong>New skill category</strong>
      <input
        className="input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Observability"
        aria-label="New category name"
      />
      <div className="add-row">
        <select className="input" value={track} onChange={(e) => setTrack(e.target.value as GroupTrack)} aria-label="New category track">
          {TRACKS.map((t) => (
            <option key={t} value={t}>
              {TRACK_LABEL[t]}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-sm btn-primary" disabled={!title.trim()}>
          <PlusIcon size={15} /> Add category
        </button>
      </div>
    </form>
  );
}
