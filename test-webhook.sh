#!/bin/bash

# Meta Webhook Test Script
# Tests the /api/webhook endpoint for proper verification and event handling

echo "🧪 Testing Meta Webhook Endpoint"
echo "================================"
echo ""

WEBHOOK_URL="https://salespilots-backup.vercel.app/api/webhook"
VERIFY_TOKEN="salespilots_webhook_2024"

# Test 1: Webhook Verification (GET)
echo "Test 1: Webhook Verification (GET)"
echo "-----------------------------------"
echo "Testing: $WEBHOOK_URL"
echo ""

RESPONSE=$(curl -s "$WEBHOOK_URL?hub.mode=subscribe&hub.verify_token=$VERIFY_TOKEN&hub.challenge=test123")

if [ "$RESPONSE" == "test123" ]; then
    echo "✅ PASS: Webhook verification successful"
    echo "   Response: $RESPONSE"
else
    echo "❌ FAIL: Webhook verification failed"
    echo "   Expected: test123"
    echo "   Got: $RESPONSE"
fi

echo ""
echo ""

# Test 2: Instagram Message Event (POST)
echo "Test 2: Instagram Message Event (POST)"
echo "---------------------------------------"

RESPONSE=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "object": "instagram",
    "entry": [{
      "id": "test-entry",
      "time": 1234567890,
      "messaging": [{
        "sender": {"id": "test_user_123"},
        "recipient": {"id": "your_page_id"},
        "timestamp": 1234567890,
        "message": {
          "mid": "test_mid_123",
          "text": "Hello, this is a test message!"
        }
      }]
    }]
  }')

if echo "$RESPONSE" | grep -q '"status":"ok"'; then
    echo "✅ PASS: Instagram event accepted"
    echo "   Response: $RESPONSE"
else
    echo "❌ FAIL: Instagram event rejected"
    echo "   Response: $RESPONSE"
fi

echo ""
echo ""

# Test 3: Messenger Message Event (POST)
echo "Test 3: Messenger Message Event (POST)"
echo "---------------------------------------"

RESPONSE=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "object": "page",
    "entry": [{
      "id": "test-page",
      "time": 1234567890,
      "messaging": [{
        "sender": {"id": "test_user_456"},
        "recipient": {"id": "your_page_id"},
        "timestamp": 1234567890,
        "message": {
          "mid": "test_mid_456",
          "text": "Hello from Messenger!"
        }
      }]
    }]
  }')

if echo "$RESPONSE" | grep -q '"status":"ok"'; then
    echo "✅ PASS: Messenger event accepted"
    echo "   Response: $RESPONSE"
else
    echo "❌ FAIL: Messenger event rejected"
    echo "   Response: $RESPONSE"
fi

echo ""
echo ""

# Test 4: Invalid Verification Token
echo "Test 4: Invalid Verification Token"
echo "-----------------------------------"

RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$WEBHOOK_URL?hub.mode=subscribe&hub.verify_token=wrong_token&hub.challenge=test123")

if echo "$RESPONSE" | grep -q "HTTP_CODE:403"; then
    echo "✅ PASS: Invalid token rejected with 403"
else
    echo "❌ FAIL: Invalid token should return 403"
    echo "   Response: $RESPONSE"
fi

echo ""
echo ""

# Summary
echo "================================"
echo "🎯 Test Summary"
echo "================================"
echo ""
echo "Webhook URL: $WEBHOOK_URL"
echo "Verify Token: $VERIFY_TOKEN"
echo ""
echo "Next Steps:"
echo "1. If all tests passed, configure webhook in Meta Developer Dashboard"
echo "2. Use the same URL and verify token"
echo "3. Subscribe to: messages, messaging_postbacks, message_deliveries"
echo "4. Test with real Instagram message"
echo ""
echo "For detailed setup instructions, see: META-WEBHOOK-SETUP.md"

