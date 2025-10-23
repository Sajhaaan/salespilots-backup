# 🚀 Start ngrok - Instagram DM Auto-Reply Setup

## ⚡ Quick 2-Step Setup

### **Step 1: Start ngrok** (in new terminal)

Open a **NEW TERMINAL WINDOW** and run:

```bash
cd /Users/sajhan/Desktop/salespilots-backup-main
./ngrok http 3000
```

You'll see something like this:
```
ngrok                                                                    

Session Status                online
Account                       ...
Region                        ...
Forwarding                    https://1a2b-3c4d-5e6f.ngrok-free.app -> http://localhost:3000
```

**👉 COPY the https URL** (e.g., `https://1a2b-3c4d-5e6f.ngrok-free.app`)

⚠️ **KEEP THIS TERMINAL WINDOW OPEN!** Don't close it.

---

### **Step 2: Register Webhook in Meta**

1. **Open browser** and go to: https://developers.facebook.com/

2. **Login** with your Facebook account

3. **Select your App** from the dashboard

4. **Click "Instagram"** in the left sidebar

5. **Click "Webhooks"**

6. **Click "Configure"** button (next to Instagram)

7. **Fill in the form:**

   **Callback URL:**
   ```
   https://YOUR-NGROK-URL.ngrok-free.app/api/webhook/instagram/enhanced
   ```
   Replace `YOUR-NGROK-URL` with the actual URL from Step 1
   
   Example: `https://1a2b-3c4d-5e6f.ngrok-free.app/api/webhook/instagram/enhanced`

   **Verify Token:**
   ```
   salespilot_webhook_secret_2025
   ```

8. **Subscribe to events** - Check these boxes:
   - ✅ **messages** (REQUIRED!)
   - ✅ messaging_postbacks
   - ✅ messaging_optins

9. **Click "Verify and Save"**

10. **Look for GREEN CHECKMARK** ✅

    If you see a green checkmark = SUCCESS! 🎉
    
    If you see a red X ❌ = Check your URL and try again

---

## 🧪 Test It!

### **Send a test DM:**

1. Open Instagram app on your phone
2. Go to @salespilots.io (your connected account)
3. Send a message: "Hello!"
4. **Wait 2-3 seconds**
5. You should get an AI response! 🤖✨

---

## 📊 Monitor Everything

While ngrok is running:

**ngrok Dashboard:**
```
http://localhost:4040
```
This shows all incoming requests in real-time!

**Your Server:**
Watch the terminal running `npm run dev` for logs like:
```
📨 Enhanced Instagram webhook received
✅ Found business user
🤖 Generating AI response
✅ Response sent to Instagram
```

---

## 🔄 What to Do When You Restart Your Computer

Every time you restart your computer or close ngrok:

1. **Start ngrok again:**
   ```bash
   cd /Users/sajhan/Desktop/salespilots-backup-main
   ./ngrok http 3000
   ```

2. **Copy the NEW URL** (it changes each time with free ngrok)

3. **Update Meta Console** with the new URL:
   - Go to https://developers.facebook.com/
   - Your App → Instagram → Webhooks → Configure
   - Paste new URL
   - Click "Verify and Save"

**Want to avoid this?** Deploy to production (URL never changes!)

---

## 🚀 Deploy to Production (Permanent Setup)

When you're ready for permanent 24/7 operation:

```bash
vercel --prod
```

Then update Meta Console with:
```
https://your-domain.vercel.app/api/webhook/instagram/enhanced
```

This URL never changes and works 24/7!

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Green checkmark in Meta Console
2. ✅ ngrok terminal shows `Session Status: online`
3. ✅ Test DM gets AI response within 2-3 seconds
4. ✅ Dashboard shows connection as "LIVE"
5. ✅ ngrok dashboard (localhost:4040) shows incoming requests

---

## 🐛 Troubleshooting

### **Red X in Meta Console?**

Check:
- Is ngrok still running? (Check terminal)
- Is dev server running? (`npm run dev`)
- Is the URL correct? (Should end with `/api/webhook/instagram/enhanced`)
- Is verify token correct? (`salespilot_webhook_secret_2025`)

### **No AI responses to DMs?**

Check:
- Green checkmark in Meta Console? ✅
- Subscribed to `messages` event? ✅
- ngrok terminal still open?
- Server running on port 3000?

### **ngrok gives error?**

Try:
```bash
pkill -f ngrok
./ngrok http 3000
```

---

## 📝 Quick Reference

**Your URLs:**
- ngrok Dashboard: http://localhost:4040
- Meta Console: https://developers.facebook.com/
- Your Dashboard: http://localhost:3000/dashboard/integrations

**Your Tokens:**
- Webhook Verify: `salespilot_webhook_secret_2025`
- Instagram Handle: `@salespilots.io`
- Page ID: `814775701710858`

**Commands:**
```bash
# Start ngrok
./ngrok http 3000

# Get ngrok URL
./get-ngrok-url.sh

# Test webhook
curl -X POST http://localhost:3000/api/test/webhook-dm

# Stop ngrok
Ctrl+C in ngrok terminal
```

---

## 🎯 Final Checklist

Before testing:
- [ ] Dev server running (`npm run dev`)
- [ ] ngrok running in separate terminal
- [ ] ngrok URL copied
- [ ] Webhook registered in Meta Console
- [ ] Green checkmark visible
- [ ] Subscribed to `messages` event

Ready to test:
- [ ] Send DM to @salespilots.io
- [ ] AI responds within 2-3 seconds
- [ ] Check ngrok dashboard for requests
- [ ] Check server logs for processing

---

## 🎉 You're Ready!

Just run these two commands:

**Terminal 1:**
```bash
npm run dev
```

**Terminal 2:**
```bash
./ngrok http 3000
```

Then register the webhook URL in Meta Console!

**That's it!** Your Instagram will start auto-replying with AI! 🚀

---

*Need help? Check:*
- `README-START-HERE.md` - Overview
- `QUICK-START-GUIDE.md` - 3-step guide  
- `EASY-SETUP-FOR-INSTAGRAM-DM.md` - Detailed guide
- `INSTAGRAM-DM-AUTOREPLY-READY.md` - Technical details

