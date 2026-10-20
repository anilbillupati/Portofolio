import type { CSSProperties, ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in ms before the element animates in. */
  delay?: number;
  variant?: 'up' | 'left' | 'right' | 'zoom';
}

/** Fades its content in when it first scrolls into view. Children can hook into `.is-shown`. */
export function Reveal({ children, className = '', delay = 0, variant = 'up' }: RevealProps) {
  const [ref, shown] = useInView<HTMLDivElement>();
  const style: CSSProperties | undefined = delay ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <div ref={ref} className={`reveal reveal-${variant}${shown ? ' is-shown' : ''} ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
