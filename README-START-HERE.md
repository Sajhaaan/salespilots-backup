# 👋 Welcome to SalesPilots - Instagram Auto-Reply Setup

## 🎯 Choose Your Guide Based on Your Experience:

### 📱 **Not Tech-Savvy? Start Here:**
👉 **[QUICK-START-GUIDE.md](QUICK-START-GUIDE.md)** - Super simple, 3 steps only!

### 📚 **Want Detailed Instructions?**
👉 **[EASY-SETUP-FOR-INSTAGRAM-DM.md](EASY-SETUP-FOR-INSTAGRAM-DM.md)** - Complete guide with pictures and explanations

### 💻 **Technical User?**
👉 **[START-HERE-INSTAGRAM-DM-SETUP.md](START-HERE-INSTAGRAM-DM-SETUP.md)** - Full technical documentation

---

## ⚡ Super Quick Setup (For the Impatient)

```bash
# 1. Start ngrok
./START-NGROK.sh

# 2. Copy the https link that appears

# 3. Go to developers.facebook.com
#    - Your App → Instagram → Webhooks → Configure
#    - Callback URL: [YOUR-LINK]/api/webhook/instagram/enhanced
#    - Verify Token: salespilot_webhook_secret_2025
#    - Subscribe to: messages ✅

# 4. Send a DM to your Instagram
# 5. Get auto-reply! 🎉
```

---

## 🎬 How It Works (Simple Explanation)

```
Customer sends DM → Instagram → Your Chatbot → AI Response → Customer
     📱              📤            🤖             💬            😊
```

**In Plain English:**
1. Someone messages your Instagram
2. Message goes to your chatbot (through ngrok tunnel)
3. AI creates a smart response
4. Response sent back to customer
5. All happens in 2-3 seconds!

---

## ✅ What's Already Set Up:

- ✅ Instagram connected
- ✅ AI chatbot configured
- ✅ Webhook endpoint created
- ✅ Database ready
- ✅ Auto-reply enabled
- ✅ Test tools ready

---

## 🎯 What You Need to Do:

1. **Start ngrok** (creates tunnel) - 1 minute
2. **Register webhook** in Meta Console - 5 minutes
3. **Test it!** - Send a DM - 1 minute

**Total: 7 minutes** ⏱️

---

## 📊 Features You Get:

✨ **Auto-Reply to DMs** - Instant responses 24/7
🛍️ **Product Recommendations** - AI suggests products
💳 **Payment Processing** - Generates QR codes
📦 **Order Management** - Tracks orders automatically
🤖 **Smart Conversations** - Context-aware responses
📊 **Analytics** - See all conversations in dashboard

---

## 🆘 Quick Troubleshooting:

| Problem | Solution |
|---------|----------|
| No auto-reply | Check black window is still open |
| Red X in Meta | Check URL and verify token |
| Link doesn't work | Make sure you added `/api/webhook/instagram/enhanced` |
| Stopped working | Restart computer? Run ngrok again |

---

## 📁 Important Files:

| File | What It Does |
|------|--------------|
| `START-NGROK.sh` | Starts the tunnel (double-click this!) |
| `QUICK-START-GUIDE.md` | 3-step quick guide |
| `EASY-SETUP-FOR-INSTAGRAM-DM.md` | Detailed non-technical guide |
| `START-HERE-INSTAGRAM-DM-SETUP.md` | Full technical docs |

---

## 🎓 Learning Resources:

**What is ngrok?**
- Creates a tunnel from internet to your computer
- Like a bridge Instagram uses to reach your chatbot

**What is a webhook?**
- A notification system
- Instagram "pings" your system when messages arrive

**What is the verify token?**
- A secret password
- Proves messages are really from Instagram

---

## 🚀 After Setup:

### Monitor Your Bot:
- **Dashboard**: http://localhost:4040
- **Your App**: http://localhost:3000/dashboard/integrations

### Customize Responses:
- Add products in dashboard
- Update business information
- Train AI with more data

### Go to Production:
- Deploy to Vercel (permanent setup)
- Get permanent webhook URL
- Run 24/7 without your computer

---

## 💡 Pro Tips:

1. **Keep Terminal Open** - That black window needs to stay running
2. **Bookmark Meta Console** - You'll need it each time you restart
3. **Test Regularly** - Send yourself messages to make sure it works
4. **Monitor Dashboard** - Check conversations to improve responses
5. **Upgrade ngrok** - $8/month for permanent link (optional)

---

## 📞 Support:

**Something not working?**
1. Check the troubleshooting section in your guide
2. Look at terminal window for error messages
3. Visit http://localhost:4040 to see incoming requests
4. Read EASY-SETUP-FOR-INSTAGRAM-DM.md for detailed help

---

## 🎉 Success Looks Like:

✅ Terminal window shows ngrok running
✅ Meta Console shows green checkmark
✅ Test DM gets auto-reply
✅ Dashboard shows conversations
✅ You're getting automated responses!

---

## 🔄 Daily Workflow:

**If you turned off your computer:**

1. Start ngrok: `./START-NGROK.sh`
2. Copy new URL
3. Update in Meta Console
4. Back to auto-replying!

**Want to avoid this?** Deploy to production for always-on service.

---

## 🎯 Next Steps:

1. ✅ **Complete setup** (follow QUICK-START-GUIDE.md)
2. 📱 **Test with real messages**
3. 🛍️ **Add your products**
4. 📊 **Monitor in dashboard**
5. 🚀 **Deploy to production** (for permanent setup)

---

## 🌟 You're Ready!

Pick your guide and let's get your Instagram auto-reply working!

**Recommended starting point:** 
👉 **[QUICK-START-GUIDE.md](QUICK-START-GUIDE.md)**

---

*SalesPilots.io - AI-Powered Instagram Business Automation*

