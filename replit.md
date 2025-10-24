# ISTE GNDEC Student Chapter Website

## Overview

This is the official website for the ISTE (Indian Society for Technical Education) Student Chapter at Guru Nanak Dev Engineering College, Ludhiana. The website serves as a comprehensive platform for showcasing events, team members, projects, gallery, notices, and contact information for the student chapter.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Technology Stack:**
- **Vite** - Modern build tool providing fast development server and optimized production builds
- **React 18** with TypeScript for type-safe component development
- **React Router v6** for client-side routing and navigation
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design system

**UI/UX Design Patterns:**
- Dark mode by default with light mode toggle using `next-themes`
- Technical/futuristic theme with particle backgrounds and animations
- GSAP with ScrollTrigger for advanced animations and scroll effects
- Responsive design with mobile-first approach
- Custom particle background system with binary streams and star fields

**Component Architecture:**
- Reusable UI components from shadcn/ui (buttons, dialogs, cards, forms, etc.)
- Feature components (TechNavbar, TechHero, TechAbout, TechFooter, etc.)
- Page-based routing with dedicated components for each route
- Global layout with persistent navigation and background

**State Management:**
- React Query (@tanstack/react-query) for server state management
- Local component state with React hooks
- Toast notifications using Sonner for user feedback

### Backend Architecture

**Database & Backend Services:**
- **Supabase** as the primary backend-as-a-service platform
- PostgreSQL database (via Supabase) for structured data storage
- Supabase Storage for image uploads and static assets
- Real-time capabilities through Supabase subscriptions (available but not currently utilized)

**Data Models:**
The application manages the following entities:
- **Events** - Upcoming, ongoing, and completed events with details, agenda, capacity
- **Event Highlights** - Featured past events with posters and Instagram integration
- **Notices** - Announcements and notifications with status tracking
- **Members** - Core team, post holders, executive team, and faculty
- **Gallery** - Categorized image collections
- **Projects** - Technical projects with technology stacks, GitHub/demo links

**Common Schema Patterns:**
- All tables include `hidden` boolean and `display_order` integer for visibility control and manual ordering
- Timestamps using `created_at` fields
- Rich text descriptions supporting embedded URLs
- Array fields for lists (agenda items, image URLs, technologies)

**Image Management:**
- Centralized image upload utility (`imageUpload.ts`)
- Supabase Storage bucket named 'images'
- File validation (type checking, 5MB size limit)
- Public URL generation for uploaded assets
- Batch upload support for galleries

### API & Integration Layer

**Contact Form Integration:**
- Serverless function at `/api/contact.js` for form submissions
- Nodemailer for email delivery via Gmail SMTP
- Auto-reply system for user confirmation
- CORS-enabled for cross-origin requests
- Environment variables for email credentials (`GMAIL_USER`, `GMAIL_PASSWORD`, `GMAIL_TO`)

**Supabase Client Configuration:**
- Environment-based initialization with fallback handling
- Graceful degradation when Supabase is not configured
- Typed database schema using TypeScript interfaces
- Error handling and user-friendly fallbacks

### Routing Structure

**Public Routes:**
- `/` - Home page with hero, about, and notice board
- `/events` - Event listing (upcoming, ongoing, completed, highlights)
- `/events/:id` - Individual event details
- `/members` - Team members organized by role (faculty, core, post holders, executive)
- `/gallery` - Image gallery with categories
- `/contact` - Contact form and information
- `/notices` - Full notice board listing
- `/notices/:id` - Individual notice details
- `/projects` - Project showcase (conditionally shown)
- `/projects/:id` - Individual project details

**Admin Routes:**
- `/admin` - Administrative dashboard for content management
- Protected by password authentication (client-side)
- Manages all entities: events, highlights, notices, members, gallery, projects
- Image upload interface integrated into forms
- Drag-and-drop ordering support
- Hide/show toggle for content visibility

### Styling & Theming

**Design System:**
- HSL-based color system defined in `index.css`
- Technical/bluish dark theme with cyan and sky accents
- CSS custom properties for easy theme customization
- Tailwind configuration extending base theme with custom colors
- Responsive breakpoints and container queries

**Animation System:**
- GSAP-powered animations for page transitions and scroll effects
- Custom particle background with performance optimization
- Smooth theme switching with overlay transition
- ScrollTrigger for scroll-based animations
- Page-specific animation contexts

### Performance & SEO

**Optimization Strategies:**
- Vite's code splitting and tree shaking
- Lazy loading of routes and components
- Image optimization recommendations (WebP format)
- Performance-conscious particle system with frame limiting

**SEO Implementation:**
- Comprehensive meta tags in `index.html`
- Open Graph and Twitter Card integration
- Canonical URLs and structured metadata
- `robots.txt` with sitemap reference
- Semantic HTML structure

### Development Workflow

**Build Configuration:**
- Development server on port 5000 with host `0.0.0.0`
- TypeScript with relaxed type checking for rapid development
- ESLint configuration with React hooks plugin
- SWC for fast React component compilation
- Path aliases (`@/*`) for clean imports

**Environment Variables Required:**
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `GMAIL_USER` - Gmail account for contact form
- `GMAIL_PASSWORD` - Gmail app password
- `GMAIL_TO` - Recipient email for contact submissions

## External Dependencies

### Third-Party Services

**Supabase (Primary Backend):**
- PostgreSQL database hosting
- Storage for image uploads
- Authentication capabilities (available but unused)
- Real-time subscriptions (available but unused)
- Row-level security (not currently implemented)

**Vercel (Deployment):**
- Hosting platform with serverless functions
- `/api/contact.js` serverless endpoint
- SPA fallback routing via `vercel.json`
- Environment variable management

**Gmail SMTP:**
- Email delivery for contact form submissions
- Requires app-specific password for authentication

### NPM Packages

**UI & Styling:**
- `@radix-ui/*` - Headless UI primitives (dialog, select, tabs, toast, etc.)
- `tailwindcss` - Utility-first CSS framework
- `tailwindcss-animate` - Animation utilities
- `tailwind-merge` & `clsx` - Class name utilities
- `class-variance-authority` - Variant-based component styling
- `lucide-react` - Icon library
- `next-themes` - Theme management

**Animation & Interaction:**
- `gsap` - Advanced animation library with ScrollTrigger plugin

**Data & State:**
- `@tanstack/react-query` - Server state management
- `@supabase/supabase-js` - Supabase client SDK
- `react-router-dom` - Client-side routing

**Forms & UI Components:**
- `react-day-picker` - Calendar/date picker
- `sonner` - Toast notifications
- `date-fns` - Date formatting and manipulation

**Backend/API:**
- `nodemailer` - Email sending (serverless function)

### Browser APIs & Features

- Canvas API for particle background rendering
- Local Storage for theme persistence
- Intersection Observer (via GSAP ScrollTrigger)
- File API for image uploads
- Fetch API for Supabase and contact form requests