# Zarrin Editorial SaaS Design System

## Overview
Zarrin is refactored as a world-class editorial SaaS platform with premium, minimal design inspired by Medium, Linear, Notion, and Vercel. The design prioritizes readability, elegance, and a calm user experience.

---

## 1. COLOR SYSTEM

### Light Mode

#### Primary Text
- **Text Primary**: `#1C1F26` - Main text, high contrast
- **Text Secondary**: `#4B5563` - Secondary information, labels
- **Text Muted**: `#6B7280` - Tertiary text, captions, hints

#### Backgrounds
- **Page Background**: `#FAFAFA` - Main page background, off-white
- **Surface Background**: `#FFFFFF` - Cards, modals, containers
- **Surface Muted**: `#F3F4F6` - Subtle backgrounds, hover states

#### Accent
- **Accent Primary**: `#2563EB` - Links, CTAs, primary highlights
- **Accent Hover**: `#1D4ED8` - Hover state for accent
- **Accent Soft**: `#DBEAFE` - Subtle highlights, selections

#### Borders & Dividers
- **Border Light**: `#E5E7EB` - Primary borders
- **Border Muted**: `#D1D5DB` - Subtle dividers

#### Semantic
- **Success**: `#16A34A` - Success messages, confirmations
- **Warning**: `#D97706` - Warning states, cautions
- **Error**: `#DC2626` - Error messages, destructive actions

### Dark Mode

#### Backgrounds
- **Page Background**: `#0F172A` - Main dark background
- **Surface Background**: `#111827` - Dark cards, containers
- **Surface Muted**: `#1F2937` - Subtle backgrounds

#### Text
- **Text Primary**: `#E5E7EB` - Main text
- **Text Secondary**: `#9CA3AF` - Secondary information
- **Text Muted**: `#6B7280` - Tertiary text

#### Accent
- **Accent Primary**: `#3B82F6` - Links, CTAs (brighter in dark mode)
- **Accent Hover**: `#1D4ED8` - Hover state
- **Accent Soft**: `#1E40AF` - Subtle highlights

#### Borders
- **Border Light**: `#374151` - Primary borders
- **Border Muted**: `#1F2937` - Subtle dividers

#### Semantic
- **Success**: `#10B981` - Success messages
- **Warning**: `#F59E0B` - Warning states
- **Error**: `#EF4444` - Error messages

---

## 2. TYPOGRAPHY SYSTEM

### Font Stack
- **Headers & Titles**: `"Inter", "Segoe UI", sans-serif` (Humanist sans-serif for warmth)
- **Body Text**: `"Inter", "Segoe UI", sans-serif` (Same for consistency, excellent readability)
- **Monospace**: `"Fira Code", "Courier New", monospace` (For code blocks)

### Typography Scale

| Level | Font Size | Line Height | Font Weight | Use Case |
|-------|-----------|-------------|-------------|----------|
| H1 | 48px (3rem) | 1.2 (57.6px) | 700 | Page titles, hero sections |
| H2 | 36px (2.25rem) | 1.25 (45px) | 700 | Section headers |
| H3 | 28px (1.75rem) | 1.3 (36.4px) | 600 | Subsection headers |
| H4 | 22px (1.375rem) | 1.35 (29.7px) | 600 | Component headers |
| H5 | 18px (1.125rem) | 1.4 (25.2px) | 600 | Smaller headers |
| H6 | 16px (1rem) | 1.5 (24px) | 600 | Labels, tags |
| Body Large | 18px (1.125rem) | 1.6 (28.8px) | 400 | Article body, featured text |
| Body Regular | 16px (1rem) | 1.6 (25.6px) | 400 | Main body text, UI text |
| Body Small | 14px (0.875rem) | 1.5 (21px) | 400 | Secondary text, captions |
| Caption | 12px (0.75rem) | 1.4 (16.8px) | 500 | Hints, timestamps, tags |

### Optimal Reading
- **Max Width for Articles**: 800px (optimal for long-form reading)
- **Paragraph Spacing**: 1.6em (proportional to font size)
- **Letter Spacing**: 0 (default, -0.02em for headings if needed)

---

## 3. SPACING SYSTEM (8-point base)

### Core Scale
```
0px (0)
8px (1 unit)
16px (2 units)
24px (3 units)
32px (4 units)
40px (5 units)
48px (6 units)
56px (7 units)
64px (8 units)
80px (10 units)
96px (12 units)
```

### Usage Guidelines
- **Padding**: Small components = 8-16px, Medium = 16-24px, Large = 24-32px
- **Margin**: Between sections = 32-48px, Between elements = 16-24px
- **Gap (Grid/Flex)**: Tight = 8px, Medium = 16px, Loose = 24-32px

---

## 4. COMPONENT SPACING

### Buttons
- **Small**: 8px padding (v) × 12px (h), 12px font
- **Medium**: 10px padding (v) × 16px (h), 14px font
- **Large**: 12px padding (v) × 20px (h), 16px font

### Cards & Containers
- **Padding**: 24px (or 32px for content cards)
- **Border Radius**: 8px (standard), 12px (large)
- **Gap between cards**: 24px

### Forms & Inputs
- **Input height**: 40-44px (includes padding)
- **Label-to-input spacing**: 8px
- **Input-to-error spacing**: 4px

### Navigation
- **Navbar height**: 64px (including padding)
- **Vertical nav item padding**: 12px (v) × 16px (h)

---

## 5. SHADOWS & ELEVATION

| Level | Shadow | Use Case |
|-------|--------|----------|
| 0 | None | Flat surfaces |
| 1 | `0 1px 2px rgba(0,0,0,0.05)` | Subtle card borders |
| 2 | `0 4px 6px rgba(0,0,0,0.07)` | Cards, small containers |
| 3 | `0 10px 15px rgba(0,0,0,0.1)` | Medium containers, modals |
| 4 | `0 20px 25px rgba(0,0,0,0.12)` | Large modals, overlays |
| Focus | `0 0 0 3px rgba(37, 99, 235, 0.1)` | Focus states |

---

## 6. BORDERS & CORNERS

- **Border Radius Small**: 4px (inputs, small components)
- **Border Radius Medium**: 8px (cards, buttons)
- **Border Radius Large**: 12px (large containers, modals)
- **Border Radius Full**: 9999px (pills, avatars)

- **Border Width**: 1px (standard), 2px (focus/hover)
- **Border Color**: Use `--color-border-light`, `--color-border-muted`

---

## 7. TRANSITIONS & ANIMATIONS

- **Default Duration**: 200ms
- **Focus/Hover**: 150ms
- **Page Transitions**: 300ms
- **Easing**: `ease-out` for enter, `ease-in` for exit

**Avoid**:
- Heavy bounce animations
- Automatic carousels
- Parallax effects
- Loud color transitions

**Use sparingly**:
- Fade in/out for modals
- Subtle scale on hover (1.02x)
- Smooth height transitions for collapsibles

---

## 8. ACCESSIBILITY

### Contrast Requirements (WCAG AA)
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio

### Color Usage
- Text primary (#1C1F26) on light backgrounds = 17.5:1 ✓
- Text secondary (#4B5563) on light backgrounds = 9.2:1 ✓
- Accent (#2563EB) on light backgrounds = 4.8:1 ✓

### Focus States
- Always show 3px focus outline: `#2563EB`
- Outline offset: 2px
- Never remove default focus indicators

### Mobile Responsiveness
- Touch targets: Minimum 44px × 44px
- Spacing adjusts down on mobile (80% of desktop values)

---

## 9. COMPONENT GUIDELINES

### Buttons
- **States**: Default, Hover (darker), Focus (outline), Disabled (opacity 50%)
- **No gradients** - use solid colors
- **No scaling on hover** - use opacity/color changes
- **Variants**: Primary (solid), Secondary (outline), Ghost (transparent)

### Forms
- **Label**: Always visible, clear, associated with input
- **Errors**: Display below input, red text (#DC2626)
- **Disabled state**: gray text, cursor-not-allowed
- **Placeholder**: Light gray, not used as label

### Cards
- **Surface color**: White on light, #111827 on dark
- **Border**: Light border on light mode, subtle on dark
- **Shadow**: Subtle (level 2)
- **Padding**: 24px minimum

### Modals & Overlays
- **Backdrop**: Black 30% opacity (light), 60% opacity (dark)
- **Modal background**: White (light), #111827 (dark)
- **Max width**: 600px (standard), 900px (large)
- **Close button**: Clear, 40px × 40px minimum

### Navigation
- **Navbar**: Fixed top, 64px height, white/dark surface
- **Links**: Blue accent, underline on hover
- **Mobile**: Hamburger icon, full-width mobile nav

---

## 10. DARK MODE IMPLEMENTATION

- **Toggle stored**: `localStorage.setItem('theme', 'dark'|'light')`
- **CSS class**: Apply `dark` class to `<html>` element
- **No pure black**: Use dark grays (#0F172A, #111827)
- **Higher accent brightness**: #3B82F6 (vs #2563EB in light)
- **Test contrast**: Ensure 4.5:1 on dark backgrounds

---

## 11. RESPONSIVE BREAKPOINTS

| Device | Breakpoint | Use |
|--------|-----------|-----|
| Mobile | < 640px | Single column, full-width |
| Tablet | 640px - 1024px | 2 columns, reduced padding |
| Desktop | 1024px+ | 3+ columns, full spacing |

### Scaling Rules
- Font sizes reduce by 10-15% on mobile
- Padding/margins reduce by 20-25% on mobile
- Max-width content: 100% on mobile, 85% on tablet, 1280px on desktop

---

## 12. DESIGN PRINCIPLES

1. **Minimal & Elegant**: Remove visual noise
2. **Typography First**: Good typography = good design
3. **Whitespace is Content**: Embrace negative space
4. **Hierarchy**: Clear visual priority
5. **Readable**: Optimize for long-form reading
6. **Consistent**: Predictable patterns
7. **Accessible**: WCAG AA compliance
8. **Professional**: Timeless, premium feel
9. **No Gradients**: Solid colors only
10. **Responsive**: Mobile-first approach

---

## 13. USAGE EXAMPLES

### Button
```jsx
// Primary CTA - solid blue
<button className="bg-accent-primary hover:bg-accent-hover text-white px-6 py-2.5 rounded-md">
  Publish
</button>

// Secondary - outline
<button className="border border-border-light text-text-primary hover:bg-surface-muted px-6 py-2.5 rounded-md">
  Cancel
</button>
```

### Card
```jsx
<div className="bg-surface border border-border-light rounded-lg p-6 shadow-sm">
  <h3 className="text-h5 font-semibold text-text-primary mb-2">Title</h3>
  <p className="text-body-small text-text-secondary">Description</p>
</div>
```

### Article Body
```jsx
<article className="max-w-[800px] mx-auto px-6 py-12">
  <h1 className="text-h1 font-bold text-text-primary mb-8">Article Title</h1>
  <p className="text-body-large text-text-primary leading-custom-para mb-6">
    Article content...
  </p>
</article>
```

---

## 14. MIGRATION CHECKLIST

- [x] Define color tokens
- [x] Define typography scale
- [x] Define spacing system
- [ ] Update Tailwind config
- [ ] Create CSS variables file
- [ ] Refactor global styles
- [ ] Update Button component
- [ ] Update Card component
- [ ] Update Form components
- [ ] Update Navigation components
- [ ] Implement dark mode toggle
- [ ] Test accessibility
- [ ] Test responsive design
- [ ] Final QA and polish
