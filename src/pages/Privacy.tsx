import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto section-padding py-16 lg:py-24">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <h1 className="text-4xl lg:text-5xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-white/60 text-lg mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Information We Collect</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We collect information you provide directly to us, including when you create an account,
              submit inquiries through our contact form, or interact with our services. This may include
              your name, email address, company information, and any other details you choose to provide.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. How We Use Your Information</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and complete transactions</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Develop new products and services</li>
              <li>Analyze usage patterns and optimize user experience</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Information Sharing</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li>Service providers who assist in our operations</li>
              <li>Professional advisors such as lawyers and accountants</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Security</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction. However,
              no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Your Rights</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li>Access and receive a copy of your personal data</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to or restrict certain processing</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Cookies and Tracking</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to collect information about your browsing
              activities. For more details, please see our <Link to="/cookies" className="text-brand-400 hover:text-brand-300">Cookie Policy</Link>.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Contact Us</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-white/70 leading-relaxed">
              Email: <a href="mailto:hello@adfuel.ai" className="text-brand-400 hover:text-brand-300">hello@adfuel.ai</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
