-- Migration: Drop deprecated 'legacy_id' column
-- Author: ProAgents
-- Date: 2024-01-21
-- Risk Level: High
-- Requires Approval: Manager + DBA
-- Estimated Duration: < 1 second (metadata only, but irreversible)

-- Description:
-- Removes the deprecated 'legacy_id' column that was used during
-- migration from the old system. All references have been updated
-- to use the new UUID primary key.
--
-- CRITICAL: This is a DESTRUCTIVE operation. Data cannot be recovered
-- without a backup. Ensure all dependent code and queries have been updated.

-- ============================================
-- PRE-FLIGHT CHECKS (MANDATORY)
-- ============================================

-- 1. Check if column is still referenced in application code
--    Run: grep -r "legacy_id" ./src/
--    Expected: No results

-- 2. Check if column is used in any views
SELECT viewname, definition
FROM pg_views
WHERE definition LIKE '%legacy_id%';

-- 3. Check if column is used in any functions/procedures
SELECT proname, prosrc
FROM pg_proc
WHERE prosrc LIKE '%legacy_id%';

-- 4. Check if column is used in any triggers
SELECT tgname
FROM pg_trigger t
JOIN pg_proc p ON p.oid = t.tgfoid
WHERE p.prosrc LIKE '%legacy_id%';

-- 5. Check if any foreign keys reference this column
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE ccu.column_name = 'legacy_id'
   OR kcu.column_name = 'legacy_id';

-- 6. Verify backup exists or create one
SELECT COUNT(*) FROM users; -- Note the count
-- CREATE TABLE users_backup_legacy_id AS SELECT id, legacy_id FROM users;

-- ============================================
-- UP MIGRATION
-- ============================================

-- OPTION 1: Immediate drop (brief exclusive lock)
ALTER TABLE users
DROP COLUMN legacy_id;

-- OPTION 2: Two-phase drop (for zero-downtime on very large tables)
-- Phase 1: Mark column as dropped (immediate, no lock)
-- UPDATE pg_attribute
-- SET attisdropped = true
-- WHERE attrelid = 'users'::regclass
--   AND attname = 'legacy_id';
--
-- Phase 2: Actually reclaim space (during maintenance window)
-- VACUUM FULL users;

-- Drop related indexes if any
DROP INDEX IF EXISTS idx_users_legacy_id;

-- Drop related constraints if any
ALTER TABLE users
DROP CONSTRAINT IF EXISTS chk_users_legacy_id;

-- ============================================
-- DOWN MIGRATION (Rollback)
-- ============================================

-- WARNING: This only recreates the column structure.
-- DATA CANNOT BE RECOVERED without a backup!

-- Recreate column
ALTER TABLE users
ADD COLUMN legacy_id INTEGER;

-- Recreate index if it existed
CREATE INDEX idx_users_legacy_id ON users(legacy_id);

-- Restore data from backup (if backup exists)
UPDATE users u
SET legacy_id = b.legacy_id
FROM users_backup_legacy_id b
WHERE u.id = b.id;

-- If no backup exists, column will be NULL for all rows
-- Consider whether this is acceptable before dropping

-- ============================================
-- VERIFICATION
-- ============================================

-- Confirm column no longer exists
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name = 'legacy_id';
-- Expected: 0 rows

-- Check table structure
\d users

-- Verify no errors in dependent objects
SELECT *
FROM pg_stat_user_functions
WHERE funcname LIKE '%legacy%';

-- Test that application queries still work
EXPLAIN ANALYZE
SELECT id, email, created_at
FROM users
WHERE email = 'test@example.com';

-- ============================================
-- CLEANUP
-- ============================================

-- After verification period, drop backup table
-- DROP TABLE IF EXISTS users_backup_legacy_id;

-- Update documentation
-- - Remove legacy_id from API docs
-- - Remove legacy_id from database schema docs
-- - Update migration guides

-- ============================================
-- COMMON ISSUES AND SOLUTIONS
-- ============================================

-- Issue: "column does not exist" errors after drop
-- Solution: Application code still references the column
--           Search and update all references

-- Issue: View/function errors after drop
-- Solution: Recreate views/functions without the column
--           DROP VIEW affected_view;
--           CREATE VIEW affected_view AS ...;

-- Issue: Need to restore data
-- Solution: Restore from backup table or full database backup
--           If no backup, data is permanently lost

-- Issue: Replication lag causes errors
-- Solution: Ensure all replicas have applied the change
--           before updating application code
