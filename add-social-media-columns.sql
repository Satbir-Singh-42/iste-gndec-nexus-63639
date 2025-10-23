-- Add social media columns to member tables
-- Run this in your Supabase SQL Editor

ALTER TABLE members_core_team 
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT;

ALTER TABLE members_post_holders 
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT;

ALTER TABLE members_executive 
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT;
