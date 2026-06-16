-- ============================================================================
-- Migration: 004_team_and_collaboration
-- Purpose: Teams, workspaces, team members, and collaboration
-- Created: 2025-06-16
-- ============================================================================

-- ============================================================================
-- Workspaces table
-- Multi-user workspaces (team collaboration)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Identity
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,

  -- Workspace settings
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'agency')),
  member_limit INT DEFAULT 1,    -- Changes based on plan
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Workspace Members table
-- Team members and their roles
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Role and permissions
  role TEXT NOT NULL DEFAULT 'editor'
    CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),

  -- Permissions (can be overridden per role)
  can_edit_posts BOOLEAN DEFAULT true,
  can_publish_posts BOOLEAN DEFAULT true,
  can_view_analytics BOOLEAN DEFAULT true,
  can_manage_team BOOLEAN DEFAULT false,
  can_manage_billing BOOLEAN DEFAULT false,

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending_invite')),
  joined_at TIMESTAMPTZ,
  invited_at TIMESTAMPTZ,
  invited_by_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (workspace_id, user_id)
);

-- ============================================================================
-- LinkedIn Accounts per Workspace table
-- Associate LinkedIn accounts with workspaces (multi-account, multi-workspace)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.workspace_linkedin_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  linkedin_account_id UUID NOT NULL REFERENCES public.linkedin_accounts(id) ON DELETE CASCADE,

  -- Account assignment
  assigned_at TIMESTAMPTZ DEFAULT now(),
  assigned_by_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- Access control
  can_publish BOOLEAN DEFAULT true,
  can_analyze BOOLEAN DEFAULT true,

  is_primary BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (workspace_id, linkedin_account_id)
);

-- ============================================================================
-- Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_workspaces_owner ON public.workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_slug ON public.workspaces(slug);

CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON public.workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON public.workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_role ON public.workspace_members(workspace_id, role);

CREATE INDEX IF NOT EXISTS idx_workspace_linkedin_accounts_workspace ON public.workspace_linkedin_accounts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_linkedin_accounts_account ON public.workspace_linkedin_accounts(linkedin_account_id);

-- ============================================================================
-- Triggers
-- ============================================================================
DROP TRIGGER IF EXISTS trg_workspaces_updated ON public.workspaces;
CREATE TRIGGER trg_workspaces_updated
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_workspace_members_updated ON public.workspace_members;
CREATE TRIGGER trg_workspace_members_updated
  BEFORE UPDATE ON public.workspace_members
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_linkedin_accounts ENABLE ROW LEVEL SECURITY;

-- Workspaces: accessible by members
DROP POLICY IF EXISTS "workspaces_select" ON public.workspaces;
CREATE POLICY "workspaces_select" ON public.workspaces
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
        AND workspace_members.user_id = auth.uid()
    )
  );

-- Workspace members: accessible by workspace members
DROP POLICY IF EXISTS "workspace_members_select" ON public.workspace_members;
CREATE POLICY "workspace_members_select" ON public.workspace_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members wm2
      WHERE wm2.workspace_id = workspace_members.workspace_id
        AND wm2.user_id = auth.uid()
    )
  );

-- Workspace LinkedIn accounts: accessible by workspace members
DROP POLICY IF EXISTS "workspace_linkedin_accounts_select" ON public.workspace_linkedin_accounts;
CREATE POLICY "workspace_linkedin_accounts_select" ON public.workspace_linkedin_accounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = workspace_linkedin_accounts.workspace_id
        AND workspace_members.user_id = auth.uid()
    )
  );
