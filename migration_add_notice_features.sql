-- Migration: Add rich text, poster, attachments, and external link features to notices table
-- Run this migration in your Supabase SQL Editor

-- Add new columns to the notices table
ALTER TABLE notices 
ADD COLUMN IF NOT EXISTS rich_description TEXT,
ADD COLUMN IF NOT EXISTS poster_url TEXT,
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS external_link TEXT;

-- Add comments to describe the new columns
COMMENT ON COLUMN notices.rich_description IS 'HTML content from rich text editor (bold, links, lists)';
COMMENT ON COLUMN notices.poster_url IS 'URL to event poster/banner image (JPG/PNG)';
COMMENT ON COLUMN notices.attachments IS 'JSON array of attachment objects with name, url, and type fields';
COMMENT ON COLUMN notices.external_link IS 'External registration link (Google Forms, Drive folders, etc.)';
