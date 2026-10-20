import { useState, type FormEvent } from 'react';
import { TRACK_LABEL } from '@/config/site';
import type { GroupTrack, SkillGroup } from '@/types/portfolio';
import { stagger } from '@/lib/motion';
import { PlusIcon, TrashIcon, XIcon } from '@/components/ui/Icons';
import { TrackIcon } from '@/components/ui/TrackIcon';

const TRACKS: GroupTrack[] = ['backend', 'ai', 'both'];

interface SkillCardProps {
  group: SkillGroup;
  muted: boolean;
  editing: boolean;
  onPatch: (fn: (g: SkillGroup) => SkillGroup) => void;
  onRemove: () => void;
}

/** Splits "a, b, c" and drops blanks and case-insensitive duplicates. */
function parseNewSkills(input: string, existing: string[]): string[] {
  const seen = new Set(existing.map((s) => s.toLowerCase()));
  const fresh: string[] = [];
  for (const raw of input.split(',')) {
    const s = raw.trim();
    if (s && !seen.has(s.toLowerCase())) {
      seen.add(s.toLowerCase());
      fresh.push(s);
    }
  }
  return fresh;
}

export function SkillCard({ group, muted, editing, onPatch, onRemove }: SkillCardProps) {
  const [draft, setDraft] = useState('');

  const add = (e: FormEvent) => {
    e.preventDefault();
    const fresh = parseNewSkills(draft, group.skills);
    if (fresh.length) onPatch((g) => ({ ...g, skills: [...g.skills, ...fresh] }));
    setDraft('');
  };

  return (
    <article className={`card skill-card spotlight track-${group.track}${muted ? ' is-muted' : ''}`}>
      <header>
        <span className="track-icon">
          <TrackIcon track={group.track} />
        </span>
        {editing ? (
          <>
            <input
              className="input input-title"
              value={group.title}
              aria-label="Category name"
              onChange={(e) => onPatch((g) => ({ ...g, title: e.target.value }))}
            />
            <select
              className="input input-select"
              value={group.track}
              aria-label="Category track"
              onChange={(e) => onPatch((g) => ({ ...g, track: e.target.value as GroupTrack }))}
            >
              {TRACKS.map((t) => (
                <option key={t} value={t}>
                  {TRACK_LABEL[t]}
                </option>
              ))}
            </select>
            <button type="button" className="icon-btn icon-btn-sm danger" onClick={onRemove} aria-label={`Delete ${group.title}`}>
              <TrashIcon size={15} />
            </button>
          </>
        ) : (
          <>
            <h3>{group.title}</h3>
            <span className="count">{group.skills.length}</span>
          </>
        )}
      </header>
      <ul className="chips">
        {group.skills.map((s, i) => (
          <li key={s} className="chip" style={stagger(i)}>
            {s}
            {editing && (
              <button
                type="button"
                aria-label={`Remove ${s}`}
                onClick={() => onPatch((g) => ({ ...g, skills: g.skills.filter((x) => x !== s) }))}
              >
                <XIcon size={12} />
              </button>
            )}
          </li>
        ))}
        {group.skills.length === 0 && <li className="chips-empty">No skills yet</li>}
      </ul>
      {editing && (
        <form className="add-row" onSubmit={add}>
          <input
            className="input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add skills, comma-separated"
            aria-label={`Add skill to ${group.title}`}
          />
          <button type="submit" className="btn btn-sm btn-primary" disabled={!draft.trim()}>
            <PlusIcon size={15} /> Add
          </button>
        </form>
      )}
    </article>
  );
}
