import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

interface State {
  index: number;
  length: number;
  deleting: boolean;
}

const START: State = { index: 0, length: 0, deleting: false };

/** Types each phrase, holds it, deletes it, then moves to the next. */
export function useTypewriter(words: readonly string[], { typeMs = 60, deleteMs = 30, holdMs = 1900 } = {}): string {
  const key = words.join('␟');
  const [state, setState] = useState<State>(START);
  const [reduced] = useState(prefersReducedMotion);

  useEffect(() => setState(START), [key]);

  useEffect(() => {
    if (reduced || words.length === 0) return;
    const word = words[state.index % words.length];
    const holding = !state.deleting && state.length >= word.length;
    const finished = state.deleting && state.length === 0;
    const delay = holding ? holdMs : finished ? 350 : state.deleting ? deleteMs : typeMs;

    const timer = window.setTimeout(() => {
      setState((s) => {
        if (holding) return { ...s, deleting: true };
        if (finished) return { index: (s.index + 1) % words.length, length: 0, deleting: false };
        return { ...s, length: s.length + (s.deleting ? -1 : 1) };
      });
    }, delay);
    return () => window.clearTimeout(timer);
    // `key` stands in for `words`, whose array identity changes on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, key, reduced, typeMs, deleteMs, holdMs]);

  if (words.length === 0) return '';
  if (reduced) return words[0];
  return words[state.index % words.length].slice(0, state.length);
}
