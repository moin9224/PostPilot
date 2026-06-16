# PostPilot Authentication Setup Guide

This guide will walk you through setting up authentication for PostPilot with Google, LinkedIn, and Email/Password.

## ✅ Database Setup (COMPLETE)
Your Supabase database is already set up with all tables and Row Level Security policies enabled.

## 📋 Step-by-Step Setup

### 1. **Supabase Configuration**

#### 1a. Enable Email Auth
1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project **"post"**
3. Go to **Authentication → Providers**
4. Find **Email** and toggle it **ON**
5. Click **Save**

#### 1b. Get Your Service Role Key
1. Go to **Settings → API**
2. Copy the **Service role key** (labeled `service_role`)
3. Paste it in `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`

#### 1c. Enable Google OAuth (Optional but recommended)
1. Go to **Authentication → Providers**
2. Find **Google** and click it
3. You'll need Google OAuth credentials (see Step 2 below)
4. Once you have them, paste:
   - **Google Client ID** 
   - **Google Client Secret**
5. Click **Save**

#### 1d. Enable LinkedIn OAuth (Optional)
1. Go to **Authentication → Providers**
2. Find **LinkedIn** and click it
3. You'll need LinkedIn OAuth credentials (see Step 3 below)
4. Once you have them, paste:
   - **LinkedIn Client ID**
   - **LinkedIn Client Secret**
5. Click **Save**

---

### 2. **Google OAuth Setup**

#### Create a Google Cloud Project
1. Go to https://console.cloud.google.com
2. Click **Select a Project** → **New Project**
3. Name it: **"PostPilot"** → Click **Create**
4. Wait for it to be created (30 seconds)

#### Enable Google+ API
1. In the Google Cloud Console, search for **"Google+ API"**
2. Click **Google+ API**
3. Click **ENABLE**

#### Create OAuth Credentials
1. Go to **Credentials** (left sidebar)
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. If prompted, click **Configure OAuth Consent Screen**
   - Choose **External** as User Type
   - Click **Create**
   - Fill in:
     - **App name:** PostPilot
     - **User support email:** your-email@gmail.com
     - **Developer contact:** your-email@gmail.com
   - Click **Save and Continue** (skip the optional scopes)
   - Click **Save and Continue** again
   - Click **Back to Dashboard**

4. Now go to **Credentials** again
5. Click **Create Credentials** → **OAuth 2.0 Client ID**
6. Choose **Web application**
7. Name it: **"PostPilot Web"**
8. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:3000/auth/callback
   https://thepostpilot.vercel.app/auth/callback
   ```
9. Click **Create**
10. A modal will appear with your credentials:
    - Copy the **Client ID** → paste in `.env.local` as `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
    - Copy the **Client Secret** → paste in `.env.local` as `GOOGLE_CLIENT_SECRET`
11. Click **OK** and close the modal

---

### 3. **LinkedIn OAuth Setup**

#### Create a LinkedIn App
1. Go to https://www.linkedin.com/developers/apps
2. Click **Create app**
3. Fill in:
   - **App name:** PostPilot
   - **LinkedIn Page:** [Create or select your company page]
   - **App logo:** [Upload your PostPilot logo]
4. Accept the terms and click **Create app**

#### Configure OAuth Settings
1. Go to the **Auth** tab
2. Under **Authorized redirect URLs for your app**, add:
   ```
   http://localhost:3000/auth/callback
   https://thepostpilot.vercel.app/auth/callback
   ```
3. Click **Update**

#### Request Sign In with LinkedIn Permissions
1. Go to the **Products** tab
2. Look for **"Sign In with LinkedIn using OpenID Connect"**
3. Click **Request access** (if not already approved)
4. **Note:** This requires LinkedIn verification (usually takes 24 hours)

#### Get Your Credentials
1. Go to the **Auth** tab
2. Copy:
   - **Client ID** → paste in `.env.local` as `LINKEDIN_CLIENT_ID`
   - **Client Secret** → paste in `.env.local` as `LINKEDIN_CLIENT_SECRET`

---

### 4. **Test Authentication Locally**

#### Install Dependencies
```bash
npm install
```

#### Start Development Server
```bash
npm run dev
```

#### Test Sign Up
1. Open http://localhost:3000
2. Click **"Get started"** button
3. Try signing up with:
   - **Email/Password** (should work immediately)
   - **Google** (if OAuth configured)
   - **LinkedIn** (if OAuth configured)

#### Test Sign In
1. Go to http://localhost:3000/auth/login
2. Sign in with your test account

---

### 5. **Post-Authentication Flow**

After successful authentication:
1. User lands on `/auth/callback`
2. Session is established
3. User is redirected to `/dashboard`
4. Profile is automatically created in the `profiles` table
5. User can proceed to connect LinkedIn or start generating posts

---

## 🔐 Security Checklist

- [ ] Never commit `.env.local` to git (it's in `.gitignore`)
- [ ] All tokens are stored encrypted in Supabase
- [ ] RLS policies enforce per-user data isolation
- [ ] OAuth redirect URIs are whitelisted
- [ ] Service role key is kept secret (backend only)

---

## 🚀 Deploy to Production

### Update Environment Variables
When deploying to Vercel:
1. Go to your Vercel project settings
2. Add environment variables:
   - All variables from `.env.local` that start with `NEXT_PUBLIC_` can be public
   - Other secrets (API keys, client secrets) must be added as secure env vars
3. Make sure to update redirect URIs:
   ```
   https://your-domain.vercel.app/auth/callback
   ```

### Update OAuth Provider Settings
- **Google**: Add `https://your-domain.vercel.app/auth/callback` to authorized redirect URIs
- **LinkedIn**: Add `https://your-domain.vercel.app/auth/callback` to authorized redirect URLs
- **Supabase**: Make sure your production URL is configured

---

## 🐛 Troubleshooting

### "Callback URL mismatch" Error
- Make sure the redirect URI in your OAuth provider matches exactly
- Check for trailing slashes, http vs https, and domain spelling

### "Invalid Client ID" Error
- Verify you copied the correct credentials from the OAuth provider
- Make sure the client secret matches the client ID

### User Not Created in Database
- Check Supabase RLS policies are enabled
- Verify the `handle_new_user` trigger is active
- Check Supabase logs for errors

### Google OAuth Not Appearing
- Make sure you enabled Google as an auth provider in Supabase
- Clear browser cache and reload
- Verify credentials are correct in Supabase settings

---

## 📚 Related Files
- `.env.local` - Environment variables
- `.env.example` - Template for env variables
- `app/auth/callback/page.tsx` - OAuth callback handler
- `components/AuthForm.tsx` - Auth form component
- `lib/supabase.ts` - Supabase client setup
- `lib/supabase-server.ts` - Server-side Supabase setup
