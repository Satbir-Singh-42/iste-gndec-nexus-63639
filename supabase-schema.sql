-- Create tables for ISTE GNDEC Student Chapter
-- Run this in your Supabase SQL Editor

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  capacity TEXT NOT NULL,
  organizer TEXT NOT NULL,
  details TEXT NOT NULL,
  agenda TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Members Faculty table
CREATE TABLE IF NOT EXISTS members_faculty (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Members Core Team table
CREATE TABLE IF NOT EXISTS members_core_team (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  image TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Members Post Holders table
CREATE TABLE IF NOT EXISTS members_post_holders (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  image TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notices table
CREATE TABLE IF NOT EXISTS notices (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Highlights table
CREATE TABLE IF NOT EXISTS event_highlights (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  poster TEXT NOT NULL,
  instagram_link TEXT NOT NULL,
  attendees TEXT NOT NULL,
  highlights TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE members_faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE members_core_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE members_post_holders ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_highlights ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read access for faculty" ON members_faculty FOR SELECT USING (true);
CREATE POLICY "Public read access for core team" ON members_core_team FOR SELECT USING (true);
CREATE POLICY "Public read access for post holders" ON members_post_holders FOR SELECT USING (true);
CREATE POLICY "Public read access for gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read access for notices" ON notices FOR SELECT USING (true);
CREATE POLICY "Public read access for event highlights" ON event_highlights FOR SELECT USING (true);

-- Create policies for authenticated users to insert/update/delete
CREATE POLICY "Authenticated users can insert events" ON events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update events" ON events FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete events" ON events FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert faculty" ON members_faculty FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update faculty" ON members_faculty FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete faculty" ON members_faculty FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert core team" ON members_core_team FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update core team" ON members_core_team FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete core team" ON members_core_team FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert post holders" ON members_post_holders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update post holders" ON members_post_holders FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete post holders" ON members_post_holders FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert gallery" ON gallery FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update gallery" ON gallery FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete gallery" ON gallery FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert notices" ON notices FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update notices" ON notices FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete notices" ON notices FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert highlights" ON event_highlights FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update highlights" ON event_highlights FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete highlights" ON event_highlights FOR DELETE TO authenticated USING (true);
