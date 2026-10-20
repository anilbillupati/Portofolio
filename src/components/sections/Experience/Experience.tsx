import type { Experience as Job, Focus } from '@/types/portfolio';
import { monthsBetween, yearsLabel } from '@/lib/experience';
import { formatMonth, initials } from '@/lib/format';
import { PinIcon } from '@/components/ui/Icons';
import { Legend } from '@/components/ui/Legend';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { WorkBlockList } from './WorkBlockList';
import './Experience.css';

const INTRO: Record<Focus, string> = {
  all: 'Work spanning Java microservices, data pipelines and Generative AI. Use the switch at the top to focus on one track.',
  backend: 'Backend and data engineering highlights: Java, Spring Boot, Kafka, databases and performance.',
  ai: 'Generative AI highlights: RAG, agents, embeddings and LLM integration.',
};

export function Experience({ experience, focus }: { experience: Job[]; focus: Focus }) {
  return (
    <section id="experience" className="section section-alt" aria-labelledby="experience-title">
      <div className="container">
        <SectionHeader id="experience" eyebrow="Experience" title="Production systems at enterprise scale" intro={INTRO[focus]}>
          {focus === 'all' && <Legend />}
        </SectionHeader>

        <ol className="timeline">
          {experience.map((job) => {
            const current = /^present$/i.test(job.end.trim());
            return (
              <li key={`${job.company}-${job.start}`} className="timeline-item">
                <Reveal variant="left">
                  <span className={`timeline-node${current ? ' is-current' : ''}`} aria-hidden="true" />
                  <article className="card job">
                    <header className="job-head">
                      <span className="company-logo" aria-hidden="true">
                        {initials(job.company)}
                      </span>
                      <div className="job-title-wrap">
                        <h3 className="job-title">{job.role}</h3>
                        <div className="job-company">
                          <strong>{job.company}</strong>
                          <span className="sep" aria-hidden="true">
                            ·
                          </span>
                          <PinIcon size={14} /> {job.location}
                        </div>
                      </div>
                      <div className="job-dates">
                        <span className="job-range">
                          {formatMonth(job.start)} – {formatMonth(job.end)}
                        </span>
                        <span className="job-duration">
                          {current && <i className="live-dot" aria-hidden="true" />}
                          {yearsLabel(monthsBetween(job.start, job.end))} years
                        </span>
                      </div>
                    </header>
                    <div className="work-blocks">
                      {job.blocks.map((b) => (
                        <WorkBlockList key={b.name} block={b} focus={focus} />
                      ))}
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
