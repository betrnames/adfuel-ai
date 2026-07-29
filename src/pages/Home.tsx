import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import LogoCloud from '../components/LogoCloud';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import CtaBanner from '../components/CtaBanner';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-navy-950 text-white overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <LogoCloud />
        <Services />
        <Portfolio />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CtaBanner />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

const faqItems = [
  {
    q: 'What does AdFuel.ai do?',
    a: 'AdFuel.ai is an AI-powered advertising agency that builds and manages ad campaigns across Google, Meta, TikTok, and LinkedIn. We combine machine learning with creative strategy to optimize targeting, bidding, and creative performance.',
  },
  {
    q: 'What platforms do you manage campaigns on?',
    a: 'We manage campaigns across Google Ads, Meta (Facebook & Instagram), TikTok Ads, LinkedIn Ads, and programmatic display networks. Our AI optimizes across all platforms simultaneously.',
  },
  {
    q: 'How does AI improve ad performance?',
    a: 'AI analyzes thousands of data points in real time — audience behavior, creative engagement, bid landscape, and conversion patterns — to make optimization decisions faster and more accurately than manual management.',
  },
  {
    q: 'How much does it cost?',
    a: 'Pricing varies by ad spend and scope. We offer Starter, Growth, and Enterprise tiers. Contact us for a custom quote based on your goals and budget.',
  },
  {
    q: 'How do I get started?',
    a: 'Reach out through our contact form or email. We start with a free audit of your current ad performance, then build a custom strategy.',
  },
];

function FAQ() {
  return (
    <section id="faq" className="section-padding py-24 lg:py-32">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqItems.map((item) => (
            <div key={item.q} className="glass-card p-6 lg:p-8">
              <h3 className="text-lg font-semibold text-white mb-3">{item.q}</h3>
              <p className="text-white/50 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
