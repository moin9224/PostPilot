-- ============================================================================
-- Migration: 008_audit_and_logging
-- Purpose: Audit logs, activity tracking, and system monitoring
-- Created: 2025-06-16
-- ============================================================================

-- ============================================================================
-- Audit Logs table
-- Complete audit trail of all sensitive actions
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Action details
  action VARCHAR NOT NULL,
  entity_type VARCHAR NOT NULL,      -- 'post', 'user', 'workspace', 'api_key', etc.
  entity_id VARCHAR,

  -- Changes
  changes JSONB,                      -- Old and new values

  -- Context
  ip_address INET,
  user_agent TEXT,

  -- Metadata
  description TEXT,
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failure', 'partial')),
  error_message TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Activity Feed table
-- High-level activity summaries for users and teams
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,

  -- Activity
  activity_type VARCHAR NOT NULL,   -- 'post_published', 'user_invited', 'analytics_viewed', etc.
  actor_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  related_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- Entity
  entity_type VARCHAR,              -- 'post', 'user', 'workspace', etc.
  entity_id VARCHAR,

  -- Visibility
  visibility TEXT DEFAULT 'team' CHECK (visibility IN ('personal', 'team', 'public')),
  is_archived BOOLEAN DEFAULT false,

  -- Content
  title VARCHAR NOT NULL,
  description TEXT,
  metadata JSONB,                   -- Any additional context

  -- Engagement
  view_count INT DEFAULT 0,
  reaction_count INT DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Error Logs table
-- Application errors and exceptions
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Error details
  error_code VARCHAR,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  error_context JSONB,              -- Request context, user info, etc.

  -- Categorization
  severity TEXT DEFAULT 'error' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  source VARCHAR,                   -- 'api', 'webhook', 'background_job', 'client', etc.

  -- Resolution
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,

  -- Tracking
  occurrence_count INT DEFAULT 1,
  last_occurred_at TIMESTAMPTZ DEFAULT now(),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- API Audit Logs table
-- Detailed logging of API calls
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.api_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  api_key_id UUID REFERENCES public.api_keys(id) ON DELETE SET NULL,

  -- Request details
  method VARCHAR NOT NULL,          -- GET, POST, PUT, DELETE, etc.
  endpoint VARCHAR NOT NULL,

  -- Timing
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  duration_ms INT,

  -- Response
  status_code INT,
  response_size_bytes INT,

  -- Client info
  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Rate Limit Tracker table
-- Track and manage API rate limits per API key/user
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.rate_limit_tracker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  api_key_id UUID REFERENCES public.api_keys(id) ON DELETE CASCADE,

  -- Rate limit window
  window_start TIMESTAMPTZ NOT NULL,
  window_end TIMESTAMPTZ NOT NULL,

  -- Requests
  request_count INT DEFAULT 0,
  limit_threshold INT NOT NULL,

  -- Status
  is_exceeded BOOLEAN DEFAULT false,
  exceeded_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (workspace_id, api_key_id, window_start)
);

-- ============================================================================
-- System Health Metrics table
-- Health checks and system metrics
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.system_health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Metric name
  metric_name VARCHAR NOT NULL,

  -- Measurements
  value NUMERIC NOT NULL,
  unit VARCHAR,

  -- Thresholds
  warning_threshold NUMERIC,
  critical_threshold NUMERIC,

  -- Status
  status TEXT DEFAULT 'healthy' CHECK (status IN ('healthy', 'warning', 'critical')),

  -- Metadata
  tags TEXT[],

  recorded_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_audit_logs_workspace ON public.audit_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_status ON public.audit_logs(status);

CREATE INDEX IF NOT EXISTS idx_activity_feed_workspace ON public.activity_feed(workspace_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_actor ON public.activity_feed(workspace_id, actor_user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created ON public.activity_feed(workspace_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_feed_type ON public.activity_feed(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_feed_visibility ON public.activity_feed(workspace_id, visibility);

CREATE INDEX IF NOT EXISTS idx_error_logs_code ON public.error_logs(error_code);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON public.error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON public.error_logs(is_resolved);
CREATE INDEX IF NOT EXISTS idx_error_logs_created ON public.error_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_api_audit_logs_workspace ON public.api_audit_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_api_audit_logs_api_key ON public.api_audit_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_audit_logs_endpoint ON public.api_audit_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_audit_logs_created ON public.api_audit_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_rate_limit_tracker_workspace ON public.rate_limit_tracker(workspace_id);
CREATE INDEX IF NOT EXISTS idx_rate_limit_tracker_api_key ON public.rate_limit_tracker(api_key_id);
CREATE INDEX IF NOT EXISTS idx_rate_limit_tracker_exceeded ON public.rate_limit_tracker(workspace_id, is_exceeded);

CREATE INDEX IF NOT EXISTS idx_system_health_metrics_name ON public.system_health_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_system_health_metrics_status ON public.system_health_metrics(status);
CREATE INDEX IF NOT EXISTS idx_system_health_metrics_recorded ON public.system_health_metrics(recorded_at DESC);

-- ============================================================================
-- Triggers
-- ============================================================================
DROP TRIGGER IF EXISTS trg_activity_feed_updated ON public.activity_feed;
CREATE TRIGGER trg_activity_feed_updated
  BEFORE UPDATE ON public.activity_feed
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_rate_limit_tracker_updated ON public.rate_limit_tracker;
CREATE TRIGGER trg_rate_limit_tracker_updated
  BEFORE UPDATE ON public.rate_limit_tracker
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limit_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_health_metrics ENABLE ROW LEVEL SECURITY;

-- Audit logs: workspace members with can_manage_team can view
DROP POLICY IF EXISTS "audit_logs_select" ON public.audit_logs;
CREATE POLICY "audit_logs_select" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = audit_logs.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND (workspace_members.can_manage_team OR workspace_members.role = 'owner')
    )
  );

-- Activity feed: workspace members can view their workspace's activity
DROP POLICY IF EXISTS "activity_feed_select" ON public.activity_feed;
CREATE POLICY "activity_feed_select" ON public.activity_feed
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = activity_feed.workspace_id
        AND workspace_members.user_id = auth.uid()
    )
  );

-- Error logs: only admin/system access (no RLS needed for monitoring)
-- Typically accessed only by backend jobs and admin functions

-- API audit logs: workspace members with can_manage_billing can view
DROP POLICY IF EXISTS "api_audit_logs_select" ON public.api_audit_logs;
CREATE POLICY "api_audit_logs_select" ON public.api_audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = api_audit_logs.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND (workspace_members.can_manage_billing OR workspace_members.role = 'owner')
    )
  );

-- Rate limit tracker: workspace members can view their workspace's limits
DROP POLICY IF EXISTS "rate_limit_tracker_select" ON public.rate_limit_tracker;
CREATE POLICY "rate_limit_tracker_select" ON public.rate_limit_tracker
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = rate_limit_tracker.workspace_id
        AND workspace_members.user_id = auth.uid()
    )
  );

-- System health metrics: only admin/system access
