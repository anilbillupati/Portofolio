import { useCallback, useEffect, useMemo, useState } from 'react';
import defaults from '@/data/portfolio.json';
import type { Portfolio } from '@/types/portfolio';
import { useFocus } from '@/hooks/useFocus';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useSpotlight } from '@/hooks/useSpotlight';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { totalExperienceMonths, yearsLabel } from '@/lib/experience';
import { downloadJson, readJsonFile, saveToProject } from '@/lib/storage';
import { BackToTop } from '@/components/layout/BackToTop';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { Contact } from '@/components/sections/Contact/Contact';
import { Credentials } from '@/components/sections/Credentials/Credentials';
import { Experience } from '@/components/sections/Experience/Experience';
import { Hero } from '@/components/sections/Hero/Hero';
import { Projects } from '@/components/sections/Projects/Projects';
import { Skills } from '@/components/sections/Skills/Skills';
import { TechMarquee } from '@/components/sections/TechMarquee/TechMarquee';
import { EditToolbar } from '@/components/editor/EditToolbar';
import { ProfileEditor } from '@/components/editor/ProfileEditor';
import { Toast } from '@/components/ui/Toast';

const DEFAULT_DATA = defaults as unknown as Portfolio;

// Editing is always available in `npm run dev`. On the deployed site it's hidden unless the
// URL has ?edit, so recruiters only ever see the finished page.
const CAN_EDIT = import.meta.env.DEV || new URLSearchParams(window.location.search).has('edit');

export default function App() {
  const { data, dirty, update, discard, markSaved } = usePortfolio(DEFAULT_DATA, CAN_EDIT);
  const [focus, setFocus] = useFocus();
  const [theme, toggleTheme] = useTheme();
  const [toast, notify] = useToast();
  const [editing, setEditing] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  useSpotlight();

  // Single source of truth for "years of experience", derived from the job dates.
  const years = useMemo(() => yearsLabel(totalExperienceMonths(data.experience)), [data.experience]);

  useEffect(() => {
    document.title = `${data.profile.name} · ${data.profile.headline[focus]}`;
  }, [data.profile, focus]);

  const copyLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('edit');
    url.hash = '';
    navigator.clipboard
      .writeText(url.toString())
      .then(() => notify('Link to this view copied. Share it with recruiters.'))
      .catch(() => notify(url.toString()));
  };

  const handleImport = async (file: File) => {
    try {
      const next = await readJsonFile(file, DEFAULT_DATA);
      update(() => next);
      notify('Portfolio data imported');
    } catch (e) {
      notify(`Import failed: ${(e as Error).message}`);
    }
  };

  const handleDiscard = () => {
    if (!window.confirm('Discard all unsaved changes and restore the saved portfolio?')) return;
    discard();
    notify('Changes discarded');
  };

  const handleSaveToProject = async () => {
    try {
      await saveToProject(data);
      markSaved();
      notify('Saved to src/data/portfolio.json');
    } catch (e) {
      notify(`Save failed: ${(e as Error).message}`);
    }
  };

  const closeProfile = useCallback(() => setProfileOpen(false), []);

  return (
    <div className={`app${editing ? ' is-editing' : ''}`} data-focus={focus}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar
        name={data.profile.name}
        theme={theme}
        onToggleTheme={toggleTheme}
        canEdit={CAN_EDIT}
        editing={editing}
        onToggleEdit={() => setEditing((e) => !e)}
      />

      <main id="main">
        <Hero
          profile={data.profile}
          stats={data.stats}
          years={years}
          focus={focus}
          onFocus={setFocus}
          onCopyLink={copyLink}
          editing={editing}
          onPhoto={(photo) => update((d) => ({ ...d, profile: { ...d.profile, photo } }))}
          onEditProfile={() => setProfileOpen(true)}
          notify={notify}
        />
        <TechMarquee groups={data.skills} />
        <Skills groups={data.skills} focus={focus} editing={editing} onChange={(skills) => update((d) => ({ ...d, skills }))} />
        <Experience experience={data.experience} focus={focus} />
        <Projects projects={data.projects} focus={focus} />
        <Credentials certifications={data.certifications} achievements={data.achievements} education={data.education} />
        <Contact profile={data.profile} notify={notify} />
      </main>

      <Footer profile={data.profile} />
      <BackToTop />

      {editing && (
        <EditToolbar
          dirty={dirty}
          canSaveToProject={import.meta.env.DEV}
          onEditProfile={() => setProfileOpen(true)}
          onExport={() => downloadJson(data)}
          onImport={handleImport}
          onDiscard={handleDiscard}
          onSaveToProject={handleSaveToProject}
        />
      )}
      {profileOpen && (
        <ProfileEditor
          data={data}
          notify={notify}
          onClose={closeProfile}
          onSave={(next) => {
            update(() => next);
            setProfileOpen(false);
            notify('Profile updated');
          }}
        />
      )}
      <Toast message={toast} />
    </div>
  );
}
