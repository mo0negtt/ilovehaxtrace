# HaxTrace Map Editor

## Overview

HaxTrace is an offline HTML5 Canvas-based map editor for creating tile-based game maps. The application provides a comprehensive set of drawing tools, layer management, and map export/import functionality. It's designed as a utility-focused creative application with a dark-themed professional interface optimized for extended editing sessions.

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
- Dark-first theme with high contrast optimized for creative work
- Custom color palette based on HSL values for consistent theming

**State Management**
- React Context API (EditorContext) for global editor state
- Local state management with useState for component-specific data
- Undo/redo history system implemented in editor context
- Stateful and stateless component variants (Connected vs base components)

**Canvas Rendering**
- HTML5 Canvas API for map rendering
- Device pixel ratio handling for sharp rendering on high-DPI displays
- Grid-based tile system with configurable tile sizes
- Layer-based composition with visibility and opacity controls

**Tool System**
- Eight core tools: Select, Pencil, Eraser, Fill, Rectangle, Circle, Move, and Pan
- Tool state managed centrally through EditorContext
- Keyboard shortcuts for quick tool switching
- Viewport manipulation with zoom and pan controls

### Backend Architecture

**Server Framework**
- Express.js for REST API server
- TypeScript for type safety across the stack
- Custom middleware for request logging and error handling
- Development-specific Vite middleware integration

**API Design**
- RESTful endpoints for map CRUD operations
- JSON-based request/response format
- Validation using Zod schemas from shared types
- Error handling with appropriate HTTP status codes

**Data Storage**
- Dual storage implementation: In-memory (MemStorage) and database-ready interface (IStorage)
- Maps stored with layers, tiles, and metadata
- User authentication schema defined but not actively used
- Designed for easy migration to persistent storage

### Data Schema & Validation

**Type System**
- Shared TypeScript types between client and server
- Zod schemas for runtime validation
- Drizzle ORM schema definitions for database models
- Type inference from Zod and Drizzle schemas

**Core Data Models**
- **Tile**: Position (x, y), color, and optional tile ID
- **Layer**: ID, name, visibility, lock state, tiles array, and opacity
- **GameMap**: ID, name, dimensions (width, height, tileSize), layers array, timestamps
- **User**: ID, username, password (prepared for authentication)

**State Management Patterns**
- Immutable state updates using functional patterns
- History tracking for undo/redo functionality
- Optimistic UI updates with server synchronization

### Design System

**Color Palette**
- Dark mode foundation with carefully calibrated grays (7%, 11%, 15%, 20%, 28%)
- Primary accent blue (217 91% 60%) for active states
- Semantic colors for success, warning, and error states
- CSS custom properties for dynamic theming

**Typography**
- Inter font family for UI elements
- JetBrains Mono for monospace data (coordinates, hex values)
- Responsive type scale with uppercase tracking for headers
- Consistent font weights and sizes across components

**Component Patterns**
- Collapsible panels with expand/collapse states
- Hover and active elevation effects using CSS variables
- Tooltip system for tool descriptions and shortcuts
- Consistent border radius (9px, 6px, 3px) for visual hierarchy

## External Dependencies

### UI & Component Libraries
- **@radix-ui/react-***: Headless UI primitives for accessible components (dialogs, dropdowns, tooltips, etc.)
- **shadcn/ui**: Pre-built component patterns using Radix UI
- **lucide-react**: Icon library for UI elements
- **cmdk**: Command menu component
- **embla-carousel-react**: Carousel functionality
- **vaul**: Drawer component primitive

### Forms & Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation integration
- **zod**: Runtime type validation and schema definition
- **drizzle-zod**: Zod schema generation from Drizzle ORM

### Database & ORM
- **drizzle-orm**: TypeScript ORM for database operations
- **drizzle-kit**: Database migration and schema management tools
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **connect-pg-simple**: PostgreSQL session store (prepared for authentication)

### Styling & Utilities
- **tailwindcss**: Utility-first CSS framework
- **autoprefixer**: CSS vendor prefixing
- **class-variance-authority**: Component variant management
- **clsx & tailwind-merge**: Conditional class name utilities
- **date-fns**: Date formatting and manipulation

### Development Tools
- **@replit/vite-plugin-***: Replit-specific development tooling
- **tsx**: TypeScript execution for development server
- **esbuild**: Fast JavaScript bundler for production builds
- **nanoid**: Unique ID generation

### Key Configuration Files
- **drizzle.config.ts**: Database configuration pointing to PostgreSQL
- **vite.config.ts**: Build tool configuration with path aliases
- **tailwind.config.ts**: Custom theme and design tokens
- **tsconfig.json**: TypeScript compiler options with path mapping