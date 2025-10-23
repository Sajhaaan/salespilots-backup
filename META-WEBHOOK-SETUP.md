# 🔧 Meta Webhook Setup - FIXED!

## ✅ Issue Resolved

**Problem:** 404 Page Not Found at `https://salespilots-backup.vercel.app/api/webhook`

**Solution:** Created a unified webhook endpoint at `/api/webhook/route.ts` that handles:
- ✅ Instagram messages
- ✅ Messenger (Facebook Page) messages  
- ✅ WhatsApp messages
- ✅ Webhook verification (GET requests)
- ✅ Event handling (POST requests)

---

## 🚀 Quick Setup

### Step 1: Verify the Endpoint Works

Test the webhook verification endpoint:

```bash
curl "https://salespilots-backup.vercel.app/api/webhook?hub.mode=subscribe&hub.verify_token=salespilots_webhook_2024&hub.challenge=test123"
```

**Expected Response:** `test123`

✅ If you see `test123` - Your endpoint is working!
❌ If you see an error - Check Vercel deployment

### Step 2: Configure in Meta Developer Dashboard

#### For Instagram:

1. **Go to your Facebook App:**
   - https://developers.facebook.com/apps/YOUR_APP_ID/webhooks/

2. **Add/Edit Instagram Webhook:**
   - Click on "Instagram" section
   - Click "Edit" or "Add Subscription"

3. **Enter these values:**
   ```
   Callback URL: https://salespilots-backup.vercel.app/api/webhook
   Verify Token: salespilots_webhook_2024
   ```

4. **Click "Verify and Save"**
   - Should show ✅ **"Webhook is active"** with green checkmark

5. **Subscribe to fields:**
   - ✅ messages
   - ✅ messaging_postbacks
   - ✅ message_deliveries
   - ✅ message_reads

6. **Click "Save"**

#### For Messenger (Facebook Page):

1. **Same Facebook App Dashboard**

2. **Add/Edit Page Webhook:**
   - Click on "Page" or "Messenger" section
   - Click "Edit" or "Add Subscription"

3. **Enter same values:**
   ```
   Callback URL: https://salespilots-backup.vercel.app/api/webhook
   Verify Token: salespilots_webhook_2024
   ```

4. **Subscribe to fields:**
   - ✅ messages
   - ✅ messaging_postbacks
   - ✅ message_deliveries
   - ✅ message_reads

### Step 3: Subscribe Your Pages

**Important:** After webhook is verified, you need to subscribe your pages:

1. Go to **Messenger/Instagram Settings** in your app
2. Under "Webhooks" section, find your pages
3. Click "Add Subscriptions" for each page
4. Select the same fields (messages, messaging_postbacks, etc.)
5. Click "Subscribe"

---

## 🧪 Testing

### Test 1: Verify Endpoint is Live

```bash
# Test GET (verification)
curl "https://salespilots-backup.vercel.app/api/webhook?hub.mode=subscribe&hub.verify_token=salespilots_webhook_2024&hub.challenge=test123"

# Expected: test123
```

### Test 2: Send Test Webhook Event

```bash
# Test POST (message event)
curl -X POST "https://salespilots-backup.vercel.app/api/webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "object": "instagram",
    "entry": [{
      "messaging": [{
        "sender": {"id": "test_user_123"},
        "message": {"text": "Hello!", "mid": "test_mid"}
      }]
    }]
  }'

# Expected: {"status":"ok"}
```

### Test 3: Check Vercel Logs

```bash
# View real-time logs
vercel logs --follow

# Look for:
✅ Webhook verified successfully
📨 Webhook event received
💬 Processing Instagram message
```

### Test 4: Send Real Instagram Message

1. Open Instagram mobile app
2. Send a DM to your connected business account
3. Type: "Hi, what products do you have?"
4. Wait 2-5 seconds
5. Should receive AI response (if auto-reply is enabled)

---

## 🔍 What the Endpoint Does

### GET Request (Verification)
```
GET /api/webhook?hub.mode=subscribe&hub.verify_token=XXX&hub.challenge=YYY

→ Checks if verify_token matches
→ Returns challenge if valid
→ Returns 403 if invalid
```

### POST Request (Events)
```
POST /api/webhook
Body: { "object": "instagram", "entry": [...] }

→ Identifies platform (instagram/page/whatsapp)
→ Routes to appropriate handler
→ Processes messages with AI
→ Sends auto-reply if enabled
→ Always returns 200 OK
```

---

## 📋 Environment Variables Required

Make sure these are set in Vercel:

```bash
# Instagram/Meta
INSTAGRAM_WEBHOOK_TOKEN=salespilots_webhook_2024
INSTAGRAM_PAGE_ACCESS_TOKEN=your_page_access_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_business_account_id
INSTAGRAM_PAGE_ID=your_page_id

# Optional (for fallback)
INSTAGRAM_CONNECTED=true
INSTAGRAM_USERNAME=your_username
```

**Check in Vercel:**
1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Verify `INSTAGRAM_WEBHOOK_TOKEN` is set to `salespilots_webhook_2024`
3. Add if missing, redeploy if changed

---

## 🎯 Features of the New Endpoint

### ✅ Multi-Platform Support
- Handles Instagram, Messenger, and WhatsApp in one endpoint
- Auto-routes based on `object` field in webhook payload

### ✅ Proper Verification
- Responds to Meta's GET verification correctly
- Returns challenge token on successful verification
- Returns proper error codes on failure

### ✅ Event Processing
- Logs all incoming events
- Processes Instagram DMs with AI
- Saves messages to database
- Sends auto-replies when enabled

### ✅ Error Handling
- Always returns 200 OK to avoid Meta retries
- Comprehensive logging for debugging
- Graceful fallbacks for missing data

### ✅ Auto-Reply Integration
- Checks if auto-reply is enabled per user
- Generates AI responses using OpenAI
- Sends responses via Instagram API
- Logs all interactions

---

## 🐛 Troubleshooting

### Issue: Verification fails in Meta Dashboard

**Error:** "The callback URL or verify token couldn't be validated"

**Solutions:**
1. Check URL is exactly: `https://salespilots-backup.vercel.app/api/webhook`
2. Check verify token is exactly: `salespilots_webhook_2024`
3. Test endpoint manually with curl (see Test 1)
4. Check Vercel deployment is successful
5. Verify `INSTAGRAM_WEBHOOK_TOKEN` env var is set

### Issue: Verification succeeds but no events received

**Possible Causes:**
- Page not subscribed to webhook
- App is in Development Mode (only works for test users)
- Wrong page is subscribed

**Solutions:**
1. Complete Step 3 (Subscribe Your Pages)
2. Add yourself as test user in Facebook App
3. Verify correct page is connected to app

### Issue: Events received but no AI response

**Checklist:**
- ✅ Instagram connected (check integrations page)
- ✅ Auto-reply enabled (check integrations page)
- ✅ Test message sent from different account
- ✅ Products exist in database (AI needs products to recommend)

**Debug:**
```bash
# Check Vercel logs
vercel logs --follow

# Look for these messages:
"📨 Webhook event received"
"✅ Found business user"
"🤖 Auto-reply enabled: true"
"✅ AI response sent successfully"
```

### Issue: 404 Not Found

**This should be fixed!** But if you still see 404:

1. **Check file location:**
   - File must be at: `app/api/webhook/route.ts`
   - NOT at: `pages/api/webhook.ts` (old Next.js structure)

2. **Verify Vercel deployment:**
   ```bash
   vercel --prod
   ```

3. **Check build logs** for errors

4. **Clear Vercel cache:**
   - Vercel Dashboard → Your Project → Settings → Clear Cache
   - Redeploy

---

## ✅ Success Checklist

Your webhook is properly configured when:

1. ✅ Curl test returns `test123`
2. ✅ Meta Dashboard shows "Webhook is active" with green checkmark
3. ✅ Pages are subscribed to webhook
4. ✅ Test message triggers webhook event (visible in Vercel logs)
5. ✅ AI response is sent back to Instagram (if auto-reply enabled)

---

## 📚 Additional Resources

### Webhook Endpoints Available:

1. **Unified Endpoint (USE THIS):**
   - `https://salespilots-backup.vercel.app/api/webhook`
   - Handles all Meta platforms (Instagram, Messenger, WhatsApp)

2. **Legacy Instagram Endpoint:**
   - `https://salespilots-backup.vercel.app/api/webhook/instagram/enhanced`
   - Instagram-specific (kept for backward compatibility)

3. **WhatsApp Endpoint:**
   - `https://salespilots-backup.vercel.app/api/webhook/whatsapp`
   - WhatsApp-specific

### Meta Documentation:
- [Instagram Webhooks](https://developers.facebook.com/docs/instagram-api/guides/webhooks)
- [Messenger Webhooks](https://developers.facebook.com/docs/messenger-platform/webhooks)
- [Webhook Verification](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests)

---

## 🎉 Summary

**What Was Fixed:**
- ✅ Created `/api/webhook` endpoint (was missing)
- ✅ Implemented proper GET verification handler
- ✅ Implemented POST event handler
- ✅ Added multi-platform support
- ✅ Integrated with existing AI auto-reply system

**What You Need to Do:**
1. Deploy to Vercel (if not auto-deployed)
2. Test verification endpoint with curl
3. Configure webhook in Meta Developer Dashboard
4. Subscribe your pages to the webhook
5. Test with real Instagram message

**Result:**
🎉 Meta will show "Webhook is active" with green checkmark, and your AI auto-reply will work!

