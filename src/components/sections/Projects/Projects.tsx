import type { Focus, Project } from '@/types/portfolio';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProjectCard } from './ProjectCard';
import './Projects.css';

export function Projects({ projects, focus }: { projects: Project[]; focus: Focus }) {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeader
          id="projects"
          eyebrow="Projects"
          title="Selected work"
          intro="Products I've built and scaled at Fission Labs, plus a personal build."
        />
        <div className="projects-grid">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={i * 100} className="project-cell">
              <ProjectCard project={p} focus={focus} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
