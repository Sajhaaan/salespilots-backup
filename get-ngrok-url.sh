#!/bin/bash

echo "🔍 Getting ngrok URL..."
echo ""

# Wait for ngrok to start
sleep 5

# Try to get URL from API
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https://[^"]*"' | head -1 | cut -d'"' -f4)

if [ ! -z "$NGROK_URL" ]; then
    echo "✅ ngrok is running!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🌐 Your ngrok URL:"
    echo ""
    echo "   $NGROK_URL"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📋 COPY THIS FOR META CONSOLE:"
    echo ""
    echo "   Callback URL:"
    echo "   $NGROK_URL/api/webhook/instagram/enhanced"
    echo ""
    echo "   Verify Token:"
    echo "   salespilot_webhook_secret_2025"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🔗 Quick Links:"
    echo "   • ngrok dashboard: http://localhost:4040"
    echo "   • Meta Console: https://developers.facebook.com/"
    echo ""
    echo "📝 Next Steps:"
    echo "   1. Go to https://developers.facebook.com/"
    echo "   2. Your App → Instagram → Webhooks → Configure"
    echo "   3. Paste the Callback URL above"
    echo "   4. Paste the Verify Token above"
    echo "   5. Subscribe to 'messages' event"
    echo "   6. Click 'Verify and Save'"
    echo ""
    echo "✅ Then test by sending a DM to @salespilots.io!"
    echo ""
    
    # Save to file
    echo "$NGROK_URL" > ngrok-url.txt
    echo "💾 URL saved to: ngrok-url.txt"
    echo ""
else
    echo "❌ ngrok is not running or not ready yet"
    echo ""
    echo "🔄 Try running:"
    echo "   ./ngrok http 3000"
    echo ""
    echo "Or wait a few more seconds and run this script again:"
    echo "   ./get-ngrok-url.sh"
fi

