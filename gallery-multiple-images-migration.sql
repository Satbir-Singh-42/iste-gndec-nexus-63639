-- Migration: Change gallery to support multiple images per item
-- Run this in your Supabase SQL Editor

-- Step 1: Add new column for multiple images
ALTER TABLE gallery 
ADD COLUMN IF NOT EXISTS images TEXT[];

-- Step 2: Migrate existing single image to the new images array
UPDATE gallery 
SET images = ARRAY[image] 
WHERE images IS NULL;

-- Step 3: Add description column if it doesn't exist
ALTER TABLE gallery 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Step 4: Make images column required
ALTER TABLE gallery 
ALTER COLUMN images SET NOT NULL;

-- Step 5: Drop the old single image column
ALTER TABLE gallery 
DROP COLUMN IF EXISTS image;

-- Note: After running this migration, update your application code to use 'images' (array) instead of 'image' (string)
