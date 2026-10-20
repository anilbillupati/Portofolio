import { useEffect, useState } from 'react';

/**
 * Checks which PDFs actually exist so a missing resume never renders a broken download.
 * The dev server answers unknown paths with index.html, hence the content-type check.
 */
export function useAvailableFiles(hrefs: string[]): Record<string, boolean> {
  const [available, setAvailable] = useState<Record<string, boolean>>({});
  const key = hrefs.join('|');

  useEffect(() => {
    let alive = true;
    for (const href of key ? key.split('|') : []) {
      fetch(href, { method: 'HEAD' })
        .then((r) => r.ok && (r.headers.get('content-type') ?? '').includes('pdf'))
        .catch(() => false)
        .then((ok) => {
          if (alive) setAvailable((a) => ({ ...a, [href]: ok }));
        });
    }
    return () => {
      alive = false;
    };
  }, [key]);

  return available;
}
