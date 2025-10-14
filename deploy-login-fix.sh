#!/bin/bash

# Vercel Login Fix Deployment Script
# This script deploys the login redirect fix to Vercel

echo "🚀 Deploying Login Fix to Vercel..."
echo ""

# Check if we're in a git repo
if [ ! -d .git ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "📝 Found uncommitted changes. Committing..."
    git add .
    git commit -m "fix: Vercel login redirect with enhanced cookie handling and production delays"
    echo "✅ Changes committed"
else
    echo "✅ No uncommitted changes"
fi

# Push to main
echo ""
echo "📤 Pushing to main branch..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to main"
    echo ""
    echo "🎉 Deployment initiated!"
    echo ""
    echo "Next steps:"
    echo "1. Go to https://vercel.com/dashboard to monitor deployment"
    echo "2. Ensure these environment variables are set:"
    echo "   - JWT_SECRET"
    echo "   - ENCRYPTION_KEY"
    echo "   - NEXT_PUBLIC_APP_URL"
    echo ""
    echo "3. After deployment completes:"
    echo "   - Clear browser cookies for your Vercel domain"
    echo "   - Test the login flow"
    echo "   - Check browser console for debug logs"
    echo ""
    echo "📖 For detailed troubleshooting, see VERCEL-LOGIN-FIX.md"
else
    echo "❌ Failed to push to main"
    exit 1
fi

