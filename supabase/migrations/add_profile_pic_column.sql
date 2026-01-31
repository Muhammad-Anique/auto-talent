-- Migration: Add profile_pic column to users table
-- Created: 2026-01-31
-- Description: Adds profile_pic column to store Supabase storage URLs for user profile pictures

-- Add profile_pic column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS profile_pic TEXT DEFAULT 'https://gxvrkmueqemyudmnonji.supabase.co/storage/v1/object/public/autotalent_images/profile_pic.png';

-- Add comment to document the column
COMMENT ON COLUMN users.profile_pic IS 'Supabase storage URL for user profile picture. Stored in autotalent_images bucket under user_id folder.';
