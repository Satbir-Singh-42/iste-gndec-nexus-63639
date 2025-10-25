-- ============================================
-- Complete Achievement Tables Schema
-- ============================================
-- This script drops all existing achievement tables and creates fresh ones
-- Execute this script in your Supabase SQL Editor

-- ============================================
-- 1. DROP EXISTING TABLES
-- ============================================

DROP TABLE IF EXISTS student_achievements CASCADE;
DROP TABLE IF EXISTS past_convenors CASCADE;
DROP TABLE IF EXISTS chapter_awards CASCADE;

-- ============================================
-- 2. CREATE CHAPTER AWARDS TABLE
-- ============================================

CREATE TABLE chapter_awards (
  id BIGSERIAL PRIMARY KEY,
  award_title TEXT NOT NULL,
  year TEXT NOT NULL,
  description TEXT NOT NULL,
  certificate_image TEXT NOT NULL,
  certificate_images TEXT[],
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for performance
CREATE INDEX idx_chapter_awards_display_order ON chapter_awards(display_order);
CREATE INDEX idx_chapter_awards_year ON chapter_awards(year);
CREATE INDEX idx_chapter_awards_hidden ON chapter_awards(hidden);

-- ============================================
-- 3. CREATE PAST CONVENORS TABLE
-- ============================================

CREATE TABLE past_convenors (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  tenure_start TEXT NOT NULL,
  tenure_end TEXT NOT NULL,
  start_month INTEGER,
  end_month INTEGER,
  description TEXT,
  email TEXT,
  linkedin TEXT,
  github TEXT,
  instagram TEXT,
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_past_convenors_display_order ON past_convenors(display_order);
CREATE INDEX idx_past_convenors_tenure ON past_convenors(tenure_start);
CREATE INDEX idx_past_convenors_hidden ON past_convenors(hidden);

-- ============================================
-- 4. CREATE STUDENT ACHIEVEMENTS TABLE
-- ============================================

CREATE TABLE student_achievements (
  id BIGSERIAL PRIMARY KEY,
  student_name TEXT NOT NULL,
  event_name TEXT NOT NULL,
  position TEXT NOT NULL,
  date TEXT NOT NULL,
  organized_by TEXT NOT NULL,
  description TEXT NOT NULL,
  achievement_image TEXT,
  achievement_images TEXT[],
  linkedin TEXT,
  github TEXT,
  instagram TEXT,
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_student_achievements_display_order ON student_achievements(display_order);
CREATE INDEX idx_student_achievements_date ON student_achievements(date);
CREATE INDEX idx_student_achievements_hidden ON student_achievements(hidden);

-- ============================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE chapter_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE past_convenors ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. CREATE RLS POLICIES
-- ============================================

-- Chapter Awards Policies
CREATE POLICY "Allow public read access to chapter awards"
  ON chapter_awards FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert chapter awards"
  ON chapter_awards FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update chapter awards"
  ON chapter_awards FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete chapter awards"
  ON chapter_awards FOR DELETE
  TO authenticated
  USING (true);

-- Past Convenors Policies
CREATE POLICY "Allow public read access to past convenors"
  ON past_convenors FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert past convenors"
  ON past_convenors FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update past convenors"
  ON past_convenors FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete past convenors"
  ON past_convenors FOR DELETE
  TO authenticated
  USING (true);

-- Student Achievements Policies
CREATE POLICY "Allow public read access to student achievements"
  ON student_achievements FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert student achievements"
  ON student_achievements FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update student achievements"
  ON student_achievements FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete student achievements"
  ON student_achievements FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 7. ADD COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE chapter_awards IS 'Stores annual best chapter awards received by ISTE GNDEC';
COMMENT ON TABLE past_convenors IS 'Stores profiles of past chapter convenors';
COMMENT ON TABLE student_achievements IS 'Stores student achievement records';

COMMENT ON COLUMN chapter_awards.display_order IS 'Custom display order for awards';
COMMENT ON COLUMN past_convenors.display_order IS 'Custom display order for convenors';
COMMENT ON COLUMN student_achievements.display_order IS 'Custom display order for achievements';

-- ============================================
-- Script completed successfully!
-- ============================================
