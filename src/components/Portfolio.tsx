import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const projects = [
  {
    title: 'E-Commerce Revenue Explosion',
    client: 'LuxeWear',
    category: 'Performance Marketing',
    metric: '+340%',
    metricLabel: 'Revenue Growth',
    description: 'Scaled a DTC fashion brand from $2M to $8.8M annual revenue through AI-optimized Meta and Google campaigns.',
    tags: ['Meta Ads', 'Google Shopping', 'Creative Testing'],
    accent: 'from-brand-500/20 to-brand-600/5',
  },
  {
    title: 'SaaS Lead Generation Machine',
    client: 'CloudSync',
    category: 'B2B Marketing',
    metric: '-62%',
    metricLabel: 'Cost Per Lead',
    description: 'Built a multi-channel acquisition funnel that reduced CPL by 62% while tripling qualified lead volume.',
    tags: ['LinkedIn Ads', 'Content Marketing', 'Landing Pages'],
    accent: 'from-emerald-500/20 to-emerald-600/5',
  },
  {
    title: 'App Install Campaign at Scale',
    client: 'FitPulse',
    category: 'Mobile Marketing',
    metric: '2.4M',
    metricLabel: 'App Installs',
    description: 'Drove 2.4 million app installs across iOS and Android with a blended CPI of $0.87 using TikTok and programmatic.',
    tags: ['TikTok Ads', 'Programmatic', 'ASO'],
    accent: 'from-sky-500/20 to-sky-600/5',
  },
];

export default function Portfolio() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();

  return (
    <section id="work" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto section-padding">
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 lg:mb-20">
          <div className="max-w-2xl">
            <p
              className={`text-sm font-semibold text-brand-400 uppercase tracking-wider mb-4 ${
                headerVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
            >
              Case Studies
            </p>
            <h2
              className={`text-4xl lg:text-5xl font-extrabold tracking-tight ${
                headerVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.1s' }}
            >
              Results that{' '}
              <span className="gradient-text">speak volumes</span>
            </h2>
          </div>
          <a
            href="#contact"
            className={`btn-secondary text-sm w-fit ${
              headerVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.2s' }}
          >
            View All Work
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`group glass-card-hover relative overflow-hidden ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${project.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative p-8">
        <div className="flex items-center justify-between mb-6">
          <span className="px-3 py-1 text-xs font-semibold bg-white/10 backdrop-blur-md rounded-full border border-white/10">
            {project.category}
          </span>
          <p className="text-xs text-white/40 font-medium">{project.client}</p>
        </div>

        <div className="flex items-baseline gap-3 mb-5">
          <TrendingUp className="w-5 h-5 text-brand-400 shrink-0 translate-y-0.5" />
          <span className="text-4xl font-extrabold text-brand-400">{project.metric}</span>
          <span className="text-sm text-white/50">{project.metricLabel}</span>
        </div>

        <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-white/40 leading-relaxed mb-6">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-xs font-medium text-white/50 bg-white/5 rounded-lg border border-white/5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
