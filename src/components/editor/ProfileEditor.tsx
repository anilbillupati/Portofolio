import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import type { Focus, Portfolio, Profile } from '@/types/portfolio';
import { initials } from '@/lib/format';
import { SOCIALS } from '@/lib/socials';
import { resizeImage } from '@/lib/storage';
import { CameraIcon, TrashIcon, XIcon } from '@/components/ui/Icons';
import './editor.css';

interface ProfileEditorProps {
  data: Portfolio;
  onSave: (data: Portfolio) => void;
  onClose: () => void;
  notify: (msg: string) => void;
}

const VIEWS: { focus: Focus; label: string }[] = [
  { focus: 'all', label: 'Full profile view' },
  { focus: 'backend', label: 'Java Backend view' },
  { focus: 'ai', label: 'Generative AI view' },
];

function Field({ label, hint, full, children }: { label: string; hint?: string; full?: boolean; children: ReactNode }) {
  return (
    <label className={`field${full ? ' full' : ''}`}>
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function ProfileEditor({ data, onSave, onClose, notify }: ProfileEditorProps) {
  const [p, setP] = useState<Profile>(data.profile);
  const [certLinks, setCertLinks] = useState(data.certifications.map((c) => c.link));
  const [projectLinks, setProjectLinks] = useState(data.projects.map((x) => x.link));
  const fileRef = useRef<HTMLInputElement>(null);
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) => setP((prev) => ({ ...prev, [key]: value }));
  const setLink = (key: keyof Profile['links'], value: string) =>
    setP((prev) => ({ ...prev, links: { ...prev.links, [key]: value.trim() } }));
  const setPer = (key: 'headline' | 'summary', focus: Focus, value: string) =>
    setP((prev) => ({ ...prev, [key]: { ...prev[key], [focus]: value } }));
  const setTaglines = (focus: Focus, value: string) =>
    setP((prev) => ({
      ...prev,
      taglines: {
        ...prev.taglines,
        [focus]: value
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
      },
    }));

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      set('photo', await resizeImage(file));
    } catch {
      notify('Could not read that image. Try a JPG or PNG.');
    }
  };

  const save = () =>
    onSave({
      ...data,
      profile: p,
      certifications: data.certifications.map((c, i) => ({ ...c, link: certLinks[i].trim() })),
      projects: data.projects.map((x, i) => ({ ...x, link: projectLinks[i].trim() })),
    });

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="profile-editor-title">
        <div className="modal-head">
          <h2 id="profile-editor-title">Edit profile</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <XIcon />
          </button>
        </div>

        <div className="modal-body">
          <section className="form-section">
            <h3>Photo</h3>
            <div className="photo-row">
              <div className="photo-thumb">{p.photo ? <img src={p.photo} alt="" /> : <span>{initials(p.name)}</span>}</div>
              <button type="button" className="btn btn-sm btn-secondary" onClick={() => fileRef.current?.click()}>
                <CameraIcon size={15} /> {p.photo ? 'Replace photo' : 'Upload photo'}
              </button>
              {p.photo && (
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => set('photo', '')}>
                  <TrashIcon size={15} /> Remove
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
            </div>
            <p className="form-hint">
              A professional, well-lit headshot works best. It's cropped to a square and compressed automatically.
            </p>
          </section>

          <section className="form-section">
            <h3>Basics</h3>
            <div className="form-grid">
              <Field label="Full name">
                <input ref={firstRef} className="input" value={p.name} onChange={(e) => set('name', e.target.value)} />
              </Field>
              <Field label="Current company">
                <input className="input" value={p.company} onChange={(e) => set('company', e.target.value)} />
              </Field>
              <Field label="Email">
                <input className="input" type="email" value={p.email} onChange={(e) => set('email', e.target.value)} />
              </Field>
              <Field label="Alternate email">
                <input className="input" type="email" value={p.altEmail} onChange={(e) => set('altEmail', e.target.value)} />
              </Field>
              <Field label="Phone">
                <input className="input" type="tel" value={p.phone} onChange={(e) => set('phone', e.target.value)} />
              </Field>
              <Field label="Alternate phone">
                <input className="input" type="tel" value={p.altPhone} onChange={(e) => set('altPhone', e.target.value)} />
              </Field>
              <Field label="Location">
                <input className="input" value={p.location} onChange={(e) => set('location', e.target.value)} />
              </Field>
              <label className="field checkbox-field">
                <input type="checkbox" checked={p.openToWork} onChange={(e) => set('openToWork', e.target.checked)} />
                <span>Show "Open to new opportunities" badge</span>
              </label>
            </div>
          </section>

          <section className="form-section">
            <h3>Links</h3>
            <div className="form-grid">
              {SOCIALS.map((s) => (
                <Field key={s.key} label={`${s.label} URL`}>
                  <input
                    className="input"
                    type="url"
                    placeholder={s.placeholder}
                    value={p.links[s.key]}
                    onChange={(e) => setLink(s.key, e.target.value)}
                  />
                </Field>
              ))}
              {data.certifications.map((c, i) => (
                <Field key={c.name} label={`${c.name} (Credly)`}>
                  <input
                    className="input"
                    type="url"
                    placeholder="https://www.credly.com/badges/…"
                    value={certLinks[i]}
                    onChange={(e) => setCertLinks((l) => l.map((v, j) => (j === i ? e.target.value : v)))}
                  />
                </Field>
              ))}
              {data.projects.map((x, i) => (
                <Field key={x.name} label={`${x.name} link`}>
                  <input
                    className="input"
                    type="url"
                    placeholder="https://github.com/…"
                    value={projectLinks[i]}
                    onChange={(e) => setProjectLinks((l) => l.map((v, j) => (j === i ? e.target.value : v)))}
                  />
                </Field>
              ))}
            </div>
            <p className="form-hint">Empty links are hidden on the site.</p>
          </section>

          {VIEWS.map(({ focus, label }) => (
            <section key={focus} className="form-section">
              <h3>{label}</h3>
              <div className="form-grid">
                <Field label="Headline" full>
                  <input className="input" value={p.headline[focus]} onChange={(e) => setPer('headline', focus, e.target.value)} />
                </Field>
                <Field label='"I build …" phrases' hint="One per line. These are typed out in the hero." full>
                  <textarea
                    className="input"
                    rows={3}
                    defaultValue={p.taglines[focus].join('\n')}
                    onChange={(e) => setTaglines(focus, e.target.value)}
                  />
                </Field>
                <Field
                  label="Summary"
                  hint="**double asterisks** make text bold. {{years}} becomes your calculated experience, e.g. 2.5+."
                  full
                >
                  <textarea
                    className="input"
                    rows={4}
                    value={p.summary[focus]}
                    onChange={(e) => setPer('summary', focus, e.target.value)}
                  />
                </Field>
              </div>
            </section>
          ))}
        </div>

        <div className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={save}>
            Apply changes
          </button>
        </div>
      </div>
    </div>
  );
}
