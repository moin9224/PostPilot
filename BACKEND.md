# PostPilot — Backend

Next.js API Routes + Supabase (Postgres/Auth/Storage) + Claude API.

## Setup

1. **Create a Supabase project**, then run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor. It creates all tables, indexes, RLS policies, the `media` storage bucket, an `updated_at` trigger, and an auth trigger that auto-creates a `profiles` row on signup.
2. **Enable Auth providers** in Supabase: Email, and (optionally) LinkedIn OAuth.
3. **Copy env vars**: `cp .env.example .env.local` and fill in the values.
   - ⚠️ The content generator uses **`ANTHROPIC_API_KEY`** (Claude), not `OPENAI_API_KEY`. Get one at <https://console.anthropic.com>.
4. `npm install && npm run dev`.

## Architecture

| Concern | File |
|---|---|
| Browser Supabase client (RLS) | [`lib/supabase.ts`](lib/supabase.ts) |
| Server + admin clients | [`lib/supabase-server.ts`](lib/supabase-server.ts) |
| Session refresh | [`middleware.ts`](middleware.ts) |
| Auth guard, JSON/CORS helpers, zod validation, error wrapper | [`lib/api.ts`](lib/api.ts) |
| Plan-based rate limiting | [`lib/rate-limit.ts`](lib/rate-limit.ts) |
| Claude wrapper (structured outputs) | [`lib/anthropic.ts`](lib/anthropic.ts) |
| Reach analysis heuristics | [`lib/reach-analyzer.ts`](lib/reach-analyzer.ts) |
| Billing / Stripe | [`lib/billing.ts`](lib/billing.ts) |

Every route is wrapped with `route()` for consistent error→JSON handling, guarded by `requireUser()`, and validated with zod. RLS enforces per-user data isolation at the database level as a second layer of defense.

## Endpoints

### Auth
| Method | Path | Body |
|---|---|---|
| POST | `/api/auth/signup` | `{ email, password, full_name }` |
| POST | `/api/auth/login` | `{ email, password }` |
| POST | `/api/auth/logout` | — |
| GET | `/api/auth/me` | — |

### Content generation (core)
| Method | Path | Notes |
|---|---|---|
| POST | `/api/generate-content` | `{ topic, tone, industry, audience, style, count }` → Claude generates posts (saved as drafts). Enforces daily plan limits. |

### Posts & scheduling
| Method | Path |
|---|---|
| GET / PUT / DELETE | `/api/posts/[id]` |
| POST | `/api/posts/schedule` |
| GET | `/api/posts/scheduled` |
| PUT / DELETE | `/api/posts/scheduled/[id]` |
| POST | `/api/posts/bulk-schedule` |
| POST | `/api/posts/publish` |
| GET | `/api/posts/publish-status/[id]` |

### Analytics
`/api/analytics/overview`, `/api/analytics/posts?period=7d|30d|90d&sort=`, `/api/analytics/engagement-trend`, `/api/analytics/best-times`

### Competitors
`/api/competitors` (GET), `/api/competitors/add` (POST), `/api/competitors/[id]` (DELETE), `/api/competitors/[id]/posts` (GET), `/api/competitors/compare` (GET)

### Reach debugger
`/api/reach-debugger/analyze` (POST), `/api/reach-debugger/latest` (GET)

### Library
`/api/library` (GET paginated, POST), `/api/library/[id]` (PUT, DELETE)

### Team
`/api/team` (GET), `/api/team/invite` (POST), `/api/team/[memberId]` (DELETE)

### Profile
`/api/profile` (GET, PUT), `/api/profile/link-linkedin` (POST), `/api/profile/disconnect-linkedin` (POST)

### Billing
`/api/billing/subscription` (GET), `/api/billing/upgrade` (POST → Stripe Checkout URL), `/api/billing/usage` (GET), `/api/billing/webhook` (POST, Stripe signature-verified)

## Notes & limitations

- **LinkedIn posting**: direct programmatic posting is restricted by LinkedIn. `/api/posts/publish` returns a 1-click share URL and marks the post published — swap in the official LinkedIn API where a real integration exists.
- **Competitor scraping** ([`lib/linkedin-scraper.ts`](lib/linkedin-scraper.ts)) returns placeholder data; replace with a compliant data source.
- **Email** ([`lib/email.ts`](lib/email.ts)) logs to the console; wire to Resend/Postmark/SES.
- **Rate limiting** is DB-backed (counts today's generated posts). For high scale, move to Redis.
