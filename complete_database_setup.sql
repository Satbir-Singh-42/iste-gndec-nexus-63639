-- COMPLETE DATABASE SETUP FOR COLLEGE WEBSITE
-- Run this in your Supabase SQL Editor
-- This file matches all the code structures exactly

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'UPCOMING',
  capacity TEXT,
  organizer TEXT,
  details TEXT,
  agenda TEXT[],
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- EVENT HIGHLIGHTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS event_highlights (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  poster TEXT NOT NULL,
  instagram_link TEXT,
  attendees TEXT,
  highlights TEXT[],
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- GALLERY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Events',
  description TEXT NOT NULL,
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- NOTICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notices (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'EVENT',
  status TEXT NOT NULL DEFAULT 'UPCOMING',
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- MEMBERS - FACULTY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS members_faculty (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  linkedin TEXT,
  github TEXT,
  instagram TEXT,
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- MEMBERS - CORE TEAM TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS members_core_team (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  image TEXT NOT NULL,
  email TEXT NOT NULL,
  linkedin TEXT,
  github TEXT,
  instagram TEXT,
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- MEMBERS - POST HOLDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS members_post_holders (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  image TEXT NOT NULL,
  email TEXT NOT NULL,
  linkedin TEXT,
  github TEXT,
  instagram TEXT,
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- MEMBERS - EXECUTIVE TEAM TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS members_executive (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  image TEXT NOT NULL,
  email TEXT NOT NULL,
  linkedin TEXT,
  github TEXT,
  instagram TEXT,
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- IF TABLES ALREADY EXIST, USE THESE ALTER STATEMENTS
-- ============================================

-- Add missing columns to events
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- Add missing columns to event_highlights
ALTER TABLE event_highlights 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- Add missing columns to gallery
ALTER TABLE gallery 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- Add missing columns to members_faculty
ALTER TABLE members_faculty 
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- Add missing columns to members_core_team
ALTER TABLE members_core_team 
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- Add missing columns to members_post_holders
ALTER TABLE members_post_holders 
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- Add missing columns to members_executive
ALTER TABLE members_executive 
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- ============================================
-- ENABLE ROW LEVEL SECURITY (OPTIONAL BUT RECOMMENDED)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE members_faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE members_core_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE members_post_holders ENABLE ROW LEVEL SECURITY;
ALTER TABLE members_executive ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access (for website visitors)
-- And allow authenticated users to do everything (for admin panel)

-- Events policies
CREATE POLICY "Public can view non-hidden events" ON events FOR SELECT USING (hidden IS NULL OR hidden = false);
CREATE POLICY "Authenticated users can do everything with events" ON events FOR ALL USING (auth.role() = 'authenticated');

-- Event highlights policies
CREATE POLICY "Public can view non-hidden highlights" ON event_highlights FOR SELECT USING (hidden IS NULL OR hidden = false);
CREATE POLICY "Authenticated users can do everything with highlights" ON event_highlights FOR ALL USING (auth.role() = 'authenticated');

-- Gallery policies
CREATE POLICY "Public can view non-hidden gallery items" ON gallery FOR SELECT USING (hidden IS NULL OR hidden = false);
CREATE POLICY "Authenticated users can do everything with gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');

-- Notices policies (all public)
CREATE POLICY "Public can view all notices" ON notices FOR SELECT USING (true);
CREATE POLICY "Authenticated users can do everything with notices" ON notices FOR ALL USING (auth.role() = 'authenticated');

-- Members faculty policies
CREATE POLICY "Public can view non-hidden faculty" ON members_faculty FOR SELECT USING (hidden IS NULL OR hidden = false);
CREATE POLICY "Authenticated users can do everything with faculty" ON members_faculty FOR ALL USING (auth.role() = 'authenticated');

-- Members core team policies
CREATE POLICY "Public can view non-hidden core team" ON members_core_team FOR SELECT USING (hidden IS NULL OR hidden = false);
CREATE POLICY "Authenticated users can do everything with core team" ON members_core_team FOR ALL USING (auth.role() = 'authenticated');

-- Members post holders policies
CREATE POLICY "Public can view non-hidden post holders" ON members_post_holders FOR SELECT USING (hidden IS NULL OR hidden = false);
CREATE POLICY "Authenticated users can do everything with post holders" ON members_post_holders FOR ALL USING (auth.role() = 'authenticated');

-- Members executive policies
CREATE POLICY "Public can view non-hidden executive" ON members_executive FOR SELECT USING (hidden IS NULL OR hidden = false);
CREATE POLICY "Authenticated users can do everything with executive" ON members_executive FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- HELPER: DROP POLICIES (USE IF YOU NEED TO RECREATE THEM)
-- ============================================
/*
DROP POLICY IF EXISTS "Public can view non-hidden events" ON events;
DROP POLICY IF EXISTS "Authenticated users can do everything with events" ON events;
DROP POLICY IF EXISTS "Public can view non-hidden highlights" ON event_highlights;
DROP POLICY IF EXISTS "Authenticated users can do everything with highlights" ON event_highlights;
DROP POLICY IF EXISTS "Public can view non-hidden gallery items" ON gallery;
DROP POLICY IF EXISTS "Authenticated users can do everything with gallery" ON gallery;
DROP POLICY IF EXISTS "Public can view all notices" ON notices;
DROP POLICY IF EXISTS "Authenticated users can do everything with notices" ON notices;
DROP POLICY IF EXISTS "Public can view non-hidden faculty" ON members_faculty;
DROP POLICY IF EXISTS "Authenticated users can do everything with faculty" ON members_faculty;
DROP POLICY IF EXISTS "Public can view non-hidden core team" ON members_core_team;
DROP POLICY IF EXISTS "Authenticated users can do everything with core team" ON members_core_team;
DROP POLICY IF EXISTS "Public can view non-hidden post holders" ON members_post_holders;
DROP POLICY IF EXISTS "Authenticated users can do everything with post holders" ON members_post_holders;
DROP POLICY IF EXISTS "Public can view non-hidden executive" ON members_executive;
DROP POLICY IF EXISTS "Authenticated users can do everything with executive" ON members_executive;
*/
