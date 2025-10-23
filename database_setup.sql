-- SQL queries to set up your database with ordering and visibility support
-- Run these in your Supabase SQL Editor

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  capacity TEXT,
  organizer TEXT,
  details TEXT,
  agenda TEXT[],
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Event Highlights table
CREATE TABLE IF NOT EXISTS event_highlights (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  poster TEXT NOT NULL,
  instagram_link TEXT,
  highlights TEXT[],
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  date TEXT,
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notices table
CREATE TABLE IF NOT EXISTS notices (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Members - Faculty
CREATE TABLE IF NOT EXISTS members_faculty (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  email TEXT NOT NULL,
  image TEXT NOT NULL,
  linkedin TEXT,
  github TEXT,
  instagram TEXT,
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Members - Core Team
CREATE TABLE IF NOT EXISTS members_core_team (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  email TEXT NOT NULL,
  image TEXT NOT NULL,
  linkedin TEXT,
  github TEXT,
  instagram TEXT,
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Members - Post Holders
CREATE TABLE IF NOT EXISTS members_post_holders (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  email TEXT NOT NULL,
  image TEXT NOT NULL,
  linkedin TEXT,
  github TEXT,
  instagram TEXT,
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Members - Executive Team
CREATE TABLE IF NOT EXISTS members_executive (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  email TEXT NOT NULL,
  image TEXT NOT NULL,
  linkedin TEXT,
  github TEXT,
  instagram TEXT,
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- If you already have these tables without the new columns, run these instead:

-- Add missing columns to existing events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- Add missing columns to existing event_highlights table
ALTER TABLE event_highlights 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- Add missing columns to existing gallery table
ALTER TABLE gallery 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- Add missing columns to existing members tables
ALTER TABLE members_faculty 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_order INTEGER,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT;

ALTER TABLE members_core_team 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_order INTEGER,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT;

ALTER TABLE members_post_holders 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_order INTEGER,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT;

ALTER TABLE members_executive 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_order INTEGER,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT;
