# Custom React Scrollbar Component

## Overview

A professional, theme-aware React scrollbar component built with `react-custom-scrollbars-2` that provides a better visual experience with automatic theme adaptation.

## Features

- **🎨 Theme Aware**: Blue scrollbar for light theme, yellow for dark theme
- **📏 Multiple Variants**: Default, thin, thick, and minimal sizes
- **🔄 Auto Hide**: Scrollbar automatically fades when not in use
- **⚡ Smooth**: Butter-smooth scrolling experience
- **📱 Responsive**: Works perfectly on all screen sizes
- **🎭 CSS-based**: No inline styles, fully CSS-driven for performance

## Color Scheme

### Light Theme
- **Thumb Color**: `hsl(220, 90%, 56%)` - Professional blue
- **Hover Color**: `hsl(220, 90%, 65%)` - Lighter blue on hover
- **Track Color**: `hsl(220, 15%, 97%)` - Light gray background

### Dark Theme
- **Thumb Color**: `hsl(47, 96%, 53%)` - Vibrant yellow
- **Hover Color**: `hsl(47, 96%, 60%)` - Lighter yellow on hover
- **Track Color**: `hsl(24, 9%, 12%)` - Dark background

## Installation

The component is already installed with `react-custom-scrollbars-2`:

```bash
bun add react-custom-scrollbars-2
```

## Basic Usage

```tsx
import CustomScrollbar from '@/components/ui/custom-scrollbar';

function MyComponent() {
  return (
    <CustomScrollbar height="400px">
      <div>
        {/* Your scrollable content */}
      </div>
    </CustomScrollbar>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Content to be scrolled |
| `className` | `string` | - | Additional CSS classes |
| `height` | `string \| number` | - | Fixed height of the scrollable area |
| `width` | `string \| number` | - | Fixed width of the scrollable area |
| `maxHeight` | `string \| number` | - | Maximum height of the scrollable area |
| `variant` | `'default' \| 'thin' \| 'thick' \| 'minimal'` | `'default'` | Scrollbar size variant |
| `autoHide` | `boolean` | `true` | Whether to auto-hide scrollbar |
| `autoHideTimeout` | `number` | `1000` | Auto-hide delay in ms |
| `autoHideDuration` | `number` | `200` | Auto-hide animation duration in ms |
| `thumbMinSize` | `number` | `30` | Minimum size of scroll thumb |
| `universal` | `boolean` | `true` | Universal scrollbar support |

## Variants

### Default (8px width)
Perfect for most use cases, balanced visibility and space efficiency.

```tsx
<CustomScrollbar height="400px" variant="default">
  {/* Content */}
</CustomScrollbar>
```

### Thin (6px width)
Subtle scrollbar for clean, minimal interfaces.

```tsx
<CustomScrollbar height="400px" variant="thin">
  {/* Content */}
</CustomScrollbar>
```

### Thick (12px width)
More prominent scrollbar for better accessibility and visibility.

```tsx
<CustomScrollbar height="400px" variant="thick">
  {/* Content */}
</CustomScrollbar>
```

### Minimal (4px width)
Ultra-thin scrollbar for maximum content space.

```tsx
<CustomScrollbar height="400px" variant="minimal">
  {/* Content */}
</CustomScrollbar>
```

## Real-World Examples

### Recipe List
```tsx
<CustomScrollbar 
  height="600px" 
  variant="default"
  className="border rounded-lg p-4"
>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {recipes.map((recipe) => (
      <RecipeCard key={recipe.id} recipe={recipe} />
    ))}
  </div>
</CustomScrollbar>
```

### Data Analysis Grid
```tsx
<CustomScrollbar 
  height="500px" 
  variant="thin"
  className="border rounded-lg p-4"
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {analyses.map((analysis) => (
      <AnalysisCard key={analysis.id} analysis={analysis} />
    ))}
  </div>
</CustomScrollbar>
```

### Sidebar Navigation
```tsx
<CustomScrollbar 
  height="100vh" 
  variant="minimal"
  className="w-64"
>
  <nav className="space-y-2 p-4">
    {menuItems.map((item) => (
      <NavItem key={item.id} item={item} />
    ))}
  </nav>
</CustomScrollbar>
```

## Event Handlers

```tsx
<CustomScrollbar
  height="400px"
  onScroll={(event) => console.log('Scrolling...')}
  onScrollStart={() => console.log('Scroll started')}
  onScrollStop={() => console.log('Scroll stopped')}
  onScrollFrame={(values) => {
    console.log('Scroll position:', values.scrollTop);
  }}
>
  {/* Content */}
</CustomScrollbar>
```

## Theme Integration

The component automatically detects the current theme using `next-themes` and applies the appropriate colors:

- Listens to theme changes automatically
- Supports `light`, `dark`, and `system` themes
- Falls back to system preference when theme is `system`
- Uses CSS custom properties for maximum performance

## Browser Compatibility

- ✅ Chrome/Chromium-based browsers
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **CSS-driven**: No JavaScript-based styling for better performance
- **GPU acceleration**: Smooth scrolling with hardware acceleration
- **Lightweight**: Minimal overhead with efficient rendering
- **Memory efficient**: Proper cleanup and optimized re-renders

## Accessibility

- Maintains keyboard navigation
- Preserves screen reader functionality
- Supports tab navigation
- Respects reduced motion preferences

## Migration from CSS Scrollbars

If you're currently using the CSS-only scrollbar implementation:

### Before (CSS only)
```tsx
<div className="scrollbar-default overflow-auto h-96">
  {/* Content */}
</div>
```

### After (React component)
```tsx
<CustomScrollbar height="384px" variant="default">
  {/* Content */}
</CustomScrollbar>
```

## Troubleshooting

### Scrollbar not visible
- Ensure content exceeds container height
- Check if `autoHide` is set to `false` for always-visible scrollbar
- Verify theme is properly configured

### Theme colors not updating
- Ensure `next-themes` is properly configured
- Check if theme provider wraps the component
- Verify CSS custom properties are loaded

### Performance issues
- Use `height` prop instead of CSS height for better performance
- Avoid deeply nested scroll containers
- Consider virtualizing large lists

## Advanced Customization

For advanced theming, you can override the CSS custom properties:

```css
.my-custom-scrollbar {
  --scrollbar-thumb-color: hsl(your-custom-color);
  --scrollbar-thumb-hover-color: hsl(your-hover-color);
  --scrollbar-track-color: hsl(your-track-color);
}
```

## Demo Component

See `ScrollbarDemo.tsx` for a comprehensive demonstration of all variants and features.
