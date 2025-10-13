# 🚀 SalesPilots.io - Production Deployment Guide

**Complete guide to deploy your SalesPilots.io application to production with enterprise-grade reliability.**

## 📋 Prerequisites

- ✅ Node.js 18.17.0+ installed
- ✅ npm 9.0.0+ installed
- ✅ Git repository set up
- ✅ Supabase project created
- ✅ OpenAI API key obtained
- ✅ Vercel account (recommended) or other hosting provider

## 🚀 Quick Deployment (Vercel)

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy to Vercel
```bash
vercel --prod
```

### 4. Configure Environment Variables
Add these in your Vercel dashboard:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=SalesPilots
```

## 🏗️ Manual Deployment Steps

### Step 1: Environment Setup

1. **Create production environment file**
   ```bash
   cp env.example .env.production
   ```

2. **Configure production variables**
   ```bash
   # Production settings
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   
   # Database
   NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
   
   # AI Services
   OPENAI_API_KEY=your_openai_api_key
   
   # Security
   JWT_SECRET=your_secure_jwt_secret_min_32_chars
   ENCRYPTION_KEY=your_secure_encryption_key_min_32_chars
   ```

### Step 2: Database Setup

1. **Create production database**
   ```bash
   # In Supabase dashboard
   - Create new project
   - Note down URL and keys
   - Run initial migrations
   ```

2. **Generate database types**
   ```bash
   npm run db:generate
   ```

3. **Apply migrations**
   ```bash
   npm run db:migrate
   ```

### Step 3: Build & Test

1. **Install dependencies**
   ```bash
   npm ci --production
   ```

2. **Build application**
   ```bash
   npm run build
   ```

3. **Test build locally**
   ```bash
   npm start
   ```

### Step 4: Deploy

#### Option A: Vercel (Recommended)
```bash
vercel --prod
```

#### Option B: Docker
```bash
# Build Docker image
docker build -t salespilots-io .

# Run container
docker run -p 3000:3000 --env-file .env.production salespilots-io
```

#### Option C: Traditional Server
```bash
# Copy files to server
scp -r . user@server:/var/www/salespilots-io

# Install dependencies
npm ci --production

# Build application
npm run build

# Start with PM2
pm2 start npm --name "salespilots-io" -- start
```

## 🔒 Security Configuration

### 1. Environment Variables
- ✅ Never commit `.env` files to Git
- ✅ Use strong, unique secrets
- ✅ Rotate keys regularly
- ✅ Use different keys for dev/staging/prod

### 2. Database Security
- ✅ Enable Row Level Security (RLS)
- ✅ Use service role keys only for admin operations
- ✅ Implement proper user permissions
- ✅ Enable database backups

### 3. Application Security
- ✅ Enable HTTPS everywhere
- ✅ Implement rate limiting
- ✅ Add CORS protection
- ✅ Enable security headers

### 4. Monitoring & Logging
```bash
# Enable logging
LOG_LEVEL=INFO
NODE_ENV=production

# Add monitoring services
SENTRY_DSN=your_sentry_dsn
GOOGLE_ANALYTICS_ID=your_ga_id
```

## 📊 Performance Optimization

### 1. Next.js Optimizations
```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
}
```

### 2. Database Optimization
- ✅ Add proper indexes
- ✅ Enable connection pooling
- ✅ Monitor query performance
- ✅ Implement caching strategy

### 3. CDN Configuration
- ✅ Configure image CDN
- ✅ Enable static asset caching
- ✅ Use edge functions for global performance

## 🔍 Post-Deployment Checklist

### 1. Functionality Tests
- [ ] User registration works
- [ ] Authentication flows properly
- [ ] Database connections stable
- [ ] AI integrations functional
- [ ] Payment processing works
- [ ] Instagram webhooks active

### 2. Performance Tests
- [ ] Page load times < 3 seconds
- [ ] API response times < 500ms
- [ ] Database query performance
- [ ] Memory usage stable
- [ ] CPU utilization normal

### 3. Security Tests
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Input validation working
- [ ] Authentication secure

### 4. Monitoring Setup
- [ ] Error tracking enabled
- [ ] Performance monitoring active
- [ ] Uptime monitoring configured
- [ ] Alert system working
- [ ] Log aggregation active

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Database Connection Issues**
   - Verify Supabase credentials
   - Check network connectivity
   - Verify database permissions

3. **Environment Variable Issues**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify variable values are correct

4. **Performance Issues**
   - Monitor database query performance
   - Check for memory leaks
   - Verify CDN configuration

### Debug Commands
```bash
# Check application status
npm run type-check
npm run lint

# Monitor logs
tail -f logs/app.log

# Check database connection
npm run db:test
```

## 📈 Scaling Considerations

### 1. Horizontal Scaling
- ✅ Load balancer configuration
- ✅ Multiple application instances
- ✅ Database read replicas
- ✅ Redis for session storage

### 2. Vertical Scaling
- ✅ Increase server resources
- ✅ Optimize database performance
- ✅ Implement caching layers
- ✅ Use CDN for static assets

### 3. Auto-scaling
- ✅ Configure auto-scaling policies
- ✅ Monitor resource usage
- ✅ Set appropriate thresholds
- ✅ Implement graceful scaling

## 🔄 Continuous Deployment

### 1. GitHub Actions Setup
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run deploy:prod
```

### 2. Automated Testing
- ✅ Unit tests pass
- ✅ Integration tests pass
- ✅ E2E tests pass
- ✅ Performance tests pass

### 3. Rollback Strategy
- ✅ Keep previous deployment
- ✅ Database migration rollback
- ✅ Quick rollback procedures
- ✅ Monitoring for issues

## 📞 Support & Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

### Community
- [SalesPilots Discord](https://discord.gg/salespilots)
- [GitHub Issues](https://github.com/your-username/salespilots-io/issues)
- [Email Support](mailto:support@salespilots.io)

### Monitoring Tools
- [Vercel Analytics](https://vercel.com/analytics)
- [Sentry Error Tracking](https://sentry.io)
- [Supabase Dashboard](https://supabase.com/dashboard)

---

## 🎉 Success!

Your SalesPilots.io application is now deployed to production! 

**Next Steps:**
1. Monitor application performance
2. Set up alerting for critical issues
3. Configure backup strategies
4. Plan scaling strategies
5. Document deployment procedures

**Remember:** Always test in staging before deploying to production, and keep your deployment process documented and repeatable.

---

*Built with ❤️ by the SalesPilots team*
