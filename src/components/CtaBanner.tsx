import { ArrowRight, Flame } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import FlameParticles from './FlameParticles';
import FlameEmber from './FlameEmber';

export default function CtaBanner() {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto section-padding">
        <div
          ref={ref}
          className={`relative overflow-hidden rounded-3xl ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-accent-600" />

          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"
                style={{
                  left: `${15 + i * 20}%`,
                  height: '200%',
                  transform: 'rotate(15deg)',
                  top: '-50%',
                }}
              />
            ))}
          </div>

          <FlameParticles count={8} intensity="medium" />
          <FlameEmber count={6} />

          <div className="relative px-8 py-16 lg:px-16 lg:py-20 text-center">
            <div className="flex items-center justify-center mx-auto mb-8">
              <Flame className="w-10 h-10 text-white flame-sway drop-shadow-lg" />
            </div>

            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white mb-6 max-w-3xl mx-auto leading-tight">
              Stop burning ad budget.
              <br />
              Start fueling growth.
            </h2>

            <p className="text-lg text-white/80 max-w-xl mx-auto mb-10 leading-relaxed">
              Book a free strategy call and discover how AI-powered advertising can
              transform your business in 90 days.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy-900 font-bold rounded-xl transition-all duration-300 hover:bg-white/90 hover:shadow-xl hover:shadow-black/20 active:scale-[0.98]"
              >
                Book Free Strategy Call
                <ArrowRight className="w-5 h-5" />
              </a>
              <p className="text-sm text-white/60">No commitment required</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
