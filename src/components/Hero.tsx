import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import StatsBar from './StatsBar';
import FlameParticles from './FlameParticles';
import FlameEmber from './FlameEmber';

export default function Hero() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-500/6 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
      </div>

      <FlameParticles count={14} intensity="subtle" />
      <FlameEmber count={10} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-white/5 to-transparent"
            style={{
              left: `${25 + i * 25}%`,
              height: '100%',
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto section-padding pt-32 pb-12 lg:pt-40 lg:pb-16">
        <div className="max-w-4xl">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-8 ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-medium text-brand-300">AI-Powered Advertising Platform</span>
          </div>

          <h1
            className={`text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-[1.05] tracking-tight mb-8 ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.15s' }}
          >
            Ads that{' '}
            <span className="relative inline-block">
              <span className="gradient-text">ignite</span>
              <span className="absolute -inset-x-4 -inset-y-2 bg-brand-500/10 rounded-2xl blur-xl animate-pulse-glow -z-10" />
            </span>
            <br />
            growth.
          </h1>

          <p
            className={`text-lg sm:text-xl text-white/50 leading-relaxed max-w-2xl mb-12 ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.3s' }}
          >
            We combine cutting-edge AI with bold creative strategy to build advertising
            campaigns that don't just perform -- they dominate. From strategy to execution,
            we fuel your brand's next chapter.
          </p>

          <div
            className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.45s' }}
          >
            <a href="#contact" className="btn-primary text-base">
              Launch Your Campaign
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#work" className="btn-secondary text-base">
              <Play className="w-4 h-4" />
              See Our Work
            </a>
          </div>
        </div>

        <div
          className={`mt-20 lg:mt-24 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{ animationDelay: '0.6s' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex -space-x-3">
              {['https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop', 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop'].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-10 h-10 rounded-full border-2 border-navy-950 object-cover"
                />
              ))}
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">Trusted by 200+ brands</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-brand-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs text-white/40 ml-1">4.9/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StatsBar />
    </section>
  );
}
