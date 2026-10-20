import { useState } from 'react';
import type { Focus, WorkBlock } from '@/types/portfolio';
import { stagger } from '@/lib/motion';
import { matchesFocus, trackClass } from '@/lib/tracks';
import { ChevronDownIcon } from '@/components/ui/Icons';
import { Rich } from '@/components/ui/Rich';

const COLLAPSED_COUNT = 5;

export function WorkBlockList({ block, focus }: { block: WorkBlock; focus: Focus }) {
  const [expanded, setExpanded] = useState(false);
  const visible = block.bullets.filter((b) => matchesFocus(b.tracks, focus));
  const shown = expanded ? visible : visible.slice(0, COLLAPSED_COUNT);
  const hiddenCount = visible.length - shown.length;
  const listId = `bullets-${block.name.replace(/\W+/g, '-').toLowerCase()}`;

  return (
    <div className="work-block">
      <h4>
        {block.name}
        <span className="count">{visible.length} highlights</span>
      </h4>
      <ul id={listId} className="bullets">
        {shown.map((b, i) => (
          <li key={b.text} className={trackClass(b.tracks)} style={stagger(i)}>
            <Rich text={b.text} />
          </li>
        ))}
      </ul>
      {visible.length > COLLAPSED_COUNT && (
        <button type="button" className="link-btn" onClick={() => setExpanded((e) => !e)} aria-expanded={expanded} aria-controls={listId}>
          {expanded ? 'Show less' : `Show ${hiddenCount} more`}
          <ChevronDownIcon size={16} className={`chevron${expanded ? ' is-flipped' : ''}`} />
        </button>
      )}
    </div>
  );
}
