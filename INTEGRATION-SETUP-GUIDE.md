# Integration Setup Guide

This guide will help you connect Instagram Business, Facebook, and WhatsApp Business to your SalesPilots dashboard.

## 🔧 Quick Fix Summary

**Problem:** Integration buttons showing "Facebook App ID not configured" error.

**Solution:** Configure Facebook/Instagram/WhatsApp credentials in environment variables.

---

## 📱 Instagram Business Integration

### Prerequisites
1. A Facebook Developer Account
2. An Instagram Business Account
3. A Facebook Page connected to your Instagram Business Account

### Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **"My Apps"** → **"Create App"**
3. Select **"Business"** as app type
4. Fill in app details:
   - **App Name:** SalesPilots Integration
   - **App Contact Email:** your-email@example.com

### Step 2: Get App Credentials

1. In your app dashboard, go to **Settings → Basic**
2. Copy the following:
   - **App ID** (e.g., 1234567890123456)
   - **App Secret** (click "Show" to reveal)

### Step 3: Configure Instagram Permissions

1. Go to **Products** in your app dashboard
2. Add **Instagram** product
3. Add these permissions:
   - `instagram_basic`
   - `instagram_manage_messages`
   - `pages_show_list`
   - `pages_read_engagement`

### Step 4: Set OAuth Redirect URIs

1. Go to **Facebook Login → Settings**
2. Add these **Valid OAuth Redirect URIs**:
   - `http://localhost:3000/api/integrations/instagram/direct-callback` (for local testing)
   - `https://your-domain.vercel.app/api/integrations/instagram/direct-callback` (for production)

### Step 5: Add to Environment Variables

#### Local Development (.env.local)
```bash
FACEBOOK_APP_ID=your_app_id_here
FACEBOOK_APP_SECRET=your_app_secret_here
NEXT_PUBLIC_FACEBOOK_APP_ID=your_app_id_here
INSTAGRAM_APP_ID=your_app_id_here
INSTAGRAM_APP_SECRET=your_app_secret_here
```

#### Vercel Production
1. Go to your Vercel project → **Settings → Environment Variables**
2. Add each variable:
   - Name: `FACEBOOK_APP_ID` | Value: `your_app_id`
   - Name: `FACEBOOK_APP_SECRET` | Value: `your_app_secret`
   - Name: `NEXT_PUBLIC_FACEBOOK_APP_ID` | Value: `your_app_id`
   - Name: `INSTAGRAM_APP_ID` | Value: `your_app_id`
   - Name: `INSTAGRAM_APP_SECRET` | Value: `your_app_secret`
3. Click **"Save"** and **redeploy** your application

---

## 💬 WhatsApp Business Integration

### Prerequisites
1. A Facebook Business Account
2. A phone number (not currently used with WhatsApp)
3. Access to WhatsApp Business API

### Step 1: Set Up WhatsApp Business API

1. Go to [Facebook Business](https://business.facebook.com/)
2. Navigate to **Business Settings → WhatsApp Business Platform**
3. Click **"Get Started"**

### Step 2: Get Access Token & Phone Number ID

1. In WhatsApp Business Platform, go to **API Setup**
2. Copy:
   - **Temporary Access Token** (you'll need to generate a permanent one later)
   - **Phone Number ID**
3. For permanent token, go to **System Users** and create a new one with WhatsApp permissions

### Step 3: Add to Environment Variables

#### Local Development (.env.local)
```bash
# Both variable names supported for compatibility
WHATSAPP_ACCESS_TOKEN=your_permanent_access_token_here
WHATSAPP_BUSINESS_TOKEN=your_permanent_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_random_webhook_verify_token_here
```

#### Vercel Production
1. Go to Vercel project → **Settings → Environment Variables**
2. Add:
   - Name: `WHATSAPP_ACCESS_TOKEN` | Value: `your_token`
   - Name: `WHATSAPP_BUSINESS_TOKEN` | Value: `your_token` (same as above)
   - Name: `WHATSAPP_PHONE_NUMBER_ID` | Value: `your_phone_number_id`
   - Name: `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | Value: `your_verify_token`
3. Save and redeploy

---

## 🔄 After Configuration

### Local Development
1. Stop the dev server (Ctrl+C)
2. Restart: `npm run dev`
3. Go to http://localhost:3000/dashboard/integrations
4. Click **"Connect Instagram Business"** or **"Connect WhatsApp"**

### Vercel Production
1. After adding environment variables, trigger a new deployment:
   ```bash
   vercel --prod
   ```
   Or push to your connected Git repository
2. Go to https://your-domain.vercel.app/dashboard/integrations
3. Connect your integrations

---

## 🎯 Testing the Integration

### Instagram
1. Click **"Connect Instagram Business"**
2. You'll be redirected to Facebook login
3. Authorize the app
4. Select your Instagram Business Account
5. You should be redirected back with success message

### WhatsApp
1. Once configured, WhatsApp should show as "Connected"
2. Test by sending a message through the dashboard

---

## 🚨 Troubleshooting

### "Facebook App ID not configured"
- **Cause:** Environment variables not set or incorrect
- **Fix:** 
  1. Check `.env.local` file has all variables
  2. For Vercel, verify environment variables in dashboard
  3. Restart dev server or redeploy

### "Invalid OAuth Redirect URI"
- **Cause:** Redirect URI not added to Facebook App settings
- **Fix:** Add your callback URL to Facebook App → Facebook Login → Settings → Valid OAuth Redirect URIs

### "Permission Denied" during Instagram connection
- **Cause:** Missing Instagram permissions in Facebook App
- **Fix:** Add required permissions in Facebook App → Products → Instagram

### Instagram shows "Pending"
- **Cause:** OAuth flow incomplete or interrupted
- **Fix:** Try disconnecting and reconnecting

---

## 📚 Additional Resources

- [Facebook for Developers](https://developers.facebook.com/)
- [Instagram API Documentation](https://developers.facebook.com/docs/instagram)
- [WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp)
- [Meta Business Help Center](https://www.facebook.com/business/help)

---

## 🔐 Security Best Practices

1. **Never commit** `.env.local` to Git (it's in `.gitignore`)
2. **Rotate tokens** regularly (every 60-90 days)
3. **Use System Users** for permanent WhatsApp tokens
4. **Limit permissions** to only what's needed
5. **Monitor usage** in Facebook Analytics

---

## ✅ Checklist

Before going live, ensure:

- [ ] Facebook App created and configured
- [ ] Instagram Business Account connected to Facebook Page
- [ ] All environment variables set (local and Vercel)
- [ ] OAuth redirect URIs added to Facebook App
- [ ] App permissions configured correctly
- [ ] Test connection works in development
- [ ] Test connection works in production
- [ ] Webhook URLs configured (if using real-time updates)
- [ ] Privacy Policy and Terms of Service URLs added to Facebook App

---

## 📝 Current Configuration Status

Your `.env.local` file currently has placeholder values. Replace these with actual credentials:

```bash
# Current placeholders - REPLACE THESE
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id_here
INSTAGRAM_APP_ID=your_instagram_app_id_here
INSTAGRAM_APP_SECRET=your_instagram_app_secret_here
WHATSAPP_BUSINESS_TOKEN=your_whatsapp_business_token_here
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id_here
```

After replacing with real values, restart your dev server and try connecting!

---

**Need Help?** 
- Check the [troubleshooting section](#-troubleshooting) above
- Review the Facebook/Instagram API documentation
- Ensure all prerequisites are met

