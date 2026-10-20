import { useRef, type ChangeEvent } from 'react';
import type { Profile } from '@/types/portfolio';
import { initials } from '@/lib/format';
import { resizeImage } from '@/lib/storage';
import { AwardIcon, CameraIcon, TrashIcon } from '@/components/ui/Icons';

interface PortraitProps {
  profile: Profile;
  editing: boolean;
  onPhoto: (photo: string) => void;
  notify: (msg: string) => void;
}

export function Portrait({ profile, editing, onPhoto, notify }: PortraitProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      onPhoto(await resizeImage(file));
      notify('Profile photo updated');
    } catch {
      notify('Could not read that image. Try a JPG or PNG.');
    }
  };

  return (
    <div className="portrait-wrap">
      <div className="portrait-glow" aria-hidden="true" />
      <div className="portrait">
        <div className="portrait-inner">
          {profile.photo ? (
            <img src={profile.photo} alt={`Portrait of ${profile.name}`} width={480} height={480} />
          ) : (
            <span className="monogram" aria-hidden="true">
              {initials(profile.name)}
            </span>
          )}
          {editing && (
            <div className={`photo-overlay${profile.photo ? '' : ' is-empty'}`}>
              <button type="button" className="btn btn-sm btn-light" onClick={() => fileRef.current?.click()}>
                <CameraIcon size={15} /> {profile.photo ? 'Change photo' : 'Upload photo'}
              </button>
              {profile.photo && (
                <button type="button" className="btn btn-sm btn-light" onClick={() => onPhoto('')}>
                  <TrashIcon size={15} /> Remove
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
      <span className="float-chip c1">
        <i className="dot t-backend" /> Java · Spring Boot
      </span>
      <span className="float-chip c2">
        <i className="dot t-ai" /> LangChain · LangGraph
      </span>
      <span className="float-chip c3">
        <AwardIcon size={15} /> AWS Certified ×2
      </span>
    </div>
  );
}
