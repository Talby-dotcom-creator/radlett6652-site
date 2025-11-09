-- Migration: Add reading_time_minutes column to blog_posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS reading_time_minutes INTEGER;

-- Add a comment to describe the column
COMMENT ON COLUMN blog_posts.reading_time_minutes IS 'Estimated reading time in minutes';
