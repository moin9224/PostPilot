-- ============================================================================
-- 010: Scheduled publishing worker support
--
-- The cron worker (/api/cron/publish-scheduled) claims a due post by moving it
-- to an intermediate `publishing` status before calling the LinkedIn API, so a
-- concurrent run can't publish the same post twice. Allow that status value.
-- ============================================================================

alter table public.scheduled_posts_v2
  drop constraint if exists scheduled_posts_v2_status_check;

alter table public.scheduled_posts_v2
  add constraint scheduled_posts_v2_status_check
  check (status in ('scheduled', 'publishing', 'published', 'failed'));

-- Index supporting the worker's "due and still scheduled" lookup.
create index if not exists idx_scheduled_posts_v2_worker
  on public.scheduled_posts_v2 (scheduled_for)
  where status = 'scheduled';
