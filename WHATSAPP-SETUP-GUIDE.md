# WhatsApp Business API Setup Guide

## 🚨 **Why You Can't Connect WhatsApp**

The WhatsApp integration requires Meta (Facebook) Business API credentials to be configured in your environment variables **before** you can use it. Unlike other integrations, WhatsApp doesn't have a simple "Connect" button because it requires a business verification process through Facebook.

---

## 📋 **Prerequisites**

1. A Facebook Business Account
2. A phone number (not currently registered with WhatsApp)
3. Business verification completed on Meta Business
4. Access to WhatsApp Business Platform

---

## 🔧 **Step-by-Step Setup**

### **Step 1: Create Facebook Business Account**

1. Go to [Facebook Business](https://business.facebook.com/)
2. Click **"Create Account"**
3. Fill in your business information
4. Complete business verification (may take 1-3 days)

### **Step 2: Access WhatsApp Business Platform**

1. In your Facebook Business Manager, go to **Settings**
2. Navigate to **WhatsApp Business Platform** (or **WhatsApp Accounts**)
3. Click **"Get Started"**
4. Follow the setup wizard:
   - Choose your business phone number
   - Verify the number (you'll receive an SMS code)
   - Set up your business profile

### **Step 3: Get Your API Credentials**

#### **Get Phone Number ID:**
1. In WhatsApp Business Platform, go to **API Setup**
2. Under **"From"** section, you'll see your **Phone Number ID**
3. Copy this ID (looks like: `123456789012345`)

#### **Get Access Token:**
1. In the same **API Setup** page, look for **Access Token**
2. You'll see a **Temporary Access Token** - this expires in 24 hours
3. For production, you need a **Permanent Token**:
   - Go to **Business Settings** → **System Users**
   - Click **"Add"** to create a new system user
   - Give it a name like "SalesPilots WhatsApp"
   - Assign **WhatsApp Business Management** permissions
   - Click **"Generate New Token"**
   - Select your WhatsApp Business Account
   - Add these permissions:
     - `whatsapp_business_messaging`
     - `whatsapp_business_management`
   - Copy the generated token (starts with `EAA...`)
   - **⚠️ IMPORTANT:** Save this token securely - you won't see it again!

#### **Create Webhook Verify Token:**
1. Generate a random string (32+ characters) for webhook verification
2. You can use: `openssl rand -hex 32` in terminal
3. Save this token - you'll need it for webhook setup

---

## 🔐 **Step 4: Configure Environment Variables**

### **For Local Development**

Create or edit `.env.local` file:

```bash
# WhatsApp Business API Credentials
WHATSAPP_ACCESS_TOKEN=EAA...your_permanent_access_token_here
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_random_32_char_token_here

# Also needed (same as WHATSAPP_ACCESS_TOKEN)
WHATSAPP_BUSINESS_TOKEN=EAA...your_permanent_access_token_here
```

### **For Vercel Production**

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `WHATSAPP_ACCESS_TOKEN` | Your permanent token | Production, Preview, Development |
| `WHATSAPP_PHONE_NUMBER_ID` | Your phone number ID | Production, Preview, Development |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | Your verify token | Production, Preview, Development |
| `WHATSAPP_BUSINESS_TOKEN` | Same as access token | Production, Preview, Development |

4. Click **"Save"**
5. Redeploy your application

---

## 🔗 **Step 5: Configure Webhook**

1. In WhatsApp Business Platform, go to **Configuration**
2. Under **Webhook**, click **"Edit"**
3. Enter your webhook URL:
   - **Production:** `https://your-domain.vercel.app/api/webhook/whatsapp`
   - **Local (using ngrok):** `https://your-ngrok-url.ngrok.io/api/webhook/whatsapp`
4. Enter your **Verify Token** (the one you created)
5. Click **"Verify and Save"**

### **Subscribe to Webhook Events**

1. After webhook is verified, go to **Webhook Fields**
2. Subscribe to these events:
   - ✅ `messages` - Receive customer messages
   - ✅ `message_status` - Track message delivery
3. Click **"Save"**

---

## 🧪 **Step 6: Test the Connection**

### **Method 1: Send Test Message from Meta**

1. In WhatsApp Business Platform API Setup
2. Find the **"Send and receive messages"** section
3. Click **"Send Message"**
4. Enter your phone number
5. Send a test message
6. You should see it appear in your dashboard

### **Method 2: Send Message to Your Business Number**

1. Save your business WhatsApp number on your phone
2. Send a message: "Hello, I'd like to place an order"
3. Check your dashboard - the message should appear
4. If automation is enabled, you should receive an auto-reply

---

## ✅ **Step 7: Verify Integration Status**

1. **Restart your development server** (if local):
   ```bash
   npm run dev
   ```

2. **Or redeploy on Vercel** (if production)

3. Go to your dashboard: `/dashboard/integrations`

4. Check WhatsApp status:
   - Should show **"Connected"** with a green indicator
   - If not connected, check the browser console for errors

---

## 🚨 **Troubleshooting**

### **WhatsApp shows "Disconnected"**

**Cause:** Environment variables not set or incorrect

**Fix:**
1. Verify all environment variables are set
2. Check variable names match exactly (case-sensitive)
3. Restart dev server or redeploy
4. Check Vercel logs for errors

### **Webhook Verification Failed**

**Cause:** Verify token mismatch or webhook URL incorrect

**Fix:**
1. Ensure `WHATSAPP_WEBHOOK_VERIFY_TOKEN` matches the token in Meta
2. Check webhook URL is correct and accessible
3. For local testing, use ngrok to expose your local server
4. Check webhook logs: `/api/webhook/whatsapp` endpoint

### **Messages Not Being Received**

**Cause:** Webhook not subscribed to message events

**Fix:**
1. Go to Meta Business → WhatsApp → Configuration → Webhook
2. Ensure `messages` field is subscribed
3. Test webhook connection
4. Check your server logs for incoming webhook calls

### **"Invalid Access Token" Error**

**Cause:** Token expired or incorrect

**Fix:**
1. Generate a new permanent token from System Users
2. Update environment variables with new token
3. Redeploy application

### **Using Local Development with Ngrok**

```bash
# Install ngrok
brew install ngrok   # macOS
# or download from https://ngrok.com

# Start your Next.js app
npm run dev

# In another terminal, start ngrok
ngrok http 3000

# Copy the https URL (e.g., https://abc123.ngrok.io)
# Use this URL in Meta webhook configuration
```

---

## 🔒 **Security Best Practices**

1. **Never commit** `.env.local` to Git
2. **Rotate tokens** every 60-90 days
3. **Use System Users** for permanent tokens (not personal accounts)
4. **Monitor webhook logs** for suspicious activity
5. **Enable 2FA** on your Facebook Business account
6. **Limit permissions** to only what's needed
7. **Keep access tokens secure** - treat them like passwords

---

## 📊 **What Happens After Connection**

Once WhatsApp is connected:

1. **Auto-Reply Bot** - Automatically responds to customer messages
2. **Order Management** - Customers can place orders via WhatsApp
3. **Customer Tracking** - All conversations saved in dashboard
4. **AI Integration** - Smart responses based on product catalog
5. **Multi-Language** - Supports English, Hindi, Marathi (auto-detect)
6. **Analytics** - Track message volume, response times, conversions

---

## 📚 **Additional Resources**

- [WhatsApp Business Platform Docs](https://developers.facebook.com/docs/whatsapp)
- [Get Started with WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)
- [Webhook Setup Guide](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components)
- [Meta Business Help Center](https://www.facebook.com/business/help)

---

## 🆘 **Still Having Issues?**

If you're still unable to connect WhatsApp after following this guide:

1. **Check Environment Variables:**
   ```bash
   # Local
   cat .env.local | grep WHATSAPP
   
   # Vercel
   vercel env ls
   ```

2. **Check API Logs:**
   - Go to `/api/webhook/whatsapp` in browser
   - Should return webhook verification instructions

3. **Verify Token Validity:**
   - Test token with Meta Graph API Explorer
   - https://developers.facebook.com/tools/explorer/

4. **Check Business Verification:**
   - Ensure Facebook Business account is verified
   - Check WhatsApp Business Platform access

---

## ✅ **Quick Checklist**

Before reporting issues, ensure:

- [ ] Facebook Business Account created and verified
- [ ] WhatsApp Business Platform access granted
- [ ] Phone number verified in Meta
- [ ] Permanent access token generated (from System Users)
- [ ] Phone Number ID obtained
- [ ] Webhook verify token created
- [ ] All environment variables set (local and/or Vercel)
- [ ] Webhook URL configured in Meta
- [ ] Webhook subscribed to `messages` event
- [ ] Application redeployed/restarted
- [ ] Test message sent and received

---

**Need Help?** Check the [troubleshooting section](#-troubleshooting) or review Meta's official documentation.

