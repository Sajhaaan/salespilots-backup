# 🔧 Instagram Webhook Setup - Step by Step

## ✅ UPDATE: Webhook Endpoint Fixed!

**NEW:** The webhook is now available at `/api/webhook` (the root endpoint Meta expects).

**Previous Issue:** 404 Not Found - Now RESOLVED ✅

---

## Why This is Needed
The "Webhook Active" badge won't show until Facebook is configured to send Instagram messages to your app. This is a **required** step for AI auto-reply to work.

---

## 📋 Setup Steps

### Step 0: Test the Endpoint (RECOMMENDED)

Before configuring in Meta, verify the endpoint works:

```bash
# Quick test
curl "https://salespilots-backup.vercel.app/api/webhook?hub.mode=subscribe&hub.verify_token=salespilots_webhook_2024&hub.challenge=test123"

# Expected response: test123
```

✅ If you see `test123`, proceed to Step 1!

**OR** run the full test suite:
```bash
cd /Users/sajhan/Desktop/salespilots-backup-main
./test-webhook.sh
```

### Step 1: Find Your Facebook App ID

First, you need to know which Facebook App you're using:

1. Check your environment variables for `FACEBOOK_APP_ID` or `INSTAGRAM_APP_ID`
2. OR check the integrations page - it might show in the error messages
3. Common locations:
   - Vercel Dashboard → Your Project → Settings → Environment Variables
   - Your `.env` file

**Example App IDs from your project:**
- `1280229966759706` (if using this one)
- `605299205567693` (alternative)

### Step 2: Go to Facebook Webhooks Page

1. Open: `https://developers.facebook.com/apps/YOUR_APP_ID/webhooks/`
   
   Replace `YOUR_APP_ID` with your actual Facebook App ID
   
   **Quick Links** (try both if unsure):
   - https://developers.facebook.com/apps/1280229966759706/webhooks/
   - https://developers.facebook.com/apps/605299205567693/webhooks/

2. Login to Facebook if prompted

### Step 3: Configure Instagram Webhook

1. On the Webhooks page, look for **"Instagram"** section
   
2. Click **"Edit"** or **"Add Subscription"** button

3. You'll see a form with two fields:

   **Callback URL:**
   ```
   https://salespilots-backup.vercel.app/api/webhook
   ```
   
   **Verify Token:**
   ```
   salespilots_webhook_2024
   ```

   **⚠️ Important:** Use `/api/webhook` (NOT `/api/webhook/instagram/enhanced`)

4. Click **"Verify and Save"**
   
   ✅ You should see "Verified" in green
   ❌ If you see an error, check that the URL is correct

### Step 4: Subscribe to Webhook Fields

After verification, you'll see checkboxes for different event types:

**Check these boxes:**
- ✅ `messages` **(REQUIRED for AI to receive DMs)**
- ✅ `messaging_postbacks` (for button clicks)
- ✅ `message_deliveries` (to track delivery)
- ✅ `message_reads` (to track when user reads)
- ✅ `messaging_optins` (optional)
- ✅ `messaging_optouts` (optional)

Click **"Save"** or **"Subscribe"**

### Step 5: Subscribe Your Instagram Page to the App

**This is critical!** The webhook is configured, but you need to link your Instagram page to it:

1. Go to **Messenger Settings** (or Instagram Settings in newer versions):
   ```
   https://developers.facebook.com/apps/YOUR_APP_ID/messenger/settings/
   ```

2. Scroll down to the **"Webhooks"** section

3. You should see your Instagram-connected Facebook Page listed

4. Click **"Add Subscriptions"** or **"Subscribe"** button next to your page

5. A modal will appear - select the same fields:
   - ✅ messages
   - ✅ messaging_postbacks
   - ✅ message_deliveries
   - ✅ message_reads

6. Click **"Subscribe"**

### Step 6: Verify It Worked

#### Test 1: Webhook Verification Endpoint
Run this in your terminal:

```bash
curl "https://salespilots-backup.vercel.app/api/webhook?hub.mode=subscribe&hub.verify_token=salespilots_webhook_2024&hub.challenge=test123"
```

**Expected response:** `test123`

✅ If you see `test123` - Webhook endpoint is working!
❌ If you see an error - Check the URL

**Note:** The endpoint has been updated from `/api/webhook/instagram/enhanced` to `/api/webhook` (unified endpoint for all Meta platforms)

#### Test 2: Check Subscription Status

Go back to your integrations page:
1. Refresh the page (`Cmd+Shift+R`)
2. Click the "Refresh" button
3. The orange warning banner should disappear
4. You should now see:
   - ✅ "Webhook Active" badge (green)
   - ✅ "AI Ready" badge (blue)

---

## 🎯 Alternative: Use API to Subscribe Page (Advanced)

If the manual method doesn't work, try this:

```bash
# Get your page access token from the integrations page or database
PAGE_ID="your_page_id_here"
ACCESS_TOKEN="your_page_access_token_here"

# Subscribe the page
curl -X POST "https://graph.facebook.com/v18.0/${PAGE_ID}/subscribed_apps" \
  -d "subscribed_fields=messages,messaging_postbacks,message_deliveries,message_reads" \
  -d "access_token=${ACCESS_TOKEN}"
```

**Expected response:**
```json
{"success": true}
```

---

## 🐛 Troubleshooting

### Issue: "Verify and Save" fails with error

**Possible causes:**
1. **Wrong Callback URL** - Make sure it's exactly: `https://salespilots-backup.vercel.app/api/webhook/instagram/enhanced`
2. **Wrong Verify Token** - Must be: `salespilots_webhook_2024`
3. **Endpoint not responding** - Your app might be down

**Solution:**
- Double-check the URL (no trailing slashes)
- Test the verification endpoint (see Test 1 above)
- Check Vercel deployment is live

### Issue: Verification works but no messages received

**Possible causes:**
1. **Page not subscribed** - You completed Step 4 but not Step 5
2. **Wrong page subscribed** - Make sure it's your Instagram-connected page
3. **App in Development Mode** - Only works for test users/admins

**Solution:**
- Re-do Step 5 (Subscribe Your Page)
- Check Facebook App Dashboard → Roles → Test Users
- Add yourself as a test user if needed

### Issue: "Webhook Active" badge still not showing

**Possible causes:**
1. **Cache** - Browser hasn't refreshed
2. **Webhook check failing** - API can't verify subscription

**Solution:**
```bash
# Clear cache and hard refresh
Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

# Check webhook status directly
# Go to: https://salespilots-backup.vercel.app/api/integrations/instagram/webhook-status
```

### Issue: Badge shows but AI still not replying

**Checklist:**
- ✅ Instagram connected (check integrations page)
- ✅ Webhook configured (badge shows)
- ✅ AI Auto-Reply is ON (green button)
- ✅ Testing from correct account (test user if app is in dev mode)
- ✅ Sending to correct Instagram account (the one connected)

**Debug:**
```bash
# Check Vercel logs
vercel logs --follow

# Send a test message and look for:
"📨 Processing enhanced Instagram message"
"✅ Found user with Instagram connected"
"🤖 Auto-reply status: enabled: true"
"📤 Sending AI response"
```

---

## ✅ Success Checklist

You'll know it's working when:

1. ✅ Facebook App Webhooks page shows Instagram webhook as "Active" with green checkmark
2. ✅ Your Instagram page is listed under subscribed pages
3. ✅ Verification endpoint returns `test123`
4. ✅ Integrations page shows "Webhook Active" badge
5. ✅ No orange warning banner
6. ✅ Test Instagram DM receives AI response within 2-5 seconds

---

## 📞 Still Having Issues?

If webhook setup is failing:

1. **Check your Facebook App status:**
   - Is it approved? (Development mode vs Live mode)
   - Do you have the right permissions?
   - Is the Instagram product added to your app?

2. **Check your app deployment:**
   - Is Vercel deployment successful?
   - Are environment variables set correctly?
   - Is the webhook endpoint accessible?

3. **Try a different approach:**
   - Delete and re-add the webhook subscription
   - Use the Graph API Explorer to test manually
   - Check Facebook App Events for webhook events

---

## 🎉 Once It's Working

After successful setup:
- Messages to your Instagram will trigger webhooks
- Your AI will process them automatically (if auto-reply is ON)
- You'll see activity in the integrations dashboard
- Customers will receive instant AI responses

**Next Steps:**
1. Test with various message types
2. Monitor the logs for any errors
3. Adjust AI settings as needed
4. Enable auto-reply for production use

