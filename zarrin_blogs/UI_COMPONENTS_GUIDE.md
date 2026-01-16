# ZARRIN UI COMPONENTS GUIDE

Professional, minimal components following the design system.

---

## BUTTONS

### Variants

```jsx
// Primary CTA - Use for main actions
<button className="btn-primary-md">Publish</button>

// Secondary - Use for alternative actions
<button className="btn-secondary-md">Cancel</button>

// Ghost - Use for tertiary actions
<button className="btn-ghost-md">Learn More</button>

// Success - Use for confirmations
<button className="btn-success">Confirm</button>

// Error - Use for destructive actions
<button className="btn-error">Delete</button>
```

### Sizes

```jsx
<button className="btn-primary-sm">Small</button>
<button className="btn-primary-md">Medium</button>
<button className="btn-primary-lg">Large</button>
```

### States

```jsx
// Disabled
<button className="btn-primary-md" disabled>
  Disabled
</button>

// Loading
<button className="btn-primary-md">
  <svg className="animate-spin h-4 w-4" />
  Loading...
</button>

// Full width
<button className="btn-primary-md w-full">Full Width</button>
```

---

## FORMS

### Input

```jsx
<div className="form-group">
  <label htmlFor="email" className="label-base">Email</label>
  <input 
    id="email"
    type="email"
    className="input-base"
    placeholder="user@example.com"
  />
  <span className="form-hint">We'll never share your email</span>
</div>
```

### Input with Error

```jsx
<div className="form-group">
  <label htmlFor="username" className="label-base">Username</label>
  <input 
    id="username"
    type="text"
    className="input-base input-error"
  />
  <span className="form-error">Username already taken</span>
</div>
```

### Textarea

```jsx
<div className="form-group">
  <label htmlFor="message" className="label-base">Message</label>
  <textarea 
    id="message"
    className="textarea-base"
    placeholder="Your message..."
  />
</div>
```

### Select

```jsx
<div className="form-group">
  <label htmlFor="category" className="label-base">Category</label>
  <select id="category" className="select-base">
    <option>Technology</option>
    <option>Design</option>
    <option>Business</option>
  </select>
</div>
```

### Form Submit

```jsx
<form className="space-y-6">
  <div className="form-group">
    <label className="label-base">Email</label>
    <input className="input-base" />
  </div>
  
  <div className="form-group">
    <label className="label-base">Password</label>
    <input type="password" className="input-base" />
  </div>

  <button type="submit" className="btn-primary-md w-full">
    Sign In
  </button>
</form>
```

---

## CARDS

### Basic Card

```jsx
<div className="card">
  <h3 className="text-h5 font-semibold text-text-primary mb-2">
    Card Title
  </h3>
  <p className="text-body-small text-text-secondary">
    Card content goes here
  </p>
</div>
```

### Interactive Card (Hover effect)

```jsx
<div className="card-interactive">
  <img src="..." alt="..." className="w-full h-48 object-cover rounded-sm mb-4" />
  <h3 className="text-h5 font-semibold mb-2">Blog Title</h3>
  <p className="text-body-sm text-text-secondary mb-4">
    Article excerpt...
  </p>
  <a href="#" className="link-primary">
    Read More →
  </a>
</div>
```

### Card Grid

```jsx
<div className="grid-responsive">
  <div className="card">...</div>
  <div className="card">...</div>
  <div className="card">...</div>
</div>
```

---

## TYPOGRAPHY

### Headings

```jsx
<h1 className="text-h1">H1 - Main Title</h1>
<h2 className="text-h2">H2 - Section Header</h2>
<h3 className="text-h3">H3 - Subsection</h3>
<h4 className="text-h4">H4 - Small Header</h4>
<h5 className="text-h5">H5 - Label</h5>
<h6 className="text-h6">H6 - Caption</h6>
```

### Body Text

```jsx
<p className="text-body-lg">
  Large body text (18px) for featured content
</p>

<p className="text-body-base">
  Regular body text (16px) for main content
</p>

<p className="text-body-sm">
  Small body text (14px) for secondary content
</p>

<p className="caption">
  Caption text (12px) for metadata
</p>
```

### Text Colors

```jsx
<p className="text-text-primary">Primary text (high contrast)</p>
<p className="text-text-secondary">Secondary text (labels)</p>
<p className="text-text-muted">Muted text (hints)</p>
<p className="text-accent-primary">Accent text (links)</p>
```

---

## BADGES & LABELS

### Badge

```jsx
<span className="badge-primary">Featured</span>
<span className="badge-success">Published</span>
<span className="badge-warning">Draft</span>
<span className="badge-error">Archived</span>
```

---

## ALERTS

### Alert Types

```jsx
<div className="alert-success">
  ✓ Changes saved successfully!
</div>

<div className="alert-warning">
  ⚠ Please review before publishing
</div>

<div className="alert-error">
  ✗ Something went wrong
</div>

<div className="alert-info">
  ℹ New features available
</div>
```

---

## SPACING GUIDE

Use the 8-point spacing system:

```jsx
// Padding
<div className="p-1">8px padding</div>
<div className="p-2">16px padding</div>
<div className="p-3">24px padding</div>
<div className="p-4">32px padding</div>
<div className="p-6">48px padding</div>

// Margins
<div className="m-1">8px margin</div>
<div className="m-2">16px margin</div>

// Gaps (flexbox/grid)
<div className="flex gap-2">8px gap</div>
<div className="grid gap-3">24px gap</div>
<div className="flex gap-4">32px gap</div>
```

---

## CONTAINERS

### Content Container

```jsx
<div className="container-content">
  {/* Max width 1024px, centered, with padding */}
</div>
```

### Article Container

```jsx
<article className="container-article">
  {/* Max width 800px, optimal for reading */}
</article>
```

---

## DIVIDERS

```jsx
<div className="divider"></div>
{/* 1px border with light color */}
```

---

## LINKS

### Primary Link

```jsx
<a href="#" className="link-primary">
  Read More
</a>
```

---

## UTILITIES

### Text Utilities

```jsx
// Font families
<p className="font-display">Display font (headings)</p>
<p className="font-body">Body font (text)</p>
<p className="font-mono">Monospace (code)</p>

// Shadows
<div className="shadow-sm">Subtle shadow</div>
<div className="shadow-md">Medium shadow</div>
<div className="shadow-lg">Large shadow</div>

// Borders
<div className="border border-border-light">Light border</div>
<div className="border border-border-muted">Muted border</div>

// Radius
<div className="rounded-xs">4px radius</div>
<div className="rounded-sm">8px radius</div>
<div className="rounded-md">12px radius</div>
</p>
```

---

## RESPONSIVE DESIGN

```jsx
// Mobile-first approach
<div className="
  w-full                    // Full width on mobile
  md:w-1/2                  // 50% on tablet
  lg:w-1/3                  // 33% on desktop
  px-4 md:px-6 lg:px-8      // Responsive padding
  py-4 md:py-6 lg:py-8      // Responsive padding
  text-body-sm md:text-body-base   // Responsive text
">
  Responsive content
</div>
```

---

## DARK MODE

The dark mode is automatically applied when `html.dark` class is present.

All colors automatically adjust via CSS variables.

```jsx
// Example: Theme toggle button
<button onClick={toggleTheme} className="btn-ghost-md">
  {isDark ? <Sun /> : <Moon />}
</button>
```

---

## ACCESSIBILITY CHECKLIST

- ✓ All inputs have associated labels
- ✓ Buttons have clear aria-labels
- ✓ Focus outlines are visible (blue)
- ✓ Color contrast meets WCAG AA
- ✓ Semantic HTML elements used
- ✓ Links are underlined or otherwise visually distinct
- ✓ Form errors are announced
- ✓ Touch targets are 44px minimum
- ✓ Alt text provided for images
- ✓ Keyboard navigation supported

---

## COMMON PATTERNS

### Login Form

```jsx
<div className="max-w-md mx-auto mt-12">
  <h1 className="text-h2 mb-8">Sign In</h1>
  
  <form className="space-y-6">
    <div className="form-group">
      <label htmlFor="email" className="label-base">Email</label>
      <input id="email" type="email" className="input-base" />
    </div>

    <div className="form-group">
      <label htmlFor="password" className="label-base">Password</label>
      <input id="password" type="password" className="input-base" />
    </div>

    <button type="submit" className="btn-primary-md w-full">
      Sign In
    </button>
  </form>

  <p className="text-body-sm text-text-secondary text-center mt-4">
    Don't have an account? <a href="/signup" className="link-primary">Sign up</a>
  </p>
</div>
```

### Blog Card List

```jsx
<div className="container-content my-12">
  <h2 className="text-h2 mb-8">Latest Articles</h2>
  
  <div className="grid-responsive">
    {blogs.map(blog => (
      <div key={blog.id} className="card-interactive cursor-pointer">
        <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover rounded-sm mb-4" />
        <h3 className="text-h5 font-semibold mb-2">{blog.title}</h3>
        <p className="text-body-sm text-text-secondary mb-4">{blog.excerpt}</p>
        <span className="link-primary">Read More →</span>
      </div>
    ))}
  </div>
</div>
```

### Empty State

```jsx
<div className="container-content py-16 text-center">
  <div className="text-6xl mb-4">📭</div>
  <h3 className="text-h3 mb-2">No articles yet</h3>
  <p className="text-body-base text-text-secondary mb-6">
    Start creating to see your articles appear here
  </p>
  <button className="btn-primary-md">Create Article</button>
</div>
```

---

## MIGRATION CHECKLIST

When refactoring old components:

- [ ] Replace `text-blue-600` with `text-accent-primary`
- [ ] Replace `bg-white` with `bg-bg-surface`
- [ ] Replace `bg-gray-50` with `bg-bg-page`
- [ ] Replace `text-gray-900` with `text-text-primary`
- [ ] Replace `text-gray-600` with `text-text-secondary`
- [ ] Replace `border-gray-200` with `border-border-light`
- [ ] Replace `shadow-lg` with `shadow-sm` (no heavy shadows)
- [ ] Remove gradients (use solid colors)
- [ ] Remove scale transforms on hover (use opacity/color)
- [ ] Use `rounded-sm` instead of `rounded-lg` or `rounded-xl`
- [ ] Update typography classes to new system
- [ ] Add proper focus states
- [ ] Test dark mode
- [ ] Verify WCAG contrast
