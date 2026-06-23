import { Check, ArrowRight, Zap } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const plans = [
  {
    name: 'Starter',
    price: '2,500',
    period: '/month',
    description: 'Perfect for startups ready to scale their first campaigns.',
    features: [
      'Up to $25K monthly ad spend management',
      '2 advertising channels',
      'Bi-weekly performance reports',
      'Basic AI optimization',
      'Creative consultation',
      'Dedicated account manager',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Growth',
    price: '5,500',
    period: '/month',
    description: 'For growing brands that need comprehensive campaign management.',
    features: [
      'Up to $100K monthly ad spend management',
      '4 advertising channels',
      'Weekly performance reports',
      'Advanced AI optimization',
      'Full creative production',
      'Conversion rate optimization',
      'Custom analytics dashboard',
      'Priority support',
    ],
    cta: 'Start Growing',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For established brands with complex, multi-channel needs.',
    features: [
      'Unlimited ad spend management',
      'All advertising channels',
      'Real-time reporting',
      'Proprietary AI models',
      'Dedicated creative team',
      'Full-funnel optimization',
      'Executive strategy sessions',
      'White-glove onboarding',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function Pricing() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();

  return (
    <section id="pricing" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/3 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto section-padding">
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <p
            className={`text-sm font-semibold text-brand-400 uppercase tracking-wider mb-4 ${
              headerVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            Pricing
          </p>
          <h2
            className={`text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 ${
              headerVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.1s' }}
          >
            Invest in <span className="gradient-text">real growth</span>
          </h2>
          <p
            className={`text-lg text-white/50 leading-relaxed ${
              headerVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.2s' }}
          >
            Transparent pricing with no hidden fees. Every plan includes our AI-powered
            optimization engine.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  plan,
  index,
}: {
  plan: (typeof plans)[number];
  index: number;
}) {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`relative ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-500 rounded-full text-xs font-bold shadow-lg shadow-brand-500/30">
            <Zap className="w-3.5 h-3.5" />
            Most Popular
          </div>
        </div>
      )}

      <div
        className={`h-full p-8 rounded-2xl border transition-all duration-500 ${
          plan.popular
            ? 'bg-white/[0.07] border-brand-500/30 shadow-xl shadow-brand-500/5'
            : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-white/15'
        }`}
      >
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
          <p className="text-sm text-white/40 mb-6">{plan.description}</p>
          <div className="flex items-baseline gap-1">
            {plan.price !== 'Custom' && (
              <span className="text-white/40 text-lg">$</span>
            )}
            <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
            {plan.period && (
              <span className="text-white/40 text-sm">{plan.period}</span>
            )}
          </div>
        </div>

        <a
          href="#contact"
          className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 mb-8 ${
            plan.popular
              ? 'bg-brand-500 text-white hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/25'
              : 'bg-white/10 text-white border border-white/10 hover:bg-white/15 hover:border-white/20'
          }`}
        >
          {plan.cta}
          <ArrowRight className="w-4 h-4" />
        </a>

        <ul className="space-y-3.5">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                plan.popular ? 'bg-brand-500/20' : 'bg-white/10'
              }`}>
                <Check className={`w-3 h-3 ${plan.popular ? 'text-brand-400' : 'text-white/60'}`} />
              </div>
              <span className="text-sm text-white/60">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
