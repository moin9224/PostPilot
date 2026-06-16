-- ============================================================================
-- Migration: 007_usage_and_billing
-- Purpose: Usage tracking, credits, and billing
-- Created: 2025-06-16
-- ============================================================================

-- ============================================================================
-- Generation Credits table
-- Track AI generation credit usage
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.generation_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,

  -- Monthly allocation
  month_year DATE NOT NULL,
  allocated_credits INT NOT NULL,
  used_credits INT DEFAULT 0,

  -- Calculated field
  remaining_credits INT GENERATED ALWAYS AS (allocated_credits - used_credits) STORED,

  -- Tracking
  reset_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  next_reset_date TIMESTAMPTZ NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (workspace_id, month_year)
);

-- ============================================================================
-- Credit Usage Log table
-- Detailed log of every credit usage
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.credit_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Usage details
  action TEXT NOT NULL CHECK (action IN ('generate_post', 'regenerate_post', 'youtube_ingest', 'competitor_analysis')),
  credits_consumed INT NOT NULL,

  -- Reference
  related_post_id UUID REFERENCES public.generated_posts(id) ON DELETE SET NULL,
  related_competitor_id UUID REFERENCES public.competitors(id) ON DELETE SET NULL,

  -- Metadata
  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Subscription Events table
-- Track subscription changes, upgrades, downgrades, cancellations
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,

  -- Event
  event_type TEXT NOT NULL
    CHECK (event_type IN ('created', 'upgraded', 'downgraded', 'renewed', 'cancelled', 'paused', 'resumed')),
  from_plan TEXT,
  to_plan TEXT,

  -- Billing
  amount_paid NUMERIC,
  currency TEXT DEFAULT 'USD',
  stripe_event_id VARCHAR UNIQUE,

  -- Metadata
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Invoices table
-- Track generated invoices
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,

  -- Invoice details
  invoice_number VARCHAR UNIQUE NOT NULL,
  stripe_invoice_id VARCHAR UNIQUE,

  -- Amounts
  subtotal NUMERIC NOT NULL,
  tax NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',

  -- Dates
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'refunded')),

  -- PDF
  invoice_pdf_url TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Feature Usage table
-- Track feature adoption and usage patterns
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.feature_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,

  -- Feature tracking
  feature_name VARCHAR NOT NULL,
  action TEXT,

  -- Counts
  usage_count INT DEFAULT 0,
  last_used_at TIMESTAMPTZ,

  -- Period
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (workspace_id, feature_name, period_start)
);

-- ============================================================================
-- Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_generation_credits_workspace ON public.generation_credits(workspace_id);
CREATE INDEX IF NOT EXISTS idx_generation_credits_month ON public.generation_credits(workspace_id, month_year DESC);

CREATE INDEX IF NOT EXISTS idx_credit_usage_logs_workspace ON public.credit_usage_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_logs_user ON public.credit_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_logs_created ON public.credit_usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_usage_logs_action ON public.credit_usage_logs(action);

CREATE INDEX IF NOT EXISTS idx_subscription_events_workspace ON public.subscription_events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_created ON public.subscription_events(workspace_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscription_events_type ON public.subscription_events(event_type);

CREATE INDEX IF NOT EXISTS idx_invoices_workspace ON public.invoices(workspace_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(workspace_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_issued ON public.invoices(issued_at DESC);

CREATE INDEX IF NOT EXISTS idx_feature_usage_workspace ON public.feature_usage(workspace_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_feature ON public.feature_usage(workspace_id, feature_name);
CREATE INDEX IF NOT EXISTS idx_feature_usage_period ON public.feature_usage(period_start, period_end);

-- ============================================================================
-- Triggers
-- ============================================================================
DROP TRIGGER IF EXISTS trg_generation_credits_updated ON public.generation_credits;
CREATE TRIGGER trg_generation_credits_updated
  BEFORE UPDATE ON public.generation_credits
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_subscription_events_updated ON public.subscription_events;
CREATE TRIGGER trg_subscription_events_updated
  BEFORE UPDATE ON public.subscription_events
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_invoices_updated ON public.invoices;
CREATE TRIGGER trg_invoices_updated
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_feature_usage_updated ON public.feature_usage;
CREATE TRIGGER trg_feature_usage_updated
  BEFORE UPDATE ON public.feature_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
ALTER TABLE public.generation_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage ENABLE ROW LEVEL SECURITY;

-- Generation credits: workspace members can view
DROP POLICY IF EXISTS "generation_credits_select" ON public.generation_credits;
CREATE POLICY "generation_credits_select" ON public.generation_credits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = generation_credits.workspace_id
        AND workspace_members.user_id = auth.uid()
    )
  );

-- Credit usage logs: workspace members with can_manage_billing can view
DROP POLICY IF EXISTS "credit_usage_logs_select" ON public.credit_usage_logs;
CREATE POLICY "credit_usage_logs_select" ON public.credit_usage_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = credit_usage_logs.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND (workspace_members.can_manage_billing OR workspace_members.role = 'owner')
    )
  );

-- Subscription events: workspace owners can view
DROP POLICY IF EXISTS "subscription_events_select" ON public.subscription_events;
CREATE POLICY "subscription_events_select" ON public.subscription_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = subscription_events.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role = 'owner'
    )
  );

-- Invoices: workspace members with can_manage_billing can view
DROP POLICY IF EXISTS "invoices_select" ON public.invoices;
CREATE POLICY "invoices_select" ON public.invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = invoices.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND (workspace_members.can_manage_billing OR workspace_members.role = 'owner')
    )
  );

-- Feature usage: workspace members can view
DROP POLICY IF EXISTS "feature_usage_select" ON public.feature_usage;
CREATE POLICY "feature_usage_select" ON public.feature_usage
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = feature_usage.workspace_id
        AND workspace_members.user_id = auth.uid()
    )
  );
