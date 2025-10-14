# Vercel Environment Variables Setup

## Critical Variables Needed for Authentication

Your app needs these environment variables to work properly on Vercel:

### 1. NEXT_PUBLIC_APP_URL
```
https://salespilots-backup.vercel.app
```
This tells your app what URL it's running on (needed for redirects and OAuth callbacks).

### 2. JWT_SECRET
```
601ee1a28869d4474243a7ff8d3e7b479ca898187725f976990218b261eeb77f
```
Used to sign and verify JWT tokens for user sessions.

### 3. ENCRYPTION_KEY
```
d154ab26bae63ffec6f6d05bbe4b24baf67ae30558df88864cdf7689786b2e26
```
Used to encrypt sensitive data in the database.

## How to Add Them

### Method 1: Vercel Dashboard (Recommended - 2 minutes)

1. Go to: https://vercel.com/dashboard
2. Select project: `salespilots-backup`
3. Click: Settings → Environment Variables
4. Add each variable above
5. For each one, select: **Production**, **Preview**, and **Development**
6. Click "Save"
7. Click "Redeploy" or run: `vercel --prod`

### Method 2: Vercel CLI (If you prefer terminal)

```bash
# You'll need to paste each value when prompted

vercel env add NEXT_PUBLIC_APP_URL
# Paste: https://salespilots-backup.vercel.app
# Select: Production, Preview, Development

vercel env add JWT_SECRET  
# Paste: 601ee1a28869d4474243a7ff8d3e7b479ca898187725f976990218b261eeb77f
# Select: Production, Preview, Development

vercel env add ENCRYPTION_KEY
# Paste: d154ab26bae63ffec6f6d05bbe4b24baf67ae30558df88864cdf7689786b2e26
# Select: Production, Preview, Development

# Then redeploy
vercel --prod
```

## Why This Fixes the Login Issue

Without these environment variables:
- ❌ The app doesn't know its own URL for redirects
- ❌ JWT tokens can't be created or verified
- ❌ Session cookies aren't properly set

With these variables:
- ✅ Proper authentication flow
- ✅ Successful login redirects to dashboard
- ✅ Sessions persist correctly

## Recent Production Fixes (Dec 2024)

The codebase now includes enhanced production handling:
- ✅ **Auto-detection of Vercel environment** for secure cookies
- ✅ **Production delays** (300ms login, 200ms auth check) for cookie propagation
- ✅ **Enhanced logging** for easier debugging in Vercel logs
- ✅ **Secure cookie handling** automatically enabled on HTTPS

See `VERCEL-LOGIN-FIX.md` for complete troubleshooting guide.

## After Adding Variables

1. Redeploy your app (Vercel will auto-redeploy when you add env vars)
2. Clear your browser cookies for the Vercel domain
3. Try logging in again
4. You should be redirected to `/dashboard` successfully!

## Test Your Setup

1. Go to your deployed app
2. Click "Sign In"
3. Enter credentials
4. You should see "Welcome back!" and be redirected to dashboard
5. Dashboard should load without redirecting back to sign-in

---

**Note**: Keep these secrets secure! Don't commit them to Git or share them publicly.

