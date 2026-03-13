# 🎨 Global CSS Reference - Settings Page Styles

**Location:** `zarrin_blogs/src/index.css`  
**Added:** February 26, 2026  
**Type:** Global Tailwind + Custom Components

---

## 📍 CSS Classes Reference

### Container Classes

```css
.settings-container
  Purpose: Main settings page wrapper
  Style: Min height screen, gradient background
  Responsive: Full width padding on mobile

.settings-content
  Purpose: Content wrapper
  Style: Max width 2xl (672px), centered
  Responsive: Margins auto
```

### Header Classes

```css
.settings-header
  Purpose: Page title section
  Style: Text center, margin bottom

.settings-header h1
  Purpose: Main title
  Style: 4xl font, gradient text (blue→purple)
  Text: Transparent gradient

.settings-header p
  Purpose: Subtitle
  Style: lg font, gray text
  Responsive: Adjusts on smaller screens
```

### Alert Classes

```css
.settings-alert
  Purpose: Success/error/warning messages
  Style: Padding, animation, rounded
  Animation: Fade in + slide from top

.settings-alert-success
  Purpose: Green alert for success
  Style: Green background, text, border
  Dark Mode: Green-900 bg, green-200 text

.settings-alert-error
  Purpose: Red alert for errors
  Style: Red background, text, border
  Dark Mode: Red-900 bg, red-200 text

.settings-alert-warning
  Purpose: Yellow alert for warnings
  Style: Yellow background, text, border
  Dark Mode: Yellow-900 bg, yellow-200 text
```

### Card Classes

```css
.settings-card
  Purpose: Content cards (account info, email, etc)
  Style: White/dark bg, rounded, shadow, padding
  Hover: Enhanced shadow, scale up on hover
  Border: Gray/slate border

.settings-card-danger
  Purpose: Danger zone card styling
  Style: Red border for danger actions
  Use Case: Logout button card

.settings-card-title
  Purpose: Card section titles
  Style: 2xl font, bold, gray text
  Margin: Bottom margin for spacing
```

### Info Row Classes

```css
.settings-info-row
  Purpose: Display label-value pairs
  Style: Flex between, padding, border bottom
  Spacing: Vertical padding, last row no border

.settings-label
  Purpose: Info label (Email:, Name:, etc)
  Style: Gray text, bold/semibold
  Width: Left side of row

.settings-value
  Purpose: Info value (actual email, name, etc)
  Style: Dark text, semibold
  Width: Right side of row
```

### Verification Header Classes

```css
.settings-verification-header
  Purpose: Email verification section header
  Style: Flex between items, centered
  Contains: Title on left, badge on right

.settings-badge
  Purpose: Status indicator
  Style: Padding, rounded, small font
  Types: .settings-badge-verified, .settings-badge-pending

.settings-badge-verified
  Purpose: Green verified badge
  Style: Green background and text
  Status: Email is verified

.settings-badge-pending
  Purpose: Yellow pending badge
  Style: Yellow background and text
  Status: Email not yet verified
```

### Description & Button Classes

```css
.settings-description
  Purpose: Explain current status
  Style: Gray text, margin bottom, line height
  Use: Explains what email verification means

.settings-btn
  Purpose: Base button styles
  Style: Padding, rounded, font semibold, transitions
  State: Disabled state with reduced opacity
  Width: Full width (100%)

.settings-btn-primary
  Purpose: Primary action button (blue)
  Style: Blue-600 background, white text
  Hover: Blue-700 on hover
  Active: Scale 95% on click

.settings-btn-success
  Purpose: Success button (green)
  Style: Green-600 background, white text
  Hover: Green-700 on hover
  Active: Scale 95% on click

.settings-btn-danger
  Purpose: Danger button (red) - for logout
  Style: Red-600 background, white text
  Hover: Red-700 on hover
  Active: Scale 95% on click

.settings-btn:disabled
  Purpose: Disabled button state
  Style: Opacity 60%, not allowed cursor
```

### OTP Section Classes

```css
.settings-otp-section
  Purpose: OTP input section wrapper
  Style: Gray background, padding, rounded
  Border: Visible border for distinction
  Margin: Top margin for spacing

.settings-otp-title
  Purpose: OTP section title
  Style: Large font, bold, dark text
  Margin: Bottom margin

.settings-otp-input
  Purpose: 6-digit OTP input field
  Style: Center text, tracking-widest (wide spacing)
  Font: 2xl size, bold, monospace-like
  Border: 2px border, rounded
  Focus: Blue border on focus
  Dark Mode: Dark background for dark mode
```

### Info Box Classes

```css
.settings-info
  Purpose: Information/tips section
  Style: Blue background, border, padding, text
  Use: Explain benefits of email verification

.settings-info h3
  Purpose: Info section title
  Style: XL font, bold, margin bottom

.settings-info ul
  Purpose: Info list
  Style: Disc bullets, list indent, spacing

.settings-info li
  Purpose: Info list items
  Style: Blue text, proper contrast
  Dark Mode: Blue-200 on dark background
```

### Loading & Special Classes

```css
.settings-loading
  Purpose: Loading state container
  Style: Full height flex centered
  Use: While user data is loading
```

---

## 🎨 Color Palette Used

### Light Mode
- **Background:** Gray-50 to Gray-100
- **Cards:** White with Gray-200 border
- **Text:** Gray-900 (dark text)
- **Labels:** Gray-700
- **Badges:** Green-100 (verified), Yellow-100 (pending)
- **Buttons:** Blue-600, Green-600, Red-600

### Dark Mode (Dark-scheme)
- **Background:** Slate-950 to Slate-900
- **Cards:** Slate-800 with Slate-700 border
- **Text:** White / Gray-100
- **Labels:** Gray-300
- **Badges:** Green-900/30 (verified), Yellow-900/30 (pending)
- **Buttons:** Same colors, work in dark

---

## ✨ Interactive States

### Button States
```css
Normal   → Blue-600, cursor pointer, scale 100%
Hover    → Blue-700, shadow enhancement
Active   → Scale 95% (pressed effect)
Disabled → Opacity 60%, not-allowed cursor, color unchanged
```

### Input States
```css
Normal   → Gray-300 border, white background
Focus    → Blue-600 border, enhanced appearance
Disabled → Opacity reduced
```

### Alert States
```css
Success  → Green theme, fade-in animation
Error    → Red theme, fade-in animation
Warning  → Yellow theme, fade-in animation
```

---

## 📐 Responsive Design

### Mobile (< 640px)
- Full width with padding
- Stacked layout for cards
- Buttons full width
- Text responsive

### Tablet (640px - 1024px)
- Max width maintained
- Comfortable spacing
- Touch-friendly buttons
- Centered content

### Desktop (> 1024px)
- Max width 672px (2xl)
- Centered with auto margins
- Hover effects visible
- Smooth transitions

---

## 🔄 Animation Classes

### Entry Animations
```css
.settings-alert
  Animation: fade-in + slide-in-from-top
  Duration: 300ms
  Effect: Smooth top-to-bottom appearance
```

### Transition Classes
```css
All buttons have:
  transition-all
  duration-300
  
All cards have:
  transition-all (on hover for shadow)
  duration-300
```

---

## 🖼️ Layout Structure

```html
<div class="settings-container">
  ├─ Alert (if needed)
  │  └─ .settings-alert-{type}
  │
  └─ .settings-content
      ├─ .settings-header
      │  └─ h1, p
      │
      ├─ .settings-card
      │  ├─ .settings-verification-header
      │  │  ├─ .settings-card-title
      │  │  └─ .settings-badge
      │  │
      │  └─ .settings-description
      │  └─ .settings-btn (Send OTP / Verify)
      │  └─ .settings-otp-section (if needed)
      │      ├─ .settings-otp-title
      │      ├─ .settings-otp-input
      │      └─ .settings-btn
      │
      ├─ .settings-card (Account Info)
      │  ├─ .settings-info-row
      │  │  ├─ .settings-label
      │  │  └─ .settings-value
      │
      ├─ .settings-card.settings-card-danger
      │  └─ .settings-btn.settings-btn-danger
      │
      └─ .settings-info
         ├─ h3
         └─ ul > li
```

---

## 🎯 How to Customize

### Change Colors
```css
/* In index.css, find .settings-btn-primary */
.settings-btn-primary {
  @apply bg-blue-600;     /* Change from blue-600 to your color */
  @apply hover:bg-blue-700; /* Change hover color */
}
```

### Change Fonts
```css
/* In index.css, find .settings-header h1 */
.settings-header h1 {
  @apply text-4xl;  /* Change text size */
  @apply font-bold; /* Change weight */
}
```

### Change Spacing
```css
/* In index.css, find .settings-card */
.settings-card {
  @apply p-6;    /* Change padding from 6 to desired value */
  @apply mb-6;   /* Change margin bottom */
}
```

### Add More Animations
```css
/* Add to @layer components */
.settings-fade-in {
  @apply animate-in fade-in duration-500;
}
```

---

## 🔗 Dependencies

Only Tailwind CSS used, no external libraries:
- ✅ Tailwind CSS (@apply directives)
- ✅ No Bootstrap
- ✅ No Material-UI
- ✅ No custom SCSS

---

## ✅ Verified Features

- [x] Light & dark mode support
- [x] Responsive design (mobile, tablet, desktop)
- [x] All interactive states (hover, active, disabled)
- [x] Smooth animations and transitions
- [x] Alert message styling (success, error, warning)
- [x] Form inputs with focus states
- [x] Buttons with loading states
- [x] Badges for status indication
- [x] Card-based layout
- [x] Gradient text support

---

## 🎉 Summary

All Settings page styles are now **in one place** (`index.css`):
- No separate CSS files
- Easy to find and modify
- Global scope (available everywhere)
- Consistent with app design
- Fully responsive
- Dark mode ready

**Total CSS Added:** ~160 lines to index.css  
**All Classes:** Start with `.settings-` prefix for easy identification

---

**Created:** February 26, 2026  
**Status:** ✅ Complete & Production Ready
