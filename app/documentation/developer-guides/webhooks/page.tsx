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
  Webhook,
  Terminal,
  AlertTriangle,
  Lock
} from 'lucide-react'

export default function WebhooksPage() {
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
        { name: "Webhooks", href: "/documentation/developer-guides/webhooks", active: true }
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
              <span>Developer Guides</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-300">Webhooks</span>
            </nav>

            {/* Page Header */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                    <Webhook className="w-4 h-4" />
                    <span>Webhooks</span>
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
                Webhooks
              </h1>
              
              <p className="text-xl text-gray-400 leading-relaxed">
                Receive real-time notifications about events in your SalesPilot account using webhooks.
              </p>
            </div>

            <div className="space-y-12">
              {/* Overview */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-6">What are Webhooks?</h2>
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                  <p className="text-gray-300 mb-4">
                    Webhooks allow SalesPilot to notify your application when specific events occur. 
                    Instead of polling our API, you can receive instant notifications when conversations are updated, 
                    messages are received, or automations are triggered.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-200 mb-1">Real-time</h3>
                      <p className="text-xs text-gray-400">Instant notifications</p>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-200 mb-1">Secure</h3>
                      <p className="text-xs text-gray-400">Signed & verified</p>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-200 mb-1">Reliable</h3>
                      <p className="text-xs text-gray-400">Automatic retries</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Setup */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-6">Setting Up Webhooks</h2>
                <div className="space-y-6">
                  <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">1. Create Webhook Endpoint</h3>
                    <p className="text-gray-400 mb-4">Create an HTTP endpoint in your application to receive webhook events:</p>
                    <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                      <pre className="text-gray-300">{`// Node.js Express example
app.post('/webhooks/salespilot', (req, res) => {
  const event = req.body;
  
  // Verify webhook signature (recommended)
  const signature = req.headers['x-salespilot-signature'];
  if (!verifySignature(signature, req.body)) {
    return res.status(401).send('Unauthorized');
  }
  
  // Handle the event
  switch (event.type) {
    case 'message.received':
      handleNewMessage(event.data);
      break;
    case 'conversation.updated':
      handleConversationUpdate(event.data);
      break;
  }
  
  res.status(200).send('OK');
});`}</pre>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">2. Configure in Dashboard</h3>
                    <p className="text-gray-400 mb-4">Add your webhook endpoint in the SalesPilot dashboard:</p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-400 text-sm">
                      <li>Go to Settings → Webhooks in your dashboard</li>
                      <li>Click "Add Webhook Endpoint"</li>
                      <li>Enter your endpoint URL (must be HTTPS)</li>
                      <li>Select which events you want to receive</li>
                      <li>Save and test your webhook</li>
                    </ol>
                  </div>
                </div>
              </section>

              {/* Event Types */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-6">Event Types</h2>
                <div className="space-y-4">
                  {[
                    {
                      event: 'message.received',
                      description: 'Triggered when a new message is received from a customer',
                      payload: {
                        id: 'msg_12345',
                        conversation_id: 'conv_67890',
                        content: 'Hello, I need help with my order',
                        sender: 'customer',
                        timestamp: '2024-01-15T10:30:00Z'
                      }
                    },
                    {
                      event: 'message.sent',
                      description: 'Triggered when your automation sends a message to a customer',
                      payload: {
                        id: 'msg_12346',
                        conversation_id: 'conv_67890',
                        content: 'Hi! I\'d be happy to help you with your order.',
                        sender: 'bot',
                        timestamp: '2024-01-15T10:31:00Z'
                      }
                    },
                    {
                      event: 'conversation.updated',
                      description: 'Triggered when a conversation status changes (e.g., assigned to human)',
                      payload: {
                        id: 'conv_67890',
                        status: 'assigned_to_human',
                        assigned_to: 'agent_123',
                        updated_at: '2024-01-15T10:32:00Z'
                      }
                    },
                    {
                      event: 'automation.triggered',
                      description: 'Triggered when an automation workflow is activated',
                      payload: {
                        automation_id: 'auto_456',
                        conversation_id: 'conv_67890',
                        trigger: 'keyword_match',
                        triggered_at: '2024-01-15T10:30:00Z'
                      }
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
                      <div className="px-6 py-4 bg-gray-800/50 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                          <h3 className="font-mono text-purple-300">{item.event}</h3>
                          <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">EVENT</span>
                        </div>
                        <p className="text-gray-400 text-sm mt-2">{item.description}</p>
                      </div>
                      <div className="p-6">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Example Payload:</h4>
                        <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                          <pre className="text-gray-300">{JSON.stringify(item.payload, null, 2)}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Security */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-6">Security & Verification</h2>
                <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-6">
                  <h3 className="font-semibold text-yellow-300 mb-4 flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Webhook Signature Verification
                  </h3>
                  <p className="text-yellow-100/80 mb-4">
                    Always verify webhook signatures to ensure requests are genuinely from SalesPilot:
                  </p>
                  <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-gray-300">{`const crypto = require('crypto');

function verifySignature(signature, payload, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
    
  return signature === \`sha256=\${expectedSignature}\`;
}`}</pre>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-800/20 rounded-lg">
                    <p className="text-yellow-200/80 text-sm">
                      <strong>Important:</strong> Store your webhook secret securely and never expose it in client-side code.
                    </p>
                  </div>
                </div>
              </section>

              {/* Best Practices */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-6">Best Practices</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-900/20 border-l-4 border-green-500 p-6 rounded-r-xl">
                    <h3 className="text-lg font-semibold text-green-400 mb-3">✅ Do's</h3>
                    <ul className="space-y-2 text-green-300 text-sm">
                      <li>• Always verify webhook signatures</li>
                      <li>• Respond with HTTP 200 status code</li>
                      <li>• Process webhooks idempotently</li>
                      <li>• Use HTTPS endpoints only</li>
                      <li>• Handle retries gracefully</li>
                      <li>• Log webhook events for debugging</li>
                    </ul>
                  </div>

                  <div className="bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-xl">
                    <h3 className="text-lg font-semibold text-red-400 mb-3">❌ Don'ts</h3>
                    <ul className="space-y-2 text-red-300 text-sm">
                      <li>• Don't perform long-running operations</li>
                      <li>• Don't return non-200 status codes for valid requests</li>
                      <li>• Don't ignore duplicate events</li>
                      <li>• Don't expose webhook endpoints publicly</li>
                      <li>• Don't process events synchronously</li>
                      <li>• Don't skip signature verification</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Testing */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-6">Testing Webhooks</h2>
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">Test Your Integration</h3>
                  <p className="text-gray-400 mb-4">Use these methods to test your webhook integration:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-200">Dashboard Test</h4>
                        <p className="text-gray-400 text-sm">Use the "Test Webhook" button in your dashboard to send a sample event</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-200">Trigger Real Events</h4>
                        <p className="text-gray-400 text-sm">Send messages to your automation to trigger actual webhook events</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-200">Monitor Logs</h4>
                        <p className="text-gray-400 text-sm">Check webhook delivery logs in your dashboard for debugging</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </section>
            </div>

            {/* Bottom Navigation */}
            <div className="mt-16 flex items-center justify-between p-6 bg-gray-900/50 rounded-xl border border-gray-800">
              <Link 
                href="/documentation/developer-guides/sdk"
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Previous: SDK Integration
              </Link>
              <Link 
                href="/documentation/integrations/instagram"
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
              >
                Next: Integrations
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}