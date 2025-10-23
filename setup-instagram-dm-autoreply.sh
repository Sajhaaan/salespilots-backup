#!/bin/bash

echo "🤖 Instagram DM Auto-Reply Setup Script"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check if ngrok is installed
echo -e "${BLUE}[1/6]${NC} Checking ngrok installation..."
if [ -f "./ngrok" ]; then
    echo -e "${GREEN}✅ ngrok is installed${NC}"
else
    echo -e "${YELLOW}📥 Downloading ngrok...${NC}"
    curl -L -o ngrok.zip https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-darwin-arm64.zip
    unzip -o ngrok.zip
    rm ngrok.zip
    chmod +x ngrok
    echo -e "${GREEN}✅ ngrok installed${NC}"
fi

# Step 2: Check environment variables
echo -e "${BLUE}[2/6]${NC} Checking environment variables..."
if grep -q "INSTAGRAM_WEBHOOK_TOKEN" .env.local; then
    echo -e "${GREEN}✅ Webhook token configured${NC}"
else
    echo -e "${YELLOW}📝 Adding webhook token to .env.local...${NC}"
    echo "" >> .env.local
    echo "# Instagram Webhook Configuration" >> .env.local
    echo "INSTAGRAM_WEBHOOK_TOKEN=salespilot_webhook_secret_2025" >> .env.local
    echo -e "${GREEN}✅ Webhook token added${NC}"
fi

# Step 3: Start ngrok
echo -e "${BLUE}[3/6]${NC} Starting ngrok tunnel..."
pkill -f "ngrok http" 2>/dev/null
./ngrok http 3000 --log=stdout > ngrok.log 2>&1 &
sleep 5

# Get ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$NGROK_URL" ]; then
    echo -e "${RED}❌ Failed to get ngrok URL. Please start ngrok manually:${NC}"
    echo -e "${YELLOW}   ./ngrok http 3000${NC}"
    echo -e "${YELLOW}   Then visit http://localhost:4040 to get your URL${NC}"
else
    echo -e "${GREEN}✅ ngrok tunnel started${NC}"
    echo -e "${GREEN}   URL: $NGROK_URL${NC}"
fi

# Step 4: Test webhook verification
echo -e "${BLUE}[4/6]${NC} Testing webhook verification..."
VERIFY_URL="http://localhost:3000/api/webhook/instagram/enhanced?hub.mode=subscribe&hub.verify_token=salespilot_webhook_secret_2025&hub.challenge=test123"
VERIFY_RESPONSE=$(curl -s "$VERIFY_URL")

if [ "$VERIFY_RESPONSE" == "test123" ]; then
    echo -e "${GREEN}✅ Webhook verification working${NC}"
else
    echo -e "${RED}❌ Webhook verification failed${NC}"
    echo -e "${YELLOW}   Make sure your dev server is running: npm run dev${NC}"
fi

# Step 5: Test DM simulation
echo -e "${BLUE}[5/6]${NC} Testing DM auto-reply..."
DM_RESPONSE=$(curl -s -X POST http://localhost:3000/api/test/webhook-dm)

if echo "$DM_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ DM auto-reply test passed${NC}"
else
    echo -e "${RED}❌ DM auto-reply test failed${NC}"
    echo -e "${YELLOW}   Check server logs for errors${NC}"
fi

# Step 6: Display setup instructions
echo ""
echo -e "${BLUE}[6/6]${NC} Meta Developer Console Setup Instructions"
echo "=========================================="
echo ""
echo -e "${GREEN}📋 STEP-BY-STEP GUIDE:${NC}"
echo ""
echo "1. Go to: https://developers.facebook.com/"
echo ""
echo "2. Select your App → ${YELLOW}Instagram${NC} → ${YELLOW}Webhooks${NC}"
echo ""
echo "3. Click ${YELLOW}Configure${NC} on Instagram"
echo ""
if [ ! -z "$NGROK_URL" ]; then
    echo -e "4. ${GREEN}Callback URL:${NC}"
    echo -e "   ${YELLOW}$NGROK_URL/api/webhook/instagram/enhanced${NC}"
    echo ""
fi
echo "5. ${GREEN}Verify Token:${NC}"
echo -e "   ${YELLOW}salespilot_webhook_secret_2025${NC}"
echo ""
echo "6. Subscribe to these events:"
echo "   ✅ messages"
echo "   ✅ messaging_postbacks"
echo "   ✅ messaging_optins"
echo ""
echo "7. Click ${YELLOW}Save${NC}"
echo ""
echo "8. Test by sending a DM to your Instagram account!"
echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo -e "${YELLOW}Important Notes:${NC}"
echo "• Keep this terminal open (ngrok must stay running)"
echo "• Your dev server must be running (npm run dev)"
echo "• To view ngrok dashboard: http://localhost:4040"
echo "• To stop ngrok: pkill -f 'ngrok http'"
echo ""

if [ ! -z "$NGROK_URL" ]; then
    echo -e "${GREEN}Your webhook URL is:${NC}"
    echo -e "${BLUE}$NGROK_URL/api/webhook/instagram/enhanced${NC}"
    echo ""
    
    # Save URL to file for easy access
    echo "$NGROK_URL" > ngrok-url.txt
    echo -e "${GREEN}✅ URL saved to ngrok-url.txt${NC}"
fi

echo ""
echo -e "${YELLOW}To see this information again, run:${NC}"
echo "  cat ngrok-url.txt"
echo ""

