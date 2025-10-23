# ISTE GNDEC Student Chapter - Replit Configuration

## Overview

Official website for the ISTE (Indian Society for Technical Education) GNDEC Student Chapter at Guru Nanak Dev Engineering College. This is a modern, interactive web application showcasing events, members, gallery, and notices for the student chapter. The site features advanced 3D graphics, particle animations, and a comprehensive admin panel for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework Stack:**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast HMR (Hot Module Replacement)
- **React Router** for client-side routing and navigation between pages

**UI Component System:**
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- Custom theme system with HSL color variables for dark technical aesthetic
- Component path aliases configured via `@/*` mapping to `./src/*`

**Animation & Graphics:**
- **GSAP (GreenSock)** with ScrollTrigger for scroll-based animations
- **Three.js** via `@react-three/fiber` and `@react-three/drei` for 3D graphics
- Custom particle background system with binary stream effects and interactive mouse trails
- Canvas-based animations for visual effects

**State Management:**
- **React Query (@tanstack/react-query)** for server state management and data fetching
- **React Hook Form** with Zod resolvers for form validation
- Local component state with React hooks

### Backend Architecture

**Email Service:**
- Standalone Node.js HTTP server (`server/email-server.js`) on port 3001
- **Nodemailer** integration for contact form submissions via Gmail SMTP
- CORS-enabled API endpoint at `/api/contact`
- Environment variables for Gmail credentials: `GMAIL_USER`, `GMAIL_PASSWORD/GMAIL_PASS`, `GMAIL_TO`

**Data Storage:**
- **Supabase** as the primary backend-as-a-service platform
- PostgreSQL database via Supabase for structured data storage
- Supabase Storage for image and media asset management
- Real-time capabilities available through Supabase client

**Database Schema:**
Tables include:
- `events` - Event information with agenda, capacity, location details
- `event_highlights` - Featured past events with Instagram links
- `notices` - Announcements and notifications with status tracking
- `gallery` - Image collections with categories and descriptions
- `members_core_team` - Core team member profiles
- `members_post_holders` - Post holder member profiles
- `members_executive_team` - Executive team member profiles
- `faculty` - Faculty advisor information

All tables support:
- `hidden` boolean flag for soft deletion/visibility control
- `display_order` integer for custom sorting
- `created_at` timestamps for audit trails

**Image Management:**
- Custom upload utilities in `src/lib/imageUpload.ts`
- Validation for file type (images only) and size (5MB limit)
- Unique filename generation with timestamps and random identifiers
- Public URL generation for uploaded assets
- Batch upload support for gallery functionality

### Routing Structure

**Public Pages:**
- `/` - Home page with hero, about section, and notice board
- `/events` - Events listing with upcoming, ongoing, and completed events
- `/events/:id` - Individual event detail pages
- `/notices` - Notices listing page
- `/notices/:id` - Individual notice detail pages
- `/members` - Team members organized by role (faculty, core team, post holders, executive)
- `/gallery` - Image gallery with category filtering
- `/contact` - Contact form with email integration

**Admin Pages:**
- `/admin` - Protected admin dashboard with tabs for:
  - Events management (CRUD operations)
  - Event highlights management
  - Notices management
  - Gallery management
  - Members management (all categories)

**Design Patterns:**
- ScrollToTop component for automatic scroll reset on route changes
- Global particle background that persists across all pages
- Consistent navbar and footer components across all pages
- Loading states and error handling for async operations

### Build Configuration

**Development:**
- Vite dev server on port 5000 with IPv4 binding (`0.0.0.0`)
- Hot module replacement enabled
- Component tagging plugin for development mode
- Proxy configuration for API requests to email server

**Production:**
- Optimized build output with code splitting
- Asset optimization and minification
- Environment-specific builds via `--mode` flag
- SWC-based React plugin for faster compilation

**TypeScript Configuration:**
- Strict mode disabled for gradual type adoption
- Path aliases for clean imports
- Separate configs for app code and build tools
- Isolated modules for better build performance

## External Dependencies

### Third-Party Services

**Supabase:**
- Backend database and storage service
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Client initialized in `src/lib/supabase.ts`
- Graceful degradation if not configured

**Gmail SMTP:**
- Email delivery for contact form submissions
- Environment variables: `GMAIL_USER`, `GMAIL_PASSWORD` or `GMAIL_PASS`, `GMAIL_TO`
- Separate email server process required

**Replit Object Storage:**
- Optional storage integration via `@replit/object-storage`
- May be used for additional file storage needs

### Key NPM Packages

**UI & Styling:**
- Radix UI component primitives (accordion, dialog, dropdown, etc.)
- Tailwind CSS with autoprefixer
- class-variance-authority for component variants
- clsx and tailwind-merge for className utilities

**Data Fetching & Forms:**
- @tanstack/react-query for server state
- @hookform/resolvers with react-hook-form
- zod for schema validation

**Animation & Graphics:**
- gsap with ScrollTrigger plugin
- @react-three/fiber and @react-three/drei
- three.js core library
- embla-carousel-react for carousels

**Utilities:**
- date-fns for date manipulation
- cmdk for command menu interfaces
- sonner for toast notifications
- vaul for drawer components

### Development Tools

**Linting & Type Checking:**
- ESLint with TypeScript support
- React hooks and refresh plugins
- Unused variables checking disabled for development flexibility

**Build Tools:**
- Vite with React SWC plugin
- PostCSS with Tailwind CSS plugin
- TypeScript compiler (noEmit mode)