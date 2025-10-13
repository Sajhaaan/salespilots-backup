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
  HelpCircle,
  Clock,
  DollarSign
} from 'lucide-react'

export default function GeneralFAQs() {
  const [copied, setCopied] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

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
        { name: "Instagram", href: "/documentation/integrations/instagram" },
        { name: "WhatsApp", href: "/documentation/integrations/whatsapp" },
        { name: "OpenAI", href: "/documentation/integrations/openai" }
      ]
    },
    {
      title: "FAQs",
      items: [
        { name: "General", href: "/documentation/faqs/general", active: true },
        { name: "Technical", href: "/documentation/faqs/technical" },
        { name: "Billing", href: "/documentation/faqs/billing" }
      ]
    }
  ]

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "What is SalesPilot and how does it work?",
          answer: "SalesPilot is an AI-powered automation platform that handles customer conversations on Instagram and WhatsApp. It uses advanced AI to understand customer messages, provide relevant responses, process orders, and escalate complex issues to humans when needed."
        },
        {
          question: "Do I need technical knowledge to use SalesPilot?",
          answer: "No! SalesPilot is designed for business owners without technical backgrounds. Our setup wizard guides you through the process, and our pre-built templates handle most common scenarios. You can be up and running in under 30 minutes."
        },
        {
          question: "Which social media platforms does SalesPilot support?",
          answer: "Currently, SalesPilot supports Instagram Business accounts and WhatsApp Business API. We're constantly adding new platforms based on customer demand. Contact us if you need integration with a specific platform."
        },
        {
          question: "How quickly can I get started with SalesPilot?",
          answer: "Most customers complete setup within 30 minutes. This includes connecting your Instagram Business account, configuring basic automation rules, and testing responses. More advanced customizations can be done gradually over time."
        }
      ]
    },
    {
      category: "Features & Capabilities", 
      questions: [
        {
          question: "Can SalesPilot handle complex customer inquiries?",
          answer: "Yes! SalesPilot uses advanced AI to understand context and handle complex conversations. For highly complex or sensitive issues, it can seamlessly escalate to human agents while maintaining conversation history and context."
        },
        {
          question: "Does SalesPilot work in multiple languages?",
          answer: "Yes, SalesPilot supports multiple languages including English, Spanish, French, German, Portuguese, and many others. The AI automatically detects the customer's language and responds appropriately."
        },
        {
          question: "Can I customize the AI's responses and personality?",
          answer: "Absolutely! You can define your brand's tone, personality, and specific response guidelines. The AI learns your business context, product information, and communication style to provide consistent, on-brand responses."
        },
        {
          question: "How does SalesPilot handle order processing?",
          answer: "SalesPilot can integrate with your existing payment systems and inventory management. It can check product availability, process orders, generate payment links, and send order confirmations automatically."
        }
      ]
    },
    {
      category: "Pricing & Plans",
      questions: [
        {
          question: "How much does SalesPilot cost?",
          answer: "SalesPilot offers flexible pricing plans starting from $99/month for small businesses. We also offer a 14-day free trial with no credit card required. Visit our pricing page for detailed plan comparisons."
        },
        {
          question: "Is there a free trial available?",
          answer: "Yes! We offer a 14-day free trial that includes full access to all features. No credit card is required to start your trial, and you can cancel anytime during the trial period."
        },
        {
          question: "Can I change my plan at any time?",
          answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated. Contact our support team if you need assistance with plan changes."
        },
        {
          question: "Are there any setup fees or hidden costs?",
          answer: "No, there are no setup fees or hidden costs. Our pricing is transparent and includes all features listed in your plan. The only additional costs might be third-party services like OpenAI API usage if you exceed the included limits."
        }
      ]
    },
    {
      category: "Security & Privacy",
      questions: [
        {
          question: "How secure is my customer data with SalesPilot?",
          answer: "We take security very seriously. All data is encrypted in transit and at rest. We're SOC 2 compliant and follow strict data protection protocols. Customer conversations are processed securely and can be automatically deleted based on your retention policies."
        },
        {
          question: "Is SalesPilot GDPR compliant?",
          answer: "Yes, SalesPilot is fully GDPR compliant. We provide data processing agreements, support data subject requests, and offer granular privacy controls. You have full control over customer data retention and deletion."
        },
        {
          question: "Who has access to my customer conversations?",
          answer: "Only you and authorized team members have access to your customer conversations. SalesPilot staff cannot access your data unless you explicitly grant permission for support purposes. All access is logged and auditable."
        },
        {
          question: "Can I export my data if I decide to leave SalesPilot?",
          answer: "Yes, you can export all your data at any time, including conversation history, customer information, and automation configurations. We provide multiple export formats and ensure smooth data portability."
        }
      ]
    }
  ]

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

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
              <span>FAQs</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-300">General</span>
            </nav>

            {/* Page Header */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                    <HelpCircle className="w-4 h-4" />
                    <span>General FAQs</span>
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
                Frequently Asked Questions
              </h1>
              
              <p className="text-xl text-gray-400 leading-relaxed mb-8">
                Find answers to common questions about SalesPilot's features, pricing, and getting started.
              </p>

              {/* FAQ Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {/* FAQ Categories */}
            <div className="space-y-12">
              {filteredFAQs.map((category, categoryIndex) => (
                <section key={categoryIndex}>
                  <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
                    {category.category === "Getting Started" && <Play className="w-6 h-6 mr-3 text-blue-400" />}
                    {category.category === "Features & Capabilities" && <Zap className="w-6 h-6 mr-3 text-purple-400" />}
                    {category.category === "Pricing & Plans" && <DollarSign className="w-6 h-6 mr-3 text-green-400" />}
                    {category.category === "Security & Privacy" && <Shield className="w-6 h-6 mr-3 text-orange-400" />}
                    {category.category}
                  </h2>
                  
                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => (
                      <details key={faqIndex} className="bg-gray-900/50 border border-gray-800 rounded-xl">
                        <summary className="p-6 cursor-pointer font-medium text-gray-200 hover:bg-gray-800/50 rounded-xl transition-colors">
                          {faq.question}
                        </summary>
                        <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                          <p>{faq.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              ))}

              {filteredFAQs.length === 0 && searchTerm && (
                <div className="text-center py-12">
                  <HelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No results found</h3>
                  <p className="text-gray-500 mb-6">Try searching with different keywords or browse our categories above.</p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>

            {/* Still Need Help */}
            <div className="mt-16 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-8 border border-purple-800/30">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">Still need help?</h2>
                <p className="text-gray-300 mb-6">
                  Can't find what you're looking for? Our support team is here to help you get the most out of SalesPilot.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Contact Support
                  </Link>
                  <Link 
                    href="/documentation/user-guides/quick-start"
                    className="inline-flex items-center px-6 py-3 bg-gray-800 text-gray-200 font-semibold rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Read Guides
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="mt-16 flex items-center justify-between p-6 bg-gray-900/50 rounded-xl border border-gray-800">
              <Link 
                href="/documentation/integrations/openai"
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Previous: OpenAI Integration
              </Link>
              <Link 
                href="/documentation/faqs/technical"
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
              >
                Next: Technical FAQs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}