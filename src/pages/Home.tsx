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
      <Hero />
      <LogoCloud />
      <Services />
      <Portfolio />
      <Testimonials />
      <Pricing />
      <CtaBanner />
      <Contact />
      <Footer />
    </div>
  );
}
