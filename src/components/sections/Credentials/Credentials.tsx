import type { Certification, Education } from '@/types/portfolio';
import { formatMonth } from '@/lib/format';
import { ArrowUpRightIcon, AwardIcon, GraduationIcon, TrophyIcon } from '@/components/ui/Icons';
import { Reveal } from '@/components/ui/Reveal';
import { Rich } from '@/components/ui/Rich';
import { SectionHeader } from '@/components/ui/SectionHeader';
import './Credentials.css';

interface CredentialsProps {
  certifications: Certification[];
  achievements: string[];
  education: Education[];
}

export function Credentials({ certifications, achievements, education }: CredentialsProps) {
  return (
    <section id="credentials" className="section section-alt" aria-labelledby="credentials-title">
      <div className="container">
        <SectionHeader id="credentials" eyebrow="Credentials" title="Certifications, recognition & education" />
        <div className="cred-grid">
          <Reveal className="card cred spotlight tone-backend">
            <span className="cred-icon">
              <AwardIcon size={20} />
            </span>
            <h3>Certifications</h3>
            <ul className="cred-list">
              {certifications.map((c) => (
                <li key={c.name}>
                  <div className="cred-name">{c.name}</div>
                  <div className="cred-meta">
                    {c.issuer}
                    {c.link && (
                      <a href={c.link} target="_blank" rel="noreferrer" className="verify">
                        Verify on Credly <ArrowUpRightIcon size={13} />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="card cred spotlight tone-gold" delay={100}>
            <span className="cred-icon">
              <TrophyIcon size={20} />
            </span>
            <h3>Recognition</h3>
            <ul className="cred-list">
              {achievements.map((a) => (
                <li key={a} className="cred-text">
                  <Rich text={a} />
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="card cred spotlight tone-ai" delay={200}>
            <span className="cred-icon">
              <GraduationIcon size={20} />
            </span>
            <h3>Education</h3>
            <ul className="cred-list">
              {education.map((e) => (
                <li key={e.degree}>
                  <div className="cred-name">{e.degree}</div>
                  <div className="cred-meta">{e.school}</div>
                  <div className="cred-meta">
                    {formatMonth(e.start)} – {formatMonth(e.end)} · {e.score}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
