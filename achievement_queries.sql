-- ====================================
-- ACHIEVEMENT TABLES SQL QUERIES
-- ISTE GNDEC Student Chapter Website
-- ====================================
--
-- This file contains all SQL queries for:
-- 1. Chapter Awards
-- 2. Past Convenors
-- 3. Student Achievements
--
-- Each section includes: CREATE, INSERT, DELETE, and DROP queries
--

-- ====================================
-- 1. CHAPTER AWARDS
-- ====================================

-- DROP TABLE (Use carefully - this deletes all data!)
DROP TABLE IF EXISTS chapter_awards CASCADE;

-- CREATE TABLE
CREATE TABLE chapter_awards (
  id SERIAL PRIMARY KEY,
  award_title TEXT NOT NULL,
  year TEXT NOT NULL,
  description TEXT NOT NULL,
  certificate_image TEXT NOT NULL,
  certificate_images TEXT[],  -- Array for multiple images
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);

-- INSERT SAMPLE DATA
INSERT INTO chapter_awards (award_title, year, description, certificate_image, certificate_images, display_order) 
VALUES 
  (
    'Best Student Chapter Award',
    '2023',
    'Awarded by ISTE National for outstanding performance and contribution to technical activities.',
    'https://example.com/certificate1.jpg',
    ARRAY['https://example.com/certificate1.jpg', 'https://example.com/certificate1-back.jpg'],
    1
  ),
  (
    'Excellence in Innovation',
    '2022',
    'Recognition for innovative projects and technical workshops conducted throughout the year.',
    'https://example.com/certificate2.jpg',
    ARRAY['https://example.com/certificate2.jpg'],
    2
  );

-- DELETE SPECIFIC AWARD (by ID)
DELETE FROM chapter_awards WHERE id = 1;

-- DELETE SPECIFIC AWARD (by title)
DELETE FROM chapter_awards WHERE award_title = 'Best Student Chapter Award';

-- DELETE AWARDS BY YEAR
DELETE FROM chapter_awards WHERE year = '2023';

-- DELETE ALL AWARDS (Use carefully!)
DELETE FROM chapter_awards;


-- ====================================
-- 2. PAST CONVENORS
-- ====================================

-- DROP TABLE (Use carefully - this deletes all data!)
DROP TABLE IF EXISTS past_convenors CASCADE;

-- CREATE TABLE
CREATE TABLE past_convenors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  tenure_start TEXT NOT NULL,
  tenure_end TEXT NOT NULL,
  tenure_month INTEGER,  -- 1-12 for months (optional)
  description TEXT,
  email TEXT,
  linkedin TEXT,
  github TEXT,
  instagram TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);

-- INSERT SAMPLE DATA
INSERT INTO past_convenors (name, image, tenure_start, tenure_end, tenure_month, description, email, linkedin, github, instagram, display_order) 
VALUES 
  (
    'Dr. Rajesh Kumar',
    'https://example.com/convenor1.jpg',
    '2020',
    '2021',
    7,  -- July
    'Led the chapter during challenging times with exceptional dedication and vision.',
    'rajesh.kumar@example.com',
    'https://linkedin.com/in/rajeshkumar',
    'https://github.com/rajeshkumar',
    'https://instagram.com/rajeshkumar',
    1
  ),
  (
    'Prof. Priya Sharma',
    'https://example.com/convenor2.jpg',
    '2021',
    '2022',
    NULL,  -- No specific month
    'Initiated multiple industry collaborations and student development programs.',
    'priya.sharma@example.com',
    'https://linkedin.com/in/priyasharma',
    NULL,
    NULL,
    2
  );

-- DELETE SPECIFIC CONVENOR (by ID)
DELETE FROM past_convenors WHERE id = 1;

-- DELETE SPECIFIC CONVENOR (by name)
DELETE FROM past_convenors WHERE name = 'Dr. Rajesh Kumar';

-- DELETE CONVENORS BY TENURE YEAR
DELETE FROM past_convenors WHERE tenure_start = '2020';

-- DELETE ALL CONVENORS (Use carefully!)
DELETE FROM past_convenors;


-- ====================================
-- 3. STUDENT ACHIEVEMENTS
-- ====================================

-- DROP TABLE (Use carefully - this deletes all data!)
DROP TABLE IF EXISTS student_achievements CASCADE;

-- CREATE TABLE
CREATE TABLE student_achievements (
  id SERIAL PRIMARY KEY,
  student_name TEXT NOT NULL,
  event_name TEXT NOT NULL,
  position TEXT NOT NULL,
  date TEXT NOT NULL,
  organized_by TEXT NOT NULL,
  description TEXT NOT NULL,
  achievement_image TEXT NOT NULL,  -- Primary image (for backward compatibility)
  achievement_images TEXT[],  -- Array for multiple images
  linkedin TEXT,
  github TEXT,
  instagram TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);

-- INSERT SAMPLE DATA
INSERT INTO student_achievements (student_name, event_name, position, date, organized_by, description, achievement_image, achievement_images, linkedin, github, instagram, display_order) 
VALUES 
  (
    'Amit Singh',
    'National Hackathon 2023',
    '1st Place',
    '2023-10-15',
    'IEEE India Council',
    'Developed an innovative AI-based solution for healthcare management that won first prize among 200+ teams.',
    'https://example.com/achievement1.jpg',
    ARRAY['https://example.com/achievement1.jpg', 'https://example.com/achievement1-team.jpg'],
    'https://linkedin.com/in/amitsingh',
    'https://github.com/amitsingh',
    'https://instagram.com/amitsingh',
    1
  ),
  (
    'Neha Patel',
    'Smart India Hackathon',
    '2nd Place',
    '2023-08-20',
    'Ministry of Education',
    'Created a blockchain-based solution for academic credential verification.',
    'https://example.com/achievement2.jpg',
    ARRAY['https://example.com/achievement2.jpg'],
    'https://linkedin.com/in/nehapatel',
    NULL,
    NULL,
    2
  );

-- DELETE SPECIFIC ACHIEVEMENT (by ID)
DELETE FROM student_achievements WHERE id = 1;

-- DELETE SPECIFIC ACHIEVEMENT (by student name)
DELETE FROM student_achievements WHERE student_name = 'Amit Singh';

-- DELETE ACHIEVEMENTS BY EVENT
DELETE FROM student_achievements WHERE event_name = 'National Hackathon 2023';

-- DELETE ACHIEVEMENTS BY DATE
DELETE FROM student_achievements WHERE date = '2023-10-15';

-- DELETE ALL ACHIEVEMENTS (Use carefully!)
DELETE FROM student_achievements;


-- ====================================
-- UTILITY QUERIES
-- ====================================

-- VIEW ALL CHAPTER AWARDS (ordered by display_order)
SELECT * FROM chapter_awards 
WHERE hidden = false 
ORDER BY display_order ASC, created_at DESC;

-- VIEW ALL PAST CONVENORS (ordered by display_order)
SELECT * FROM past_convenors 
WHERE hidden = false 
ORDER BY display_order ASC, created_at DESC;

-- VIEW ALL STUDENT ACHIEVEMENTS (ordered by display_order)
SELECT * FROM student_achievements 
WHERE hidden = false 
ORDER BY display_order ASC, created_at DESC;

-- COUNT RECORDS IN EACH TABLE
SELECT 'chapter_awards' as table_name, COUNT(*) as count FROM chapter_awards
UNION ALL
SELECT 'past_convenors' as table_name, COUNT(*) as count FROM past_convenors
UNION ALL
SELECT 'student_achievements' as table_name, COUNT(*) as count FROM student_achievements;

-- HIDE/SHOW RECORDS (Toggle visibility without deleting)
-- Hide specific award
UPDATE chapter_awards SET hidden = true WHERE id = 1;
-- Show specific award
UPDATE chapter_awards SET hidden = false WHERE id = 1;

-- UPDATE DISPLAY ORDER
UPDATE chapter_awards SET display_order = 1 WHERE id = 1;
UPDATE chapter_awards SET display_order = 2 WHERE id = 2;


-- ====================================
-- QUICK SETUP SCRIPT
-- ====================================
-- Run this to create all tables from scratch

BEGIN;

-- Drop existing tables
DROP TABLE IF EXISTS chapter_awards CASCADE;
DROP TABLE IF EXISTS past_convenors CASCADE;
DROP TABLE IF EXISTS student_achievements CASCADE;

-- Create chapter_awards table
CREATE TABLE chapter_awards (
  id SERIAL PRIMARY KEY,
  award_title TEXT NOT NULL,
  year TEXT NOT NULL,
  description TEXT NOT NULL,
  certificate_image TEXT NOT NULL,
  certificate_images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);

-- Create past_convenors table
CREATE TABLE past_convenors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  tenure_start TEXT NOT NULL,
  tenure_end TEXT NOT NULL,
  tenure_month INTEGER,
  description TEXT,
  email TEXT,
  linkedin TEXT,
  github TEXT,
  instagram TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);

-- Create student_achievements table
CREATE TABLE student_achievements (
  id SERIAL PRIMARY KEY,
  student_name TEXT NOT NULL,
  event_name TEXT NOT NULL,
  position TEXT NOT NULL,
  date TEXT NOT NULL,
  organized_by TEXT NOT NULL,
  description TEXT NOT NULL,
  achievement_image TEXT NOT NULL,
  achievement_images TEXT[],
  linkedin TEXT,
  github TEXT,
  instagram TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);

COMMIT;


-- ====================================
-- MIGRATION SCRIPT (Add new fields to existing tables)
-- ====================================
-- Use this if you already have tables and want to add new fields

-- Add certificate_images to chapter_awards (if not exists)
ALTER TABLE chapter_awards 
ADD COLUMN IF NOT EXISTS certificate_images TEXT[];

-- Add social media and email fields to past_convenors (if not exists)
ALTER TABLE past_convenors 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT;

-- Add achievement_images and social fields to student_achievements (if not exists)
ALTER TABLE student_achievements 
ADD COLUMN IF NOT EXISTS achievement_images TEXT[],
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT;


-- ====================================
-- BACKUP QUERIES
-- ====================================

-- Export data (use pg_dump or copy to CSV)
COPY chapter_awards TO '/tmp/chapter_awards_backup.csv' CSV HEADER;
COPY past_convenors TO '/tmp/past_convenors_backup.csv' CSV HEADER;
COPY student_achievements TO '/tmp/student_achievements_backup.csv' CSV HEADER;

-- Import data from CSV
COPY chapter_awards FROM '/tmp/chapter_awards_backup.csv' CSV HEADER;
COPY past_convenors FROM '/tmp/past_convenors_backup.csv' CSV HEADER;
COPY student_achievements FROM '/tmp/student_achievements_backup.csv' CSV HEADER;
