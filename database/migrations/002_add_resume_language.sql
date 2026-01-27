-- Migration: 002_add_resume_language.sql
-- Description: Add current_language column to resumes table for translation feature
-- Created: 2026-01-27
-- Author: AutoTalent Team

-- This migration adds language tracking to resumes
-- Run this migration to enable the resume translation feature

BEGIN;

-- Add current_language column to resumes table
ALTER TABLE resumes
ADD COLUMN IF NOT EXISTS current_language VARCHAR(10) DEFAULT 'en';

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_resumes_language ON resumes(current_language);

-- Add comment to column
COMMENT ON COLUMN resumes.current_language IS 'ISO language code (en, ar, sv, es, fr, de, pt, it, nl) indicating the current language of the resume content';

COMMIT;
