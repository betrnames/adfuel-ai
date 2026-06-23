import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cookies() {
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

        <h1 className="text-4xl lg:text-5xl font-bold mb-8">Cookie Policy</h1>

        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-white/60 text-lg mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. What Are Cookies</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Cookies are small text files that are placed on your device when you visit our website.
              They help us provide you with a better experience by remembering your preferences and
              understanding how you use our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Types of Cookies We Use</h2>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-white/90">Essential Cookies</h3>
              <p className="text-white/70 leading-relaxed mb-4">
                These cookies are necessary for the website to function properly. They enable core
                functionality such as security, network management, and accessibility.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-white/90">Analytics Cookies</h3>
              <p className="text-white/70 leading-relaxed mb-4">
                These cookies help us understand how visitors interact with our website by collecting
                and reporting information anonymously. This helps us improve our services and user experience.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-white/90">Functionality Cookies</h3>
              <p className="text-white/70 leading-relaxed mb-4">
                These cookies allow our website to remember choices you make and provide enhanced,
                personalized features. They may also be used to provide services you've requested.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-white/90">Marketing Cookies</h3>
              <p className="text-white/70 leading-relaxed mb-4">
                These cookies track your online activity to help advertisers deliver more relevant
                advertising or to limit how many times you see an ad. We may share this information
                with other parties.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. How We Use Cookies</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We use cookies to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li>Keep you signed in to your account</li>
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our services</li>
              <li>Improve our website performance</li>
              <li>Deliver relevant content and advertisements</li>
              <li>Analyze site traffic and user behavior</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Third-Party Cookies</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We may use third-party service providers who are allowed to place cookies on our website.
              These providers include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li>Analytics providers (e.g., Google Analytics)</li>
              <li>Advertising networks</li>
              <li>Social media platforms</li>
              <li>Payment processors</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Managing Cookies</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              You can control and manage cookies in several ways:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li>Most browsers allow you to refuse or accept cookies</li>
              <li>You can delete cookies already stored on your device</li>
              <li>You can set your browser to notify you when cookies are sent</li>
              <li>Browser settings vary, so please check your browser's help menu</li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              Please note that blocking or deleting cookies may impact your experience and some
              features may not function properly.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Cookie Duration</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Cookies may be session cookies (temporary, deleted when you close your browser) or
              persistent cookies (remain on your device for a set period or until you delete them).
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Updates to This Policy</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We may update this Cookie Policy from time to time to reflect changes in our practices
              or for operational, legal, or regulatory reasons. Please check this page periodically
              for updates.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Contact Us</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              If you have any questions about our use of cookies, please contact us at:
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
