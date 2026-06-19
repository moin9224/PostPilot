# PostPilot Billing & Subscription System

## Overview

Complete billing system with Stripe integration, plan management, and usage limits.

**Features:**
- ✅ Free plan: 1 post per week
- ✅ Paid plans: Starter ($29), Pro ($79), Agency ($299)
- ✅ Stripe checkout integration
- ✅ Automatic plan upgrades via webhooks
- ✅ Usage tracking and limit enforcement
- ✅ Upgrade modal on limit exceeded

---

## Architecture

### 1. **Usage Tracking System**

**File:** `lib/rate-limit.ts`

#### Plan Limits
```typescript
const GENERATION_LIMITS: Record<SubscriptionPlan, { limit: number | null; period: "week" | "day" }> = {
  free: { limit: 1, period: "week" },    // 1 post per week
  starter: { limit: 50, period: "day" }, // 50 posts per day
  pro: { limit: 500, period: "day" },    // 500 posts per day
  agency: { limit: null, period: "day" }, // unlimited
};
```

#### How It Works
1. **Free users:** Limited to 1 post per **week** (Monday–Sunday UTC)
2. **Paid users:** Limited by daily quota (resets at midnight UTC)
3. **Unlimited plan:** No limits

#### Getting Usage
```typescript
// In any API route
const usage = await getGenerationUsage(supabase, userId, plan);
// Returns: { plan, used, limit, remaining, period, nextResetAt }
```

#### Enforcing Limits
```typescript
// Throws 429 error if limit exceeded
assertWithinLimit(usage, 1); // request 1 post
```

---

### 2. **Upgrade Popup Flow**

**File:** `components/Billing/UpgradeModal.tsx`

When a free user hits the 1-post-per-week limit:

1. **User clicks "Generate posts"**
2. **API returns 429 error** with usage info
3. **Frontend shows UpgradeModal** with plan options
4. **User selects plan** → Redirects to Stripe checkout
5. **Payment completes** → Webhook updates subscription
6. **User is upgraded** and can generate more posts

### 3. **Payment Flow**

#### Step 1: User Clicks Upgrade
```javascript
// Frontend sends plan choice
POST /api/billing/upgrade
{ "plan": "pro" }
```

#### Step 2: Stripe Checkout Created
```typescript
// Backend (app/api/billing/upgrade/route.ts)
const session = await stripe.checkout.sessions.create({
  mode: "subscription",
  line_items: [{ price: stripePriceFor("pro"), quantity: 1 }],
  customer: profile?.stripe_customer_id,
  customer_email: user.email,
  success_url: "/dashboard/settings?upgraded=1",
  cancel_url: "/dashboard/settings?canceled=1",
});
// Returns checkout URL
```

#### Step 3: User Pays on Stripe
- Redirects to Stripe Hosted Checkout
- User enters card details
- Stripe confirms payment

#### Step 4: Webhook Updates Database
```typescript
// Stripe webhook (app/api/billing/webhook/route.ts)
// On checkout.session.completed:
await profiles.update({
  subscription_plan: "pro",
  subscription_started_at: now(),
  stripe_customer_id: customerId,
});
```

#### Step 5: User Redirected Back
- Shows success notification
- Full access to paid features
- Can generate unlimited posts (for selected plan)

---

## Setup Instructions

### 1. Create Stripe Account

1. Go to https://stripe.com/docs/testing
2. Use test mode credentials:
   ```
   Public Key: pk_test_...
   Secret Key: sk_test_...
   ```

### 2. Configure Environment Variables

Create/update `.env.local`:

```env
# Stripe API Keys
STRIPE_PUBLIC_KEY=pk_test_YOUR_PUBLIC_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_test_YOUR_WEBHOOK_SECRET

# Plan Prices (get from Stripe Dashboard → Products)
STRIPE_PRICE_STARTER=price_test_starter
STRIPE_PRICE_PRO=price_test_pro
STRIPE_PRICE_AGENCY=price_test_agency

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000 # or https://yourdomain.com
```

### 3. Create Stripe Products & Prices

In Stripe Dashboard:

**Product 1: Starter Plan**
- Name: "PostPilot Starter"
- Price: $29/month (recurring)
- Save price ID → `STRIPE_PRICE_STARTER`

**Product 2: Pro Plan**
- Name: "PostPilot Pro"
- Price: $79/month (recurring)
- Save price ID → `STRIPE_PRICE_PRO`

**Product 3: Agency Plan**
- Name: "PostPilot Agency"
- Price: $299/month (recurring)
- Save price ID → `STRIPE_PRICE_AGENCY`

### 4. Set Up Webhook

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/billing/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
4. Copy webhook secret → `STRIPE_WEBHOOK_SECRET`

### 5. Deploy to Production

```bash
# Commit changes
git add -A
git commit -m "Add billing system with Stripe integration"
git push origin main

# Update environment variables on Vercel
# Dashboard → Settings → Environment Variables
# Add all STRIPE_* variables above
```

---

## Testing

### Test With Stripe Test Cards

Use these cards in the Stripe checkout (test mode only):

| Card | Expires | CVC | Result |
|------|---------|-----|--------|
| 4242 4242 4242 4242 | Any future | Any 3 digits | Success |
| 4000 0000 0000 0002 | Any future | Any 3 digits | Declined |
| 4000 0025 0000 3155 | Any future | Any 3 digits | Requires 3D Secure |

### Local Testing Flow

1. **Create a free account**
   ```
   Email: test@example.com
   Password: anything
   ```

2. **Try to generate 2nd post**
   - Click "Generate posts"
   - Should show UpgradeModal after 1st post

3. **Click "Upgrade to pro"**
   - Redirects to Stripe checkout
   - Use test card: `4242 4242 4242 4242`
   - Email: `test@example.com`
   - Any future expiry, any 3-digit CVC

4. **Payment success**
   - Redirected back to `/dashboard/settings?upgraded=1`
   - Shows success notification
   - Plan updated to "Pro"
   - Now can generate 500 posts/day

5. **Verify upgrade**
   - Dashboard shows "Pro plan"
   - Try generating posts → should work

### Testing Webhook Locally

Use Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI (macOS)
brew install stripe/stripe-cli/stripe

# (Windows/Linux - see https://stripe.com/docs/stripe-cli)

# Login to your Stripe account
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/billing/webhook

# Get webhook signing secret
stripe listen # shows: whsec_test_...
# Add to .env.local: STRIPE_WEBHOOK_SECRET=whsec_test_...

# In another terminal, trigger a test webhook
stripe trigger checkout.session.completed \
  --add checkout_session.metadata.user_id=550e8400-e29b-41d4-a716-446655440000 \
  --add checkout_session.metadata.plan=pro
```

---

## API Endpoints

### GET /api/billing/subscription
Get current subscription info.

**Response:**
```json
{
  "plan": "free",
  "price": 0,
  "startedAt": "2026-06-01T00:00:00Z",
  "hasPaymentMethod": false
}
```

### POST /api/billing/upgrade
Start Stripe checkout for a plan.

**Request:**
```json
{ "plan": "pro" }
```

**Response:**
```json
{ "checkoutUrl": "https://checkout.stripe.com/..." }
```

### POST /api/billing/webhook
Stripe webhook (automatic).

**Handles:**
- `checkout.session.completed` → Update plan
- `customer.subscription.deleted` → Downgrade to free

---

## Database Schema

### profiles table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  subscription_plan TEXT DEFAULT 'free'
    CHECK (subscription_plan IN ('free', 'starter', 'pro', 'agency')),
  subscription_started_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ
);
```

### generated_posts table (for usage tracking)
```sql
CREATE TABLE generated_posts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  ai_generated BOOLEAN DEFAULT true,
  -- ... other fields
);
```

---

## Features by Plan

| Feature | Free | Starter | Pro | Agency |
|---------|------|---------|-----|--------|
| **Price** | Free | $29/mo | $79/mo | $299/mo |
| **Posts/Week** | 1 | Unlimited | Unlimited | Unlimited |
| **Posts/Day Limit** | 7 (1/week) | 50 | 500 | Unlimited |
| **LinkedIn Scheduling** | ✓ | ✓ | ✓ | ✓ |
| **Content Generator** | Limited | ✓ | ✓ | ✓ |
| **Analytics** | ✗ | ✓ | ✓ | ✓ |
| **Team Collaboration** | ✗ | ✗ | ✓ | ✓ |
| **Priority Support** | ✗ | ✗ | ✗ | ✓ |

---

## Error Handling

### 429 Too Many Requests (Limit Exceeded)

When free user hits limit:

```json
{
  "error": "Limit reached: 1 post per week on the free plan. Upgrade to generate more.",
  "usage": {
    "plan": "free",
    "used": 1,
    "limit": 1,
    "remaining": 0,
    "period": "week",
    "nextResetAt": "2026-06-23T00:00:00Z"
  }
}
```

**Frontend shows:** UpgradeModal with plan options

### Stripe Errors

**Missing configuration:**
```json
{ "error": "STRIPE_SECRET_KEY is not configured." }
```

**Invalid plan:**
```json
{ "error": "No Stripe price configured for pro." }
```

**Checkout failed:**
```json
{ "error": "Could not create checkout session" }
```

---

## Monitoring & Debugging

### Check User Plan

```bash
# In Supabase SQL Editor
SELECT id, email, subscription_plan, subscription_started_at, stripe_customer_id
FROM profiles
WHERE email = 'user@example.com';
```

### Check Usage

```typescript
// Check how many posts a user generated this week
const { count } = await supabase
  .from("generated_posts")
  .select("id", { count: "exact" })
  .eq("user_id", userId)
  .gte("created_at", startOfWeek.toISOString())
  .lt("created_at", endOfWeek.toISOString());
```

### View Stripe Events

```bash
# List recent Stripe events
stripe events list --limit 10

# Get specific webhook attempts
stripe logs list
```

### Check Webhook Logs

In Vercel Dashboard:
1. Go to Functions
2. Click `/api/billing/webhook`
3. View invocation logs and errors

---

## Troubleshooting

### User Can't Upgrade

1. **Check:** Environment variables are set in Vercel
2. **Check:** Stripe products/prices are created
3. **Check:** `STRIPE_PRICE_PRO` matches actual price ID
4. **Solution:** 
   ```bash
   # Vercel Dashboard → Settings → Environment Variables
   # Make sure all STRIPE_* variables are set
   ```

### Webhook Not Triggering

1. **Check:** `STRIPE_WEBHOOK_SECRET` is correct
2. **Check:** Webhook endpoint is registered in Stripe Dashboard
3. **Check:** Endpoint URL is exactly: `https://yourdomain.com/api/billing/webhook`
4. **Solution:** Delete and re-add the webhook endpoint

### Plan Not Updated After Payment

1. **Check:** Webhook received the event (Stripe Dashboard → Webhooks → Recent deliveries)
2. **Check:** Database has `stripe_customer_id` set
3. **Check:** Metadata includes `user_id` in checkout session
4. **Solution:**
   ```typescript
   // Manually trigger webhook (local testing only)
   stripe trigger checkout.session.completed --add metadata.user_id=<uuid>
   ```

### Usage Limit Not Enforced

1. **Check:** User is on free plan
2. **Check:** They've already generated 1 post this week
3. **Check:** Browser doesn't have cached response
4. **Solution:**
   ```bash
   # Hard refresh in browser
   Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
   ```

---

## Production Checklist

- [ ] Stripe account created and verified
- [ ] All environment variables set in Vercel
- [ ] Stripe products created with correct prices
- [ ] Webhook endpoint registered and verified
- [ ] Test payment flow with real card (if allowed by Stripe)
- [ ] Email notifications set up (optional: send receipt)
- [ ] Downgrade handling tested (customer.subscription.deleted)
- [ ] Rate limiting tested with free account
- [ ] Upgrade modal tested on all devices
- [ ] Stripe documentation reviewed for production best practices

---

## Future Enhancements

1. **Invoicing:** Generate and email PDF invoices
2. **Dunning:** Handle failed payments with retry logic
3. **Usage analytics:** Dashboard showing usage trends
4. **Seat management:** Allow upgrading seat count in Agency plan
5. **Annual billing:** Offer 20% discount for annual plans
6. **Coupon codes:** Support promotional discounts
7. **Free trial:** 7-day trial before requiring payment
8. **Usage alerts:** Email when approaching limit

---

## Support

For Stripe integration issues:
1. Check [Stripe API docs](https://stripe.com/docs/api)
2. Review [webhook events](https://stripe.com/docs/api/events)
3. Check [test mode cards](https://stripe.com/docs/testing)
4. See Vercel logs in Functions tab

For product questions:
- Check [implementation notes](#setup-instructions)
- Review [test flow](#testing)
- Verify [environment variables](#2-configure-environment-variables)
