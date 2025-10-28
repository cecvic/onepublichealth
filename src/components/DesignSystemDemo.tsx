/**
 * Design System Demo Component
 *
 * This component demonstrates the One Public Health design system
 * based on the logo analysis. Use it as a reference for building
 * consistent UI components.
 */

import { Heart, Globe, Users, CheckCircle, AlertCircle } from 'lucide-react';

export const DesignSystemDemo = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Brand Gradient */}
      <section className="py-4xl gradient-brand text-white">
        <div className="container-brand">
          <h1 className="text-display font-extrabold leading-tight mb-lg">
            Design System Demo
          </h1>
          <p className="text-body-lg leading-relaxed mb-xl max-w-2xl">
            This page demonstrates the comprehensive design system built from the One Public Health logo.
            Explore colors, typography, components, and spacing.
          </p>
          <div className="flex gap-md flex-wrap">
            <button className="btn-primary bg-white text-brand-green hover:bg-neutral-50">
              Primary Action
            </button>
            <button className="bg-transparent text-white border-2 border-white px-6 py-3 rounded-sm font-semibold hover:bg-white/10 transition-base">
              Secondary Action
            </button>
          </div>
        </div>
      </section>

      {/* Color Palette */}
      <section className="py-3xl">
        <div className="container-brand">
          <h2 className="text-h2 font-bold mb-2xl">Color Palette</h2>

          <div className="mb-xl">
            <h3 className="text-h3 font-semibold mb-lg">Brand Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
              <div>
                <div className="bg-brand-green h-24 rounded-md mb-2 shadow-card"></div>
                <p className="text-body-sm font-medium">Brand Green</p>
                <p className="text-caption text-neutral-400">#2DB67D</p>
              </div>
              <div>
                <div className="bg-brand-green-light h-24 rounded-md mb-2 shadow-card"></div>
                <p className="text-body-sm font-medium">Green Light</p>
                <p className="text-caption text-neutral-400">#E8F7F0</p>
              </div>
              <div>
                <div className="bg-brand-blue h-24 rounded-md mb-2 shadow-card"></div>
                <p className="text-body-sm font-medium">Brand Blue</p>
                <p className="text-caption text-neutral-400">#1B8EBF</p>
              </div>
              <div>
                <div className="bg-brand-blue-light h-24 rounded-md mb-2 shadow-card"></div>
                <p className="text-body-sm font-medium">Blue Light</p>
                <p className="text-caption text-neutral-400">#E5F4F9</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-h3 font-semibold mb-lg">Semantic Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
              <div>
                <div className="bg-semantic-success h-24 rounded-md mb-2 shadow-card"></div>
                <p className="text-body-sm font-medium">Success</p>
              </div>
              <div>
                <div className="bg-semantic-info h-24 rounded-md mb-2 shadow-card"></div>
                <p className="text-body-sm font-medium">Info</p>
              </div>
              <div>
                <div className="bg-semantic-warning h-24 rounded-md mb-2 shadow-card"></div>
                <p className="text-body-sm font-medium">Warning</p>
              </div>
              <div>
                <div className="bg-semantic-error h-24 rounded-md mb-2 shadow-card"></div>
                <p className="text-body-sm font-medium">Error</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="py-3xl section-light-gray">
        <div className="container-brand">
          <h2 className="text-h2 font-bold mb-2xl">Typography Scale</h2>

          <div className="space-y-lg bg-white p-xl rounded-md shadow-card">
            <div>
              <span className="text-caption text-neutral-400 uppercase tracking-wide">Display (56px)</span>
              <h1 className="text-display font-extrabold leading-tight">The quick brown fox</h1>
            </div>
            <div>
              <span className="text-caption text-neutral-400 uppercase tracking-wide">H1 (40px)</span>
              <h1 className="text-h1 font-bold leading-tight">The quick brown fox</h1>
            </div>
            <div>
              <span className="text-caption text-neutral-400 uppercase tracking-wide">H2 (32px)</span>
              <h2 className="text-h2 font-bold leading-tight">The quick brown fox</h2>
            </div>
            <div>
              <span className="text-caption text-neutral-400 uppercase tracking-wide">H3 (24px)</span>
              <h3 className="text-h3 font-semibold">The quick brown fox</h3>
            </div>
            <div>
              <span className="text-caption text-neutral-400 uppercase tracking-wide">Body (16px)</span>
              <p className="text-body leading-relaxed">
                The quick brown fox jumps over the lazy dog. This is the standard body text size with optimal line height for readability.
              </p>
            </div>
            <div>
              <span className="text-caption text-neutral-400 uppercase tracking-wide">Body Small (14px)</span>
              <p className="text-body-sm">The quick brown fox jumps over the lazy dog.</p>
            </div>
            <div>
              <span className="text-caption text-neutral-400 uppercase tracking-wide">Caption (12px)</span>
              <p className="text-caption">The quick brown fox jumps over the lazy dog.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="py-3xl">
        <div className="container-brand">
          <h2 className="text-h2 font-bold mb-2xl">Buttons</h2>

          <div className="space-y-lg">
            <div>
              <h3 className="text-h4 font-semibold mb-md">Primary Buttons</h3>
              <div className="flex gap-md flex-wrap">
                <button className="btn-primary">Primary Button</button>
                <button className="btn-primary" disabled>Disabled</button>
                <button className="btn-primary bg-brand-blue hover:bg-brand-blue-hover">
                  Blue Primary
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-h4 font-semibold mb-md">Secondary Buttons</h3>
              <div className="flex gap-md flex-wrap">
                <button className="btn-secondary">Secondary Button</button>
                <button className="btn-secondary" disabled>Disabled</button>
              </div>
            </div>

            <div>
              <h3 className="text-h4 font-semibold mb-md">Tertiary Buttons</h3>
              <div className="flex gap-md flex-wrap">
                <button className="btn-tertiary">Tertiary Button</button>
                <button className="btn-tertiary text-brand-blue hover:text-brand-blue-hover">
                  Blue Tertiary
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-3xl section-light-blue">
        <div className="container-brand">
          <h2 className="text-h2 font-bold mb-2xl">Cards</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <div className="card-brand">
              <Heart className="icon-brand mb-md" />
              <h3 className="text-h4 font-semibold mb-2">Green Accent Card</h3>
              <p className="text-body text-neutral-700">
                This card has a green left border accent and hover effects for interactivity.
              </p>
            </div>

            <div className="card-brand-blue">
              <Globe className="icon-brand-blue mb-md" />
              <h3 className="text-h4 font-semibold mb-2">Blue Accent Card</h3>
              <p className="text-body text-neutral-700">
                This card has a blue left border accent, perfect for informational content.
              </p>
            </div>

            <div className="bg-white rounded-md shadow-card p-lg hover:shadow-elevated hover:-translate-y-1 transition-smooth">
              <Users className="w-6 h-6 text-brand-green mb-md" />
              <h3 className="text-h4 font-semibold mb-2">Custom Card</h3>
              <p className="text-body text-neutral-700">
                Build custom cards using Tailwind utilities for full control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="py-3xl">
        <div className="container-brand">
          <h2 className="text-h2 font-bold mb-2xl">Badges & Tags</h2>

          <div className="flex gap-md flex-wrap">
            <span className="badge-green">Active</span>
            <span className="badge-green">Success</span>
            <span className="badge-blue">New</span>
            <span className="badge-blue">Info</span>
            <span className="bg-semantic-warning/20 text-semantic-warning px-3 py-1 rounded-pill text-body-sm font-medium">
              Warning
            </span>
            <span className="bg-semantic-error/20 text-semantic-error px-3 py-1 rounded-pill text-body-sm font-medium">
              Error
            </span>
          </div>
        </div>
      </section>

      {/* Form Elements */}
      <section className="py-3xl section-light-green">
        <div className="container-brand">
          <h2 className="text-h2 font-bold mb-2xl">Form Elements</h2>

          <div className="max-w-2xl bg-white p-xl rounded-md shadow-card">
            <form className="space-y-lg">
              <div>
                <label htmlFor="name" className="block text-body font-medium mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="input-brand w-full"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-body font-medium mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="input-brand w-full"
                  placeholder="john@example.com"
                />
                <span className="text-body-sm text-neutral-400 mt-1 block">
                  We'll never share your email
                </span>
              </div>

              <div>
                <label htmlFor="message" className="block text-body font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="input-brand w-full"
                  placeholder="Your message here..."
                />
              </div>

              <div>
                <label htmlFor="error-input" className="block text-body font-medium mb-2 text-semantic-error">
                  Email (Error State)
                </label>
                <input
                  id="error-input"
                  type="email"
                  className="input-brand error w-full"
                  placeholder="invalid@email"
                  aria-invalid="true"
                />
                <span className="text-body-sm text-semantic-error mt-1 block">
                  Please enter a valid email address
                </span>
              </div>

              <div className="flex gap-md">
                <button type="submit" className="btn-primary">
                  Submit Form
                </button>
                <button type="button" className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Alert Messages */}
      <section className="py-3xl">
        <div className="container-brand">
          <h2 className="text-h2 font-bold mb-2xl">Alert Messages</h2>

          <div className="space-y-md max-w-2xl">
            <div className="bg-semantic-success/10 border-l-4 border-semantic-success p-lg rounded-md flex gap-md">
              <CheckCircle className="w-5 h-5 text-semantic-success flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-body font-semibold text-semantic-success mb-1">Success!</h4>
                <p className="text-body-sm text-neutral-700">Your changes have been saved successfully.</p>
              </div>
            </div>

            <div className="bg-semantic-info/10 border-l-4 border-semantic-info p-lg rounded-md flex gap-md">
              <AlertCircle className="w-5 h-5 text-semantic-info flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-body font-semibold text-semantic-info mb-1">Information</h4>
                <p className="text-body-sm text-neutral-700">Please review your information before submitting.</p>
              </div>
            </div>

            <div className="bg-semantic-warning/10 border-l-4 border-semantic-warning p-lg rounded-md flex gap-md">
              <AlertCircle className="w-5 h-5 text-semantic-warning flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-body font-semibold text-semantic-warning mb-1">Warning</h4>
                <p className="text-body-sm text-neutral-700">This action cannot be undone. Proceed with caution.</p>
              </div>
            </div>

            <div className="bg-semantic-error/10 border-l-4 border-semantic-error p-lg rounded-md flex gap-md">
              <AlertCircle className="w-5 h-5 text-semantic-error flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-body font-semibold text-semantic-error mb-1">Error</h4>
                <p className="text-body-sm text-neutral-700">An error occurred while processing your request.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Icons */}
      <section className="py-3xl section-light-gray">
        <div className="container-brand">
          <h2 className="text-h2 font-bold mb-2xl">Icons (Lucide React)</h2>

          <div className="flex gap-lg flex-wrap">
            <div className="text-center">
              <Heart className="icon-brand mx-auto mb-2" />
              <span className="text-caption">Green Icon</span>
            </div>
            <div className="text-center">
              <Globe className="icon-brand-blue mx-auto mb-2" />
              <span className="text-caption">Blue Icon</span>
            </div>
            <div className="text-center">
              <Users className="w-6 h-6 text-brand-charcoal mx-auto mb-2" />
              <span className="text-caption">Charcoal Icon</span>
            </div>
            <div className="text-center">
              <CheckCircle className="w-6 h-6 text-semantic-success mx-auto mb-2" />
              <span className="text-caption">Success Icon</span>
            </div>
            <div className="text-center">
              <AlertCircle className="w-6 h-6 text-semantic-error mx-auto mb-2" />
              <span className="text-caption">Error Icon</span>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing */}
      <section className="py-3xl">
        <div className="container-brand">
          <h2 className="text-h2 font-bold mb-2xl">Spacing Scale (8px Base)</h2>

          <div className="space-y-md">
            <div className="flex items-center gap-md">
              <div className="bg-brand-green w-xs h-8"></div>
              <span className="text-body-sm">xs (4px)</span>
            </div>
            <div className="flex items-center gap-md">
              <div className="bg-brand-green w-sm h-8"></div>
              <span className="text-body-sm">sm (8px)</span>
            </div>
            <div className="flex items-center gap-md">
              <div className="bg-brand-green w-md h-8"></div>
              <span className="text-body-sm">md (16px)</span>
            </div>
            <div className="flex items-center gap-md">
              <div className="bg-brand-green w-lg h-8"></div>
              <span className="text-body-sm">lg (24px)</span>
            </div>
            <div className="flex items-center gap-md">
              <div className="bg-brand-green w-xl h-8"></div>
              <span className="text-body-sm">xl (32px)</span>
            </div>
            <div className="flex items-center gap-md">
              <div className="bg-brand-green w-2xl h-8"></div>
              <span className="text-body-sm">2xl (48px)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DesignSystemDemo;
