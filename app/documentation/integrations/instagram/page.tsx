'use client'

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
  Home,
  Instagram,
  AlertTriangle
} from 'lucide-react'

export default function InstagramIntegration() {
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
        { name: "Introduction", href: "/documentation" },
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
        { name: "Instagram", href: "/documentation/integrations/instagram", active: true },
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
    <div className="fixed inset-0 bg-gray-950 text-white overflow-hidden">
      {/* Top Navigation */}
      <header className="bg-gray-950 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
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
                <span className="text-xl font-bold text-gray-100">SalesPilot</span>
              </Link>
            </div>

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
              <span>Integrations</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-300">Instagram</span>
            </nav>

            {/* Page Header */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                    <Instagram className="w-4 h-4" />
                    <span>Instagram Integration</span>
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
                Instagram Integration
              </h1>
              
              <p className="text-xl text-gray-400 leading-relaxed">
                Connect your Instagram Business account to automate DM responses and customer interactions.
              </p>
            </div>

            <div className="space-y-12">
              {/* Prerequisites */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-6">Prerequisites</h2>
                <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-6">
                  <h3 className="font-semibold text-yellow-300 mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Important Requirements
                  </h3>
                  <ul className="space-y-3 text-yellow-100/80">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <span>Instagram Business or Creator account (personal accounts not supported)</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <span>Facebook Page connected to your Instagram account</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <span>Admin access to both Instagram and Facebook accounts</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <span>Active SalesPilot subscription</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Step-by-step Setup */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-8">Setup Process</h2>
                <div className="space-y-6">
                  {[
                    {
                      step: 1,
                      title: "Access Integration Settings",
                      description: "Navigate to your SalesPilot dashboard integrations page",
                      details: [
                        "Log in to your SalesPilot dashboard",
                        "Go to Settings → Integrations",
                        "Find the Instagram card and click 'Connect'"
                      ]
                    },
                    {
                      step: 2,
                      title: "Authorize Instagram Access",
                      description: "Grant SalesPilot permission to access your Instagram account",
                      details: [
                        "Click 'Connect Instagram Account'",
                        "Log in with your Instagram Business account",
                        "Review and accept the requested permissions",
                        "Select the correct Instagram account if you have multiple"
                      ]
                    },
                    {
                      step: 3,
                      title: "Configure Settings",
                      description: "Set up your automation preferences and response settings",
                      details: [
                        "Choose your default response language",
                        "Set business hours for automated responses",
                        "Configure escalation triggers",
                        "Test the connection with a sample message"
                      ]
                    },
                    {
                      step: 4,
                      title: "Test & Launch",
                      description: "Verify everything works correctly before going live",
                      details: [
                        "Send a test message to your Instagram account",
                        "Verify the automation responds correctly",
                        "Check that messages appear in your dashboard",
                        "Enable live mode when satisfied"
                      ]
                    }
                  ].map((item) => (
                    <div key={item.step} className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-semibold">
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-200 mb-2">{item.title}</h3>
                          <p className="text-gray-400 mb-4">{item.description}</p>
                          <ul className="space-y-2">
                            {item.details.map((detail, index) => (
                              <li key={index} className="flex items-start space-x-3">
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm text-gray-400">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Features & Capabilities */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-8">Features & Capabilities</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Automated DM Responses",
                      description: "Respond to Instagram direct messages automatically using AI",
                      features: [
                        "Natural language understanding",
                        "Context-aware responses",
                        "Multi-language support",
                        "Rich media support (images, videos)"
                      ]
                    },
                    {
                      title: "Customer Management",
                      description: "Track and manage customer interactions across Instagram",
                      features: [
                        "Conversation history tracking",
                        "Customer profile management",
                        "Lead qualification scoring",
                        "Interaction analytics"
                      ]
                    },
                    {
                      title: "Business Integration",
                      description: "Connect Instagram interactions with your business processes",
                      features: [
                        "Order processing automation",
                        "Inventory status updates",
                        "Payment link generation",
                        "CRM synchronization"
                      ]
                    },
                    {
                      title: "Advanced Analytics",
                      description: "Detailed insights into your Instagram automation performance",
                      features: [
                        "Response time tracking",
                        "Conversion rate analysis",
                        "Customer satisfaction scores",
                        "Engagement metrics"
                      ]
                    }
                  ].map((feature, index) => (
                    <div key={index} className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                      <h3 className="text-lg font-semibold text-gray-200 mb-3">{feature.title}</h3>
                      <p className="text-gray-400 mb-4">{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.features.map((item, idx) => (
                          <li key={idx} className="flex items-center space-x-3">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-gray-400">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Troubleshooting */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-8">Troubleshooting</h2>
                <div className="space-y-4">
                  {[
                    {
                      issue: "Connection failed - 'Account not eligible'",
                      solution: "This usually means you're using a personal Instagram account. Convert to Instagram Business in your app settings and try again."
                    },
                    {
                      issue: "Messages not being received",
                      solution: "Check that your Instagram account is properly connected to a Facebook Page and that the Page has messaging enabled."
                    },
                    {
                      issue: "Automation not responding",
                      solution: "Verify your automation is enabled and not in testing mode. Check your business hours settings if responses are time-limited."
                    },
                    {
                      issue: "Slow response times",
                      solution: "This may be due to high message volume. Contact support to discuss upgrading your plan for faster processing."
                    }
                  ].map((faq, index) => (
                    <details key={index} className="bg-gray-900/50 border border-gray-800 rounded-xl">
                      <summary className="p-6 cursor-pointer font-medium text-gray-200 hover:bg-gray-800/50 rounded-xl">
                        {faq.issue}
                      </summary>
                      <div className="px-6 pb-6 text-sm text-gray-400">
                        <p>{faq.solution}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            </div>

            {/* Bottom Navigation */}
            <div className="mt-16 flex items-center justify-between p-6 bg-gray-900/50 rounded-xl border border-gray-800">
              <Link 
                href="/documentation/developer-guides/api-reference"
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Previous: API Reference
              </Link>
              <Link 
                href="/documentation/integrations/whatsapp"
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
              >
                Next: WhatsApp Integration
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}