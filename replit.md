# ISTE GNDEC Student Chapter Website

## Overview

This is a modern web application for the ISTE (Indian Society for Technical Education) GNDEC Student Chapter at Guru Nanak Dev Engineering College, Ludhiana. The platform serves as a comprehensive hub for showcasing the chapter's activities, events, team members, projects, and notices. It features both a public-facing website and an admin dashboard for content management.

The application is built as a single-page application (SPA) with React, utilizing Supabase as the backend-as-a-service solution for database and file storage needs.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**October 25, 2025** - Migrated notice attachments from base64 encoding to Supabase Storage buckets:
- Created `notice-attachments` storage bucket for efficient file handling
- Implemented storage utility functions in `src/lib/storage.ts` for upload/delete operations
- Updated `MultipleFileUpload` component to use Supabase Storage instead of inline base64
- Files now stored with unique identifiers (timestamp + random string) to prevent collisions
- Attachments include `storagePath` field for proper cleanup when deleted
- Maximum file size increased to 10 MB per attachment
- Backward compatible with legacy base64 attachments
- See `STORAGE_SETUP.md` for bucket configuration instructions

## System Architecture

### Frontend Architecture

**Core Framework**: React 18.3 with TypeScript, built using Vite as the build tool and development server. The application uses SWC for fast TypeScript/React compilation.

**Routing**: Client-side routing is handled by React Router v6, providing seamless navigation between pages (Home, Events, Members, Gallery, Contact, Projects, Admin, Notices) without page reloads.

**UI Component System**: Built on shadcn/ui component library with Radix UI primitives. Components follow a consistent design system with support for dark and light themes via next-themes. All styling uses Tailwind CSS with custom HSL-based color variables for theming.

**Animation & Effects**: GSAP (GreenSock Animation Platform) with ScrollTrigger plugin provides sophisticated animations, parallax effects, and scroll-based interactions. Custom particle background system creates visual effects including binary streams, mouse-following trails, starfield animations, and technical nodes.

**State Management**: Uses React Query (@tanstack/react-query) for server state management, providing caching, background updates, and optimistic updates for data fetched from Supabase.

### Backend Architecture

**Database & Authentication**: Supabase serves as the primary backend, providing PostgreSQL database, authentication, and file storage. The application uses Supabase client-side SDK for direct database queries.

**Database Schema**: The application manages several entities:
- `events`: Event listings with status (upcoming/ongoing/completed)
- `event_highlights`: Completed event highlights with Instagram integration
- `notices`: Notice board items with rich text content, attachments, and categorization
- `gallery`: Photo galleries organized by category
- `members`: Team member profiles (core team, post holders, executive team)
- `faculty`: Faculty advisor profiles
- `projects`: Student project showcases with technologies and links
- `site_settings`: Feature toggles and configuration

All tables support `hidden` and `display_order` fields for visibility control and custom ordering.

**File Storage**: Supabase Storage handles image uploads and file attachments. Images are stored in the `images` bucket, and notice attachments are stored in the `notice-attachments` bucket. Files are uploaded with unique identifiers (timestamp + random string) to prevent collisions and are publicly accessible. The storage utilities in `src/lib/storage.ts` provide upload, delete, and URL management functions. Each attachment includes a `storagePath` field for tracking and cleanup. Maximum file size is 10 MB per attachment.

### Content Management

**Admin Dashboard**: Protected admin interface provides full CRUD operations for all content types. Features include:
- Drag-and-drop reordering via display_order fields
- Visibility toggles for hiding content without deletion
- Rich text editing with Quill/React Quill for formatted descriptions
- Direct file upload to Supabase Storage with validation
- Site-wide feature toggles (projects page visibility, notice board, contact form, executive team display)

**Rich Content Support**: Notices and events support rich HTML descriptions, embedded links, poster images, and file attachments. URLs in descriptions are automatically converted to clickable links.

### External Dependencies

**Supabase**: Backend-as-a-service providing PostgreSQL database, authentication, and object storage. Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables.

**Email Service**: Contact form uses Nodemailer via a serverless function (`api/contact.js`) deployed on Vercel. Sends emails through Gmail SMTP requiring `GMAIL_USER`, `GMAIL_PASSWORD` (or `GMAIL_PASS`), and `GMAIL_TO` environment variables. Includes auto-reply functionality for user confirmation.

**Third-party UI Libraries**:
- shadcn/ui components built on Radix UI primitives
- Lucide React for icons
- Sonner for toast notifications
- React Quill for WYSIWYG editing
- date-fns for date manipulation

**Deployment**: Configured for Vercel deployment with `vercel.json` providing SPA routing support (all non-API routes redirect to index.html) and serverless function configuration for the contact API endpoint.

### Design System

**Theme Support**: Dual theme system (dark/light) with seamless switching. All colors are defined as HSL CSS variables allowing dynamic theme changes. Technical theme features bluish accent colors (tech-blue, tech-cyan, tech-sky) for the dark mode aesthetic.

**Responsive Design**: Mobile-first approach with Tailwind breakpoints. Custom hooks (`use-mobile`) detect device type for conditional rendering.

**Accessibility**: Built on Radix UI primitives ensuring ARIA compliance and keyboard navigation support throughout the application.