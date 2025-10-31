# 🔧 Troubleshooting: Instagram AI Chatbot Not Working

## Quick Diagnostic

Visit: **`http://localhost:3000/api/debug/instagram-webhook`**  
or: **`https://yourdomain.com/api/debug/instagram-webhook`**

This will show you exactly what's wrong!

---

## Common Issues & Solutions

### Issue 1: "Everything is connected but bot isn't responding"

**Symptoms:**
- Instagram shows connected in dashboard
- Bytez API key is set
- But customers don't get AI responses

**Most Common Causes:**

#### A. Missing Environment Variables ⚠️

The webhook code needs these specific environment variables:

```bash
# These are REQUIRED for the chatbot to work:
BYTEZ_API_KEY=your_bytez_key
INSTAGRAM_PAGE_ACCESS_TOKEN=your_page_token  # ⚠️ CRITICAL
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_business_id  # ⚠️ CRITICAL
INSTAGRAM_WEBHOOK_TOKEN=your_webhook_token
INSTAGRAM_AUTO_REPLY_ENABLED=true
```

**Where to add them:**

1. **Vercel Dashboard:**
   - Go to your project
   - Settings → Environment Variables
   - Add each variable
   - **Click "Redeploy"** (critical step!)

2. **Local (.env.local):**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your values
   ```

#### B. Webhook Not Receiving Messages

**Test webhook is working:**
```bash
# 1. Test webhook verification
curl "https://yourdomain.com/api/webhook/instagram?hub.mode=subscribe&hub.challenge=TEST123&hub.verify_token=YOUR_WEBHOOK_TOKEN"

# Should return: TEST123

# 2. Check if webhook is subscribed in Meta Console
# Go to: developers.facebook.com → Your App → Webhooks
# Make sure "messages" is subscribed
```

**Fix webhook issues:**

1. **Verify webhook URL in Meta Developer Console:**
   - Must be: `https://yourdomain.com/api/webhook/instagram`
   - Must use HTTPS (not HTTP)
   - Must return 200 OK on verification

2. **Check webhook subscriptions:**
   - messages ✅
   - messaging_postbacks ✅
   - message_reads (optional)

3. **Verify webhook token matches:**
   - Token in Meta Console = INSTAGRAM_WEBHOOK_TOKEN in env vars

#### C. Instagram Permissions Missing

**Required permissions:**
- `pages_messaging`
- `instagram_basic`
- `instagram_manage_messages`
- `instagram_content_publish`

**How to check:**
1. Go to Meta Developer Console
2. Your App → Permissions
3. Verify all required permissions are granted

**How to fix:**
1. Click "Add Permissions"
2. Select missing permissions
3. Submit for review if needed
4. Some permissions are auto-approved for testing

---

### Issue 2: "Chatbot responds but messages are generic/wrong"

**Cause:** AI doesn't have your business context

**Fix:**

1. **Add products to dashboard:**
   ```
   Dashboard → Products → Add Product
   ```

2. **Set business information:**
   ```
   Dashboard → Settings
   - Business Name
   - Language Preference
   - Products
   ```

3. **Customize AI prompt:**
   Edit `lib/openai.ts` line 62-78 to match your business

---

### Issue 3: "Webhook receives messages but AI doesn't respond"

**Check logs for errors:**

```bash
# Vercel logs
vercel logs --prod

# Look for:
"📨 Instagram webhook received"  ✅ Good
"🤖 Generating AI response..."   ✅ Good
"❌ Bytez API Error"             ⚠️ Problem
"❌ Instagram API Error"         ⚠️ Problem
```

**Common error messages:**

#### Error: "BYTEZ_API_KEY environment variable is required"
```bash
# Fix: Add Bytez API key
# Vercel: Settings → Environment Variables → Add BYTEZ_API_KEY
# Then redeploy
```

#### Error: "Instagram not configured"
```bash
# Fix: Add Instagram environment variables
INSTAGRAM_PAGE_ACCESS_TOKEN=xxx
INSTAGRAM_BUSINESS_ACCOUNT_ID=xxx
# Then redeploy
```

#### Error: "Invalid OAuth access token"
```bash
# Cause: Page access token expired
# Fix: Regenerate token in Meta Developer Console
# Go to: Your App → Instagram → Basic Display
# Generate new long-lived token
# Update INSTAGRAM_PAGE_ACCESS_TOKEN in Vercel
# Redeploy
```

#### Error: "(#100) The parameter recipient is required"
```bash
# Cause: Missing recipient ID in webhook payload
# Check: Webhook is properly configured
# Verify: Instagram webhook is subscribed to "messages"
```

---

### Issue 4: "AI response generated but customer doesn't receive"

**Diagnosis:**

Test if you can send messages manually:

```bash
# Use test endpoint
curl -X POST https://yourdomain.com/api/test/send-instagram-message \
  -H "Content-Type: application/json" \
  -d '{
    "recipientId": "CUSTOMER_INSTAGRAM_ID",
    "message": "Test message"
  }'
```

**If manual sending works:**
- Problem is in webhook flow
- Check webhook logs
- Verify auto-reply is enabled

**If manual sending fails:**
- Problem is with Instagram API credentials
- Check page access token is valid
- Verify business account ID is correct
- Check permissions are granted

---

### Issue 5: "Everything was working, then stopped"

**Common causes:**

1. **Access token expired:**
   - Instagram tokens expire after 60 days
   - Solution: Generate new long-lived token
   - Update in Vercel environment variables

2. **Vercel redeployed without env vars:**
   - Check environment variables are still there
   - Re-add if missing
   - Redeploy

3. **Instagram permissions revoked:**
   - Check permissions in Meta Console
   - Re-authorize if needed

4. **Rate limits hit:**
   - Instagram limits: ~200 messages/hour
   - Solution: Wait or implement queue system

---

## Step-by-Step Debugging

### Step 1: Verify Configuration

Visit: `/api/debug/instagram-webhook`

Should show all ✅. If any ❌:
1. Fix that issue first
2. Redeploy
3. Check again

### Step 2: Test Webhook

```bash
# Test webhook responds
curl "https://yourdomain.com/api/webhook/instagram?hub.mode=subscribe&hub.challenge=TEST&hub.verify_token=YOUR_TOKEN"

# Should return: TEST
```

### Step 3: Send Test Instagram DM

1. Open Instagram app
2. Send DM to your business account: "Hi, testing the bot"
3. Wait 3-5 seconds
4. Should receive AI-powered response

### Step 4: Check Logs

```bash
# Vercel logs
vercel logs --prod --follow

# Local logs
npm run dev
```

**Expected log sequence:**
```
📨 Instagram webhook received
📨 Message from [ID]: Hi, testing the bot
✨ New customer created: [UUID]
🤖 Generating AI response...
✅ AI Response generated: Hello! Welcome to...
📤 Sending Instagram message to: [ID]
✅ Message sent successfully
```

**If you see errors, check error message and find solution above**

### Step 5: Verify Data Storage

```bash
# Check messages are being stored
cat data/messages.json | jq

# Check customers are being tracked
cat data/customers.json | jq
```

---

## Environment Variables Checklist

Copy this and verify each one:

```bash
# ✅ Required for AI
[ ] BYTEZ_API_KEY=xxx

# ✅ Required for Instagram API
[ ] INSTAGRAM_PAGE_ACCESS_TOKEN=xxx
[ ] INSTAGRAM_BUSINESS_ACCOUNT_ID=xxx

# ✅ Required for Webhook
[ ] INSTAGRAM_WEBHOOK_TOKEN=xxx

# ⚠️ Optional
[ ] INSTAGRAM_AUTO_REPLY_ENABLED=true

# After adding any variable:
[ ] Redeployed application
[ ] Waited for deployment to complete (2-3 minutes)
[ ] Tested chatbot
```

---

## Test Endpoints

### 1. Configuration Check
```
GET /api/debug/instagram-webhook
Shows what's configured and what's missing
```

### 2. Chatbot Status
```
GET /api/test/instagram-chatbot
Shows if chatbot is ready
```

### 3. Manual Message Send
```
POST /api/test/send-instagram-message
Send a test message manually
Body: { "recipientId": "...", "message": "..." }
```

---

## Quick Fixes

### Fix 1: Reset Everything

```bash
# 1. Verify all environment variables in Vercel
# 2. Redeploy
vercel --prod

# 3. Wait 2-3 minutes
# 4. Test
```

### Fix 2: Generate New Token

```bash
# 1. Go to Meta Developer Console
# 2. Your App → Instagram → Basic Display
# 3. Generate User Token
# 4. Exchange for long-lived token:

curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN"

# 5. Copy the returned access_token
# 6. Update INSTAGRAM_PAGE_ACCESS_TOKEN in Vercel
# 7. Redeploy
```

### Fix 3: Re-subscribe Webhook

```bash
# 1. Go to Meta Developer Console
# 2. Webhooks section
# 3. Edit Instagram webhook
# 4. Click "Test" on "messages"
# 5. Should see success
# 6. If fails, check webhook URL is correct
```

---

## Still Not Working?

### Check these in order:

1. **Environment variables set correctly?**
   - Visit `/api/debug/instagram-webhook`
   - All should show ✅

2. **Application redeployed after adding variables?**
   - Vercel doesn't apply new env vars until redeploy
   - Click "Redeploy" in Vercel dashboard

3. **Webhook configured in Meta Console?**
   - URL: `https://yourdomain.com/api/webhook/instagram`
   - Subscribed to: messages, messaging_postbacks

4. **Instagram permissions granted?**
   - Check in Meta Developer Console → Permissions
   - Must have: pages_messaging, instagram_manage_messages

5. **Tokens not expired?**
   - Generate new long-lived token
   - Update in environment variables

6. **Check Vercel logs for specific errors:**
   ```bash
   vercel logs --prod
   ```

---

## Get More Help

1. **Run diagnostics:**
   ```
   /api/debug/instagram-webhook
   ```

2. **Check logs:**
   ```bash
   vercel logs --prod --follow
   ```

3. **Test manual send:**
   ```
   /api/test/send-instagram-message
   ```

4. **Read setup guide:**
   ```
   INSTAGRAM-AI-CHATBOT-SETUP.md
   ```

5. **Quick start:**
   ```
   QUICK-START-AI-CHATBOT.md
   ```

---

*Last Updated: October 31, 2025*

