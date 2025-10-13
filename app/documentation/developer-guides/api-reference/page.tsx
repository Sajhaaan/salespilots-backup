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
  Terminal,
  Key
} from 'lucide-react'

export default function APIReference() {
  const [copied, setCopied] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedEndpoint, setSelectedEndpoint] = useState('authentication')

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
        { name: "API Reference", href: "/documentation/developer-guides/api-reference", active: true },
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

  const endpoints = [
    { id: 'authentication', name: 'Authentication', method: 'POST' },
    { id: 'conversations', name: 'Conversations', method: 'GET' },
    { id: 'messages', name: 'Send Message', method: 'POST' },
    { id: 'automations', name: 'Automations', method: 'GET' },
    { id: 'analytics', name: 'Analytics', method: 'GET' }
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

            {/* API Endpoints Quick Nav */}
            <div className="mt-8 pt-6 border-t border-gray-800">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                API Endpoints
              </h3>
              <ul className="space-y-1">
                {endpoints.map((endpoint) => (
                  <li key={endpoint.id}>
                    <button
                      onClick={() => setSelectedEndpoint(endpoint.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedEndpoint === endpoint.id
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                      }`}
                    >
                      <span>{endpoint.name}</span>
                      <span className={`text-xs px-2 py-1 rounded font-mono ${
                        endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {endpoint.method}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
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
              <span>Developer Guides</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-300">API Reference</span>
            </nav>

            {/* Page Header */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                    <Code className="w-4 h-4" />
                    <span>API Reference</span>
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
                API Reference
              </h1>
              
              <p className="text-xl text-gray-400 leading-relaxed">
                Complete API documentation for integrating SalesPilot into your applications.
              </p>
            </div>

            {/* Getting Started */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-100 mb-6">Getting Started</h2>
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 mb-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Base URL</h3>
                <div className="bg-gray-800 rounded-lg p-4 font-mono text-green-400">
                  https://api.salespilot.io/v1
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  Authentication
                </h3>
                <p className="text-blue-200 mb-4">
                  All API requests require authentication using your API key. Include it in the Authorization header:
                </p>
                <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm text-gray-300">
                  <div className="text-gray-500">// Include in request headers</div>
                  <div className="text-yellow-400">Authorization: Bearer YOUR_API_KEY</div>
                </div>
              </div>
            </section>

            {/* API Endpoints */}
            <section>
              <h2 className="text-2xl font-bold text-gray-100 mb-8">API Endpoints</h2>

              {/* Authentication Endpoint */}
              {selectedEndpoint === 'authentication' && (
                <div className="space-y-6">
                  <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-mono">POST</span>
                      <h3 className="text-xl font-semibold text-gray-100">/auth/token</h3>
                    </div>
                    <p className="text-gray-400 mb-6">Generate an access token for API authentication.</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Request Body</h4>
                        <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                          <pre className="text-gray-300">{`{
  "client_id": "your_client_id",
  "client_secret": "your_client_secret",
  "grant_type": "client_credentials"
}`}</pre>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Response</h4>
                        <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                          <pre className="text-gray-300">{`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}`}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Conversations Endpoint */}
              {selectedEndpoint === 'conversations' && (
                <div className="space-y-6">
                  <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-mono">GET</span>
                      <h3 className="text-xl font-semibold text-gray-100">/conversations</h3>
                    </div>
                    <p className="text-gray-400 mb-6">Retrieve a list of conversations.</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Query Parameters</h4>
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="text-blue-400 font-mono">limit</span>
                              <span className="text-gray-500">integer</span>
                              <span className="text-gray-400">- Number of conversations to return (default: 20)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-blue-400 font-mono">offset</span>
                              <span className="text-gray-500">integer</span>
                              <span className="text-gray-400">- Number of conversations to skip (default: 0)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-blue-400 font-mono">status</span>
                              <span className="text-gray-500">string</span>
                              <span className="text-gray-400">- Filter by status (active, closed, pending)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Response</h4>
                        <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                          <pre className="text-gray-300">{`{
  "conversations": [
    {
      "id": "conv_12345",
      "customer_id": "cust_67890",
      "status": "active",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "message_count": 15
    }
  ],
  "total": 250,
  "has_more": true
}`}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages Endpoint */}
              {selectedEndpoint === 'messages' && (
                <div className="space-y-6">
                  <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-mono">POST</span>
                      <h3 className="text-xl font-semibold text-gray-100">/conversations/:id/messages</h3>
                    </div>
                    <p className="text-gray-400 mb-6">Send a message in a conversation.</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Request Body</h4>
                        <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                          <pre className="text-gray-300">{`{
  "content": "Hello! How can I help you today?",
  "type": "text",
  "sender": "bot"
}`}</pre>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Response</h4>
                        <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                          <pre className="text-gray-300">{`{
  "id": "msg_12345",
  "conversation_id": "conv_67890",
  "content": "Hello! How can I help you today?",
  "type": "text",
  "sender": "bot",
  "created_at": "2024-01-15T10:00:00Z"
}`}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Response Codes */}
              <div className="mt-12 bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">HTTP Response Codes</h3>
                <div className="space-y-3">
                  {[
                    { code: '200', description: 'Success - Request completed successfully', color: 'text-green-400' },
                    { code: '201', description: 'Created - Resource created successfully', color: 'text-green-400' },
                    { code: '400', description: 'Bad Request - Invalid request parameters', color: 'text-yellow-400' },
                    { code: '401', description: 'Unauthorized - Invalid or missing API key', color: 'text-red-400' },
                    { code: '404', description: 'Not Found - Resource does not exist', color: 'text-red-400' },
                    { code: '429', description: 'Rate Limited - Too many requests', color: 'text-orange-400' },
                    { code: '500', description: 'Server Error - Internal server error', color: 'text-red-400' }
                  ].map((status, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-lg">
                      <span className={`font-mono text-sm font-bold ${status.color}`}>{status.code}</span>
                      <span className="text-gray-300 text-sm">{status.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Bottom Navigation */}
            <div className="mt-16 flex items-center justify-between p-6 bg-gray-900/50 rounded-xl border border-gray-800">
              <Link 
                href="/documentation/user-guides/best-practices"
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Previous: Best Practices
              </Link>
              <Link 
                href="/documentation/developer-guides/sdk"
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
              >
                Next: SDK Integration
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}