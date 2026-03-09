-- Migration: Create users table
-- Author: ProAgents
-- Date: 2024-01-15
-- Risk Level: Low
-- Requires Approval: No
-- Estimated Duration: < 1 second

-- Description:
-- Creates the core users table with essential fields for authentication
-- and profile information. This is typically one of the first migrations
-- in a new project.

-- ============================================
-- UP MIGRATION
-- ============================================

-- Create enum for user status
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');

-- Create enum for user role
CREATE TYPE user_role AS ENUM ('admin', 'developer', 'viewer', 'guest');

-- Create users table
CREATE TABLE users (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Authentication fields
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    -- Profile fields
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(100),
    avatar_url TEXT,

    -- Status and role
    status user_status NOT NULL DEFAULT 'pending',
    role user_role NOT NULL DEFAULT 'viewer',

    -- Email verification
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    email_verified_at TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,

    -- Soft delete
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create unique index on email (excluding soft-deleted users)
CREATE UNIQUE INDEX idx_users_email_unique
    ON users (email)
    WHERE deleted_at IS NULL;

-- Create index for common queries
CREATE INDEX idx_users_status ON users (status) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users (role) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_created_at ON users (created_at);

-- Create updated_at trigger function (reusable)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add table comment
COMMENT ON TABLE users IS 'Core user accounts for authentication and authorization';

-- ============================================
-- DOWN MIGRATION (Rollback)
-- ============================================

-- WARNING: This will delete all user data!
-- Ensure you have a backup before running rollback.

-- Drop trigger
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;

-- Drop function (only if not used by other tables)
-- DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop table
DROP TABLE IF EXISTS users;

-- Drop enums
DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS user_status;

-- ============================================
-- VERIFICATION
-- ============================================

-- Run these queries to verify the migration succeeded:

-- Check table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'users'
);

-- Check columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Check indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'users';

-- Check trigger
SELECT trigger_name
FROM information_schema.triggers
WHERE event_object_table = 'users';
