# PostPilot Scheduling System

## Overview

The scheduling system automatically publishes LinkedIn posts at the exact time specified by the user. This document explains how it works.

---

## Architecture

### 1. **Scheduling a Post** (`POST /api/posts/schedule`)

When a user schedules a post, the API:

1. **Validates** the scheduled time is in the future
2. **Verifies** the LinkedIn account exists, belongs to the user, and is active
3. **Stores** the post in `scheduled_posts_v2` table with:
   - `text`: Post content
   - `scheduled_for`: ISO 8601 timestamp when to publish
   - `linkedin_account_id`: Which LinkedIn account to post from
   - `status`: "scheduled" (waiting to be published)
   - `hashtags`: Optional hashtags

**Request Example:**
```json
POST /api/posts/schedule
{
  "text": "Just launched PostPilot! 🚀",
  "scheduledFor": "2026-06-20T15:30:00Z",
  "linkedinAccountId": "550e8400-e29b-41d4-a716-446655440000",
  "hashtags": ["startup", "AI", "linkedin"]
}
```

**Response:**
```json
{
  "postId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "scheduledFor": "2026-06-20T15:30:00Z",
  "message": "Post scheduled successfully. It will be published at the scheduled time."
}
```

---

### 2. **Automatic Publishing** (`GET /api/cron/publish-scheduled`)

The cron worker runs **every 5 minutes** and:

1. **Finds** all posts where `status = 'scheduled'` AND `scheduled_for <= now()`
2. **Validates** the LinkedIn account is still active
3. **Publishes** each post to LinkedIn using the LinkedIn UGC Posts API
4. **Updates** the database with the result:
   - On success: `status = 'published'`, `linkedin_post_id` stored
   - On failure: `status = 'failed'`, `publish_error` logged

**Cron Configuration** (vercel.json):
```json
{
  "crons": [
    {
      "path": "/api/cron/publish-scheduled",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

The `*/5 * * * *` schedule means: run every 5 minutes, every hour, every day.

---

### 3. **Publishing to LinkedIn** (`publishToLinkedIn` in lib/linkedin.ts)

The helper function:

1. **Checks** the OAuth token is not expired
2. **Calls** LinkedIn's UGC Posts API: `POST https://api.linkedin.com/v2/ugcPosts`
3. **Includes** the post content, author URN, and visibility settings
4. **Returns** the LinkedIn post ID on success or an error message on failure

**Token Validation:**
- If token is expired → publish fails with error "LinkedIn token expired"
- If token is revoked (401) → publish fails and account marked inactive
- If network error → publish fails with network error message

---

## Database Schema

### scheduled_posts_v2 Table

```sql
CREATE TABLE public.scheduled_posts_v2 (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,                    -- Who owns this post
  linkedin_account_id UUID NOT NULL,        -- Which account to post from
  
  text TEXT NOT NULL,                       -- Post content
  hashtags TEXT[],                          -- Optional hashtags
  
  scheduled_for TIMESTAMPTZ NOT NULL,       -- When to publish (ISO 8601)
  status VARCHAR DEFAULT 'scheduled',       -- scheduled|publishing|published|failed
  
  published_at TIMESTAMPTZ,                 -- When actually published
  linkedin_post_id VARCHAR,                 -- LinkedIn's post ID
  publish_error TEXT,                       -- Error message if failed
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Statuses:**
- `scheduled`: Post is waiting to be published
- `publishing`: Cron is currently publishing this post (prevents double-publish)
- `published`: Post was successfully published to LinkedIn
- `failed`: Publishing failed (check `publish_error` for reason)

---

## Timing Accuracy

### How Accurate Is Publishing?

Posts are published **within 5 minutes** of their scheduled time.

**Example Timeline:**
- User schedules post for `2026-06-20T15:30:00Z`
- Cron runs at: 15:30, 15:35, 15:40, 15:45, etc.
- Post publishes on the **first cron run at or after 15:30**

So a post scheduled for 15:30 will publish between 15:30 and 15:35.

### Timezone Support

When scheduling, you can specify a timezone (optional, defaults to UTC):
```json
{
  "text": "Morning post!",
  "scheduledFor": "2026-06-20T09:00:00-05:00",
  "linkedinAccountId": "550e8400-e29b-41d4-a716-446655440000"
}
```

The `scheduledFor` timestamp should be in **ISO 8601 format with timezone offset** or **UTC**.

---

## Error Handling

### Publishing Failures

If a post fails to publish, the cron logs the error in `publish_error`:

**Common Errors:**

| Error | Cause | Solution |
|-------|-------|----------|
| "LinkedIn token expired" | OAuth token is past expiry | User must reconnect LinkedIn |
| "No active LinkedIn account" | Account is disconnected or inactive | User must reconnect LinkedIn |
| "LinkedIn API error (401)" | Token revoked or invalid | User must reconnect LinkedIn |
| "LinkedIn API error (429)" | Rate limit exceeded | Retry later (max 5 posts/day) |
| "Could not reach LinkedIn" | Network issue | Cron will retry in 5 minutes |

### Retry Logic

Currently, failed posts are **not automatically retried**. The user can:
1. See the error in the dashboard
2. Reconnect LinkedIn if the token is expired
3. Manually re-schedule the post

(Future enhancement: implement exponential backoff retry)

---

## Deployment Checklist

- [x] Cron runs every 5 minutes (not just daily)
- [x] Schedule endpoint validates LinkedIn account
- [x] Schedule endpoint writes to `scheduled_posts_v2` table
- [x] Cron reads from `scheduled_posts_v2` table
- [x] Publishing uses valid LinkedIn OAuth token
- [x] Failed posts are logged with error messages
- [x] Double-publish is prevented via "publishing" status

---

## Testing the System

### Manual Test (Local)

1. **Connect LinkedIn:**
   - Go to Settings → Integrations → Connect LinkedIn
   - Authorize PostPilot on LinkedIn

2. **Schedule a post 5 minutes from now:**
   ```bash
   curl -X POST http://localhost:3000/api/posts/schedule \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{
       "text": "Test post from PostPilot",
       "scheduledFor": "2026-06-20T15:35:00Z",
       "linkedinAccountId": "YOUR_ACCOUNT_ID"
     }'
   ```

3. **Wait 5 minutes** for the cron to run

4. **Check LinkedIn** — post should appear!

### Production Test (Vercel)

1. Schedule a post for 5 minutes from now
2. Wait for the next cron run (max 5 minutes)
3. Check the post status in the dashboard
4. Verify the post on LinkedIn

---

## Monitoring

### Check Scheduled Posts

```sql
SELECT id, text, scheduled_for, status, publish_error
FROM public.scheduled_posts_v2
WHERE user_id = 'YOUR_USER_ID'
ORDER BY scheduled_for DESC;
```

### Check Failed Posts

```sql
SELECT id, text, scheduled_for, publish_error
FROM public.scheduled_posts_v2
WHERE user_id = 'YOUR_USER_ID'
  AND status = 'failed'
ORDER BY updated_at DESC;
```

### Check Cron Logs (Vercel)

In Vercel dashboard:
1. Go to project → Functions
2. Find `/api/cron/publish-scheduled`
3. View recent invocations and logs

---

## Future Enhancements

1. **Timezone-aware scheduling**: Convert user timezone to UTC before storing
2. **Batch optimization**: Publish multiple posts in one cron run
3. **Retry with backoff**: Automatically retry failed posts 3 times with exponential backoff
4. **Analytics sync**: Fetch post metrics from LinkedIn daily
5. **Rate limit awareness**: Warn user if scheduling >5 posts/day
6. **Scheduled time validation**: Prevent scheduling outside LinkedIn's posting windows

---

## Support

For scheduling issues:
1. Check `publish_error` in the database for the specific error
2. Verify LinkedIn account is connected and active
3. Ensure OAuth token hasn't expired
4. Check Vercel logs for cron execution errors
