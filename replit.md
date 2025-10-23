# ISTE GNDEC Student Chapter

## Overview

Official website for the ISTE (Indian Society for Technical Education) GNDEC Student Chapter at Guru Nanak Dev Engineering College. This is a modern, visually-engaging React-based website showcasing the student chapter's activities, events, team members, and providing contact information. The site features a technical aesthetic with animated components, smooth transitions, and a dark theme optimized for technical education content.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **Vite** serves as the build tool and development server, providing fast HMR (Hot Module Replacement) and optimized production builds
- **React 18** with TypeScript provides the component-based UI framework with type safety
- Development server configured to run on port 5000, bound to all network interfaces for Replit compatibility

**Component Strategy**
- **shadcn/ui** component library provides the foundation for reusable UI components built on Radix UI primitives
- Component architecture follows a modular pattern with dedicated components for major sections (TechNavbar, TechHero, TechAbout, TechNoticeBoard, TechFooter)
- UI components located in `src/components/ui/` are generated from shadcn/ui and follow Radix UI patterns
- Custom components in `src/components/` implement business logic and page-specific features

**Styling System**
- **Tailwind CSS** utility-first framework with custom design tokens
- Dark theme technical aesthetic with HSL color definitions in CSS variables
- Custom color palette including tech-teal (primary), tech-yellow (secondary), and tech-orange accents
- Design system centralized in `src/index.css` with all colors defined as HSL values
- CSS variables support dynamic theming through the `:root` selector

**Routing & Navigation**
- **React Router** handles client-side routing with the following page structure:
  - `/` - Home page (Index component)
  - `/events` - Events listing and details
  - `/members` - Team member directory
  - `/gallery` - Image gallery
  - `/contact` - Contact form and information
  - `*` - 404 Not Found page for invalid routes
- Navigation component (TechNavbar) provides consistent header across all pages with scroll-based styling changes

**Animation & Interactivity**
- **GSAP (GreenSock Animation Platform)** with ScrollTrigger plugin for scroll-based animations and transitions
- Animations implemented in components like TechHero, TechAbout, and TechNoticeBoard
- Three.js integration via `@react-three/fiber` and `@react-three/drei` for potential 3D graphics (prepared but implementation pending)

**State Management & Data Fetching**
- **TanStack Query (React Query)** configured for server state management and caching
- Toast notifications provided through dual systems: Radix UI Toast and Sonner
- Form handling supported through `react-hook-form` with `@hookform/resolvers` for validation

### Design Patterns

**Component Composition**
- Compound component pattern used extensively in shadcn/ui components (Dialog, Dropdown, etc.)
- Each page component combines multiple smaller components for maintainability
- Separation of concerns: layout components (navbar, footer) vs. content components

**Responsive Design**
- Mobile-first approach with Tailwind breakpoints (sm, md, lg, 2xl)
- Custom mobile detection hook (`use-mobile.tsx`) for conditional rendering
- Responsive navigation with mobile menu support

**Type Safety**
- TypeScript configuration with relaxed strictness (`strict: false`) to allow gradual typing
- Path aliases configured (`@/*` maps to `src/*`) for clean imports
- Separate tsconfig files for app code and node tooling

### Code Organization

**Directory Structure**
```
src/
├── components/          # Custom components
│   ├── ui/             # shadcn/ui generated components
│   ├── TechNavbar.tsx  # Navigation component
│   ├── TechHero.tsx    # Hero section
│   ├── TechAbout.tsx   # About section
│   ├── TechNoticeBoard.tsx # Notice board
│   └── TechFooter.tsx  # Footer component
├── pages/              # Route components
│   ├── Index.tsx       # Home page
│   ├── Events.tsx      # Events page
│   ├── Members.tsx     # Members page
│   ├── Gallery.tsx     # Gallery page
│   ├── Contact.tsx     # Contact page
│   └── NotFound.tsx    # 404 page
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── index.css           # Global styles & design tokens
```

**Asset Management**
- Public assets in `/public` directory including logo images (Iste.webp, gne new logo.png)
- Static assets served directly from public folder
- SVG patterns and graphics generated inline for technical grid effects

### Developer Experience

**Linting & Code Quality**
- ESLint configured with TypeScript support
- React Hooks and React Refresh plugins for development experience
- Relaxed rules for unused variables to support rapid development

**Development Workflow**
- Hot module replacement for instant feedback during development
- Separate build modes (development and production)
- Preview command for testing production builds locally

## External Dependencies

### UI & Component Libraries
- **@radix-ui/** family of primitives (accordion, dialog, dropdown, navigation, etc.) - Accessible, unstyled component primitives
- **shadcn/ui** - Re-usable component system built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **class-variance-authority** & **clsx** - Utility for managing component variants and conditional classes

### Animation & Graphics
- **GSAP** - Professional-grade animation library
- **@react-three/fiber** & **@react-three/drei** - React renderer for Three.js (3D graphics capability)
- **embla-carousel-react** - Carousel/slider component

### State & Data Management
- **@tanstack/react-query** - Asynchronous state management and data fetching
- **react-hook-form** - Form state management and validation
- **@hookform/resolvers** - Validation schema resolvers for react-hook-form

### Date & Utility Libraries
- **date-fns** - Modern date utility library
- **lucide-react** - Icon library with React components
- **input-otp** - OTP input component
- **cmdk** - Command menu component

### Development Tools
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend build tool
- **@vitejs/plugin-react-swc** - React plugin with SWF compiler for faster builds
- **lovable-tagger** - Component tagging for development mode
- **autoprefixer** - PostCSS plugin for vendor prefixes

### Database Integration - Supabase

**Migration Completed**: The application has been migrated from static JSON files to Supabase for dynamic data management.

**Database Tables**:
- `events` - Event information with agenda and details
- `members_faculty` - Faculty advisor profile
- `members_core_team` - Core team member profiles
- `members_post_holders` - Post holder profiles
- `members_executive` - Executive team member profiles
- `gallery` - Gallery images with categories
- `notices` - Notice board announcements
- `event_highlights` - Past event showcases

**Admin Panel** (`/admin` route):
- Authentication-protected admin interface with full CRUD operations
- **Notices Management**: Add, edit, delete notices with status tracking
- **Events Management**: Comprehensive event management with date, time, location, and status
- **Gallery Management**: Upload images directly to Supabase Storage with category organization
- **Members Management**: Complete team member management across 4 categories:
  - Faculty: Faculty advisor profiles with image upload
  - Core Team: Core team members with position and contact info
  - Post Holders: Position holders with detailed profiles
  - Executive Team: Executive committee members
- **Event Highlights**: Past event showcases with posters, attendees, and Instagram integration
- **Image Upload**: Integrated Supabase Storage for all profile pictures, gallery images, and event posters
- **Data Migration**: Tool to transfer JSON data to Supabase (one-time use)
- Login required (Supabase Auth)

**Environment Variables**:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

**Data Flow**:
1. Pages fetch data from Supabase using React Query
2. Loading states show spinners while fetching
3. Empty states display when no data available
4. Real-time updates without redeployment

**Migration Status**: ✅ COMPLETE - All database tables created, data migrated, and all pages successfully loading from Supabase. Admin panel fully functional at `/admin` route. See `MIGRATION_GUIDE.md` for details.