# 🔥 Stripe Setup - Quick Start (5 Minutes)

## Step 1: Create Stripe Account
1. Go to https://stripe.com
2. Click "Sign up"
3. Fill in email and password
4. Click "Let's start"

## Step 2: Get Test API Keys
1. Go to Dashboard → Developers → API Keys
2. Make sure you're in **Test Mode** (toggle in top-right)
3. Copy **Publishable Key** (starts with `pk_test_`)
4. Copy **Secret Key** (starts with `sk_test_`)

## Step 3: Create Products & Prices

### Product 1: Starter
1. Go to Dashboard → Products → + Add Product
2. Name: `PostPilot Starter`
3. Price: `$29.00` (Recurring Monthly)
4. Click "Save Product"
5. Copy the **Price ID** from the pricing section
6. Add to `.env.local`: `STRIPE_PRICE_STARTER=price_...`

### Product 2: Pro  
1. Go to Products → + Add Product
2. Name: `PostPilot Pro`
3. Price: `$79.00` (Recurring Monthly)
4. Click "Save Product"
5. Copy the **Price ID**
6. Add to `.env.local`: `STRIPE_PRICE_PRO=price_...`

### Product 3: Agency
1. Go to Products → + Add Product
2. Name: `PostPilot Agency`
3. Price: `$299.00` (Recurring Monthly)
4. Click "Save Product"
5. Copy the **Price ID**
6. Add to `.env.local`: `STRIPE_PRICE_AGENCY=price_...`

## Step 4: Update .env.local

Add these to your `.env.local`:

```env
STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PRICE_STARTER=price_YOUR_PRICE_ID
STRIPE_PRICE_PRO=price_YOUR_PRICE_ID
STRIPE_PRICE_AGENCY=price_YOUR_PRICE_ID
STRIPE_WEBHOOK_SECRET=whsec_test_YOUR_SECRET (get from webhooks later)
```

## Step 5: Set Up Webhook (Optional for testing)

1. Go to Developers → Webhooks
2. Click "+ Add endpoint"
3. URL: `http://localhost:3000/api/billing/webhook`
4. Select events: `checkout.session.completed`, `customer.subscription.deleted`
5. Copy the **Signing Secret**
6. Add to `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_...`

## Step 6: Test the Flow

1. **Restart dev server:**
   ```bash
   npm run dev
   ```

2. **Go to Settings page:**
   - http://localhost:3000/dashboard/settings

3. **Click "Upgrade to Pro" button**
   - Should redirect to Stripe Checkout

4. **Use test card:**
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - Email: Your test email

5. **Click "Pay"**
   - Should process payment (test mode = no real charge)
   - Should redirect back to settings
   - Profile should show "Pro plan"

## ✅ Success Indicators

- [x] Upgrade buttons clickable in Settings
- [x] Redirects to Stripe checkout
- [x] Can enter test card details
- [x] Payment processes
- [x] Redirects back to Settings
- [x] Profile shows "Pro plan"

## 🔧 Test Cards for Stripe

| Card | Expires | CVC | Result |
|------|---------|-----|--------|
| 4242 4242 4242 4242 | Any future | Any 3 | Success |
| 4000 0000 0000 0002 | Any future | Any 3 | Declined |
| 4000 0025 0000 3155 | Any future | Any 3 | 3D Secure |

## 💡 If Still Not Working

1. **Check console logs:** F12 → Console
2. **Check network tab:** F12 → Network → Click upgrade button
3. **Verify env vars loaded:** Check if keys show in console errors
4. **Restart dev server** after updating `.env.local`
5. **Clear browser cache:** Ctrl+Shift+Delete

---

**That's it! Your upgrade flow should now work perfectly.** 🚀

