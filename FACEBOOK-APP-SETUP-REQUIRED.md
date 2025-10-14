# 🚀 Facebook App Setup - ACTION REQUIRED

## ✅ Credentials Added Successfully!

Your Instagram and Facebook credentials have been configured:
- **Facebook App ID:** 605299205567693
- **Instagram App ID:** 2108365556355260
- ✅ App secrets configured

## ⚠️ IMPORTANT: Configure OAuth Redirect URIs

Before you can connect Instagram, you MUST add these redirect URIs to your Facebook App settings:

### Step 1: Go to Facebook Developer Console

1. Visit: https://developers.facebook.com/apps/605299205567693
2. Log in with your Facebook account that owns this app

### Step 2: Add Product (if not already added)

1. In the left sidebar, click **"Add Product"** (or go to **"Products"** if already added)
2. Find **"Facebook Login"** and click **"Set Up"**

### Step 3: Configure OAuth Redirect URIs

1. Go to **"Facebook Login" → "Settings"** in the left sidebar
2. Scroll to **"Valid OAuth Redirect URIs"**
3. Add these **exact** URLs (one per line):

```
http://localhost:3000/api/integrations/instagram/direct-callback
https://salespilots-io.vercel.app/api/integrations/instagram/direct-callback
```

**IMPORTANT:** 
- Use **http://** for localhost (not https)
- Use **https://** for Vercel production
- Make sure there are NO trailing slashes
- Must match exactly or OAuth will fail

4. Click **"Save Changes"**

### Step 4: Configure App Permissions

1. Go to **"App Review" → "Permissions and Features"**
2. Request these permissions (if not already granted):
   - ✅ `instagram_basic`
   - ✅ `pages_show_list`
   - ✅ `instagram_manage_messages`
   - ✅ `pages_read_engagement`

**Note:** Some permissions may require app review by Facebook. For development, you can test with your own Instagram account without review.

### Step 5: Add Test Users (Optional for Testing)

1. Go to **"Roles" → "Test Users"**
2. Add your Instagram account as a test user
3. This allows testing without Facebook app review

### Step 6: Make App Live (For Production)

**For Development/Testing:**
- Your app can stay in "Development Mode"
- Only you and added test users can connect

**For Production:**
1. Complete all required fields in **"App Settings" → "Basic"**:
   - Privacy Policy URL
   - Terms of Service URL
   - App Icon
   - Category
2. Switch app mode from "Development" to "Live" in top-right toggle
3. Submit for App Review if using advanced permissions

---

## 🧪 Testing the Connection

### Local Development (localhost:3000)

1. Make sure dev server is running: `npm run dev`
2. Go to: http://localhost:3000/dashboard/integrations
3. Click **"Connect Instagram Business"**
4. You should be redirected to Facebook login
5. After authorization, you'll be redirected back to dashboard

### Production (Vercel)

1. Deploy to Vercel with environment variables
2. Go to: https://salespilots-io.vercel.app/dashboard/integrations
3. Click **"Connect Instagram Business"**
4. Complete OAuth flow

---

## 📋 Quick Checklist

Before testing Instagram connection, ensure:

- [ ] Facebook App created (ID: 605299205567693)
- [ ] Instagram Product added to Facebook App
- [ ] OAuth redirect URIs added:
  - [ ] `http://localhost:3000/api/integrations/instagram/direct-callback`
  - [ ] `https://salespilots-io.vercel.app/api/integrations/instagram/direct-callback`
- [ ] Facebook Login product configured
- [ ] App permissions requested (at minimum: instagram_basic, pages_show_list)
- [ ] Instagram Business Account linked to a Facebook Page
- [ ] Environment variables set (already done ✅)

---

## 🔍 Troubleshooting

### "Can't Load URL: The domain of this URL isn't included in the app's domains"

**Solution:** Add redirect URIs to Facebook App (see Step 3 above)

### "Invalid OAuth Redirect URI"

**Solution:** 
- Check for typos in redirect URI
- Ensure no trailing slashes
- Verify exact match between app setting and code

### "Instagram Business Account not found"

**Solution:**
- Ensure your Instagram is a Business Account (not Personal)
- Link Instagram Business Account to a Facebook Page
- Use the Facebook account that owns the Page

### "Permission Denied"

**Solution:**
- Add required permissions in App Review → Permissions
- For testing, app can stay in Development Mode
- Add your Facebook account as admin/developer role

---

## 📱 Instagram Account Requirements

Your Instagram account MUST be:
1. **Business Account** (not Personal or Creator)
2. **Connected to a Facebook Page**
3. **Owned by the Facebook account** you're logging in with

### How to Check:

1. Open Instagram app
2. Go to Settings → Account → Switch to Professional Account
3. Choose "Business"
4. Link to your Facebook Page

---

## 🎯 Next Steps

1. **Configure Facebook App** (Steps 1-4 above) ← DO THIS FIRST
2. **Test localhost connection** (optional)
3. **Deploy to Vercel** with environment variables
4. **Test production connection**
5. **Complete app review** (if going live publicly)

---

## 📞 Need Help?

- [Facebook for Developers](https://developers.facebook.com/apps/605299205567693)
- [Instagram Basic Display API Docs](https://developers.facebook.com/docs/instagram-basic-display-api)
- [OAuth Redirect URI Setup](https://developers.facebook.com/docs/facebook-login/security#redirect)

---

## ✨ Your Configuration

**Current Environment Variables:**
```bash
FACEBOOK_APP_ID=605299205567693
FACEBOOK_APP_SECRET=01dd60f40c6b08662bbe8bfbb7eeebc7
NEXT_PUBLIC_FACEBOOK_APP_ID=605299205567693
INSTAGRAM_APP_ID=2108365556355260
INSTAGRAM_APP_SECRET=7cf278244c1b7bfa3c7effead89392ae
```

**Redirect URIs to Add:**
```
http://localhost:3000/api/integrations/instagram/direct-callback
https://salespilots-io.vercel.app/api/integrations/instagram/direct-callback
```

**Dev Server:** http://localhost:3000  
**Integrations Page:** http://localhost:3000/dashboard/integrations

---

**Status:** ✅ Credentials configured | ⚠️ Awaiting Facebook App OAuth setup

Once you complete Steps 1-3 above, you'll be able to connect Instagram! 🎉

