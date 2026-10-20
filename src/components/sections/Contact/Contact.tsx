import type { ReactNode } from 'react';
import type { Profile } from '@/types/portfolio';
import { telHref } from '@/lib/format';
import { socialLinks } from '@/lib/socials';
import { CopyIcon, MailIcon, PhoneIcon, PinIcon } from '@/components/ui/Icons';
import { Reveal } from '@/components/ui/Reveal';
import { SocialIcon } from '@/components/ui/SocialIcon';
import './Contact.css';

interface ContactRow {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

export function Contact({ profile, notify }: { profile: Profile; notify: (msg: string) => void }) {
  const copy = (value: string, what: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => notify(`${what} copied`))
      .catch(() => notify(value));
  };

  const rows: ContactRow[] = [
    { icon: <MailIcon size={17} />, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: <MailIcon size={17} />, label: 'Alternate email', value: profile.altEmail, href: `mailto:${profile.altEmail}` },
    { icon: <PhoneIcon size={17} />, label: 'Phone', value: profile.phone, href: telHref(profile.phone) },
    { icon: <PhoneIcon size={17} />, label: 'Alternate phone', value: profile.altPhone, href: telHref(profile.altPhone) },
    { icon: <PinIcon size={17} />, label: 'Location', value: profile.location },
  ].filter((r) => r.value);

  const socials = socialLinks(profile);

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container">
        <Reveal variant="zoom" className="contact-card">
          <div className="contact-copy">
            <span className="eyebrow">Contact</span>
            <h2 id="contact-title">Hiring for Java backend or GenAI? Let's talk.</h2>
            <p>
              I'm open to Backend Engineer, Java / Spring Boot and Generative AI Engineer roles. Email is the fastest way to reach me, and I
              usually reply within a day.
            </p>
            <div className="contact-actions">
              <a
                className="btn btn-light"
                href={`mailto:${profile.email}?subject=${encodeURIComponent(`Opportunity for ${profile.name}`)}`}
              >
                <MailIcon size={17} /> Email me
              </a>
              <button type="button" className="btn btn-outline-light" onClick={() => copy(profile.email, 'Email address')}>
                <CopyIcon size={16} /> Copy email
              </button>
            </div>
            {socials.length > 0 && (
              <ul className="contact-socials">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label}>
                      <SocialIcon name={s.key} size={18} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <dl className="contact-list">
            {rows.map((r) => (
              <div key={r.label} className="contact-row">
                <span className="contact-icon">{r.icon}</span>
                <div>
                  <dt>{r.label}</dt>
                  <dd>{r.href ? <a href={r.href}>{r.value}</a> : r.value}</dd>
                </div>
                {r.href && (
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={() => copy(r.value, r.label)}
                    aria-label={`Copy ${r.label.toLowerCase()}`}
                  >
                    <CopyIcon size={14} />
                  </button>
                )}
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
