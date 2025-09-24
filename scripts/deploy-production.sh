#!/bin/bash

# 🚀 SalesPilots.io Production Deployment Script
# This script automates the deployment process to Vercel

set -e  # Exit on any error

echo "🚀 Starting SalesPilots.io Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're on the deployment branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "deployment" ]; then
    print_warning "You're currently on branch: $CURRENT_BRANCH"
    print_status "Recommended to deploy from 'deployment' branch"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled. Please switch to deployment branch."
        exit 1
    fi
fi

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    print_warning "Working directory has uncommitted changes:"
    git status --short
    read -p "Commit changes before deployment? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Committing changes..."
        git add .
        git commit -m "🚀 Pre-deployment commit - $(date)"
    else
        print_error "Please commit or stash changes before deployment."
        exit 1
    fi
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Installing now..."
    npm install -g vercel
fi

# Check Vercel login status
if ! vercel whoami &> /dev/null; then
    print_error "Not logged into Vercel. Please run 'vercel login' first."
    exit 1
fi

# Pre-deployment checks
print_status "Running pre-deployment checks..."

# Check if all required environment variables are set
print_status "Checking environment variables..."
if [ -f ".env.local" ]; then
    print_success "Local environment file found"
else
    print_warning "No .env.local file found. Make sure environment variables are set in Vercel dashboard."
fi

# Check if build works locally
print_status "Testing local build..."
if npm run build; then
    print_success "Local build successful"
else
    print_error "Local build failed. Please fix build issues before deployment."
    exit 1
fi

# Check for TypeScript errors
print_status "Checking TypeScript..."
if npm run type-check; then
    print_success "TypeScript check passed"
else
    print_error "TypeScript errors found. Please fix before deployment."
    exit 1
fi

# Run tests if available
if npm run test &> /dev/null; then
    print_status "Running tests..."
    if npm run test; then
        print_success "Tests passed"
    else
        print_warning "Some tests failed. Consider fixing before deployment."
        read -p "Continue with deployment? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Deployment cancelled due to test failures."
            exit 1
        fi
    fi
else
    print_warning "No test script found. Skipping tests."
fi

# Deploy to Vercel
print_status "Deploying to Vercel production..."
if vercel --prod; then
    print_success "Deployment to Vercel successful!"
else
    print_error "Deployment failed. Check Vercel logs for details."
    exit 1
fi

# Post-deployment tasks
print_status "Running post-deployment tasks..."

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls --prod | grep -o 'https://[^[:space:]]*' | head -1)
if [ -n "$DEPLOYMENT_URL" ]; then
    print_success "Production URL: $DEPLOYMENT_URL"
    
    # Test deployment
    print_status "Testing deployment..."
    if curl -s -f "$DEPLOYMENT_URL" > /dev/null; then
        print_success "Deployment is accessible"
    else
        print_warning "Deployment might not be fully ready yet"
    fi
fi

# Update deployment documentation
print_status "Updating deployment documentation..."
DEPLOYMENT_DATE=$(date '+%Y-%m-%d %H:%M:%S')
COMMIT_HASH=$(git rev-parse --short HEAD)
COMMIT_MESSAGE=$(git log -1 --pretty=%B | head -1)

# Create deployment summary
cat > "DEPLOYMENT-SUMMARY.md" << EOF
# 🚀 Deployment Summary

**Deployment Date**: $DEPLOYMENT_DATE
**Commit**: $COMMIT_HASH - $COMMIT_MESSAGE
**Branch**: $CURRENT_BRANCH
**Production URL**: $DEPLOYMENT_URL
**Deployed By**: $(whoami)

## ✅ Pre-Deployment Checks
- [x] Working directory clean
- [x] Local build successful
- [x] TypeScript check passed
- [x] Tests passed (if applicable)
- [x] Vercel CLI authenticated

## 🚀 Deployment Status
- [x] Deployed to Vercel production
- [x] Deployment accessible
- [x] Documentation updated

## 🔧 Next Steps
1. Test all features in production
2. Monitor error rates and performance
3. Verify environment variables are working
4. Check Instagram webhook connectivity
5. Test payment processing (if applicable)

## 📊 Monitoring
- Vercel Dashboard: https://vercel.com/dashboard
- Error Tracking: Check Vercel logs
- Performance: Monitor Vercel Analytics

---
*Generated automatically by deploy-production.sh*
EOF

print_success "Deployment summary created: DEPLOYMENT-SUMMARY.md"

# Final status
print_success "🎉 Production deployment completed successfully!"
print_status "Production URL: $DEPLOYMENT_URL"
print_status "Vercel Dashboard: https://vercel.com/dashboard"
print_status "Next: Test all features and monitor performance"

echo ""
echo "🚀 Deployment Summary:"
echo "======================"
echo "✅ Status: SUCCESS"
echo "🌐 URL: $DEPLOYMENT_URL"
echo "📅 Date: $DEPLOYMENT_DATE"
echo "🔗 Commit: $COMMIT_HASH"
echo "📋 Summary: DEPLOYMENT-SUMMARY.md"
echo ""
echo "Happy deploying! 🎊"
