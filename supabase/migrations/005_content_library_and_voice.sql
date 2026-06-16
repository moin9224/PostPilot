-- ============================================================================
-- Migration: 005_content_library_and_voice
-- Purpose: Content library, drafts, templates, and voice styles
-- Created: 2025-06-16
-- ============================================================================

-- ============================================================================
-- Voice Styles table
-- User's brand voice profiles for content generation
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.voice_styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Identity
  name VARCHAR NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,

  -- Voice characteristics
  tone TEXT[] DEFAULT ARRAY[]::TEXT[],    -- e.g., ['Professional', 'Casual', 'Inspiring']
  key_phrases TEXT[],                      -- Common phrases they use
  example_posts TEXT[],                    -- Example posts in this voice

  -- Voice data (from LinkedIn posts analysis)
  analyzed_from_post_count INT DEFAULT 0,
  last_analyzed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (user_id, name)
);

-- ============================================================================
-- Content Drafts table
-- Saved drafts and work-in-progress posts
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.content_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Content
  text TEXT,
  hashtags TEXT[],
  topic TEXT,

  -- Metadata
  title TEXT,
  description TEXT,
  category TEXT,
  tags TEXT[],

  -- Draft state
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'approved')),
  version INT DEFAULT 1,

  -- AI generation state
  generation_prompt TEXT,
  source_data JSONB,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Content Templates table
-- Reusable post templates and structures
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.content_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,  -- NULL for system templates
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,

  -- Template identity
  name VARCHAR NOT NULL,
  description TEXT,
  category TEXT,

  -- Template content
  template_structure TEXT,     -- e.g., "Hook -> Story -> Lesson -> CTA"
  example_filled TEXT,         -- Example of template filled in

  -- Metadata
  is_public BOOLEAN DEFAULT false,
  usage_count INT DEFAULT 0,
  last_used_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Content Library table
-- Organized, searchable library of all content
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.content_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,

  -- Content
  text TEXT NOT NULL,
  hashtags TEXT[],
  media_urls TEXT[],

  -- Classification
  category TEXT,
  topics TEXT[],
  tags TEXT[],
  tone TEXT,

  -- Source
  source_post_id UUID REFERENCES public.linkedin_posts(id) ON DELETE SET NULL,
  source_type TEXT DEFAULT 'manual' CHECK (source_type IN ('manual', 'generated', 'imported')),

  -- Metadata
  notes TEXT,
  is_reusable BOOLEAN DEFAULT true,
  usage_count INT DEFAULT 0,
  last_used_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_voice_styles_user ON public.voice_styles(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_styles_default ON public.voice_styles(user_id, is_default);

CREATE INDEX IF NOT EXISTS idx_content_drafts_user ON public.content_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_content_drafts_status ON public.content_drafts(user_id, status);
CREATE INDEX IF NOT EXISTS idx_content_drafts_created ON public.content_drafts(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_content_templates_user ON public.content_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_content_templates_workspace ON public.content_templates(workspace_id);
CREATE INDEX IF NOT EXISTS idx_content_templates_category ON public.content_templates(category);

CREATE INDEX IF NOT EXISTS idx_content_library_workspace ON public.content_library(workspace_id);
CREATE INDEX IF NOT EXISTS idx_content_library_tags ON public.content_library(workspace_id, tags);
CREATE INDEX IF NOT EXISTS idx_content_library_category ON public.content_library(workspace_id, category);
CREATE INDEX IF NOT EXISTS idx_content_library_created ON public.content_library(workspace_id, created_at DESC);

-- ============================================================================
-- Triggers
-- ============================================================================
DROP TRIGGER IF EXISTS trg_voice_styles_updated ON public.voice_styles;
CREATE TRIGGER trg_voice_styles_updated
  BEFORE UPDATE ON public.voice_styles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_content_drafts_updated ON public.content_drafts;
CREATE TRIGGER trg_content_drafts_updated
  BEFORE UPDATE ON public.content_drafts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_content_templates_updated ON public.content_templates;
CREATE TRIGGER trg_content_templates_updated
  BEFORE UPDATE ON public.content_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_content_library_updated ON public.content_library;
CREATE TRIGGER trg_content_library_updated
  BEFORE UPDATE ON public.content_library
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
ALTER TABLE public.voice_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_library ENABLE ROW LEVEL SECURITY;

-- Voice styles: full access to own
DROP POLICY IF EXISTS "voice_styles_all_own" ON public.voice_styles;
CREATE POLICY "voice_styles_all_own" ON public.voice_styles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Content drafts: full access to own
DROP POLICY IF EXISTS "content_drafts_all_own" ON public.content_drafts;
CREATE POLICY "content_drafts_all_own" ON public.content_drafts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Content templates: accessible by workspace members
DROP POLICY IF EXISTS "content_templates_select" ON public.content_templates;
CREATE POLICY "content_templates_select" ON public.content_templates
  FOR SELECT USING (
    user_id = auth.uid() OR
    (workspace_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = content_templates.workspace_id
        AND workspace_members.user_id = auth.uid()
    ))
  );

-- Content library: accessible by workspace members
DROP POLICY IF EXISTS "content_library_select" ON public.content_library;
CREATE POLICY "content_library_select" ON public.content_library
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = content_library.workspace_id
        AND workspace_members.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "content_library_all_own" ON public.content_library;
CREATE POLICY "content_library_all_own" ON public.content_library
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = content_library.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.can_edit_posts = true
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = content_library.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.can_edit_posts = true
    )
  );
