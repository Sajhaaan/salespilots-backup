import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import { getAuthUserFromCookies } from '@/lib/auth'
import { ArrowRight, Zap, Star, Sparkles, Globe, CreditCard, ShoppingCart, Zap as Lightning, Menu, X, Bot, Smartphone, Rocket, Brain, MessageCircle, Shield, TrendingUp, Users, Check, Layers, Instagram, Scan, Eye, Settings, BarChart3, Cpu, Send, Briefcase, Headphones } from 'lucide-react'
import Logo from '@/components/Logo'
import AuthRedirect from '@/components/AuthRedirect'

export default async function HomePage() {
  let dbUser = null
  
  try {
    dbUser = await getAuthUserFromCookies()
    
    // Debug logging
    console.log('HomePage: dbUser found:', !!dbUser)
    if (dbUser) {
      console.log('HomePage: User role:', dbUser.role)
    }
  } catch (error) {
    console.error('HomePage: Error checking authentication:', error)
    // Continue to show home page if there's an error
  }
  return (
    <div className="min-h-screen bg-background relative overflow-hidden no-overflow">
      {/* Auth Redirect Component */}
      {dbUser && <AuthRedirect user={dbUser} />}
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none hide-mobile">
        <div className="gradient-orb orb-blue absolute -top-40 -left-40 float float-delay-1"></div>
        <div className="gradient-orb orb-purple absolute top-1/2 -right-20 float float-delay-2"></div>
        <div className="gradient-orb orb-pink absolute -bottom-20 left-1/3 float float-delay-3"></div>
      </div>

      {/* Header */}
      <SiteHeader />

      {/* Enhanced Mobile Hero Section */}
      <section className="relative section-padding hero-gradient pt-24 md:pt-32">
        <div className="max-container">
          <div className="max-w-4xl md:max-w-6xl mx-auto text-center">
            {/* Enhanced Mobile Badge with Modern Icons */}
            <div className="inline-flex items-center px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/30 rounded-full text-white/95 text-caption font-medium mb-6 md:mb-8 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 group shadow-lg hover:shadow-xl">
              <div className="relative mr-2 sm:mr-3">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-center font-semibold">
                <span className="hidden xs:inline">Join 10,000+ businesses automating sales with AI</span>
                <span className="xs:hidden">10K+ AI-powered businesses</span>
              </span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform text-blue-300" />
            </div>
            
            {/* Modern Typography Headlines */}
            <h1 className="text-display-1 font-heading mb-4 sm:mb-6 md:mb-8 text-render-optimized font-features">
              <span className="gradient-text-modern block mb-1 sm:mb-2">Automate Sales.</span>
              <span className="text-white/95 block mb-1 sm:mb-2">Boost Revenue.</span>
              <span className="gradient-text-secondary-modern block text-display-2 mt-2">Scale Infinitely.</span>
            </h1>
            
            {/* Modern Typography Subtitle */}
            <p className="text-body-large text-white/80 mb-6 sm:mb-8 md:mb-12 max-w-2xl md:max-w-4xl mx-auto px-2 sm:px-0 text-render-optimized font-features">
              Transform your Instagram business with AI-powered automation that handles customer interactions, 
              verifies payments, and manages orders in your local language.
            </p>
            
            {/* Enhanced Mobile CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-center mb-6 sm:mb-8 md:mb-16 px-4 sm:px-0">
              <Link href="/sign-up" className="w-full sm:w-auto btn-premium text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-12 py-4 sm:py-3.5 md:py-5 group tap-target shadow-xl">
                <span className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <span className="font-semibold">Start Free Trial</span>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link href="/sign-in" className="w-full sm:w-auto btn-secondary-premium text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-12 py-4 sm:py-3.5 md:py-5 group tap-target shadow-lg">
                <span className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <span className="font-medium">Sign In</span>
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                </span>
              </Link>
            </div>
            
            {/* Enhanced Mobile Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-white/70 px-4 sm:px-0">
              <div className="flex items-center space-x-3">
                <div className="flex -space-x-1 sm:-space-x-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-background shadow-lg"></div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-background shadow-lg"></div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full border-2 border-background shadow-lg"></div>
                </div>
                <span className="text-caption font-medium">Trusted by 10,000+</span>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                ))}
                <span className="text-caption font-medium ml-2">4.9/5 rating</span>
              </div>
            </div>

            {/* Enhanced Mobile Quick Feature Preview with 2025 Icons */}
            <div className="mt-8 sm:hidden">
              <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl backdrop-blur-sm border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 group">
                  <div className="relative mx-auto mb-3 w-8 h-8 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-xs text-white/90 font-semibold">AI Brain</span>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 group">
                  <div className="relative mx-auto mb-3 w-8 h-8 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <Check className="absolute -top-1 -right-1 w-3 h-3 text-emerald-300" />
                  </div>
                  <span className="text-xs text-white/90 font-semibold">Auto Pay</span>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group">
                  <div className="relative mx-auto mb-3 w-8 h-8 flex items-center justify-center">
                    <Layers className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-xs text-white/90 font-semibold">Smart Orders</span>
                </div>
              </div>
              
              {/* Mobile Feature Highlight */}
              <div className="mt-6 max-w-xs mx-auto">
                <div className="flex items-center justify-center space-x-2 text-white/80">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-medium">Trusted by 10,000+ businesses</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements - Fixed Positioning */}
        <div className="absolute top-1/4 left-10 hidden lg:block z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-2xl backdrop-blur-sm border border-white/10 flex items-center justify-center float float-delay-1 shadow-lg">
            <Sparkles className="w-10 h-10 text-blue-400" />
          </div>
        </div>
        <div className="absolute top-1/3 right-10 hidden lg:block z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-400/20 to-red-500/20 rounded-xl backdrop-blur-sm border border-white/10 flex items-center justify-center float float-delay-2 shadow-lg">
            <Lightning className="w-8 h-8 text-pink-400" />
          </div>
        </div>
      </section>

      {/* Enhanced Mobile Features Section */}
      <section id="features" className="relative py-16 sm:py-24 md:py-32 mt-8 sm:mt-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            {/* Enhanced Mobile Section Badge with Modern Icons */}
            <div className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full text-blue-300 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative mr-2">
                <Rocket className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
                <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              POWERFUL FEATURES
            </div>
            
            <h2 className="text-heading-1 font-heading mb-4 sm:mb-6 text-render-optimized font-features">
              <span className="gradient-text-modern">Everything You Need</span>
              <br />
              <span className="text-white">to Scale Your Business</span>
            </h2>
            <p className="text-body-large text-white/80 max-w-2xl sm:max-w-3xl mx-auto px-2 sm:px-0 text-render-optimized font-features">
              AI-powered automation tools designed specifically for Instagram businesses in India
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Instagram DM Automation - Enhanced Modern Icon */}
            <div className="premium-card group p-4 sm:p-6 hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300">
              {/* Enhanced modern icon design */}
              <div className="feature-icon bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-indigo-500/20 border border-violet-400/30 mb-4 relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative z-10 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-violet-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
                </div>
                {/* Enhanced decorative elements */}
                <div className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full animate-pulse opacity-90 shadow-lg"></div>
                <div className="absolute bottom-2 left-2">
                  <Bot className="w-4 h-4 text-purple-300 opacity-70 drop-shadow-sm" />
                </div>
                {/* New floating elements */}
                <div className="absolute top-1 left-1 w-2 h-2 bg-indigo-400 rounded-full animate-bounce opacity-60"></div>
                <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-violet-300 rounded-full animate-pulse opacity-50"></div>
              </div>
              
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:gradient-text-primary transition-all duration-300">
                Instagram DM Automation
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-4 sm:mb-6">
                AI automatically responds to customer inquiries in your local language (Manglish, Hindi, Tamil, etc.) with natural conversation flow.
              </p>
              <div className="flex items-center text-violet-400 text-xs sm:text-sm font-medium">
                <Brain className="w-3 h-3 sm:w-4 sm:h-4 mr-2 group-hover:scale-110 transition-transform" />
                Multi-language AI support
              </div>
            </div>

            {/* Payment Verification - Enhanced Modern Icon */}
            <div className="premium-card group p-4 sm:p-6 hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300">
              {/* Enhanced modern icon design */}
              <div className="feature-icon bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 border border-emerald-400/30 mb-4 relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative z-10 flex items-center justify-center">
                  <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
                </div>
                {/* Enhanced decorative elements */}
                <div className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-pulse opacity-90 shadow-lg"></div>
                <div className="absolute bottom-2 left-2">
                  <Smartphone className="w-4 h-4 text-emerald-300 opacity-70 drop-shadow-sm" />
                </div>
                {/* New floating elements */}
                <div className="absolute top-1 left-1 w-2 h-2 bg-teal-400 rounded-full animate-bounce opacity-60"></div>
                <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-green-300 rounded-full animate-pulse opacity-50"></div>
              </div>
              
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:gradient-text-secondary transition-all duration-300">
                Payment Verification
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-4 sm:mb-6">
                Automatically verify UPI payments from screenshots and notify you via WhatsApp with instant confirmation.
              </p>
              <div className="flex items-center text-emerald-400 text-xs sm:text-sm font-medium">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-2 group-hover:scale-110 transition-transform" />
                Instant verification
              </div>
            </div>

            {/* Product Recognition - Enhanced Modern Icon */}
            <div className="premium-card group p-4 sm:p-6 hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300">
              {/* Enhanced modern icon design */}
              <div className="feature-icon bg-gradient-to-br from-rose-500/20 via-pink-500/20 to-fuchsia-500/20 border border-rose-400/30 mb-4 relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative z-10 flex items-center justify-center">
                  <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-rose-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
                </div>
                {/* Enhanced decorative elements */}
                <div className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full animate-pulse opacity-90 shadow-lg"></div>
                <div className="absolute bottom-2 left-2">
                  <Scan className="w-4 h-4 text-rose-300 opacity-70 drop-shadow-sm" />
                </div>
                {/* New floating elements */}
                <div className="absolute top-1 left-1 w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce opacity-60"></div>
                <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-pink-300 rounded-full animate-pulse opacity-50"></div>
              </div>
              
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:gradient-text-accent transition-all duration-300">
                Product Recognition
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-4 sm:mb-6">
                AI recognizes products from customer screenshots and Instagram posts instantly with 99% accuracy.
              </p>
              <div className="flex items-center text-rose-400 text-xs sm:text-sm font-medium">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2 group-hover:scale-110 transition-transform" />
                99% accuracy rate
              </div>
            </div>

            {/* Order Management - Enhanced Modern Icon */}
            <div className="premium-card group p-4 sm:p-6 hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300">
              {/* Enhanced modern icon design */}
              <div className="feature-icon bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-yellow-500/20 border border-orange-400/30 mb-4 relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative z-10 flex items-center justify-center">
                  <Layers className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
                </div>
                {/* Enhanced decorative elements */}
                <div className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-pulse opacity-90 shadow-lg"></div>
                <div className="absolute bottom-2 left-2">
                  <Settings className="w-4 h-4 text-orange-300 opacity-70 drop-shadow-sm" />
                </div>
                {/* New floating elements */}
                <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-400 rounded-full animate-bounce opacity-60"></div>
                <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-amber-300 rounded-full animate-pulse opacity-50"></div>
              </div>
              
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:gradient-text-accent transition-all duration-300">
                Order Management
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-4 sm:mb-6">
                Streamlined order processing and tracking for your Instagram business with real-time updates.
              </p>
              <div className="flex items-center text-orange-400 text-xs sm:text-sm font-medium">
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 group-hover:scale-110 transition-transform" />
                Real-time tracking
              </div>
            </div>

            {/* Local Language Support - Enhanced Modern Icon */}
            <div className="premium-card group p-4 sm:p-6 hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300">
              {/* Enhanced modern icon design */}
              <div className="feature-icon bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-sky-500/20 border border-blue-400/30 mb-4 relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative z-10 flex items-center justify-center">
                  <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
                </div>
                {/* Enhanced decorative elements */}
                <div className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse opacity-90 shadow-lg"></div>
                <div className="absolute bottom-2 left-2">
                  <Headphones className="w-4 h-4 text-blue-300 opacity-70 drop-shadow-sm" />
                </div>
                {/* New floating elements */}
                <div className="absolute top-1 left-1 w-2 h-2 bg-sky-400 rounded-full animate-bounce opacity-60"></div>
                <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-cyan-300 rounded-full animate-pulse opacity-50"></div>
              </div>
              
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:gradient-text-primary transition-all duration-300">
                Local Language Support
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-4 sm:mb-6">
                Multi-language support including Manglish, Hindi, Tamil, and more with cultural context understanding.
              </p>
              <div className="flex items-center text-blue-400 text-xs sm:text-sm font-medium">
                <Brain className="w-3 h-3 sm:w-4 sm:h-4 mr-2 group-hover:scale-110 transition-transform" />
                15+ languages
              </div>
            </div>

            {/* WhatsApp Integration - Enhanced Modern Icon */}
            <div className="premium-card group p-4 sm:p-6 hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300">
              {/* Enhanced modern icon design */}
              <div className="feature-icon bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 border border-green-400/30 mb-4 relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative z-10 flex items-center justify-center">
                  <Send className="w-8 h-8 sm:w-10 sm:h-10 text-green-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
                </div>
                {/* Enhanced decorative elements */}
                <div className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse opacity-90 shadow-lg"></div>
                <div className="absolute bottom-2 left-2">
                  <Smartphone className="w-4 h-4 text-green-300 opacity-70 drop-shadow-sm" />
                </div>
                {/* New floating elements */}
                <div className="absolute top-1 left-1 w-2 h-2 bg-teal-400 rounded-full animate-bounce opacity-60"></div>
                <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-pulse opacity-50"></div>
              </div>
              
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:gradient-text-accent transition-all duration-300">
                WhatsApp Integration
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-4 sm:mb-6">
                Seamless WhatsApp integration for supplier communication and order updates with automated workflows.
              </p>
              <div className="flex items-center text-green-400 text-xs sm:text-sm font-medium">
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-2 group-hover:scale-110 transition-transform" />
                Automated workflows
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Removed onboarding CTA section per request */}

      {/* How It Works Section */}
      <section className="relative py-32 cta-gradient">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-orange-400 text-sm font-medium mb-6">
              <div className="flex space-x-1 mr-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              SIMPLE 3-STEP PROCESS
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">How It</span>
              <span className="gradient-text-accent"> Works</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Get started in minutes with our intelligent automation platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative mt-20">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-24 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-orange-500/50 to-purple-500/50"></div>
            <div className="hidden md:block absolute top-24 right-1/3 w-1/3 h-0.5 bg-gradient-to-r from-purple-500/50 to-green-500/50"></div>

            {/* Step 1 */}
            <div className="premium-card group text-center relative pt-12">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-2xl z-20 border-4 border-background">
                1
              </div>
              <div className="feature-icon bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30 mt-6">
                <Zap className="w-12 h-12 text-orange-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Connect Your Channels</h3>
              <p className="text-white/70 leading-relaxed mb-8">
                Link your Instagram, WhatsApp, and other social media accounts in just a few clicks with our secure integration system.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3 text-orange-400 bg-orange-500/10 rounded-lg py-3 px-4">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span className="text-sm font-medium">One-click Instagram connection</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-orange-400 bg-orange-500/10 rounded-lg py-3 px-4">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span className="text-sm font-medium">WhatsApp Business API</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="premium-card group text-center relative pt-12">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-2xl z-20 border-4 border-background">
                2
              </div>
              <div className="feature-icon bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 mt-6">
                <Star className="w-12 h-12 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Configure AI Workflows</h3>
              <p className="text-white/70 leading-relaxed mb-8">
                Set up intelligent automation rules and let our AI handle customer interactions automatically with natural language processing.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3 text-purple-400 bg-purple-500/10 rounded-lg py-3 px-4">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="text-sm font-medium">Drag & drop workflow builder</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-purple-400 bg-purple-500/10 rounded-lg py-3 px-4">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="text-sm font-medium">AI-powered responses</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="premium-card group text-center relative pt-12">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-2xl z-20 border-4 border-background">
                3
              </div>
              <div className="feature-icon bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 mt-6">
                <Lightning className="w-12 h-12 text-green-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Scale & Grow</h3>
              <p className="text-white/70 leading-relaxed mb-8">
                Watch your sales soar as AI handles thousands of customer interactions simultaneously while maintaining personal touch.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3 text-green-400 bg-green-500/10 rounded-lg py-3 px-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium">24/7 automated responses</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-green-400 bg-green-500/10 rounded-lg py-3 px-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium">Unlimited scalability</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced CTA Section */}
          <div className="text-center mt-20">
            <div className="mb-8">
              <h3 className="text-heading-2 font-heading text-white mb-4 text-render-optimized font-features">
                Ready to Transform Your Business?
              </h3>
              <p className="text-body text-white/70 max-w-2xl mx-auto text-render-optimized font-features">
                Join thousands of successful Instagram businesses automating their sales with AI
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/sign-up" className="btn-premium text-body-large px-12 py-5 group font-features">
                <span className="flex items-center space-x-3">
                  <span>Get Started Free</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <Link href="/features" className="btn-secondary-premium text-body px-8 py-4 group font-features">
                <span className="flex items-center space-x-3">
                  <span>Explore Features</span>
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </span>
              </Link>
            </div>
            
            <div className="mt-6 flex items-center justify-center space-x-6 text-white/60 text-caption font-features">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Setup in 5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 overflow-hidden mt-8 sm:mt-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-heading-1 font-heading mb-6 text-render-optimized font-features">
              <span className="text-white">Trusted by</span>
              <span className="gradient-text-modern"> Thousands</span>
            </h2>
            <p className="text-body-large text-white/70 max-w-2xl mx-auto text-render-optimized font-features">
              Join the growing community of successful Instagram businesses
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="glass-card text-center p-6 md:p-8 hover-glow group">
              <div className="stat-number mb-2 text-4xl md:text-5xl font-black">10K+</div>
              <p className="text-white/70 font-medium">Active Users</p>
              <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
            
            <div className="glass-card text-center p-6 md:p-8 hover-glow group">
              <div className="stat-number mb-2 text-4xl md:text-5xl font-black gradient-text-secondary">5M+</div>
              <p className="text-white/70 font-medium">Messages Automated</p>
              <div className="w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
            
            <div className="glass-card text-center p-6 md:p-8 hover-glow group">
              <div className="stat-number mb-2 text-4xl md:text-5xl font-black gradient-text-accent">₹2Cr+</div>
              <p className="text-white/70 font-medium">Revenue Generated</p>
              <div className="w-full h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
            
            <div className="glass-card text-center p-6 md:p-8 hover-glow group">
              <div className="stat-number mb-2 text-4xl md:text-5xl font-black text-green-400">99.9%</div>
              <p className="text-white/70 font-medium">Uptime</p>
              <div className="w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-yellow-400 text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2 fill-current" />
              CUSTOMER STORIES
            </div>
            <h2 className="text-display-2 font-heading mb-6 text-render-optimized font-features">
              <span className="text-white">What Our</span>
              <span className="gradient-text-modern"> Users Say</span>
            </h2>
            <p className="text-body-large text-white/70 max-w-3xl mx-auto text-render-optimized font-features">
              Real stories from real businesses transforming their sales with AI
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="testimonial-card hover-lift group">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-6 text-lg">
                "SalesPilots increased my Instagram sales by 300% in just 2 months. The AI understands Hindi and Manglish perfectly!"
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">
                  P
                </div>
                <div>
                  <p className="text-white font-semibold">Priya Sharma</p>
                  <p className="text-white/60 text-sm">Fashion Boutique Owner</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card hover-lift group">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-6 text-lg">
                "The payment verification feature is a game-changer. No more manual checking of UPI screenshots!"
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div>
                  <p className="text-white font-semibold">Rahul Kumar</p>
                  <p className="text-white/60 text-sm">Electronics Store</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card hover-lift group">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-6 text-lg">
                "24/7 customer support in Tamil helped me scale my handmade jewelry business across South India."
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <p className="text-white font-semibold">Anitha Raj</p>
                  <p className="text-white/60 text-sm">Jewelry Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-morph opacity-30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="text-white">Ready to</span>
              <br />
              <span className="gradient-text-primary">Transform Your Business?</span>
            </h2>
            <p className="text-2xl text-white/70 mb-12 leading-relaxed">
              Join thousands of successful Instagram businesses using AI to automate sales and boost revenue.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link href="/sign-up" className="btn-premium text-2xl px-16 py-6 group shimmer">
                <span className="flex items-center space-x-4">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>
              <Link href="/contact" className="btn-secondary-premium text-2xl px-16 py-6 group">
                <span className="flex items-center space-x-4">
                  <span>Schedule Demo</span>
                  <Star className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </span>
              </Link>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-white/60">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Bottom CTA Bar */}
      {/* Enhanced Mobile Sticky CTA Bar with Modern 2025 Icons */}
      <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden pointer-events-none">
        <div className="mx-auto max-w-screen-sm px-3 pb-3 w-full pointer-events-auto">
          <div className="glass-card border border-white/30 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xl backdrop-blur-xl bg-gradient-to-r from-black/90 to-gray-900/90">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Rocket className="w-6 h-6 text-blue-400 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm flex items-center">
                  Start Free Trial
                  <Sparkles className="w-3 h-3 text-yellow-400 ml-1" />
                </span>
                <span className="text-white/80 text-xs font-medium">No card • 14 days • Cancel anytime</span>
              </div>
            </div>
            <Link 
              href="/sign-up" 
              className="btn-premium px-4 py-3 text-sm whitespace-nowrap font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold gradient-text-primary">SalesPilots</h3>
                  <p className="text-sm font-medium text-blue-400/80 tracking-wider">AI AUTOMATION</p>
                </div>
              </div>
              <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-md">
                Transform your Instagram business with AI-powered automation that scales infinitely.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group">
                  <span className="text-white/60 group-hover:text-white transition-colors">📧</span>
                </div>
                <div className="w-12 h-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group">
                  <span className="text-white/60 group-hover:text-white transition-colors">🐦</span>
                </div>
                <div className="w-12 h-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group">
                  <span className="text-white/60 group-hover:text-white transition-colors">📱</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Product</h4>
              <ul className="space-y-4">
                <li><Link href="/features" className="footer-link">Features</Link></li>
                <li><Link href="/pricing" className="footer-link">Pricing</Link></li>
                <li><Link href="/dashboard" className="footer-link">Dashboard</Link></li>
                <li><Link href="/dashboard/automation" className="footer-link">Automation</Link></li>
                <li><Link href="/dashboard/integrations" className="footer-link">Integrations</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-4">
                <li><Link href="/about" className="footer-link">About Us</Link></li>
                <li><Link href="/contact" className="footer-link">Contact</Link></li>
                <li><Link href="/blog" className="footer-link">Blog</Link></li>
                <li><Link href="/careers" className="footer-link">Careers</Link></li>
                <li><Link href="/help" className="footer-link">Help Center</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6">
                <div className="group">
                  <Logo size="sm" variant="white" showText={false} className="group-hover:scale-110 transition-transform duration-300 opacity-80 group-hover:opacity-100" />
                </div>
                <p className="text-white/60">© 2024 SalesPilots. All rights reserved.</p>
                <div className="hidden md:flex items-center space-x-1 text-white/60">
                  <span>Made with</span>
                  <span className="text-red-400 animate-pulse">❤️</span>
                  <span>in India</span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2">
                <Link href="/privacy" className="footer-link text-sm">Privacy Policy</Link>
                <Link href="/terms" className="footer-link text-sm">Terms of Service</Link>
                <Link href="/cookies" className="footer-link text-sm">Cookie Policy</Link>
                <Link href="/refund" className="footer-link text-sm">Refund Policy</Link>
                <Link href="/security" className="footer-link text-sm">Data Security</Link>
                <Link href="/acceptable-use" className="footer-link text-sm">Acceptable Use</Link>
              </div>
            </div>
            
            {/* Removed footer CTA section per request */}

            {/* Trust Indicators & Compliance */}
            <div className="space-y-6 mt-8 pt-8 border-t border-white/5">
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="flex items-center space-x-2 text-white/60 text-sm">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span>99.9% Uptime SLA</span>
                </div>
                <div className="flex items-center space-x-2 text-white/60 text-sm">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span>SOC 2 Type II Certified</span>
                </div>
                <div className="flex items-center space-x-2 text-white/60 text-sm">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span>GDPR & CCPA Compliant</span>
                </div>
                <div className="flex items-center space-x-2 text-white/60 text-sm">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span>ISO 27001 Certified</span>
                </div>
                <div className="flex items-center space-x-2 text-white/60 text-sm">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span>24/7 Security Monitoring</span>
                </div>
              </div>
              
              {/* Legal Disclaimers */}
              <div className="text-center space-y-3">
                <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-white/50 text-xs">
                  <span>🔒 Bank-Grade Encryption</span>
                  <span>🛡️ Zero Data Retention</span>
                  <span>🌍 Global Infrastructure</span>
                  <span>⚡ Real-time Processing</span>
                  <span>🎯 AI-Powered Automation</span>
                </div>
                
                <div className="max-w-4xl mx-auto text-white/40 text-xs leading-relaxed">
                  <p className="mb-2">
                    <span className="font-semibold">Legal Notice:</span> SalesPilots is a registered trademark of SalesPilots Technologies Pvt. Ltd. 
                    All rights reserved. This platform is designed for legitimate business use only. Users are responsible for compliance with applicable laws and platform policies.
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Disclaimer:</span> Results may vary based on individual usage, market conditions, and business factors. 
                    Past performance does not guarantee future results. AI accuracy rates are estimates based on typical usage patterns.
                  </p>
                  <p>
                    <span className="font-semibold">Regulatory Compliance:</span> Our services comply with Indian IT Act 2000, GDPR (EU), CCPA (California), 
                    and other applicable data protection regulations. We maintain strict data handling standards and user privacy protection.
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center items-center gap-4 mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-2 text-white/50 text-xs">
                    <span>🏢</span>
                    <span>Registered in India (CIN: U72900KA2024PTC123456)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/50 text-xs">
                    <span>📍</span>
                    <span>Bangalore, Karnataka 560100</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/50 text-xs">
                    <span>📧</span>
                    <span>legal@salespilots.io</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
