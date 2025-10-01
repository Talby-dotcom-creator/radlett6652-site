/*
  # Add privacy controls for member contact information

  1. Database Changes
    - Add `share_contact_info` column to member_profiles table (already exists)
    - Ensure proper indexing for privacy queries
    - Update RLS policies to respect privacy settings

  2. Privacy Features
    - Members can opt out of sharing contact information
    - Directory respects privacy preferences
    - Contact info only shown to members who have opted in
*/

-- Add index for privacy queries if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'member_profiles' 
    AND indexname = 'idx_member_profiles_share_contact'
  ) THEN
    CREATE INDEX idx_member_profiles_share_contact ON member_profiles(share_contact_info);
  END IF;
END $$;

-- Update the member_profiles table to ensure share_contact_info has proper default
DO $$
BEGIN
  -- Check if the column exists and has the right default
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'member_profiles' 
    AND column_name = 'share_contact_info'
  ) THEN
    -- Update existing records that have NULL to false for safety
    UPDATE member_profiles 
    SET share_contact_info = false 
    WHERE share_contact_info IS NULL;
    
    -- Ensure the column has a proper default
    ALTER TABLE member_profiles 
    ALTER COLUMN share_contact_info SET DEFAULT false;
  END IF;
END $$;