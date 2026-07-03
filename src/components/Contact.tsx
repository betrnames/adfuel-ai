import { useState } from 'react';
import { Send, CheckCircle2, Loader2, Mail, MapPin, Phone } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function Contact() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation(0.1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('https://formspree.io/f/mwvdpgay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          budget: formData.budget,
          message: formData.message,
          site: 'adfuel.ai',
          form: 'contact',
        }),
      });
      if (!res.ok) throw new Error(`Formspree ${res.status}`);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setStatus('success');
    setFormData({ name: '', email: '', company: '', budget: '', message: '' });
    setTimeout(() => setStatus('idle'), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto section-padding">
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <p
            className={`text-sm font-semibold text-brand-400 uppercase tracking-wider mb-4 ${
              headerVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            Get In Touch
          </p>
          <h2
            className={`text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 ${
              headerVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.1s' }}
          >
            Ready to <span className="gradient-text">fuel your growth</span>?
          </h2>
          <p
            className={`text-lg text-white/50 leading-relaxed ${
              headerVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.2s' }}
          >
            Tell us about your goals and we'll craft a custom strategy to get you there.
            No commitments, just a conversation.
          </p>
        </div>

        <div
          ref={formRef}
          className={`grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 ${
            formVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.15s' }}
        >
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Email Us</p>
                  <p className="text-sm text-white/40">hello@adfuel.ai</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-accent-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Call Us</p>
                  <p className="text-sm text-white/40">+1 (209) 996-7102</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Visit Us</p>
                  <p className="text-sm text-white/40">San Francisco, CA</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <p className="text-sm text-white/60 leading-relaxed">
                Average response time: <span className="text-brand-400 font-semibold">under 2 hours</span>
              </p>
              <p className="text-sm text-white/40 mt-2">
                We respond to every inquiry personally. No bots, no templates.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="glass-card p-8 lg:p-10">
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-white/50 max-w-sm">
                    Thanks for reaching out. We'll get back to you within 2 hours with a
                    customized strategy proposal.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white/60 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all duration-300"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all duration-300"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-white/60 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all duration-300"
                        placeholder="Acme Inc."
                      />
                    </div>
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-white/60 mb-2">
                        Monthly Budget
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all duration-300 appearance-none"
                      >
                        <option value="" className="bg-navy-900">Select budget range</option>
                        <option value="< $10K" className="bg-navy-900">Less than $10K</option>
                        <option value="$10K - $25K" className="bg-navy-900">$10K - $25K</option>
                        <option value="$25K - $50K" className="bg-navy-900">$25K - $50K</option>
                        <option value="$50K - $100K" className="bg-navy-900">$50K - $100K</option>
                        <option value="$100K+" className="bg-navy-900">$100K+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white/60 mb-2">
                      Tell Us About Your Goals
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all duration-300 resize-none"
                      placeholder="What are you looking to achieve? Any specific channels or goals in mind?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary w-full justify-center text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : status === 'error' ? (
                      'Something went wrong. Try again.'
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
