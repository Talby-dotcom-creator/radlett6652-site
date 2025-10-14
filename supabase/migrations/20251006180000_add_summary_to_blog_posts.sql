-- Migration: Add summary column to blog_posts
ALTER TABLE blog_posts ADD COLUMN summary text;
