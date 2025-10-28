# Design Tokens Quick Reference

**One Public Health Design System** | Cheat Sheet

---

## 🎨 Colors

### Brand Colors
```jsx
bg-brand-green          // #2DB67D - Primary green
bg-brand-green-hover    // Darker green
bg-brand-green-light    // #E8F7F0 - Light green background

bg-brand-blue           // #1B8EBF - Primary blue
bg-brand-blue-hover     // Darker blue
bg-brand-blue-light     // #E5F4F9 - Light blue background
bg-brand-blue-sky       // #4AA9D6 - Sky blue accent

bg-brand-charcoal       // #3D4B52 - Charcoal
bg-brand-charcoal-dark  // #2C3740 - Dark charcoal
```

### Neutrals
```jsx
bg-neutral-white    // #FFFFFF
bg-neutral-50       // #F5F7F8 - Lightest gray
bg-neutral-100      // Light gray
bg-neutral-400      // #8B9DA5 - Medium gray
bg-neutral-700      // Dark gray
bg-neutral-900      // Darkest gray
```

### Semantic
```jsx
bg-semantic-success  // Green
bg-semantic-info     // Blue
bg-semantic-warning  // #F7B731
bg-semantic-error    // #E74C3C
```

---

## 📝 Typography

### Font Sizes
```jsx
text-display   // 56px - Hero headlines
text-h1        // 40px - Page titles
text-h2        // 32px - Section headings
text-h3        // 24px - Subsections
text-h4        // 20px - Card titles
text-h5        // 18px - Small headings
text-body-lg   // 18px - Lead paragraphs
text-body      // 16px - Default text
text-body-sm   // 14px - Small text
text-caption   // 12px - Metadata
```

### Font Weights
```jsx
font-light      // 300
font-regular    // 400
font-medium     // 500
font-semibold   // 600
font-bold       // 700
font-extrabold  // 800
```

### Line Heights
```jsx
leading-tight    // 1.2 - Headings
leading-normal   // 1.3 - Subheadings
leading-relaxed  // 1.6 - Body text
leading-loose    // 1.7 - Long-form
```

---

## 📏 Spacing (8px Base)

```jsx
xs   // 4px
sm   // 8px
md   // 16px
lg   // 24px
xl   // 32px
2xl  // 48px
3xl  // 64px
4xl  // 96px

// Use with: p-, m-, gap-, space-
px-lg    // Horizontal padding
py-xl    // Vertical padding
gap-md   // Flex/Grid gap
space-y-lg  // Vertical space between children
```

---

## 🔘 Border Radius

```jsx
rounded-sm    // 8px - Buttons, inputs
rounded-md    // 12px - Cards, modals
rounded-lg    // 16px - Hero images
rounded-pill  // 16px - Tags, badges
```

---

## 🌑 Shadows

```jsx
shadow-subtle    // 0 1px 3px rgba(0,0,0,0.06)
shadow-card      // 0 2px 8px rgba(0,0,0,0.08)
shadow-elevated  // 0 4px 16px rgba(0,0,0,0.12)
shadow-modal     // 0 8px 32px rgba(0,0,0,0.16)
```

---

## ⚡ Transitions

```jsx
transition-fast  // 150ms
transition-base  // 200ms
transition-slow  // 300ms

// Use with transition-colors, transition-transform, etc.
```

---

## 🎯 Pre-Built Component Classes

### Buttons
```jsx
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-tertiary">Tertiary</button>
```

### Cards
```jsx
<div className="card-brand">Green accent card</div>
<div className="card-brand-blue">Blue accent card</div>
```

### Badges
```jsx
<span className="badge-green">Active</span>
<span className="badge-blue">New</span>
```

### Forms
```jsx
<input className="input-brand" />
<input className="input-brand error" />
```

### Sections
```jsx
<section className="section-light-green">Light green bg</section>
<section className="section-light-blue">Light blue bg</section>
<section className="section-light-gray">Light gray bg</section>
```

### Icons
```jsx
<Heart className="icon-brand" />        // Green 24px
<Globe className="icon-brand-blue" />   // Blue 24px
```

### Gradients
```jsx
<div className="gradient-brand">Green to blue</div>
<div className="gradient-brand-subtle">Light gradient</div>
```

### Container
```jsx
<div className="container-brand">Max-width 1200px</div>
```

---

## 💡 Common Patterns

### Hero Section
```jsx
<section className="py-4xl gradient-brand text-white">
  <div className="container-brand">
    <h1 className="text-display font-extrabold leading-tight mb-lg">
      Hero Title
    </h1>
    <p className="text-body-lg leading-relaxed mb-xl">
      Hero description
    </p>
    <button className="btn-primary bg-white text-brand-green">
      Call to Action
    </button>
  </div>
</section>
```

### Feature Cards Grid
```jsx
<section className="py-3xl">
  <div className="container-brand">
    <h2 className="text-h2 font-bold text-center mb-2xl">Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
      <div className="card-brand">
        <Heart className="icon-brand mb-md" />
        <h3 className="text-h4 font-semibold mb-2">Feature Title</h3>
        <p className="text-body text-neutral-700">Description</p>
      </div>
    </div>
  </div>
</section>
```

### Form
```jsx
<form className="space-y-lg">
  <div>
    <label className="block text-body font-medium mb-2">Label</label>
    <input className="input-brand w-full" type="text" />
  </div>
  <button className="btn-primary" type="submit">Submit</button>
</form>
```

### Alert Message
```jsx
<div className="bg-semantic-success/10 border-l-4 border-semantic-success p-lg rounded-md flex gap-md">
  <CheckCircle className="w-5 h-5 text-semantic-success flex-shrink-0" />
  <div>
    <h4 className="text-body font-semibold text-semantic-success mb-1">
      Success!
    </h4>
    <p className="text-body-sm text-neutral-700">Your message here</p>
  </div>
</div>
```

---

## 📱 Responsive Utilities

```jsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  // 1 col mobile, 2 tablet, 3 desktop
</div>

<div className="px-md md:px-lg lg:px-xl">
  // Responsive padding
</div>

<h1 className="text-h3 md:text-h2 lg:text-h1">
  // Responsive text size
</h1>
```

---

## ♿ Accessibility Patterns

```jsx
// Button
<button
  className="btn-primary"
  aria-label="Submit form"
>
  Submit
</button>

// Input
<label htmlFor="email" className="block text-body font-medium mb-2">
  Email
</label>
<input
  id="email"
  type="email"
  className="input-brand w-full"
  aria-describedby="email-help"
/>
<span id="email-help" className="text-body-sm text-neutral-400">
  Helper text
</span>

// Image
<img src="logo.png" alt="Descriptive alt text" />
```

---

## 🔗 Quick Links

- **Full Documentation**: `DESIGN-SYSTEM.md`
- **Summary**: `DESIGN-SYSTEM-SUMMARY.md`
- **Demo Component**: `src/components/DesignSystemDemo.tsx`
- **CSS Variables**: `src/index.css`
- **Tailwind Config**: `tailwind.config.ts`

---

**Tip**: Replace `bg-` with `text-` or `border-` to use colors for text or borders:
```jsx
<div className="bg-brand-green text-white border-brand-green">
```
