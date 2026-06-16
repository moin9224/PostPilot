# PostPilot Authentication & User Data Setup

Complete guide to test user authentication and data storage in Supabase.

## ✅ Step 1: Verify Environment Variables

Make sure your `.env.local` has these credentials:

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://wtclqesciegukfmdokrv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0Y2xxZXNjaWVndWtmbWRva3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NzUxNzQsImV4cCI6MjA5NzE1MTE3NH0.9LXgBDcyxB8Jcoi3lalThtDK2ojhFHoVk0VahHMq-_0
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Claude API (optional, for content generation)
ANTHROPIC_API_KEY=<your-api-key>
```

**Get Service Role Key:**
1. Go to https://app.supabase.com
2. Select "post" project
3. Settings → API
4. Copy "Service role" key
5. Paste in `.env.local`

---

## ✅ Step 2: Start Development Server

```bash
npm install
npm run dev
```

Visit: **http://localhost:3000**

---

## ✅ Step 3: Test User Sign Up

### **On Localhost:**

1. Click **"Get started"** on landing page
2. Go to **http://localhost:3000/auth/signup**
3. Fill in:
   - **Email:** test@example.com
   - **Full name:** John Doe
   - **Password:** Password123!
   - Check "I agree to terms"
4. Click **"Create account"**
5. Should redirect to dashboard ✓

### **Check Supabase for User:**

1. Go to https://app.supabase.com
2. Select "post" project
3. **Authentication → Users**
4. Should see `test@example.com` created ✓
5. **Table Editor → profiles**
6. Should see new row with:
   - `id` = user's UUID
   - `email` = test@example.com
   - `full_name` = John Doe
   - `created_at` = timestamp ✓

---

## ✅ Step 4: Test User Login

### **On Localhost:**

1. **Sign out** (if needed)
2. Go to **http://localhost:3000/auth/login**
3. Enter:
   - **Email:** test@example.com
   - **Password:** Password123!
4. Click **"Sign in"**
5. Should redirect to dashboard ✓
6. Should see your name/profile info ✓

### **Verify Session:**

1. Open **Developer Tools** (F12)
2. Go to **Application → Cookies**
3. Should see Supabase session cookies ✓

---

## ✅ Step 5: Test Protected Routes

### **Dashboard Access:**

1. After login, go to **http://localhost:3000/dashboard**
2. Should load successfully ✓
3. Should see your data (posts, stats, etc.) ✓

### **Logout & Redirect:**

1. Click logout (in settings/profile)
2. Should redirect to login page ✓
3. Try accessing dashboard directly
4. Should redirect back to login ✓

---

## ✅ Step 6: Verify Data in Supabase

### **Check Profiles Table:**

```sql
-- Run in Supabase SQL Editor

SELECT * FROM profiles;
-- Should show all users with their data
```

### **Check Auth Users:**

```sql
-- In Supabase Dashboard
-- Authentication → Users
-- Should see all registered users
```

### **Row Level Security (RLS) Test:**

Users should ONLY see their own data:

```sql
-- Each user can only access their own profile
SELECT * FROM profiles WHERE id = auth.uid();
```

---

## 🧪 Test Cases

| Test | Steps | Expected Result |
|------|-------|-----------------|
| **Sign Up** | Fill form → Submit | User created in Auth & Profiles table |
| **Login** | Enter credentials → Submit | Session created, redirect to dashboard |
| **Protected Route** | Access dashboard while logged in | Page loads, shows user data |
| **Logout** | Click logout | Session destroyed, redirect to login |
| **Invalid Login** | Enter wrong password | Error message shown |
| **Duplicate Email** | Sign up with existing email | Error message shown |
| **RLS Enforcement** | User A tries to view User B's data | Access denied (RLS policy) |

---

## 🔐 Security Checklist

- [ ] Passwords are hashed (Supabase handles this)
- [ ] Tokens are secure (HTTPS only)
- [ ] RLS policies enforce per-user data access
- [ ] Service role key is NOT in `.env.local` on production
- [ ] Anon key is public and safe
- [ ] Sessions auto-refresh
- [ ] Session logout clears cookies

---

## 🐛 Troubleshooting

### **Sign Up Fails**

**Error:** "Invalid request"
- Check `.env.local` has correct Supabase URL and key
- Check internet connection
- Check browser console for details

**Error:** "Email already exists"
- Use a different email
- Or delete the old user from Supabase

### **Login Doesn't Work**

**Error:** "Invalid login credentials"
- Check email/password are correct
- Check caps lock
- Make sure user exists (check Supabase Auth)

**Error:** "No user found"
- User may not be signed up yet
- Check Supabase → Authentication → Users

### **Can't Access Dashboard**

**Error:** Redirects to login
- You're not logged in
- Session expired
- Clear cookies and login again

**Error:** Page shows "loading..."
- Check browser console for errors
- Check network tab
- Verify Supabase credentials

### **Data Not Showing**

**Issue:** Dashboard is empty
- Check Supabase → Table Editor → profiles
- Verify RLS policies are enabled
- Check that current user ID matches

---

## 📋 Database Structure

### **auth.users** (Supabase Auth)
```
- id (UUID, unique per user)
- email (unique)
- password (hashed)
- created_at
- last_sign_in_at
```

### **public.profiles** (Our Table)
```
- id (references auth.users.id)
- email
- full_name
- subscription_plan (default: 'free')
- stripe_customer_id
- created_at
- updated_at
```

### **RLS Policy**
Each user can only:
- SELECT: their own profile (where id = auth.uid())
- UPDATE: their own profile
- INSERT: their own profile (at signup)

---

## 🎯 Success Criteria

After setup, you should be able to:

✅ Sign up with email/password
✅ See user created in Supabase Auth
✅ See profile created in Supabase profiles table
✅ Login with credentials
✅ Access protected dashboard
✅ See your name/data on dashboard
✅ Logout successfully
✅ Be redirected to login when accessing protected routes
✅ Each user only sees their own data (RLS)

---

## 📞 Common Issues & Solutions

### Issue: "CORS error"
**Solution:** Make sure Supabase URL is correct in `.env.local`

### Issue: "Session not found"
**Solution:** Clear cookies and login again (F12 → Application → Cookies → Delete all)

### Issue: "Can't find profiles table"
**Solution:** Run schema.sql in Supabase SQL editor to create tables

### Issue: "RLS policy error"
**Solution:** Make sure RLS policies are created (run schema.sql)

### Issue: "Database error when signing up"
**Solution:** Check that the `handle_new_user` trigger is enabled in Supabase

---

## ✨ Next Steps After Auth Works

1. **Google OAuth** - Set up Google login (see AUTH_SETUP.md)
2. **User Profile Page** - Let users edit profile
3. **Billing** - Add Stripe integration
4. **Data Sync** - Sync user posts with LinkedIn API
5. **Features** - Build content generator, scheduler, analytics

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Test all auth flows locally
- [ ] Verify Supabase RLS policies work
- [ ] Set up custom domain in Supabase
- [ ] Update OAuth redirect URIs for production domain
- [ ] Enable HTTPS only
- [ ] Set up email verification (optional)
- [ ] Set up password reset email (optional)
- [ ] Test auth on production domain
- [ ] Monitor Supabase logs for errors

