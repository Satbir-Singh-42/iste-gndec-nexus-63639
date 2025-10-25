# ISTE GNDEC Student Chapter Website

## Overview

This is a modern, interactive web application for the ISTE (Indian Society for Technical Education) Student Chapter at Guru Nanak Dev Engineering College, Ludhiana. The platform serves as a comprehensive digital presence showcasing events, team members, projects, achievements, and announcements. It features both public-facing pages and a complete admin dashboard for content management.

The application is built as a single-page application (SPA) with client-side routing, providing a smooth user experience with dynamic animations, particle effects, and theme support (dark/light mode).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **Vite + React 18.3 with TypeScript**: Fast build tool with Hot Module Replacement (HMR) and SWC compiler for optimal performance
- **React Router v6**: Client-side routing for navigation between pages without full page reloads
- **Shadcn/ui Components**: Radix UI-based component library with Tailwind CSS for consistent, accessible UI elements
- **Next-themes**: Theme management system enabling seamless dark/light mode switching

### Styling Architecture
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens defined in CSS variables (HSL color format)
- **Design System**: Centralized color palette and spacing using CSS custom properties for easy theming
- **GSAP (GreenSock Animation Platform)**: Professional-grade animation library for scroll-triggered animations, parallax effects, and transitions
- **Custom Particle System**: Canvas-based particle effects including binary streams, mouse trails, starfield, and technical nodes

### Data Management
- **Supabase**: Backend-as-a-Service providing PostgreSQL database and object storage
- **TanStack Query (React Query)**: Server state management with caching, automatic refetching, and optimistic updates
- **Database Tables**: Events, notices, members, faculty, gallery, projects, achievements (chapter awards, past convenors, student achievements), event highlights, and site settings
- **Supabase Storage**: Two buckets - `images` for general media and `notice-attachments` for document uploads

### Authentication & Authorization
- **Admin Access**: No formal authentication system implemented; admin routes are accessible to anyone who navigates to `/admin`
- **Security Note**: The application relies on obscurity rather than authentication - admin functionality should be protected in production

### Content Management
- **Admin Dashboard**: Comprehensive CRUD operations for all content types
- **Rich Text Editor**: Quill-based WYSIWYG editor for formatted content
- **File Upload System**: Direct upload to Supabase Storage with file validation, size limits, and automatic URL generation
- **Display Order Management**: Manual reordering capabilities with drag-like interface (up/down buttons)
- **Visibility Toggle**: Hide/unhide content without deletion
- **Site Settings**: Feature flags to toggle visibility of entire sections (projects page, notice board, contact form, achievements, executive team)

### Email Integration
- **Serverless Contact Form**: Vercel serverless function (`api/contact.js`) using Nodemailer
- **Gmail SMTP**: Configured to send contact form submissions and auto-reply confirmations
- **Environment Variables**: `GMAIL_USER`, `GMAIL_PASSWORD`/`GMAIL_PASS`, `GMAIL_TO`

### Routing Configuration
- **Client-side Routing**: All routes handled by React Router
- **Vercel Rewrites**: `vercel.json` configures catch-all routing to serve `index.html` for SPA behavior (except `/api/*` routes)
- **Public Routes**: Home, Events, Members, Gallery, Contact, Notices, Projects, Achievements, and various detail pages
- **Admin Route**: `/admin` for content management
- **404 Handling**: Custom NotFound page with technical aesthetic

### Performance Optimizations
- **Lazy Loading**: Images loaded with `loading="lazy"` attribute
- **Caching**: Supabase Storage configured with 1-hour cache control headers
- **Local Storage**: Caching of site settings to reduce database queries
- **GSAP ScrollTrigger**: Efficient scroll-based animations with automatic cleanup

### Visual Effects System
- **Particle Background Component**: Context-aware particle effects that change based on current route
- **Animation Library**: Custom implementations of binary rain, mouse-following particle trails, starfield parallax, and interconnected technical nodes
- **Theme-aware Effects**: Particle colors and opacity adjust based on dark/light theme
- **Performance Considerations**: Canvas-based rendering with requestAnimationFrame for smooth 60fps animations

## External Dependencies

### Backend Services
- **Supabase**: PostgreSQL database hosting and object storage
  - Required environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  - Storage buckets: `images`, `notice-attachments`
  - Public access configured for storage buckets

### Email Service
- **Gmail SMTP**: Email delivery for contact form submissions
  - Required environment variables: `GMAIL_USER`, `GMAIL_PASSWORD` or `GMAIL_PASS`, `GMAIL_TO`
  - Configured through Nodemailer in serverless function

### UI Component Libraries
- **Radix UI**: Headless, accessible component primitives (Dialog, Popover, Select, Tabs, Toast, etc.)
- **Lucide React**: Icon library for consistent iconography
- **React Quill**: WYSIWYG rich text editor for formatted content input
- **React Day Picker**: Calendar component for date selection
- **Sonner**: Toast notification system with better UX than default toasts

### Animation & Effects
- **GSAP**: Professional animation library with ScrollTrigger plugin for scroll-based animations
- **Class Variance Authority**: Utility for managing component variants
- **Tailwind Merge & CLSX**: Class name management utilities

### Development Tools
- **ESLint**: Code linting with TypeScript support
- **TypeScript ESLint**: TypeScript-specific linting rules
- **Autoprefixer**: Automatic CSS vendor prefixing
- **Tailwind Typography**: Enhanced typography styles for prose content

### Deployment Platform
- **Vercel**: Hosting platform with serverless function support
  - Automatic deployments from Git
  - Environment variable management
  - Serverless function configuration in `vercel.json`

### Third-party Integrations
- **Instagram**: External links to Instagram posts for event highlights
- **GitHub**: Repository links for student projects
- **LinkedIn**: Professional profile links for team members
- **Social Media**: Multi-platform social links support (LinkedIn, GitHub, Instagram)