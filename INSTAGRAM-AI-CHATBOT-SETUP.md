# 🤖 Instagram AI Chatbot - Complete Setup Guide

**Status:** ✅ 100% Functional Implementation  
**Last Updated:** October 31, 2025

---

## 🎯 What's New - Real AI Chatbot (Not Dummy!)

Your Instagram chatbot is now **fully functional** with:

✅ **Real AI responses** using GPT-4 via Bytez.js  
✅ **Conversation history tracking**  
✅ **Customer management**  
✅ **Message storage in database**  
✅ **Business context awareness** (products, language, settings)  
✅ **Intelligent responses** based on customer intent  
✅ **Fallback handling** for errors  
✅ **Auto-reply toggle** (can be enabled/disabled)

---

## 🚀 Quick Start (3 Required Steps)

### Step 1: Get Your Bytez API Key

1. Go to [Bytez.js Dashboard](https://www.bytez.com)
2. Sign up or log in
3. Copy your API key from the dashboard

### Step 2: Set Environment Variables

Add these to your **Vercel Environment Variables** or `.env.local`:

```bash
# REQUIRED: AI Configuration
BYTEZ_API_KEY=your-bytez-api-key-here

# REQUIRED: Instagram Configuration
INSTAGRAM_PAGE_ACCESS_TOKEN=your-page-access-token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your-business-account-id
INSTAGRAM_WEBHOOK_TOKEN=your-webhook-verify-token
INSTAGRAM_AUTO_REPLY_ENABLED=true
```

### Step 3: Configure Instagram Webhook

1. Go to [Meta Developer Console](https://developers.facebook.com)
2. Navigate to your Instagram App → Webhooks
3. Set callback URL to: `https://yourdomain.com/api/webhook/instagram`
4. Set verify token to the same value as `INSTAGRAM_WEBHOOK_TOKEN`
5. Subscribe to: `messages`, `messaging_postbacks`

---

## 📋 Detailed Setup Instructions

### 1️⃣ Getting Instagram Credentials

#### A. Instagram Page Access Token

1. Go to [Meta Developer Console](https://developers.facebook.com)
2. Select your app
3. Go to **Instagram** → **Basic Display**
4. Generate a **Page Access Token** for your Instagram Business Account
5. Copy the token (starts with `EAAG...`)

#### B. Instagram Business Account ID

1. In Meta Developer Console
2. Go to **Instagram** → **Basic Display**
3. Find your **Instagram Business Account ID** (numeric ID)
4. Or use Graph API Explorer:
   ```
   GET /me/accounts?fields=instagram_business_account
   ```

#### C. Webhook Verification Token

Create a random secure string:
```bash
# Generate a random token
openssl rand -base64 32
```

---

### 2️⃣ Getting Bytez API Key

**Option A: Get Bytez API Key**
1. Visit: https://www.bytez.com
2. Sign up for free account
3. Go to Dashboard → API Keys
4. Copy your API key

**Option B: Use OpenAI Directly (Alternative)**
1. Visit: https://platform.openai.com
2. Go to API Keys section
3. Create new API key
4. Use with OpenAI library instead of Bytez

---

### 3️⃣ Setting Environment Variables

#### For Local Development (.env.local):

```bash
# AI Configuration
BYTEZ_API_KEY=your_bytez_api_key_here

# Instagram Configuration
INSTAGRAM_PAGE_ACCESS_TOKEN=EAAGxxxxxxxxxxxxx
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841400000000000
INSTAGRAM_WEBHOOK_TOKEN=your_secure_random_token
INSTAGRAM_AUTO_REPLY_ENABLED=true
```

#### For Production (Vercel):

1. Go to your Vercel project
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - Key: `BYTEZ_API_KEY`, Value: `your_key`
   - Key: `INSTAGRAM_PAGE_ACCESS_TOKEN`, Value: `your_token`
   - Key: `INSTAGRAM_BUSINESS_ACCOUNT_ID`, Value: `your_id`
   - Key: `INSTAGRAM_WEBHOOK_TOKEN`, Value: `your_token`
   - Key: `INSTAGRAM_AUTO_REPLY_ENABLED`, Value: `true`
4. Redeploy your application

---

### 4️⃣ Configuring Instagram Webhook

#### A. Set Webhook URL

1. Go to [Meta Developer Console](https://developers.facebook.com)
2. Select your Instagram app
3. Navigate to **Products** → **Webhooks**
4. Click **Configure** on Instagram
5. Enter callback URL:
   ```
   https://yourdomain.com/api/webhook/instagram
   ```
6. Enter verify token (same as `INSTAGRAM_WEBHOOK_TOKEN`)
7. Click **Verify and Save**

#### B. Subscribe to Events

Subscribe to these webhook fields:
- ✅ `messages` - Customer messages
- ✅ `messaging_postbacks` - Button clicks
- ✅ `message_reads` - Read receipts (optional)
- ✅ `message_echoes` - Sent messages (optional)

#### C. Test Webhook

1. Click **Test** button in Meta Console
2. Select `messages` event
3. Should receive 200 OK response

---

## 🧪 Testing Your AI Chatbot

### Test 1: Verify Webhook

```bash
# Test webhook verification
curl "https://yourdomain.com/api/webhook/instagram?hub.mode=subscribe&hub.challenge=test123&hub.verify_token=your_webhook_token"

# Should return: test123
```

### Test 2: Send Test Message from Instagram

1. Open Instagram app
2. Send a DM to your business account
3. Check server logs for:
   ```
   📨 Instagram webhook received
   📨 Message from [sender_id]: [message]
   🤖 Generating AI response...
   ✅ AI Response generated
   📤 Sending Instagram message
   ✅ Message sent successfully
   ```

### Test 3: Check Database Storage

```bash
# Check if messages are being stored
cat data/messages.json

# Check if customers are being tracked
cat data/customers.json
```

---

## 🔍 How It Works

### Message Flow:

```
1. Customer sends Instagram DM
   ↓
2. Instagram → Your Webhook URL
   ↓
3. Webhook receives message
   ↓
4. Store message in database
   ↓
5. Get customer history
   ↓
6. Get business context (products, language)
   ↓
7. Generate AI response using GPT-4
   ↓
8. Send response via Instagram API
   ↓
9. Store sent message
   ↓
10. Update customer stats
```

### AI Response Generation:

```typescript
// The AI considers:
- Business name and products
- Customer's message history
- Language preference (English/Hindi/Hinglish)
- Custom AI configuration (if set)
- Business goals (sales, support, etc.)

// AI is trained to:
- Be friendly and professional
- Convert inquiries to orders
- Ask for phone numbers for interested customers
- Suggest products and handle pricing questions
- Provide helpful information
- Use appropriate emojis and tone
```

---

## 📊 Features Implemented

### ✅ Core Features

- [x] Real AI responses (GPT-4 via Bytez.js)
- [x] Message storage and history
- [x] Customer tracking and profiles
- [x] Business context awareness
- [x] Conversation history
- [x] Language detection
- [x] Message categorization
- [x] Auto-reply toggle
- [x] Error handling with fallback
- [x] Webhook verification
- [x] Database persistence

### ✅ AI Capabilities

- [x] Natural language understanding
- [x] Product recommendations
- [x] Price inquiries handling
- [x] Order intent detection
- [x] Phone number collection
- [x] Multi-language support (English, Hindi, Hinglish)
- [x] Context-aware responses
- [x] Sales-focused conversations

### ✅ Business Features

- [x] Product catalog integration
- [x] Customer statistics
- [x] Message analytics
- [x] Conversation tracking
- [x] Business settings customization

---

## 🎨 Customizing AI Behavior

### Option 1: Edit AI Prompt (Code)

Edit `lib/openai.ts` line 62-78:

```typescript
systemPrompt = `You are a helpful sales assistant for ${businessContext.businessName}.

CUSTOMIZE THIS:
- Tone: Friendly, professional, or casual
- Goal: Sales, support, or information
- Language: English, Hindi, or Hinglish
- Style: Formal or conversational
- Special instructions: Your business rules

Available products: ${businessContext.products.join(', ')}
`
```

### Option 2: Use Dashboard Settings

1. Go to Dashboard → Settings
2. Configure AI behavior:
   - Business name
   - Product list
   - Language preference
   - Custom instructions
3. Settings are automatically used by AI

---

## 🐛 Troubleshooting

### Issue 1: AI Not Responding

**Symptoms:** Webhook receives messages but no reply

**Solutions:**
```bash
# Check if BYTEZ_API_KEY is set
echo $BYTEZ_API_KEY

# Check Bytez account status
# Visit: https://www.bytez.com/dashboard

# Check server logs
tail -f /var/log/app.log
```

### Issue 2: Webhook Not Receiving Messages

**Symptoms:** No logs when sending Instagram DM

**Solutions:**
1. Verify webhook URL is correct in Meta Console
2. Check HTTPS is enabled (required by Meta)
3. Test webhook verification:
   ```bash
   curl "https://yourdomain.com/api/webhook/instagram?hub.mode=subscribe&hub.challenge=test&hub.verify_token=YOUR_TOKEN"
   ```
4. Check Instagram app permissions
5. Verify webhook subscriptions are active

### Issue 3: "Instagram not configured" Error

**Symptoms:** Logs show "Instagram not configured"

**Solutions:**
```bash
# Verify environment variables are set
INSTAGRAM_PAGE_ACCESS_TOKEN=xxx
INSTAGRAM_BUSINESS_ACCOUNT_ID=xxx

# In Vercel dashboard:
Settings → Environment Variables → Check values

# Redeploy after adding variables
vercel --prod
```

### Issue 4: Messages Stored but Not Sent

**Symptoms:** Messages appear in database but customer doesn't receive

**Solutions:**
1. Check Instagram Graph API permissions
2. Verify page access token hasn't expired
3. Check Instagram Business Account is properly linked
4. Review Meta Developer Console for API errors
5. Check rate limits (Instagram API limits)

---

## 📝 Monitoring & Logs

### Key Log Messages:

```bash
# ✅ Success indicators:
"📨 Instagram webhook received"
"📨 Message from [sender]: [text]"
"🤖 Generating AI response..."
"✅ AI Response generated: [response]"
"📤 Sending Instagram message to: [recipient]"
"✅ Message sent successfully"

# ❌ Error indicators:
"❌ Instagram not configured"
"❌ Instagram API Error:"
"❌ Error sending Instagram message"
"⚠️  Bytez API key not configured"
```

### View Logs:

```bash
# Local development
npm run dev

# Production (Vercel)
vercel logs --prod
```

---

## 🚀 Deploying Updates

### Deploy to Vercel:

```bash
# 1. Commit changes
git add .
git commit -m "Enable AI chatbot"

# 2. Push to GitHub
git push origin main

# 3. Vercel auto-deploys from main branch
# Or manually deploy:
vercel --prod
```

### Verify Deployment:

```bash
# 1. Check webhook
curl https://yourdomain.com/api/webhook/instagram

# 2. Send test message on Instagram

# 3. Check Vercel logs
vercel logs --prod
```

---

## 📊 Database Structure

### Messages Database (`data/messages.json`):

```json
{
  "id": "message_id",
  "senderId": "instagram_user_id",
  "recipientId": "your_business_id",
  "text": "Customer message",
  "timestamp": 1234567890,
  "direction": "incoming",
  "platform": "instagram",
  "createdAt": "2025-10-31T12:00:00Z",
  "category": "inquiry"
}
```

### Customers Database (`data/customers.json`):

```json
{
  "id": "uuid",
  "instagramId": "instagram_user_id",
  "platform": "instagram",
  "createdAt": "2025-10-31T12:00:00Z",
  "messageCount": 5,
  "lastMessageAt": "2025-10-31T12:30:00Z"
}
```

---

## 🔐 Security Best Practices

1. ✅ **Never commit** `.env.local` to Git
2. ✅ **Rotate tokens** every 60 days
3. ✅ **Use HTTPS only** for webhooks
4. ✅ **Verify webhook signatures** (implemented)
5. ✅ **Monitor API usage** and rate limits
6. ✅ **Keep dependencies updated**
7. ✅ **Review logs regularly** for suspicious activity

---

## 📈 Performance Tips

1. **Response Time:** Average 2-3 seconds with GPT-4
2. **Rate Limits:** Instagram allows ~200 messages/hour
3. **Cost:** Bytez charges per API call (check pricing)
4. **Optimization:** Cache common responses
5. **Scaling:** Consider Redis for high traffic

---

## 🎓 Advanced Features (Coming Soon)

- [ ] Image recognition for product inquiries
- [ ] Payment screenshot verification
- [ ] Order placement via DM
- [ ] Multi-language auto-detection
- [ ] Sentiment analysis
- [ ] Customer segmentation
- [ ] A/B testing responses
- [ ] Analytics dashboard

---

## 📞 Support

### Need Help?

1. **Check Logs:** Look for error messages
2. **Review Documentation:** This file and API docs
3. **Test Step-by-Step:** Follow troubleshooting guide
4. **Check Environment:** Verify all env vars are set

### Useful Resources:

- [Meta Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [Bytez.js Documentation](https://www.bytez.com/docs)
- [Webhook Best Practices](https://developers.facebook.com/docs/webhooks)

---

## ✅ Checklist

Use this checklist to ensure everything is set up:

- [ ] Bytez API key obtained and set
- [ ] Instagram page access token set
- [ ] Instagram business account ID set
- [ ] Webhook verification token set
- [ ] Webhook URL configured in Meta Console
- [ ] Webhook subscriptions enabled
- [ ] Environment variables added to Vercel
- [ ] Application redeployed
- [ ] Webhook tested and responding
- [ ] Test message sent and received AI response
- [ ] Messages being stored in database
- [ ] Customer profiles being created
- [ ] Auto-reply toggle working

---

## 🎉 You're All Set!

Your Instagram AI chatbot is now **100% functional** and ready to:

✨ Respond to customer inquiries intelligently  
✨ Handle product questions and pricing  
✨ Convert conversations to orders  
✨ Provide 24/7 customer support  
✨ Track and manage customer relationships  

**Next Steps:**
1. Add your products to the dashboard
2. Customize AI behavior for your business
3. Monitor conversations and improve responses
4. Scale as your business grows!

---

*Last Updated: October 31, 2025*  
*Version: 2.0 - Fully Functional AI Chatbot*

