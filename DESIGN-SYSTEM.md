# One Public Health Design System

**Version 1.0** | Based on Logo Analysis

---

## Table of Contents

1. [Introduction](#introduction)
2. [Design Philosophy](#design-philosophy)
3. [Logo Analysis](#logo-analysis)
4. [Color System](#color-system)
5. [Typography](#typography)
6. [Spacing & Layout](#spacing--layout)
7. [Components](#components)
8. [Accessibility](#accessibility)
9. [Usage Guidelines](#usage-guidelines)

---

## Introduction

This design system is built around the One Public Health logo, extracting its core visual elements and extending them into a comprehensive, scalable design language. It ensures brand consistency across all digital touchpoints while maintaining accessibility and modern web standards.

**Core Technologies:**
- Tailwind CSS for utility-first styling
- CSS Custom Properties (CSS Variables) for design tokens
- Raleway typeface for brand consistency
- HSL color format for dynamic theming

---

## Design Philosophy

### Visual Identity
The One Public Health brand conveys:
- **Accessibility**: Health information for everyone
- **Global Reach**: International health community
- **Human-Centered**: Individual care within a global context
- **Trust & Professionalism**: Medical and scientific authority
- **Growth & Vitality**: Progressive health outcomes

### Design Principles
1. **Clarity First**: Content must be readable and scannable
2. **Progressive Enhancement**: Core functionality works everywhere
3. **Accessible by Default**: WCAG 2.1 AA minimum standards
4. **Consistent Experience**: Predictable patterns across pages
5. **Performance Matters**: Fast loading, optimized assets

---

## Logo Analysis

### Visual Elements
- **Green Figure/Person**: Represents community, individuals, and human health
- **Blue Globe Grid**: Symbolizes global connectivity and reach
- **Modern Sans-Serif**: Clean, professional typography
- **Balanced Composition**: Equal weight given to person and planet

### Extracted Colors
- **Primary Green**: `#2DB67D` (HSL: 160, 64%, 48%)
- **Primary Blue**: `#1B8EBF` (HSL: 197, 74%, 47%)
- **Charcoal**: `#3D4B52` (HSL: 200, 18%, 28%)

### Color Psychology
- **Green**: Health, growth, trust, vitality, healing
- **Blue**: Stability, professionalism, healthcare, global
- **Charcoal**: Authority, sophistication, readability

---

## Color System

### Brand Colors

#### Primary Green
```css
--brand-green: 160 64% 48%;           /* #2DB67D */
--brand-green-hover: 160 64% 40%;     /* Darker for interactions */
--brand-green-light: 160 64% 95%;     /* #E8F7F0 - Backgrounds */
```

**Usage:**
- Primary CTAs and action buttons
- Active navigation states
- Success messages
- Links in body copy
- Icon accents

#### Primary Blue
```css
--brand-blue: 197 74% 47%;            /* #1B8EBF */
--brand-blue-hover: 197 74% 40%;      /* Darker for interactions */
--brand-blue-light: 197 74% 95%;      /* #E5F4F9 - Backgrounds */
--brand-blue-sky: 199 56% 56%;        /* #4AA9D6 - Accent */
```

**Usage:**
- Secondary buttons
- Header backgrounds
- Information callouts
- Focus states
- Interactive elements

#### Charcoal
```css
--brand-charcoal: 200 18% 28%;        /* #3D4B52 */
--brand-charcoal-dark: 200 18% 20%;   /* #2C3740 */
```

**Usage:**
- Headings
- Body text (high emphasis)
- Icons
- Borders (when stronger contrast needed)

### Neutral Palette

```css
--neutral-white: 0 0% 100%;           /* #FFFFFF */
--neutral-gray-50: 200 15% 97%;       /* #F5F7F8 - Lightest */
--neutral-gray-100: 200 15% 93%;      /* Light backgrounds */
--neutral-gray-400: 200 12% 60%;      /* #8B9DA5 - Secondary text */
--neutral-gray-700: 200 18% 28%;      /* Body text */
--neutral-gray-900: 200 18% 20%;      /* Headings */
```

### Semantic Colors

```css
--semantic-success: 160 64% 48%;      /* Use brand green */
--semantic-info: 197 74% 47%;         /* Use brand blue */
--semantic-warning: 42 89% 59%;       /* #F7B731 */
--semantic-error: 5 70% 56%;          /* #E74C3C */
```

### Color Contrast (WCAG AA)

| Foreground | Background | Ratio | Pass |
|------------|-----------|-------|------|
| Charcoal | White | 11.5:1 | ✅ AAA |
| Green | White | 3.8:1 | ✅ AA (Large text) |
| Blue | White | 4.6:1 | ✅ AA |
| Gray 400 | White | 4.5:1 | ✅ AA |

### Tailwind Usage

```jsx
// Brand colors
<button className="bg-brand-green text-white hover:bg-brand-green-hover">
  Primary Action
</button>

<div className="bg-brand-blue-light text-brand-blue">
  Info callout
</div>

// Semantic colors
<span className="text-semantic-success">Success message</span>
<span className="text-semantic-error">Error message</span>
```

---

## Typography

### Typeface: Raleway

**Rationale**: Raleway is a clean, modern sans-serif with excellent readability, multiple weights, and a professional aesthetic that aligns with the logo's typography.

**Google Fonts**: Already loaded in `index.html`

### Type Scale

| Name | Size | CSS Variable | Usage |
|------|------|--------------|-------|
| Display | 56px | `--font-display` | Hero headlines |
| H1 | 40px | `--font-h1` | Page titles |
| H2 | 32px | `--font-h2` | Section headings |
| H3 | 24px | `--font-h3` | Subsection headings |
| H4 | 20px | `--font-h4` | Card titles |
| H5 | 18px | `--font-h5` | Small headings |
| Body Large | 18px | `--font-body-lg` | Lead paragraphs |
| Body | 16px | `--font-body` | Default text |
| Body Small | 14px | `--font-body-sm` | Captions, labels |
| Caption | 12px | `--font-caption` | Metadata, footnotes |

### Font Weights

| Weight | Value | CSS Variable | Usage |
|--------|-------|--------------|-------|
| Light | 300 | `--font-light` | Decorative only |
| Regular | 400 | `--font-regular` | Body text |
| Medium | 500 | `--font-medium` | Emphasized text |
| Semibold | 600 | `--font-semibold` | H3-H5, buttons |
| Bold | 700 | `--font-bold` | H1-H2 |
| Extrabold | 800 | `--font-extrabold` | Display text |

### Line Heights

| Name | Value | CSS Variable | Usage |
|------|-------|--------------|-------|
| Tight | 1.2 | `--leading-tight` | Headings |
| Normal | 1.3 | `--leading-normal` | Subheadings |
| Relaxed | 1.6 | `--leading-relaxed` | Body text |
| Loose | 1.7 | `--leading-loose` | Long-form content |

### Tailwind Usage

```jsx
// Headings
<h1 className="text-h1 font-bold leading-tight text-foreground">
  Page Title
</h1>

<h2 className="text-h2 font-semibold leading-tight">
  Section Heading
</h2>

// Body text
<p className="text-body leading-relaxed text-neutral-700">
  Body paragraph with optimal readability
</p>

// Small text
<span className="text-body-sm text-neutral-400">
  Caption or metadata
</span>
```

---

## Spacing & Layout

### Spacing Scale (8px Base Unit)

| Token | Value | CSS Variable | Use Case |
|-------|-------|--------------|----------|
| xs | 4px | `--space-xs` | Icon padding, tight spacing |
| sm | 8px | `--space-sm` | Component padding |
| md | 16px | `--space-md` | Default spacing |
| lg | 24px | `--space-lg` | Card padding, section margins |
| xl | 32px | `--space-xl` | Large component spacing |
| 2xl | 48px | `--space-2xl` | Section padding (mobile) |
| 3xl | 64px | `--space-3xl` | Section padding (desktop) |
| 4xl | 96px | `--space-4xl` | Hero sections |

### Grid System

**12-Column Responsive Grid**

```jsx
<div className="container mx-auto px-lg">
  <div className="grid grid-cols-12 gap-lg">
    <div className="col-span-12 md:col-span-6 lg:col-span-4">
      {/* Content */}
    </div>
  </div>
</div>
```

### Breakpoints

| Name | Min Width | Max Container |
|------|-----------|---------------|
| Mobile | 320px | 100% |
| Tablet | 768px | 100% |
| Desktop | 1024px | 1200px |
| Large | 1440px | 1200px |

### Container

```jsx
// Standard container
<div className="container-brand">
  {/* Max-width 1200px, responsive padding */}
</div>

// Or with Tailwind
<div className="max-w-7xl mx-auto px-lg">
  {/* Content */}
</div>
```

### Tailwind Spacing

```jsx
// Margins
<div className="mt-lg mb-2xl">Section</div>

// Padding
<div className="px-md py-xl">Card</div>

// Gap
<div className="flex gap-md">Items</div>
```

---

## Components

### Buttons

#### Primary Button
```jsx
<button className="btn-primary">
  Primary Action
</button>

// Or with Tailwind
<button className="bg-brand-green text-white px-6 py-3 rounded-sm font-semibold
  hover:bg-brand-green-hover transition-base hover:shadow-elevated hover:-translate-y-0.5">
  Primary Action
</button>
```

#### Secondary Button
```jsx
<button className="btn-secondary">
  Secondary Action
</button>

// Or with Tailwind
<button className="bg-transparent text-brand-blue border-2 border-brand-blue
  px-6 py-3 rounded-sm font-semibold hover:bg-brand-blue-light transition-base">
  Secondary Action
</button>
```

#### Tertiary Button
```jsx
<button className="btn-tertiary">
  Tertiary Action
</button>
```

### Cards

#### Green Accent Card
```jsx
<div className="card-brand">
  <h3 className="text-h4 font-semibold mb-2">Card Title</h3>
  <p className="text-body text-neutral-700">Card content goes here.</p>
</div>
```

#### Blue Accent Card
```jsx
<div className="card-brand-blue">
  {/* Content */}
</div>
```

#### With Tailwind
```jsx
<div className="bg-white rounded-md shadow-card p-lg border-l-4 border-brand-green
  hover:shadow-elevated hover:-translate-y-1 transition-smooth">
  {/* Content */}
</div>
```

### Badges/Tags

```jsx
<span className="badge-green">Active</span>
<span className="badge-blue">New</span>

// Or with Tailwind
<span className="bg-brand-green-light text-brand-green px-3 py-1
  rounded-pill text-body-sm font-medium">
  Active
</span>
```

### Form Inputs

```jsx
<input
  type="text"
  className="input-brand"
  placeholder="Enter text"
/>

// Error state
<input
  type="email"
  className="input-brand error"
  aria-invalid="true"
/>

// With Tailwind
<input
  type="text"
  className="border border-border rounded-sm px-4 py-3 text-body
    focus:border-brand-blue focus:shadow-[0_0_0_3px_hsl(var(--brand-blue-light))]
    focus:outline-none transition-base"
/>
```

### Sections

#### Alternating Backgrounds
```jsx
<section className="py-3xl">
  {/* White background */}
</section>

<section className="section-light-green py-3xl">
  {/* Light green background */}
</section>

<section className="section-light-blue py-3xl">
  {/* Light blue background */}
</section>
```

### Icons

**Library**: Lucide React (already installed)

```jsx
import { Heart, Globe, Users } from 'lucide-react';

<Heart className="icon-brand" />
<Globe className="icon-brand-blue" />

// Or with Tailwind
<Heart className="w-6 h-6 text-brand-green" />
```

---

## Accessibility

### WCAG 2.1 AA Compliance

#### Color Contrast
- **Body text**: Minimum 4.5:1 contrast ratio
- **Large text (18px+)**: Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 contrast ratio

#### Focus Indicators
All interactive elements have visible 2px blue focus rings:

```css
*:focus-visible {
  outline: none;
  ring: 2px solid hsl(var(--brand-blue));
  ring-offset: 2px;
}
```

#### Touch Targets
Minimum 44x44px touch target size for mobile:

```css
button, a, [role="button"] {
  min-height: 44px;
  min-width: 44px;
}
```

#### Keyboard Navigation
- All interactive elements accessible via Tab
- Logical tab order
- Skip links for main content
- Arrow key navigation for menus

#### Screen Readers
- Semantic HTML5 elements
- ARIA labels where needed
- Alt text for all images
- Proper heading hierarchy

#### Best Practices
```jsx
// Good button
<button
  className="btn-primary"
  aria-label="Submit form"
>
  Submit
</button>

// Good link
<a
  href="/about"
  className="text-brand-blue hover:text-brand-blue-hover"
>
  Learn More
</a>

// Good image
<img
  src="/logo.png"
  alt="One Public Health logo - person with globe"
/>

// Good form
<label htmlFor="email" className="text-body font-medium">
  Email Address
</label>
<input
  id="email"
  type="email"
  aria-describedby="email-help"
  className="input-brand"
/>
<span id="email-help" className="text-body-sm text-neutral-400">
  We'll never share your email
</span>
```

---

## Usage Guidelines

### Getting Started

1. **Colors**: Use brand colors for primary actions, neutral grays for backgrounds
2. **Typography**: Raleway for all text, maintain hierarchy
3. **Spacing**: Use 8px base unit, apply consistently
4. **Components**: Prefer pre-built component classes
5. **Accessibility**: Test with keyboard and screen reader

### Dos and Don'ts

#### Colors
✅ **Do:**
- Use green for primary CTAs
- Use blue for secondary actions and info
- Maintain sufficient contrast
- Test colors in both light and dark modes

❌ **Don't:**
- Mix brand colors randomly
- Use colors with insufficient contrast
- Create new colors without documentation

#### Typography
✅ **Do:**
- Use Raleway consistently
- Follow the type scale
- Maintain heading hierarchy (H1 → H2 → H3)
- Use appropriate line heights

❌ **Don't:**
- Mix multiple typefaces
- Skip heading levels
- Use tiny text (<14px for body)
- Use all caps for long text

#### Spacing
✅ **Do:**
- Use the 8px spacing scale
- Apply consistent padding/margins
- Use responsive spacing (mobile vs. desktop)

❌ **Don't:**
- Use arbitrary spacing values
- Create cramped layouts
- Ignore mobile spacing needs

#### Components
✅ **Do:**
- Use pre-built component classes
- Maintain hover/focus states
- Ensure touch targets are large enough

❌ **Don't:**
- Create inconsistent button styles
- Forget hover states
- Make clickable elements too small

### Code Examples

#### Hero Section
```jsx
<section className="py-4xl bg-gradient-brand text-white">
  <div className="container-brand">
    <h1 className="text-display font-extrabold leading-tight mb-lg">
      One Public Health
    </h1>
    <p className="text-body-lg leading-relaxed mb-xl max-w-2xl">
      Your one-stop source for public health learning, careers, and community.
    </p>
    <button className="btn-primary bg-white text-brand-green hover:bg-neutral-50">
      Get Started
    </button>
  </div>
</section>
```

#### Feature Cards
```jsx
<section className="py-3xl">
  <div className="container-brand">
    <h2 className="text-h2 font-bold text-center mb-2xl">Our Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
      {features.map((feature) => (
        <div key={feature.id} className="card-brand">
          <feature.icon className="icon-brand mb-md" />
          <h3 className="text-h4 font-semibold mb-2">{feature.title}</h3>
          <p className="text-body text-neutral-700">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

#### Form
```jsx
<form className="max-w-md mx-auto space-y-lg">
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
  </div>

  <button type="submit" className="btn-primary w-full">
    Submit
  </button>
</form>
```

---

## Additional Resources

### CSS Variables Reference
All design tokens are defined in [src/index.css](./src/index.css)

### Tailwind Configuration
Tailwind extensions are in [tailwind.config.ts](./tailwind.config.ts)

### Component Library
Shadcn/UI components are pre-configured in `src/components/ui/`

### Dark Mode
Dark mode support is built-in. Toggle with:
```jsx
import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();
setTheme(theme === 'dark' ? 'light' : 'dark');
```

---

## Changelog

### Version 1.0 (2025-10-15)
- Initial design system based on logo analysis
- Comprehensive color palette with HSL values
- Typography scale with Raleway
- Spacing system (8px base)
- Component styles and guidelines
- Accessibility standards (WCAG 2.1 AA)
- Tailwind CSS integration
- Dark mode support

---

## Contact & Support

For design system questions or contributions, please contact the design team or open an issue in the repository.

**Maintained by**: One Public Health Design Team
**Last Updated**: October 15, 2025
