import { Flame, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = {
  Services: [
    { label: 'Performance Marketing', href: '#services' },
    { label: 'Creative Strategy', href: '#services' },
    { label: 'AI Analytics', href: '#services' },
    { label: 'Brand Development', href: '#services' },
  ],
  Company: [
    { label: 'About Us', href: '#' },
    { label: 'Case Studies', href: '#work' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Help Center', href: '#' },
    { label: 'llms.txt', href: '/llms.txt' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      <div className="max-w-7xl mx-auto section-padding py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <a href="#" className="inline-flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <Flame className="w-5 h-5 text-brand-400" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                AdFuel<span className="text-brand-400">.ai</span>
              </span>
            </a>
            <p className="text-white/50 leading-relaxed max-w-sm mb-8">
              AI-powered advertising that drives real results. We combine machine learning
              with creative excellence to fuel your growth.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-brand-400 font-semibold hover:text-brand-300 transition-colors group"
            >
              Start a project
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://x.com/adfuelai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group"
                aria-label="Follow us on X"
              >
                <svg
                  className="w-4 h-4 text-white/60 group-hover:text-white transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-5">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className="text-sm text-white/40 hover:text-white/80 transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-white/40 hover:text-white/80 transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} AdFuel.ai. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-sm text-white/30 hover:text-white/60 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-white/30 hover:text-white/60 transition-colors">
              Terms
            </Link>
            <Link to="/cookies" className="text-sm text-white/30 hover:text-white/60 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
