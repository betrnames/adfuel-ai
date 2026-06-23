import { useMemo } from 'react';

interface Ember {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  drift: number;
}

interface FlameEmberProps {
  count?: number;
  className?: string;
}

export default function FlameEmber({ count = 8, className = '' }: FlameEmberProps) {
  const embers = useMemo<Ember[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: 10 + Math.random() * 80,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 6,
        duration: 3 + Math.random() * 5,
        opacity: 0.3 + Math.random() * 0.5,
        drift: -40 + Math.random() * 80,
      })),
    [count]
  );

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {embers.map((e) => (
        <div
          key={e.id}
          className="absolute ember-rise"
          style={{
            left: `${e.left}%`,
            bottom: '0%',
            animationDelay: `${e.delay}s`,
            animationDuration: `${e.duration}s`,
            '--ember-drift': `${e.drift}px`,
          } as React.CSSProperties}
        >
          <div
            className="rounded-full ember-glow"
            style={{
              width: `${e.size}px`,
              height: `${e.size}px`,
              backgroundColor: `rgba(251, 138, 60, ${e.opacity})`,
              boxShadow: `0 0 ${e.size * 2}px rgba(249, 115, 22, ${e.opacity * 0.6}), 0 0 ${e.size * 4}px rgba(249, 115, 22, ${e.opacity * 0.3})`,
              animationDuration: `${0.8 + Math.random() * 1.2}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
