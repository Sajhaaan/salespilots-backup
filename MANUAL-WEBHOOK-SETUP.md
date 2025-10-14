# 📱 Manual Instagram Webhook Setup Guide

## ⚠️ Issue: API subscription failing due to token issues

You need to configure webhooks **manually in Facebook App Dashboard**.

---

## 🔧 Step-by-Step Instructions

### Step 1: Go to Facebook App Webhooks

1. Open: https://developers.facebook.com/apps/1280229966759706/webhooks/
2. Login if needed

### Step 2: Configure Instagram Webhook

1. In Webhooks page, find **"Instagram"** section
2. Click **"Edit"** or **"Add Subscription"**

3. **Enter these details:**
   ```
   Callback URL: https://salespilots-backup.vercel.app/api/webhook/instagram/enhanced
   Verify Token: salespilots_webhook_2024
   ```

4. Click **"Verify and Save"**
   - It should show ✅ "Verified" in green

### Step 3: Subscribe to Webhook Fields

1. After verification, you'll see subscription fields
2. **Check these boxes:**
   - ✅ `messages`
   - ✅ `messaging_postbacks` 
   - ✅ `message_deliveries`
   - ✅ `message_reads`

3. Click **"Save"** or **"Subscribe"**

### Step 4: Link Instagram Page to App

1. Go to: https://developers.facebook.com/apps/1280229966759706/messenger/settings/
2. Under **"Access Tokens"**, find your Instagram page:
   - **salespilot.io** (Page ID: 814775701710858)
3. Click **"Add or Remove Pages"**
4. Make sure **salespilot.io** is selected
5. Grant all permissions

### Step 5: Subscribe Page to App (Important!)

1. Go to: https://developers.facebook.com/apps/1280229966759706/messenger/settings/
2. Scroll down to **"Webhooks"**
3. Find **salespilot.io** page
4. Click **"Add Subscriptions"** button
5. Select all fields:
   - ✅ messages
   - ✅ messaging_postbacks
   - ✅ message_deliveries
   - ✅ message_reads
6. Click **"Subscribe"**

---

## ✅ Verify Setup

### Test Webhook (in Terminal):

```bash
curl "https://salespilots-backup.vercel.app/api/webhook/instagram/enhanced?hub.mode=subscribe&hub.verify_token=salespilots_webhook_2024&hub.challenge=test123"
```

**Expected result:** `test123`

### Test Real Message:

1. **Add yourself as Test User:**
   - Go to: https://developers.facebook.com/apps/1280229966759706/roles/test-users/
   - Click "Add Test Users"
   - Login to Instagram with that test account

2. **Send Instagram DM:**
   - Open Instagram app on phone (as test user)
   - Go to @salespilots.io
   - Send: "Hi, what products do you have?"
   - **Wait 2-3 seconds**
   - ✅ Should get AI response!

---

## 🔍 Troubleshooting

### "Webhook Verification Failed"
- Make sure callback URL is exactly: `https://salespilots-backup.vercel.app/api/webhook/instagram/enhanced`
- Make sure verify token is exactly: `salespilots_webhook_2024`
- No extra spaces or characters

### "No Messages Received"
- Your app is in **Development Mode** → only test users can send messages
- Make sure you're logged in as:
  - App developer (you)
  - OR App tester
  - OR Test user
- Check Test Events: https://developers.facebook.com/apps/1280229966759706/webhooks/test-events/

### "Page Not Found in Messenger Settings"
- Go to App Dashboard → Instagram → Basic Display
- Make sure Instagram account is still connected
- Try reconnecting from your dashboard: https://salespilots-backup.vercel.app/dashboard/integrations

---

## 📋 Checklist

Before testing, verify:

- [ ] Webhook URL configured in Facebook App
- [ ] Verify token is `salespilots_webhook_2024`
- [ ] Webhook shows "✅ Verified" in green
- [ ] All message fields subscribed (messages, postbacks, etc.)
- [ ] Page is added to app under Messenger Settings
- [ ] Page has webhook subscriptions enabled
- [ ] You're testing as test user or developer
- [ ] Using Instagram mobile app (not desktop)

---

## 🆘 Alternative: Reconnect Instagram

If webhook still doesn't work:

1. Go to: https://salespilots-backup.vercel.app/dashboard/integrations
2. Click **"Disconnect"** on Instagram
3. Wait 10 seconds
4. Click **"Connect Instagram"** again
5. Authorize with all permissions
6. **Immediately after connecting**, run these commands:

```bash
# Get new access token from database
cat /Users/sajhan/Desktop/salespilots-backup-main/data/users.json | python3 -c "import sys, json; data=json.load(sys.stdin); user=[u for u in data if u.get('instagramConnected')][0]; print(user['instagramConfig']['pageAccessToken'])"

# Then manually configure webhook in Facebook App Dashboard (steps above)
```

---

## ✨ Success Indicators

When working correctly, you'll see:

1. **In Facebook Webhooks Dashboard:**
   - Instagram webhook: ✅ Verified
   - Subscriptions: ✅ Active (messages, postbacks, etc.)

2. **In App:**
   - Integration page shows: 🟢 LIVE
   - Shows Instagram handle: @salespilots.io
   - AI Auto-Reply: ON

3. **When testing:**
   - Send Instagram DM from mobile
   - Get AI response within 2-3 seconds
   - Check dashboard → Messages tab → See conversation

---

**Important Notes:**
- Facebook App in Development Mode only accepts messages from test users/developers
- Desktop Instagram might not trigger webhooks - always test from mobile app
- Webhooks can take 1-2 minutes to activate after configuration
- Check "Test Events" in Facebook dashboard to see if webhooks are being sent

