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
  Clock
} from 'lucide-react'

export default function QuickStart() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [copied, setCopied] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleStep = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) {
      setCompletedSteps(completedSteps.filter(step => step !== stepNumber))
    } else {
      setCompletedSteps([...completedSteps, stepNumber])
    }
  }

  const sidebarItems = [
    {
      title: "User Guides",
      items: [
        { name: "Introduction", href: "/documentation" },
        { name: "Quick Start", href: "/documentation/user-guides/quick-start", active: true },
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

  const steps = [
    {
      number: 1,
      title: "Create Your Account",
      time: "2 minutes",
      description: "Sign up for SalesPilot and verify your email address",
      details: [
        "Go to the sign-up page and enter your business details",
        "Choose your subscription plan (start with free trial)",
        "Verify your email address",
        "Complete your business profile setup"
      ],
      actionLink: "/sign-up",
      actionText: "Create Account"
    },
    {
      number: 2,
      title: "Connect Instagram Business",
      time: "5 minutes", 
      description: "Link your Instagram Business account to enable automation",
      details: [
        "Navigate to Integrations in your dashboard",
        "Click 'Connect Instagram' and authorize the app",
        "Select your Instagram Business account",
        "Configure your automation preferences"
      ],
      actionLink: "/dashboard/integrations",
      actionText: "Go to Integrations"
    },
    {
      number: 3,
      title: "Configure AI Settings",
      time: "3 minutes",
      description: "Set up your AI automation preferences and responses",
      details: [
        "Go to AI Configuration in your dashboard",
        "Set your business tone and personality",
        "Configure automatic response templates",
        "Set up escalation rules for complex queries"
      ],
      actionLink: "/onboarding",
      actionText: "Start Setup"
    },
    {
      number: 4,
      title: "Create Your First Automation",
      time: "10 minutes",
      description: "Build your first automated workflow for customer interactions",
      details: [
        "Navigate to Automation → Create New Workflow",
        "Choose a template or start from scratch",
        "Define triggers and response conditions",
        "Test your automation with sample messages"
      ],
      actionLink: "/dashboard/automation",
      actionText: "Create Automation"
    },
    {
      number: 5,
      title: "Test & Launch",
      time: "5 minutes",
      description: "Test your automation and go live",
      details: [
        "Use the testing playground to simulate conversations",
        "Review and adjust automation responses",
        "Enable live mode when satisfied",
        "Monitor performance in the analytics dashboard"
      ],
      actionLink: "/dashboard",
      actionText: "Go to Dashboard"
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
                <span className="text-xl font-bold text-gray-100">SalesPilot</span>
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
              <span className="text-gray-300">Quick Start</span>
            </nav>

            {/* Page Header */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                    <Zap className="w-4 h-4" />
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
                Quick Start
              </h1>
              
              <p className="text-xl text-gray-400 leading-relaxed">
                Get your AI automation up and running in under 30 minutes
              </p>
            </div>

            {/* Progress Overview */}
            <div className="mb-16">
              <div className="relative bg-gray-900/50 rounded-2xl p-8 border border-gray-800 overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ 
                  backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)', 
                  backgroundSize: '20px 20px' 
                }}></div>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-100 mb-2">Your Progress</h2>
                      <p className="text-gray-400">You're making great progress! Keep going!</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {Math.round((completedSteps.length / steps.length) * 100)}%
                      </div>
                      <p className="text-sm text-gray-500">Complete</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                        style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{completedSteps.length} of {steps.length} steps</span>
                      <span className="text-gray-400">~{25 - Math.round((completedSteps.length / steps.length) * 25)} min remaining</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-6 p-4 bg-gray-800/50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-200">Estimated total time</p>
                      <p className="text-sm text-gray-400">25 minutes to complete setup</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prerequisites */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-100">Before You Start</h2>
              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-6">
                <h3 className="font-semibold text-yellow-300 mb-4">What you'll need:</h3>
                <ul className="text-gray-300 space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                    <span>An Instagram Business account (not personal)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                    <span>Admin access to your Instagram account</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                    <span>Your business email for account verification</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                    <span>Basic information about your products/services</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-6 mb-16">
              {steps.map((step) => {
                const isCompleted = completedSteps.includes(step.number)
                
                return (
                  <div key={step.number} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <button
                        onClick={() => toggleStep(step.number)}
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-purple-500 text-white hover:bg-purple-600'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          step.number
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className={`text-xl font-semibold ${isCompleted ? 'text-green-400 line-through' : 'text-gray-100'}`}>
                            {step.title}
                          </h3>
                          <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                            {step.time}
                          </span>
                        </div>
                        
                        <p className="text-gray-400 mb-4">{step.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          {step.details.map((detail, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-gray-400">{detail}</span>
                            </div>
                          ))}
                        </div>

                        <Link 
                          href={step.actionLink}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                        >
                          {step.actionText}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Next Steps */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-8 text-gray-100">What's Next?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link href="/documentation/user-guides/first-automation" className="group bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all">
                  <h3 className="font-semibold text-gray-200 mb-2">📝 Create Your First Automation</h3>
                  <p className="text-gray-400 text-sm mb-4">Learn how to build advanced automation workflows step by step.</p>
                  <div className="flex items-center text-purple-400 font-medium text-sm">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
                
                <Link href="/documentation/user-guides/best-practices" className="group bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all">
                  <h3 className="font-semibold text-gray-200 mb-2">✨ Best Practices</h3>
                  <p className="text-gray-400 text-sm mb-4">Tips and strategies to optimize your automation performance.</p>
                  <div className="flex items-center text-purple-400 font-medium text-sm">
                    <span>Read Guide</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
                
                <Link href="/documentation/integrations/whatsapp" className="group bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all">
                  <h3 className="font-semibold text-gray-200 mb-2">💬 WhatsApp Integration</h3>
                  <p className="text-gray-400 text-sm mb-4">Expand your automation to WhatsApp Business messaging.</p>
                  <div className="flex items-center text-purple-400 font-medium text-sm">
                    <span>Setup WhatsApp</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
                
                <Link href="/contact" className="group bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all">
                  <h3 className="font-semibold text-gray-200 mb-2">🆘 Need Help?</h3>
                  <p className="text-gray-400 text-sm mb-4">Contact our support team for personalized assistance.</p>
                  <div className="flex items-center text-purple-400 font-medium text-sm">
                    <span>Get Support</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </section>

            {/* Troubleshooting */}
            <section>
              <h2 className="text-2xl font-bold mb-8 text-gray-100">Common Issues</h2>
              <div className="space-y-4">
                <details className="bg-gray-900/50 border border-gray-800 rounded-xl">
                  <summary className="p-6 cursor-pointer font-medium text-gray-200 hover:bg-gray-800/50 rounded-xl">
                    Instagram connection failed - "Account not eligible"
                  </summary>
                  <div className="px-6 pb-6 text-sm text-gray-400">
                    <p>This usually means you're using a personal Instagram account instead of a Business account.</p>
                    <p className="mt-2"><strong className="text-gray-300">Solution:</strong> Convert your account to Instagram Business in your Instagram app settings, then try connecting again.</p>
                  </div>
                </details>
                
                <details className="bg-gray-900/50 border border-gray-800 rounded-xl">
                  <summary className="p-6 cursor-pointer font-medium text-gray-200 hover:bg-gray-800/50 rounded-xl">
                    AI responses are not working as expected
                  </summary>
                  <div className="px-6 pb-6 text-sm text-gray-400">
                    <p>The AI needs some time to learn your business context and preferences.</p>
                    <p className="mt-2"><strong className="text-gray-300">Solution:</strong> Provide more detailed business information in your AI configuration and test with various customer scenarios.</p>
                  </div>
                </details>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}