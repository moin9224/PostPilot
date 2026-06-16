-- ============================================================================
-- Migration: 002_linkedin_integration
-- Purpose: LinkedIn OAuth, connected accounts, and profile snapshots
-- Created: 2025-06-16
-- ============================================================================

-- ============================================================================
-- LinkedIn Accounts table
-- Stores encrypted OAuth tokens and connected LinkedIn accounts
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.linkedin_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- LinkedIn identity
  linkedin_id VARCHAR UNIQUE NOT NULL,    -- LinkedIn's Member ID
  linkedin_handle VARCHAR,                 -- @username
  profile_url VARCHAR,

  -- OAuth tokens (stored encrypted - use pgcrypto)
  access_token TEXT NOT NULL,             -- Encrypted with pgcrypto
  refresh_token TEXT,                      -- Encrypted (if available)
  token_expires_at TIMESTAMPTZ NOT NULL,

  -- Profile snapshot (cached, refreshed on demand)
  profile_name VARCHAR,
  profile_headline VARCHAR,
  profile_photo_url TEXT,
  followers_count INT DEFAULT 0,
  connections_count INT DEFAULT 0,

  -- Account status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  verification_failed_reason TEXT,

  -- Sync tracking
  connected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_synced_at TIMESTAMPTZ,
  last_sync_error TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (user_id, linkedin_id)
);

-- ============================================================================
-- Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_linkedin_accounts_user ON public.linkedin_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_accounts_active ON public.linkedin_accounts(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_linkedin_accounts_linkedin_id ON public.linkedin_accounts(linkedin_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_accounts_synced ON public.linkedin_accounts(last_synced_at DESC);

-- ============================================================================
-- Triggers
-- ============================================================================
DROP TRIGGER IF EXISTS trg_linkedin_accounts_updated ON public.linkedin_accounts;
CREATE TRIGGER trg_linkedin_accounts_updated
  BEFORE UPDATE ON public.linkedin_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
ALTER TABLE public.linkedin_accounts ENABLE ROW LEVEL SECURITY;

-- LinkedIn accounts: full access to own
DROP POLICY IF EXISTS "linkedin_accounts_all_own" ON public.linkedin_accounts;
CREATE POLICY "linkedin_accounts_all_own" ON public.linkedin_accounts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
