# Creating a Template from Your Portfolio - Advanced Guide

## What Makes a Great Template?

Your portfolio becomes a **reusable design system** that can generate unlimited client sites in your signature style.

## Template Anatomy

When you upload your portfolio, it becomes:

```
data/templates/
  standard/
    my-portfolio-style/
      ├── template.json          ← Auto-generated spec
      ├── [your entire codebase]
      ├── content/
      │   ├── site.json         ← Client details go here
      │   └── sections.json     ← Section config
      └── [all other files]
```

## Template Spec (template.json)

This is auto-generated but you can enhance it:

```json
{
  "templateId": "my-portfolio-style",
  "name": "My Portfolio Style",
  "description": "Modern portfolio design with dark theme",
  "frameworkType": "nextjs-app",
  "version": "1.0.0",

  "tokens": {
    "colors": {
      "primary": "#3b82f6",      ← Extracted from tailwind.config
      "secondary": "#8b5cf6",
      "accent": "#f59e0b",
      "background": "#0a0a0a",
      "surface": "#1a1a1a",
      "text": "#ffffff",
      "muted": "#6b7280",
      "border": "#27272a"
    },
    "typography": {
      "fontFamilyHeading": "Montserrat",  ← Your brand fonts
      "fontFamilyBody": "Inter",
      "baseFontSize": "16px"
    },
    "spacing": {
      "layoutMaxWidth": "1280px",
      "borderRadius": "0.5rem"
    }
  },

  "sections": [
    {
      "id": "hero",
      "label": "Hero Section",
      "enabled": true,
      "order": 1,
      "contentFields": ["title", "subtitle", "cta"],
      "mediaFields": ["background", "portrait"]
    },
    {
      "id": "services",
      "label": "Services",
      "enabled": true,
      "order": 2,
      "contentFields": ["title", "items"],
      "mediaFields": []
    }
    // ... more sections
  ],

  "fileMap": {
    "logo": "public/logo.svg",           ← Where to place client logo
    "heroMedia": "public/hero.jpg",      ← Where to place hero image
    "contentJson": "content/site.json",  ← Where content is stored
    "themeConfig": "tailwind.config.ts", ← Where to apply colors
    "cssVariables": "src/app/globals.css"
  },

  "replacementStrategy": {
    "colors": "both",        ← Apply to tailwind AND css vars
    "typography": "both",
    "content": "json-file"
  }
}
```

## Best Practices

### 1. Clean Component Structure

**Good Example:**
```tsx
// components/Hero.tsx
import siteContent from '@/content/site.json';

export function Hero() {
  const { hero } = siteContent;

  return (
    <section className="bg-background">
      <h1 className="font-display text-primary">
        {hero.title}
      </h1>
      <p className="text-muted">
        {hero.subtitle}
      </p>
    </section>
  );
}
```

**Why it works:**
- Uses Tailwind classes (easy to restyle)
- Reads from content/site.json (easy to replace)
- Uses semantic color names (primary, muted)

### 2. Centralized Content

**Create content/site.json:**
```json
{
  "site": {
    "name": "Your Company Name",
    "tagline": "Your Tagline Here",
    "description": "Your description"
  },
  "hero": {
    "title": "Welcome to Your Site",
    "subtitle": "We do amazing things",
    "cta": {
      "label": "Get Started",
      "link": "/contact"
    }
  },
  "services": {
    "title": "Our Services",
    "items": [
      {
        "title": "Service 1",
        "description": "Description here"
      }
    ]
  },
  "contact": {
    "email": "hello@example.com",
    "phone": "1-800-555-0123",
    "address": "123 Main St"
  }
}
```

### 3. Semantic Tailwind Classes

**Instead of:**
```tsx
<button className="bg-blue-500 text-white">Click</button>
```

**Use:**
```tsx
<button className="bg-primary text-primary-foreground">Click</button>
```

Then in tailwind.config:
```javascript
colors: {
  primary: colors.blue[500],
  'primary-foreground': colors.white,
}
```

### 4. Flexible Layouts

Use Tailwind's responsive utilities:
```tsx
<div className="container mx-auto max-w-7xl px-4">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Content */}
  </div>
</div>
```

## How Generation Uses Your Template

When someone generates a site from your template:

### Step 1: Copy Template
```
data/templates/standard/my-portfolio-style/
  → copied to →
data/generated/client-site-name/
```

### Step 2: Apply Brand Tokens

**Your colors:**
```javascript
// tailwind.config.ts (original)
colors: {
  primary: '#3b82f6',  // Your blue
}
```

**Becomes client's colors:**
```javascript
// tailwind.config.ts (generated)
colors: {
  primary: '#10b981',  // Client's green
}
```

### Step 3: Replace Content

**Your content:**
```json
{
  "site": {
    "name": "Your Portfolio",
    "tagline": "Designer & Developer"
  }
}
```

**Becomes:**
```json
{
  "site": {
    "name": "Acme Plumbing",
    "tagline": "Expert Plumbing Services"
  }
}
```

### Step 4: Apply Typography

**Your fonts:**
```css
:root {
  --font-heading: 'Montserrat', sans-serif;
}
```

**Becomes client's fonts:**
```css
:root {
  --font-heading: 'Roboto', sans-serif;
}
```

## Example: Portfolio → Client Site

**Your Portfolio:**
- Dark theme with blue accents
- Montserrat + Inter fonts
- Gradient backgrounds
- Modern, minimal sections

**Generated Client Site:**
- Same layout structure ✅
- Same section patterns ✅
- Client's brand colors (green instead of blue) ✅
- Client's fonts (Roboto instead of Montserrat) ✅
- Client's content (plumbing services instead of portfolio) ✅
- Still feels like YOUR design style ✅

## Troubleshooting

### Template Upload Fails

**Error: "Not a valid Next.js project"**
```bash
# Make sure you have:
- package.json with "next" in dependencies
- next.config.js or next.config.ts
- app/ or pages/ directory
```

**Error: "No Tailwind config found"**
```bash
# Create tailwind.config.js:
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#yourcolor',
      }
    }
  }
}
```

**Error: "Template too large"**
```bash
# Reduce size by excluding:
- node_modules (always excluded)
- .next or dist folders
- Large media files (use placeholders)
- Git history (.git folder)

# Re-create ZIP without these
```

### Template Status: "Processing" Forever

Check Render logs for:
- Memory issues (free tier = 512MB)
- Timeout issues (large templates take time)
- Missing dependencies

### Generated Site Doesn't Look Right

**Colors not applied:**
- Check that Tailwind config uses theme.extend.colors
- Verify CSS variables are in :root

**Fonts not changing:**
- Check font imports in layout.tsx
- Verify font names in tailwind.config

**Content not updating:**
- Verify components read from content/site.json
- Check that file paths are correct

## Tips for Different Portfolio Types

### Portfolio Type: Developer Portfolio
```
Good for generating:
- Tech startup sites
- SaaS landing pages
- Agency websites
```

### Portfolio Type: Creative/Design Portfolio
```
Good for generating:
- Creative agency sites
- Art gallery sites
- Design studio websites
```

### Portfolio Type: Business Portfolio
```
Good for generating:
- Professional services
- Consulting firms
- Corporate websites
```

## Advanced: Multiple Templates from One Portfolio

Create variations:

**Upload 1: "Portfolio Light"**
- Light theme variant
- Tags: light, minimal, clean

**Upload 2: "Portfolio Dark"**
- Dark theme variant
- Tags: dark, modern, bold

**Upload 3: "Portfolio Gradient"**
- Gradient accents
- Tags: gradient, colorful, vibrant

Each uses your design system but different aesthetics!

## Next Steps

1. ✅ Upload your portfolio as a template
2. ✅ Test generate a site using it
3. ✅ Refine the template based on results
4. ✅ Create variations for different use cases
5. ✅ Build your template library

Your portfolio style becomes infinitely reusable! 🎨
