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
  CreditCard,
  DollarSign
} from 'lucide-react'

export default function BillingFAQs() {
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
        { name: "Technical", href: "/documentation/faqs/technical" },
        { name: "Billing", href: "/documentation/faqs/billing", active: true }
      ]
    }
  ]

  const faqs = [
    {
      category: "Pricing & Plans",
      questions: [
        {
          question: "What are SalesPilot's pricing plans?",
          answer: "We offer three main plans: Starter ($99/month) for small businesses, Business ($299/month) for growing companies, and Enterprise ($799/month) for large organizations. Each plan includes different message limits, features, and support levels. All plans include a 14-day free trial."
        },
        {
          question: "How does message-based pricing work?",
          answer: "Our pricing is based on the number of messages your AI automation sends per month. Incoming messages from customers are always free. Only outbound AI-generated responses count toward your monthly limit. If you exceed your limit, overage charges apply at $0.05 per message."
        },
        {
          question: "Can I change my plan at any time?",
          answer: "Yes! You can upgrade or downgrade your plan at any time from your dashboard. Upgrades take effect immediately with prorated billing. Downgrades take effect at the next billing cycle to ensure you don't lose paid features mid-cycle."
        },
        {
          question: "Is there a free trial available?",
          answer: "Yes, we offer a 14-day free trial that includes full access to all features in the Business plan. No credit card is required to start your trial. You can cancel anytime during the trial period without being charged."
        }
      ]
    },
    {
      category: "Billing & Payments",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers. All payments are processed securely through Stripe with PCI DSS compliance."
        },
        {
          question: "When am I billed?",
          answer: "Billing occurs monthly on the same date you started your subscription. For example, if you signed up on the 15th, you'll be billed on the 15th of each month. We send invoice reminders 3 days before billing."
        },
        {
          question: "Can I get a refund if I'm not satisfied?",
          answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied within the first 30 days, contact our support team for a full refund. Refunds for subsequent months are considered on a case-by-case basis."
        },
        {
          question: "Do you offer annual billing discounts?",
          answer: "Yes! Annual billing saves you 20% compared to monthly billing. For example, the Business plan costs $2,390/year (equivalent to $199/month) instead of $299/month. Annual plans also include additional benefits like priority support."
        }
      ]
    },
    {
      category: "Usage & Limits",
      questions: [
        {
          question: "What happens if I exceed my message limit?",
          answer: "If you exceed your monthly message limit, we'll continue service but charge overage fees at $0.05 per additional message. You'll receive notifications at 80% and 100% usage. You can upgrade your plan anytime to avoid overage charges."
        },
        {
          question: "How do I track my message usage?",
          answer: "Your dashboard shows real-time usage metrics including messages sent this month, remaining quota, and usage trends. You can also set up alerts to notify you when approaching your limits or configure automatic plan upgrades."
        },
        {
          question: "Are there limits on the number of conversations?",
          answer: "No, there are no limits on the number of conversations or customers you can serve. The only limit is on outbound messages sent by your AI automation. You can have unlimited incoming messages and unlimited conversation history."
        },
        {
          question: "What counts as a 'message' in my plan?",
          answer: "Only outbound messages sent by your AI automation count toward your limit. This includes automated responses, proactive messages, and follow-ups. Incoming messages from customers, human agent responses, and system notifications don't count."
        }
      ]
    },
    {
      category: "Enterprise & Custom Plans",
      questions: [
        {
          question: "Do you offer enterprise pricing?",
          answer: "Yes! Enterprise plans start at $799/month and include higher message limits, advanced features, dedicated support, and custom integrations. We also offer volume discounts and custom pricing for large organizations with specific requirements."
        },
        {
          question: "Can I get a custom plan for my specific needs?",
          answer: "Absolutely! For unique requirements, we can create custom plans with specific message limits, features, or integrations. Contact our sales team to discuss your needs and get a personalized quote."
        },
        {
          question: "Do you offer reseller or agency pricing?",
          answer: "Yes, we have special pricing for agencies and resellers managing multiple client accounts. Our partner program includes volume discounts, white-label options, and dedicated account management. Apply through our partner portal."
        },
        {
          question: "Is there a non-profit discount available?",
          answer: "Yes! Qualified non-profit organizations can receive up to 50% discount on our plans. Contact our support team with your non-profit documentation to apply for the discount."
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
              <span className="text-gray-300">Billing</span>
            </nav>

            {/* Page Header */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                    <CreditCard className="w-4 h-4" />
                    <span>Billing FAQs</span>
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
                Billing & Pricing FAQs
              </h1>
              
              <p className="text-xl text-gray-400 leading-relaxed mb-8">
                Everything you need to know about SalesPilot pricing, billing, and payment options.
              </p>

              {/* FAQ Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search billing FAQs..."
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
                    {category.category === "Pricing & Plans" && <DollarSign className="w-6 h-6 mr-3 text-green-400" />}
                    {category.category === "Billing & Payments" && <CreditCard className="w-6 h-6 mr-3 text-blue-400" />}
                    {category.category === "Usage & Limits" && <BarChart3 className="w-6 h-6 mr-3 text-purple-400" />}
                    {category.category === "Enterprise & Custom Plans" && <Users className="w-6 h-6 mr-3 text-orange-400" />}
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
                  <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No billing FAQs found</h3>
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

            {/* Billing Support */}
            <div className="mt-16 bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-xl p-8 border border-green-800/30">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">Need Billing Support?</h2>
                <p className="text-gray-300 mb-6">
                  Have questions about your bill, need to update payment methods, or want to discuss custom pricing? 
                  Our billing team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Contact Billing
                  </Link>
                  <Link 
                    href="/pricing"
                    className="inline-flex items-center px-6 py-3 bg-gray-800 text-gray-200 font-semibold rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    View Pricing
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="mt-16 flex items-center justify-between p-6 bg-gray-900/50 rounded-xl border border-gray-800">
              <Link 
                href="/documentation/faqs/technical"
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Previous: Technical FAQs
              </Link>
              <div className="flex items-center text-gray-500">
                <span>End of Documentation</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}