#!/bin/bash

# SalesPilots Backend API & Database Testing Script
echo "🧪 Testing SalesPilots Backend APIs & Database..."
echo "================================================"
echo ""

BASE_URL="http://localhost:3000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test API endpoint
test_api() {
    local name=$1
    local endpoint=$2
    local method=${3:-GET}
    local data=${4:-}
    
    echo -n "Testing $name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint")
    fi
    
    if [ "$response" -eq 200 ] || [ "$response" -eq 201 ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $response)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $response)"
        ((FAILED++))
    fi
}

# Check if server is running
echo "1. Checking if server is running..."
if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" | grep -q "200"; then
    echo -e "${GREEN}✓ Server is running on $BASE_URL${NC}"
else
    echo -e "${RED}✗ Server is not running. Please start with: npm start${NC}"
    exit 1
fi
echo ""

# Test Health Endpoint
echo "2. Testing Health Check..."
test_api "Health API" "/api/health"
echo ""

# Test Database
echo "3. Testing Database Connection..."
test_api "Database Test" "/api/test/db"
echo ""

# Test Authentication APIs
echo "4. Testing Authentication APIs..."
test_api "Auth - Sign Up" "/api/auth/signup" "POST" '{"email":"testuser'$(date +%s)'@example.com","password":"testpass123","firstName":"Test","lastName":"User"}'
test_api "Auth - Sign In" "/api/auth/signin" "POST" '{"email":"test@example.com","password":"testpass123"}'
test_api "Auth - Me (without auth)" "/api/auth/me"
echo ""

# Test Subscription APIs
echo "5. Testing Subscription APIs..."
test_api "Get Subscriptions" "/api/subscriptions"
echo ""

# Test Dashboard APIs
echo "6. Testing Dashboard APIs..."
test_api "Dashboard Stats" "/api/dashboard/stats"
echo ""

# Test Integration APIs
echo "7. Testing Integration APIs..."
test_api "Integration Status" "/api/integrations/status"
echo ""

# Test Admin APIs (may fail without admin auth)
echo "8. Testing Admin APIs..."
test_api "Admin Stats" "/api/admin/stats"
test_api "Admin System Status" "/api/admin/system/status"
echo ""

# Test Webhook Endpoints
echo "9. Testing Webhook Endpoints..."
test_api "Razorpay Webhook (GET)" "/api/webhook/razorpay"
echo ""

# Summary
echo ""
echo "================================================"
echo "📊 Test Summary"
echo "================================================"
echo -e "Tests Passed: ${GREEN}$PASSED${NC}"
echo -e "Tests Failed: ${RED}$FAILED${NC}"
echo -e "Total Tests: $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Backend is working correctly.${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Check the logs above for details.${NC}"
    exit 1
fi

