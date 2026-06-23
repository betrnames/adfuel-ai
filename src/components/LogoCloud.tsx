import { useScrollAnimation } from '../hooks/useScrollAnimation';

const logos = [
  'TechCrunch',
  'Forbes',
  'Bloomberg',
  'Wired',
  'Fast Company',
  'Inc.',
];

export default function LogoCloud() {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section ref={ref} className="relative py-16 lg:py-20">
      <div className="max-w-7xl mx-auto section-padding">
        <p
          className={`text-center text-xs font-semibold text-white/30 uppercase tracking-[0.2em] mb-10 ${
            isVisible ? 'animate-fade-in' : 'opacity-0'
          }`}
        >
          Featured In
        </p>
        <div
          className={`flex flex-wrap items-center justify-center gap-x-12 gap-y-6 ${
            isVisible ? 'animate-fade-in' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.15s' }}
        >
          {logos.map((name) => (
            <span
              key={name}
              className="text-lg lg:text-xl font-bold text-white/15 tracking-tight select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
