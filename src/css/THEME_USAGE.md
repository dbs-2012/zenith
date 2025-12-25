# Theme System Usage Guide

## Overview
The Zenith Dashboard uses a centralized CSS variable-based theme system defined in `theme.css`. This allows for consistent styling across all pages and easy theme customization.

## Quick Start

### Using Theme Variables in Your CSS

Instead of hardcoding colors, use the predefined CSS variables:

```css
/* ❌ DON'T DO THIS */
.my-component {
    background: rgba(255, 255, 255, 0.95);
    color: rgba(0, 0, 0, 0.9);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

/* ✅ DO THIS */
.my-component {
    background: var(--surface-primary);
    color: var(--text-primary);
    box-shadow: var(--shadow-md);
}
```

## Available Theme Variables

### Background Colors
- `--bg-gradient` - Main background gradient
- `--bg-solid` - Solid background color
- `--surface-primary` - Primary surface (cards, panels)
- `--surface-secondary` - Secondary surface
- `--surface-card` - Card backgrounds

### Text Colors
- `--text-primary` - Primary text (headings, important text)
- `--text-secondary` - Secondary text (body text)
- `--text-muted` - Muted text (hints, placeholders)
- `--text-disabled` - Disabled text

### Border Colors
- `--border-primary` - Primary borders
- `--border-secondary` - Secondary borders
- `--border-focus` - Focus state borders
- `--border-glow` - Glowing borders (dark theme only)

### Accent Colors

**Gradients:**
- `--accent-gradient-primary` - Primary gradient (blue to purple)
- `--accent-gradient-secondary` - Secondary gradient (orange)
- `--accent-gradient-tertiary` - Tertiary gradient (cyan to pink)

**Solid Colors:**
- `--accent-blue` - Blue accent
- `--accent-purple` - Purple accent
- `--accent-orange` - Orange accent
- `--accent-cyan` - Cyan accent
- `--accent-pink` - Pink accent

### Interactive States
- `--hover-overlay` - Hover state background
- `--active-overlay` - Active state background
- `--focus-ring` - Focus ring color

### Shadows
- `--shadow-xs` - Extra small shadow
- `--shadow-sm` - Small shadow
- `--shadow-md` - Medium shadow
- `--shadow-lg` - Large shadow
- `--shadow-xl` - Extra large shadow

**Dark Theme Glows:**
- `--glow-cyan-sm/md/lg` - Cyan glow effects
- `--glow-purple-sm/md` - Purple glow effects
- `--glow-pink-sm` - Pink glow effects
- `--shadow-glow-sm/md/lg` - Combined shadow + glow
- `--inset-glow-sm/md/lg` - Inset glow effects

### Effects
- `--backdrop-blur` - Backdrop blur filter
- `--backdrop-blur-strong` - Strong backdrop blur
- `--transition-fast` - Fast transition (0.15s)
- `--transition-normal` - Normal transition (0.3s)
- `--transition-slow` - Slow transition (0.5s)

### Scrollbar
- `--scrollbar-track` - Scrollbar track color
- `--scrollbar-thumb` - Scrollbar thumb color
- `--scrollbar-thumb-hover` - Scrollbar thumb hover color

## Examples

### Creating a Card Component

```css
.my-card {
    background: var(--surface-card);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: var(--shadow-md);
    transition: var(--transition-normal);
}

.my-card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
}

.my-card-title {
    color: var(--text-primary);
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.my-card-description {
    color: var(--text-muted);
    font-size: 0.95rem;
}
```

### Creating a Button

```css
.my-button {
    background: var(--accent-gradient-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: var(--transition-normal);
    box-shadow: var(--shadow-sm);
}

.my-button:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
}
```

### Using Text Gradients

```css
.gradient-text {
    background: var(--accent-gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
```

## Theme-Specific Styling

If you need different styles for light and dark themes:

```css
/* Light theme (default) */
.my-component {
    /* Light theme styles using variables */
}

/* Dark theme specific */
.layout-container[data-theme="dark"] .my-component {
    /* Override with dark theme specific styles if needed */
    /* Usually not necessary if using variables correctly */
}
```

## Best Practices

1. **Always use CSS variables** instead of hardcoded colors
2. **Use semantic variable names** (e.g., `--text-primary` not `--color-black`)
3. **Test both themes** when creating new components
4. **Avoid theme-specific overrides** - let the variables handle it
5. **Use consistent spacing** and sizing across components
6. **Leverage shadow variables** for depth and elevation
7. **Use transition variables** for consistent animations

## Adding New Pages

When creating a new page:

1. Import your page-specific CSS file
2. Use theme variables for all colors and effects
3. Test theme switching to ensure consistency
4. Follow the existing component patterns

Example page structure:

```jsx
// MyPage.jsx
import '../css/MyPage.css';

function MyPage() {
    return (
        <div className="resource-page">
            <div className="page-header">
                <h1 className="page-title">My Page</h1>
                <p className="page-subtitle">Page description</p>
            </div>
            <div className="page-content">
                {/* Your content */}
            </div>
        </div>
    );
}
```

```css
/* MyPage.css */
/* Use existing classes from ResourcePage.css or create new ones using theme variables */
```

## Modifying the Theme

To change theme colors globally, edit `src/css/theme.css`:

1. Locate the variable you want to change
2. Update its value in both `:root` (light theme) and `.layout-container[data-theme="dark"]` (dark theme)
3. Save the file - changes will apply immediately with hot reload

## Troubleshooting

**Theme not switching?**
- Check that `data-theme` attribute is on `.layout-container`
- Verify theme.css is imported in index.css

**Colors not updating?**
- Make sure you're using `var(--variable-name)` syntax
- Check for typos in variable names
- Ensure the variable exists in theme.css

**Inconsistent styling?**
- Review if you're using hardcoded colors instead of variables
- Check if theme-specific overrides are conflicting
