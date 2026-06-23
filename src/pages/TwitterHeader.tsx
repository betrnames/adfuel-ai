import { ArrowRight } from 'lucide-react';

export default function TwitterHeader() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-8">
      <div className="text-center">
        <p className="text-white/60 mb-4">
          Twitter Header: 1500×500px - Right-click and save the box below
        </p>

        {/* Twitter Header Container - Exact dimensions */}
        <div
          className="relative overflow-hidden"
          style={{
            width: '1500px',
            height: '500px',
            maxWidth: '100%',
          }}
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700" />

          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-brand-400/30 via-transparent to-transparent opacity-50 animate-pulse" />

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center px-16 text-center">
            {/* Heading */}
            <h1 className="text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Stop burning ad budget.
              <br />
              Start fueling growth.
            </h1>

            {/* Subheading */}
            <p className="text-xl text-white/60 mb-8 max-w-3xl">
              Book a free strategy call and discover how AI-powered advertising can
              transform your business in 90 days.
            </p>

            {/* CTA Button */}
            <div className="flex items-center gap-6">
              <button className="px-8 py-4 bg-dark text-white font-semibold rounded-full hover:bg-dark/80 transition-all duration-300 flex items-center gap-3 text-lg shadow-xl">
                Book Free Strategy Call
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2 text-white/60 text-sm">
          <p>To save as image:</p>
          <ul className="space-y-1">
            <li>• Right-click on the header box and select "Save image as..."</li>
            <li>• Or use a screenshot tool to capture just the 1500×500px box</li>
            <li>• Recommended: Use browser zoom to fit the full width on your screen</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
