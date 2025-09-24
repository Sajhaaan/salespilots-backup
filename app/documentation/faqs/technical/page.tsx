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
  Terminal,
  Cpu
} from 'lucide-react'

export default function TechnicalFAQs() {
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
        { name: "General", href: "/documentation/faqs/general" },
        { name: "Technical", href: "/documentation/faqs/technical", active: true },
        { name: "Billing", href: "/documentation/faqs/billing" }
      ]
    }
  ]

  const faqs = [
    {
      category: "API & Development",
      questions: [
        {
          question: "What are the API rate limits?",
          answer: "SalesPilot API has the following rate limits: 1000 requests per minute for standard plans, 5000 requests per minute for business plans, and 10000 requests per minute for enterprise plans. Rate limits reset every minute and are calculated per API key."
        },
        {
          question: "How do I authenticate API requests?",
          answer: "Use Bearer token authentication by including your API key in the Authorization header: 'Authorization: Bearer YOUR_API_KEY'. API keys can be generated in your dashboard under Settings > API Keys."
        },
        {
          question: "Can I use SalesPilot with my existing CRM?",
          answer: "Yes! SalesPilot provides webhooks and APIs for integration with popular CRMs like Salesforce, HubSpot, and Pipedrive. You can also use our Zapier integration for no-code connections to 3000+ apps."
        },
        {
          question: "Is there a sandbox environment for testing?",
          answer: "Yes, we provide a sandbox environment where you can test integrations without affecting live customer conversations. Use the sandbox API endpoint and your sandbox API key for testing."
        }
      ]
    },
    {
      category: "Platform & Infrastructure",
      questions: [
        {
          question: "What is SalesPilot's uptime guarantee?",
          answer: "We guarantee 99.9% uptime with our SLA. Our infrastructure is built on AWS with multi-region redundancy. You can check our real-time status and historical uptime at status.salespilot.io."
        },
        {
          question: "How does SalesPilot handle high message volumes?",
          answer: "Our platform automatically scales to handle traffic spikes. We process messages in real-time using distributed queuing systems and can handle thousands of concurrent conversations without performance degradation."
        },
        {
          question: "Where is my data stored?",
          answer: "Data is stored in secure, SOC 2 compliant data centers. By default, we use US regions, but EU data residency is available for GDPR compliance. All data is encrypted at rest using AES-256 encryption."
        },
        {
          question: "Can I get IP addresses for whitelisting?",
          answer: "Yes, we can provide static IP addresses for enterprise customers who need to whitelist SalesPilot's traffic. Contact our support team to discuss your specific networking requirements."
        }
      ]
    },
    {
      category: "Integrations & Compatibility",
      questions: [
        {
          question: "Which AI models does SalesPilot support?",
          answer: "SalesPilot supports OpenAI GPT-4, GPT-3.5 Turbo, and our own fine-tuned models. We're continuously adding support for new models like Claude and Llama. Enterprise customers can also use custom trained models."
        },
        {
          question: "Can I integrate with my e-commerce platform?",
          answer: "Yes! We have pre-built integrations for Shopify, WooCommerce, BigCommerce, and Magento. For other platforms, you can use our REST API or webhook system to build custom integrations."
        },
        {
          question: "Does SalesPilot work with multiple Instagram accounts?",
          answer: "Yes, you can connect multiple Instagram Business accounts to a single SalesPilot workspace. Each account can have separate automation rules and team assignments. Additional accounts may incur extra fees."
        },
        {
          question: "How do I set up webhooks for real-time notifications?",
          answer: "Configure webhooks in Settings > Integrations > Webhooks. Provide your endpoint URL (must be HTTPS) and select which events to receive. We'll send POST requests with signed payloads for security."
        }
      ]
    },
    {
      category: "Troubleshooting",
      questions: [
        {
          question: "My automation isn't responding to messages. What should I check?",
          answer: "First, verify your automation is enabled and not in testing mode. Check that your Instagram/WhatsApp account is properly connected. Review your trigger conditions and ensure they match the incoming message format. Check the activity log for error messages."
        },
        {
          question: "Why are my API requests failing with 401 errors?",
          answer: "401 errors indicate authentication issues. Verify your API key is correct and hasn't expired. Ensure you're using the correct API endpoint (production vs sandbox). Check that your API key has the necessary permissions for the endpoint you're calling."
        },
        {
          question: "Messages are being delayed. How can I troubleshoot?",
          answer: "Check our status page for any service disruptions. Verify you haven't hit rate limits. For Instagram, ensure your account is in good standing with Meta. For high volumes, consider upgrading to a higher-tier plan with priority processing."
        },
        {
          question: "How do I debug webhook delivery issues?",
          answer: "Check the webhook logs in your dashboard for delivery attempts and response codes. Ensure your endpoint responds with HTTP 200 and can handle our request format. Verify your SSL certificate is valid if using HTTPS."
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
              <span className="text-gray-300">Technical</span>
            </nav>

            {/* Page Header */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                    <Terminal className="w-4 h-4" />
                    <span>Technical FAQs</span>
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
                Technical FAQs
              </h1>
              
              <p className="text-xl text-gray-400 leading-relaxed mb-8">
                Technical questions about APIs, integrations, troubleshooting, and platform capabilities.
              </p>

              {/* FAQ Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search technical FAQs..."
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
                    {category.category === "API & Development" && <Code className="w-6 h-6 mr-3 text-blue-400" />}
                    {category.category === "Platform & Infrastructure" && <Cpu className="w-6 h-6 mr-3 text-green-400" />}
                    {category.category === "Integrations & Compatibility" && <Zap className="w-6 h-6 mr-3 text-purple-400" />}
                    {category.category === "Troubleshooting" && <Settings className="w-6 h-6 mr-3 text-orange-400" />}
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
                  <Terminal className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No technical FAQs found</h3>
                  <p className="text-gray-500 mb-6">Try different search terms or check our other FAQ categories.</p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>

            {/* Get Technical Support */}
            <div className="mt-16 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-8 border border-blue-800/30">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">Need Technical Support?</h2>
                <p className="text-gray-300 mb-6">
                  For complex technical issues or custom integration requirements, our engineering team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                  >
                    <Terminal className="w-5 h-5 mr-2" />
                    Contact Engineering
                  </Link>
                  <Link 
                    href="/documentation/developer-guides/api-reference"
                    className="inline-flex items-center px-6 py-3 bg-gray-800 text-gray-200 font-semibold rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
                  >
                    <Code className="w-5 h-5 mr-2" />
                    API Documentation
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="mt-16 flex items-center justify-between p-6 bg-gray-900/50 rounded-xl border border-gray-800">
              <Link 
                href="/documentation/faqs/general"
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Previous: General FAQs
              </Link>
              <Link 
                href="/documentation/faqs/billing"
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
              >
                Next: Billing FAQs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}