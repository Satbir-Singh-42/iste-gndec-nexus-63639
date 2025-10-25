-- Complete SQL Migration for Achievements Page Enhancements
-- Run this in Supabase SQL Editor
-- This includes: multiple images, social links, month field, and individual section visibility

-- 1. Modify student_achievements table
-- Change single image to array of images
ALTER TABLE student_achievements 
DROP COLUMN IF EXISTS achievement_image CASCADE;

ALTER TABLE student_achievements 
ADD COLUMN IF NOT EXISTS achievement_images TEXT[] DEFAULT '{}';

-- Add social media links
ALTER TABLE student_achievements 
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT;

COMMENT ON COLUMN student_achievements.achievement_images IS 'Array of image URLs for student achievements';
COMMENT ON COLUMN student_achievements.linkedin IS 'LinkedIn profile URL (optional)';
COMMENT ON COLUMN student_achievements.github IS 'GitHub profile URL (optional)';
COMMENT ON COLUMN student_achievements.instagram IS 'Instagram profile URL (optional)';

-- 2. Add month field to past_convenors table
ALTER TABLE past_convenors 
ADD COLUMN IF NOT EXISTS tenure_month INTEGER CHECK (tenure_month >= 1 AND tenure_month <= 12);

COMMENT ON COLUMN past_convenors.tenure_month IS 'Month of tenure (1-12, optional)';

-- 3. Add individual section visibility controls to site_settings
INSERT INTO site_settings (setting_key, setting_value, description)
VALUES 
  ('hide_chapter_awards', false, 'Hide Chapter Awards section from achievements page'),
  ('hide_past_convenors', false, 'Hide Past Convenors section from achievements page'),
  ('hide_student_achievements', false, 'Hide Student Achievements section from achievements page')
ON CONFLICT (setting_key) DO NOTHING;

-- 4. Remove the old hide_achievements_section setting (if it exists)
DELETE FROM site_settings WHERE setting_key = 'hide_achievements_section';

-- 5. Optional: Migrate existing single achievement_image to achievement_images array
-- Uncomment the lines below if you have existing data with achievement_image column
-- UPDATE student_achievements 
-- SET achievement_images = ARRAY[achievement_image]::TEXT[]
-- WHERE achievement_image IS NOT NULL AND achievement_image != '';
