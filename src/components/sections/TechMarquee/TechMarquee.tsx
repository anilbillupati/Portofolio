import type { SkillGroup, Track } from '@/types/portfolio';
import './TechMarquee.css';

function skillsFor(groups: SkillGroup[], tracks: Array<Track | 'both'>): string[] {
  return [...new Set(groups.filter((g) => tracks.includes(g.track)).flatMap((g) => g.skills))];
}

function Row({ items, reverse, tone }: { items: string[]; reverse?: boolean; tone: Track }) {
  // Rendered twice so the -50% translate loops seamlessly.
  const doubled = [...items, ...items];
  return (
    <div className={`marquee-row${reverse ? ' is-reverse' : ''}`} style={{ animationDuration: `${Math.max(30, items.length * 3.2)}s` }}>
      {doubled.map((s, i) => (
        <span key={`${s}-${i}`} className={`marquee-item tone-${tone}`}>
          <i className={`dot t-${tone}`} />
          {s}
        </span>
      ))}
    </div>
  );
}

/** Decorative, keyword-dense strip of the tech stack. Hidden from screen readers (the Skills section lists it all). */
export function TechMarquee({ groups }: { groups: SkillGroup[] }) {
  const backend = skillsFor(groups, ['backend', 'both']);
  const ai = skillsFor(groups, ['ai']);
  if (!backend.length && !ai.length) return null;

  return (
    <div className="marquee" aria-hidden="true">
      {backend.length > 0 && <Row items={backend} tone="backend" />}
      {ai.length > 0 && <Row items={ai} tone="ai" reverse />}
    </div>
  );
}
