import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';
import { stagger } from '@/lib/motion';

interface StatCardProps {
  value: string;
  label: string;
  index: number;
}

export function StatCard({ value, label, index }: StatCardProps) {
  const [ref, inView] = useInView<HTMLDivElement>('0px');
  const display = useCountUp(value, inView);

  return (
    <div ref={ref} className={`stat spotlight${inView ? ' is-shown' : ''}`} style={stagger(index)}>
      <div className="stat-value" aria-label={value}>
        <span aria-hidden="true">{display}</span>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
