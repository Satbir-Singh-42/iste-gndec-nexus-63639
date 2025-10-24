-- ============================================
-- COMPLETE SUPABASE SCHEMA FOR ISTE GNDEC WEBSITE
-- ============================================
-- Run this in your Supabase SQL Editor to create all tables
-- Last Updated: October 2025
-- Website: https://iste-gndec.vercel.app/

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.events (
  id bigserial NOT NULL,
  title text NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'UPCOMING',
  capacity text NULL,
  organizer text NULL,
  details text NULL,
  agenda text[] NULL,
  hidden boolean NULL DEFAULT false,
  display_order integer NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT events_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- ============================================
-- EVENT HIGHLIGHTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.event_highlights (
  id bigserial NOT NULL,
  title text NOT NULL,
  date text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  poster text NOT NULL,
  instagram_link text NULL,
  attendees text NULL,
  highlights text[] NULL,
  hidden boolean NULL DEFAULT false,
  display_order integer NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT event_highlights_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- ============================================
-- GALLERY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.gallery (
  id bigserial NOT NULL,
  title text NOT NULL,
  images text[] NOT NULL,
  category text NOT NULL DEFAULT 'Events',
  description text NOT NULL,
  hidden boolean NULL DEFAULT false,
  display_order integer NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT gallery_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- ============================================
-- NOTICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.notices (
  id bigserial NOT NULL,
  title text NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  type text NOT NULL DEFAULT 'EVENT',
  status text NOT NULL DEFAULT 'UPCOMING',
  description text NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT notices_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- ============================================
-- MEMBERS - FACULTY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.members_faculty (
  id bigserial NOT NULL,
  name text NOT NULL,
  title text NOT NULL,
  image text NOT NULL,
  description text NOT NULL,
  linkedin text NULL,
  github text NULL,
  instagram text NULL,
  hidden boolean NULL DEFAULT false,
  display_order integer NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT members_faculty_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- ============================================
-- MEMBERS - CORE TEAM TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.members_core_team (
  id bigserial NOT NULL,
  name text NOT NULL,
  position text NOT NULL,
  image text NOT NULL,
  email text NULL,
  linkedin text NULL,
  github text NULL,
  instagram text NULL,
  hidden boolean NULL DEFAULT false,
  display_order integer NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT members_core_team_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- ============================================
-- MEMBERS - POST HOLDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.members_post_holders (
  id bigserial NOT NULL,
  name text NOT NULL,
  position text NOT NULL,
  image text NOT NULL,
  email text NULL,
  linkedin text NULL,
  github text NULL,
  instagram text NULL,
  hidden boolean NULL DEFAULT false,
  display_order integer NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT members_post_holders_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- ============================================
-- MEMBERS - EXECUTIVE TEAM TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.members_executive (
  id bigserial NOT NULL,
  name text NOT NULL,
  position text NOT NULL,
  image text NOT NULL,
  email text NULL,
  linkedin text NULL,
  github text NULL,
  instagram text NULL,
  hidden boolean NULL DEFAULT false,
  display_order integer NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT members_executive_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members_faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members_core_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members_post_holders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members_executive ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DROP EXISTING POLICIES (IF ANY)
-- ============================================
DROP POLICY IF EXISTS "Allow public read access" ON public.events;
DROP POLICY IF EXISTS "Allow public insert" ON public.events;
DROP POLICY IF EXISTS "Allow public update" ON public.events;
DROP POLICY IF EXISTS "Allow public delete" ON public.events;

DROP POLICY IF EXISTS "Allow public read access" ON public.event_highlights;
DROP POLICY IF EXISTS "Allow public insert" ON public.event_highlights;
DROP POLICY IF EXISTS "Allow public update" ON public.event_highlights;
DROP POLICY IF EXISTS "Allow public delete" ON public.event_highlights;

DROP POLICY IF EXISTS "Allow public read access" ON public.gallery;
DROP POLICY IF EXISTS "Allow public insert" ON public.gallery;
DROP POLICY IF EXISTS "Allow public update" ON public.gallery;
DROP POLICY IF EXISTS "Allow public delete" ON public.gallery;

DROP POLICY IF EXISTS "Allow public read access" ON public.notices;
DROP POLICY IF EXISTS "Allow public insert" ON public.notices;
DROP POLICY IF EXISTS "Allow public update" ON public.notices;
DROP POLICY IF EXISTS "Allow public delete" ON public.notices;

DROP POLICY IF EXISTS "Allow public read access" ON public.members_faculty;
DROP POLICY IF EXISTS "Allow public insert" ON public.members_faculty;
DROP POLICY IF EXISTS "Allow public update" ON public.members_faculty;
DROP POLICY IF EXISTS "Allow public delete" ON public.members_faculty;

DROP POLICY IF EXISTS "Allow public read access" ON public.members_core_team;
DROP POLICY IF EXISTS "Allow public insert" ON public.members_core_team;
DROP POLICY IF EXISTS "Allow public update" ON public.members_core_team;
DROP POLICY IF EXISTS "Allow public delete" ON public.members_core_team;

DROP POLICY IF EXISTS "Allow public read access" ON public.members_post_holders;
DROP POLICY IF EXISTS "Allow public insert" ON public.members_post_holders;
DROP POLICY IF EXISTS "Allow public update" ON public.members_post_holders;
DROP POLICY IF EXISTS "Allow public delete" ON public.members_post_holders;

DROP POLICY IF EXISTS "Allow public read access" ON public.members_executive;
DROP POLICY IF EXISTS "Allow public insert" ON public.members_executive;
DROP POLICY IF EXISTS "Allow public update" ON public.members_executive;
DROP POLICY IF EXISTS "Allow public delete" ON public.members_executive;

-- ============================================
-- CREATE SECURITY POLICIES
-- ============================================
-- Public access for reading, full access for all operations (admin panel)

-- Events
CREATE POLICY "Allow public read access" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.events FOR DELETE USING (true);

-- Event Highlights
CREATE POLICY "Allow public read access" ON public.event_highlights FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.event_highlights FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.event_highlights FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.event_highlights FOR DELETE USING (true);

-- Gallery
CREATE POLICY "Allow public read access" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.gallery FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.gallery FOR DELETE USING (true);

-- Notices
CREATE POLICY "Allow public read access" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.notices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.notices FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.notices FOR DELETE USING (true);

-- Members Faculty
CREATE POLICY "Allow public read access" ON public.members_faculty FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.members_faculty FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.members_faculty FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.members_faculty FOR DELETE USING (true);

-- Members Core Team
CREATE POLICY "Allow public read access" ON public.members_core_team FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.members_core_team FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.members_core_team FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.members_core_team FOR DELETE USING (true);

-- Members Post Holders
CREATE POLICY "Allow public read access" ON public.members_post_holders FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.members_post_holders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.members_post_holders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.members_post_holders FOR DELETE USING (true);

-- Members Executive
CREATE POLICY "Allow public read access" ON public.members_executive FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.members_executive FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.members_executive FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.members_executive FOR DELETE USING (true);

-- ============================================
-- INDEXES FOR PERFORMANCE (OPTIONAL)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_events_display_order ON public.events(display_order);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_event_highlights_display_order ON public.event_highlights(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery(category);
CREATE INDEX IF NOT EXISTS idx_gallery_display_order ON public.gallery(display_order);
CREATE INDEX IF NOT EXISTS idx_notices_type ON public.notices(type);
CREATE INDEX IF NOT EXISTS idx_notices_status ON public.notices(status);
CREATE INDEX IF NOT EXISTS idx_members_faculty_display_order ON public.members_faculty(display_order);
CREATE INDEX IF NOT EXISTS idx_members_core_team_display_order ON public.members_core_team(display_order);
CREATE INDEX IF NOT EXISTS idx_members_post_holders_display_order ON public.members_post_holders(display_order);
CREATE INDEX IF NOT EXISTS idx_members_executive_display_order ON public.members_executive(display_order);

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- All tables created with proper structure
-- Row Level Security enabled with public access policies
-- Performance indexes created
-- Email is optional for all member tables
-- Gallery supports multiple images (text array)
-- Ready for use with ISTE GNDEC website
