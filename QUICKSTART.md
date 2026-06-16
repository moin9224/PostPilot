# PostPilot - Quick Start Guide

## 🎉 What's Ready

✅ **Database** - All 12 tables created with RLS policies
✅ **Authentication Routes** - Login/Signup API endpoints ready
✅ **Landing Page** - Beautiful homepage with pricing & features
✅ **Auth Pages** - Sign in/Sign up pages built
✅ **OAuth Setup** - Google & LinkedIn OAuth support configured
✅ **Environment Files** - `.env.example` and `.env.local` ready

---

## 🚀 Get Started in 5 Minutes

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Fill in Environment Variables**
Edit `.env.local` and add:

**Supabase (you have this already):**
```
NEXT_PUBLIC_SUPABASE_URL=https://wtclqesciegukfmdokrv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Add Your Anthropic API Key:**
- Get it from: https://console.anthropic.com
```
ANTHROPIC_API_KEY=sk-ant-your_key_here
```

**Optional OAuth (for later):**
- Google & LinkedIn setup takes 15 min each
- See `AUTH_SETUP.md` for detailed steps

### 3. **Get Service Role Key from Supabase**
1. Go to https://app.supabase.com → Select "post" project
2. Settings → API
3. Copy **Service role key**
4. Paste in `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`

### 4. **Start the App**
```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 📝 Test the Features

### Landing Page ✅
- Click **"Get started"** or **"Sign in"**
- See pricing, features, testimonials

### Sign Up ✅
1. Go to http://localhost:3000/auth/signup
2. Enter email, password, name
3. Click **"Create account"**
4. Get redirected to `/dashboard`
5. New profile auto-created in database ✓

### Sign In ✅
1. Go to http://localhost:3000/auth/login
2. Enter email & password
3. Click **"Sign in"**
4. Get redirected to `/dashboard` ✓

### Dashboard (basic) ✅
- Page exists at `/dashboard`
- Shows your profile info
- Protected by auth middleware

---

## 🔗 Add OAuth (Optional, 15 min each)

### Quick Setup
1. **Google OAuth** → See `AUTH_SETUP.md` Step 2
2. **LinkedIn OAuth** → See `AUTH_SETUP.md` Step 3
3. Fill in `.env.local` with credentials
4. Refresh app - buttons will appear on login page

---

## 📂 Project Structure

```
PostPilot/
├── app/
│   ├── auth/               # Auth pages & callbacks
│   │   ├── login/
│   │   ├── signup/
│   │   └── callback/
│   ├── api/
│   │   └── auth/           # Auth API routes
│   │       ├── signup
│   │       ├── login
│   │       └── me
│   ├── dashboard/          # Protected routes (after login)
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   ├── AuthForm.tsx        # Sign in/up form (now functional!)
│   └── Common/             # Reusable UI components
├── lib/
│   ├── supabase.ts         # Client-side Supabase
│   ├── supabase-server.ts  # Server-side Supabase
│   ├── api.ts              # API helpers
│   └── utils.ts            # Utilities
├── supabase/
│   └── schema.sql          # Database schema (deployed ✓)
├── .env.local              # Environment variables (for dev)
├── AUTH_SETUP.md           # Detailed OAuth setup guide
└── BACKEND.md              # API documentation
```

---

## 🎯 What's Next

### Immediate (1 hour)
- [ ] Run `npm run dev`
- [ ] Test sign up/sign in with email
- [ ] Check dashboard loads after login
- [ ] Verify data in Supabase (Table Editor)

### Short Term (1-2 hours)
- [ ] Set up Google OAuth (optional)
- [ ] Set up LinkedIn OAuth (optional)
- [ ] Build content generator page
- [ ] Integrate Claude API for post generation

### Medium Term (half day)
- [ ] Build scheduler/calendar
- [ ] Add analytics page
- [ ] Build competitor research tools
- [ ] Connect to LinkedIn API

### Long Term
- [ ] Team collaboration features
- [ ] Billing with Stripe
- [ ] Advanced analytics
- [ ] Mobile app

---

## 🐛 Quick Troubleshooting

**Sign up fails?**
- Check `.env.local` has correct Supabase keys
- Check `SUPABASE_SERVICE_ROLE_KEY` is filled in
- Look at browser console for errors

**Can't see dashboard?**
- Make sure you're signed in
- Check `/auth/callback` isn't stuck
- Clear cookies and try again

**Database table not found?**
- Verify SQL ran successfully in Supabase
- Check table exists in Supabase Table Editor
- Ensure RLS policies are enabled

---

## 📞 Need Help?

1. **Check Supabase Dashboard** → Look at logs
2. **Check Browser Console** → Look for error messages
3. **Check Server Logs** → Look at `npm run dev` output
4. **Read** → `AUTH_SETUP.md` for detailed instructions

---

## 🎓 Key Concepts

**RLS (Row Level Security)**: Database automatically filters data per user
- Each user can only see/edit their own data
- Enforced at database level (secure!)

**Supabase Auth**: Handles user registration, login, tokens
- We trigger automatic profile creation on signup
- Session tokens are managed automatically

**OAuth**: Sign in with Google/LinkedIn instead of passwords
- User authorizes once
- We get access token for their LinkedIn data
- Never see their password

**Claude API**: Powers the content generator
- Takes topic/tone/audience
- Returns 3 post variations
- Calculates predicted reach

---

## 🚀 Deploy to Production

When ready to go live:

1. **Deploy to Vercel**
   ```bash
   git push origin main
   ```

2. **Add Environment Variables** in Vercel Settings
   - All your `.env.local` variables
   - Update redirect URIs to your domain

3. **Update OAuth Providers**
   - Google: Add `https://your-domain.vercel.app/auth/callback`
   - LinkedIn: Add `https://your-domain.vercel.app/auth/callback`

That's it! 🎉

---

## 📊 Architecture at a Glance

```
User Browser
    ↓
Landing Page (public)
    ↓ [Sign up]
Auth Page + Form
    ↓ [Email/Password or OAuth]
Supabase Auth Service
    ↓ [Creates user & session]
Profile Auto-Created (trigger)
    ↓ [Redirects to callback]
Dashboard (protected)
    ↓ [Can now use all features]
```

---

## ✨ You're All Set!

Everything is configured and ready to test. Start with:
```bash
npm run dev
```

Then visit http://localhost:3000 and sign up!
