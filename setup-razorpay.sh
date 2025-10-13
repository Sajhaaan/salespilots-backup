#!/bin/bash

# SalesPilots Razorpay Setup Script
echo "🚀 Setting up SalesPilots with Razorpay..."
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists. Creating backup..."
    cp .env.local .env.local.backup
fi

# Create .env.local with Razorpay configuration
cat > .env.local << 'EOF'
# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_live_1ImEZbUhucjMqB
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=SalesPilots

# JWT Secret for session management
JWT_SECRET=salespilots-jwt-secret-key-min-32-chars-long-for-secure-sessions

# Database Configuration (using in-memory for demo)
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-key
EOF

echo "✅ Created .env.local with Razorpay configuration"
echo ""
echo "⚠️  IMPORTANT: Please update the following in .env.local:"
echo "   - RAZORPAY_KEY_SECRET (get from Razorpay dashboard)"
echo "   - RAZORPAY_WEBHOOK_SECRET (get from Razorpay webhook settings)"
echo ""
echo "📝 Your Razorpay Key ID: rzp_live_1ImEZbUhucjMqB"
echo ""
echo "🔗 Next steps:"
echo "   1. Open .env.local and add your Razorpay secret keys"
echo "   2. Run: npm run build"
echo "   3. Run: npm start"
echo ""

