'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { 
  Copy, 
  ExternalLink, 
  Play, 
  Star, 
  Users, 
  Zap,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Bot,
  MessageCircle,
  BarChart3,
  Shield,
  BookOpen,
  Code,
  FileText,
  Settings,
  Search,
  Menu,
  X,
  ChevronRight,
  Home
} from 'lucide-react'

export default function DocumentationHome() {
  const [copied, setCopied] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sidebarItems = [
    {
      title: "User Guides",
      items: [
        { name: "Introduction", href: "/documentation", active: true },
        { name: "Quick Start", href: "/documentation/user-guides/quick-start" },
        { name: "Your First Agent", href: "/documentation/user-guides/first-automation" },
        { name: "Best Practices", href: "/documentation/user-guides/best-practices" }
      ]
    },
    {
      title: "Developer Guides", 
      items: [
        { name: "API Reference", href: "/documentation/developer-guides/api-reference" },
        { name: "SDK", href: "/documentation/developer-guides/sdk" },
        { name: "Webhooks", href: "/documentation/developer-guides/webhooks" }
      ]
    },
    {
      title: "Integrations",
      items: [
        { name: "Instagram", href: "/documentation/integrations/instagram" },
        { name: "WhatsApp", href: "/documentation/integrations/whatsapp" },
        { name: "OpenAI", href: "/documentation/integrations/openai" }
      ]
    },
    {
      title: "FAQs",
      items: [
        { name: "General", href: "/documentation/faqs/general" },
        { name: "Technical", href: "/documentation/faqs/technical" },
        { name: "Billing", href: "/documentation/faqs/billing" }
      ]
    }
  ]

  return (
    // Use fixed positioning to override any layout wrapper
    <div className="fixed inset-0 bg-gray-950 text-white overflow-hidden">
      {/* Top Navigation */}
      <header className="bg-gray-950 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo and mobile menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-200"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-100">SalesPilots</span>
              </Link>
            </div>

            {/* Center - Search (hidden on mobile) */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Right side - Navigation */}
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="hidden md:block text-gray-400 hover:text-gray-200 transition-colors">Dashboard</Link>
              <Link href="/pricing" className="hidden md:block text-gray-400 hover:text-gray-200 transition-colors">Pricing</Link>
              <Link href="/contact" className="hidden md:block text-gray-400 hover:text-gray-200 transition-colors">Support</Link>
              <div className="hidden md:block w-px h-6 bg-gray-700"></div>
              <Link href="/sign-in" className="text-gray-400 hover:text-gray-200 transition-colors">Sign In</Link>
              <Link href="/sign-up" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative top-0 z-40 w-80 h-full bg-gray-950 border-r border-gray-800 transition-transform duration-300 overflow-y-auto`}>
          <div className="p-6">
            {/* Mobile Search */}
            <div className="lg:hidden mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-8">
              {sidebarItems.map((section) => (
                <div key={section.title}>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                            item.active
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                          }`}
                        >
                          <span>{item.name}</span>
                          <ChevronRight className="w-4 h-4 opacity-30" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/70 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 bg-gray-950 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
              <Home className="w-4 h-4" />
              <ChevronRight className="w-4 h-4" />
              <span>User Guides</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-300">Introduction</span>
            </nav>

            {/* Page Header */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                    <Sparkles className="w-4 h-4" />
                    <span>Quick Start</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-500">Copy page</span>
                    </>
                  )}
                </button>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-100">
                Introduction
              </h1>
              
              <p className="text-xl text-gray-400 leading-relaxed">
                Welcome to the Quick Start guide for SalesPilots! This page will help you get up and 
                running with SalesPilots by walking you through the essential steps to set up your 
                account, create your first AI agent, and integrate it into your platform.
              </p>
            </div>

            {/* Hero Visual */}
            <div className="mb-16">
              <div className="relative bg-gray-900/50 rounded-2xl p-8 border border-gray-800 overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5" style={{ 
                  backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)', 
                  backgroundSize: '20px 20px' 
                }}></div>
                
                <div className="relative text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    AI agents for magical customer experiences
                  </h2>
                  <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                    SalesPilots is the complete platform for building & deploying AI automation agents for your business.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link 
                      href="/documentation/user-guides/quick-start"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
                    >
                      Build your agent
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                    <span className="text-sm text-gray-500">📋 No credit card required</span>
                  </div>

                  {/* Trusted by section */}
                  <div className="mt-12 text-center">
                    <p className="text-sm text-gray-600 mb-6">Trusted by 9000+ business worldwide</p>
                    <div className="flex justify-center items-center space-x-8 opacity-50">
                      <div className="text-gray-500 font-semibold text-sm">SIEMENS</div>
                      <div className="text-gray-500 font-semibold text-sm">POSTMAN</div>
                      <div className="text-gray-500 font-semibold text-sm">airplan</div>
                      <div className="text-gray-500 font-semibold text-sm">Opal</div>
                      <div className="text-gray-500 font-semibold text-sm">alBaraka</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What is SalesPilot */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6 text-gray-100">What is SalesPilots?</h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                The most advanced AI-powered sales automation platform designed to transform 
                how businesses handle customer interactions and drive revenue growth.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">AI-Powered Automation</h3>
                  <p className="text-gray-500">
                    Advanced AI agents that understand customer intent, respond intelligently, 
                    and handle complex sales conversations automatically.
                  </p>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">Multi-Channel Integration</h3>
                  <p className="text-gray-500">
                    Seamlessly integrate with Instagram DMs, WhatsApp Business, and other 
                    social media platforms where your customers are.
                  </p>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">Analytics & Insights</h3>
                  <p className="text-gray-500">
                    Real-time analytics, conversion tracking, and detailed insights into 
                    your automated sales performance.
                  </p>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">Enterprise Ready</h3>
                  <p className="text-gray-500">
                    Built-in security, compliance, scalability, and enterprise-grade 
                    features for businesses of all sizes.
                  </p>
                </div>
              </div>
            </section>

            {/* Getting Started Steps */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-8 text-gray-100">How to add the AI agent to my website?</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">Create Your Account</h3>
                    <p className="text-gray-500 mb-3">
                      Sign up for SalesPilots and complete your profile setup. Choose your plan based on your business needs.
                    </p>
                    <Link href="/sign-up" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                      Create Account →
                    </Link>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">Connect Your Integrations</h3>
                    <p className="text-gray-500 mb-3">
                      Connect your Instagram Business account, WhatsApp Business API, and configure your AI settings.
                    </p>
                    <Link href="/documentation/integrations/instagram" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                      Setup Integrations →
                    </Link>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">Create Your First Automation</h3>
                    <p className="text-gray-500 mb-3">
                      Set up your first AI automation workflow to handle customer inquiries and process orders automatically.
                    </p>
                    <Link href="/documentation/user-guides/first-automation" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                      Build Automation →
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Popular Documentation */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-8 text-gray-100">Popular Documentation</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link 
                  href="/documentation/user-guides/quick-start" 
                  className="group bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 hover:bg-gray-800/50 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-200 mb-2">Quick Start</h3>
                  <p className="text-gray-500 text-sm mb-4">Get up and running in minutes with our step-by-step guide.</p>
                  <div className="flex items-center text-purple-400 font-medium text-sm">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link 
                  href="/documentation/integrations/instagram" 
                  className="group bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 hover:bg-gray-800/50 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-200 mb-2">Chat bubble</h3>
                  <p className="text-gray-500 text-sm mb-4">Add a floating chat bubble to your website.</p>
                  <div className="flex items-center text-purple-400 font-medium text-sm">
                    <span>Integrate</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link 
                  href="/documentation/developer-guides/api-reference" 
                  className="group bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 hover:bg-gray-800/50 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-200 mb-2">API calls</h3>
                  <p className="text-gray-500 text-sm mb-4">Use our REST API to integrate with your systems.</p>
                  <div className="flex items-center text-purple-400 font-medium text-sm">
                    <span>API Docs</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}