-- ============================================================================
-- Migration: 006_competitor_research
-- Purpose: Competitor tracking, analysis, and benchmarking
-- Created: 2025-06-16
-- ============================================================================

-- ============================================================================
-- Competitors table
-- Tracked competitors for research and benchmarking
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,

  -- LinkedIn identity
  linkedin_id VARCHAR UNIQUE NOT NULL,
  linkedin_handle VARCHAR,
  profile_url VARCHAR,

  -- Profile info
  name VARCHAR NOT NULL,
  headline TEXT,
  industry TEXT,
  followers_count INT DEFAULT 0,

  -- Analysis data
  post_frequency INT,              -- Posts per week
  avg_engagement_rate NUMERIC,
  avg_reach INT,
  top_topics TEXT[],
  top_hashtags TEXT[],

  -- Tracking
  tracking_status TEXT DEFAULT 'active' CHECK (tracking_status IN ('active', 'paused', 'stopped')),
  last_analyzed_at TIMESTAMPTZ,
  next_analysis_scheduled_at TIMESTAMPTZ,

  analysis_error TEXT,
  analysis_error_count INT DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Competitor Posts table
-- Posts from tracked competitors
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.competitor_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_id UUID NOT NULL REFERENCES public.competitors(id) ON DELETE CASCADE,

  -- LinkedIn identity
  linkedin_post_id VARCHAR UNIQUE NOT NULL,
  posted_at TIMESTAMPTZ NOT NULL,

  -- Content
  text TEXT NOT NULL,
  hashtags TEXT[],
  media_urls TEXT[],

  -- Engagement metrics
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  shares INT DEFAULT 0,
  reposts INT DEFAULT 0,

  -- Analysis
  engagement_rate NUMERIC GENERATED ALWAYS AS (
    CASE WHEN impressions > 0
      THEN ((likes + comments + shares) * 100.0 / impressions)
      ELSE 0
    END
  ) STORED,
  topic TEXT,
  tone TEXT,
  hook_score INT,              -- Quality of opening hook (1-10)
  structure_score INT,         -- Post structure quality (1-10)

  -- Trend tracking
  is_trending BOOLEAN DEFAULT false,
  trend_score INT,

  -- Metadata
  fetched_at TIMESTAMPTZ DEFAULT now(),
  metrics_last_updated_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Competitor Analysis table
-- Periodic snapshots of competitor metrics for trend analysis
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.competitor_analysis_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_id UUID NOT NULL REFERENCES public.competitors(id) ON DELETE CASCADE,

  -- Metrics snapshot
  followers_count INT,
  following_count INT,
  post_count_this_week INT,
  avg_engagement_rate NUMERIC,
  avg_reach INT,

  -- Topics
  top_topics TEXT[],
  trending_topics TEXT[],

  -- Analysis date
  analyzed_at TIMESTAMPTZ DEFAULT now(),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Competitor Benchmarks table
-- User's comparison against competitors
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.competitor_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,

  -- Metrics
  user_avg_engagement_rate NUMERIC,
  competitor_avg_engagement_rate NUMERIC,
  user_avg_reach INT,
  competitor_avg_reach INT,

  -- Rankings
  user_rank INT,                 -- Position among competitors
  total_competitors INT,

  -- Timeframe
  period TEXT DEFAULT 'monthly' CHECK (period IN ('weekly', 'monthly', 'quarterly')),
  period_end_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_competitors_workspace ON public.competitors(workspace_id);
CREATE INDEX IF NOT EXISTS idx_competitors_tracking ON public.competitors(workspace_id, tracking_status);
CREATE INDEX IF NOT EXISTS idx_competitors_next_analysis ON public.competitors(next_analysis_scheduled_at)
  WHERE tracking_status = 'active';

CREATE INDEX IF NOT EXISTS idx_competitor_posts_competitor ON public.competitor_posts(competitor_id);
CREATE INDEX IF NOT EXISTS idx_competitor_posts_posted ON public.competitor_posts(competitor_id, posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_competitor_posts_engagement ON public.competitor_posts(competitor_id, engagement_rate DESC);
CREATE INDEX IF NOT EXISTS idx_competitor_posts_trending ON public.competitor_posts(is_trending)
  WHERE is_trending = true;

CREATE INDEX IF NOT EXISTS idx_competitor_analysis_snapshots_competitor ON public.competitor_analysis_snapshots(competitor_id);
CREATE INDEX IF NOT EXISTS idx_competitor_analysis_snapshots_analyzed ON public.competitor_analysis_snapshots(competitor_id, analyzed_at DESC);

CREATE INDEX IF NOT EXISTS idx_competitor_benchmarks_workspace ON public.competitor_benchmarks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_competitor_benchmarks_period ON public.competitor_benchmarks(workspace_id, period_end_at DESC);

-- ============================================================================
-- Triggers
-- ============================================================================
DROP TRIGGER IF EXISTS trg_competitors_updated ON public.competitors;
CREATE TRIGGER trg_competitors_updated
  BEFORE UPDATE ON public.competitors
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_competitor_posts_updated ON public.competitor_posts;
CREATE TRIGGER trg_competitor_posts_updated
  BEFORE UPDATE ON public.competitor_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_competitor_benchmarks_updated ON public.competitor_benchmarks;
CREATE TRIGGER trg_competitor_benchmarks_updated
  BEFORE UPDATE ON public.competitor_benchmarks
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_analysis_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_benchmarks ENABLE ROW LEVEL SECURITY;

-- Competitors: accessible by workspace members
DROP POLICY IF EXISTS "competitors_select" ON public.competitors;
CREATE POLICY "competitors_select" ON public.competitors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = competitors.workspace_id
        AND workspace_members.user_id = auth.uid()
    )
  );

-- Competitor posts: accessible by workspace members
DROP POLICY IF EXISTS "competitor_posts_select" ON public.competitor_posts;
CREATE POLICY "competitor_posts_select" ON public.competitor_posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.competitors c
      INNER JOIN public.workspace_members wm ON wm.workspace_id = c.workspace_id
      WHERE c.id = competitor_posts.competitor_id
        AND wm.user_id = auth.uid()
    )
  );

-- Competitor analysis snapshots: accessible by workspace members
DROP POLICY IF EXISTS "competitor_analysis_snapshots_select" ON public.competitor_analysis_snapshots;
CREATE POLICY "competitor_analysis_snapshots_select" ON public.competitor_analysis_snapshots
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.competitors c
      INNER JOIN public.workspace_members wm ON wm.workspace_id = c.workspace_id
      WHERE c.id = competitor_analysis_snapshots.competitor_id
        AND wm.user_id = auth.uid()
    )
  );

-- Competitor benchmarks: accessible by workspace members
DROP POLICY IF EXISTS "competitor_benchmarks_select" ON public.competitor_benchmarks;
CREATE POLICY "competitor_benchmarks_select" ON public.competitor_benchmarks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = competitor_benchmarks.workspace_id
        AND workspace_members.user_id = auth.uid()
    )
  );
