-- Add hidden and display_order columns to member tables
-- Run this in your Supabase SQL Editor

-- Add columns to members_faculty
ALTER TABLE members_faculty 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add columns to members_core_team
ALTER TABLE members_core_team 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add columns to members_post_holders
ALTER TABLE members_post_holders 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add columns to members_executive
ALTER TABLE members_executive 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Update existing records to have sequential display_order
-- This ensures existing members have proper ordering
UPDATE members_faculty SET display_order = id WHERE display_order = 0;
UPDATE members_core_team SET display_order = id WHERE display_order = 0;
UPDATE members_post_holders SET display_order = id WHERE display_order = 0;
UPDATE members_executive SET display_order = id WHERE display_order = 0;
