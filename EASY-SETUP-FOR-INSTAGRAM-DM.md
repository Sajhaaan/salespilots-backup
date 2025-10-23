# 📱 Instagram Auto-Reply Setup - Super Easy Guide

**For Non-Technical Users** - No coding knowledge needed! 

Just follow these simple steps and your Instagram will start replying to messages automatically! 🤖

---

## 🎯 What This Does

When someone sends you a message on Instagram, your AI chatbot will:
- Reply automatically within 2-3 seconds
- Answer questions about your products
- Help customers place orders
- Provide 24/7 customer support

**All while you sleep!** 😴

---

## ⏱️ Total Time: 10 Minutes

---

## 📋 Before You Start

Make sure you have:
- ✅ A computer (Mac/Windows)
- ✅ Your Instagram account connected (already done!)
- ✅ Internet connection
- ✅ Two browser tabs open

That's it! No technical skills needed.

---

## 🚀 Step-by-Step Instructions

### **STEP 1: Open Your Project Folder** (1 minute)

1. **Find this folder on your computer:**
   ```
   /Users/sajhan/Desktop/salespilots-backup-main
   ```

2. **Double-click to open it**

You'll see lots of files - don't worry about them! We only need one.

---

### **STEP 2: Start the Magic Tunnel** (2 minutes)

Think of this as opening a door for Instagram to talk to your chatbot.

#### **On Mac:**

1. **Find the file called:** `START-NGROK.sh`

2. **Right-click on it** → Select **"Open With"** → Choose **"Terminal"**

3. **A black window will open** (this is normal!)

4. **You'll see something like this:**
   ```
   Session Status    online
   Forwarding        https://1a2b-3c4d.ngrok-free.app -> localhost:3000
   ```

5. **IMPORTANT:** Look for the line with `https://` and `ngrok-free.app`
   
   Example: `https://1a2b-3c4d.ngrok-free.app`

6. **Copy this entire link** (select it and press Cmd+C)

7. **✨ DO NOT CLOSE THIS WINDOW!** Keep it open in the background.

---

#### **On Windows:**

1. **Find the file called:** `ngrok.exe`

2. **Double-click to open it**

3. **Type this and press Enter:**
   ```
   ngrok http 3000
   ```

4. **Copy the https link** that appears (looks like: `https://1a2b-3c4d.ngrok-free.app`)

5. **Keep this window open!**

---

### **STEP 3: Connect to Facebook/Meta** (5 minutes)

Now we'll tell Instagram where your chatbot lives.

1. **Open your web browser** (Chrome, Safari, etc.)

2. **Go to this website:**
   ```
   https://developers.facebook.com/
   ```

3. **Log in** with your Facebook account (the one linked to your Instagram)

4. **Click on your App** (you should see it in the dashboard)

5. **On the left side menu:**
   - Look for **"Instagram"** 
   - Click on it
   - Then click on **"Webhooks"**

6. **Click the "Configure" button** (it's next to Instagram)

---

### **STEP 4: Fill in the Form** (2 minutes)

You'll see a form with two boxes. Here's what to put in each:

#### **Box 1: Callback URL**

1. **Paste the link you copied from Step 2**
   
   Example: `https://1a2b-3c4d.ngrok-free.app`

2. **At the end, add:**
   ```
   /api/webhook/instagram/enhanced
   ```

3. **Final result should look like:**
   ```
   https://1a2b-3c4d.ngrok-free.app/api/webhook/instagram/enhanced
   ```

#### **Box 2: Verify Token**

Copy and paste this EXACTLY:
```
salespilot_webhook_secret_2025
```

---

### **STEP 5: Choose What to Listen For**

Below the form, you'll see checkboxes. **Check these boxes:**

- ✅ **messages** (this is the most important one!)
- ✅ **messaging_postbacks**
- ✅ **messaging_optins**

---

### **STEP 6: Save Everything**

1. **Click the big "Verify and Save" button**

2. **Wait 2-3 seconds...**

3. **You should see a GREEN CHECKMARK** ✅

   If you see a red X ❌, double-check:
   - Is your ngrok window still open?
   - Did you copy the URL exactly right?
   - Did you add `/api/webhook/instagram/enhanced` at the end?

---

### **STEP 7: Test It!** (1 minute)

Time to see the magic! 🎩✨

1. **Open Instagram on your phone**

2. **Send a message to your business account**
   
   Try: "Hello, I want to buy something"

3. **Wait 2-3 seconds**

4. **YOU SHOULD GET A REPLY!** 🎉

If the AI responds, congratulations! Your auto-reply is working! 🎊

---

## 🎉 You're Done!

That's it! Your Instagram now has an AI assistant that will:

- Reply to messages instantly
- Answer product questions
- Help customers order
- Work 24/7 without you

---

## ⚠️ Important Things to Remember

### **Keep the Black Window Open**

That black terminal window from Step 2? **Don't close it!**

- If you close it, the auto-reply stops working
- Just minimize it and leave it running in the background

### **Every Time You Restart Your Computer**

You'll need to:
1. Start the ngrok tunnel again (repeat Step 2)
2. Copy the new link (it changes each time)
3. Update it in Facebook Developer Console (repeat Steps 3-6)

**Why?** The free version gives you a new link each time. Think of it like getting a new phone number.

### **Want a Permanent Link?**

You can:
1. Upgrade to ngrok's paid plan ($8/month) - gets you a permanent link
2. OR deploy to production (ask your developer)

---

## 🆘 Troubleshooting

### **Problem: No auto-reply**

**Check:**
1. Is the black window still open? ✅
2. Is the green checkmark showing in Facebook? ✅
3. Try sending another test message

### **Problem: Red X instead of green checkmark**

**Fix:**
1. Make sure the black window is open
2. Check your URL has `/api/webhook/instagram/enhanced` at the end
3. Check the verify token is exactly: `salespilot_webhook_secret_2025`

### **Problem: It worked yesterday but not today**

**Fix:**
- You probably restarted your computer
- Repeat Step 2 to get a new link
- Update the link in Facebook (Steps 3-6)

---

## 📱 How to Check if It's Working

### **Method 1: Send a Test Message**
- Message your Instagram account
- Wait 2-3 seconds
- You should get a reply!

### **Method 2: Check the Dashboard**
1. Go to: http://localhost:4040
2. This shows all messages coming in
3. If you see activity when someone messages you = it's working!

### **Method 3: Look at the Black Window**
In the terminal window, you'll see messages like:
```
📨 Message received from customer
🤖 AI generating response
✅ Reply sent!
```

---

## 🎁 Bonus Tips

### **Customize Your Responses**

Your AI learns from your products and business info. To make better responses:
1. Add more products to your dashboard
2. Fill in detailed product descriptions
3. Add photos to products

### **Monitor Your Conversations**

1. Go to your dashboard: http://localhost:3000/dashboard
2. Click "Integrations"
3. See all messages and responses!

### **Turn Auto-Reply ON/OFF**

In your dashboard:
1. Go to Integrations
2. Click the green "AI Auto-Reply ON" button
3. It will toggle OFF (and vice versa)

---

## 🎯 Quick Reference Card

**Keep this handy:**

| What | Where | What to Do |
|------|-------|------------|
| Start Tunnel | `START-NGROK.sh` | Double-click, keep open |
| Facebook Dev | developers.facebook.com | Update webhook URL |
| Verify Token | Copy this | `salespilot_webhook_secret_2025` |
| Test | Instagram App | Send a message to yourself |
| Dashboard | Browser | localhost:4040 |

---

## ✅ Success Checklist

Before you finish, make sure:

- [ ] Black window is open and running
- [ ] Facebook shows green checkmark ✅
- [ ] Sent test message to Instagram
- [ ] Received auto-reply
- [ ] Dashboard shows the conversation

If all checked ✅ - **You're all set!** 🎉

---

## 💡 Understanding the Setup

### **What is ngrok?**
Think of it as a tunnel from Instagram to your computer. Instagram messages come through this tunnel to reach your chatbot.

### **What is a webhook?**
It's like a doorbell. When someone sends you a message, Instagram "rings the doorbell" (calls your webhook) to let your chatbot know.

### **What is the verify token?**
It's like a secret password. Only Instagram knows it, so fake messages can't trick your system.

### **Why does the link change?**
With the free version, you get a temporary link (like a temp phone number). For a permanent link, upgrade or deploy to production.

---

## 🚀 Next Steps

Once you're comfortable with the basic setup:

1. **Add more products** to your dashboard
2. **Customize AI responses** in settings
3. **Monitor conversations** daily
4. **Deploy to production** for a permanent setup (ask developer)

---

## 📞 Need Help?

If you get stuck:

1. **Check this guide again** - carefully follow each step
2. **Look at the troubleshooting section**
3. **Check the black window for error messages**
4. **Ask your developer** for help with production setup

---

## 🎊 Congratulations!

You just set up an AI-powered chatbot for your Instagram business! 

Now you can:
- ✅ Respond to customers 24/7
- ✅ Never miss a message
- ✅ Handle multiple conversations at once
- ✅ Focus on growing your business

**Enjoy your new AI assistant!** 🤖✨

---

*Last updated: October 23, 2025*
*Questions? Check START-HERE-INSTAGRAM-DM-SETUP.md for technical details*

