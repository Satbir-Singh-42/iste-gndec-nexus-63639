# ISTE GNDEC Student Chapter Website

## Overview

This is a modern, interactive web application for the ISTE (Indian Society for Technical Education) GNDEC Student Chapter at Guru Nanak Dev Engineering College, Ludhiana. The platform serves as a comprehensive digital presence for the student chapter, featuring dynamic content management for events, notices, team members, projects, gallery, and achievements. The website includes both public-facing pages and an admin dashboard for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Framework & Tooling**
- **Vite + React 18.3 + TypeScript**: Fast development environment with type-safe code using SWC compiler for optimized builds
- **React Router v6**: Client-side routing with lazy loading support for optimal performance
- **shadcn/ui + Radix UI**: Accessible, customizable component library built on Radix UI primitives with Tailwind CSS
- **GSAP (GreenSock Animation Platform)**: Professional-grade animations including parallax effects, scroll-triggered animations, and particle systems

**UI/UX Patterns**
- **Theme System**: Light/dark mode support via `next-themes` with CSS variables for dynamic theming
- **Responsive Design**: Mobile-first approach using Tailwind CSS breakpoints
- **Custom Particle Background System**: Multiple animation modes (binary streams, mouse trails, starfield, technical nodes) that adapt per route
- **Rich Text Editing**: Quill.js integration for formatted content in admin panel

**State Management**
- **TanStack Query (React Query)**: Server state management with caching and automatic refetching
- **Local React State**: Component-level state for UI interactions

### Backend Architecture

**Database & Storage**
- **Supabase**: PostgreSQL-based backend providing database, authentication, and file storage
- **Storage Buckets**: Two primary buckets - `images` for visual content and `notice-attachments` for documents
- **File Upload System**: Custom upload utilities in `lib/storage.ts` handling file validation, unique naming, and public URL generation

**Data Schema (Key Tables)**
- `events`: Event listings with status tracking (upcoming/ongoing/completed), capacity, agenda, and display ordering
- `notices`: Notice board items with rich text, attachments, categorization (important/general/event), and external links
- `gallery`: Photo collections with multiple images per entry, categorized by projects/events
- `members`: Team hierarchy (faculty/core/post holders/executive) with social links
- `projects`: Student project showcase with technologies, GitHub/demo links, and featured flags
- `event_highlights`: Completed event summaries with Instagram integration
- `chapter_awards`, `past_convenors`, `student_achievements`: Achievement tracking
- `site_settings`: Feature toggles (projects page visibility, notice board, contact form, executive team)

**Content Organization**
- `display_order`: Manual ordering system for all content types
- `hidden`: Visibility toggle without deletion for all entities
- Automatic timestamp tracking via `created_at` fields

### Admin System

**Authentication & Security**
- Browser-based password authentication (client-side validation)
- Admin route protection via React Router
- No backend auth service currently implemented (authentication happens client-side)

**Content Management Features**
- CRUD operations for all content types via Supabase client
- Direct file uploads to Supabase Storage with progress tracking
- Rich text editor for notices with HTML storage
- Reordering interface using manual `display_order` values
- Visibility toggles for soft-delete functionality
- Search and filter capabilities across content types

### External Dependencies

**Third-Party Services**
- **Supabase**: Database (PostgreSQL), file storage, and potential future authentication
  - Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- **Nodemailer (Vercel Serverless Function)**: Email sending via Gmail SMTP for contact form
  - Serverless endpoint: `/api/contact.js`
  - Environment variables: `GMAIL_USER`, `GMAIL_PASSWORD`/`GMAIL_PASS`, `GMAIL_TO`
  - Auto-reply functionality included

**UI Libraries**
- **Radix UI**: Headless UI primitives for accessibility (@radix-ui/react-*)
- **Lucide React**: Icon system
- **GSAP**: Animation engine with ScrollTrigger plugin
- **React Quill**: Rich text editor component
- **Sonner**: Toast notification system
- **date-fns**: Date formatting utilities

**Build & Development**
- **Tailwind CSS**: Utility-first styling with custom design system
- **PostCSS + Autoprefixer**: CSS processing
- **TypeScript ESLint**: Code quality (strict mode disabled for flexibility)

**Deployment**
- **Vercel**: Hosting platform with serverless functions support
- SPA routing configuration via `vercel.json` rewrites
- Environment-specific builds (`build:dev` for development mode)

**SEO & Meta**
- Comprehensive Open Graph and Twitter Card meta tags
- Sitemap and robots.txt for search engine optimization
- Structured favicon set (multiple sizes)