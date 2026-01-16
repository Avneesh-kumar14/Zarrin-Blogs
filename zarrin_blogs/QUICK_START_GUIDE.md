# ZARRIN DESIGN SYSTEM - QUICK START GUIDE

Fast reference for applying the professional design system to Zarrin components.

---

## COLOR QUICK REFERENCE

### Light Mode
```css
Text:       #1C1F26 (primary)  | #4B5563 (secondary) | #6B7280 (muted)
Background: #FAFAFA (page)     | #FFFFFF (surface)   | #F3F4F6 (muted)
Accent:     #2563EB (primary)  | #1D4ED8 (hover)     | #DBEAFE (soft)
Border:     #E5E7EB (light)    | #D1D5DB (muted)
Status:     #16A34A (success)  | #D97706 (warning)   | #DC2626 (error)
```

### Dark Mode
```css
Text:       #E5E7EB (primary)  | #9CA3AF (secondary) | #6B7280 (muted)
Background: #0F172A (page)     | #111827 (surface)   | #1F2937 (muted)
Accent:     #3B82F6 (primary)  | #2563EB (hover)     | #1E40AF (soft)
Border:     #374151 (light)    | #1F2937 (muted)
Status:     #10B981 (success)  | #F59E0B (warning)   | #EF4444 (error)
```

### CSS Variables
```css
var(--color-text-primary)
var(--color-text-secondary)
var(--color-text-muted)
var(--color-bg-page)
var(--color-bg-surface)
var(--color-bg-muted)
var(--color-accent-primary)
var(--color-accent-hover)
var(--color-accent-soft)
var(--color-border-light)
var(--color-border-muted)
var(--color-success)
var(--color-warning)
var(--color-error)
```

---

## COMPONENT QUICK COPY

### Button - Primary
```jsx
<button className="btn-primary-md">Action</button>
```

### Button - Secondary
```jsx
<button className="btn-secondary-md">Cancel</button>
```

### Button - Ghost
```jsx
<button className="btn-ghost-md">Link</button>
```

### Form Input
```jsx
<div className="form-group">
  <label htmlFor="email" className="label-base">Email</label>
  <input id="email" type="email" className="input-base" />
</div>
```

### Form Input with Error
```jsx
<input className="input-base input-error" />
<span className="form-error">Error message</span>
```

### Card
```jsx
<div className="card">
  <h3 className="text-h5 font-semibold">Title</h3>
  <p className="text-body-sm text-text-secondary">Content</p>
</div>
```

### Alert
```jsx
<div className="alert-success">✓ Success message</div>
<div className="alert-error">✗ Error message</div>
```

### Badge
```jsx
<span className="badge-primary">Featured</span>
```

### Heading
```jsx
<h1 className="text-h1">Main Title</h1>
<h2 className="text-h2">Section Header</h2>
```

### Paragraph
```jsx
<p className="text-body-base text-text-primary">Main text</p>
<p className="text-body-sm text-text-secondary">Secondary</p>
```

### Link
```jsx
<a href="#" className="link-primary">Read More</a>
```

### Container
```jsx
<div className="container-content">Centered, max-width content</div>
<article className="container-article">Article, 800px max-width</article>
```

### Responsive Grid
```jsx
<div className="grid-responsive">
  <div className="card">Card 1</div>
  <div className="card">Card 2</div>
  <div className="card">Card 3</div>
</div>
```

### Spacing (8-point grid)
```jsx
// Padding: p-1 (8px) to p-6 (48px)
<div className="p-3">24px padding</div>

// Margins: m-1 to m-6
<div className="m-4">32px margin</div>

// Gaps: gap-2 (16px) to gap-6 (48px)
<div className="flex gap-3">24px gap</div>
```

---

## COLOR REPLACEMENT CHEATSHEET

Replace old color classes with new design system:

```jsx
// OLD → NEW

// Blues
bg-blue-600 → bg-accent-primary
hover:bg-blue-700 → hover:bg-accent-hover
text-blue-600 → text-accent-primary
border-blue-600 → border-accent-primary

// Grays
bg-gray-50 → bg-bg-page
bg-white → bg-bg-surface
bg-gray-100 → bg-bg-muted
text-gray-900 → text-text-primary
text-gray-600 → text-text-secondary
text-gray-500 → text-text-muted
border-gray-200 → border-border-light
border-gray-300 → border-border-muted

// Status
bg-green-50 → bg-success/10
text-green-600 → text-success
bg-red-50 → bg-error/10
text-red-600 → text-error
```

---

## SIZING QUICK REFERENCE

### Font Sizes
```
h1: 48px    h2: 36px    h3: 28px
h4: 22px    h5: 18px    h6: 16px
body-lg: 18px  body-base: 16px  body-sm: 14px  caption: 12px
```

### Spacing (8px base)
```
1 unit: 8px     2 units: 16px   3 units: 24px   4 units: 32px
5 units: 40px   6 units: 48px   7 units: 56px   8 units: 64px
10 units: 80px  12 units: 96px
```

### Components
```
Button height: 32px (sm) | 40px (md) | 48px (lg) | 56px (xl)
Input height: 40-44px
Navbar height: 64px
Card padding: 24px
Card radius: 8px
Border: 1px
```

---

## MIGRATION CHECKLIST FOR EACH FILE

When updating a component file:

- [ ] Replace color class names (gray → text-primary, blue → accent-primary)
- [ ] Update typography (text-6xl → text-h1, text-base → text-body-base)
- [ ] Update spacing (p-4 → p-3, gap-4 → gap-3)
- [ ] Check for gradients (remove them, use solid colors)
- [ ] Check for scale transforms (remove hover:scale-*, use color/opacity)
- [ ] Add proper focus states (focus-visible:outline-2)
- [ ] Update shadows (shadow-lg → shadow-sm)
- [ ] Update border radius (rounded-lg → rounded-sm)
- [ ] Test dark mode
- [ ] Verify focus states
- [ ] Check accessibility (contrast, touch targets, ARIA labels)
- [ ] Test responsive design

---

## TAILWIND UTILITY CLASSES

### Text Colors
```
text-text-primary    text-text-secondary    text-text-muted
text-accent-primary  text-success           text-warning           text-error
```

### Background Colors
```
bg-bg-page           bg-bg-surface          bg-bg-muted
bg-accent-primary    bg-accent-soft
```

### Border Colors
```
border-border-light  border-border-muted
```

### Typography
```
text-h1 through text-h6    text-body-lg  text-body-base  text-body-sm  caption
font-display               font-body      font-mono
leading-reading (1.6)      leading-heading (1.2)
```

### Shadows
```
shadow-xs              shadow-sm              shadow-md              shadow-lg
shadow-focus (blue ring for focus state)
```

### Spacing
```
p-1 through p-6    m-1 through m-6    gap-1 through gap-6
```

### Border Radius
```
rounded-xs (4px)   rounded-sm (8px)   rounded-md (12px)   rounded-full
```

---

## COMPONENT PATTERNS

### Form with Multiple Fields
```jsx
<form className="space-y-6 max-w-md">
  <div className="form-group">
    <label className="label-base">Full Name</label>
    <input className="input-base" />
  </div>

  <div className="form-group">
    <label className="label-base">Email</label>
    <input className="input-base" />
  </div>

  <button type="submit" className="btn-primary-md w-full">
    Submit
  </button>
</form>
```

### Card List
```jsx
<div className="container-content my-12">
  <h2 className="text-h2 mb-8">Items</h2>
  <div className="grid-responsive">
    {items.map(item => (
      <div key={item.id} className="card">
        <h3 className="text-h5 mb-2">{item.title}</h3>
        <p className="text-body-sm text-text-secondary">{item.desc}</p>
      </div>
    ))}
  </div>
</div>
```

### Article
```jsx
<article className="container-article">
  <h1 className="text-h1 mb-8">Article Title</h1>
  <p className="text-body-lg text-text-secondary mb-6">Intro...</p>
  
  <h2 className="text-h2 mt-8 mb-4">Section</h2>
  <p className="text-body-base mb-4">Content...</p>
</article>
```

### Empty State
```jsx
<div className="container-content py-16 text-center">
  <div className="text-6xl mb-4">📭</div>
  <h3 className="text-h3 mb-2">No items</h3>
  <p className="text-body-base text-text-secondary mb-6">Start by creating one</p>
  <button className="btn-primary-md">Create</button>
</div>
```

---

## DARK MODE TESTING

Test your component in dark mode:

```jsx
// In browser DevTools console:
document.documentElement.classList.add('dark')

// To remove:
document.documentElement.classList.remove('dark')
```

All CSS variables automatically update. No manual adjustments needed.

---

## ACCESSIBILITY CHECKLIST

- ✓ Text contrast at least 4.5:1
- ✓ Focus outline visible (2px solid)
- ✓ Touch targets 44px minimum
- ✓ Form labels associated with inputs
- ✓ Icon buttons have aria-label
- ✓ Errors announced to screen readers
- ✓ Proper heading hierarchy
- ✓ Semantic HTML elements

---

## COMMON MISTAKES TO AVOID

❌ **DON'T**:
- Use `hover:scale-105` (unprofessional)
- Use gradients (not editorial)
- Use pure `#000000` or `#FFFFFF`
- Use `rounded-lg` or `rounded-xl`
- Use `shadow-2xl` or `shadow-3xl`
- Forget focus states
- Use `absolute` positioning for layout
- Mix color systems (old + new)
- Ignore dark mode
- Skip accessibility checks

✅ **DO**:
- Use opacity and color for hover effects
- Use solid colors from palette
- Use CSS variables for colors
- Use `rounded-sm` (8px) standard
- Use `shadow-sm` for subtle effects
- Add focus outlines everywhere
- Use flexbox/grid for layouts
- Use new design tokens consistently
- Test light and dark modes
- Verify WCAG AA contrast

---

## RESOURCES

- **Design System**: See `DESIGN_SYSTEM.md`
- **Component Guide**: See `UI_COMPONENTS_GUIDE.md`
- **Audit Report**: See `UI_UX_AUDIT_REPORT.md`
- **Tailwind Config**: `tailwind.config.js`
- **CSS Variables**: `src/styles/design-system.css`
- **Global Styles**: `src/index.css`

---

## SUPPORT FILES

**Design System Files**:
- `DESIGN_SYSTEM.md` - Complete design specifications
- `UI_COMPONENTS_GUIDE.md` - Component examples and usage
- `UI_UX_AUDIT_REPORT.md` - Comprehensive audit and recommendations
- `QUICK_START_GUIDE.md` (this file)

**Implementation Files**:
- `tailwind.config.js` - Tailwind theme configuration
- `src/styles/design-system.css` - CSS custom properties
- `src/index.css` - Global styles and utilities
- `src/context/ThemeContext.jsx` - Dark mode management
- `src/Component/Common/DarkModeToggle.jsx` - Dark mode switch

**Component Files** (Updated):
- `src/Component/Common/Button.jsx` - Professional buttons
- `src/Component/Common/Card.jsx` - Professional cards
- `src/Component/Common/Heading.jsx` - Typography headings
- `src/Component/Common/Paragraph.jsx` - Typography body
- `src/Component/Common/Alert.jsx` - Alert messages
- `src/Component/Pagination.jsx` - Pagination controls

---

**Last Updated**: January 16, 2026  
**Version**: 1.0  
**Status**: ✅ Ready for use
