-- =====================================================
-- ACHIEVEMENTS PAGE ENHANCEMENT - SQL MIGRATION QUERIES
-- =====================================================
-- Run these queries in your Supabase SQL Editor
-- =====================================================

-- 1. ADD MULTIPLE IMAGES SUPPORT TO STUDENT ACHIEVEMENTS
-- Add new column for multiple images (array)
ALTER TABLE public.student_achievements 
ADD COLUMN IF NOT EXISTS achievement_images text[] DEFAULT '{}';

-- Migrate existing single image to array (if you have existing data)
UPDATE public.student_achievements 
SET achievement_images = ARRAY[achievement_image]
WHERE achievement_image IS NOT NULL 
AND achievement_image != ''
AND (achievement_images IS NULL OR achievement_images = '{}');

-- Optional: Remove old single image column after migration (uncomment if needed)
-- ALTER TABLE public.student_achievements DROP COLUMN IF EXISTS achievement_image;


-- 2. ADD SOCIAL MEDIA LINKS TO STUDENT ACHIEVEMENTS
ALTER TABLE public.student_achievements 
ADD COLUMN IF NOT EXISTS linkedin text;

ALTER TABLE public.student_achievements 
ADD COLUMN IF NOT EXISTS github text;

ALTER TABLE public.student_achievements 
ADD COLUMN IF NOT EXISTS instagram text;


-- 3. ADD SETTING TO HIDE ENTIRE ACHIEVEMENTS SECTION
INSERT INTO public.site_settings (setting_key, setting_value)
VALUES ('hide_achievements_section', false)
ON CONFLICT (setting_key) DO NOTHING;


-- 4. ADD INDEXES FOR BETTER PERFORMANCE (Optional but recommended)
CREATE INDEX IF NOT EXISTS idx_student_achievements_linkedin 
ON public.student_achievements(linkedin) 
WHERE linkedin IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_student_achievements_github 
ON public.student_achievements(github) 
WHERE github IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_student_achievements_instagram 
ON public.student_achievements(instagram) 
WHERE instagram IS NOT NULL;


-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the migration worked correctly

-- Check student_achievements table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'student_achievements'
ORDER BY ordinal_position;

-- Check site_settings for achievements visibility control
SELECT * FROM public.site_settings 
WHERE setting_key = 'hide_achievements_section';

-- Check if existing images were migrated to array
SELECT id, student_name, achievement_image, achievement_images 
FROM public.student_achievements 
LIMIT 5;


-- =====================================================
-- ROLLBACK QUERIES (Use only if you need to undo changes)
-- =====================================================
-- WARNING: These will delete the new columns and data!

-- Remove social media columns
-- ALTER TABLE public.student_achievements DROP COLUMN IF EXISTS linkedin;
-- ALTER TABLE public.student_achievements DROP COLUMN IF EXISTS github;
-- ALTER TABLE public.student_achievements DROP COLUMN IF EXISTS instagram;

-- Remove multiple images column
-- ALTER TABLE public.student_achievements DROP COLUMN IF EXISTS achievement_images;

-- Remove setting
-- DELETE FROM public.site_settings WHERE setting_key = 'hide_achievements_section';
