import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useCountUp } from '../hooks/useCountUp';

const stats = [
  { value: 500, suffix: 'M+', label: 'Ad Impressions Delivered' },
  { value: 12, suffix: 'x', label: 'Average ROAS' },
  { value: 200, suffix: '+', label: 'Brands Scaled' },
  { value: 98, suffix: '%', label: 'Client Retention' },
];

export default function StatsBar() {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <div ref={ref} className="relative max-w-7xl mx-auto section-padding w-full pb-12">
      <div className="glass-card p-8 lg:p-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} isVisible={isVisible} delay={i * 150} />
          ))}
        </div>
        <p className="text-xs text-white/20 mt-6 text-center">Platform performance data, 2026</p>
      </div>
    </div>
  );
}

function StatItem({
  stat,
  isVisible,
  delay,
}: {
  stat: { value: number; suffix: string; label: string };
  isVisible: boolean;
  delay: number;
}) {
  const count = useCountUp(stat.value, 2000, isVisible);

  return (
    <div
      className={`text-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-3xl lg:text-4xl font-extrabold tracking-tight">
        <span className="gradient-text">
          {count}
          {stat.suffix}
        </span>
      </p>
      <p className="text-sm text-white/40 mt-1.5 font-medium">{stat.label}</p>
    </div>
  );
}
