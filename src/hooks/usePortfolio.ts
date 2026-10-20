import { useCallback, useEffect, useState } from 'react';
import { clearDraft, loadDraft, saveDraft } from '@/lib/storage';
import type { Portfolio } from '@/types/portfolio';

/**
 * Holds the portfolio being displayed. When editing is allowed, unsaved edits are kept as a
 * browser draft so a refresh doesn't lose them.
 */
export function usePortfolio(defaults: Portfolio, canEdit: boolean) {
  const [initialDraft] = useState(() => (canEdit ? loadDraft(defaults) : null));
  const [data, setData] = useState<Portfolio>(initialDraft ?? defaults);
  const [dirty, setDirty] = useState(initialDraft !== null);

  useEffect(() => {
    if (dirty) saveDraft(data);
  }, [data, dirty]);

  const update = useCallback((fn: (d: Portfolio) => Portfolio) => {
    setData(fn);
    setDirty(true);
  }, []);

  const discard = useCallback(() => {
    clearDraft();
    setData(defaults);
    setDirty(false);
  }, [defaults]);

  const markSaved = useCallback(() => {
    clearDraft();
    setDirty(false);
  }, []);

  return { data, dirty, update, discard, markSaved };
}
