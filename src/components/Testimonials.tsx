import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const testimonials = [
  {
    quote:
      "AdFuel transformed our entire digital strategy. Their AI-driven approach to campaign optimization delivered results we didn't think were possible. Our ROAS went from 2x to 14x in just three months.",
    name: 'Sarah Chen',
    role: 'VP of Marketing',
    company: 'LuxeWear',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
    metric: '14x ROAS',
  },
  {
    quote:
      "Working with AdFuel felt like having an in-house team of 20 experts. Their creative testing velocity is unmatched -- they produced and tested over 200 ad variations in our first month alone.",
    name: 'Marcus Johnson',
    role: 'CEO',
    company: 'FitPulse',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
    metric: '2.4M installs',
  },
  {
    quote:
      "The data and insights we get from AdFuel's platform are game-changing. We can see exactly where every dollar goes and how it performs. It's the transparency every CMO dreams of.",
    name: 'Emily Rodriguez',
    role: 'CMO',
    company: 'CloudSync',
    avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
    metric: '-62% CPL',
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: cardRef, isVisible: cardVisible } = useScrollAnimation(0.1);

  const next = () => setActive((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const current = testimonials[active];

  return (
    <section id="testimonials" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto section-padding">
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <p
            className={`text-sm font-semibold text-brand-400 uppercase tracking-wider mb-4 ${
              headerVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            Testimonials
          </p>
          <h2
            className={`text-4xl lg:text-5xl font-extrabold tracking-tight ${
              headerVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.1s' }}
          >
            Loved by <span className="gradient-text">industry leaders</span>
          </h2>
        </div>

        <div ref={cardRef} className={`max-w-4xl mx-auto ${cardVisible ? 'animate-scale-in' : 'opacity-0'}`}>
          <div className="glass-card p-8 lg:p-12 relative">
            <Quote className="absolute top-8 right-8 w-12 h-12 text-brand-500/10" />

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    src={current.avatar}
                    alt={current.name}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  <div className="absolute -bottom-2 -right-2 px-2.5 py-1 bg-brand-500 rounded-lg text-xs font-bold">
                    {current.metric}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-lg lg:text-xl text-white/80 leading-relaxed mb-8 font-light">
                  "{current.quote}"
                </p>

                <div>
                  <p className="font-semibold text-white">{current.name}</p>
                  <p className="text-sm text-white/40">
                    {current.role}, {current.company}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-10 pt-8 border-t border-white/5">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === active
                        ? 'w-8 bg-brand-500'
                        : 'bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
