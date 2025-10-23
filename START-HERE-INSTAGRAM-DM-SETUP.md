# 🚀 Instagram DM Auto-Reply - Complete Setup Guide

## ✅ What's Already Done

I've set up everything on your local system:

1. ✅ **ngrok installed** - Local tunnel tool ready
2. ✅ **Webhook endpoint created** - `/api/webhook/instagram/enhanced`
3. ✅ **Test endpoint created** - `/api/test/webhook-dm`
4. ✅ **Environment variables configured** - Webhook token added
5. ✅ **Auto-reply enabled in database** - `instagram_auto_reply: true`
6. ✅ **OpenAI configured** - AI responses ready

## 🎯 What You Need to Do (5 Minutes)

### Step 1: Start ngrok Tunnel

Open a **new terminal** and run:

```bash
cd /Users/sajhan/Desktop/salespilots-backup-main
./ngrok http 3000
```

You'll see output like:
```
Session Status                online
Account                       ...
Forwarding                    https://abc123-xyz.ngrok-free.app -> http://localhost:3000
```

**Copy the https URL** (e.g., `https://abc123-xyz.ngrok-free.app`)

⚠️ **IMPORTANT**: Keep this terminal window open! If you close it, the tunnel will stop.

---

### Step 2: Register Webhook in Meta Developer Console

1. **Go to** [Meta for Developers](https://developers.facebook.com/)

2. **Select your App** → Click on **Instagram** in the left sidebar → Click **Webhooks**

3. **Click "Configure"** button next to Instagram

4. **Fill in the form:**
   - **Callback URL**: `https://your-ngrok-url.ngrok-free.app/api/webhook/instagram/enhanced`
     - Replace `your-ngrok-url` with the actual URL from Step 1
     - Example: `https://abc123-xyz.ngrok-free.app/api/webhook/instagram/enhanced`
   
   - **Verify Token**: `salespilot_webhook_secret_2025`

5. **Subscribe to Events** - Check these boxes:
   - ✅ `messages`
   - ✅ `messaging_postbacks`  
   - ✅ `messaging_optins`

6. **Click "Verify and Save"**

   Meta will send a verification request to your webhook. You should see:
   - ✅ Green checkmark if successful
   - Check your terminal for: `✅ Instagram webhook verified`

---

### Step 3: Test the Setup

#### Test 1: Webhook Verification (Local)
```bash
curl "http://localhost:3000/api/webhook/instagram/enhanced?hub.mode=subscribe&hub.verify_token=salespilot_webhook_secret_2025&hub.challenge=test123"
```

✅ Expected output: `test123`

#### Test 2: DM Simulation (Local)
```bash
curl -X POST http://localhost:3000/api/test/webhook-dm
```

✅ Expected output: JSON with `"success": true`

#### Test 3: Real Instagram DM
1. Open Instagram app on your phone
2. Go to @salespilots.io (your connected Instagram account)
3. Send a DM: "Hello, I want to buy a product"
4. **Wait 2-3 seconds**
5. You should receive an AI-generated response! 🎉

---

## 📊 How to Monitor

### View ngrok Dashboard
While ngrok is running, visit: http://localhost:4040

This shows all incoming requests in real-time.

### View Server Logs
In your terminal running `npm run dev`, watch for:
```
📨 Enhanced Instagram webhook received
✅ Found business user
🤖 Generating AI response
✅ Response sent to Instagram
```

---

## 🐛 Troubleshooting

### Problem: "Webhook verification failed"
**Solution:**
- Make sure your dev server is running: `npm run dev`
- Make sure ngrok is running: `./ngrok http 3000`
- Check the verify token matches: `salespilot_webhook_secret_2025`

### Problem: "No response to Instagram DMs"
**Check:**
1. Is ngrok still running? (Check terminal)
2. Is webhook registered in Meta Console?
3. Are you subscribed to `messages` event?
4. Check server logs for errors

### Problem: "ngrok URL changed"
**Solution:**
- Free ngrok URLs change every time you restart
- Update the webhook URL in Meta Console
- OR upgrade to ngrok paid plan for permanent URL

---

## 🎯 Quick Reference

### Important URLs:
- **Webhook Endpoint**: `/api/webhook/instagram/enhanced`
- **Test Endpoint**: `/api/test/webhook-dm`
- **ngrok Dashboard**: http://localhost:4040
- **Meta Console**: https://developers.facebook.com/

### Important Tokens:
- **Webhook Verify Token**: `salespilot_webhook_secret_2025`
- **Instagram Business Account ID**: `17841476127558824`
- **Page ID**: `814775701710858`

### Commands:
```bash
# Start dev server
npm run dev

# Start ngrok
./ngrok http 3000

# Test webhook verification
curl "http://localhost:3000/api/webhook/instagram/enhanced?hub.mode=subscribe&hub.verify_token=salespilot_webhook_secret_2025&hub.challenge=test"

# Test DM simulation
curl -X POST http://localhost:3000/api/test/webhook-dm

# Stop ngrok
pkill -f "ngrok http"
```

---

## 🚀 Production Deployment (After Testing Works)

Once it's working locally, deploy to production:

1. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

2. **Update Webhook URL in Meta Console:**
   - Replace ngrok URL with: `https://your-domain.vercel.app/api/webhook/instagram/enhanced`

3. **Add Environment Variables in Vercel:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all variables from `.env.local`

4. **You're Live!** 🎉

---

## ✅ Final Checklist

Before testing:
- [ ] Dev server running (`npm run dev`)
- [ ] ngrok running (`./ngrok http 3000`)
- [ ] Webhook URL copied from ngrok
- [ ] Webhook registered in Meta Console
- [ ] Subscribed to `messages` event
- [ ] Webhook verification successful (green checkmark)

Ready to test:
- [ ] Send test DM to your Instagram account
- [ ] Receive auto-reply within 2-3 seconds
- [ ] Check server logs for confirmation

---

## 📞 Need Help?

If something doesn't work:
1. Check server logs (`npm run dev` terminal)
2. Check ngrok dashboard (http://localhost:4040)
3. Verify Meta Console shows green checkmark for webhook
4. Try the test endpoints first before real DMs

**The most common issue**: Forgetting to keep ngrok running! Keep that terminal window open.

---

Happy automating! 🤖✨

