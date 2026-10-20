import { useCallback, useState } from 'react';
import type { Focus } from '@/types/portfolio';

function readFocus(): Focus {
  const f = new URLSearchParams(window.location.search).get('focus');
  return f === 'backend' || f === 'ai' ? f : 'all';
}

/** The current audience view, mirrored to ?focus= so each view has a shareable URL. */
export function useFocus(): [Focus, (f: Focus) => void] {
  const [focus, setFocusState] = useState<Focus>(readFocus);

  const setFocus = useCallback((f: Focus) => {
    setFocusState(f);
    const url = new URL(window.location.href);
    if (f === 'all') url.searchParams.delete('focus');
    else url.searchParams.set('focus', f);
    window.history.replaceState(null, '', url);
  }, []);

  return [focus, setFocus];
}
