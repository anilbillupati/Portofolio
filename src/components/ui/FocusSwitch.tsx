import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { FOCUS_OPTIONS } from '@/config/site';
import type { Focus } from '@/types/portfolio';
import { LinkIcon } from './Icons';
import { TrackIcon } from './TrackIcon';

interface FocusSwitchProps {
  focus: Focus;
  onChange: (focus: Focus) => void;
  onCopyLink: () => void;
}

/** Segmented control with a pill that slides to the active option. */
export function FocusSwitch({ focus, onChange, onCopyLink }: FocusSwitchProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<CSSProperties>({ opacity: 0 });

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const measure = () => {
      const active = group.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
      if (!active) return;
      setPill({
        width: active.offsetWidth,
        height: active.offsetHeight,
        transform: `translate(${active.offsetLeft}px, ${active.offsetTop}px)`,
        opacity: 1,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(group);
    return () => ro.disconnect();
  }, [focus]);

  return (
    <div className="focus-switch">
      <span className="focus-label">Tailor this page for</span>
      <div ref={groupRef} className="segmented" role="group" aria-label="Profile focus">
        <span className={`segmented-pill pill-${focus}`} style={pill} aria-hidden="true" />
        {FOCUS_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={focus === o.value}
            className={`seg-${o.value}`}
            onClick={() => onChange(o.value)}
          >
            <TrackIcon track={o.value} size={15} />
            <span className="seg-long">{o.label}</span>
            <span className="seg-short">{o.short}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="icon-btn icon-btn-sm"
        onClick={onCopyLink}
        title="Copy a link to this view"
        aria-label="Copy a link to this view"
      >
        <LinkIcon size={16} />
      </button>
    </div>
  );
}
