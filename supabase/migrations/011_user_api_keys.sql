-- ============================================================================
-- Migration: 011_user_api_keys
-- Purpose: User's third-party API keys (Gemini, OpenAI, etc)
-- Created: 2026-06-19
-- ============================================================================

-- ============================================================================
-- User API Keys table
-- Stores user's API keys for third-party services (Gemini, OpenAI, etc)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- API provider
  provider TEXT NOT NULL CHECK (provider IN ('gemini', 'openai', 'replicate')),

  -- The actual API key (stored as-is for now, consider encrypting in production)
  key TEXT NOT NULL,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Unique constraint: one provider key per user at a time
  -- Actually allow multiple keys per provider for fallback
  UNIQUE (id)
);

-- ============================================================================
-- Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_user_api_keys_user ON public.user_api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_user_api_keys_provider ON public.user_api_keys(user_id, provider);

-- ============================================================================
-- Row Level Security
-- ============================================================================
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

-- User API keys: users can read/insert/delete their own
DROP POLICY IF EXISTS "user_api_keys_select_own" ON public.user_api_keys;
CREATE POLICY "user_api_keys_select_own" ON public.user_api_keys
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_api_keys_insert_own" ON public.user_api_keys;
CREATE POLICY "user_api_keys_insert_own" ON public.user_api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_api_keys_delete_own" ON public.user_api_keys;
CREATE POLICY "user_api_keys_delete_own" ON public.user_api_keys
  FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_api_keys_update_own" ON public.user_api_keys;
CREATE POLICY "user_api_keys_update_own" ON public.user_api_keys
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
