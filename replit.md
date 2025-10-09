# ILoveHax Tools

## Overview

ILoveHax Tools is a professional landing page application that serves as a centralized hub for developer tools. The platform showcases two main tools (Emphasize and Editor) along with additional utilities, all presented through a modern, clean interface inspired by iLoveHax and iLoveImg design philosophies. The application emphasizes utility-first design with a focus on quick access to tools, responsive layouts, and comprehensive theming support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- Path aliases configured via TypeScript for clean imports (@/, @shared/, @assets/)

**UI Component System**
- shadcn/ui component library (New York style variant) with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- CSS variables for theme customization (light/dark mode support)
- Framer Motion for animations and transitions
- Component structure follows atomic design principles with reusable UI components

**State Management**
- TanStack Query (React Query) for server state management
- React Context API for global theme state (ThemeProvider)
- Local component state with React hooks

**Design System**
- Custom color palette with HSL-based CSS variables
- Responsive breakpoints using Tailwind's mobile-first approach
- Custom elevation system (hover-elevate, active-elevate-2 classes)
- Typography based on Open Sans font family
- Accessibility compliance targeting WCAG AA standards (4.5:1 contrast ratio)

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for the HTTP server
- ES modules (type: "module" in package.json)
- Middleware-based request pipeline with JSON/URL-encoded body parsing
- Development mode with Vite middleware integration for HMR
- Production mode serves static built assets

**Data Layer**
- In-memory storage implementation (MemStorage) as the default storage backend
- Storage interface (IStorage) defines CRUD operations for future database integration
- Drizzle ORM configured for PostgreSQL with schema definition in shared/schema.ts
- Database schema includes users table with UUID primary keys

**API Structure**
- Routes registered through centralized registerRoutes function
- API endpoints prefixed with /api (currently minimal backend logic)
- HTTP server created from Express app for potential WebSocket support

### Design Patterns & Architecture Decisions

**Monorepo Structure**
- Client code in `/client` directory (React SPA)
- Server code in `/server` directory (Express API)
- Shared code in `/shared` directory (schema definitions, types)
- Attached assets in `/attached_assets` for static resources

**Development Workflow**
- Development: Concurrent Vite dev server with Express backend
- Build: Separate builds for client (Vite) and server (esbuild)
- Type checking with TypeScript in strict mode
- Database migrations managed via Drizzle Kit

**Component Organization**
- Presentational components in `/client/src/components`
- Page components in `/client/src/pages`
- UI primitives in `/client/src/components/ui` (shadcn/ui)
- Example components for development/documentation in `/client/src/components/examples`

**Styling Strategy**
- Utility-first with Tailwind CSS
- Component-scoped variants using class-variance-authority
- Theme tokens via CSS custom properties for runtime theme switching
- Custom utility classes for common patterns (hover-elevate, button outlines)

**Routing Architecture**
- Single-page application with Wouter for routing
- Two main routes: Home (/) and NotFound (404)
- Future routes can be added to Router component in App.tsx

## External Dependencies

### UI & Styling
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework with PostCSS and Autoprefixer
- **Framer Motion**: Animation library for React components
- **Lucide React**: Icon library for UI elements
- **cmdk**: Command menu component for keyboard-driven navigation

### State Management & Data Fetching
- **TanStack Query**: Server state management and data synchronization
- **React Hook Form**: Form state management with @hookform/resolvers for validation
- **Zod**: Schema validation integrated with Drizzle ORM (drizzle-zod)

### Database & ORM
- **Drizzle ORM**: Type-safe PostgreSQL ORM with schema-first approach
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon
- **connect-pg-simple**: PostgreSQL session store (for future authentication)

### Development Tools
- **Vite**: Build tool with plugins for React, error overlay, and Replit integration
- **TypeScript**: Type system for JavaScript with strict mode enabled
- **esbuild**: Fast bundler for server-side code in production builds
- **tsx**: TypeScript execution engine for development server

### Third-Party Integrations
- **External Tool Links**: 
  - Emphasize tool: https://mo0negtt.github.io/ilovehax/
  - Editor tool: https://mo0negtt.github.io/haxpuck/
- **PWA Support**: Configured with manifest.json and service worker for offline capability
- **Font Loading**: Google Fonts (Open Sans) with preconnect optimization

### Future Integration Points
- PostgreSQL database (Drizzle schema configured, awaiting provisioning)
- User authentication system (users table schema defined)
- Session management (connect-pg-simple configured)
- Additional tool integrations via card-based navigation system