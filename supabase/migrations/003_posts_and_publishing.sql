-- ============================================================================
-- Migration: 003_posts_and_publishing
-- Purpose: Generated posts, scheduled posts, and LinkedIn post syncing
-- Created: 2025-06-16
-- ============================================================================

-- ============================================================================
-- Generated Posts table
-- AI-generated post drafts
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.generated_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Content
  text TEXT NOT NULL,
  hashtags TEXT[],
  character_count INT,

  -- Generation metadata
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'youtube', 'podcast', 'article')),
  source_url TEXT,          -- If generated from a URL
  source_data JSONB,        -- Metadata extracted from source (video title, etc.)

  -- Post settings
  tone TEXT,
  industry TEXT,
  audience TEXT,
  post_length TEXT,

  -- AI metadata
  claude_model VARCHAR DEFAULT 'claude-opus-4-7',
  generation_prompt TEXT,
  estimated_reach INT,
  predicted_engagement_rate NUMERIC,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Scheduled Posts table
-- Posts queued for publishing
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  linkedin_account_id UUID NOT NULL REFERENCES public.linkedin_accounts(id) ON DELETE CASCADE,
  generated_post_id UUID REFERENCES public.generated_posts(id) ON DELETE SET NULL,

  -- Content
  text TEXT NOT NULL,
  hashtags TEXT[],

  -- Scheduling
  scheduled_for TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'UTC',

  -- Publishing status
  status TEXT DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'published', 'failed', 'cancelled')),
  published_at TIMESTAMPTZ,
  linkedin_post_id VARCHAR,       -- Populated after successful publish
  publish_error TEXT,
  publish_error_code VARCHAR,

  -- Retry tracking
  retry_count INT DEFAULT 0,
  next_retry_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- LinkedIn Posts table
-- Posts fetched from LinkedIn (both generated and competitor research)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.linkedin_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  linkedin_account_id UUID REFERENCES public.linkedin_accounts(id) ON DELETE SET NULL,

  -- Identity
  linkedin_post_id VARCHAR UNIQUE NOT NULL,
  posted_by_linkedin_id VARCHAR,          -- Who posted this

  -- Content
  text TEXT NOT NULL,
  hashtags TEXT[],

  -- Timeline
  posted_at TIMESTAMPTZ NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT now(),

  -- Type
  post_type TEXT DEFAULT 'own'
    CHECK (post_type IN ('own', 'competitor')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Post Metrics table
-- Analytics for published posts (updated daily)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.post_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  linkedin_post_id VARCHAR NOT NULL REFERENCES public.linkedin_posts(linkedin_post_id) ON DELETE CASCADE,

  -- Engagement metrics
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  shares INT DEFAULT 0,
  reposts INT DEFAULT 0,

  -- Calculated metrics
  engagement_rate NUMERIC GENERATED ALWAYS AS (
    CASE WHEN impressions > 0
      THEN ((likes + comments + shares) * 100.0 / impressions)
      ELSE 0
    END
  ) STORED,

  -- Tracking
  collected_at TIMESTAMPTZ DEFAULT now(),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (linkedin_post_id, collected_at)
);

-- ============================================================================
-- Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_generated_posts_user ON public.generated_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_posts_created ON public.generated_posts(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_scheduled_posts_user ON public.scheduled_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_status ON public.scheduled_posts(user_id, status);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_due ON public.scheduled_posts(scheduled_for)
  WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_account ON public.scheduled_posts(linkedin_account_id, scheduled_for);

CREATE INDEX IF NOT EXISTS idx_linkedin_posts_user ON public.linkedin_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_posts_account ON public.linkedin_posts(linkedin_account_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_posts_posted ON public.linkedin_posts(user_id, posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_linkedin_posts_type ON public.linkedin_posts(user_id, post_type);

CREATE INDEX IF NOT EXISTS idx_post_metrics_linkedin_post ON public.post_metrics(linkedin_post_id);
CREATE INDEX IF NOT EXISTS idx_post_metrics_user ON public.post_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_post_metrics_collected ON public.post_metrics(linkedin_post_id, collected_at DESC);

-- ============================================================================
-- Triggers
-- ============================================================================
DROP TRIGGER IF EXISTS trg_generated_posts_updated ON public.generated_posts;
CREATE TRIGGER trg_generated_posts_updated
  BEFORE UPDATE ON public.generated_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_scheduled_posts_updated ON public.scheduled_posts;
CREATE TRIGGER trg_scheduled_posts_updated
  BEFORE UPDATE ON public.scheduled_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_linkedin_posts_updated ON public.linkedin_posts;
CREATE TRIGGER trg_linkedin_posts_updated
  BEFORE UPDATE ON public.linkedin_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_post_metrics_updated ON public.post_metrics;
CREATE TRIGGER trg_post_metrics_updated
  BEFORE UPDATE ON public.post_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
ALTER TABLE public.generated_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_metrics ENABLE ROW LEVEL SECURITY;

-- Generated posts: full access to own
DROP POLICY IF EXISTS "generated_posts_all_own" ON public.generated_posts;
CREATE POLICY "generated_posts_all_own" ON public.generated_posts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Scheduled posts: full access to own
DROP POLICY IF EXISTS "scheduled_posts_all_own" ON public.scheduled_posts;
CREATE POLICY "scheduled_posts_all_own" ON public.scheduled_posts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- LinkedIn posts: full access to own
DROP POLICY IF EXISTS "linkedin_posts_all_own" ON public.linkedin_posts;
CREATE POLICY "linkedin_posts_all_own" ON public.linkedin_posts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Post metrics: full access to own
DROP POLICY IF EXISTS "post_metrics_all_own" ON public.post_metrics;
CREATE POLICY "post_metrics_all_own" ON public.post_metrics
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
