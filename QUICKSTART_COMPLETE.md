# PostPilot Quick Start Guide - Complete Setup

This guide takes you from zero to a fully functional, production-ready LinkedIn content creation platform in one go.

**What you're building:**
- 📝 LinkedIn post generator (AI-powered)
- 📅 Post scheduler (publish at exact times)
- 💳 Billing system with Stripe (Free/Starter/Pro/Agency plans)
- 🔐 OAuth2 authentication (LinkedIn & email)
- 📊 Usage tracking (1 post/week for free, unlimited for paid)
- 🎯 Upgrade popup when limits hit

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Setup (5 minutes)](#local-setup)
3. [Stripe Setup (10 minutes)](#stripe-setup)
4. [Environment Variables (2 minutes)](#environment-variables)
5. [Database Setup (5 minutes)](#database-setup)
6. [Testing (10 minutes)](#testing)
7. [Deploy to Production (10 minutes)](#deploy-to-production)

**Total time: ~45 minutes**

---

## Prerequisites

Before you start, make sure you have:

- **Node.js** 18+ installed (`node --version`)
- **Git** installed
- **Stripe account** (free, sign up at stripe.com)
- **Supabase project** (free tier is fine)
- **Claude API key** (from Anthropic)
- **GitHub/Vercel account** (for deployment)
- **LinkedIn OAuth app** (optional, for MVP)

### Install Node.js (if needed)

```bash
# macOS
brew install node

# Windows
# Download from nodejs.org

# Verify
node --version  # should be 18+
npm --version   # should be 9+
```

---

## Local Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd PostPilot

# Install dependencies
npm install

# Start development server
npm run dev

# Server should start at http://localhost:3000
```

### 2. Create Local Environment File

```bash
# Copy example to local
cp .env.example .env.local

# Edit .env.local (see Environment Variables section below)
```

### 3. Verify Setup

Open http://localhost:3000 in your browser. You should see the homepage.

---

## Stripe Setup

### 1. Create Stripe Account

1. Go to https://stripe.com (free account)
2. Sign up with your email
3. Verify email
4. Create company/business (any name works for testing)
5. Activate test mode (toggle in dashboard top-right)

### 2. Get API Keys

In Stripe Dashboard:

1. Go to **Developers** → **API Keys**
2. Copy **Publishable key** → save as `STRIPE_PUBLIC_KEY` in `.env.local`
3. Copy **Secret key** → save as `STRIPE_SECRET_KEY` in `.env.local`

**Example keys (test mode):**
```
pk_test_51Nl1F2Hu3cJ...
sk_test_51Nl1F2Hu3cJ...
```

### 3. Create Products & Prices

#### Product 1: Starter Plan

1. Go to **Products** → **+ Add Product**
2. Fill in:
   - **Name:** PostPilot Starter
   - **Description:** 50 posts per day
   - **Pricing:** $29 (Monthly, Recurring)
3. Click **Save Product**
4. Copy the **Price ID** from the pricing section
5. Save as `STRIPE_PRICE_STARTER` in `.env.local`

**Example:**
```
price_1Nl1F2Hu3cJPriceSTARTER
```

#### Product 2: Pro Plan

1. Go to **Products** → **+ Add Product**
2. Fill in:
   - **Name:** PostPilot Pro
   - **Description:** 500 posts per day
   - **Pricing:** $79 (Monthly, Recurring)
3. Save and copy price ID → `STRIPE_PRICE_PRO`

#### Product 3: Agency Plan

1. Go to **Products** → **+ Add Product**
2. Fill in:
   - **Name:** PostPilot Agency
   - **Description:** Unlimited posts
   - **Pricing:** $299 (Monthly, Recurring)
3. Save and copy price ID → `STRIPE_PRICE_AGENCY`

### 4. Create Webhook Endpoint

1. Go to **Developers** → **Webhooks**
2. Click **+ Add Endpoint**
3. For **local testing**, you need **Stripe CLI** (below)

**For local testing with Stripe CLI:**

```bash
# Install Stripe CLI (macOS)
brew install stripe/stripe-cli/stripe

# (Windows: download from https://stripe.com/docs/stripe-cli)

# Login
stripe login

# Start listening for webhooks
stripe listen --forward-to localhost:3000/api/billing/webhook

# Copy the signing secret (looks like: whsec_test_...)
# Save as STRIPE_WEBHOOK_SECRET in .env.local
```

**For production (after deployment):**

1. After deploying to Vercel, go to **Developers** → **Webhooks**
2. Click **+ Add Endpoint**
3. **Endpoint URL:** `https://your-domain.com/api/billing/webhook`
4. **Select events:**
   - `checkout.session.completed`
   - `customer.subscription.deleted`
5. Copy signing secret → `STRIPE_WEBHOOK_SECRET`

---

## Environment Variables

### Step 1: Copy Template

```bash
cp .env.example .env.local
```

### Step 2: Fill In Variables

Edit `.env.local` and fill in:

```env
# ─────────────────────────────────────────────────────────────────
# Supabase (from your Supabase project)
# ─────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ─────────────────────────────────────────────────────────────────
# Stripe (from your Stripe dashboard)
# ─────────────────────────────────────────────────────────────────
STRIPE_PUBLIC_KEY=pk_test_51Nl1F2Hu3cJ...
STRIPE_SECRET_KEY=sk_test_51Nl1F2Hu3cJ...
STRIPE_WEBHOOK_SECRET=whsec_test_...
STRIPE_PRICE_STARTER=price_1Nl1F2Hu3cJ...
STRIPE_PRICE_PRO=price_1Nl1F2Hu3cJ...
STRIPE_PRICE_AGENCY=price_1Nl1F2Hu3cJ...

# ─────────────────────────────────────────────────────────────────
# AI (Claude API)
# ─────────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY=sk-ant-v0-...

# ─────────────────────────────────────────────────────────────────
# Application URLs
# ─────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ─────────────────────────────────────────────────────────────────
# Cron Secret (for scheduled publishing)
# ─────────────────────────────────────────────────────────────────
CRON_SECRET=super-secret-random-string-openssl-rand-base64-32
```

### Step 3: Get Missing Values

**Supabase Keys:**
1. Go to https://supabase.com
2. Open your project
3. Go to **Settings** → **API**
4. Copy **Project URL** and **Anon Key**

**Anthropic API Key:**
1. Go to https://console.anthropic.com
2. Click **Create API Key**
3. Copy and save (keep it secret!)

---

## Database Setup

The database migrations are already included in the repo. When you deploy:

1. **Locally:** Run `supabase db push` (if you have Supabase CLI installed)
2. **On Vercel:** Migrations run automatically on deployment

### Verify Database Schema

In Supabase Dashboard → SQL Editor, run:

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Should include:
-- - profiles
-- - generated_posts
-- - scheduled_posts_v2
-- - user_linkedin_accounts
-- - billing_usage
-- ... and more
```

---

## Testing

### Test 1: User Signup & Login

1. Open http://localhost:3000
2. Click **Sign up**
3. Enter email and password
4. Create account
5. Should redirect to dashboard

**Expected result:** ✅ Account created and logged in

### Test 2: Generate Posts (Free Plan - 1 post/week limit)

1. Go to **Dashboard** → **Content Generator**
2. Enter a topic (e.g., "5 tips for LinkedIn growth")
3. Click **Generate posts**
4. **Expected:** 1 post is generated

**Verify free limit:**
1. Try to click **Generate posts** again
2. **Expected:** UpgradeModal appears saying "You've reached your limit"

### Test 3: Upgrade to Pro Plan

1. In the UpgradeModal, click **"Upgrade to pro"**
2. Should redirect to Stripe checkout
3. Use test card: `4242 4242 4242 4242`
4. Email: use your test email
5. Expiry: any future date
6. CVC: any 3 digits
7. Click **Pay**
8. **Expected:** Redirected back to `/dashboard/settings?upgraded=1`

**Verify upgrade:**
1. Settings page should show **"Pro plan"**
2. Go back to generator
3. Should be able to generate more posts (no 1/week limit)

### Test 4: Schedule Post

1. Go to **Content Generator**
2. Generate a post
3. Click **"Schedule post"** on any post
4. Fill in:
   - Date: tomorrow
   - Time: any time
   - LinkedIn account: (if connected)
5. Click **"Confirm schedule"**
6. **Expected:** Success message "Scheduled for..."

### Test 5: Check Settings

1. Go to **Settings**
2. Should show:
   - Account info
   - LinkedIn connection status
   - **Pro plan** (if upgraded)
3. Try to change name and click **"Save changes"**
4. **Expected:** Settings saved successfully

---

## Deploy to Production

### Step 1: Commit Changes

```bash
# See what changed
git status

# Add all files
git add -A

# Commit with message
git commit -m "Add complete billing system with Stripe integration"

# Push to GitHub
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com (sign in with GitHub)
2. Click **+ New Project**
3. Select your GitHub repo
4. Vercel auto-detects it's a Next.js app ✅
5. Click **Deploy**
6. Wait for deployment (~2 minutes)
7. Copy your production URL (e.g., `https://postpilot-abc123.vercel.app`)

### Step 3: Add Environment Variables to Vercel

1. After deployment, go to **Settings** → **Environment Variables**
2. Add all variables from `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
STRIPE_PUBLIC_KEY=pk_live_... (use live keys, not test!)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_AGENCY=price_...
ANTHROPIC_API_KEY=...
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
CRON_SECRET=...
```

3. Click **Save**
4. Trigger a redeploy

### Step 4: Configure Stripe Webhook for Production

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **+ Add Endpoint**
3. **Endpoint URL:** `https://your-domain.vercel.app/api/billing/webhook`
4. **Select events:**
   - `checkout.session.completed`
   - `customer.subscription.deleted`
5. Copy **Signing secret** → Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

### Step 5: Update LinkedIn OAuth (if using)

1. Go to LinkedIn Developer Portal
2. Update redirect URIs:
   - Remove: `http://localhost:3000/auth/callback`
   - Add: `https://your-domain.vercel.app/auth/callback`

### Step 6: Update Success/Cancel URLs

In `app/api/billing/upgrade/route.ts`, make sure:

```typescript
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
// This should be your Vercel URL from environment variables
```

### Step 7: Test Production

1. Go to your production URL
2. Sign up with a new email
3. Try to generate 2 posts (should hit limit)
4. Upgrade to Pro using a **real credit card** (or test card if Stripe allows)
5. Verify webhook fires (check Stripe Dashboard → Webhooks → Recent deliveries)
6. Verify plan updated in Supabase (check `profiles` table)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  (Next.js, React, TailwindCSS)                             │
│  - Content Generator                                        │
│  - Settings & Billing                                       │
│  - UpgradeModal (on limit)                                  │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Routes                              │
│  - /api/generate-content (with rate limit check)            │
│  - /api/posts/schedule                                      │
│  - /api/cron/publish-scheduled (every 5 min)               │
│  - /api/billing/upgrade (Stripe checkout)                   │
│  - /api/billing/webhook (Stripe → update plan)              │
└──────────────────┬──────────────────────────────────────────┘
                   │
      ┌────────────┼────────────┐
      ▼            ▼            ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Supabase │  │  Stripe  │  │  Claude  │
│ (Data)   │  │(Payments)│  │ (AI)     │
└──────────┘  └──────────┘  └──────────┘
```

### Data Flow: Generate Post

```
User types topic
    ↓
Frontend: POST /api/generate-content
    ↓
Backend: Check rate limit (getGenerationUsage)
    ├─ Free user? Check weekly usage
    └─ If ≥1 post → Return 429 with usage info
    ↓
Frontend: Show UpgradeModal
    ↓
User clicks "Upgrade to Pro"
    ↓
Frontend: POST /api/billing/upgrade with plan
    ↓
Backend: Create Stripe checkout session
    ↓
Frontend: Redirect to Stripe
    ↓
User pays
    ↓
Stripe → Webhook: checkout.session.completed
    ↓
Backend: Update profiles.subscription_plan = "pro"
    ↓
User redirected to /dashboard/settings?upgraded=1
    ↓
User can now generate unlimited posts
```

---

## Troubleshooting

### "Cannot find module" errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Stripe checkout shows blank page

1. Check `STRIPE_PUBLIC_KEY` in `.env.local`
2. Check `STRIPE_PRICE_PRO` etc. are valid price IDs
3. Check Stripe Dashboard → Products (prices exist)

### Webhook not firing

1. Running Stripe CLI? `stripe listen --forward-to localhost:3000/api/billing/webhook`
2. Using test card? `4242 4242 4242 4242`
3. Check Stripe Dashboard → Webhooks → Recent deliveries

### Rate limit not enforced

1. Verify `profiles.subscription_plan = "free"` in Supabase
2. Check that 1 post was already generated this week
3. Hard refresh browser (Cmd+Shift+Delete)

---

## Files Modified/Created

| File | Purpose |
|------|---------|
| `lib/rate-limit.ts` | Weekly limits for free, daily for paid |
| `components/Billing/UpgradeModal.tsx` | Upgrade popup when limit hit |
| `app/dashboard/settings/page.tsx` | Billing settings & upgrade buttons |
| `app/api/billing/upgrade/route.ts` | Stripe checkout (already exists) |
| `app/api/billing/webhook/route.ts` | Webhook to update plan (already exists) |
| `vercel.json` | Cron schedule (every 5 minutes) |
| `.env.example` | Environment variables template |
| `BILLING_SYSTEM.md` | Complete billing documentation |
| `SCHEDULING_SYSTEM.md` | LinkedIn publishing schedule docs |

---

## Next Steps

After this setup, you can:

1. **Add LinkedIn OAuth:** Users connect their LinkedIn accounts in Settings
2. **Add Email Notifications:** Send welcome emails on signup
3. **Add Analytics Dashboard:** Show post performance metrics
4. **Add Team Collaboration:** Pro plan feature for multiple users
5. **Add Content Templates:** Pre-made post templates
6. **Add Competitor Analysis:** Analyze similar accounts

---

## Support & Resources

- **Stripe Docs:** https://stripe.com/docs
- **Stripe Test Cards:** https://stripe.com/docs/testing
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Claude API:** https://anthropic.com/docs

---

## Estimated Costs

### Free Tier (Development)

- Supabase: $0 (free tier)
- Stripe: $0 (no charges for test payments)
- Claude API: $0-20/month (depending on usage)
- Vercel: $0 (free for personal projects)

**Total: ~$0-20/month**

### After Launch (Production)

- Supabase: $25-100/month (depending on storage/bandwidth)
- Stripe: 2.9% + $0.30 per transaction
- Claude API: $0.003 per 1K input, $0.015 per 1K output tokens
- Vercel: $20/month (Pro plan) or $100+/month (Enterprise)

**Total: ~$100-300/month** (depends on traffic)

---

## Checklist: Ready for Production?

- [ ] All environment variables set in Vercel
- [ ] Stripe products created with correct prices
- [ ] Stripe webhook registered with production URL
- [ ] Database migrations applied
- [ ] Authentication works (signup/login)
- [ ] Free plan limits enforced (1 post/week)
- [ ] Upgrade modal appears when limit hit
- [ ] Stripe checkout redirects correctly
- [ ] Webhook fires on successful payment
- [ ] Plan updates in database
- [ ] User can generate posts after upgrade
- [ ] Scheduling works (publishes within 5 minutes)
- [ ] Settings page shows correct plan
- [ ] CRON secret configured for scheduled publishing

**Once all ✅, you're ready to launch!**

---

## Questions?

Refer to:
- `BILLING_SYSTEM.md` for payment questions
- `SCHEDULING_SYSTEM.md` for LinkedIn publishing questions
- `SCHEDULING_FIXES.md` for cron/scheduling details
- GitHub Issues for bug reports
