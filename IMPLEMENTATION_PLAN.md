# PostPilot: LinkedIn Account Connection & Functional Flow

## Overview
Users connect their LinkedIn account via OAuth 2.0. PostPilot acts as a third-party app that reads profile data, posts, analytics, and publishes new posts on the user's behalf — all without storing the user's LinkedIn password.

---

## 1. LinkedIn OAuth Flow (Account Connection)

### Step 1a: User Initiates Connection
**Where:** Settings page or onboarding flow
- User clicks **"Connect LinkedIn"** button
- App stores a `state` token in session (CSRF protection)
- Redirects to LinkedIn's authorization endpoint:
```
https://www.linkedin.com/oauth/v2/authorization
  ?response_type=code
  &client_id=YOUR_LINKEDIN_CLIENT_ID
  &redirect_uri=https://app.postpilot.io/auth/linkedin/callback
  &state=random_state_token
  &scope=openid%20profile%20email%20w_member_social
```

### Step 1b: User Authorizes on LinkedIn
- LinkedIn's login screen appears (if not already logged in)
- User sees: *"PostPilot wants to access your profile, email, and permission to post on your behalf"*
- User clicks **"Authorize"**
- LinkedIn redirects back to our app with an `authorization code`

### Step 1c: Backend Exchanges Code for Access Token
**Route:** `POST /api/auth/linkedin/callback`
- Frontend sends: `{ code, state }`
- Backend validates `state` matches session token (prevents CSRF)
- Backend exchanges `code` for `access_token` and optional `refresh_token`:
```
POST https://www.linkedin.com/oauth/v2/accessToken
  client_id=YOUR_ID
  client_secret=YOUR_SECRET
  code=AUTHORIZATION_CODE
  redirect_uri=https://app.postpilot.io/auth/linkedin/callback
  grant_type=authorization_code
```
- LinkedIn returns:
```json
{
  "access_token": "AQE...",
  "expires_in": 5184000,  // 60 days
  "refresh_token": "AQH...",  // Optional; requires special app status
  "token_type": "Bearer"
}
```

### Step 1d: Store Token Securely
**Database:** Supabase `user_linkedin_accounts` table
```sql
CREATE TABLE user_linkedin_accounts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- LinkedIn identity
  linkedin_id VARCHAR UNIQUE NOT NULL,  -- LinkedIn's Member ID
  linkedin_handle VARCHAR,               -- @username
  profile_url VARCHAR,
  
  -- OAuth tokens (encrypted at rest)
  access_token TEXT NOT NULL,           -- Encrypted
  refresh_token TEXT,                   -- Encrypted (if available)
  token_expires_at TIMESTAMP NOT NULL,
  
  -- Profile snapshot (cached, refreshed monthly)
  profile_name VARCHAR,
  profile_headline VARCHAR,
  profile_photo_url VARCHAR,
  followers_count INT,
  
  -- Connection status
  connected_at TIMESTAMP DEFAULT now(),
  last_sync_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

**Security:**
- Tokens encrypted with `AES-256-GCM` using `SUPABASE_ENCRYPTION_KEY`
- Never log tokens
- Never send tokens to frontend
- Access token has 60-day expiry — refresh when within 7 days of expiry

---

## 2. Fetching User's LinkedIn Data (First Sync)

### Step 2a: Get Member Profile
**Route:** `POST /api/linkedin/sync/profile`
- Backend uses stored `access_token` to call LinkedIn API:
```
GET https://api.linkedin.com/rest/me
  Authorization: Bearer ACCESS_TOKEN
```
- LinkedIn returns:
```json
{
  "id": "1234567890",
  "localizedFirstName": "John",
  "localizedLastName": "Doe",
  "profilePicture": {
    "displayImage": "urn:li:digitalmediaAsset:..."
  }
}
```
- Save to `user_linkedin_accounts` (profile snapshot)

### Step 2b: Fetch User's Recent Posts
**Route:** `GET /api/linkedin/sync/posts`
- Call LinkedIn's UGC Stream API:
```
GET https://api.linkedin.com/rest/ugcPosts
  ?q=authors&authors=urn:li:person:1234567890
  &sortBy=RECENT
  &count=50
```
- LinkedIn returns array of posts with:
  - `id` (LinkedIn's post ID)
  - `created_at` (timestamp)
  - `text` (post content)
  - `commentary` (hashtags, links)
  - `visibility` (PUBLIC, CONNECTIONS, etc.)

### Step 2c: Enrich Posts with Analytics
**Route:** `POST /api/linkedin/sync/analytics`
- For each post, call LinkedIn's Analytics API:
```
GET https://api.linkedin.com/rest/posts/{postId}/postMetrics
```
- LinkedIn returns:
  - `impressionCount`
  - `likeCount`
  - `commentCount`
  - `shareCount`
  - `clickCount`

### Step 2d: Store Posts in PostPilot DB
**Database:** `linkedin_posts` table
```sql
CREATE TABLE linkedin_posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  linkedin_id VARCHAR UNIQUE,         -- LinkedIn's post ID
  
  text TEXT NOT NULL,
  hashtags TEXT[],                    -- Extracted from content
  
  posted_at TIMESTAMP,
  status VARCHAR,                     -- 'published', 'scheduled', 'draft'
  
  -- Analytics (refreshed daily)
  impressions INT DEFAULT 0,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  shares INT DEFAULT 0,
  engagement_rate FLOAT,
  
  -- Metadata
  tone VARCHAR,                       -- 'Professional', 'Casual', etc. (inferred)
  industry VARCHAR,
  estimated_reach INT,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

---

## 3. Publishing a New Post (Content Generator → LinkedIn)

### Step 3a: User Generates & Schedules Post
**Flow in Generator Page:**
1. User writes topic, picks tone/industry/audience/length
2. Clicks **Generate from video** or **Generate 7 variations**
3. Claude writes 7 post variations
4. User picks one, clicks **Schedule**
5. Modal opens: *"When do you want to post this?"*
6. User picks date + time
7. Clicks **Confirm Schedule**

### Step 3b: Store Draft in DB
**Database:** `scheduled_posts` table
```sql
CREATE TABLE scheduled_posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  linkedin_account_id UUID REFERENCES user_linkedin_accounts(id),
  
  text TEXT NOT NULL,
  hashtags TEXT[],
  
  -- Scheduling
  scheduled_for TIMESTAMP NOT NULL,
  status VARCHAR DEFAULT 'scheduled',  -- 'scheduled', 'published', 'failed'
  
  -- Publishing metadata
  published_at TIMESTAMP,
  linkedin_post_id VARCHAR,           -- Once published, store LinkedIn's ID
  publish_error TEXT,                 -- If publish fails, store error
  
  -- Tracking
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### Step 3c: Job Queue Publishes at Scheduled Time
**Background Job:** `publish_scheduled_posts` (runs every 5 minutes)
```typescript
// Pseudo-code for scheduled job

async function publishScheduledPosts() {
  // Find all posts where scheduled_for <= now() and status = 'scheduled'
  const posts = await db
    .from('scheduled_posts')
    .select('*')
    .eq('status', 'scheduled')
    .lte('scheduled_for', now());

  for (const post of posts) {
    // Get user's LinkedIn account
    const linkedinAccount = await db
      .from('user_linkedin_accounts')
      .select('access_token')
      .eq('id', post.linkedin_account_id)
      .single();

    // Publish to LinkedIn
    try {
      const response = await fetch(
        'https://api.linkedin.com/rest/posts',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${decrypt(linkedinAccount.access_token)}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            author: `urn:li:person:${linkedinAccount.linkedin_id}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
              'com.linkedin.ugc.ShareContent': {
                shareCommentary: {
                  text: post.text,
                },
                shareMediaCategory: 'NONE',
              },
            },
            visibility: {
              'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
            },
          }),
        }
      );

      const publishedPost = await response.json();

      // Update DB
      await db
        .from('scheduled_posts')
        .update({
          status: 'published',
          linkedin_post_id: publishedPost.id,
          published_at: now(),
        })
        .eq('id', post.id);

      // Also store in linkedin_posts for analytics tracking
      await db.from('linkedin_posts').insert({
        user_id: post.user_id,
        linkedin_id: publishedPost.id,
        text: post.text,
        hashtags: post.hashtags,
        posted_at: now(),
        status: 'published',
      });
    } catch (error) {
      // Log error and mark post as failed
      await db
        .from('scheduled_posts')
        .update({
          status: 'failed',
          publish_error: error.message,
        })
        .eq('id', post.id);
    }
  }
}
```

---

## 4. Daily Analytics Sync

### Step 4a: Refresh Post Metrics
**Cron Job:** Runs daily at 2:00 AM (off-peak)
```typescript
async function syncAnalytics() {
  // For each user's published posts in last 30 days
  const recentPosts = await db
    .from('linkedin_posts')
    .select('*')
    .eq('status', 'published')
    .gte('posted_at', dateSubDays(now(), 30));

  for (const post of recentPosts) {
    const linkedinAccount = await db
      .from('user_linkedin_accounts')
      .select('access_token, linkedin_id')
      .eq('user_id', post.user_id)
      .single();

    // Fetch metrics from LinkedIn
    const metrics = await fetch(
      `https://api.linkedin.com/rest/posts/${post.linkedin_id}/postMetrics`,
      {
        headers: {
          Authorization: `Bearer ${decrypt(linkedinAccount.access_token)}`,
        },
      }
    ).then(r => r.json());

    // Update our DB
    await db
      .from('linkedin_posts')
      .update({
        impressions: metrics.impressionCount,
        likes: metrics.likeCount,
        comments: metrics.commentCount,
        shares: metrics.shareCount,
        engagement_rate: (
          (metrics.likeCount + metrics.commentCount + metrics.shareCount) /
          metrics.impressionCount
        ) * 100,
        updated_at: now(),
      })
      .eq('id', post.id);
  }
}
```

---

## 5. Token Refresh (When Expired)

### Step 5a: Detect Expiry
- Before any API call, check: `token_expires_at < now() + 7 days`
- If true, refresh

### Step 5b: Refresh Token
```typescript
async function refreshLinkedInToken(userId: string) {
  const account = await db
    .from('user_linkedin_accounts')
    .select('refresh_token')
    .eq('user_id', userId)
    .single();

  if (!account.refresh_token) {
    // No refresh token available (standard LinkedIn OAuth)
    // User must re-authorize
    throw new Error('Token expired; please reconnect LinkedIn');
  }

  const response = await fetch(
    'https://www.linkedin.com/oauth/v2/accessToken',
    {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: decrypt(account.refresh_token),
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }),
    }
  ).then(r => r.json());

  // Update DB
  await db
    .from('user_linkedin_accounts')
    .update({
      access_token: encrypt(response.access_token),
      token_expires_at: dateAddSeconds(now(), response.expires_in),
    })
    .eq('user_id', userId);
}
```

---

## 6. User Experience Flow (Dashboard)

### Settings Page: Connect LinkedIn
```
[Settings] → [Integrations] → [LinkedIn]

IF NOT CONNECTED:
  📎 LinkedIn Account
  [ Connect LinkedIn →]  // Button links to /auth/linkedin
  
IF CONNECTED:
  ✓ LinkedIn Account
  👤 John Doe
  📧 john@company.com
  📊 18 followers · Last sync: 2 hours ago
  [ Disconnect ]  // Removes tokens, keeps post history
  [ Sync Now ]    // Manual refresh
```

### Dashboard Home: Account Status
```
[Status header at top]
  Claude Sonnet 4.6 · 87 generations left today · ✓ LinkedIn connected
  
  IF NOT CONNECTED:
    ⚠️ LinkedIn not connected
    [ Connect to enable scheduling ]
```

### Generator: Post with LinkedIn Account
```
[Generate draft] → [Pick variant] → [Schedule]

Schedule Modal:
  Which LinkedIn account?
  [▼ John Doe · john@company.com]
  
  When do you want to post?
  [📅 Pick date] [⏰ Pick time]
  
  [Cancel] [Confirm Schedule]
```

---

## 7. Error Handling & Edge Cases

### Case 1: Token Expired
- During publish, LinkedIn returns 401 (Unauthorized)
- App attempts refresh
- If refresh fails → mark post as failed, notify user: *"Please reconnect LinkedIn"*

### Case 2: User Revoked Access on LinkedIn
- Next API call returns 403 (Forbidden)
- Mark account as inactive
- Show: *"Your LinkedIn authorization was revoked. Reconnect to resume posting."*

### Case 3: Multiple LinkedIn Accounts
- User can connect multiple LinkedIn profiles (e.g., personal + company page)
- Each stored as separate row in `user_linkedin_accounts`
- User picks which account to post from (Settings → Manage Accounts)

### Case 4: Publish Rate Limit
- LinkedIn limits: ~5 posts/day per account
- If user tries to schedule 6th post, show: *"You've hit LinkedIn's daily limit. Try tomorrow."*

---

## 8. Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js, React | Already in place; OAuth redirect handled by next-auth or custom |
| **OAuth Provider** | LinkedIn OAuth 2.0 | Official, supported, no passwords stored |
| **Backend** | Supabase (PostgreSQL) | Already in place; encrypted columns for tokens |
| **API Calls** | Node-fetch or Axios | Simple HTTP clients for LinkedIn API |
| **Background Jobs** | Supabase Cron or external (Bull/Sidekiq) | Publish at scheduled times + daily analytics refresh |
| **Token Storage** | Supabase encrypted columns (pgcrypto) | Secure at rest, decrypted only in backend |
| **Session Management** | Supabase Auth (already using) | Tie LinkedIn account to PostPilot user |

---

## 9. API Rate Limits & Quotas

### LinkedIn API Quotas (as of 2025)
| Endpoint | Limit | Notes |
|----------|-------|-------|
| `/me` (profile) | 300/month | One call per user per sync |
| `/ugcPosts` (list) | 300/month | Fetches user's posts |
| `/{postId}/postMetrics` | 1,000/month | One per post per day = ~30/month per active user |
| `POST /posts` (publish) | Limited by LinkedIn tiers | Standard: 5/day; Partner tiers have higher |

**Implication:** Standard LinkedIn OAuth tier allows ~5 posts/day. For higher throughput, request Partner status.

---

## 10. Deployment Checklist

- [ ] Register app on LinkedIn Developers portal
- [ ] Get `CLIENT_ID` and `CLIENT_SECRET`
- [ ] Set redirect URI to `https://app.postpilot.io/auth/linkedin/callback`
- [ ] Request `openid`, `profile`, `email`, `w_member_social` scopes
- [ ] Deploy Supabase migration: `user_linkedin_accounts`, `linkedin_posts`, `scheduled_posts` tables
- [ ] Implement token encryption in Supabase (using pgcrypto or Vault)
- [ ] Deploy background job for scheduled publishing (Supabase Functions or external queue)
- [ ] Deploy daily analytics sync cron
- [ ] Add Settings UI for LinkedIn connection
- [ ] Add account-picker to Generator
- [ ] Test end-to-end: connect LinkedIn → generate post → schedule → publish → see metrics

---

## 11. Security Considerations

1. **Never log tokens** — Tokenize or hash in logs
2. **Encrypt at rest** — AES-256 for `access_token`, `refresh_token`
3. **HTTPS only** — All requests use TLS
4. **CSRF protection** — Validate `state` parameter in OAuth callback
5. **Rate limiting** — Throttle API calls to LinkedIn to avoid quota exhaustion
6. **Audit trail** — Log who published what and when (for compliance)
7. **User revocation** — Respect `is_active` flag; stop publishing if user disconnects

---

## Summary

**The Flow:**
1. User clicks **Connect LinkedIn** in Settings
2. OAuth redirect → LinkedIn authorization → token callback
3. Token stored encrypted in Supabase
4. On schedule, background job publishes post via LinkedIn API
5. Daily cron refreshes analytics for dashboard
6. Tokens auto-refresh before expiry

**Result:** Passwordless, secure, one-click LinkedIn integration.
