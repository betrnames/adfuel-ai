import { useMemo } from 'react';

interface FlameParticle {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  drift: number;
}

interface FlameParticlesProps {
  count?: number;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'intense';
}

export default function FlameParticles({
  count = 12,
  className = '',
  intensity = 'subtle',
}: FlameParticlesProps) {
  const opacityMap = { subtle: 0.12, medium: 0.2, intense: 0.35 };
  const baseOpacity = opacityMap[intensity];

  const particles = useMemo<FlameParticle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 6 + Math.random() * 18,
        delay: Math.random() * 8,
        duration: 4 + Math.random() * 6,
        opacity: baseOpacity * (0.4 + Math.random() * 0.6),
        drift: -30 + Math.random() * 60,
      })),
    [count, baseOpacity]
  );

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute flame-particle"
          style={{
            left: `${p.left}%`,
            bottom: '-5%',
            width: `${p.size}px`,
            height: `${p.size * 1.4}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--flame-drift': `${p.drift}px`,
            '--flame-opacity': p.opacity,
          } as React.CSSProperties}
        >
          <div
            className="w-full h-full rounded-[50%_50%_50%_50%/60%_60%_40%_40%] flame-flicker"
            style={{
              background: `radial-gradient(ellipse at 50% 60%, rgba(251, 138, 60, ${p.opacity}), rgba(249, 115, 22, ${p.opacity * 0.6}), transparent)`,
              animationDelay: `${p.delay * 0.7}s`,
              animationDuration: `${1.5 + Math.random() * 2}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
