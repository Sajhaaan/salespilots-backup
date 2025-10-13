#!/bin/bash
# Complete Startup Readiness Audit Script

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║    SALESPILOTS - COMPLETE STARTUP READINESS AUDIT           ║"
echo "║    Senior Team Comprehensive System Review                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

BASE_URL="http://localhost:3000"
PASS=0
FAIL=0
WARN=0

# Test function
test_endpoint() {
    local name="$1"
    local endpoint="$2"
    local method="${3:-GET}"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$BASE_URL$endpoint" 2>/dev/null)
    
    if [ "$response" -eq 200 ] || [ "$response" -eq 201 ]; then
        echo "  ✅ $name: PASS (HTTP $response)"
        ((PASS++))
    elif [ "$response" -eq 401 ] || [ "$response" -eq 403 ]; then
        echo "  ⚠️  $name: AUTH REQUIRED (HTTP $response)"
        ((WARN++))
    else
        echo "  ❌ $name: FAIL (HTTP $response)"
        ((FAIL++))
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 CTO: INFRASTRUCTURE & BACKEND REVIEW"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Core System
test_endpoint "Health Check" "/api/health"
test_endpoint "Database Connection" "/api/test/db"

# Authentication APIs
echo ""
echo "Authentication System:"
test_endpoint "Auth - Sign Up" "/api/auth/signup" "POST"
test_endpoint "Auth - Sign In" "/api/auth/signin" "POST"
test_endpoint "Auth - Me" "/api/auth/me"

# Dashboard APIs
echo ""
echo "Dashboard APIs:"
test_endpoint "Dashboard Stats" "/api/dashboard/stats"
test_endpoint "Dashboard Export" "/api/dashboard/export"

# Integration APIs
echo ""
echo "Integration APIs:"
test_endpoint "Integration Status" "/api/integrations/status"
test_endpoint "Instagram Status" "/api/integrations/instagram/status"

# AI APIs
echo ""
echo "AI/Chat APIs:"
test_endpoint "AI Chat Response" "/api/ai/chat-response" "POST"
test_endpoint "AI Test Response" "/api/ai/test-response"

# Payment APIs
echo ""
echo "Payment & Subscription:"
test_endpoint "Subscriptions" "/api/subscriptions"
test_endpoint "Payments" "/api/payments"

# Admin APIs
echo ""
echo "Admin APIs:"
test_endpoint "Admin Stats" "/api/admin/stats"
test_endpoint "Admin System Status" "/api/admin/system/status"

# Webhook APIs
echo ""
echo "Webhook Endpoints:"
test_endpoint "Instagram Webhook" "/api/webhook/instagram"
test_endpoint "Razorpay Webhook" "/api/webhook/razorpay" "POST"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 AUDIT SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Tests Passed: $PASS"
echo "  ⚠️  Warnings: $WARN"
echo "  ❌ Tests Failed: $FAIL"
echo "  📝 Total Tests: $((PASS + WARN + FAIL))"
echo ""

if [ $FAIL -eq 0 ] && [ $PASS -gt 10 ]; then
    echo "  🎉 VERDICT: PRODUCTION READY ✅"
    exit 0
else
    echo "  ⚠️  VERDICT: NEEDS ATTENTION"
    exit 1
fi
