import { useEffect, useState } from 'react';
import { NAV_SECTIONS } from '@/config/site';
import type { Theme } from '@/hooks/useTheme';
import { useScrolledPast } from '@/hooks/useScrolledPast';
import { initials } from '@/lib/format';
import { CheckIcon, MenuIcon, MoonIcon, PencilIcon, SunIcon, XIcon } from '@/components/ui/Icons';
import './Navbar.css';

interface NavbarProps {
  name: string;
  theme: Theme;
  onToggleTheme: () => void;
  canEdit: boolean;
  editing: boolean;
  onToggleEdit: () => void;
}

export function Navbar({ name, theme, onToggleTheme, canEdit, editing, onToggleEdit }: NavbarProps) {
  const scrolled = useScrolledPast(8);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(NAV_SECTIONS[0].id);

  // Scroll-spy: highlight the section crossing the middle of the viewport.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const { id } of NAV_SECTIONS) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="container nav-inner">
        <a href="#about" className="brand" onClick={close} aria-label={`${name}, back to top`}>
          <span className="brand-mark">{initials(name)}</span>
          <span className="brand-name">{name}</span>
        </a>
        <nav id="site-nav" className="nav-links" aria-label="Sections">
          {NAV_SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? 'is-active' : undefined}
              aria-current={active === id ? 'true' : undefined}
              onClick={close}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          {canEdit && (
            <button type="button" className={`btn btn-sm ${editing ? 'btn-primary' : 'btn-secondary'}`} onClick={onToggleEdit}>
              {editing ? <CheckIcon size={15} /> : <PencilIcon size={15} />}
              <span className="hide-xs">{editing ? 'Done' : 'Customize'}</span>
            </button>
          )}
          <button
            type="button"
            className="icon-btn theme-toggle"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
          >
            <span key={theme} className="theme-icon">
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </span>
          </button>
          <button
            type="button"
            className="icon-btn menu-btn"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="site-nav"
          >
            {open ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
