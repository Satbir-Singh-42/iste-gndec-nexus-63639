-- SQL Migration: Add month to convenors and individual section visibility controls
-- Run this in Supabase SQL Editor

-- 1. Add month field to past_convenors table
ALTER TABLE past_convenors 
ADD COLUMN IF NOT EXISTS tenure_month INTEGER CHECK (tenure_month >= 1 AND tenure_month <= 12);

COMMENT ON COLUMN past_convenors.tenure_month IS 'Month of tenure (1-12, optional)';

-- 2. Add individual section visibility controls to site_settings
INSERT INTO site_settings (setting_key, setting_value, description)
VALUES 
  ('hide_chapter_awards', false, 'Hide Chapter Awards section from achievements page'),
  ('hide_past_convenors', false, 'Hide Past Convenors section from achievements page'),
  ('hide_student_achievements', false, 'Hide Student Achievements section from achievements page')
ON CONFLICT (setting_key) DO NOTHING;

-- 3. Remove the old hide_achievements_section setting (if it exists)
DELETE FROM site_settings WHERE setting_key = 'hide_achievements_section';

-- 4. Optional: Update existing convenors with default month (January)
-- Uncomment the line below if you want to set a default month for existing records
-- UPDATE past_convenors SET tenure_month = 1 WHERE tenure_month IS NULL;
