'use client'

import { useState } from 'react'
import Link from 'next/link'
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
  Workflow
} from 'lucide-react'

export default function FirstAutomation() {
  const [activeTab, setActiveTab] = useState('overview')
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
        { name: "Your First Agent", href: "/documentation/user-guides/first-automation", active: true },
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

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📋' },
    { id: 'setup', name: 'Setup Process', icon: '⚙️' },
    { id: 'templates', name: 'Templates', icon: '📝' },
    { id: 'testing', name: 'Testing', icon: '🧪' }
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
              <span className="text-gray-300">Your First Automation</span>
            </nav>

            {/* Page Header */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                    <Workflow className="w-4 h-4" />
                    <span>Automation Guide</span>
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
                Your First Automation
              </h1>
              
              <p className="text-xl text-gray-400 leading-relaxed">
                Learn how to create intelligent automation workflows that handle customer interactions naturally and efficiently.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="mb-8">
              <nav className="flex space-x-1 bg-gray-900/50 rounded-xl p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      activeTab === tab.id
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-6 text-gray-100">What is an Automation?</h2>
                  <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                    <p className="text-gray-300 leading-relaxed mb-4">
                      An automation is an intelligent workflow that handles customer interactions on your behalf. 
                      It can understand customer messages, respond appropriately, collect information, process orders, 
                      and escalate complex issues to humans when needed.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-200 mb-2">Smart Responses</h3>
                        <p className="text-sm text-gray-400">AI understands context and responds naturally</p>
                      </div>
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <Workflow className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-200 mb-2">Workflow Logic</h3>
                        <p className="text-sm text-gray-400">Define rules and conditions for different scenarios</p>
                      </div>
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-200 mb-2">Analytics</h3>
                        <p className="text-sm text-gray-400">Track performance and optimize over time</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-6 text-gray-100">Automation Types</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                      <h3 className="text-lg font-semibold text-gray-200 mb-3">📞 Customer Support</h3>
                      <p className="text-gray-400 mb-4">Handle common questions, provide product information, and route complex issues to humans.</p>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span>Answer FAQs instantly</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span>Provide business hours & contact info</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span>Escalate complex issues</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                      <h3 className="text-lg font-semibold text-gray-200 mb-3">🛒 Sales Assistant</h3>
                      <p className="text-gray-400 mb-4">Guide customers through your products, handle orders, and process payments.</p>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                          <span>Product recommendations</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                          <span>Order processing & payment</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                          <span>Upselling & cross-selling</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                      <h3 className="text-lg font-semibold text-gray-200 mb-3">📋 Lead Qualification</h3>
                      <p className="text-gray-400 mb-4">Qualify leads, collect contact information, and schedule consultations.</p>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span>Collect contact details</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span>Assess buying intent</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span>Schedule follow-ups</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                      <h3 className="text-lg font-semibold text-gray-200 mb-3">🎯 Marketing Campaigns</h3>
                      <p className="text-gray-400 mb-4">Run targeted campaigns, collect feedback, and nurture leads.</p>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                          <span>Promotional campaigns</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                          <span>Feedback collection</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                          <span>Lead nurturing sequences</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'setup' && (
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-6 text-gray-100">Setup Process</h2>
                  <div className="space-y-6">
                    {[
                      {
                        step: 1,
                        title: "Define Your Goal",
                        description: "What do you want your automation to achieve?",
                        details: [
                          "Identify the main purpose (support, sales, lead gen)",
                          "Define success metrics (response time, conversion rate)",
                          "Set up tracking and analytics goals"
                        ]
                      },
                      {
                        step: 2,
                        title: "Map Customer Journey",
                        description: "Understand how customers interact with your business",
                        details: [
                          "Identify common customer questions",
                          "Map out typical conversation flows",
                          "Define escalation triggers"
                        ]
                      },
                      {
                        step: 3,
                        title: "Create Response Templates",
                        description: "Build intelligent response patterns",
                        details: [
                          "Write natural, conversational responses",
                          "Include personalization variables",
                          "Add conditional logic for different scenarios"
                        ]
                      },
                      {
                        step: 4,
                        title: "Configure Workflow Logic",
                        description: "Set up rules and conditions",
                        details: [
                          "Define trigger conditions",
                          "Set up decision trees",
                          "Configure escalation rules"
                        ]
                      },
                      {
                        step: 5,
                        title: "Test & Refine",
                        description: "Validate and optimize your automation",
                        details: [
                          "Run test conversations",
                          "Analyze performance metrics",
                          "Iterate based on results"
                        ]
                      }
                    ].map((item) => (
                      <div key={item.step} className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold">
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
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-6 text-gray-100">Pre-built Templates</h2>
                  <p className="text-gray-400 mb-8">Start with these proven templates and customize them for your business.</p>
                  
                  <div className="grid gap-6">
                    {[
                      {
                        name: "E-commerce Store",
                        description: "Perfect for online stores selling physical products",
                        features: ["Product catalog integration", "Order processing", "Payment verification", "Shipping updates"],
                        complexity: "Beginner",
                        time: "15 minutes"
                      },
                      {
                        name: "Service Business",
                        description: "Ideal for consultants, agencies, and service providers",
                        features: ["Service information", "Appointment booking", "Quote requests", "FAQ handling"],
                        complexity: "Beginner",
                        time: "10 minutes"
                      },
                      {
                        name: "Restaurant & Food",
                        description: "Designed for restaurants and food delivery services",
                        features: ["Menu display", "Order taking", "Delivery coordination", "Table reservations"],
                        complexity: "Intermediate",
                        time: "20 minutes"
                      },
                      {
                        name: "Real Estate",
                        description: "Built for real estate agents and property companies",
                        features: ["Property listings", "Viewing appointments", "Lead qualification", "Market updates"],
                        complexity: "Intermediate",
                        time: "25 minutes"
                      }
                    ].map((template, index) => (
                      <div key={index} className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-200 mb-2">{template.name}</h3>
                            <p className="text-gray-400 mb-4">{template.description}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              template.complexity === 'Beginner' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-orange-500/20 text-orange-400'
                            }`}>
                              {template.complexity}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Features included:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {template.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-sm text-gray-400">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Setup time: {template.time}</span>
                          <Link 
                            href="/dashboard/automation"
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                          >
                            Use Template
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'testing' && (
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-6 text-gray-100">Testing Your Automation</h2>
                  <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 mb-8">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Why Testing Matters</h3>
                    <p className="text-gray-400 mb-4">
                      Testing ensures your automation works correctly before going live. It helps you identify 
                      potential issues, optimize response quality, and validate that all scenarios are handled properly.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <h4 className="font-medium text-gray-200 mb-2">🎯 Accuracy</h4>
                        <p className="text-sm text-gray-400">Verify responses are relevant and helpful</p>
                      </div>
                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <h4 className="font-medium text-gray-200 mb-2">🔄 Flow Logic</h4>
                        <p className="text-sm text-gray-400">Ensure conversation flows smoothly</p>
                      </div>
                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <h4 className="font-medium text-gray-200 mb-2">⚡ Performance</h4>
                        <p className="text-sm text-gray-400">Check response times and reliability</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                      <h3 className="text-lg font-semibold text-gray-200 mb-4">Testing Scenarios</h3>
                      <div className="space-y-4">
                        {[
                          {
                            scenario: "Happy Path",
                            description: "Test the ideal customer interaction flow",
                            examples: ["Customer asks about product → Gets info → Makes purchase"]
                          },
                          {
                            scenario: "Edge Cases",
                            description: "Test unusual or unexpected inputs",
                            examples: ["Typos and misspellings", "Off-topic questions", "Multiple questions at once"]
                          },
                          {
                            scenario: "Escalation Triggers",
                            description: "Verify when conversations get escalated to humans",
                            examples: ["Complex technical issues", "Complaints", "Refund requests"]
                          },
                          {
                            scenario: "Error Handling",
                            description: "Test how the system handles failures",
                            examples: ["Payment processing errors", "Inventory issues", "System timeouts"]
                          }
                        ].map((test, index) => (
                          <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                            <h4 className="font-medium text-gray-200 mb-2">{test.scenario}</h4>
                            <p className="text-sm text-gray-400 mb-3">{test.description}</p>
                            <div className="space-y-1">
                              {test.examples.map((example, idx) => (
                                <div key={idx} className="flex items-center space-x-2">
                                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                  <span className="text-xs text-gray-500">{example}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                      <h3 className="text-lg font-semibold text-gray-200 mb-4">Testing Tools</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-200 mb-2">🧪 Playground Mode</h4>
                          <p className="text-sm text-gray-400 mb-3">Test conversations in a safe environment without affecting real customers.</p>
                          <Link 
                            href="/dashboard/automation/playground"
                            className="inline-flex items-center text-purple-400 hover:text-purple-300 text-sm font-medium"
                          >
                            Open Playground
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-200 mb-2">📊 Analytics Dashboard</h4>
                          <p className="text-sm text-gray-400 mb-3">Monitor test results and performance metrics in real-time.</p>
                          <Link 
                            href="/dashboard/analytics"
                            className="inline-flex items-center text-purple-400 hover:text-purple-300 text-sm font-medium"
                          >
                            View Analytics
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Bottom Navigation */}
            <div className="mt-16 flex items-center justify-between p-6 bg-gray-900/50 rounded-xl border border-gray-800">
              <Link 
                href="/documentation/user-guides/quick-start"
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Previous: Quick Start Guide
              </Link>
              <Link 
                href="/documentation/user-guides/best-practices"
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
              >
                Next: Best Practices
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}