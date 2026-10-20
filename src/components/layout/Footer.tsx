import './layout.css';
import type { Profile } from '@/types/portfolio';
import { socialLinks } from '@/lib/socials';
import { MailIcon } from '@/components/ui/Icons';
import { SocialIcon } from '@/components/ui/SocialIcon';

export function Footer({ profile }: { profile: Profile }) {
  const links = [
    ...socialLinks(profile).map((s) => ({ ...s, icon: <SocialIcon name={s.key} size={17} /> })),
    { key: 'email', label: 'Email', href: `mailto:${profile.email}`, icon: <MailIcon size={17} /> },
  ];

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </span>
        <ul className="footer-links">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                aria-label={l.label}
                title={l.label}
              >
                {l.icon}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
