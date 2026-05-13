# VidShort AI — Theme & Design System Rules

## Overview
VidShort is a dark-themed AI-powered Long to Short Video Generator SaaS application.
All design decisions must follow these rules consistently across the entire project.

---

## 🎨 Color Palette

### Brand Colors (Custom CSS Variables)
```css
--brand-primary:   #7C3AED;   /* Vivid Violet - main CTA, accents */
--brand-secondary: #06B6D4;   /* Cyan - secondary highlights */
--brand-accent:    #F59E0B;   /* Amber - badges, highlights */
--brand-gradient-start: #7C3AED;
--brand-gradient-end:   #06B6D4;
```

### Background System (Dark Theme)
```css
--bg-base:    #0A0A0F;   /* Deepest background */
--bg-surface: #111118;   /* Cards, sections */
--bg-raised:  #1A1A25;   /* Elevated cards, modals */
--bg-overlay: #22223A;   /* Hover states, popovers */
```

### Text System
```css
--text-primary:   #F8FAFC;   /* Headings, main content */
--text-secondary: #94A3B8;   /* Body text, descriptions */
--text-muted:     #475569;   /* Placeholders, disabled */
--text-inverse:   #0A0A0F;   /* Text on light backgrounds */
```

### Semantic Colors
```css
--success:     #10B981;   /* Emerald */
--warning:     #F59E0B;   /* Amber */
--error:       #EF4444;   /* Red */
--info:        #3B82F6;   /* Blue */
```

---

## 🔤 Typography

### Font Family
- **Headings**: `Syne` (Google Fonts) — Bold, futuristic feel
- **Body**: `Inter` (Google Fonts) — Clean, readable
- **Mono/Code**: `JetBrains Mono` — Technical elements

### Font Scale
```
Display (Hero):  clamp(3rem, 7vw, 5.5rem)  / font-weight: 800
H1:              clamp(2rem, 4vw, 3.5rem)   / font-weight: 700
H2:              clamp(1.5rem, 3vw, 2.5rem) / font-weight: 700
H3:              clamp(1.25rem, 2vw, 1.75rem)/ font-weight: 600
Body Large:      1.125rem                   / font-weight: 400
Body:            1rem                       / font-weight: 400
Small:           0.875rem                   / font-weight: 400
Micro:           0.75rem                    / font-weight: 500
```

---

## 🌀 Gradients

### Primary Brand Gradient
```css
background: linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%);
```

### Hero Radial Glow
```css
background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.25) 0%, transparent 70%);
```

### Text Gradient (Headings)
```css
background: linear-gradient(135deg, #A78BFA 0%, #67E8F9 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Card Glow Border
```css
border: 1px solid rgba(124, 58, 237, 0.3);
box-shadow: 0 0 24px rgba(124, 58, 237, 0.12);
```

---

## 🃏 Card Styles

### Standard Card
```css
background: rgba(17, 17, 24, 0.8);
border: 1px solid rgba(255, 255, 255, 0.06);
border-radius: 1rem;
backdrop-filter: blur(12px);
```

### Highlight / Feature Card (with glow)
```css
background: rgba(26, 26, 37, 0.9);
border: 1px solid rgba(124, 58, 237, 0.3);
box-shadow: 0 0 40px rgba(124, 58, 237, 0.1);
border-radius: 1.25rem;
```

### Pricing Card (Popular)
```css
background: linear-gradient(160deg, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.08) 100%);
border: 1px solid rgba(124, 58, 237, 0.5);
box-shadow: 0 8px 48px rgba(124, 58, 237, 0.2);
```

---

## ✨ Animations & Micro-interactions

### Principles
1. All animations use `ease-out` or `cubic-bezier(0.16, 1, 0.3, 1)` for snappiness
2. Hover transitions: `150ms–300ms`
3. Page-entry animations: `600ms–1000ms` with `opacity + translateY`
4. Avoid excessive motion — follow `prefers-reduced-motion`

### Standard Hover Effect (Buttons / Cards)
```css
transition: transform 200ms ease-out, box-shadow 200ms ease-out;
&:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(124, 58, 237, 0.25);
}
```

### Glow Pulse (CTA Buttons)
```css
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(124,58,237,0.4); }
  50%       { box-shadow: 0 0 40px rgba(124,58,237,0.7); }
}
animation: glow-pulse 3s ease-in-out infinite;
```

### Floating Animation (Decorative)
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-12px); }
}
animation: float 6s ease-in-out infinite;
```

### Shimmer Effect (Skeleton / Loading)
```css
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%);
background-size: 200% 100%;
animation: shimmer 2s infinite;
```

---

## 📐 Spacing & Layout

### Container
```css
max-width: 1280px;
margin: 0 auto;
padding: 0 1.5rem;  /* mobile */
padding: 0 2rem;    /* tablet */
padding: 0 4rem;    /* desktop */
```

### Section Spacing
```css
padding-top:    5rem;   /* 80px */
padding-bottom: 5rem;
```

### Border Radius Scale
```
xs:  4px
sm:  8px
md:  12px
lg:  16px
xl:  24px
2xl: 32px
pill: 9999px
```

---

## 🧩 Component Rules

### Buttons
- **Primary**: Gradient bg (#7C3AED → #06B6D4), white text, subtle glow on hover
- **Secondary**: Transparent bg, `border: 1px solid rgba(255,255,255,0.15)`, white text
- **Ghost**: No border, muted text, slight bg on hover
- All buttons: `border-radius: 0.625rem`, `padding: 0.625rem 1.5rem`

### Badges
- Use `--brand-primary` with 15% opacity background
- Font: `Micro` size, uppercase, letter-spacing: 0.08em

### Inputs
- Background: `rgba(255,255,255,0.04)`
- Border: `1px solid rgba(255,255,255,0.1)`
- Focus border: `rgba(124, 58, 237, 0.6)`
- Glow on focus: `box-shadow: 0 0 0 3px rgba(124,58,237,0.15)`

### Navigation
- Transparent on top, `backdrop-filter: blur(16px)` + subtle border when scrolled
- Active link: gradient underline using brand colors

---

## 🌐 Responsive Breakpoints
```
Mobile:  < 640px
Tablet:  640px – 1024px
Desktop: > 1024px
Large:   > 1280px
```

---

## ♿ Accessibility Rules
1. Maintain WCAG AA contrast ratios at minimum
2. All interactive elements must have `:focus-visible` styles
3. Respect `prefers-reduced-motion` — wrap animations in `@media`
4. Use semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
5. All images and icons must have descriptive `alt` text or `aria-label`

---

## 🚫 Anti-Patterns (Never Do)
- Do NOT use pure white/black backgrounds
- Do NOT use generic system fonts
- Do NOT use flat, solid-color buttons without hover states
- Do NOT omit `transition` on interactive elements
- Do NOT use light theme components without `.dark` variant override
- Do NOT add border-radius above `2xl` on non-pill elements
- Do NOT stack more than 3 gradients on the same element
