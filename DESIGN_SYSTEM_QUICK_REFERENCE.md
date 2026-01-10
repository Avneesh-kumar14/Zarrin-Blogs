# Quick Design System Reference - Zarrin Blog

## Gradient Combos (Copy & Paste)

### Primary Gradients
```jsx
// Indigo to Purple
className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]"

// Pink
className="bg-gradient-to-r from-[#EC4899] to-[#F472B6]"

// Cyan to Indigo
className="bg-gradient-to-r from-[#06B6D4] to-[#6366F1]"

// Orange to Pink
className="bg-gradient-to-r from-[#FB923C] to-[#F472B6]"

// 45-degree angle
className="bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]"
```

---

## Card Components

### Standard Card with Hover
```jsx
<div className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all rounded-2xl bg-white dark:bg-slate-800">
  {/* Content */}
</div>
```

### Card with Top Border
```jsx
<a className={`group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all rounded-2xl`}>
  <div className={`h-1 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]`}></div>
  {/* Content */}
</a>
```

### Badge
```jsx
<span className="inline-flex items-center gap-2 px-4 py-2 bg-[#6366F1]/10 rounded-full border border-[#6366F1]/20">
  <Icon size={16} className="text-[#6366F1]" />
  <span className="text-sm font-semibold text-[#6366F1]">Label</span>
</span>
```

---

## Hero Section Pattern

```jsx
<section className="relative overflow-hidden bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#EC4899] pt-20 pb-20">
  {/* Animated Background */}
  <div className="absolute inset-0">
    <div className="absolute top-20 left-20 w-72 h-72 bg-[#6366F1]/20 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#EC4899]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-4">
    {/* Content */}
  </div>
</section>
```

---

## Button Styles

### Primary Button
```jsx
<a className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-white to-pink-100 hover:from-pink-50 hover:to-white text-purple-700 font-bold rounded-lg transition-all hover:shadow-2xl group">
  Action Text
  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
</a>
```

### Secondary Button
```jsx
<a className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white hover:bg-white/10 text-white font-bold rounded-lg transition-all">
  Secondary Action
</a>
```

### Outlined Button
```jsx
<button className="px-6 py-3 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-all font-semibold">
  Button Text
</button>
```

---

## Grid Layouts

### 3-Column Grid (Desktop)
```jsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
  {items.map(item => (...))}
</div>
```

### 4-Column Grid (Desktop)
```jsx
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
  {items.map(item => (...))}
</div>
```

### Auto-responsive
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {items.map(item => (...))}
</div>
```

---

## Hover Effects

### Scale on Hover
```jsx
className="group-hover:scale-110 transition-transform"
```

### Color Change on Hover
```jsx
className="group-hover:text-[#6366F1] transition-colors"
```

### Shadow on Hover
```jsx
className="shadow-lg hover:shadow-2xl transition-all"
```

### Combined Hover
```jsx
className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3"
```

---

## Text Styles

### Section Heading
```jsx
<h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
  Main Heading
</h2>
```

### Subheading
```jsx
<p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
  Description text
</p>
```

### Gradient Text
```jsx
<span className="bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text text-transparent">
  Highlighted Text
</span>
```

### Small Text
```jsx
<p className="text-sm text-gray-600 dark:text-gray-400">
  Meta information
</p>
```

---

## Avatar Pattern

```jsx
<div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-slate-800 shadow-xl">
  {name.charAt(0)}
</div>
```

---

## Icon Box Pattern

```jsx
<div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
  <Icon className="w-6 h-6" />
</div>
```

---

## Section Pattern

```jsx
<section className="py-20 bg-white dark:bg-slate-950">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Header */}
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold mb-4">Title</h2>
      <p className="text-lg text-gray-600 dark:text-gray-400">Subtitle</p>
    </div>

    {/* Content Grid */}
    <div className="grid md:grid-cols-3 gap-8">
      {/* Items */}
    </div>
  </div>
</section>
```

---

## Dark Mode Classes

```jsx
// Dark mode background
className="bg-white dark:bg-slate-800"
className="bg-gray-50 dark:bg-slate-900"

// Dark mode text
className="text-gray-900 dark:text-white"
className="text-gray-600 dark:text-gray-400"

// Dark mode border
className="border-gray-200 dark:border-slate-700"

// Dark mode opacity
className="bg-black/10 dark:bg-white/10"
```

---

## Animation Classes

```jsx
// Pulse (for backgrounds)
className="animate-pulse"

// Spin (for loaders)
className="animate-spin"

// Scale
className="group-hover:scale-110"

// Translate
className="group-hover:translate-x-1"

// Transition
className="transition-all duration-300"
```

---

## Responsive Breakpoints

```jsx
// Mobile First
{/* Always visible */}
// md: 768px
className="hidden md:flex"
className="md:grid-cols-2"
// lg: 1024px  
className="lg:grid-cols-3"
className="lg:text-left"
// xl: 1280px
className="xl:max-w-7xl"
```

---

## Common Component Combinations

### Featured Article Card
```jsx
<a href={url} className="group overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all cursor-pointer">
  <div className="h-1 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]"></div>
  
  <div className="relative h-48 overflow-hidden">
    <img src={image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
  </div>

  <div className="p-6">
    <h3 className="text-xl font-bold line-clamp-2 group-hover:text-[#6366F1]">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{description}</p>
  </div>
</a>
```

### Author Bio Card
```jsx
<div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg overflow-hidden">
  <div className="h-24 bg-gradient-to-br from-[#6366F1] via-[#EC4899] to-[#8B5CF6]"></div>
  
  <div className="p-6 -mt-12 relative">
    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center text-white text-2xl font-bold">
      {name[0]}
    </div>
    
    <h3 className="text-xl font-bold mt-4 mb-1">{name}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">{specialty}</p>
  </div>
</div>
```

---

## Performance Tips

1. **Use CSS gradients** - GPU accelerated
2. **Minimize animations** - JavaScript animations are expensive
3. **Lazy load images** - Load on scroll
4. **Cache backgrounds** - Reuse gradients
5. **Compress images** - Reduce file sizes

---

## Testing Checklist

- [ ] Mobile responsive (320px - 768px)
- [ ] Tablet layout (768px - 1024px)
- [ ] Desktop layout (1024px+)
- [ ] Dark mode enabled
- [ ] All hover states work
- [ ] Gradients display correctly
- [ ] Animations smooth
- [ ] Accessibility (contrast, focus states)
- [ ] Links work correctly
- [ ] Images load properly

---

**Quick Start**: Copy any pattern above and customize the colors/content for your needs!

