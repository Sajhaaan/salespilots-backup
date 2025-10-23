# 🤖 Instagram DM Auto-Reply Setup Guide

## ✅ Current Status

### What's Working:
- ✅ Instagram connected
- ✅ Auto-reply enabled in database (`instagram_auto_reply: true`)
- ✅ Instagram config with access token present
- ✅ OpenAI API key configured
- ✅ Webhook endpoint created (`/api/webhook/instagram/enhanced`)

### What Needs to be Done:

## 🔧 Required Setup Steps

### 1. **Register Webhook with Meta** (CRITICAL)
The webhook URL needs to be registered in Meta's Developer Console.

**Steps:**
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Select your App → **Instagram** → **Webhooks**
3. Click **Configure** on Instagram
4. Add webhook URL:
   ```
   https://yourdomain.com/api/webhook/instagram/enhanced
   ```
   Or for local testing with ngrok:
   ```
   https://your-ngrok-url.ngrok.io/api/webhook/instagram/enhanced
   ```

5. Set **Verify Token**: `your_instagram_webhook_token` (from env vars)
6. Subscribe to events:
   - ✅ `messages`
   - ✅ `messaging_postbacks`
   - ✅ `messaging_optins`

### 2. **Test Webhook Connection**

#### Using Local Development (ngrok):
```bash
# Install ngrok
brew install ngrok

# Start your dev server on port 3000
npm run dev

# In another terminal, start ngrok
ngrok http 3000

# Copy the https URL (e.g., https://abc123.ngrok.io)
# Use this URL in Meta Developer Console
```

#### Test webhook verification:
```bash
curl "http://localhost:3000/api/webhook/instagram/enhanced?hub.mode=subscribe&hub.verify_token=your_instagram_webhook_token&hub.challenge=test123"
```

Expected response: `test123`

### 3. **Environment Variables Checklist**

Make sure these are in your `.env.local`:

```env
# Instagram
INSTAGRAM_CONNECTED=true
INSTAGRAM_PAGE_ID=814775701710858
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841476127558824
INSTAGRAM_PAGE_ACCESS_TOKEN=<your-token>
INSTAGRAM_WEBHOOK_TOKEN=<your-webhook-token>

# OpenAI (for AI responses)
OPENAI_API_KEY=<your-key>

# Database
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
```

### 4. **Test AI Auto-Reply Locally**

Send a test message to your webhook:

```bash
curl -X POST http://localhost:3000/api/webhook/instagram/enhanced \
  -H "Content-Type: application/json" \
  -d '{
    "object": "instagram",
    "entry": [{
      "id": "your-page-id",
      "time": 1234567890,
      "messaging": [{
        "sender": {"id": "test-user-123"},
        "recipient": {"id": "your-page-id"},
        "timestamp": 1234567890,
        "message": {
          "mid": "test-mid",
          "text": "Hello, I want to buy a product"
        }
      }]
    }]
  }'
```

Check server logs for:
```
📨 Enhanced Instagram webhook received
📨 Message from test-user-123: Hello, I want to buy a product
✅ Found business user
🤖 Generating AI response
```

### 5. **Common Issues & Fixes**

#### Issue: "No business user with Instagram connected found"
**Fix:** Check database user has:
- `instagram_connected: true`
- `instagram_auto_reply: true`
- `instagram_config` object with access token

#### Issue: "Access token expired"
**Fix:** Reconnect Instagram via Facebook Login to get new token

#### Issue: "Webhook not receiving messages"
**Fix:** 
1. Check webhook is registered in Meta Console
2. Verify webhook URL is publicly accessible (use ngrok for local)
3. Check webhook subscriptions include `messages` event

#### Issue: "AI not generating responses"
**Fix:**
1. Verify `OPENAI_API_KEY` is set
2. Check OpenAI API quota/billing
3. Check server logs for API errors

### 6. **Production Deployment**

Once working locally, deploy to production:

1. **Deploy to Vercel/Production**
   ```bash
   vercel --prod
   ```

2. **Update Meta Webhook URL**
   - Replace ngrok URL with production URL
   - Example: `https://your-domain.vercel.app/api/webhook/instagram/enhanced`

3. **Set Environment Variables in Vercel**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all required env vars

4. **Test Production Webhook**
   ```bash
   curl "https://your-domain.vercel.app/api/webhook/instagram/enhanced?hub.mode=subscribe&hub.verify_token=your_token&hub.challenge=test"
   ```

## 📊 Monitoring & Debugging

### Check Webhook Status:
Visit: `http://localhost:3000/dashboard/integrations`

Should show:
- ✅ Webhook Active (green)
- ✅ AI Ready (blue)
- ✅ Auto-Reply ON (green button)

### Server Logs to Watch:
```bash
npm run dev
```

Look for:
- `📨 Enhanced Instagram webhook received`
- `✅ Found business user`
- `🤖 Generating AI response`
- `✅ Response sent to Instagram`

### Test Instagram DMs:
1. Open Instagram app
2. Send DM to @salespilots.io (your connected account)
3. Should receive auto-reply within 2-3 seconds

## 🚀 Quick Start Checklist

- [ ] Webhook URL registered in Meta Developer Console
- [ ] Webhook subscribed to `messages` event
- [ ] Environment variables configured
- [ ] OpenAI API key active and has quota
- [ ] Database user has `instagram_auto_reply: true`
- [ ] Access token not expired (refresh if needed)
- [ ] Test webhook verification endpoint
- [ ] Test sending message to webhook
- [ ] Check server logs for errors
- [ ] Test real Instagram DM

## 📝 Next Steps

1. **Set up ngrok for local testing** (if not in production yet)
2. **Register webhook in Meta Console**
3. **Send test DM to your Instagram account**
4. **Monitor server logs**
5. **Deploy to production when working**

---

**Need Help?** Check server logs at `npm run dev` for detailed error messages.

