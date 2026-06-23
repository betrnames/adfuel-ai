import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
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

        <h1 className="text-4xl lg:text-5xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-white/60 text-lg mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              By accessing and using AdFuel.ai's services, you agree to be bound by these Terms of Service
              and all applicable laws and regulations. If you do not agree with any of these terms, you
              are prohibited from using or accessing our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Use License</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Permission is granted to temporarily access our services for personal or commercial use.
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose without authorization</li>
              <li>Attempt to decompile or reverse engineer any software</li>
              <li>Remove any copyright or proprietary notations</li>
              <li>Transfer the materials to another person or entity</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Service Description</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              AdFuel.ai provides AI-powered advertising and marketing services. We reserve the right to
              modify, suspend, or discontinue any aspect of our services at any time without notice.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. User Responsibilities</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Use our services in compliance with all applicable laws</li>
              <li>Not engage in any activity that disrupts our services</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Payment Terms</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              All fees are quoted in USD and are non-refundable unless otherwise stated. You agree to
              pay all charges incurred under your account. We reserve the right to change our fees
              with 30 days' notice.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Intellectual Property</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              All content, features, and functionality of our services are owned by AdFuel.ai and are
              protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Limitation of Liability</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              AdFuel.ai shall not be liable for any indirect, incidental, special, consequential, or
              punitive damages resulting from your use or inability to use our services. Our total
              liability shall not exceed the amount paid by you in the past 12 months.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Termination</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We may terminate or suspend your access to our services immediately, without prior notice
              or liability, for any reason, including breach of these Terms of Service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Governing Law</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              These terms shall be governed by and construed in accordance with the laws of the
              jurisdiction in which AdFuel.ai operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">10. Contact Information</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us at:
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
