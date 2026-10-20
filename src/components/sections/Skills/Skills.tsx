import type { Focus, SkillGroup } from '@/types/portfolio';
import { groupRelevance } from '@/lib/tracks';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AddSkillGroup } from './AddSkillGroup';
import { SkillCard } from './SkillCard';
import './Skills.css';

interface SkillsProps {
  groups: SkillGroup[];
  focus: Focus;
  editing: boolean;
  onChange: (groups: SkillGroup[]) => void;
}

export function Skills({ groups, focus, editing, onChange }: SkillsProps) {
  // Array#sort is stable, so groups keep their authored order within each relevance tier.
  const ordered = [...groups].sort((a, b) => groupRelevance(a.track, focus) - groupRelevance(b.track, focus));
  const total = groups.reduce((n, g) => n + g.skills.length, 0);

  const patch = (id: string, fn: (g: SkillGroup) => SkillGroup) => onChange(groups.map((g) => (g.id === id ? fn(g) : g)));

  const remove = (group: SkillGroup) => {
    if (window.confirm(`Delete the "${group.title}" category and its ${group.skills.length} skills?`)) {
      onChange(groups.filter((g) => g.id !== group.id));
    }
  };

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeader
          id="skills"
          eyebrow="Skills"
          title={
            <>
              A backend engineer who <span className="text-gradient">ships AI</span>
            </>
          }
          intro={`${total} technologies across production Java microservices and Generative AI systems.${
            focus === 'all' ? '' : ' The most relevant skills for this view come first.'
          }`}
        />
        <div className="skills-grid">
          {ordered.map((g, i) => (
            <Reveal key={g.id} delay={(i % 3) * 80} className="skills-cell">
              <SkillCard
                group={g}
                muted={groupRelevance(g.track, focus) === 2}
                editing={editing}
                onPatch={(fn) => patch(g.id, fn)}
                onRemove={() => remove(g)}
              />
            </Reveal>
          ))}
          {editing && <AddSkillGroup onAdd={(g) => onChange([...groups, g])} />}
        </div>
      </div>
    </section>
  );
}
