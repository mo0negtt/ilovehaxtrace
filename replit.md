# HaxTrace Map Editor

## Overview

HaxTrace is a vertex and segment-based map editor for creating Haxball maps. Unlike pixel-based editors, HaxTrace works with geometric primitives (vertices and segments with curves) to build maps for Haxball-style games. The application provides a comprehensive set of tools for vertex placement, segment creation with curves, and map export/import functionality with .hbs format compatibility.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management

**UI Component System**
- shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Dark-first theme optimized for creative work
- Custom color palette based on HSL values for consistent theming

**State Management**
- React Context API (HaxTraceContext) for global editor state
- Local state management with useState for component-specific data
- Undo/redo history system implemented in editor context
- Curve sign inversion for Haxball compatibility on import/export

**Canvas Rendering**
- HTML5 Canvas API for map rendering
- Device pixel ratio handling for sharp rendering on high-DPI displays
- Vertex and segment-based drawing system
- Pan and zoom controls for viewport manipulation
- Quadratic curve rendering for curved segments

**Tool System**
- Three core tools: Add Vertex, Add Segment, and Pan
- Tool state managed centrally through HaxTraceContext
- Mouse interactions: left-click (add/select), right-click (drag/edit)
- Keyboard shortcuts for undo/redo (Ctrl+Z, Ctrl+Y)

### Data Model

**Core Data Structures**
- **Vertex**: Point with world coordinates (x, y)
- **Segment**: Connection between two vertices with optional color and curve
  - v0, v1: vertex indices
  - color: optional hex color (without #)
  - curve: optional curve value (-500 to 500)
- **HaxMap**: Complete map definition
  - id, name, width, height
  - bg: background color object
  - vertexes: array of vertices
  - segments: array of segments

**Important: Curve Compatibility**
- Internal curve values use one sign convention
- Export to .hbs: curve sign is inverted (multiplied by -1)
- Import from .hbs: curve sign is inverted to match internal format
- This ensures compatibility with Haxball's curve interpretation

### Tools & Interactions

**Add Vertex Tool**
- Left-click on canvas to create a new vertex at cursor position
- Coordinates are rounded to integers in world space

**Add Segment Tool**
- Click on two vertices to create a segment between them
- Uses color and curve values from toolbar inputs
- Selected vertices are highlighted in blue

**Pan Tool**
- Left-click and drag to pan the viewport
- Cursor changes to grab/grabbing

**Vertex Dragging**
- Right-click and drag on any vertex to reposition it
- Updates all connected segments in real-time

**Segment Curve Editing**
- Select segment by clicking on it (shows curve editor panel)
- Use slider or input field to adjust curve value
- Right-click and drag horizontally on segment to adjust curve dynamically
- Multi-select segments with Shift key

**Zoom Controls**
- Mouse wheel to zoom in/out
- Zoom range: 0.1x to 5x
- Visual feedback with zoom percentage

### Import/Export

**Export HBS**
- Serializes map to JSON format
- Inverts curve signs for Haxball compatibility
- Downloads as .hbs file named after map

**Import HBS**
- Accepts .hbs or .json files
- Inverts imported curve signs to match internal format
- Replaces current map and resets history

### Design System

**Color Palette**
- Dark mode foundation with carefully calibrated grays
- Primary accent blue for selections and active states
- Red vertices, white/colored segments
- CSS custom properties for dynamic theming

**Component Patterns**
- Toolbar with tool buttons and controls
- Floating curve editor panel (appears when segment selected)
- Canvas with grid overlay for reference
- Consistent border radius and spacing

## External Dependencies

### UI & Component Libraries
- **@radix-ui/react-***: Headless UI primitives for accessible components
- **shadcn/ui**: Pre-built component patterns using Radix UI
- **lucide-react**: Icon library for UI elements

### Forms & Validation
- **zod**: Runtime type validation and schema definition

### Styling & Utilities
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx & tailwind-merge**: Conditional class name utilities

### Development Tools
- **@replit/vite-plugin-***: Replit-specific development tooling
- **tsx**: TypeScript execution for development server

### Key Configuration Files
- **vite.config.ts**: Build tool configuration with path aliases
- **tailwind.config.ts**: Custom theme and design tokens
- **tsconfig.json**: TypeScript compiler options with path mapping
