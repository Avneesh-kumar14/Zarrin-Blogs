# Complete Design System Color & Styling Reference

## Color Palette - Master Reference

### Primary Colors

#### Slate (Primary/Text)
```
slate-900: #0F172A - Primary text, headings, dark backgrounds
slate-800: #1E293B
slate-700: #334155 - Body text
slate-600: #475569 - Secondary elements
slate-500: #64748B - Muted text
slate-400: #94A3B8
slate-300: #CBD5E1 - Borders
slate-200: #E2E8F0 - Light borders
slate-100: #F1F5F9
slate-50:  #F8FAFC - Very light backgrounds
```

#### Blue (Accent)
```
blue-600: #2563EB - Links, CTAs, active states
blue-700: #1D4ED8 - Hover states
blue-500: #3B82F6 - Alternative accent
blue-400: #60A5FA - Dark mode text
```

#### Semantic Colors
```
green-600:  #16A34A - Success states
red-600:    #DC2626 - Error states
amber-500:  #D97706 - Warning states
```

### Color Application Map

#### Text Colors
```javascript
// Primary/Headings
className="text-slate-900 dark:text-white"

// Body Text
className="text-slate-700 dark:text-slate-300"

// Muted/Secondary
className="text-slate-500 dark:text-slate-400"

// Links
className="text-blue-600 hover:text-blue-700 dark:text-blue-400"

// Error Text
className="text-red-600 dark:text-red-400"
```

#### Background Colors
```javascript
// Main backgrounds
className="bg-white dark:bg-slate-950"

// Card/Section backgrounds
className="bg-slate-50 dark:bg-slate-900"

// Buttons
className="bg-blue-600 hover:bg-blue-700"

// Input fields
className="bg-white dark:bg-slate-800"

// Accents
className="bg-blue-100 dark:bg-blue-900/20"
```

#### Border Colors
```javascript
// Standard borders
className="border border-slate-200 dark:border-slate-800"

// Input borders
className="border border-slate-300 dark:border-slate-700"

// Focus borders
className="focus:border-blue-600 dark:focus:border-blue-500"

// Alert left border
className="border-l-4 border-red-600"
```

---

## Component Styling Matrix

### Buttons

#### Primary Button
```jsx
className="bg-blue-600 hover:bg-blue-700 text-white 
           px-6 py-2.5 rounded-md font-semibold 
           shadow-sm hover:shadow-md 
           transition-all duration-200
           focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
```

#### Secondary Button
```jsx
className="bg-slate-600 hover:bg-slate-700 text-white 
           px-6 py-2.5 rounded-md font-semibold 
           shadow-sm hover:shadow-md 
           transition-all duration-200"
```

#### Outline Button
```jsx
className="border border-blue-600 text-blue-600 
           bg-transparent hover:bg-blue-50
           px-6 py-2.5 rounded-md font-semibold 
           transition-colors duration-200"
```

#### Ghost Button
```jsx
className="text-slate-700 dark:text-slate-300 
           hover:bg-slate-100 dark:hover:bg-slate-800
           px-6 py-2.5 rounded-md font-semibold 
           transition-colors duration-200"
```

### Form Elements

#### Text Input
```jsx
className="w-full px-4 py-2.5 
           border border-slate-300 dark:border-slate-700
           rounded-md 
           bg-white dark:bg-slate-800 
           text-slate-900 dark:text-white 
           placeholder-slate-500 dark:placeholder-slate-400
           focus:border-blue-600 focus:outline-none 
           focus:ring-1 focus:ring-blue-500 
           dark:focus:ring-blue-400
           transition-all duration-200"
```

#### Input Label
```jsx
className="block text-sm font-semibold 
           text-slate-700 dark:text-slate-300 
           mb-2"
```

#### Input Icon Prefix
```jsx
className="absolute left-3 top-3 
           text-slate-400 pointer-events-none"
```

### Cards

#### Standard Card
```jsx
className="bg-white dark:bg-slate-900 
           border border-slate-200 dark:border-slate-800 
           rounded-lg 
           shadow-sm hover:shadow-md 
           transition-all duration-200 
           overflow-hidden"
```

#### Card with Hover Lift
```jsx
className="... 
           hover:translate-y-0 
           group"
```

#### Card Image
```jsx
className="w-full h-64 object-cover 
           group-hover:scale-105 
           transition-transform duration-300 
           rounded-lg"
```

### Alerts

#### Error Alert
```jsx
className="bg-red-50 dark:bg-red-900/20 
           border-l-4 border-red-600 
           p-4 rounded-md 
           flex items-start justify-between gap-3"

// Text
className="text-red-700 dark:text-red-400 font-medium"
```

#### Success Alert
```jsx
className="bg-green-50 dark:bg-green-900/20 
           border-l-4 border-green-600 
           p-4 rounded-md 
           flex items-start justify-between gap-3"

// Text
className="text-green-700 dark:text-green-400 font-medium"
```

#### Warning Alert
```jsx
className="bg-amber-50 dark:bg-amber-900/20 
           border-l-4 border-amber-500 
           p-4 rounded-md 
           flex items-start justify-between gap-3"

// Text
className="text-amber-700 dark:text-amber-400 font-medium"
```

#### Info Alert
```jsx
className="bg-blue-50 dark:bg-blue-900/20 
           border-l-4 border-blue-600 
           p-4 rounded-md 
           flex items-start justify-between gap-3"

// Text
className="text-blue-700 dark:text-blue-400 font-medium"
```

---

## Typography Standards

### Headings

#### H1 (Main Article Title)
```jsx
className="text-5xl md:text-6xl 
           font-bold 
           text-primary
           leading-tight"
```

#### H2 (Section Heading)
```jsx
className="text-4xl md:text-5xl 
           font-bold 
           text-primary
           leading-tight"
```

#### H3 (Subsection)
```jsx
className="text-3xl md:text-4xl 
           font-bold 
           text-primary
           leading-snug"
```

#### H4 (Minor Heading)
```jsx
className="text-2xl md:text-3xl 
           font-semibold 
           text-primary
           leading-snug"
```

#### H5 (Card Title)
```jsx
className="text-xl md:text-2xl 
           font-semibold 
           text-primary
           leading-tight"
```

#### H6 (Label)
```jsx
className="text-lg 
           font-semibold 
           text-slate-900 dark:text-white"
```

### Body Text

#### Large Body
```jsx
className="text-lg 
           text-slate-700 dark:text-slate-300 
           leading-relaxed 
           font-font2"
```

#### Standard Body
```jsx
className="text-base 
           text-slate-700 dark:text-slate-300 
           leading-relaxed 
           font-font2"
```

#### Small Text
```jsx
className="text-sm 
           text-slate-600 dark:text-slate-400 
           leading-relaxed 
           font-font2"
```

#### Muted Text
```jsx
className="text-slate-500 dark:text-slate-400 
           leading-relaxed 
           font-font2"
```

---

## Navigation & Layout

### Navbar Container
```jsx
className="sticky top-0 z-50 
           bg-white dark:bg-slate-900 
           border-b border-slate-200 dark:border-slate-800 
           shadow-sm"
```

### Navbar Link - Inactive
```jsx
className="px-4 py-2 rounded-md 
           text-slate-700 dark:text-slate-300 
           hover:bg-slate-100 dark:hover:bg-slate-800 
           transition-colors duration-200"
```

### Navbar Link - Active
```jsx
className="px-4 py-2 rounded-md 
           bg-blue-600 text-white 
           shadow-sm"
```

### Footer
```jsx
className="bg-slate-900 dark:bg-slate-950 
           text-slate-300 
           border-t border-slate-800"
```

### Footer Link
```jsx
className="text-slate-300 hover:text-blue-400 
           transition-colors duration-200"
```

---

## Spacing & Layout

### Standard Gaps
```jsx
// Vertical spacing
className="space-y-5"  // 1.25rem
className="space-y-6"  // 1.5rem
className="space-y-8"  // 2rem

// Horizontal spacing
className="gap-3"      // 0.75rem
className="gap-4"      // 1rem
className="gap-6"      // 1.5rem
```

### Padding
```jsx
// Small
className="p-3"        // 0.75rem

// Medium
className="p-4"        // 1rem
className="p-6"        // 1.5rem

// Large
className="p-8"        // 2rem
```

### Margins
```jsx
// Common margins
className="mb-2"       // Spacing between label and input
className="mb-4"       // Section spacing
className="mb-6"       // Major section spacing
className="mt-4"       // Top margins
```

---

## Shadow & Elevation

### Shadows
```jsx
// Subtle
className="shadow-sm"              // Small shadow

// Normal
className="shadow-md"              // Medium shadow

// Hover elevation
className="hover:shadow-md 
           transition-shadow duration-200"

// Focus elevation
className="focus:shadow-lg"
```

### Responsive Width
```jsx
// Container
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"

// Card container
className="max-w-md"               // 28rem (forms)
className="max-w-4xl"              // 56rem (content)
```

---

## Focus States

### Focus Ring Pattern
```jsx
className="focus:outline-none 
           focus:ring-2 focus:ring-offset-2 
           focus:ring-blue-500 
           dark:focus:ring-blue-400"
```

### Keyboard Navigation
```jsx
// All interactive elements MUST have:
className="... 
           focus:ring-2 focus:ring-offset-2 
           focus:ring-blue-500"
```

---

## Transitions

### Duration Standards
```jsx
// Fast (interactions)
className="transition-all duration-200"

// Normal (hover states)
className="transition-colors duration-200"

// Slow (animations)
className="transition-transform duration-300"  // Use rarely
```

### Transition Properties
```jsx
// Color changes
className="transition-colors duration-200"

// All properties
className="transition-all duration-200"

// Specific property
className="transition-shadow duration-200"
className="transition-transform duration-200"
```

---

## Dark Mode Pattern

### Standard Pattern
```jsx
className="bg-white dark:bg-slate-900 
           text-slate-900 dark:text-white 
           border-slate-200 dark:border-slate-800"
```

### Muted Pattern
```jsx
className="text-slate-600 dark:text-slate-400"
```

### Inverse Pattern
```jsx
className="bg-slate-900 dark:bg-white 
           text-white dark:text-slate-900"
```

---

## Border Patterns

### Standard Border
```jsx
className="border border-slate-200 dark:border-slate-800"
```

### Top Border
```jsx
className="border-t border-slate-200 dark:border-slate-800"
```

### Bottom Border
```jsx
className="border-b border-slate-200 dark:border-slate-800"
```

### Left Border (Alerts)
```jsx
className="border-l-4 border-red-600"
```

---

## Accessibility Patterns

### Focus State (Required)
```jsx
className="focus:outline-none 
           focus:ring-2 focus:ring-offset-2 
           focus:ring-blue-500"
```

### Hover State
```jsx
className="hover:bg-slate-100 dark:hover:bg-slate-800 
           transition-colors duration-200"
```

### Active State
```jsx
className="active:scale-95 
           transition-transform duration-150"
```

### Disabled State
```jsx
className="disabled:opacity-50 
           disabled:cursor-not-allowed"
```

---

## Common Component Patterns

### Flex Container - Centered
```jsx
className="flex items-center justify-center"
```

### Flex Container - Space Between
```jsx
className="flex items-center justify-between gap-4"
```

### Grid - 2 Column
```jsx
className="grid grid-cols-1 md:grid-cols-2 gap-6"
```

### Grid - 3 Column
```jsx
className="grid grid-cols-1 md:grid-cols-3 gap-6"
```

### Grid - 4 Column
```jsx
className="grid grid-cols-2 md:grid-cols-4 gap-6"
```

---

## Anti-Patterns (DO NOT USE)

### ❌ Gradient Backgrounds
```jsx
// WRONG:
className="bg-gradient-to-r from-indigo-600 via-pink-600 to-amber-600"

// RIGHT:
className="bg-blue-600"
```

### ❌ Arbitrary Colors
```jsx
// WRONG:
className="text-[#6366F1] bg-[#EC4899]"

// RIGHT:
className="text-blue-600 bg-slate-900"
```

### ❌ Oversized Borders
```jsx
// WRONG:
className="rounded-3xl rounded-full"

// RIGHT:
className="rounded-md rounded-lg"
```

### ❌ Excessive Shadows
```jsx
// WRONG:
className="shadow-2xl drop-shadow-lg"

// RIGHT:
className="shadow-sm hover:shadow-md"
```

### ❌ Scale Effects
```jsx
// WRONG:
className="hover:scale-110 hover:scale-125"

// RIGHT:
className="hover:scale-105"  // For clickable cards only
```

### ❌ Long Transitions
```jsx
// WRONG:
className="transition-all duration-500 delay-100"

// RIGHT:
className="transition-all duration-200"
```

---

## Quick Reference Card

```
PRIMARY: text-slate-900 / bg-white
ACCENT:  text-blue-600 / bg-blue-600
MUTED:   text-slate-500
BORDER:  border-slate-200
DARK:    dark:bg-slate-900 dark:text-white

BUTTON:     bg-blue-600 hover:bg-blue-700 rounded-md
INPUT:      border border-slate-300 rounded-md
CARD:       border border-slate-200 rounded-lg shadow-sm
ALERT:      border-l-4 rounded-md bg-{color}-50

H1: text-6xl font-bold
H2: text-5xl font-bold
H3: text-4xl font-bold
BODY: text-base leading-relaxed

SHADOW:     shadow-sm hover:shadow-md
FOCUS:      focus:ring-2 focus:ring-blue-500
TRANSITION: transition-all duration-200
```

---

**Design System Version**: 1.0
**Last Updated**: January 2026
**Platform**: Zarrin Blogging Platform
