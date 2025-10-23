# 🚀 Instagram Auto-Reply - Quick Start (10 Minutes)

## Step 1️⃣: Start the Tunnel (2 min)

### What to do:
1. Find file: **`START-NGROK.sh`**
2. Right-click → "Open With" → "Terminal"
3. A black window opens - **KEEP IT OPEN!**
4. Look for a link like: `https://abc123.ngrok-free.app`
5. **COPY THIS LINK** 📋

---

## Step 2️⃣: Connect to Meta (5 min)

### What to do:
1. Go to: **https://developers.facebook.com/**
2. Login → Click your App
3. Click: **Instagram** → **Webhooks** → **Configure**

### Fill in the form:

**Callback URL:** 
```
[PASTE YOUR LINK HERE]/api/webhook/instagram/enhanced
```
Example: `https://abc123.ngrok-free.app/api/webhook/instagram/enhanced`

**Verify Token:**
```
salespilot_webhook_secret_2025
```

### Check these boxes:
- ✅ messages
- ✅ messaging_postbacks
- ✅ messaging_optins

### Click: **"Verify and Save"**

Look for GREEN CHECKMARK ✅

---

## Step 3️⃣: Test It! (1 min)

1. Open **Instagram** on your phone
2. Send a message to your business account: "Hi"
3. Wait 2-3 seconds
4. **YOU GET AUTO-REPLY!** 🎉

---

## ⚠️ Important!

**Keep the black window OPEN!** 
- If you close it = auto-reply stops
- Just minimize it

**After computer restart:**
- Repeat Step 1 (get new link)
- Update link in Meta (Step 2)

---

## ✅ Done!

Your Instagram now replies automatically! 

**Check if working:** http://localhost:4040

---

## 🆘 Help?

**No reply?**
- Black window still open? ✅
- Green checkmark in Meta? ✅
- Try another test message

**Red X instead of green?**
- Check URL ends with: `/api/webhook/instagram/enhanced`
- Check token is: `salespilot_webhook_secret_2025`

---

**For detailed guide:** Open `EASY-SETUP-FOR-INSTAGRAM-DM.md`

