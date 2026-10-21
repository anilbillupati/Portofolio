import type { Focus, Project } from '@/types/portfolio';
import { matchesFocus, trackClass } from '@/lib/tracks';
import { stagger } from '@/lib/motion';
import { ArrowUpRightIcon, GithubIcon } from '@/components/ui/Icons';
import { Rich } from '@/components/ui/Rich';

export function ProjectCard({ project: p, focus }: { project: Project; focus: Focus }) {
  const bullets = p.bullets.filter((b) => matchesFocus(b.tracks, focus));
  const isGithub = p.link.includes('github.com');
  const metrics = p.metrics ?? [];

  const bulletList = bullets.length > 0 && (
    <ul className="bullets project-bullets">
      {bullets.map((b, i) => (
        <li key={b.text} className={trackClass(b.tracks)} style={stagger(i)}>
          <Rich text={b.text} />
        </li>
      ))}
    </ul>
  );

  return (
    <article className="card project is-featured spotlight">
      <div className="project-main">
        <div className="project-top">
          <span className="project-kind">{p.kind}</span>
          {p.link && (
            <a
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className="project-link"
              aria-label={`${p.name} on ${isGithub ? 'GitHub' : 'the web'}`}
            >
              {isGithub ? <GithubIcon size={16} /> : null}
              <span>{isGithub ? 'Code' : 'Visit'}</span>
              <ArrowUpRightIcon size={14} />
            </a>
          )}
        </div>
        <div>
          <h3>{p.name}</h3>
          <div className="project-sub">{p.subtitle}</div>
        </div>
        <p>{p.description}</p>
        {metrics.length > 0 && (
          <div className={`metrics${metrics.length > 1 ? ' is-grid' : ''}`}>
            {metrics.map((m) => (
              <div key={m.label} className="metric">
                <b>{m.value}</b>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        )}
        <ul className="tags" aria-label="Tech stack">
          {p.tech.map((t) => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
        </ul>
      </div>
      {bulletList}
    </article>
  );
}
