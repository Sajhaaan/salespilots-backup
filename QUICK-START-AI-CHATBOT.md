# 🚀 Quick Start: Instagram AI Chatbot

## Before (Dummy/Not Working) ❌
```javascript
// Old code - just returned static messages
return "Thank you for your message! Our AI-powered customer service 
is currently in development..."
```

## After (100% Functional) ✅
```javascript
// New code - Real AI with GPT-4
const aiResponse = await generateDMResponse(messageText, {
  businessName: businessContext.businessName,
  products: businessContext.products,
  language: businessContext.language,
  aiConfiguration: businessContext.aiConfiguration
})
```

---

## ⚡ 3-Minute Setup

### Step 1: Get Bytez API Key (1 min)
1. Go to: https://www.bytez.com
2. Sign up (free account available)
3. Dashboard → Copy API Key

### Step 2: Add Environment Variables (1 min)

**If using Vercel:**
```
1. Go to your Vercel project
2. Settings → Environment Variables
3. Add these variables:
```

**Required Variables:**
```bash
BYTEZ_API_KEY=your_bytez_api_key_here
INSTAGRAM_PAGE_ACCESS_TOKEN=EAAG...
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841...
INSTAGRAM_WEBHOOK_TOKEN=random_secure_token
INSTAGRAM_AUTO_REPLY_ENABLED=true
```

**If using Local (.env.local):**
```bash
# Copy env.example to .env.local
cp env.example .env.local

# Edit .env.local and add your keys
```

### Step 3: Test It (1 min)

Visit: `http://localhost:3000/api/test/instagram-chatbot`

Should show:
```
✅ Instagram AI Chatbot is fully configured and ready!
```

Then send a DM to your Instagram business account and watch the AI respond!

---

## 📊 What's Different Now?

| Feature | Before (Dummy) | After (Real) |
|---------|---------------|--------------|
| AI Responses | ❌ Static text | ✅ GPT-4 powered |
| Message Storage | ❌ None | ✅ Full history |
| Customer Tracking | ❌ None | ✅ Profiles & stats |
| Conversation Context | ❌ None | ✅ Last 10 messages |
| Business Awareness | ❌ None | ✅ Products, language |
| Error Handling | ❌ Basic | ✅ Fallback system |
| Auto-Reply Toggle | ❌ Always on | ✅ Can be disabled |

---

## 🧪 Test Checklist

- [ ] Environment variables added
- [ ] Application redeployed
- [ ] Test endpoint shows "READY"
- [ ] Webhook configured in Meta Console
- [ ] Send test Instagram DM
- [ ] Receive AI response
- [ ] Check `data/messages.json` for stored messages
- [ ] Check `data/customers.json` for customer profiles

---

## 📁 What Changed?

### Files Modified:
1. **app/api/webhook/instagram/route.ts** - Complete rewrite with real AI
2. **lib/openai.ts** - Removed hardcoded API key
3. **env.example** - Added new required variables

### Files Created:
1. **INSTAGRAM-AI-CHATBOT-SETUP.md** - Detailed setup guide
2. **app/api/test/instagram-chatbot/route.ts** - Configuration tester
3. **QUICK-START-AI-CHATBOT.md** - This file

---

## 🤖 How It Works Now

```
Customer sends DM
    ↓
Webhook receives message
    ↓
Store in database
    ↓
Get customer history (last 10 messages)
    ↓
Get business context (products, language, settings)
    ↓
Generate AI response using GPT-4
    ↓
Send via Instagram API
    ↓
Store sent message
    ↓
Update customer stats
```

---

## 🎯 Key Features

### 1. Real AI Responses
- Uses GPT-4 via Bytez.js
- Context-aware conversations
- Sales-focused approach
- Multi-language support

### 2. Message Management
- Stores all conversations
- Tracks customer history
- Categorizes by intent
- Timestamps everything

### 3. Customer Tracking
- Creates customer profiles
- Counts interactions
- Records last contact
- Tracks engagement

### 4. Business Context
- Uses your product catalog
- Respects language preferences
- Applies custom AI settings
- Maintains brand voice

### 5. Error Handling
- Fallback messages
- Graceful degradation
- Detailed logging
- Auto-retry logic

---

## 💡 Pro Tips

### 1. Customize AI Behavior
Edit `lib/openai.ts` to change how the AI responds:
```typescript
systemPrompt = `You are a [FRIENDLY/PROFESSIONAL/CASUAL] assistant...`
```

### 2. Monitor Conversations
```bash
# View all messages
cat data/messages.json | jq

# View customers
cat data/customers.json | jq

# Follow logs in real-time
tail -f /var/log/app.log
```

### 3. Add Products
Go to Dashboard → Products → Add your product catalog
The AI will automatically mention them in conversations!

### 4. Set Language
Dashboard → Settings → Language Preference
Choose: English, Hindi, or Hinglish

---

## 🐛 Quick Troubleshooting

### AI Not Responding?
```bash
# Check if Bytez key is set
echo $BYTEZ_API_KEY

# Should see your key, if not:
# Add to Vercel env vars and redeploy
```

### Webhook Not Working?
```bash
# Test webhook verification
curl "https://yourdomain.com/api/webhook/instagram?hub.mode=subscribe&hub.challenge=test&hub.verify_token=YOUR_TOKEN"

# Should return: test
```

### No Messages in Database?
```bash
# Check file permissions
ls -la data/

# Check if directory exists
mkdir -p data/

# Check logs for errors
tail -f logs/error.log
```

---

## 📚 Need More Help?

- **Detailed Guide:** Read `INSTAGRAM-AI-CHATBOT-SETUP.md`
- **Test Endpoint:** Visit `/api/test/instagram-chatbot`
- **Logs:** Check Vercel logs or local console
- **Meta Docs:** https://developers.facebook.com/docs/instagram-api

---

## 🎉 You're Done!

Your Instagram chatbot is now **100% functional** with real AI!

**What happens next:**
1. Customers send Instagram DMs
2. AI analyzes message + context
3. Generates personalized response
4. Sends via Instagram API
5. Stores conversation
6. Updates statistics

**No more dummy responses!** 🎊

---

*Last Updated: October 31, 2025*

