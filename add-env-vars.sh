#!/bin/bash

echo "🔧 Adding Vercel Environment Variables..."
echo ""
echo "You'll be prompted to:"
echo "1. Enter the value for each variable"
echo "2. Select environments (choose: Production, Preview, Development)"
echo ""
echo "Press Enter to continue..."
read

echo "📝 Adding NEXT_PUBLIC_APP_URL..."
vercel env add NEXT_PUBLIC_APP_URL

echo ""
echo "📝 Adding JWT_SECRET..."
vercel env add JWT_SECRET

echo ""
echo "📝 Adding ENCRYPTION_KEY..."
vercel env add ENCRYPTION_KEY

echo ""
echo "✅ Done! Now redeploying..."
vercel --prod

echo ""
echo "🎉 Your app should now work properly!"
echo "Try logging in at your Vercel URL"

