/*
  # Add image_url field to events table

  1. Schema Changes
    - Add `image_url` column to `events` table
    - Column is optional (nullable) for backward compatibility

  2. Notes
    - Existing events will have NULL image_url values
    - New events can optionally include an image
    - No breaking changes to existing functionality
*/

-- Add image_url column to events table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE events ADD COLUMN image_url text;
  END IF;
END $$;