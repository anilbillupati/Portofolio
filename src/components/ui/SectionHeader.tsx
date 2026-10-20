import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

interface SectionHeaderProps {
  id: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}

export function SectionHeader({ id, eyebrow, title, intro, children }: SectionHeaderProps) {
  return (
    <Reveal className="section-head">
      <span className="eyebrow">{eyebrow}</span>
      <h2 id={`${id}-title`}>{title}</h2>
      {intro && <p>{intro}</p>}
      {children}
    </Reveal>
  );
}
