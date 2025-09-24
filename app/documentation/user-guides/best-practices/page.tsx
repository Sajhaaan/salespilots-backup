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
  Clock,
  Workflow,
  TrendingUp,
  AlertTriangle,
  Target,
  Heart,
  Lightbulb
} from 'lucide-react'

export default function BestPractices() {
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
        { name: "Best Practices", href: "/documentation/user-guides/best-practices", active: true }
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
              <span>User Guides</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-300">Best Practices</span>
            </nav>

            {/* Page Header */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                    <Star className="w-4 h-4" />
                    <span>Best Practices</span>
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
                Best Practices
              </h1>
              
              <p className="text-xl text-gray-400 leading-relaxed">
                Optimize your automation performance with proven strategies and expert recommendations.
              </p>
            </div>

            <div className="space-y-12">
              {/* Conversation Design */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-8 flex items-center">
                  <MessageCircle className="w-6 h-6 mr-3 text-purple-400" />
                  Conversation Design
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-green-900/20 border-l-4 border-green-500 p-6 rounded-r-xl">
                    <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Do: Keep It Natural
                    </h3>
                    <ul className="text-green-300 space-y-2 pl-7">
                      <li>• Use conversational language that matches your brand voice</li>
                      <li>• Include casual greetings and natural transitions</li>
                      <li>• Ask clarifying questions when needed</li>
                      <li>• Use emojis appropriately to add personality</li>
                    </ul>
                  </div>

                  <div className="bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-xl">
                    <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Don't: Sound Like a Robot
                    </h3>
                    <ul className="text-red-300 space-y-2 pl-7">
                      <li>• Avoid overly formal or technical language</li>
                      <li>• Don't use robotic phrases like "I am an AI assistant"</li>
                      <li>• Avoid long, complex sentences</li>
                      <li>• Don't overwhelm with too many options at once</li>
                    </ul>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Example: Good vs Bad</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium text-green-400">✅ Good Example</h4>
                        <div className="bg-green-900/20 p-4 rounded-lg border border-green-800">
                          <p className="text-green-200 text-sm">
                            "Hey! 👋 I saw you're interested in our Nike Air Max. They're super popular! 
                            What size are you looking for? I can check if we have it in stock."
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-red-400">❌ Bad Example</h4>
                        <div className="bg-red-900/20 p-4 rounded-lg border border-red-800">
                          <p className="text-red-200 text-sm">
                            "I am an automated system. You have inquired about product ID 12345. 
                            Please provide your size requirements for inventory verification."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Performance Optimization */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-8 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3 text-purple-400" />
                  Performance Optimization
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                      Response Speed
                    </h3>
                    <ul className="space-y-3 text-gray-400">
                      <li className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2"></div>
                        <span className="text-sm">Keep responses under 3 seconds for optimal UX</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2"></div>
                        <span className="text-sm">Use caching for frequently requested information</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2"></div>
                        <span className="text-sm">Optimize workflow logic to minimize processing time</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-400" />
                      Accuracy Metrics
                    </h3>
                    <ul className="space-y-3 text-gray-400">
                      <li className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2"></div>
                        <span className="text-sm">Aim for 95%+ intent recognition accuracy</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2"></div>
                        <span className="text-sm">Monitor and fix common misunderstandings</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2"></div>
                        <span className="text-sm">Regular testing with real customer scenarios</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-pink-400" />
                      Customer Satisfaction
                    </h3>
                    <ul className="space-y-3 text-gray-400">
                      <li className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-2"></div>
                        <span className="text-sm">Collect feedback after interactions</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-2"></div>
                        <span className="text-sm">Provide easy escalation to human support</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-2"></div>
                        <span className="text-sm">Personalize responses based on customer history</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
                      Analytics Tracking
                    </h3>
                    <ul className="space-y-3 text-gray-400">
                      <li className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2"></div>
                        <span className="text-sm">Track conversion rates and goal completions</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2"></div>
                        <span className="text-sm">Monitor drop-off points in conversations</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2"></div>
                        <span className="text-sm">A/B test different response strategies</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Security & Compliance */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-8 flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-purple-400" />
                  Security & Compliance
                </h2>

                <div className="space-y-6">
                  <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Data Protection Guidelines
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-yellow-200 mb-3">Personal Information</h4>
                        <ul className="space-y-2 text-yellow-100/80 text-sm">
                          <li>• Never store sensitive data longer than necessary</li>
                          <li>• Always encrypt customer payment information</li>
                          <li>• Comply with GDPR/CCPA data retention policies</li>
                          <li>• Provide clear opt-out mechanisms</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-yellow-200 mb-3">Access Control</h4>
                        <ul className="space-y-2 text-yellow-100/80 text-sm">
                          <li>• Use role-based access for team members</li>
                          <li>• Regularly audit user permissions</li>
                          <li>• Enable two-factor authentication</li>
                          <li>• Monitor for suspicious activity</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Compliance Checklist
                    </h3>
                    <div className="space-y-3">
                      {[
                        "Privacy policy clearly explains data usage",
                        "Cookie consent mechanisms in place",
                        "Customer data deletion process documented",
                        "Regular security audits scheduled",
                        "Staff training on data protection completed",
                        "Incident response plan established"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-blue-400" />
                          <span className="text-blue-200 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Advanced Tips */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-8 flex items-center">
                  <Lightbulb className="w-6 h-6 mr-3 text-purple-400" />
                  Advanced Tips
                </h2>

                <div className="grid gap-6">
                  {[
                    {
                      title: "Contextual Memory",
                      description: "Use conversation history to provide more relevant responses",
                      tips: [
                        "Remember customer preferences from previous interactions",
                        "Reference past purchases or inquiries naturally",
                        "Build on previous conversation topics",
                        "Maintain context across multiple channels"
                      ],
                      icon: "🧠"
                    },
                    {
                      title: "Dynamic Personalization",
                      description: "Adapt responses based on customer behavior and data",
                      tips: [
                        "Use customer name and purchase history",
                        "Adjust tone based on customer segment",
                        "Recommend products based on browsing behavior",
                        "Customize offers for returning customers"
                      ],
                      icon: "🎯"
                    },
                    {
                      title: "Proactive Engagement",
                      description: "Reach out to customers at the right moments",
                      tips: [
                        "Send abandoned cart reminders",
                        "Follow up on recent purchases",
                        "Notify about relevant promotions",
                        "Check in after support interactions"
                      ],
                      icon: "⚡"
                    },
                    {
                      title: "Multi-language Support",
                      description: "Serve customers in their preferred language",
                      tips: [
                        "Auto-detect customer language preference",
                        "Maintain consistency across translations",
                        "Use culturally appropriate responses",
                        "Provide seamless language switching"
                      ],
                      icon: "🌍"
                    }
                  ].map((tip, index) => (
                    <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center">
                        <span className="text-2xl mr-3">{tip.icon}</span>
                        {tip.title}
                      </h3>
                      <p className="text-gray-400 mb-4">{tip.description}</p>
                      <ul className="space-y-2">
                        {tip.tips.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-400">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Performance Benchmarks */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-8">📊 Performance Benchmarks</h2>
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-200 mb-6">Industry Standards to Aim For</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { metric: "Response Time", target: "< 3 seconds", icon: "⚡", color: "text-yellow-400" },
                      { metric: "Accuracy Rate", target: "> 95%", icon: "🎯", color: "text-blue-400" },
                      { metric: "Customer Satisfaction", target: "> 85%", icon: "😊", color: "text-green-400" },
                      { metric: "Conversion Rate", target: "> 15%", icon: "💰", color: "text-purple-400" }
                    ].map((benchmark, index) => (
                      <div key={index} className="text-center p-4 bg-gray-800/50 rounded-lg">
                        <div className="text-3xl mb-2">{benchmark.icon}</div>
                        <h4 className="font-medium text-gray-200 mb-1">{benchmark.metric}</h4>
                        <div className={`text-2xl font-bold ${benchmark.color}`}>{benchmark.target}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Bottom Navigation */}
            <div className="mt-16 flex items-center justify-between p-6 bg-gray-900/50 rounded-xl border border-gray-800">
              <Link 
                href="/documentation/user-guides/first-automation"
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Previous: Your First Automation
              </Link>
              <Link 
                href="/documentation/developer-guides/api-reference"
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
              >
                Next: Developer Guides
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}