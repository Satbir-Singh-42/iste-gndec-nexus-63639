# ISTE GNDEC Student Chapter Website

Official website for the ISTE (Indian Society for Technical Education) GNDEC Student Chapter at Guru Nanak Dev Engineering College, Ludhiana. This is a modern, interactive web application showcasing the chapter's events, members, projects, gallery, and notices with a technical aesthetic featuring particle animations and dynamic backgrounds.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Important Points](#important-points)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Features

### Public Features

- **Dynamic Hero Section** - Animated text with hex pattern overlay and particle effects
- **About Section** - ISTE national legacy and GNDEC chapter's vision and mission
- **Notice Board** - Recent notices with filtering, expansion, and categorization (important/general/event)
- **Event Listings** - Showcase of upcoming, ongoing, and past events with detailed pages
- **Team Members** - Organized display of faculty advisors and student teams (core, post holders, executive) with social links
- **Gallery** - Categorized photo viewer for projects and events
- **Projects Showcase** - Student projects with technologies, descriptions, and links to code/demos
- **Contact Form** - Message submission with auto-reply confirmation via email
- **Theme Support** - Dark and light mode with seamless switching
- **Particle Background System** - Custom animations including binary streams, mouse-following trails, starfield effects, and technical nodes

### Admin Features

- **Admin Dashboard** - Comprehensive content management system
- **Content Management** - Add, edit, delete, and reorder notices, events, gallery items, members, and projects
- **Image Upload** - Direct upload to Supabase Storage with validation
- **Site Settings** - Toggle visibility of projects page and other configurations
- **Event Highlights** - Manage completed event highlights with Instagram integration

## Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **Vite** | Build tool and development server (fast HMR) |
| **React 18.3** | UI library with TypeScript |
| **TypeScript** | Type-safe JavaScript for robust code |
| **React Router v6** | Client-side routing and navigation |
| **SWC** | Fast TypeScript/React compilation |

### UI & Styling

| Technology | Purpose |
|------------|---------|
| **shadcn/ui** | Component library built on Radix UI primitives |
| **Radix UI** | Headless UI components (Dialog, Select, Tabs, Toast, etc.) |
| **Tailwind CSS** | Utility-first CSS framework with custom design tokens |
| **Tailwind Animate** | Animation utilities for Tailwind |
| **next-themes** | Dark/light theme management |
| **class-variance-authority** | Type-safe variant styling |

### State & Data Management

| Technology | Purpose |
|------------|---------|
| **TanStack Query (React Query)** | Server state management, caching, and data fetching |
| **React Hooks** | Local component state management |

### Animation & Visual Effects

| Technology | Purpose |
|------------|---------|
| **GSAP** | Professional-grade animation library |
| **ScrollTrigger** | Scroll-based animations |
| **Custom Particle System** | Binary streams, trails, starfield, technical nodes |

### Backend & Services

| Technology | Purpose |
|------------|---------|
| **Supabase** | Backend-as-a-Service (PostgreSQL database + Storage) |
| **@supabase/supabase-js** | Supabase client library |
| **Vercel Serverless Functions** | API endpoint for contact form |
| **Nodemailer** | Email delivery via Gmail SMTP |

### Additional Libraries

| Library | Purpose |
|---------|---------|
| **lucide-react** | Icon library with 1000+ icons |
| **date-fns** | Modern date utility library |
| **react-quill** | Rich text editor for admin |
| **sonner** | Toast notification system |
| **clsx & tailwind-merge** | Utility for merging CSS classes |

## Project Structure

```
iste-gndec/
├── api/
│   └── contact.js           # Serverless function for contact form
├── public/
│   └── robots.txt          # SEO configuration
├── src/
│   ├── components/
│   │   ├── ui/             # shadcn/ui components (Button, Card, Dialog, etc.)
│   │   ├── ParticleBackground.tsx    # Custom particle effects
│   │   ├── TechNavbar.tsx            # Navigation component
│   │   ├── TechFooter.tsx            # Footer component
│   │   ├── TechHero.tsx              # Hero section
│   │   ├── TechAbout.tsx             # About section
│   │   └── TechNoticeBoard.tsx       # Notice board
│   ├── pages/
│   │   ├── Index.tsx       # Home page
│   │   ├── Events.tsx      # Events listing
│   │   ├── EventDetail.tsx # Individual event page
│   │   ├── Members.tsx     # Team members page
│   │   ├── Gallery.tsx     # Photo gallery
│   │   ├── Projects.tsx    # Projects showcase
│   │   ├── ProjectDetail.tsx # Individual project page
│   │   ├── Contact.tsx     # Contact form page
│   │   ├── Notices.tsx     # All notices page
│   │   ├── NoticeDetail.tsx # Individual notice page
│   │   ├── Admin.tsx       # Admin dashboard
│   │   └── NotFound.tsx    # 404 page
│   ├── hooks/              # Custom React hooks
│   ├── lib/
│   │   ├── utils.ts        # Utility functions (cn for class merging)
│   │   ├── supabase.ts     # Supabase client configuration
│   │   └── imageUpload.ts  # Image upload utilities
│   ├── App.tsx             # Root component with routing
│   ├── index.css           # Global styles and CSS variables
│   └── main.tsx            # Application entry point
├── .env                    # Environment variables (not in repo)
├── index.html              # HTML entry point with meta tags
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md               # This file
```

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase Account** (for database and storage)
- **Gmail Account** (for contact form emails)

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies
npm install

# Step 4: Set up environment variables (see below)
cp .env.example .env
# Edit .env with your actual values

# Step 5: Start the development server
npm run dev
```

The application will be available at `http://localhost:5000`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gmail SMTP Configuration (Required for contact form)
GMAIL_USER=your_gmail_address@gmail.com
GMAIL_PASSWORD=your_app_specific_password
GMAIL_TO=recipient_email@example.com
```

### Getting Supabase Credentials

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy the Project URL and anon/public key

### Getting Gmail App Password

1. Enable 2-Step Verification in your Google Account
2. Go to Security > App Passwords
3. Generate a new app password for "Mail"
4. Use this password in `GMAIL_PASSWORD`

## Important Points

### Database Setup

- The application uses Supabase PostgreSQL database
- Required tables: `events`, `notices`, `members_core_team`, `members_post_holders`, `members_executive_team`, `faculty`, `gallery`, `projects`, `event_highlights`, `settings`
- Create a Supabase Storage bucket named `images` for image uploads
- Set the `images` bucket to public access

### Security Considerations

- **No Authentication Protection**: Admin dashboard is currently accessible without login
- **Production Recommendation**: Implement Supabase Auth and enable Row-Level Security (RLS) policies
- **Environment Variables**: Never commit `.env` file to version control
- **API Keys**: Keep Supabase anon key and Gmail credentials secure

### Image Upload

- Maximum file size: **5MB**
- Accepted formats: All standard image formats (JPG, PNG, GIF, WebP, etc.)
- Images are stored in Supabase Storage bucket `images`
- Public URLs are automatically generated

### Development Server

- Must run on port **5000** (configured in vite.config.ts)
- Server binds to `0.0.0.0` for network access
- Hot Module Replacement (HMR) enabled for fast development

### Styling System

- Uses CSS variables defined in `src/index.css` for theming
- HSL color values for easy theme customization
- Dark mode as default, light mode available
- Responsive design with mobile-first approach

### Browser Support

- Modern browsers with ES6+ support
- Recommended: Chrome, Firefox, Safari, Edge (latest versions)

### Performance

- Code splitting with React Router
- Optimized build with Vite
- Lazy loading for images in gallery
- Efficient animations with GSAP

## Available Scripts

```sh
npm run dev        # Start development server on port 5000
npm run build      # Build for production
npm run build:dev  # Build in development mode
npm run lint       # Run ESLint for code quality
npm run preview    # Preview production build locally
npm run start      # Alias for preview
```

## Deployment

### Deploying to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy (automatic on push)

### Deploying to Other Platforms

1. Build the project:
   ```sh
   npm run build
   ```
2. The `dist/` folder contains production-ready files
3. Upload `dist/` to your hosting service
4. Ensure `api/` folder is deployed for serverless functions (if supported)

### Production Checklist

- [ ] Set all environment variables
- [ ] Configure Supabase database and storage
- [ ] Set up Gmail app password
- [ ] Enable HTTPS
- [ ] Test contact form functionality
- [ ] Verify image uploads work
- [ ] Check all routes are accessible
- [ ] Test dark/light theme switching
- [ ] Implement authentication for admin dashboard
- [ ] Enable Supabase RLS policies
- [ ] Configure custom domain (optional)

## Database Schema Reference

### Tables Overview

- **events**: Event details with status, capacity, organizer, agenda
- **notices**: Notice board items with types (important/general/event) and status
- **members_core_team**: Core team member profiles
- **members_post_holders**: Post holder profiles
- **members_executive_team**: Executive team profiles
- **faculty**: Faculty advisor information
- **gallery**: Image galleries with categories
- **projects**: Project showcase with technologies and links
- **event_highlights**: Completed event highlights with Instagram integration
- **settings**: Application configuration (e.g., show_projects_page)

### Common Fields

- `hidden`: Boolean to hide/show items
- `display_order`: Integer for custom sorting
- `created_at`: Timestamp of creation

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Follow existing component structure
- Use Tailwind CSS for styling
- Add comments for complex logic

## License

This project is maintained by the ISTE GNDEC Student Chapter.

## Support

For issues, questions, or contributions, please contact the ISTE GNDEC team or open an issue on GitHub.

---

**Built with ❤️ by ISTE GNDEC Student Chapter**
