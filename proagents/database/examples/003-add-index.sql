-- Migration: Add performance index on users.email
-- Author: ProAgents
-- Date: 2024-01-17
-- Risk Level: Medium
-- Requires Approval: Team Lead
-- Estimated Duration: Depends on table size (1-5 minutes for large tables)

-- Description:
-- Adds a B-tree index on the email column to improve login query performance.
-- Uses CONCURRENTLY to avoid locking the table during index creation.
--
-- IMPORTANT: CONCURRENTLY cannot be used inside a transaction block.
-- Run this migration outside of a transaction.

-- ============================================
-- PRE-FLIGHT CHECKS
-- ============================================

-- Check table size before creating index
SELECT
    pg_size_pretty(pg_total_relation_size('users')) as table_size,
    (SELECT count(*) FROM users) as row_count;

-- Estimate index creation time (rough)
-- Rule of thumb: ~1 minute per 10 million rows

-- ============================================
-- UP MIGRATION
-- ============================================

-- Create index concurrently (non-blocking)
-- NOTE: Cannot run inside transaction
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_lookup
    ON users (LOWER(email))
    WHERE deleted_at IS NULL;

-- Create composite index for common queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_status_created
    ON users (status, created_at DESC)
    WHERE deleted_at IS NULL;

-- Create partial index for active users only
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_active
    ON users (last_login_at DESC)
    WHERE status = 'active' AND deleted_at IS NULL;

-- ============================================
-- DOWN MIGRATION (Rollback)
-- ============================================

-- Drop indexes (also use CONCURRENTLY for safety)
DROP INDEX CONCURRENTLY IF EXISTS idx_users_active;
DROP INDEX CONCURRENTLY IF EXISTS idx_users_status_created;
DROP INDEX CONCURRENTLY IF EXISTS idx_users_email_lookup;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check indexes were created
SELECT
    indexname,
    indexdef,
    pg_size_pretty(pg_relation_size(indexname::regclass)) as index_size
FROM pg_indexes
WHERE tablename = 'users'
ORDER BY indexname;

-- Verify index is being used
EXPLAIN ANALYZE
SELECT id, email
FROM users
WHERE LOWER(email) = 'test@example.com'
  AND deleted_at IS NULL;

-- Check for invalid indexes (failed CONCURRENTLY)
SELECT indexrelid::regclass as index_name, indisvalid
FROM pg_index
WHERE NOT indisvalid;

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- If CONCURRENTLY fails, the index may be in invalid state.
-- Check and drop invalid indexes:
--
-- SELECT indexrelid::regclass
-- FROM pg_index
-- WHERE NOT indisvalid;
--
-- DROP INDEX CONCURRENTLY idx_users_email_lookup;
-- Then retry the CREATE INDEX CONCURRENTLY.

-- ============================================
-- PERFORMANCE COMPARISON
-- ============================================

-- Before index (sequential scan):
-- Seq Scan on users  (cost=0.00..1234.00 rows=1 width=36)
--   Filter: (lower((email)::text) = 'test@example.com'::text)

-- After index (index scan):
-- Index Scan using idx_users_email_lookup on users  (cost=0.42..8.44 rows=1 width=36)
--   Index Cond: (lower((email)::text) = 'test@example.com'::text)
