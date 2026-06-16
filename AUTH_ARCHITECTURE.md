# PostPilot Auth & Data Architecture

## 🏗️ Complete System Overview

### High-Level Flow

```
User Browser
    ↓
[Landing Page] → Click "Sign up"
    ↓
[Auth Form] → Enter email/password
    ↓
[POST /api/auth/signup] → Send to backend
    ↓
[Supabase Auth Service] → Create user + hash password
    ↓
[Trigger: handle_new_user] → Auto-create profile row
    ↓
[Response: Session + User ID]
    ↓
[Dashboard] → User logged in + data accessible
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   BROWSER (Client)                      │
│  - React components                                     │
│  - AuthForm, Dashboard, etc.                           │
│  - Stores session in cookies                           │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTPS
                   ↓
┌─────────────────────────────────────────────────────────┐
│               NEXT.JS (Backend)                         │
│  - API Routes: /api/auth/signup, login, logout         │
│  - Server-side auth checks                             │
│  - Uses service role for admin tasks                   │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP
                   ↓
┌─────────────────────────────────────────────────────────┐
│           SUPABASE (Database & Auth)                    │
│                                                         │
│  ┌──────────────────┐      ┌──────────────────┐       │
│  │   auth.users     │      │  public.profiles │       │
│  │  (Managed)       │      │   (Our table)    │       │
│  ├──────────────────┤      ├──────────────────┤       │
│  │ id (UUID)        │      │ id (UUID)        │       │
│  │ email            │      │ email            │       │
│  │ password (hash)  │      │ full_name        │       │
│  │ created_at       │      │ subscription_plan│       │
│  │ last_sign_in     │      │ created_at       │       │
│  │ ...              │      │ updated_at       │       │
│  └──────────────────┘      └──────────────────┘       │
│         │                           ↑                  │
│         │ (trigger on insert)       │                  │
│         └───────────────────────────┘                  │
│                                                         │
│  ┌──────────────────────────────────────┐            │
│  │    Row Level Security (RLS)          │            │
│  │  - Each user sees only own data      │            │
│  │  - Enforced at database level       │            │
│  │  - Cannot be bypassed from client   │            │
│  └──────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

### Sign Up Process

```
1. User fills signup form:
   - Email: john@example.com
   - Password: SecurePass123!
   - Name: John Doe

2. Frontend submits to: POST /api/auth/signup

3. Backend (/api/auth/signup/route.ts):
   - Validate email + password
   - Call: supabase.auth.signUp({email, password, full_name})

4. Supabase Auth Service:
   - Hash password with bcrypt
   - Create user in auth.users table
   - Generate session token (JWT)
   - Return: { user, session }

5. Database Trigger (handle_new_user):
   - Detects new user in auth.users
   - Auto-inserts row in profiles table:
     {
       id: user.id,
       email: user.email,
       full_name: user.raw_user_meta_data.full_name,
       subscription_plan: 'free',
       created_at: now()
     }

6. Frontend receives:
   - Session token (stored in secure cookie)
   - User ID
   - Redirects to /dashboard

7. User is now logged in ✅
```

### Login Process

```
1. User fills login form:
   - Email: john@example.com
   - Password: SecurePass123!

2. Frontend submits to: POST /api/auth/login

3. Backend (/api/auth/login/route.ts):
   - Call: supabase.auth.signInWithPassword({email, password})

4. Supabase Auth Service:
   - Look up user by email
   - Compare passwords (bcrypt)
   - If match: Generate new session token
   - If no match: Return error

5. Frontend receives:
   - Session token (stored in secure cookie)
   - Redirects to /dashboard

6. User is now logged in ✅
```

---

## 🗂️ Data Structure

### auth.users (Supabase Managed)
```
Columns:
- id (UUID, Primary Key)
- email (TEXT, UNIQUE)
- encrypted_password (TEXT)
- email_confirmed_at (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- last_sign_in_at (TIMESTAMP)
- raw_user_meta_data (JSONB)
- recovery_sent_at (TIMESTAMP)

✅ Managed by Supabase
✅ Cannot directly INSERT/UPDATE from client
✅ Only via auth.signUp() or signInWithPassword()
✅ Passwords automatically hashed
```

### public.profiles (Our Custom Table)
```
Columns:
- id (UUID, Primary Key, FK to auth.users.id)
- email (TEXT, UNIQUE)
- full_name (TEXT)
- company (TEXT)
- industry (TEXT)
- profile_picture_url (TEXT)
- subscription_plan (TEXT) default: 'free'
- subscription_started_at (TIMESTAMP)
- stripe_customer_id (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

✅ Created automatically via trigger
✅ Can be updated by user
✅ Follows user's authentication
✅ Row Level Security enforced
```

---

## 🔒 Row Level Security (RLS)

### How it Works

Every query to the database is checked:

```sql
-- When a user tries to SELECT from profiles:
SELECT * FROM profiles 
WHERE id = auth.uid()  -- ← Automatically added by RLS

-- Example:
-- User with ID: abc123
-- Query becomes: SELECT * FROM profiles WHERE id = 'abc123'
-- User can ONLY see their own profile
```

### RLS Policies on profiles Table

```sql
-- SELECT Policy (Select own profile)
CREATE POLICY "users can select own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- UPDATE Policy (Update own profile)
CREATE POLICY "users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- INSERT Policy (Create own profile at signup)
CREATE POLICY "users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Example: RLS in Action

```
User A (ID: abc123) tries:
  SELECT * FROM profiles;

Database adds WHERE clause automatically:
  SELECT * FROM profiles WHERE id = 'abc123';

Result: User A sees ONLY their own profile ✅

User A tries to do:
  SELECT * FROM profiles WHERE id = 'xyz789';

Database checks: Is auth.uid() = 'xyz789'?
Result: NO → Access Denied ❌
```

---

## 📝 API Routes

### POST /api/auth/signup
```
Request Body:
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe"
}

Response (Success):
{
  "user": {
    "id": "abc123...",
    "email": "john@example.com"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {...}
  }
}

Response (Error):
{
  "message": "User already exists"
}
```

### POST /api/auth/login
```
Request Body:
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response (Success):
{
  "user": {
    "id": "abc123...",
    "email": "john@example.com"
  },
  "session": {...}
}

Response (Error):
{
  "message": "Invalid login credentials"
}
```

### POST /api/auth/logout
```
Request: None needed

Response:
{
  "message": "Logged out successfully"
}
```

### GET /api/auth/me
```
Response (If Logged In):
{
  "user": {
    "id": "abc123...",
    "email": "john@example.com"
  }
}

Response (If Not Logged In):
{
  "message": "Not authenticated"
}
```

---

## 🎯 Session Management

### How Sessions Work

```
1. User logs in
2. Supabase creates JWT token with:
   - User ID
   - Email
   - Expiry (usually 1 hour)
   - Signature (prevents tampering)

3. Token stored in:
   - Browser secure HTTP-only cookie
   - Cannot be accessed by JavaScript (XSS safe)
   - Automatically sent with every request

4. Server validates token:
   - Checks signature
   - Checks expiry
   - If valid: Request continues
   - If invalid: User not authenticated

5. Token refresh:
   - Before expiry, new token generated
   - Old token becomes invalid
   - Process is automatic

6. Logout:
   - Token is deleted from cookie
   - User session ends
   - Next request: Not authenticated
```

---

## 🛡️ Security Features

### Password Security
- ✅ Passwords hashed with bcrypt
- ✅ Salt included (cannot reverse hash)
- ✅ Passwords never stored in plain text
- ✅ Passwords never sent to frontend

### Token Security
- ✅ JWT tokens (cryptographically signed)
- ✅ HTTP-only cookies (JavaScript cannot access)
- ✅ Secure flag (HTTPS only)
- ✅ SameSite flag (CSRF protection)

### Data Security
- ✅ RLS enforces at database level
- ✅ Users cannot see other users' data
- ✅ Cannot be bypassed from client
- ✅ Server validates all requests

### HTTPS
- ✅ All communication encrypted
- ✅ Man-in-the-middle attacks prevented
- ✅ Tokens cannot be intercepted

---

## 🔄 User Data Access Flow

```
User wants to see their profile:

1. Browser has session cookie
2. Request: GET /dashboard
3. Server checks: Is session valid?
   - If NO: Redirect to login
   - If YES: Continue

4. Component wants to load profile:
   const profile = await supabase
     .from('profiles')
     .select('*')
     .single();

5. Supabase automatically:
   - Extracts user ID from session
   - Adds: WHERE id = auth.uid()
   - Returns only their profile

6. Component displays profile data ✅
```

---

## 📱 Frontend Implementation

### Client-Side Code

```typescript
// lib/supabase.ts - Create client
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// In a component - Sign up
const supabase = createClient();
const { data, error } = await supabase.auth.signUp({
  email: "john@example.com",
  password: "SecurePass123!"
});

// In a component - Check if logged in
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  // Not logged in
}
```

### Server-Side Code

```typescript
// lib/supabase-server.ts - Create server client
export async function getServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(..., { cookies: {...} });
}

// In an API route
const supabase = await getServerSupabase();
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  return Response.json({ error: "Not authenticated" }, { status: 401 });
}

// Now we have user.id for queries
```

---

## 🧪 Testing the System

### Sign Up Test
1. Go to `/auth/signup`
2. Fill form and submit
3. Check Supabase → Authentication → Users (user created)
4. Check Supabase → Table Editor → profiles (profile created)
5. Verify you're redirected to dashboard

### Login Test
1. Go to `/auth/login`
2. Enter credentials
3. Check cookies in DevTools
4. Verify you can access `/dashboard`

### RLS Test
1. As User A, try to query another user's data
2. Supabase blocks it automatically
3. Only your own data is visible

---

## 🚀 Deployment

### Environment Variables Needed

```
# Public (safe to commit)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Private (NEVER commit)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### On Vercel

1. Add env vars to project settings
2. Redeploy
3. Auth will work on production domain
4. Update OAuth redirect URIs if using Google/LinkedIn

---

## ✅ Summary

- **Authentication**: Email/password signup and login
- **Storage**: User data in Supabase database
- **Security**: Passwords hashed, RLS enforced, tokens secure
- **Sessions**: Automatic cookie management
- **Scalability**: Works for 1 user or 1 million users

Your entire auth system is production-ready! 🎉

