# 🚀 PostPilot - Next Steps (What to Do Now)

**Status:** ✅ Code is 100% ready. Now you need to configure Stripe.

---

## ⏱️ Time Required: 10 Minutes

This is what takes time:
- Creating Stripe account: 2 min
- Getting API keys: 1 min
- Creating 3 products: 5 min
- Setting up environment: 1 min
- Testing: 1 min

---

## 📋 Complete Checklist

### 1. ✅ Read Documentation
- [x] Review `PAYMENT_FLOW_COMPLETE.md` (shows how payment works)
- [x] Review `STRIPE_SETUP_QUICK.md` (step-by-step Stripe setup)

**Time: 2 minutes**

---

### 2. 🔧 Setup Stripe (5 minutes)

#### 2a. Create Stripe Account
1. Go to https://stripe.com
2. Click "Sign up"
3. Create account with any email
4. Complete the onboarding

#### 2b. Get Test API Keys
1. Dashboard → Developers → API Keys (top-right corner)
2. Make sure you see **"Test"** mode toggle (toggle if needed)
3. Copy **Publishable Key** (starts with `pk_test_`)
4. Copy **Secret Key** (starts with `sk_test_`)

#### 2c. Create 3 Products
Repeat this 3 times for Starter, Pro, and Agency:

1. Dashboard → Products → **+ Add Product**
2. Fill in:
   - Name: `PostPilot [PLAN]` (e.g., "PostPilot Pro")
   - Price: `[AMOUNT]` (e.g., "$79.00")
   - Billing period: **Monthly**
3. Click "Save Product"
4. Copy the **Price ID** (looks like `price_1234abc...`)

**Product Details:**
| Plan | Price | Price ID |
|------|-------|----------|
| **Starter** | $29/month | `price_...` |
| **Pro** | $79/month | `price_...` |
| **Agency** | $299/month | `price_...` |

---

### 3. 📝 Update `.env.local` (1 minute)

Open `.env.local` in your project and add:

```env
STRIPE_PUBLIC_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_PRICE_STARTER=price_1234abc...
STRIPE_PRICE_PRO=price_5678def...
STRIPE_PRICE_AGENCY=price_9101ghi...
```

**Important:** Replace the placeholder values with your actual keys and price IDs from Stripe.

---

### 4. 🔄 Restart Dev Server (1 minute)

```bash
npm run dev
```

**Important:** Must restart for new environment variables to load.

---

### 5. 🧪 Test the Payment Flow (1 minute)

1. **Go to Settings:** http://localhost:3000/dashboard/settings
2. **Look for upgrade buttons** (only shows if you're on Free plan)
3. **Click "Upgrade to Pro"**
4. **Should redirect to Stripe checkout** (white page asking for card)
5. **Use test card:**
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
6. **Click "Pay"**
7. **Should redirect back to Settings**
8. **Should show success message:** "🎉 Welcome to your new plan!"
9. **Profile should now show:** "Pro plan"

---

## 🎯 What Happens After Setup

### Free User Tries to Generate
1. Clicks "Generate" button
2. Can only generate 1 post per week
3. After 1 post, gets popup: "You've hit your weekly limit"
4. Popup shows 3 plan options (Starter, Pro, Agency)
5. User clicks a plan
6. Redirects to Stripe checkout
7. User pays
8. Profile updates to Pro
9. User can now generate 500 posts per day

### Pro User Features
- ✅ Generate 500 posts per day
- ✅ Schedule posts at exact time
- ✅ Connect multiple LinkedIn accounts
- ✅ Advanced analytics (visible in Analytics page)
- ✅ Team collaboration

---

## ✅ Final Checklist

- [ ] Created Stripe account
- [ ] Got API keys (Publishable & Secret)
- [ ] Created 3 products with Price IDs
- [ ] Updated `.env.local` with all 5 variables
- [ ] Restarted dev server (`npm run dev`)
- [ ] Tested upgrade flow (clicked button → Stripe → payment → success)
- [ ] Verified profile shows "Pro plan" after payment
- [ ] Verified Pro features unlock (generation limit increases)

---

## 🚀 You're Done When

✅ All items in checklist above are complete

---

## 📞 Troubleshooting

### Issue: Upgrade button not clickable
- **Check:** Are you on Free plan? (Should show buttons only for free users)
- **Check:** Did you restart dev server after updating `.env.local`?
- **Check:** Are your Stripe keys correct?

### Issue: Button clickable but nothing happens
- **Check:** Open browser console (F12)
- **Check:** Look for error messages
- **Common error:** "STRIPE_SECRET_KEY is not set" → env variable not loaded
- **Fix:** Restart dev server

### Issue: Redirects to Stripe but payment fails
- **Check:** Using test card `4242 4242 4242 4242`?
- **Check:** Expiry date in future?
- **Check:** In Stripe **Test Mode** (not Live)?

### Issue: Payment succeeds but profile not updating
- **Check:** Check browser console for errors
- **Possible cause:** Webhook not configured
- **Current status:** Works locally without webhook setup
- **Production:** Will need webhook for auto-updates (guides provided)

---

## 📚 Files to Reference

| File | Purpose |
|------|---------|
| `STRIPE_SETUP_QUICK.md` | Step-by-step Stripe setup guide |
| `PAYMENT_FLOW_COMPLETE.md` | How the payment flow works (read for understanding) |
| `README.md` | Project overview and features |
| `.env.example` | Example environment variables |

---

## 🎉 After Everything Works

1. Test with real card (in Live mode, not Test)
2. Monitor Stripe dashboard for payments
3. Users can now upgrade to Pro/Agency plans
4. Post generation limits work correctly
5. Scheduled posts publish every 5 minutes
6. LinkedIn integration working with multiple accounts

---

## 🔐 Security

- ✅ All payment processing by Stripe (secure)
- ✅ No credit card data stored locally
- ✅ API keys stored in `.env.local` (not in git)
- ✅ Environment variables never exposed to frontend
- ✅ Webhook signature verified (when set up)

---

## 💡 Remember

- Use **Test Mode** for development
- Use **Live Mode** only when going to production
- Test cards don't charge real money
- You can refund test payments in Stripe
- Check Stripe dashboard for payment history

---

**Questions?** Check `STRIPE_SETUP_QUICK.md` or `PAYMENT_FLOW_COMPLETE.md` for detailed guides.

**Ready to start?** Go create your Stripe account! 🚀

