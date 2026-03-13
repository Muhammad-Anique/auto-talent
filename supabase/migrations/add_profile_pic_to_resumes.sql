-- Migration: Add profile_pic column to resumes table
-- Created: 2026-03-13
-- Description: Adds profile_pic column to resumes table so profile picture URL persists per resume

ALTER TABLE resumes
ADD COLUMN IF NOT EXISTS profile_pic TEXT;
