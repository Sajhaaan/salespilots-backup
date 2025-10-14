# 🔧 Instagram Webhook Not Replying - Fix Guide

## Problem
Instagram is connected, but AI chatbot isn't replying to messages.

## Root Cause
Facebook webhooks aren't configured or subscribed properly.

---

## ✅ Step-by-Step Fix

### 1. Verify Webhook URL in Facebook App

Go to: https://developers.facebook.com/apps/1280229966759706/webhooks/

**Callback URL should be:**
```
https://salespilots-backup.vercel.app/api/webhook/instagram/enhanced
```

**Verify Token should be:**
```
salespilots_webhook_2024
```

### 2. Subscribe to Instagram Webhook Fields

In the Facebook App Dashboard:

1. Go to **Webhooks** → **Instagram**
2. Click **Edit** on your webhook subscription
3. Make sure these fields are **CHECKED**:
   - ✅ `messages`
   - ✅ `messaging_postbacks`
   - ✅ `message_deliveries`
   - ✅ `message_reads`
4. Click **Save**

### 3. Re-Subscribe Page to Webhooks

**IMPORTANT**: Even if webhook is configured, you need to **subscribe the page**:

1. Go to: https://developers.facebook.com/apps/1280229956759706/messenger/settings/
2. Under **Webhooks**, find your Instagram page
3. Click **Subscribe** button
4. OR use this API call:

```bash
# Subscribe page to webhooks
curl -X POST "https://graph.facebook.com/v18.0/814775701710858/subscribed_apps" \
  -d "subscribed_fields=messages,messaging_postbacks,message_deliveries,message_reads" \
  -d "access_token=EAAImhDQhdM0BPvZBoTEYModuYHDerThLYmdtZAMZABnsAUextwZBCL5CQf0XwyXZCHrVNjxUjeLDoGgzA0Mx3SkK67QEGMGggpvbRTilPwAUcMUH516WR45Yx6Efz6RGjFFMCDEQyvT3495Mxe7et32wW1GXoNivPW74nrmJeH128eZCmFZBkEjWJgbnH9qpR5l0QtP"
```

### 4. Test Webhook Connection

```bash
# Test webhook verification
curl "https://salespilots-backup.vercel.app/api/webhook/instagram/enhanced?hub.mode=subscribe&hub.verify_token=salespilots_webhook_2024&hub.challenge=test123"

# Should return: test123
```

### 5. Test Message Simulation

Send this from your terminal to test the webhook:

```bash
curl -X POST "https://salespilots-backup.vercel.app/api/webhook/instagram/enhanced" \
  -H "Content-Type: application/json" \
  -d '{
    "object": "instagram",
    "entry": [{
      "id": "814775701710858",
      "time": '$(date +%s)'000,
      "messaging": [{
        "sender": { "id": "test_customer_123" },
        "recipient": { "id": "17841476127558824" },
        "timestamp": '$(date +%s)'000,
        "message": {
          "mid": "test_mid_'$(date +%s)'",
          "text": "Hi, what products do you have?"
        }
      }]
    }]
  }'
```

---

## 🔍 Debug Steps

### Check if Webhooks are Being Received

1. **Facebook Developer Tools** → **Test Events**
   - URL: https://developers.facebook.com/apps/1280229966759706/webhooks/test-events/
   - This shows recent webhook deliveries
   - Check if any events are being sent

2. **Check Webhook Subscriptions**
```bash
# Check current subscriptions
curl "https://graph.facebook.com/v18.0/814775701710858/subscribed_apps?access_token=EAAImhDQhdM0BPvZBoTEYModuYHDerThLYmdtZAMZABnsAUextwZBCL5CQf0XwyXZCHrVNjxUjeLDoGgzA0Mx3SkK67QEGMGggpvbRTilPwAUcMUH516WR45Yx6Efz6RGjFFMCDEQyvT3495Mxe7et32wW1GXoNivPW74nrmJeH128eZCmFZBkEjWJgbnH9qpR5l0QtP"
```

### Common Issues

❌ **"Page not subscribed"**
- Solution: Run the subscribe API call above (Step 3)

❌ **"Invalid verify token"**
- Solution: Make sure `INSTAGRAM_WEBHOOK_TOKEN=salespilots_webhook_2024` in Vercel

❌ **"Webhook URL unreachable"**
- Solution: Verify the callback URL is exactly: `https://salespilots-backup.vercel.app/api/webhook/instagram/enhanced`

❌ **"No webhook events received"**
- Solution: Make sure you're messaging from Instagram app (not desktop) and that your account is a **test user** or **developer** on the Facebook App

---

## ⚡ Quick Fix Commands

Run these in order:

```bash
# 1. Verify webhook is responding
curl "https://salespilots-backup.vercel.app/api/webhook/instagram/enhanced?hub.mode=subscribe&hub.verify_token=salespilots_webhook_2024&hub.challenge=test123"

# 2. Subscribe page to webhooks
curl -X POST "https://graph.facebook.com/v18.0/814775701710858/subscribed_apps" \
  -d "subscribed_fields=messages,messaging_postbacks,message_deliveries,message_reads" \
  -d "access_token=EAAImhDQhdM0BPvZBoTEYModuYHDerThLYmdtZAMZABnsAUextwZBCL5CQf0XwyXZCHrVNjxUjeLDoGgzA0Mx3SkK67QEGMGggpvbRTilPwAUcMUH516WR45Yx6Efz6RGjFFMCDEQyvT3495Mxe7et32wU1GXoNivPW74nrmJeH128eZCmFZBkEjWJgbnH9qpR5l0QtP"

# 3. Check subscription status
curl "https://graph.facebook.com/v18.0/814775701710858/subscribed_apps?access_token=EAAImhDQhdM0BPvZBoTEYModuYHDerThLYmdtZAMZABnsAUextwZBCL5CQf0XwyXZCHrVNjxUjeLDoGgzA0Mx3SkK67QEGMGggpvbRTilPwAUcMUH516WR45Yx6Efz6RGjFFMCDEQyvT3495Mxe7et32wU1GXoNivPW74nrmJeH128eZCmFZBkEjWJgbnH9qpR5l0QtP"
```

---

## 📱 Test with Real Instagram Messages

1. Open Instagram app on your phone
2. Go to **@salespilots.io** profile
3. Send a DM: "Hi, what products do you have?"
4. Wait 2-3 seconds
5. You should get AI response!

**Note**: Desktop Instagram DMs might not trigger webhooks. Always test from mobile app.

---

## ✅ Success Checklist

- [ ] Webhook URL configured in Facebook App
- [ ] Verify token set to `salespilots_webhook_2024`
- [ ] Instagram webhook fields subscribed (messages, etc.)
- [ ] Page subscribed to app (check subscriptions API)
- [ ] Webhook verification responds correctly
- [ ] Test from Instagram mobile app
- [ ] Check as test user or developer account

---

## 🆘 Still Not Working?

1. **Check Facebook App Review Status**
   - If app is in Development Mode, only test users/developers can trigger webhooks
   - Add yourself as a test user: https://developers.facebook.com/apps/1280229966759706/roles/test-users/

2. **Check Access Token Validity**
```bash
curl "https://graph.facebook.com/v18.0/debug_token?input_token=EAAImhDQhdM0BPvZBoTEYModuYHDerThLYmdtZAMZABnsAUextwZBCL5CQf0XwyXZCHrVNjxUjeLDoGgzA0Mx3SkK67QEGMGggpvbRTilPwAUcMUH516WR45Yx6Efz6RGjFFMCDEQyvT3495Mxe7et32wU1GXoNivPW74nrmJeH128eZCmFZBkEjWJgbnH9qpR5l0QtP&access_token=EAAImhDQhdM0BPvZBoTEYModuYHDerThLYmdtZAMZABnsAUextwZBCL5CQf0XwyXZCHrVNjxUjeLDoGgzA0Mx3SkK67QEGMGggpvbRTilPwAUcMUH516WR45Yx6Efz6RGjFFMCDEQyvT3495Mxe7et32wU1GXoNivPW74nrmJeH128eZCmFZBkEjWJgbnH9qpR5l0QtP"
```

3. **Re-subscribe Everything**
   - Disconnect Instagram from dashboard
   - Wait 10 seconds
   - Reconnect Instagram
   - Re-subscribe page using API call above

---

**Remember**: Facebook App in Development Mode only accepts messages from:
- App developers
- App testers
- Test users

Make sure you're messaging from one of these accounts!

