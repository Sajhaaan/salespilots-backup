#!/bin/bash

# WhatsApp Business API Setup Script
# This script helps you configure WhatsApp integration for SalesPilots

echo "🚀 WhatsApp Business API Setup"
echo "================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Creating .env.local from env.example..."
    cp env.example .env.local
fi

echo "📋 You need the following credentials from Meta Business Platform:"
echo ""
echo "1. Permanent Access Token (from System Users)"
echo "2. Phone Number ID (from API Setup)"
echo "3. Webhook Verify Token (create a random string)"
echo ""
echo "Visit: https://business.facebook.com/"
echo ""

# Prompt for credentials
read -p "Enter your WhatsApp Permanent Access Token: " ACCESS_TOKEN
read -p "Enter your WhatsApp Phone Number ID: " PHONE_ID
read -p "Enter your Webhook Verify Token (or press Enter to generate): " VERIFY_TOKEN

# Generate verify token if not provided
if [ -z "$VERIFY_TOKEN" ]; then
    VERIFY_TOKEN=$(openssl rand -hex 32)
    echo "✅ Generated Webhook Verify Token: $VERIFY_TOKEN"
fi

# Update .env.local
echo ""
echo "📝 Updating .env.local..."

# Remove old WhatsApp variables if they exist
sed -i '' '/WHATSAPP_/d' .env.local

# Add new WhatsApp variables
cat >> .env.local <<EOL

# WhatsApp Business API Configuration
WHATSAPP_ACCESS_TOKEN=$ACCESS_TOKEN
WHATSAPP_BUSINESS_TOKEN=$ACCESS_TOKEN
WHATSAPP_PHONE_NUMBER_ID=$PHONE_ID
WHATSAPP_WEBHOOK_VERIFY_TOKEN=$VERIFY_TOKEN
EOL

echo "✅ Environment variables configured successfully!"
echo ""
echo "📌 Next Steps:"
echo ""
echo "1. Configure webhook in Meta Business Platform:"
echo "   URL: https://your-domain.vercel.app/api/webhook/whatsapp"
echo "   Verify Token: $VERIFY_TOKEN"
echo ""
echo "2. Subscribe to webhook events:"
echo "   - messages"
echo "   - message_status"
echo ""
echo "3. For local testing with ngrok:"
echo "   - Run: npm run dev"
echo "   - Run: ngrok http 3000"
echo "   - Use ngrok URL for webhook: https://xxx.ngrok.io/api/webhook/whatsapp"
echo ""
echo "4. Restart your development server:"
echo "   npm run dev"
echo ""
echo "5. For Vercel deployment, add these environment variables:"
echo "   vercel env add WHATSAPP_ACCESS_TOKEN"
echo "   vercel env add WHATSAPP_BUSINESS_TOKEN"
echo "   vercel env add WHATSAPP_PHONE_NUMBER_ID"
echo "   vercel env add WHATSAPP_WEBHOOK_VERIFY_TOKEN"
echo ""
echo "📚 Full guide: See WHATSAPP-SETUP-GUIDE.md"
echo ""
echo "✅ Setup complete! Happy messaging! 🎉"

