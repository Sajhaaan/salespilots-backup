# 🚀 Supabase Quick Setup - PERMANENT FIX

## Why We Need This:
- Vercel has NO persistent storage
- Environment variables alone can't store user profiles
- Supabase will store Instagram connection permanently
- UI will always show connected status
- AI will always have access to credentials

---

## Step 1: Create Supabase Project (3 minutes)

1. **Go to**: https://supabase.com/dashboard
2. **Click**: "New Project"
3. **Fill in**:
   - Name: `salespilots`
   - Database Password: (create a strong password - SAVE IT!)
   - Region: Select closest to you (Mumbai/Singapore for India)
4. **Click**: "Create new project"
5. **Wait 2 minutes** for project to initialize

---

## Step 2: Get Your Credentials (1 minute)

Once project is ready:

1. **Go to**: Project Settings (gear icon) → API
2. **Copy these 2 values**:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon/public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
   ```

---

## Step 3: Give Me These Values

**Just send me:**
1. Project URL
2. anon key

**I'll:**
1. Add them to Vercel
2. Create database tables
3. Initialize your Instagram connection
4. Deploy everything
5. **It will work permanently!**

---

## Why This Will Work:

**Current Problem:**
```
User connects Instagram → Saves to file → File deleted → UI shows disconnected
```

**With Supabase:**
```
User connects Instagram → Saves to Supabase → Persists forever → UI always shows connected ✅
```

---

## What I'll Do Once You Give Me Credentials:

1. ✅ Add `NEXT_PUBLIC_SUPABASE_URL` to Vercel
2. ✅ Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel
3. ✅ Create database tables automatically
4. ✅ Insert your Instagram connection data
5. ✅ Deploy to production
6. ✅ Test and verify
7. ✅ Instagram will show connected PERMANENTLY!

---

**Just create the Supabase project and send me the URL + anon key!** 🚀

