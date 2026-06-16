-- ============================================================================
-- Migration: 009_storage_and_notifications
-- Purpose: Media storage, attachments, and notification settings
-- Created: 2025-06-16
-- ============================================================================

-- ============================================================================
-- Media Assets table
-- Track uploaded files (images, videos, documents)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  uploaded_by_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- File info
  filename VARCHAR NOT NULL,
  original_filename VARCHAR,
  file_type VARCHAR,                -- 'image', 'video', 'document', 'audio'
  mime_type VARCHAR,

  -- Storage
  storage_path VARCHAR NOT NULL,    -- S3/GCS path
  storage_bucket VARCHAR DEFAULT 'assets',
  file_size_bytes INT NOT NULL,

  -- Metadata
  width INT,                        -- For images
  height INT,
  duration_seconds INT,             -- For videos/audio

  -- Processing
  is_processing BOOLEAN DEFAULT false,
  processing_error TEXT,
  processed_at TIMESTAMPTZ,

  -- URLs
  public_url TEXT,
  thumbnail_url TEXT,              -- For images/videos

  -- Versioning
  version INT DEFAULT 1,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Post Attachments table
-- Link media to posts
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.post_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.generated_posts(id) ON DELETE CASCADE,
  media_asset_id UUID NOT NULL REFERENCES public.media_assets(id) ON DELETE CASCADE,

  -- Order
  display_order INT DEFAULT 0,

  -- Metadata
  alt_text TEXT,
  caption TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Notification Preferences table
-- User notification settings
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Notification types
  notify_on_post_published BOOLEAN DEFAULT true,
  notify_on_post_engagement BOOLEAN DEFAULT true,
  notify_on_team_activity BOOLEAN DEFAULT true,
  notify_on_analytics BOOLEAN DEFAULT true,
  notify_on_scheduled_post_published BOOLEAN DEFAULT true,

  -- Frequency
  engagement_digest_frequency TEXT DEFAULT 'daily'
    CHECK (engagement_digest_frequency IN ('real_time', 'hourly', 'daily', 'weekly', 'never')),
  analytics_report_frequency TEXT DEFAULT 'weekly'
    CHECK (analytics_report_frequency IN ('daily', 'weekly', 'monthly', 'never')),

  -- Channels
  email_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,
  slack_enabled BOOLEAN DEFAULT false,

  -- Slack integration
  slack_workspace_id VARCHAR,
  slack_channel_id VARCHAR,
  slack_user_id VARCHAR,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (user_id)
);

-- ============================================================================
-- Notifications table
-- Log of sent notifications
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Notification content
  type VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  message TEXT,
  data JSONB,

  -- Channels sent to
  sent_via TEXT[] DEFAULT ARRAY[]::TEXT[],  -- 'email', 'in_app', 'slack'

  -- Status
  status TEXT DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  sent_at TIMESTAMPTZ,
  failed_reason TEXT,

  -- User interaction
  read_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  action_taken TEXT,

  -- Link
  action_url TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Email Templates table
-- Customizable email templates
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,

  -- Identity
  name VARCHAR NOT NULL,
  type VARCHAR NOT NULL,            -- 'digest', 'alert', 'report', 'invitation', etc.
  description TEXT,

  -- Content
  subject VARCHAR NOT NULL,
  body_html TEXT NOT NULL,
  body_plain TEXT,

  -- Metadata
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  variables TEXT[],                -- {{variable}} names

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (workspace_id, type) WHERE is_default = true
);

-- ============================================================================
-- Email Queue table
-- Queue of emails to send
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,

  -- Email details
  to_email VARCHAR NOT NULL,
  from_email VARCHAR DEFAULT 'noreply@postpilot.app',
  subject VARCHAR NOT NULL,
  body_html TEXT,
  body_plain TEXT,

  -- Template
  template_id UUID REFERENCES public.email_templates(id) ON DELETE SET NULL,
  template_variables JSONB,

  -- Scheduling
  scheduled_for TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ,

  -- Retry
  attempt_count INT DEFAULT 0,
  max_attempts INT DEFAULT 3,
  next_retry_at TIMESTAMPTZ,

  -- Status
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'sending', 'sent', 'failed', 'bounced', 'unsubscribed')),
  send_error TEXT,
  message_id VARCHAR,               -- SMTP message ID

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Unsubscribe Tokens table
-- Track unsubscribe links and manage email preferences
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.unsubscribe_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Token
  token VARCHAR UNIQUE NOT NULL,
  notification_type VARCHAR,        -- NULL = unsubscribe all

  -- Status
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_media_assets_workspace ON public.media_assets(workspace_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_uploaded_by ON public.media_assets(uploaded_by_user_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_type ON public.media_assets(file_type);
CREATE INDEX IF NOT EXISTS idx_media_assets_created ON public.media_assets(workspace_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_post_attachments_post ON public.post_attachments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_attachments_media ON public.post_attachments(media_asset_id);

CREATE INDEX IF NOT EXISTS idx_notification_preferences_user ON public.notification_preferences(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(user_id, read_at)
  WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_templates_workspace ON public.email_templates(workspace_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_type ON public.email_templates(type);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON public.email_templates(workspace_id, is_active);

CREATE INDEX IF NOT EXISTS idx_email_queue_status ON public.email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_scheduled ON public.email_queue(scheduled_for)
  WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_email_queue_user ON public.email_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_email_queue_retry ON public.email_queue(next_retry_at)
  WHERE status = 'failed';
CREATE INDEX IF NOT EXISTS idx_email_queue_created ON public.email_queue(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_unsubscribe_tokens_token ON public.unsubscribe_tokens(token);
CREATE INDEX IF NOT EXISTS idx_unsubscribe_tokens_user ON public.unsubscribe_tokens(user_id);

-- ============================================================================
-- Triggers
-- ============================================================================
DROP TRIGGER IF EXISTS trg_media_assets_updated ON public.media_assets;
CREATE TRIGGER trg_media_assets_updated
  BEFORE UPDATE ON public.media_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_notification_preferences_updated ON public.notification_preferences;
CREATE TRIGGER trg_notification_preferences_updated
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_notifications_updated ON public.notifications;
CREATE TRIGGER trg_notifications_updated
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_email_templates_updated ON public.email_templates;
CREATE TRIGGER trg_email_templates_updated
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_email_queue_updated ON public.email_queue;
CREATE TRIGGER trg_email_queue_updated
  BEFORE UPDATE ON public.email_queue
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unsubscribe_tokens ENABLE ROW LEVEL SECURITY;

-- Media assets: workspace members can view
DROP POLICY IF EXISTS "media_assets_select" ON public.media_assets;
CREATE POLICY "media_assets_select" ON public.media_assets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = media_assets.workspace_id
        AND workspace_members.user_id = auth.uid()
    )
  );

-- Media assets: users can insert their own
DROP POLICY IF EXISTS "media_assets_insert" ON public.media_assets;
CREATE POLICY "media_assets_insert" ON public.media_assets
  FOR INSERT WITH CHECK (
    uploaded_by_user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = media_assets.workspace_id
        AND workspace_members.user_id = auth.uid()
    )
  );

-- Post attachments: accessible through posts
DROP POLICY IF EXISTS "post_attachments_select" ON public.post_attachments;
CREATE POLICY "post_attachments_select" ON public.post_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.generated_posts gp
      WHERE gp.id = post_attachments.post_id
        AND gp.user_id = auth.uid()
    )
  );

-- Notification preferences: full access to own
DROP POLICY IF EXISTS "notification_preferences_all_own" ON public.notification_preferences;
CREATE POLICY "notification_preferences_all_own" ON public.notification_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Notifications: full access to own
DROP POLICY IF EXISTS "notifications_all_own" ON public.notifications;
CREATE POLICY "notifications_all_own" ON public.notifications
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Email templates: workspace admins can view
DROP POLICY IF EXISTS "email_templates_select" ON public.email_templates;
CREATE POLICY "email_templates_select" ON public.email_templates
  FOR SELECT USING (
    workspace_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = email_templates.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND (workspace_members.role = 'admin' OR workspace_members.role = 'owner')
    )
  );

-- Email queue: no direct RLS (managed by backend)

-- Unsubscribe tokens: no direct RLS (public endpoint)
