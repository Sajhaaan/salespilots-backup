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
  Brain,
  AlertTriangle,
  Key
} from 'lucide-react'

export default function OpenAIIntegration() {
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
        { name: "Instagram", href: "/documentation/integrations/instagram" },
        { name: "WhatsApp", href: "/documentation/integrations/whatsapp" },
        { name: "OpenAI", href: "/documentation/integrations/openai", active: true }
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
              <span className="text-gray-300">OpenAI</span>
            </nav>

            {/* Page Header */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                    <Brain className="w-4 h-4" />
                    <span>OpenAI Integration</span>
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
                OpenAI Integration
              </h1>
              
              <p className="text-xl text-gray-400 leading-relaxed">
                Configure OpenAI models to power your SalesPilot AI conversations with advanced language understanding.
              </p>
            </div>

            <div className="space-y-12">
              {/* Overview */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-6">Overview</h2>
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                  <p className="text-gray-300 mb-6">
                    SalesPilot integrates with OpenAI's powerful language models to provide intelligent, 
                    context-aware responses to your customers. You can customize the AI behavior, 
                    choose different models, and fine-tune responses for your specific business needs.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <Brain className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-200 mb-1">GPT Models</h3>
                      <p className="text-xs text-gray-400">GPT-4, GPT-3.5 Turbo</p>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <Settings className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-200 mb-1">Customizable</h3>
                      <p className="text-xs text-gray-400">Personality & tone</p>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-200 mb-1">Real-time</h3>
                      <p className="text-xs text-gray-400">Instant responses</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Setup */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-8">Setup Process</h2>
                <div className="space-y-6">
                  <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-300 mb-4 flex items-center">
                      <Key className="w-5 h-5 mr-2" />
                      Get Your OpenAI API Key
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-blue-100/80 text-sm">
                      <li>Visit <Link href="https://platform.openai.com" className="text-blue-400 hover:text-blue-300">platform.openai.com</Link> and create an account</li>
                      <li>Navigate to API Keys section in your OpenAI dashboard</li>
                      <li>Click "Create new secret key" and copy the generated key</li>
                      <li>Set up billing and usage limits in your OpenAI account</li>
                    </ol>
                    <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                      <p className="text-yellow-200/80 text-sm">
                        <strong>Important:</strong> Keep your API key secure and never share it publicly. 
                        SalesPilot encrypts and stores your key securely.
                      </p>
                    </div>
                  </div>

                  {[
                    {
                      step: 1,
                      title: "Add API Key to SalesPilot",
                      description: "Configure your OpenAI credentials in SalesPilot",
                      details: [
                        "Go to Settings → Integrations → OpenAI in your dashboard",
                        "Click 'Connect OpenAI' and enter your API key",
                        "Test the connection to verify it works",
                        "Save your configuration"
                      ]
                    },
                    {
                      step: 2,
                      title: "Choose AI Model",
                      description: "Select the OpenAI model that best fits your needs",
                      details: [
                        "GPT-4: More capable, higher cost, better reasoning",
                        "GPT-3.5 Turbo: Faster, cost-effective, good for most use cases", 
                        "Configure model parameters (temperature, max tokens)",
                        "Set up fallback models for reliability"
                      ]
                    },
                    {
                      step: 3,
                      title: "Customize AI Personality",
                      description: "Define how your AI should behave and respond",
                      details: [
                        "Set your business context and personality",
                        "Define tone and communication style",
                        "Add product/service information",
                        "Configure response guidelines and limitations"
                      ]
                    },
                    {
                      step: 4,
                      title: "Test & Optimize",
                      description: "Verify AI responses and fine-tune performance",
                      details: [
                        "Test with sample customer conversations",
                        "Review AI response quality and accuracy",
                        "Adjust temperature and prompt settings",
                        "Monitor usage and costs"
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

              {/* Model Comparison */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-8">Model Comparison</h2>
                <div className="overflow-x-auto">
                  <table className="w-full bg-gray-900/50 rounded-xl border border-gray-800">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left p-4 text-gray-200 font-semibold">Model</th>
                        <th className="text-left p-4 text-gray-200 font-semibold">Capability</th>
                        <th className="text-left p-4 text-gray-200 font-semibold">Speed</th>
                        <th className="text-left p-4 text-gray-200 font-semibold">Cost</th>
                        <th className="text-left p-4 text-gray-200 font-semibold">Best For</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-800">
                        <td className="p-4 font-mono text-blue-400">GPT-4</td>
                        <td className="p-4 text-gray-300">Highest</td>
                        <td className="p-4 text-gray-300">Slower</td>
                        <td className="p-4 text-gray-300">Higher</td>
                        <td className="p-4 text-gray-400">Complex reasoning, critical customer issues</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="p-4 font-mono text-green-400">GPT-3.5 Turbo</td>
                        <td className="p-4 text-gray-300">High</td>
                        <td className="p-4 text-gray-300">Faster</td>
                        <td className="p-4 text-gray-300">Lower</td>
                        <td className="p-4 text-gray-400">General conversations, FAQ responses</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Configuration Options */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-8">Configuration Options</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Model Parameters</h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-400">Temperature</span>
                        <span className="text-purple-400 font-mono">0.0 - 2.0</span>
                      </li>
                      <li className="text-xs text-gray-500 -mt-2">Controls response creativity (0 = deterministic, 2 = very creative)</li>
                      
                      <li className="flex items-center justify-between">
                        <span className="text-gray-400">Max Tokens</span>
                        <span className="text-purple-400 font-mono">1 - 4096</span>
                      </li>
                      <li className="text-xs text-gray-500 -mt-2">Maximum response length</li>
                      
                      <li className="flex items-center justify-between">
                        <span className="text-gray-400">Top P</span>
                        <span className="text-purple-400 font-mono">0.0 - 1.0</span>
                      </li>
                      <li className="text-xs text-gray-500 -mt-2">Alternative to temperature for controlling randomness</li>
                    </ul>
                  </div>

                  <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Business Context</h3>
                    <ul className="space-y-3 text-sm text-gray-400">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                        <span>Business description and values</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                        <span>Product/service catalog</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                        <span>Pricing and policy information</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                        <span>Tone and personality guidelines</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                        <span>Response limitations and boundaries</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Best Practices */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-8">Best Practices</h2>
                <div className="space-y-6">
                  <div className="bg-green-900/20 border-l-4 border-green-500 p-6 rounded-r-xl">
                    <h3 className="text-lg font-semibold text-green-400 mb-3">✅ Optimization Tips</h3>
                    <ul className="space-y-2 text-green-300 text-sm">
                      <li>• Start with GPT-3.5 Turbo for cost efficiency</li>
                      <li>• Use lower temperature (0.3-0.7) for consistent responses</li>
                      <li>• Provide clear, detailed business context</li>
                      <li>• Set appropriate token limits to control costs</li>
                      <li>• Monitor usage and set billing alerts</li>
                      <li>• Regularly review and update AI instructions</li>
                    </ul>
                  </div>

                  <div className="bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-xl">
                    <h3 className="text-lg font-semibold text-red-400 mb-3">⚠️ Common Pitfalls</h3>
                    <ul className="space-y-2 text-red-300 text-sm">
                      <li>• Don't use high temperature for customer service</li>
                      <li>• Avoid overly long prompts that waste tokens</li>
                      <li>• Don't ignore OpenAI usage policies</li>
                      <li>• Avoid storing sensitive customer data in prompts</li>
                      <li>• Don't rely solely on AI without human oversight</li>
                      <li>• Avoid inconsistent personality across conversations</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Troubleshooting */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-8">Troubleshooting</h2>
                <div className="space-y-4">
                  {[
                    {
                      issue: "API key authentication failed",
                      solution: "Verify your OpenAI API key is correct and has sufficient credits. Check OpenAI dashboard for account status."
                    },
                    {
                      issue: "Responses are too repetitive",
                      solution: "Increase the temperature parameter (try 0.7-1.0) or adjust your prompt to encourage more variety."
                    },
                    {
                      issue: "High API costs",
                      solution: "Switch to GPT-3.5 Turbo, reduce max tokens, or implement response caching for common queries."
                    },
                    {
                      issue: "Slow response times",
                      solution: "Use GPT-3.5 Turbo instead of GPT-4, reduce max tokens, or check OpenAI service status."
                    },
                    {
                      issue: "AI gives incorrect information",
                      solution: "Update your business context, add more specific instructions, or implement fact-checking workflows."
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
                href="/documentation/integrations/whatsapp"
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Previous: WhatsApp Integration
              </Link>
              <Link 
                href="/documentation/faqs/general"
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
              >
                Next: FAQs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}