import type { CSSProperties } from 'react';

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Sets the --i custom property used by staggered CSS animations. */
export function stagger(i: number): CSSProperties {
  return { '--i': i } as CSSProperties;
}
