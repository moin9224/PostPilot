# 🚀 PostPilot Auth Quick Start

**Get user authentication working in 5 minutes.**

---

## 1️⃣ Get Your Service Role Key

1. Go to: https://app.supabase.com
2. Click **"post"** project
3. Click **Settings** (left sidebar)
4. Click **API**
5. Scroll down to find **"Service role"** key
6. Copy it

---

## 2️⃣ Add to `.env.local`

Open your `.env.local` file and add:

```
SUPABASE_SERVICE_ROLE_KEY=<paste-service-role-key-here>
```

Full `.env.local` should look like:

```
NEXT_PUBLIC_SUPABASE_URL=https://wtclqesciegukfmdokrv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ANTHROPIC_API_KEY=sk-ant-...
```

---

## 3️⃣ Start Dev Server

```bash
npm run dev
```

Wait for: `> Local: http://localhost:3000`

---

## 4️⃣ Test Sign Up

1. Go to: **http://localhost:3000**
2. Click **"Get started"**
3. Fill form:
   - Email: `john@example.com`
   - Password: `Test12345!`
   - Name: `John Doe`
4. Click **"Create account"**

**Expected:** Redirected to `/dashboard` ✅

---

## 5️⃣ Verify in Supabase

### Check Auth Users:
1. Go to: https://app.supabase.com
2. Select **"post"** project
3. Click **Authentication → Users**
4. Should see `john@example.com` ✅

### Check Database:
1. Click **Table Editor**
2. Click **profiles**
3. Should see row with:
   - `id` = (some UUID)
   - `email` = john@example.com
   - `full_name` = John Doe
   - `subscription_plan` = free
   - `created_at` = (timestamp) ✅

---

## 6️⃣ Test Login

1. Go to: **http://localhost:3000/auth/login**
2. Enter:
   - Email: `john@example.com`
   - Password: `Test12345!`
3. Click **"Sign in"**

**Expected:** Redirected to `/dashboard` ✅

---

## 7️⃣ Verify Session

1. Open **Developer Tools** (F12)
2. Go to **Application → Cookies**
3. Should see cookies with "supabase" in the name ✅
4. Session is active ✅

---

## 8️⃣ Test Protected Route

1. While logged in, visit: **http://localhost:3000/dashboard**
2. Page should load ✅
3. Should see your data ✅

Logout and try again:
1. Logout (if there's a logout button)
2. Try to visit dashboard
3. Should redirect to login ✅

---

## ✅ Success Checklist

- [ ] Service Role Key added to `.env.local`
- [ ] Dev server running (`npm run dev`)
- [ ] Can sign up with email/password
- [ ] User appears in Supabase Auth
- [ ] Profile created in Supabase database
- [ ] Can login with same credentials
- [ ] Dashboard loads after login
- [ ] Session cookies are set
- [ ] Protected routes work (redirect when not logged in)

---

## 🎯 You're Done!

Your authentication system is now **fully working** with:

✅ Email/password signup
✅ Email/password login
✅ User data stored in Supabase
✅ Session management
✅ Protected routes
✅ Row Level Security (RLS)

---

## 🔗 What's Next?

1. **Test Google OAuth** (see AUTH_SETUP.md)
2. **Add user profile page** - Let users edit their info
3. **Connect features** - Use user ID to store posts, analytics, etc.
4. **Deploy to production** - Push to Vercel

---

## 🆘 Common Issues

### Sign up fails with "Invalid request"
- Check `.env.local` has correct Supabase URL and ANON key
- Check internet connection
- Check browser console (F12) for error details

### User created in Auth but not in profiles table
- The `handle_new_user` trigger may not be active
- Go to Supabase → Functions → Triggers
- Make sure `on_auth_user_created` trigger exists

### Login fails but user exists
- Check email and password are exactly correct
- Try signing up with a new email
- Check Supabase Auth logs

### Dashboard shows "loading..." forever
- Check browser console (F12) for errors
- Verify `.env.local` has correct keys
- Try clearing cookies and logging in again

---

## 📚 Learn More

- `AUTH_SETUP.md` - Detailed OAuth setup guide
- `AUTH_TESTING.md` - Comprehensive testing guide
- `BACKEND.md` - API documentation
- `QUICKSTART.md` - Project overview

