import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

const NUMERIC = /^(\D*)(\d+(?:\.\d+)?)(.*)$/;

function zeroed(value: string): string {
  const m = NUMERIC.exec(value);
  return m ? `${m[1]}0${m[3]}` : value;
}

/** Animates the number inside a label like "100K+" or "2.5+" from 0 once `start` is true. */
export function useCountUp(value: string, start: boolean, duration = 1400): string {
  const [display, setDisplay] = useState(() => zeroed(value));

  useEffect(() => {
    const m = NUMERIC.exec(value);
    if (!m || prefersReducedMotion()) {
      setDisplay(value);
      return;
    }
    if (!start) {
      setDisplay(zeroed(value));
      return;
    }
    const [, prefix, num, suffix] = m;
    const target = Number(num);
    const decimals = num.split('.')[1]?.length ?? 0;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(p === 1 ? value : `${prefix}${(target * eased).toFixed(decimals)}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, start, duration]);

  return display;
}
