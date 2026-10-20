import { useRef } from 'react';
import { DownloadIcon, PencilIcon, ResetIcon, SaveIcon, UploadIcon } from '@/components/ui/Icons';
import './editor.css';

interface EditToolbarProps {
  dirty: boolean;
  canSaveToProject: boolean;
  onEditProfile: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onDiscard: () => void;
  onSaveToProject: () => void;
}

export function EditToolbar({ dirty, canSaveToProject, onEditProfile, onExport, onImport, onDiscard, onSaveToProject }: EditToolbarProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="edit-bar" role="toolbar" aria-label="Customize portfolio">
      <span className="edit-status">
        <i className={`dirty-dot${dirty ? ' is-dirty' : ''}`} />
        {dirty ? 'Unsaved changes' : 'All changes saved'}
      </span>
      <button type="button" className="btn btn-sm btn-ghost" onClick={onEditProfile}>
        <PencilIcon size={15} /> Profile
      </button>
      <button type="button" className="btn btn-sm btn-ghost" onClick={onExport} title="Download your data as JSON">
        <DownloadIcon size={15} /> Export
      </button>
      <button type="button" className="btn btn-sm btn-ghost" onClick={() => fileRef.current?.click()} title="Load data from a JSON file">
        <UploadIcon size={15} /> Import
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (file) onImport(file);
        }}
      />
      <button type="button" className="btn btn-sm btn-ghost" onClick={onDiscard} disabled={!dirty}>
        <ResetIcon size={15} /> Discard
      </button>
      {canSaveToProject && (
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={onSaveToProject}
          disabled={!dirty}
          title="Write changes into src/data/portfolio.json"
        >
          <SaveIcon size={15} /> Save to project
        </button>
      )}
    </div>
  );
}
