-- Migration: Add foreign key relationship (users -> teams)
-- Author: ProAgents
-- Date: 2024-01-19
-- Risk Level: Medium
-- Requires Approval: Team Lead
-- Estimated Duration: Depends on table size

-- Description:
-- Adds a team_id foreign key to the users table, establishing a
-- many-to-one relationship between users and teams.
--
-- IMPORTANT: Existing users will have NULL team_id unless backfilled.

-- ============================================
-- PRE-FLIGHT CHECKS
-- ============================================

-- Ensure teams table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'teams'
);

-- Check for orphan data that would violate constraint
-- (Run this BEFORE adding constraint)
SELECT COUNT(*) as orphan_count
FROM users u
WHERE u.team_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM teams t WHERE t.id = u.team_id);

-- ============================================
-- UP MIGRATION
-- ============================================

-- Step 1: Add the column (nullable first for safety)
ALTER TABLE users
ADD COLUMN team_id UUID;

-- Step 2: Add index on foreign key column (important for JOIN performance)
CREATE INDEX CONCURRENTLY idx_users_team_id
    ON users (team_id)
    WHERE team_id IS NOT NULL;

-- Step 3: Add foreign key constraint
-- Using NOT VALID first to avoid full table scan
ALTER TABLE users
ADD CONSTRAINT fk_users_team
    FOREIGN KEY (team_id)
    REFERENCES teams(id)
    ON DELETE SET NULL  -- When team deleted, set user's team_id to NULL
    ON UPDATE CASCADE   -- When team id changes, update users
    NOT VALID;          -- Don't validate existing rows yet

-- Step 4: Validate the constraint (can be done later, non-blocking)
ALTER TABLE users
VALIDATE CONSTRAINT fk_users_team;

-- Add column comment
COMMENT ON COLUMN users.team_id IS 'Reference to the team this user belongs to';

-- ============================================
-- ALTERNATIVE: Strict relationship (required team)
-- ============================================

-- If team_id should be required:
--
-- Step 1: Create default team
-- INSERT INTO teams (id, name) VALUES ('00000000-0000-0000-0000-000000000000', 'Default');
--
-- Step 2: Add column with default
-- ALTER TABLE users
-- ADD COLUMN team_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
--
-- Step 3: Add foreign key with RESTRICT
-- ALTER TABLE users
-- ADD CONSTRAINT fk_users_team
--     FOREIGN KEY (team_id)
--     REFERENCES teams(id)
--     ON DELETE RESTRICT  -- Prevent team deletion if users exist
--     ON UPDATE CASCADE;

-- ============================================
-- DOWN MIGRATION (Rollback)
-- ============================================

-- Drop constraint first
ALTER TABLE users
DROP CONSTRAINT IF EXISTS fk_users_team;

-- Drop index
DROP INDEX CONCURRENTLY IF EXISTS idx_users_team_id;

-- Drop column
ALTER TABLE users
DROP COLUMN IF EXISTS team_id;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check constraint exists
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'users'
  AND constraint_name = 'fk_users_team';

-- Check foreign key details
SELECT
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule,
    rc.update_rule
FROM information_schema.key_column_usage kcu
JOIN information_schema.constraint_column_usage ccu
    ON kcu.constraint_name = ccu.constraint_name
JOIN information_schema.referential_constraints rc
    ON kcu.constraint_name = rc.constraint_name
WHERE kcu.table_name = 'users'
  AND kcu.constraint_name = 'fk_users_team';

-- Test constraint enforcement
-- This should fail:
-- INSERT INTO users (email, password_hash, team_id)
-- VALUES ('test@example.com', 'hash', '00000000-0000-0000-0000-000000000001');
-- Error: insert or update on table "users" violates foreign key constraint

-- ============================================
-- BACKFILL EXISTING USERS
-- ============================================

-- Option 1: Assign all existing users to a default team
-- UPDATE users
-- SET team_id = (SELECT id FROM teams WHERE name = 'Default' LIMIT 1)
-- WHERE team_id IS NULL;

-- Option 2: Assign users based on email domain
-- UPDATE users
-- SET team_id = t.id
-- FROM teams t
-- WHERE users.email LIKE '%@' || t.domain
--   AND users.team_id IS NULL;
