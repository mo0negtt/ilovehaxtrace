# ILoveHax Tools Landing Page - Design Guidelines

## Design Approach
**Utility-First Design** inspired by iLoveHax and iLoveImg - Clear, functional, and efficient. Focus on quick access to tools with modern interactive elements.

## Color Palette

### Light Mode (Default)
- **Background**: Pure white (#FFFFFF)
- **Container Background**: Soft gray (#F9F9F9)
- **Primary Text**: Dark gray (#333333)
- **Secondary Text**: Medium gray (#555555)
- **Accent/Interactive**: Light blue (#2196F3)
- **Footer Text**: Light gray (#777777)

### Dark Mode
- CSS variables switch: `--bg`, `--text`, `--card-bg` inverted for dark theme
- Maintain 4.5:1 contrast ratio (WCAG AA compliance)

## Typography
- **Base Size**: 16px
- **Line Height**: 1.5
- **Font Family**: Generic sans-serif system fonts
- **Hero Title**: 2rem (32px)
- **Hero Subtitle**: 1rem, color #555555
- **Card Title**: 1.2rem
- **Card Description**: 0.9rem
- **Footer**: 0.8rem

## Layout System

### Hero Section (30% viewport height)
- **Top Bar**: Logo "logo-ilh-2.png" as main logo in upper left/center
- **Secondary Logos**: "logo-ilh.png" and "vec-full.png" displayed in header area
- **Dark Mode Toggle**: Floating button in top-right corner
- **User Menu**: Icon in header with dropdown for "Mis presets" and "Cerrar sesión"
- **Title + Subtitle**: Centered with subtle fade-in animations (opacity + transform)

### Tool Cards Grid
- **Layout**: Responsive flex grid with `flex-wrap: wrap`, `justify-content: center`, `gap: 2rem`
- **Cards**: 2 main tool cards (Emphasize, Editor)
- **Card Contents**: 
  - Icon (64×64px SVG/PNG)
  - Title (1.2rem)
  - Description (0.9rem)
- **Mobile**: Full-width cards with max-width: 300px
- **Desktop**: Side-by-side card presentation

### Search Bar
- Global search positioned below hero or in header
- Autocomplete dropdown for tools/presets filtering
- Metadata-based search (grid, color, physics keywords)

### Footer
- **Layout**: Centered text
- **Legal Links**: Privacy, Terms
- **Social Icons**: SVG icons for social media
- **Statistics Icon**: Hidden panel trigger for metrics
- **Feedback Form**: Modal trigger

## Component Library

### Interactive Cards
- **Hover State**: `transform: translateY(-4px)` + border color changes to accent
- **Focus State**: No outline, `box-shadow: 0 0 0 3px rgba(33,150,243,0.3)`
- **Click Action**: External links (target="_blank") to tools
  - Emphasize → https://mo0negtt.github.io/ilovehax/
  - Editor → https://mo0negtt.github.io/haxpuck/

### Buttons
- **Primary CTA**: Accent blue background with white text
- **Dark Mode Toggle**: Floating button with theme icon
- **Outline Buttons**: For secondary actions on image backgrounds (with blur backdrop)

### Modals & Overlays
- **Help Overlay**: Triggered by /? keyboard shortcut
- **Feedback Modal**: Quick form for user comments
- **Statistics Panel**: Metrics display (users, loads, performance)

## Animations
- **Hero Elements**: Subtle fade-in on load (opacity 0→1, transform translateY)
- **Card Interactions**: Smooth 0.2s transitions on hover/focus
- **Modal Entry**: Fade + scale animation
- **Minimal Motion**: Respect user preferences for reduced motion

## Advanced Features

### Keyboard Shortcuts
- **E**: Open Emphasize tool
- **D**: Open Editor tool
- **/?**: Open help overlay

### Dark Mode
- Toggle in header saves preference to localStorage
- CSS variables update for theme switching
- Smooth transition between modes

### PWA Configuration
- Service Worker for offline asset caching
- Manifest.json with adaptive icons
- Installable as standalone app

### User Presets
- Dropdown menu for saved configurations
- Sync with user account
- Quick access to frequent settings

### Search & Filtering
- Real-time filtering of tools/presets
- Tag-based search metadata
- Autocomplete suggestions

## Accessibility
- **Keyboard Navigation**: 100% accessible via keyboard
- **ARIA Labels**: All buttons and links properly labeled
- **Contrast Ratios**: Minimum 4.5:1 (WCAG AA)
- **Focus Indicators**: Clear, 3px box-shadow rings
- **Responsive Range**: 320px to 1920px

## Box Model
- `box-sizing: border-box` on all elements for consistent spacing
- Consistent padding/margins using design system values

## Images
No large hero image - this is a utility-focused landing with logo-based branding and tool card navigation.