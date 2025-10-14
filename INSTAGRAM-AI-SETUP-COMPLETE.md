# 🤖 Instagram AI Auto-Reply - Complete Setup Guide

## ✅ What I Fixed:

### 1. Instagram Connection Not Saving
- **Problem**: Instagram OAuth completed but didn't save credentials to database
- **Fixed**: Callback now saves all Instagram data (username, access tokens, page ID, etc.)

### 2. UI Showing "Not Connected"
- **Problem**: Database had no Instagram credentials
- **Fixed**: Now properly saves and displays connection status

### 3. AI Chatbot Not Replying
- **Problem**: No credentials = No webhook access
- **Fixed**: Full integration with auto-reply enabled by default

## 🔧 Complete Setup Steps:

### Step 1: Reconnect Instagram (REQUIRED)
Since the previous connection wasn't saved, you need to reconnect:

1. Go to: **https://salespilots-backup.vercel.app/dashboard/integrations**
2. Click **"Disconnect"** if it shows as connected (to clear old state)
3. Click **"Connect Instagram Business"**
4. Log in with Facebook
5. Grant permissions
6. You should see: **"Instagram connected successfully! @your_username - AI Auto-Reply is now active!"**

### Step 2: Verify Connection in UI
After reconnecting, you should see:
- ✅ **Green "LIVE" badge** on Instagram card
- ✅ **Your Instagram handle** displayed (e.g., @your_username)
- ✅ **Connection stats** (Messages, Customers, Orders)
- ✅ **"Webhook Active"** and **"AI Ready"** indicators
- ✅ **"AI Auto-Reply ON"** button (green with pulsing dot)

### Step 3: Configure Webhook in Facebook (CRITICAL)
**This is required for AI to receive Instagram DMs!**

1. Go to: **https://developers.facebook.com/apps/605299205567693/webhooks/**

2. Click **"Add Subscriptions"** for Instagram

3. Enter these details:
   ```
   Callback URL: https://salespilots-backup.vercel.app/api/webhook/instagram/enhanced
   Verify Token: salespilots_webhook_2024
   ```

4. Click **"Verify and Save"**

5. Subscribe to these fields:
   - ✅ `messages` (REQUIRED!)
   - ✅ `messaging_postbacks`
   - ✅ `messaging_optins`
   - ✅ `messaging_optouts`
   - ✅ `message_echoes`

6. Click **"Save"**

### Step 4: Test AI Auto-Reply

#### Method 1: From Another Instagram Account
1. Send a DM to your Instagram Business account from another account
2. Type: **"Hi, what products do you have?"**
3. AI should reply within seconds! 🤖

#### Method 2: Monitor Logs
```bash
vercel logs --follow
```

Look for:
- `📨 Enhanced Instagram webhook received`
- `🤖 AI Response generated`
- `✅ Message sent to Instagram`

## 📊 What the AI Can Do:

### Automatic Detection & Response:
- ✅ **Product Inquiries**: "What products do you have?" → Shows product catalog
- ✅ **Pricing Questions**: "How much?" → Provides prices
- ✅ **Order Management**: "I want to order" → Guides through checkout
- ✅ **Payment Processing**: Detects payment screenshots → Verifies payment
- ✅ **Multi-Language**: Responds in Hindi, Tamil, English, Hinglish, etc.
- ✅ **24/7 Operation**: Never sleeps, always responds

### AI Powered Features:
- 🧠 **Context-Aware**: Remembers conversation history
- 🌍 **Language Detection**: Auto-detects customer language
- 📦 **Product Recognition**: Understands product images/links
- 💰 **Payment Links**: Generates Razorpay payment links
- 📸 **Screenshot Analysis**: Verifies payment screenshots
- ✅ **Order Confirmation**: Confirms orders automatically

## 🔍 Troubleshooting:

### "Not Connected" in UI
1. Make sure you reconnected Instagram (Step 1)
2. Refresh the page
3. Check browser console for errors
4. Clear browser cache

### AI Not Replying to DMs
1. **Verify Webhook**: Make sure webhook is configured in Facebook Developer Console
2. **Check Logs**: Run `vercel logs --follow` and send a test DM
3. **Verify Permissions**: Make sure your Facebook app has `instagram_manage_messages` permission
4. **Test Webhook**: Go to Facebook Developer Console → Webhooks → Test

### "Webhook Not Active" Indicator
1. Webhook URL must be EXACTLY: `https://salespilots-backup.vercel.app/api/webhook/instagram/enhanced`
2. Verify Token must be: `salespilots_webhook_2024`
3. Check Facebook app is in Live mode OR you're added as developer/tester

## 🎯 Quick Verification Checklist:

- [ ] Instagram reconnected via dashboard
- [ ] UI shows "LIVE" badge and green indicators
- [ ] Webhook configured in Facebook Developer Console
- [ ] Webhook subscribed to `messages` field
- [ ] Test DM sent from another account
- [ ] AI response received

## 📱 Production Webhook URLs:

```
Main Webhook (Enhanced):
https://salespilots-backup.vercel.app/api/webhook/instagram/enhanced

Backup Webhook (Simple):
https://salespilots-backup.vercel.app/api/webhook/instagram

Verification Token:
salespilots_webhook_2024
```

## 🚀 Next Steps:

### 1. Add Products
Go to **Dashboard → Products** and add your product catalog

### 2. Setup Payment
Go to **Dashboard → Payment Upload** and configure Razorpay QR codes

### 3. Customize AI
Go to **Dashboard → AI Setup** to customize AI responses

### 4. Monitor Performance
Go to **Dashboard → Overview** to see AI performance metrics

## 💡 Pro Tips:

1. **Test Thoroughly**: Send various types of messages to test AI responses
2. **Monitor Logs**: Keep `vercel logs --follow` running during initial testing
3. **Check Analytics**: Monitor message stats in the integrations dashboard
4. **Update Products**: Keep your product catalog up-to-date for accurate AI responses
5. **Response Style**: AI adapts to customer language automatically

## 📞 Support:

If AI still doesn't reply after following all steps:

1. Share Vercel logs: `vercel logs --follow`
2. Check Facebook webhook test results
3. Verify all environment variables are set
4. Ensure Instagram Business account is properly linked to Facebook page

---

**Your Instagram AI Auto-Reply is ready! 🎉**

Just reconnect Instagram and configure the webhook - AI will handle the rest!

