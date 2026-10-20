import type { Focus, Profile, Stat } from '@/types/portfolio';
import { useAvailableFiles } from '@/hooks/useAvailableFiles';
import { useTypewriter } from '@/hooks/useTypewriter';
import { fillTemplate } from '@/lib/experience';
import { stagger } from '@/lib/motion';
import { socialLinks } from '@/lib/socials';
import { FocusSwitch } from '@/components/ui/FocusSwitch';
import { DownloadIcon, MailIcon, PencilIcon, PinIcon } from '@/components/ui/Icons';
import { Rich } from '@/components/ui/Rich';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { Portrait } from './Portrait';
import { StatCard } from './StatCard';
import './Hero.css';

interface HeroProps {
  profile: Profile;
  stats: Stat[];
  years: string;
  focus: Focus;
  onFocus: (f: Focus) => void;
  onCopyLink: () => void;
  editing: boolean;
  onPhoto: (photo: string) => void;
  onEditProfile: () => void;
  notify: (msg: string) => void;
}

export function Hero({ profile, stats, years, focus, onFocus, onCopyLink, editing, onPhoto, onEditProfile, notify }: HeroProps) {
  const typed = useTypewriter(profile.taglines[focus] ?? []);
  const available = useAvailableFiles(profile.resumes.map((r) => r.href));
  const resumes = profile.resumes.filter((r) => (focus === 'all' || r.track === focus) && (available[r.href] || editing));
  const hasResume = resumes.some((r) => available[r.href]);
  const visibleStats = stats.filter((s) => focus === 'all' || s.track === 'both' || s.track === focus).slice(0, 4);

  const socials = socialLinks(profile);

  return (
    <section id="about" className="hero" aria-labelledby="hero-name">
      <div className="hero-aurora" aria-hidden="true">
        <span className="blob blob-a" />
        <span className="blob blob-b" />
        <span className="blob blob-c" />
      </div>

      <div className="container">
        <div className="hero-grid">
          <div className="hero-copy">
            {profile.openToWork && (
              <span className="status-pill enter" style={stagger(0)}>
                <span className="status-dot" /> Open to new opportunities
              </span>
            )}
            <h1 id="hero-name" className="hero-name enter" style={stagger(1)}>
              {profile.name}
            </h1>
            <p className="hero-role enter" style={stagger(2)}>
              <span key={focus} className="role-accent swap">
                {profile.headline[focus]}
              </span>
              <span className="role-at"> at {profile.company}</span>
            </p>
            {(profile.taglines[focus]?.length ?? 0) > 0 && (
              <p className="hero-typed enter" style={stagger(3)} aria-label={`I build ${profile.taglines[focus].join(', ')}`}>
                <span className="typed-prefix" aria-hidden="true">
                  I build
                </span>{' '}
                <span className="typed-text" aria-hidden="true">
                  {typed}
                </span>
                <span className="caret" aria-hidden="true" />
              </p>
            )}
            <p key={`summary-${focus}`} className="hero-summary swap">
              <Rich text={fillTemplate(profile.summary[focus], { years })} />
            </p>

            <div className="enter" style={stagger(5)}>
              <FocusSwitch focus={focus} onChange={onFocus} onCopyLink={onCopyLink} />
            </div>

            <div className="hero-actions enter" style={stagger(6)}>
              {resumes.map((r, i) =>
                available[r.href] ? (
                  <a key={r.href} href={r.href} download className={`btn ${i === 0 ? 'btn-primary' : 'btn-secondary'}`}>
                    <DownloadIcon size={17} /> {r.label}
                  </a>
                ) : (
                  <span
                    key={r.href}
                    className="btn btn-secondary is-disabled"
                    title={`Add the PDF at public/${r.href} to enable this button`}
                  >
                    <DownloadIcon size={17} /> {r.label} (add PDF)
                  </span>
                ),
              )}
              <a href="#contact" className={`btn ${hasResume ? 'btn-secondary' : 'btn-primary'}`}>
                <MailIcon size={17} /> Get in touch
              </a>
              {editing && (
                <button type="button" className="btn btn-ghost" onClick={onEditProfile}>
                  <PencilIcon size={16} /> Edit profile
                </button>
              )}
            </div>

            <ul className="hero-meta enter" style={stagger(7)}>
              <li>
                <PinIcon size={16} /> {profile.location}
              </li>
              <li>
                <a href={`mailto:${profile.email}`}>
                  <MailIcon size={16} /> {profile.email}
                </a>
              </li>
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="social-link">
                    <SocialIcon name={s.key} size={16} /> {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="hero-visual enter-zoom">
            <Portrait profile={profile} editing={editing} onPhoto={onPhoto} notify={notify} />
          </div>
        </div>

        <div className="stats">
          {visibleStats.map((s, i) => (
            <StatCard key={s.label} value={fillTemplate(s.value, { years })} label={s.label} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
