import { Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Branding() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const brandColors = [
    { name: 'Primary Orange', hex: '#fb923c', rgb: 'rgb(251, 146, 60)' },
    { name: 'Dark Orange', hex: '#f97316', rgb: 'rgb(249, 115, 22)' },
    { name: 'Light Orange', hex: '#fdba74', rgb: 'rgb(253, 186, 116)' },
    { name: 'Background Dark', hex: '#0a0a0a', rgb: 'rgb(10, 10, 10)' },
    { name: 'Background Lighter', hex: '#141414', rgb: 'rgb(20, 20, 20)' },
  ];

  const copyToClipboard = (text: string, colorName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(colorName);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const downloadSVG = (variant: 'color' | 'white' | 'black', size: string) => {
    let strokeColor = '#fb923c';
    if (variant === 'white') strokeColor = '#ffffff';
    if (variant === 'black') strokeColor = '#000000';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
</svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flame-logo-${variant}-${size}px.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto section-padding">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Brand <span className="gradient-text">Assets</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl">
              Download our logo and brand assets for your use. Please follow our brand
              guidelines to maintain consistency.
            </p>
          </div>

          {/* Logo Showcase */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Logo Variations</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Color Version */}
              <div className="glass-card p-8">
                <div className="bg-dark-lighter rounded-lg p-8 mb-4 flex items-center justify-center min-h-48">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="96"
                    height="96"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fb923c"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Primary (Color)</h3>
                <p className="text-sm text-white/40 mb-4">
                  Use on dark backgrounds
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadSVG('color', '512')}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>

              {/* White Version */}
              <div className="glass-card p-8">
                <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg p-8 mb-4 flex items-center justify-center min-h-48">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="96"
                    height="96"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">White Version</h3>
                <p className="text-sm text-white/40 mb-4">
                  Use on colored backgrounds
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadSVG('white', '512')}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>

              {/* Black Version */}
              <div className="glass-card p-8">
                <div className="bg-white rounded-lg p-8 mb-4 flex items-center justify-center min-h-48">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="96"
                    height="96"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Black Version</h3>
                <p className="text-sm text-white/40 mb-4">
                  Use on light backgrounds
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadSVG('black', '512')}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Size Options */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Size Options</h2>
            <div className="glass-card p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['64', '128', '256', '512'].map((size) => (
                  <div key={size} className="text-center">
                    <div className="bg-dark-lighter rounded-lg p-4 mb-3 flex items-center justify-center aspect-square">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={size === '512' ? '80' : size === '256' ? '64' : size === '128' ? '48' : '32'}
                        height={size === '512' ? '80' : size === '256' ? '64' : size === '128' ? '48' : '32'}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fb923c"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold mb-2">{size}×{size}px</p>
                    <button
                      onClick={() => downloadSVG('color', size)}
                      className="btn-secondary w-full text-sm"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Brand Colors */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Brand Colors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brandColors.map((color) => (
                <div key={color.name} className="glass-card p-6">
                  <div
                    className="w-full h-32 rounded-lg mb-4"
                    style={{ backgroundColor: color.hex }}
                  />
                  <h3 className="font-semibold mb-3">{color.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/40">HEX</span>
                      <button
                        onClick={() => copyToClipboard(color.hex, `${color.name}-hex`)}
                        className="flex items-center gap-2 text-sm font-mono hover:text-brand-400 transition-colors"
                      >
                        {color.hex}
                        {copiedColor === `${color.name}-hex` ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/40">RGB</span>
                      <button
                        onClick={() => copyToClipboard(color.rgb, `${color.name}-rgb`)}
                        className="flex items-center gap-2 text-sm font-mono hover:text-brand-400 transition-colors"
                      >
                        {color.rgb}
                        {copiedColor === `${color.name}-rgb` ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Guidelines */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Usage Guidelines</h2>
            <div className="glass-card p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Clear Space</h3>
                  <p className="text-white/40">
                    Maintain a minimum clear space around the logo equal to the height of
                    the flame icon to ensure visibility and impact.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Minimum Size</h3>
                  <p className="text-white/40">
                    The logo should never be displayed smaller than 24px in height to
                    maintain legibility and visual impact.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Color Usage</h3>
                  <p className="text-white/40">
                    Use the primary orange version on dark backgrounds, white version on
                    colored or image backgrounds, and black version on light backgrounds.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Don'ts</h3>
                  <ul className="list-disc list-inside text-white/40 space-y-1">
                    <li>Don't change the logo colors</li>
                    <li>Don't rotate or distort the logo</li>
                    <li>Don't add effects like shadows or glows</li>
                    <li>Don't place the logo on busy backgrounds</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
