#!/bin/bash

# 🚀 SalesPilots.io Deployment Script with New Database
# This script updates Vercel environment variables and deploys

echo "🚀 Starting SalesPilots.io deployment with new database..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Please log in to Vercel first:${NC}"
    vercel login
fi

echo -e "${BLUE}📝 Updating Vercel environment variables...${NC}"

# Update environment variables
echo -e "${YELLOW}Updating NEXT_PUBLIC_SUPABASE_URL...${NC}"
vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "https://qvpjtsmjyogejjtlgrpd.supabase.co"

echo -e "${YELLOW}Updating NEXT_PUBLIC_SUPABASE_ANON_KEY...${NC}"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cGp0c21qeW9nZWpqdGxncnBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NDc3NzIsImV4cCI6MjA3MjQyMzc3Mn0.ykelIGdurNHJKVoqZtJujP-WIdO5W_tj7q4SG3tlDOc"

echo -e "${YELLOW}Updating SUPABASE_SERVICE_ROLE_KEY...${NC}"
vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cGp0c21qeW9nZWpqdGxncnBkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njg0Nzc3MiwiZXhwIjoyMDcyNDIzNzcyfQ.bhVYCTD6TsrwEb5yB7X6nyXRkMosNv2K8o5sBZQkpfc"

echo -e "${YELLOW}Updating NEXT_PUBLIC_APP_URL...${NC}"
vercel env add NEXT_PUBLIC_APP_URL production <<< "https://salespilot-io.vercel.app"

echo -e "${YELLOW}Updating NEXT_PUBLIC_APP_NAME...${NC}"
vercel env add NEXT_PUBLIC_APP_NAME production <<< "SalesPilots"

echo -e "${YELLOW}Updating NODE_ENV...${NC}"
vercel env add NODE_ENV production <<< "production"

echo -e "${GREEN}✅ Environment variables updated successfully!${NC}"

# Build the project
echo -e "${BLUE}🔨 Building the project...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed! Please check for errors.${NC}"
    exit 1
fi

# Deploy to Vercel
echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
vercel --prod

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 Deployment successful!${NC}"
    echo -e "${BLUE}🌐 Your app is now live with the new database!${NC}"
else
    echo -e "${RED}❌ Deployment failed! Please check Vercel dashboard.${NC}"
    exit 1
fi

echo -e "${GREEN}🎯 Next steps:${NC}"
echo -e "${YELLOW}1. Test the signup/signin flow${NC}"
echo -e "${YELLOW}2. Verify database connection${NC}"
echo -e "${YELLOW}3. Check all features are working${NC}"
echo -e "${YELLOW}4. Monitor for any errors${NC}"

echo -e "${GREEN}🚀 SalesPilots.io is now running with your new database!${NC}"
