-- Migration: Add user preferences column
-- Author: ProAgents
-- Date: 2024-01-16
-- Risk Level: Low
-- Requires Approval: No
-- Estimated Duration: < 1 second

-- Description:
-- Adds a JSONB column to store user preferences like theme, language,
-- notification settings, etc. Using JSONB allows flexible schema-less
-- storage with indexing capabilities.

-- ============================================
-- UP MIGRATION
-- ============================================

-- Add preferences column with default empty object
ALTER TABLE users
ADD COLUMN preferences JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Add GIN index for JSONB queries
-- This enables fast queries like: WHERE preferences @> '{"theme": "dark"}'
CREATE INDEX idx_users_preferences
    ON users USING GIN (preferences);

-- Add specific index for common preference queries
CREATE INDEX idx_users_preferences_theme
    ON users ((preferences->>'theme'))
    WHERE preferences->>'theme' IS NOT NULL;

-- Add column comment
COMMENT ON COLUMN users.preferences IS 'User preferences stored as JSONB. Keys: theme, language, notifications, timezone, etc.';

-- Optionally set default preferences for existing users
UPDATE users
SET preferences = jsonb_build_object(
    'theme', 'light',
    'language', 'en',
    'notifications', jsonb_build_object(
        'email', true,
        'push', true,
        'weekly_digest', false
    ),
    'timezone', 'UTC'
)
WHERE preferences = '{}'::jsonb;

-- ============================================
-- DOWN MIGRATION (Rollback)
-- ============================================

-- Drop indexes first
DROP INDEX IF EXISTS idx_users_preferences_theme;
DROP INDEX IF EXISTS idx_users_preferences;

-- Remove column
ALTER TABLE users DROP COLUMN IF EXISTS preferences;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check column exists
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'preferences';

-- Check indexes exist
SELECT indexname
FROM pg_indexes
WHERE tablename = 'users' AND indexname LIKE '%preferences%';

-- Test JSONB query performance
EXPLAIN ANALYZE
SELECT id, email, preferences->>'theme' as theme
FROM users
WHERE preferences @> '{"theme": "dark"}';

-- ============================================
-- EXAMPLE USAGE
-- ============================================

-- Query users by preference
-- SELECT * FROM users WHERE preferences->>'theme' = 'dark';

-- Update a single preference
-- UPDATE users
-- SET preferences = jsonb_set(preferences, '{theme}', '"dark"')
-- WHERE id = '...';

-- Add new preference key
-- UPDATE users
-- SET preferences = preferences || '{"sidebar_collapsed": true}'::jsonb
-- WHERE id = '...';
