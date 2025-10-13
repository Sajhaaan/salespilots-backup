# 🚀 SalesPilots.io - AI-Powered Instagram Business Automation

**Transform your Instagram business with AI-powered automation that handles customer interactions, verifies payments, and manages orders in Indian languages.**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.6-38B2AC)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.56.0-3ECF8E)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ Features

- 🤖 **AI-Powered Automation** - Intelligent customer interaction handling
- 🌍 **Multi-Language Support** - Hindi, Tamil, Manglish & more
- 💳 **Payment Verification** - Automated payment processing & verification
- 📱 **Instagram Integration** - Seamless DM automation
- 📊 **Analytics Dashboard** - Comprehensive business insights
- 🔒 **Enterprise Security** - Bank-grade security & compliance
- 📈 **Scalable Architecture** - Built for high-volume businesses

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom JWT-based auth system
- **AI/ML**: OpenAI GPT-4 integration
- **Deployment**: Vercel, Docker-ready
- **Monitoring**: Built-in logging & analytics

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17.0 or higher
- npm 9.0.0 or higher
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/salespilots-io.git
   cd salespilots-io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Database Setup**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🔧 Configuration

### Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=SalesPilots
```

### Database Schema

The application uses Supabase with the following main tables:
- `users` - User accounts and profiles
- `businesses` - Business information and settings
- `conversations` - Customer interaction history
- `orders` - Order management and tracking
- `payments` - Payment verification and processing

## 📱 Features Overview

### 1. AI-Powered Customer Service
- **24/7 Availability** - Never miss a customer inquiry
- **Multi-Language Support** - Hindi, Tamil, Manglish, English
- **Context Awareness** - Remembers conversation history
- **Payment Verification** - Automated payment processing

### 2. Instagram Integration
- **DM Automation** - Handle customer messages automatically
- **Order Processing** - Convert conversations to orders
- **Payment Collection** - Secure payment processing
- **Analytics** - Track performance and engagement

### 3. Business Dashboard
- **Real-time Analytics** - Monitor business performance
- **Customer Insights** - Understand customer behavior
- **Revenue Tracking** - Track sales and conversions
- **Automation Rules** - Customize AI behavior

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Ensure Supabase and OpenAI keys are configured

3. **Custom Domain**
   - Configure your domain (e.g., salespilots.io)
   - Update DNS settings as per Vercel instructions

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates active
- [ ] Monitoring and logging enabled
- [ ] Backup strategy implemented
- [ ] Performance optimization applied

## 🔒 Security Features

- **JWT Authentication** - Secure user sessions
- **Rate Limiting** - Prevent abuse and attacks
- **Input Validation** - Sanitize all user inputs
- **CORS Protection** - Secure cross-origin requests
- **Data Encryption** - Encrypt sensitive information
- **Audit Logging** - Track all system activities

## 📊 Performance

- **Next.js 15** - Latest performance optimizations
- **Image Optimization** - Automatic image compression
- **Code Splitting** - Lazy load components
- **CDN Ready** - Optimized for global delivery
- **Database Indexing** - Fast query performance

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.salespilots.io](https://docs.salespilots.io)
- **Email**: support@salespilots.io
- **Discord**: [Join our community](https://discord.gg/salespilots)
- **Issues**: [GitHub Issues](https://github.com/your-username/salespilots-io/issues)

## 🙏 Acknowledgments

- Built with ❤️ by the SalesPilots team
- Powered by Next.js, Supabase, and OpenAI
- Special thanks to our beta users and contributors

---

**SalesPilots.io** - Transforming Instagram businesses with AI automation since 2024.

*Made in India, for the world.* 🇮🇳
