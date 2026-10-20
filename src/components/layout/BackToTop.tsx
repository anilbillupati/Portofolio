import './layout.css';
import { useScrolledPast } from '@/hooks/useScrolledPast';
import { ArrowUpIcon } from '@/components/ui/Icons';

export function BackToTop() {
  const visible = useScrolledPast(700);

  return (
    <a href="#about" className={`back-to-top${visible ? ' is-visible' : ''}`} aria-label="Back to top" tabIndex={visible ? 0 : -1}>
      <ArrowUpIcon size={18} />
    </a>
  );
}
