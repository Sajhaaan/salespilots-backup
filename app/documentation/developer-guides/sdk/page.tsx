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
  Download,
  Package
} from 'lucide-react'

export default function SDKIntegration() {
  const [copied, setCopied] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')

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
        { name: "SDK", href: "/documentation/developer-guides/sdk", active: true },
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

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: '🟨' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'php', name: 'PHP', icon: '🐘' },
    { id: 'curl', name: 'cURL', icon: '📡' }
  ]

  const codeExamples = {
    javascript: {
      installation: `npm install @salespilot/sdk`,
      basic: `import { SalesPilot } from '@salespilot/sdk';

const client = new SalesPilot({
  apiKey: 'your-api-key',
  environment: 'production' // or 'sandbox'
});

// Send a message
const response = await client.conversations.sendMessage({
  conversationId: 'conv_12345',
  content: 'Hello! How can I help you?',
  type: 'text'
});

console.log(response);`,
      automation: `// Create an automation
const automation = await client.automations.create({
  name: 'Customer Support Bot',
  triggers: ['dm_received'],
  responses: [
    {
      condition: 'greeting',
      message: 'Hello! Welcome to our store. How can I help you today?'
    }
  ]
});

// Get automation status
const status = await client.automations.getStatus(automation.id);`
    },
    python: {
      installation: `pip install salespilot-sdk`,
      basic: `from salespilot import SalesPilot

client = SalesPilot(
    api_key='your-api-key',
    environment='production'  # or 'sandbox'
)

# Send a message
response = client.conversations.send_message(
    conversation_id='conv_12345',
    content='Hello! How can I help you?',
    type='text'
)

print(response)`,
      automation: `# Create an automation
automation = client.automations.create(
    name='Customer Support Bot',
    triggers=['dm_received'],
    responses=[
        {
            'condition': 'greeting',
            'message': 'Hello! Welcome to our store. How can I help you today?'
        }
    ]
)

# Get automation status
status = client.automations.get_status(automation['id'])`
    },
    php: {
      installation: `composer require salespilot/sdk`,
      basic: `<?php
require_once 'vendor/autoload.php';

use SalesPilot\\SDK\\Client;

$client = new Client([
    'api_key' => 'your-api-key',
    'environment' => 'production' // or 'sandbox'
]);

// Send a message
$response = $client->conversations->sendMessage([
    'conversation_id' => 'conv_12345',
    'content' => 'Hello! How can I help you?',
    'type' => 'text'
]);

var_dump($response);`,
      automation: `// Create an automation
$automation = $client->automations->create([
    'name' => 'Customer Support Bot',
    'triggers' => ['dm_received'],
    'responses' => [
        [
            'condition' => 'greeting',
            'message' => 'Hello! Welcome to our store. How can I help you today?'
        ]
    ]
]);

// Get automation status
$status = $client->automations->getStatus($automation['id']);`
    },
    curl: {
      installation: `# No installation required - cURL is available on most systems`,
      basic: `curl -X POST "https://api.salespilot.io/v1/conversations/conv_12345/messages" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "Hello! How can I help you?",
    "type": "text"
  }'`,
      automation: `# Create an automation
curl -X POST "https://api.salespilot.io/v1/automations" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Customer Support Bot",
    "triggers": ["dm_received"],
    "responses": [
      {
        "condition": "greeting",
        "message": "Hello! Welcome to our store. How can I help you today?"
      }
    ]
  }'`
    }
  }

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
              <span className="text-gray-300">SDK Integration</span>
            </nav>

            {/* Page Header */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                    <Package className="w-4 h-4" />
                    <span>SDK Integration</span>
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
                SDK Integration
              </h1>
              
              <p className="text-xl text-gray-400 leading-relaxed">
                Official SDKs and code examples for integrating SalesPilot into your applications.
              </p>
            </div>

            {/* Language Selector */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-100 mb-4">Choose Your Language</h2>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedLanguage === lang.id
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <span>{lang.icon}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-12">
              {/* Installation */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
                  <Download className="w-6 h-6 mr-3 text-purple-400" />
                  Installation
                </h2>
                <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-800/50 border-b border-gray-700">
                    <h3 className="font-medium text-gray-200">Install the {languages.find(l => l.id === selectedLanguage)?.name} SDK</h3>
                  </div>
                  <div className="p-6">
                    <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                      <pre className="text-green-400">{(codeExamples as any)[selectedLanguage].installation}</pre>
                    </div>
                  </div>
                </div>
              </section>

              {/* Basic Usage */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-6">Basic Usage</h2>
                <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-800/50 border-b border-gray-700">
                    <h3 className="font-medium text-gray-200">Initialize Client & Send Messages</h3>
                  </div>
                  <div className="p-6">
                    <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                      <pre className="text-gray-300">{(codeExamples as any)[selectedLanguage].basic}</pre>
                    </div>
                  </div>
                </div>
              </section>

              {/* Automation Management */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-6">Automation Management</h2>
                <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-800/50 border-b border-gray-707">
                    <h3 className="font-medium text-gray-200">Create & Manage Automations</h3>
                  </div>
                  <div className="p-6">
                    <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                      <pre className="text-gray-300">{(codeExamples as any)[selectedLanguage].automation}</pre>
                    </div>
                  </div>
                </div>
              </section>

              {/* SDK Features */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-8">SDK Features</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Conversation Management",
                      description: "Full conversation lifecycle management",
                      features: [
                        "Send and receive messages",
                        "Conversation history",
                        "Customer management",
                        "Real-time updates"
                      ]
                    },
                    {
                      title: "Automation Control",
                      description: "Programmatic automation management",
                      features: [
                        "Create automations",
                        "Update workflows",
                        "Monitor performance",
                        "A/B testing"
                      ]
                    },
                    {
                      title: "Analytics & Reporting",
                      description: "Comprehensive analytics integration",
                      features: [
                        "Performance metrics",
                        "Conversion tracking",
                        "Custom events",
                        "Data export"
                      ]
                    },
                    {
                      title: "Error Handling",
                      description: "Robust error handling and retry logic",
                      features: [
                        "Automatic retries",
                        "Error categorization",
                        "Rate limit handling",
                        "Logging integration"
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

              {/* Configuration */}
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-6">Configuration Options</h2>
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-200 mb-3">Environment Settings</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center space-x-2">
                            <span className="text-blue-400 font-mono">production</span>
                            <span className="text-gray-400">- Live environment</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <span className="text-blue-400 font-mono">sandbox</span>
                            <span className="text-gray-400">- Testing environment</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-200 mb-3">Timeout Settings</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center space-x-2">
                            <span className="text-blue-400 font-mono">timeout</span>
                            <span className="text-gray-400">- Request timeout (default: 30s)</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <span className="text-blue-400 font-mono">retries</span>
                            <span className="text-gray-400">- Max retry attempts (default: 3)</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
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
                href="/documentation/developer-guides/webhooks"
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
              >
                Next: Webhooks
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}