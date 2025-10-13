# 🔧 Complete Razorpay Setup Guide

## 📋 Quick Setup Checklist

- [x] Backend server running
- [x] Database working
- [x] API endpoints functional
- [x] `.env.local` file created
- [x] Razorpay Key ID added: `rzp_live_1ImEZbUhucjMqB`
- [ ] **Razorpay Key Secret** - Need to add
- [ ] **Razorpay Webhook Secret** - Need to add

---

## 🚀 Step-by-Step Setup

### Step 1: Get Your Razorpay Credentials

1. **Go to Razorpay Dashboard**
   - URL: https://dashboard.razorpay.com/
   - Sign in with your account

2. **Navigate to API Keys**
   - Settings → API Keys
   - You should see your Key ID: `rzp_live_1ImEZbUhucjMqB`

3. **Get Key Secret**
   - Click "Regenerate Test Key" or "View Live Key Secret"
   - **Copy the secret** (you can only see it once!)
   - Example format: `abcdefghijklmnopqrstuvwxyz123456`

### Step 2: Set Up Webhooks

1. **Go to Webhooks Section**
   - Settings → Webhooks
   - Click "Create New Webhook"

2. **Configure Webhook**
   ```
   Webhook URL: http://localhost:3000/api/webhook/razorpay
   (For production: https://yourdomain.com/api/webhook/razorpay)
   
   Events to Subscribe:
   ✓ payment.captured
   ✓ payment.failed
   ✓ order.paid
   ```

3. **Get Webhook Secret**
   - After creating webhook, copy the "Webhook Secret"
   - Example format: `whsec_abcdefghijklmnopqrstuvwxyz`

### Step 3: Update Environment Variables

1. **Open `.env.local` file**
   ```bash
   # From project directory
   nano .env.local
   ```

2. **Update these lines with your actual values:**
   ```bash
   # Razorpay Payment Gateway
   RAZORPAY_KEY_ID=rzp_live_1ImEZbUhucjMqB
   RAZORPAY_KEY_SECRET=your_actual_secret_here  # ← PASTE YOUR SECRET HERE
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here  # ← PASTE WEBHOOK SECRET HERE
   ```

3. **Save the file** (Ctrl+O, Enter, Ctrl+X in nano)

### Step 4: Restart the Server

```bash
# Kill existing server
lsof -ti:3000 | xargs kill -9

# Rebuild with new configuration
export PATH="$PWD/node-v20.10.0-darwin-arm64/bin:$PATH" && npm run build

# Start server
export PATH="$PWD/node-v20.10.0-darwin-arm64/bin:$PATH" && npm start
```

---

## 🧪 Testing the Integration

### Test 1: Visit Pricing Page
```
http://localhost:3000/pricing
```

### Test 2: Select a Plan
- Click on "Start Free Trial" or "Get Professional"
- If logged in → redirects to Razorpay payment
- If not logged in → redirects to sign up

### Test 3: Complete Test Payment
1. Use Razorpay test cards:
   ```
   Card Number: 4111 1111 1111 1111
   CVV: 123
   Expiry: Any future date
   ```

2. Payment should complete successfully

3. You'll be redirected to:
   ```
   http://localhost:3000/payment/success
   ```

4. Your subscription should be activated automatically!

### Test 4: Verify Subscription
```bash
# Login first
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}' \
  -c cookies.txt

# Check subscription
curl http://localhost:3000/api/subscriptions -b cookies.txt
```

---

## 📊 How It Works

### Payment Flow

```
1. User visits /pricing
   ↓
2. Clicks plan button
   ↓
3. System creates payment link via Razorpay API
   ↓
4. User redirected to Razorpay payment page
   ↓
5. User completes payment
   ↓
6. Razorpay sends webhook to /api/webhook/razorpay
   ↓
7. System verifies signature
   ↓
8. Subscription activated automatically
   ↓
9. User redirected to /payment/success
   ↓
10. User can access premium features!
```

### Subscription Activation

When payment is successful:
- ✅ User subscription plan updated
- ✅ Subscription status set to "active"
- ✅ Expiry date calculated (30 days for monthly)
- ✅ Plan features unlocked
- ✅ Database updated automatically

---

## 🔒 Security Features

### Implemented
- ✅ Webhook signature verification
- ✅ HTTPS-only cookies in production
- ✅ Session-based authentication
- ✅ CSRF protection
- ✅ Rate limiting on APIs
- ✅ Secure payment processing

### Best Practices
- 🔐 Never commit `.env.local` to git
- 🔐 Use Live Keys only in production
- 🔐 Test Keys for development
- 🔐 Rotate keys regularly
- 🔐 Monitor webhook logs

---

## 🐛 Troubleshooting

### Issue: Payment link not working

**Solution:**
```bash
# Check if Razorpay keys are set
cat .env.local | grep RAZORPAY

# Restart server
npm start
```

### Issue: Webhook not receiving events

**Solution:**
1. Check webhook URL is correct
2. Verify webhook secret in `.env.local`
3. Use ngrok for local testing:
   ```bash
   ngrok http 3000
   # Update webhook URL to ngrok URL
   ```

### Issue: Subscription not activating

**Solution:**
```bash
# Check server logs
# Look for webhook processing logs
# Verify webhook signature is correct
```

### Issue: Demo mode instead of real payments

**Solution:**
- Make sure `RAZORPAY_KEY_SECRET` doesn't contain "your_key_secret"
- It should be your actual secret from Razorpay dashboard
- Restart server after updating

---

## 📱 Production Deployment

### Before Going Live

1. **Switch to Live Keys**
   ```bash
   RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
   RAZORPAY_KEY_SECRET=your_live_secret
   ```

2. **Update Webhook URL**
   ```
   https://yourdomain.com/api/webhook/razorpay
   ```

3. **Test Thoroughly**
   - Test signup flow
   - Test payment flow
   - Test subscription activation
   - Test webhook processing

4. **Monitor**
   - Check Razorpay dashboard for payments
   - Monitor server logs
   - Track subscription activations

---

## 💡 Additional Resources

### Razorpay Documentation
- Payment Links: https://razorpay.com/docs/payments/payment-links/
- Webhooks: https://razorpay.com/docs/webhooks/
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-details/

### SalesPilots Documentation
- API Documentation: `/documentation/developer-guides/api-reference`
- User Guides: `/documentation/user-guides`
- Integration Guides: `/documentation/integrations`

---

## ✅ Final Checklist

Before marking setup as complete:

- [ ] Razorpay account created
- [ ] API keys copied to `.env.local`
- [ ] Webhook configured in Razorpay dashboard
- [ ] Webhook secret added to `.env.local`
- [ ] Server restarted with new configuration
- [ ] Test payment completed successfully
- [ ] Subscription activated automatically
- [ ] User can access premium features
- [ ] Webhook events logged correctly

---

## 🎉 You're All Set!

Once you complete the checklist above, your billing system is **fully operational**!

Users can:
- ✅ Sign up for free accounts
- ✅ Upgrade to premium plans
- ✅ Complete payments via Razorpay
- ✅ Get instant access to premium features
- ✅ Manage subscriptions from dashboard

**Need Help?**
- Check `BACKEND-STATUS.md` for system status
- Run `./test-backend.sh` for comprehensive testing
- Check server logs for debugging

---

*Setup guide created for SalesPilots v1.0*

