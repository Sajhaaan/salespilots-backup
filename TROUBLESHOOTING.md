# 🚨 Troubleshooting Guide - Vercel Signup Issues

**If you're getting "Internal Server Error" when trying to signup on your Vercel deployment, follow this guide to fix it.**

## 🔍 **Quick Diagnosis**

### 1. Test the Authentication System
Visit: `https://your-domain.vercel.app/auth-test`

This page will help you:
- Test database connections
- Check environment variables
- Debug authentication issues
- See detailed error messages

### 2. Check Environment Variables
The most common cause of signup failures is missing or incorrect Supabase environment variables.

## 🛠️ **Fix: Environment Variables in Vercel**

### Step 1: Access Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your `salespilots-io` project
3. Click on **Settings** tab
4. Click on **Environment Variables**

### Step 2: Add Required Variables
Add these environment variables:

```bash
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=SalesPilots
NODE_ENV=production

# OpenAI Configuration (if using AI features)
OPENAI_API_KEY=your-openai-api-key
```

### Step 3: Verify Supabase Project
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the correct values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### Step 4: Redeploy
After adding environment variables:
1. Go back to Vercel dashboard
2. Click **Deployments**
3. Click **Redeploy** on your latest deployment

## 🔧 **Alternative Fix: Local Environment Check**

If you can't access Vercel dashboard right now:

### 1. Check Your Local `.env.local`
```bash
# Make sure these are set correctly
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-key
```

### 2. Test Locally First
```bash
npm run dev
# Visit http://localhost:3000/auth-test
# Try to signup - if it works locally, the issue is in Vercel
```

## 🐛 **Common Issues & Solutions**

### Issue 1: "Supabase is not properly configured"
**Solution**: Check environment variables in Vercel dashboard

### Issue 2: "Database connection failed"
**Solution**: Verify Supabase project is active and accessible

### Issue 3: "Table 'auth_users' doesn't exist"
**Solution**: Run database migrations in Supabase

### Issue 4: "CORS error"
**Solution**: Check Vercel domain configuration

## 📊 **Debugging Steps**

### 1. Check Vercel Logs
1. Go to Vercel dashboard
2. Click on your deployment
3. Click **Functions** tab
4. Look for error logs in the signup API

### 2. Test Database Connection
Visit: `/api/test/db`
This will show you:
- Environment variable status
- Database connection status
- Specific error messages

### 3. Check Environment Variables
Visit: `/api/test/env`
This will show you:
- Which variables are set
- Which variables are missing
- Validation status

## 🚀 **Quick Test Commands**

### Test Environment Variables
```bash
curl https://your-domain.vercel.app/api/test/env
```

### Test Database Connection
```bash
curl https://your-domain.vercel.app/api/test/db
```

### Test Signup API Directly
```bash
curl -X POST https://your-domain.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123","firstName":"Test","lastName":"User"}'
```

## 🔒 **Security Notes**

- ✅ `NEXT_PUBLIC_*` variables are safe to expose (they're visible in browser)
- ❌ `SUPABASE_SERVICE_ROLE_KEY` should NEVER be exposed to the browser
- ✅ Use `SUPABASE_SERVICE_ROLE_KEY` only in server-side API routes

## 📞 **Still Having Issues?**

### 1. Check Vercel Status
- Visit [vercel-status.com](https://vercel-status.com)
- Ensure Vercel services are operational

### 2. Check Supabase Status
- Visit [supabase.com/status](https://supabase.com/status)
- Ensure Supabase services are operational

### 3. Review Error Logs
- Check browser console for client-side errors
- Check Vercel function logs for server-side errors
- Check Supabase logs for database errors

### 4. Get Help
- Create an issue in the GitHub repository
- Contact support at support@salespilots.io
- Join our Discord community

## ✅ **Success Checklist**

After fixing the environment variables:

- [ ] Environment variables are set in Vercel
- [ ] Supabase project is accessible
- [ ] Database tables exist
- [ ] Signup works on `/auth-test` page
- [ ] Signup works on main signup page
- [ ] Users can access dashboard after signup

---

## 🎯 **Quick Fix Summary**

**Most likely cause**: Missing Supabase environment variables in Vercel
**Quickest fix**: Add environment variables in Vercel dashboard and redeploy
**Test**: Use `/auth-test` page to verify the fix

---

*If you're still experiencing issues after following this guide, please provide the error messages from the `/auth-test` page so we can help further.*
