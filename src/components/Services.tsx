import {
  BarChart3,
  Palette,
  Brain,
  Target,
  Megaphone,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const services = [
  {
    icon: Target,
    title: 'Performance Marketing',
    description:
      'Data-driven campaigns across Google, Meta, TikTok, and programmatic channels. We optimize every dollar for maximum conversions.',
    features: ['Paid Search & Shopping', 'Social Advertising', 'Programmatic Display'],
    accent: 'from-brand-400 to-brand-600',
  },
  {
    icon: Palette,
    title: 'Creative Strategy',
    description:
      'Scroll-stopping creative that converts. Our AI-assisted design process produces hundreds of ad variations tested in real time.',
    features: ['Ad Creative Design', 'Video Production', 'A/B Testing at Scale'],
    accent: 'from-accent-400 to-accent-600',
  },
  {
    icon: Brain,
    title: 'AI Analytics & Insights',
    description:
      'Proprietary machine learning models that predict performance, identify opportunities, and automate optimization decisions.',
    features: ['Predictive Analytics', 'Attribution Modeling', 'Audience Intelligence'],
    accent: 'from-emerald-400 to-emerald-600',
  },
  {
    icon: Megaphone,
    title: 'Brand Development',
    description:
      'Build a brand that resonates. From positioning to visual identity, we craft brands that stand out in crowded markets.',
    features: ['Brand Strategy', 'Visual Identity', 'Brand Guidelines'],
    accent: 'from-sky-400 to-sky-600',
  },
  {
    icon: BarChart3,
    title: 'Conversion Optimization',
    description:
      'Turn more visitors into customers with data-backed landing pages, funnel optimization, and UX improvements.',
    features: ['Landing Page Design', 'Funnel Analysis', 'Heatmap Testing'],
    accent: 'from-rose-400 to-rose-600',
  },
  {
    icon: TrendingUp,
    title: 'Growth Consulting',
    description:
      'Strategic guidance for scaling your business. We build custom growth roadmaps backed by competitive analysis and market data.',
    features: ['Market Research', 'Growth Roadmaps', 'Competitive Analysis'],
    accent: 'from-amber-400 to-amber-600',
  },
];

export default function Services() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();

  return (
    <section id="services" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto section-padding">
        <div ref={headerRef} className="max-w-2xl mb-16 lg:mb-20">
          <p
            className={`text-sm font-semibold text-brand-400 uppercase tracking-wider mb-4 ${
              headerVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            What We Do
          </p>
          <h2
            className={`text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 ${
              headerVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.1s' }}
          >
            Full-stack advertising,{' '}
            <span className="gradient-text">powered by AI</span>
          </h2>
          <p
            className={`text-lg text-white/50 leading-relaxed ${
              headerVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.2s' }}
          >
            We handle every aspect of your advertising -- from strategy and creative to
            execution and optimization. One team, one vision, maximum impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[number];
  index: number;
}) {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const Icon = service.icon;

  return (
    <div
      ref={ref}
      className={`group glass-card-hover p-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.accent} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">
        {service.title}
      </h3>

      <p className="text-white/40 leading-relaxed text-sm mb-6">
        {service.description}
      </p>

      <ul className="space-y-2 mb-6">
        {service.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-white/60">
            <div className="w-1 h-1 rounded-full bg-brand-400" />
            {feature}
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
      >
        Learn more
        <ArrowUpRight className="w-4 h-4" />
      </a>
    </div>
  );
}
