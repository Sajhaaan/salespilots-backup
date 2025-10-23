# 🔔 Instagram Webhook Setup Checklist

## ✅ When You Connect Instagram Again

After you reconnect Instagram (by adding the environment variables back), you need to ensure the webhook is configured in Meta Developer Console:

---

## 📋 Step-by-Step Webhook Setup

### 1. **Go to Meta Developer Console**
   - URL: https://developers.facebook.com/apps
   - Select your Facebook App

### 2. **Navigate to Webhooks**
   - Left sidebar → Products → Webhooks
   - Or add Webhooks product if not already added

### 3. **Configure Instagram Webhook**
   - Click "Instagram" in the webhook products list
   - Click "Edit Subscription" or "Configure"

### 4. **Set Callback URL**
   ```
   https://salespilots-backup.vercel.app/api/webhook/instagram/enhanced
   ```

### 5. **Set Verify Token**
   - Use the same value as your `WEBHOOK_VERIFY_TOKEN` environment variable
   - Example: `my_secret_verify_token_123`

### 6. **Subscribe to Events**
   Select these fields:
   - ✅ `messages` - Receive customer messages
   - ✅ `messaging_postbacks` - Button interactions
   - ✅ `messaging_optins` - Message opt-ins
   - ✅ `messaging_optouts` - Message opt-outs

### 7. **Save and Verify**
   - Click "Verify and Save"
   - Meta will send a GET request to verify your webhook
   - If successful, you'll see a green checkmark ✅

---

## 🧪 Test Your Webhook

### Option 1: Use Meta's Test Button
1. In Meta Developer Console → Webhooks
2. Find your Instagram webhook
3. Click "Test" button
4. Send a test message event
5. Check Vercel logs for: `📨 Enhanced Instagram webhook received`

### Option 2: Send a Real Instagram DM
1. Go to your Instagram Business account
2. Send a DM from another account
3. Your AI should respond automatically
4. Check Vercel logs to verify

---

## 🔍 Verify Webhook is Working

**Check Vercel Logs:**
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Click "Logs" tab
4. Send a test DM
5. Look for these log messages:
   ```
   📨 Enhanced Instagram webhook received
   📨 Processing enhanced Instagram message
   ✅ Instagram status updated
   📤 Sending response with credentials
   ```

---

## 🌐 Your Webhook Endpoints

**Main Webhook (AI Auto-Reply):**
- `POST https://salespilots-backup.vercel.app/api/webhook/instagram/enhanced`
- `GET https://salespilots-backup.vercel.app/api/webhook/instagram/enhanced` (verification)

**Test Webhook:**
- `POST https://salespilots-backup.vercel.app/api/test/webhook-dm`

---

## ⚙️ Required Environment Variables

Make sure these are set in Vercel:

```bash
# Instagram Credentials (from Meta)
INSTAGRAM_PAGE_ID=your_page_id
INSTAGRAM_PAGE_ACCESS_TOKEN=your_page_access_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_business_account_id
INSTAGRAM_USERNAME=salespilots.io

# Facebook App Credentials
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
NEXT_PUBLIC_FACEBOOK_APP_ID=your_app_id

# Webhook Security
WEBHOOK_VERIFY_TOKEN=your_custom_verify_token

# AI Engine
BYTEZ_API_KEY=your_bytez_api_key
```

---

## 🚨 Common Issues & Solutions

### Issue: Webhook verification fails
**Solution:**
- Ensure `WEBHOOK_VERIFY_TOKEN` matches exactly in both Vercel and Meta
- Check that your webhook endpoint is accessible (not behind auth)
- Verify the URL is correct: `/api/webhook/instagram/enhanced`

### Issue: Messages received but no AI response
**Solution:**
- Check Vercel logs for errors
- Verify `BYTEZ_API_KEY` is set
- Ensure `INSTAGRAM_PAGE_ACCESS_TOKEN` is valid
- Check that AI Auto-Reply is enabled (green button)

### Issue: "Webhook Active" not showing in dashboard
**Solution:**
- Webhook status in dashboard is just an indicator
- The actual webhook works if Meta verification succeeded
- Send a test DM to verify it's working

---

## 📊 What Happens When Someone DMs You

```
1. Customer sends Instagram DM
   ↓
2. Meta forwards to: /api/webhook/instagram/enhanced
   ↓
3. Webhook extracts message data
   ↓
4. Finds/creates customer in database
   ↓
5. Processes message with Bytez AI (GPT-4o)
   ↓
6. AI generates intelligent response based on:
   - Message intent
   - Available products
   - Language detection
   - Context
   ↓
7. Sends reply via Instagram API
   ↓
8. Customer receives instant AI response
```

---

## ✅ Success Indicators

When everything is working:
- ✅ Meta webhook shows green checkmark
- ✅ Dashboard shows "Webhook Active"
- ✅ Test DMs get instant AI responses
- ✅ Vercel logs show webhook events
- ✅ Messages appear in dashboard
- ✅ No errors in console

---

## 🎯 Next Steps After Reconnecting

1. **Add environment variables** to Vercel
2. **Redeploy** your application
3. **Configure webhook** in Meta Developer Console
4. **Test** by sending a DM to your Instagram
5. **Monitor** Vercel logs to ensure it's working
6. **Check dashboard** for messages and stats

---

**Last Updated**: October 23, 2025  
**Your Webhook URL**: `https://salespilots-backup.vercel.app/api/webhook/instagram/enhanced`

