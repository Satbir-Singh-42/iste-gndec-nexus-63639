# ISTE GNDEC Student Chapter Website

## Overview

Official website for the ISTE (Indian Society for Technical Education) GNDEC Student Chapter at Guru Nanak Dev Engineering College, Ludhiana. This is a modern, interactive web application showcasing the chapter's events, members, projects, gallery, and notices with a technical aesthetic featuring particle animations and dynamic backgrounds.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **Vite** as the build tool and development server (configured on port 5000)
- **React 18.3** with TypeScript for type-safe component development
- **React Router v6** for client-side routing and navigation
- **SWC** for fast TypeScript/React compilation

**UI Component System**
- **shadcn/ui** components built on Radix UI primitives
- **Tailwind CSS** utility-first styling with CSS variables for theming
- Custom component library in `src/components/ui/` following atomic design patterns
- Theme system using `next-themes` for dark/light mode support

**State Management & Data Fetching**
- **TanStack Query (React Query)** for server state management and caching
- React hooks for local component state
- No global state management library (Redux, Zustand, etc.) currently implemented

**Animations & Visual Effects**
- **GSAP** with ScrollTrigger plugin for scroll-based animations
- Custom particle background system with:
  - Binary streams
  - Mouse-following trail particles
  - Starfield effects
  - Technical nodes with connections
- Responsive animations that adapt to viewport size

**Page Structure**
The application follows a single-page application (SPA) pattern with the following routes:
- `/` - Home page with hero, about, and notice board sections
- `/events` - Events listing with upcoming/ongoing/completed categories
- `/events/:id` - Individual event detail pages
- `/members` - Team members organized by faculty, core team, post holders, and executive team
- `/gallery` - Photo gallery with categorized images
- `/projects` - Project showcase (conditionally displayed)
- `/projects/:id` - Individual project detail pages
- `/notices` - Full notices listing
- `/notices/:id` - Individual notice detail pages
- `/contact` - Contact form and information
- `/admin` - Administrative dashboard for content management
- `*` - 404 Not Found page with custom design

**Design System**
- HSL-based color system defined in `src/index.css`
- Technical dark theme with bluish color palette
- Primary colors: tech-blue, tech-cyan, tech-sky
- Responsive breakpoints following Tailwind defaults
- Custom CSS variables for consistent theming

### Backend Architecture

**Serverless Functions**
- Vercel serverless function at `/api/contact.js` for handling contact form submissions
- Email service using **nodemailer** with Gmail SMTP
- CORS enabled for cross-origin requests
- Auto-reply functionality for user confirmation

**API Integration Pattern**
- Direct client-side calls to Supabase for database operations
- No traditional backend server or API layer
- Environment variables for sensitive configuration

### Data Storage

**Supabase Backend-as-a-Service**
- PostgreSQL database hosted on Supabase
- Client library: `@supabase/supabase-js`
- Real-time capabilities available but not currently utilized

**Database Schema**
Tables include:
- `events` - Event details with status, capacity, organizer, agenda
- `members_core_team` - Core team member profiles
- `members_post_holders` - Post holder profiles
- `members_executive_team` - Executive team profiles
- `faculty` - Faculty advisor information
- `gallery` - Image galleries with categories
- `notices` - Notice board items with types and status
- `projects` - Project showcase with technologies and links
- `event_highlights` - Completed event highlights with Instagram integration
- `settings` - Application configuration (e.g., show_projects_page)

**Image Storage**
- Supabase Storage bucket named 'images'
- Upload utility functions in `src/lib/imageUpload.ts`
- Support for single and batch uploads
- 5MB file size limit enforced
- Public URL generation for uploaded images

**Data Patterns**
- Common fields across tables: `hidden`, `display_order` for content visibility and sorting
- Nullable fields for optional data (social media links, etc.)
- JSON/array fields for flexible data (agenda, technologies, highlights)

### Authentication & Authorization

**Current State**
- No authentication system implemented
- Admin dashboard accessible without login protection
- Suitable for trusted environments or requires external access control

**Future Considerations**
- Supabase Auth integration recommended for production
- Row-level security (RLS) policies should be enabled on Supabase tables

### Code Organization

**Directory Structure**
```
src/
├── components/          # Reusable components
│   ├── ui/             # shadcn/ui components
│   ├── ParticleBackground.tsx
│   ├── TechNavbar.tsx
│   ├── TechFooter.tsx
│   ├── TechHero.tsx
│   ├── TechAbout.tsx
│   └── TechNoticeBoard.tsx
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
│   ├── utils.ts        # Class name merging
│   ├── supabase.ts     # Supabase client
│   └── imageUpload.ts  # Image upload utilities
└── index.css           # Global styles & design tokens
```

**Styling Approach**
- Utility-first with Tailwind CSS
- Component-scoped styles using className composition
- Global CSS variables for theme consistency
- No CSS modules or styled-components

### External Dependencies

**Third-Party Services**
- **Supabase** - Backend-as-a-Service for database and storage
  - Requires: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  - Graceful degradation when not configured
- **Gmail SMTP** - Email delivery for contact form
  - Requires: `GMAIL_USER`, `GMAIL_PASSWORD`/`GMAIL_PASS`, `GMAIL_TO`
- **Vercel** - Deployment platform with serverless functions

**Key NPM Packages**
- `@supabase/supabase-js` - Supabase client library
- `@tanstack/react-query` - Server state management
- `gsap` - Animation library
- `react-router-dom` - Client-side routing
- `nodemailer` - Email sending (serverless function)
- `sonner` - Toast notifications
- `lucide-react` - Icon library
- `date-fns` - Date manipulation
- `next-themes` - Theme switching
- Radix UI primitives - Headless UI components

**Development Tools**
- TypeScript with relaxed linting (strict: false)
- ESLint with React hooks and refresh plugins
- Vite for fast development and optimized builds
- Tailwind CSS with typography plugin

**SEO & Meta Tags**
- Comprehensive meta tags in `index.html`
- Open Graph and Twitter Card support
- Robots.txt configured for search engine crawling
- Canonical URL: `https://iste-gndec.vercel.app/`

**Deployment Configuration**
- `vercel.json` - SPA routing configuration, serverless function settings
- Build output to `dist/` directory
- Preview builds available in development mode