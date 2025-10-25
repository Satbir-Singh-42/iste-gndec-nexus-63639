-- ==========================================
-- FINAL ACHIEVEMENT TABLES SQL SETUP
-- ISTE GNDEC Student Chapter Website
-- ==========================================
--
-- This file contains COMPLETE SQL queries for:
-- 1. Chapter Awards (with multiple certificate images)
-- 2. Past Convenors (with separate start/end months and social media)
-- 3. Student Achievements (with multiple images and social media)
--
-- Updated: October 25, 2025
-- ==========================================


-- ==========================================
-- SECTION 1: DROP ALL TABLES (OPTIONAL - USE WITH CAUTION!)
-- ==========================================
-- Uncomment the lines below ONLY if you want to start fresh
-- WARNING: This will delete ALL achievement data!

-- DROP TABLE IF EXISTS chapter_awards CASCADE;
-- DROP TABLE IF EXISTS past_convenors CASCADE;
-- DROP TABLE IF EXISTS student_achievements CASCADE;


-- ==========================================
-- SECTION 2: CREATE ALL TABLES
-- ==========================================

-- 2.1 CHAPTER AWARDS TABLE
CREATE TABLE IF NOT EXISTS chapter_awards (
  id SERIAL PRIMARY KEY,
  award_title TEXT NOT NULL,
  year TEXT NOT NULL,
  description TEXT NOT NULL,
  certificate_image TEXT NOT NULL,  -- Primary/first certificate image
  certificate_images TEXT[],  -- Array of all certificate images (including primary)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);

-- 2.2 PAST CONVENORS TABLE
CREATE TABLE IF NOT EXISTS past_convenors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  tenure_start TEXT NOT NULL,  -- Start year (e.g., "2020")
  tenure_end TEXT NOT NULL,    -- End year (e.g., "2022")
  start_month INTEGER,  -- Start month (1-12, optional) - e.g., 6 for June
  end_month INTEGER,    -- End month (1-12, optional) - e.g., 4 for April
  description TEXT,
  email TEXT,
  linkedin TEXT,
  github TEXT,
  instagram TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);

-- 2.3 STUDENT ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS student_achievements (
  id SERIAL PRIMARY KEY,
  student_name TEXT NOT NULL,
  event_name TEXT NOT NULL,
  position TEXT NOT NULL,  -- e.g., "1st Place", "Winner", "Runner-up"
  date TEXT NOT NULL,  -- Event date
  organized_by TEXT NOT NULL,  -- Organizing body
  description TEXT NOT NULL,
  achievement_image TEXT NOT NULL,  -- Primary image (for backward compatibility)
  achievement_images TEXT[],  -- Array of all achievement images
  linkedin TEXT,
  github TEXT,
  instagram TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);


-- ==========================================
-- SECTION 3: SAMPLE DATA INSERTS
-- ==========================================

-- 3.1 SAMPLE CHAPTER AWARDS
INSERT INTO chapter_awards (award_title, year, description, certificate_image, certificate_images, display_order) 
VALUES 
  (
    'Best Student Chapter Award 2023',
    '2023',
    'Awarded by ISTE National for outstanding performance, highest student participation, and innovative technical activities throughout the year. This prestigious award recognizes excellence in chapter management and student engagement.',
    'https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Best+Chapter+2023',
    ARRAY['https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Best+Chapter+2023', 'https://via.placeholder.com/800x600/7B68EE/FFFFFF?text=Certificate+Back'],
    1
  ),
  (
    'Excellence in Innovation Award',
    '2022',
    'Recognition for conducting 15+ innovative technical workshops, organizing 3 national-level hackathons, and maintaining active industry collaborations. Presented at ISTE Annual Convention 2022.',
    'https://via.placeholder.com/800x600/50C878/FFFFFF?text=Innovation+Award+2022',
    ARRAY['https://via.placeholder.com/800x600/50C878/FFFFFF?text=Innovation+Award+2022'],
    2
  ),
  (
    'Outstanding Outreach Program',
    '2021',
    'Awarded for exemplary community outreach programs reaching 500+ students across 10 institutions, conducting free coding bootcamps and technical awareness sessions.',
    'https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=Outreach+2021',
    ARRAY['https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=Outreach+2021'],
    3
  );

-- 3.2 SAMPLE PAST CONVENORS
-- Note: start_month and end_month are optional (1=Jan, 2=Feb, ..., 12=Dec)
INSERT INTO past_convenors (name, image, tenure_start, tenure_end, start_month, end_month, description, email, linkedin, github, instagram, display_order) 
VALUES 
  (
    'Dr. Rajesh Kumar',
    'https://via.placeholder.com/400x400/4A90E2/FFFFFF?text=Dr.+Rajesh',
    '2020',
    '2021',
    7,  -- July 2020
    4,  -- April 2021
    'Led the chapter during challenging pandemic times with exceptional dedication and vision. Successfully transitioned all activities to virtual mode, maintaining 90% student engagement. Initiated 5 industry partnerships and mentored 50+ students.',
    'rajesh.kumar@gndec.ac.in',
    'https://linkedin.com/in/rajesh-kumar-prof',
    'https://github.com/rajeshkumar',
    'https://instagram.com/dr.rajeshkumar',
    1
  ),
  (
    'Prof. Priya Sharma',
    'https://via.placeholder.com/400x400/7B68EE/FFFFFF?text=Prof.+Priya',
    '2021',
    '2022',
    5,  -- May 2021
    6,  -- June 2022
    'Spearheaded multiple industry collaborations with top tech companies. Launched the chapter\'s first annual tech fest attracting 1000+ participants. Established student innovation lab and mentorship program.',
    'priya.sharma@gndec.ac.in',
    'https://linkedin.com/in/priya-sharma-prof',
    NULL,
    NULL,
    2
  ),
  (
    'Dr. Amit Singh',
    'https://via.placeholder.com/400x400/50C878/FFFFFF?text=Dr.+Amit',
    '2019',
    '2020',
    NULL,  -- No specific start month (defaults to year only)
    NULL,  -- No specific end month
    'Pioneer convenor who established the chapter\'s foundation. Set up organizational structure, recruited initial team of 30 members, and organized the inaugural workshop series.',
    'amit.singh@gndec.ac.in',
    'https://linkedin.com/in/dr-amit-singh',
    NULL,
    NULL,
    3
  );

-- 3.3 SAMPLE STUDENT ACHIEVEMENTS
INSERT INTO student_achievements (student_name, event_name, position, date, organized_by, description, achievement_image, achievement_images, linkedin, github, instagram, display_order) 
VALUES 
  (
    'Amit Patel',
    'Smart India Hackathon 2023',
    '1st Place - Software Edition',
    '2023-12-10',
    'Ministry of Education, Govt. of India',
    'Developed an AI-powered educational platform that personalizes learning paths for students with special needs. The solution uses machine learning to adapt content difficulty and presentation style. Competed against 15,000+ teams nationwide. Project is now being piloted in 50 schools.',
    'https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=SIH+Winner+2023',
    ARRAY['https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=SIH+Winner+2023', 'https://via.placeholder.com/600x400/7B68EE/FFFFFF?text=Team+Photo', 'https://via.placeholder.com/600x400/50C878/FFFFFF?text=Project+Demo'],
    'https://linkedin.com/in/amit-patel-sih',
    'https://github.com/amitpatel',
    'https://instagram.com/amit.codes',
    1
  ),
  (
    'Neha Gupta',
    'Google Solution Challenge 2023',
    '2nd Place - Asia Pacific Region',
    '2023-09-22',
    'Google Developers',
    'Created a blockchain-based supply chain transparency platform for agricultural products. The solution helps farmers get fair prices and allows consumers to verify product authenticity. Implemented using Flutter, Firebase, and Ethereum smart contracts.',
    'https://via.placeholder.com/800x600/50C878/FFFFFF?text=Google+Challenge',
    ARRAY['https://via.placeholder.com/800x600/50C878/FFFFFF?text=Google+Challenge', 'https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Certificate'],
    'https://linkedin.com/in/neha-gupta-dev',
    'https://github.com/nehagupta',
    NULL,
    2
  ),
  (
    'Rahul Verma & Sanjay Kumar',
    'ACM ICPC Asia Regional Contest',
    'Silver Medal (Rank 12)',
    '2023-11-18',
    'Association for Computing Machinery (ACM)',
    'Competed in the prestigious ACM International Collegiate Programming Contest. Solved 7 out of 13 complex algorithmic problems in 5 hours. Ranked among top 20 teams from 250+ participating institutions across Asia.',
    'https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=ACM+ICPC+Medal',
    ARRAY['https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=ACM+ICPC+Medal'],
    'https://linkedin.com/in/rahul-verma-acm',
    'https://github.com/rahulverma',
    NULL,
    3
  );


-- ==========================================
-- SECTION 4: MIGRATION SCRIPT (ADD NEW COLUMNS)
-- ==========================================
-- Use this if you already have tables and want to add new fields
-- This is safe to run multiple times (uses IF NOT EXISTS)

-- Add certificate_images column to chapter_awards
ALTER TABLE chapter_awards 
ADD COLUMN IF NOT EXISTS certificate_images TEXT[];

-- Add month columns and social media fields to past_convenors
ALTER TABLE past_convenors 
ADD COLUMN IF NOT EXISTS start_month INTEGER,
ADD COLUMN IF NOT EXISTS end_month INTEGER,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT;

-- Remove old tenure_month column if it exists (since we now use start_month and end_month)
-- Uncomment only if you're migrating from the old single tenure_month field
-- ALTER TABLE past_convenors DROP COLUMN IF EXISTS tenure_month;

-- Add achievement_images and social fields to student_achievements
ALTER TABLE student_achievements 
ADD COLUMN IF NOT EXISTS achievement_images TEXT[],
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT;


-- ==========================================
-- SECTION 5: UPDATE EXISTING DATA
-- ==========================================
-- Convert single images to arrays for existing records

-- Update chapter_awards: copy certificate_image into certificate_images array
UPDATE chapter_awards 
SET certificate_images = ARRAY[certificate_image]
WHERE certificate_images IS NULL AND certificate_image IS NOT NULL;

-- Update student_achievements: copy achievement_image into achievement_images array
UPDATE student_achievements 
SET achievement_images = ARRAY[achievement_image]
WHERE achievement_images IS NULL AND achievement_image IS NOT NULL;


-- ==========================================
-- SECTION 6: UTILITY QUERIES
-- ==========================================

-- 6.1 View all records (ordered by display_order, only visible items)
SELECT * FROM chapter_awards 
WHERE hidden = false OR hidden IS NULL
ORDER BY display_order ASC, created_at DESC;

SELECT * FROM past_convenors 
WHERE hidden = false OR hidden IS NULL
ORDER BY display_order ASC, created_at DESC;

SELECT * FROM student_achievements 
WHERE hidden = false OR hidden IS NULL
ORDER BY display_order ASC, created_at DESC;

-- 6.2 View all records (including hidden)
SELECT * FROM chapter_awards ORDER BY display_order ASC, created_at DESC;
SELECT * FROM past_convenors ORDER BY display_order ASC, created_at DESC;
SELECT * FROM student_achievements ORDER BY display_order ASC, created_at DESC;

-- 6.3 Count records in each table
SELECT 
  'chapter_awards' as table_name, 
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE hidden = false OR hidden IS NULL) as visible_count
FROM chapter_awards
UNION ALL
SELECT 
  'past_convenors' as table_name, 
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE hidden = false OR hidden IS NULL) as visible_count
FROM past_convenors
UNION ALL
SELECT 
  'student_achievements' as table_name, 
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE hidden = false OR hidden IS NULL) as visible_count
FROM student_achievements;


-- ==========================================
-- SECTION 7: DELETE QUERIES
-- ==========================================

-- 7.1 Delete specific records by ID
DELETE FROM chapter_awards WHERE id = 1;
DELETE FROM past_convenors WHERE id = 1;
DELETE FROM student_achievements WHERE id = 1;

-- 7.2 Delete by specific field
DELETE FROM chapter_awards WHERE year = '2023';
DELETE FROM past_convenors WHERE name = 'Dr. Rajesh Kumar';
DELETE FROM student_achievements WHERE student_name = 'Amit Patel';

-- 7.3 Delete ALL records (USE WITH EXTREME CAUTION!)
-- Uncomment only if you're sure you want to delete all data
-- DELETE FROM chapter_awards;
-- DELETE FROM past_convenors;
-- DELETE FROM student_achievements;


-- ==========================================
-- SECTION 8: HIDE/SHOW RECORDS (SOFT DELETE)
-- ==========================================

-- Hide specific records (makes them invisible in frontend)
UPDATE chapter_awards SET hidden = true WHERE id = 1;
UPDATE past_convenors SET hidden = true WHERE id = 1;
UPDATE student_achievements SET hidden = true WHERE id = 1;

-- Show hidden records
UPDATE chapter_awards SET hidden = false WHERE id = 1;
UPDATE past_convenors SET hidden = false WHERE id = 1;
UPDATE student_achievements SET hidden = false WHERE id = 1;

-- Hide all records
UPDATE chapter_awards SET hidden = true;
UPDATE past_convenors SET hidden = true;
UPDATE student_achievements SET hidden = true;

-- Show all records
UPDATE chapter_awards SET hidden = false;
UPDATE past_convenors SET hidden = false;
UPDATE student_achievements SET hidden = false;


-- ==========================================
-- SECTION 9: ORDERING QUERIES
-- ==========================================

-- 9.1 Update display order for specific records
UPDATE chapter_awards SET display_order = 1 WHERE id = 5;
UPDATE past_convenors SET display_order = 1 WHERE id = 3;
UPDATE student_achievements SET display_order = 1 WHERE id = 7;

-- 9.2 Reset all display orders to sequential values
-- Chapter Awards
WITH ranked_awards AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as new_order
  FROM chapter_awards
)
UPDATE chapter_awards 
SET display_order = ranked_awards.new_order
FROM ranked_awards
WHERE chapter_awards.id = ranked_awards.id;

-- Past Convenors (ordered by tenure start year, descending)
WITH ranked_convenors AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY tenure_start DESC, tenure_end DESC) as new_order
  FROM past_convenors
)
UPDATE past_convenors 
SET display_order = ranked_convenors.new_order
FROM ranked_convenors
WHERE past_convenors.id = ranked_convenors.id;

-- Student Achievements (ordered by date, descending)
WITH ranked_achievements AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY date DESC) as new_order
  FROM student_achievements
)
UPDATE student_achievements 
SET display_order = ranked_achievements.new_order
FROM ranked_achievements
WHERE student_achievements.id = ranked_achievements.id;


-- ==========================================
-- SECTION 10: SEARCH QUERIES
-- ==========================================

-- 10.1 Search chapter awards by year or title
SELECT * FROM chapter_awards 
WHERE year = '2023' OR award_title ILIKE '%innovation%'
ORDER BY display_order ASC;

-- 10.2 Search past convenors by name or tenure
SELECT * FROM past_convenors 
WHERE name ILIKE '%rajesh%' 
   OR tenure_start = '2020'
ORDER BY display_order ASC;

-- 10.3 Search student achievements by student name or event
SELECT * FROM student_achievements 
WHERE student_name ILIKE '%amit%' 
   OR event_name ILIKE '%hackathon%'
ORDER BY display_order ASC;

-- 10.4 Find convenors with specific tenure months (e.g., June to April)
SELECT * FROM past_convenors 
WHERE start_month = 6 AND end_month = 4
ORDER BY tenure_start DESC;


-- ==========================================
-- SECTION 11: ADVANCED QUERIES
-- ==========================================

-- 11.1 Get achievements for a specific year
SELECT 
  'chapter' as type, 
  award_title as title, 
  year as year_achieved, 
  display_order
FROM chapter_awards 
WHERE year = '2023'
UNION ALL
SELECT 
  'student' as type, 
  event_name as title, 
  EXTRACT(YEAR FROM date::date)::text as year_achieved, 
  display_order
FROM student_achievements 
WHERE EXTRACT(YEAR FROM date::date) = 2023
ORDER BY display_order ASC;

-- 11.2 Count achievements with images vs without
SELECT 
  'chapter_awards' as table_name,
  COUNT(*) FILTER (WHERE certificate_images IS NOT NULL AND array_length(certificate_images, 1) > 1) as multiple_images,
  COUNT(*) FILTER (WHERE certificate_images IS NULL OR array_length(certificate_images, 1) <= 1) as single_image
FROM chapter_awards
UNION ALL
SELECT 
  'student_achievements' as table_name,
  COUNT(*) FILTER (WHERE achievement_images IS NOT NULL AND array_length(achievement_images, 1) > 1) as multiple_images,
  COUNT(*) FILTER (WHERE achievement_images IS NULL OR array_length(achievement_images, 1) <= 1) as single_image
FROM student_achievements;

-- 11.3 List convenors with social media links
SELECT 
  name, 
  tenure_start || ' - ' || tenure_end as tenure,
  CASE WHEN email IS NOT NULL THEN '✓' ELSE '✗' END as has_email,
  CASE WHEN linkedin IS NOT NULL THEN '✓' ELSE '✗' END as has_linkedin,
  CASE WHEN github IS NOT NULL THEN '✓' ELSE '✗' END as has_github,
  CASE WHEN instagram IS NOT NULL THEN '✓' ELSE '✗' END as has_instagram
FROM past_convenors
ORDER BY display_order ASC;


-- ==========================================
-- SECTION 12: COMPLETE FRESH SETUP (ALL-IN-ONE)
-- ==========================================
-- Run this entire transaction to set up everything from scratch
-- WARNING: This will delete all existing data and recreate tables!

BEGIN;

-- Drop existing tables
DROP TABLE IF EXISTS chapter_awards CASCADE;
DROP TABLE IF EXISTS past_convenors CASCADE;
DROP TABLE IF EXISTS student_achievements CASCADE;

-- Create all tables with complete schema
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

CREATE TABLE past_convenors (
  id SERIAL PRIMARY KEY,
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);

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

-- ==========================================
-- DONE!
-- ==========================================
-- Your achievement tables are now ready to use.
-- Use the admin panel to add your real data.
-- ==========================================
