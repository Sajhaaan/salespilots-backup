'use client'

import { useState, useEffect } from 'react'
import { 
  Bot, 
  MessageCircle, 
  Send, 
  Sparkles, 
  Settings, 
  TestTube, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Brain,
  Globe
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AIStatus {
  openai_configured: boolean
  model: string
  status: string
}

interface StoreDetails {
  businessName: string
  businessType: string
  instagramHandle: string
  description: string
  targetAudience: string
  responseStyle: string
  storeSetupCompleted: boolean
}

export default function AISetupPage() {
  const [aiStatus, setAiStatus] = useState<AIStatus | null>(null)
  const [storeDetails, setStoreDetails] = useState<StoreDetails | null>(null)
  const [testMessage, setTestMessage] = useState('')
  const [customerName, setCustomerName] = useState('Test Customer')
  const [aiResponse, setAiResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState(true)

  useEffect(() => {
    fetchAIStatus()
    fetchStoreDetails()
  }, [])

  const fetchAIStatus = async () => {
    try {
      const response = await fetch('/api/ai/chat-response', { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        setAiStatus(data)
      }
    } catch (error) {
      console.error('Failed to fetch AI status:', error)
    } finally {
      setLoadingStatus(false)
    }
  }

  const fetchStoreDetails = async () => {
    try {
      const response = await fetch('/api/store/setup', { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        setStoreDetails(data.store)
      }
    } catch (error) {
      console.error('Failed to fetch store details:', error)
    }
  }

  const testAIResponse = async () => {
    if (!testMessage.trim()) {
      toast.error('Please enter a test message')
      return
    }

    setLoading(true)
    setAiResponse('')

    try {
      const response = await fetch('/api/ai/chat-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: testMessage,
          customerName: customerName,
          instagramHandle: '@test_customer'
        })
      })

      const data = await response.json()

      if (data.success) {
        setAiResponse(data.response)
        toast.success('AI response generated successfully!')
      } else {
        toast.error(data.error || 'Failed to generate AI response')
      }
    } catch (error) {
      toast.error('Failed to test AI response')
    } finally {
      setLoading(false)
    }
  }

  const sampleMessages = [
    "Hi, do you have cotton t-shirts?",
    "What's the price of your products?",
    "क्या आपके पास जींस है?", // Hindi
    "எனக்கு ஒரு வெள்ளை ஷர்ட் வேணும்", // Tamil
    "Bhai, hoodie kitne ka hai?", // Hinglish
    "Can you tell me about your business?",
    "What are your business hours?",
    "Do you deliver to Mumbai?"
  ]

  if (loadingStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">AI Assistant Setup</h1>
        <p className="text-white/70">Configure and test your AI-powered customer service</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* OpenAI Status */}
        <div className="premium-card">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              aiStatus?.openai_configured 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-red-500/20 border border-red-500/30'
            }`}>
              <Bot className={`w-6 h-6 ${
                aiStatus?.openai_configured ? 'text-green-400' : 'text-red-400'
              }`} />
            </div>
            <div>
              <h3 className="text-white font-semibold">OpenAI API</h3>
              <p className={`text-sm ${
                aiStatus?.openai_configured ? 'text-green-400' : 'text-red-400'
              }`}>
                {aiStatus?.openai_configured ? 'Connected' : 'Not Configured'}
              </p>
            </div>
          </div>
          {aiStatus?.openai_configured ? (
            <div className="space-y-2 text-sm text-white/70">
              <p>Model: {aiStatus.model}</p>
              <p>Status: {aiStatus.status}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-red-400 text-sm">OpenAI API key required</p>
              <p className="text-white/60 text-xs">Add OPENAI_API_KEY to environment variables</p>
            </div>
          )}
        </div>

        {/* Store Setup Status */}
        <div className="premium-card">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              storeDetails?.storeSetupCompleted 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-orange-500/20 border border-orange-500/30'
            }`}>
              <Settings className={`w-6 h-6 ${
                storeDetails?.storeSetupCompleted ? 'text-green-400' : 'text-orange-400'
              }`} />
            </div>
            <div>
              <h3 className="text-white font-semibold">Store Setup</h3>
              <p className={`text-sm ${
                storeDetails?.storeSetupCompleted ? 'text-green-400' : 'text-orange-400'
              }`}>
                {storeDetails?.storeSetupCompleted ? 'Complete' : 'Incomplete'}
              </p>
            </div>
          </div>
          {storeDetails?.storeSetupCompleted ? (
            <div className="space-y-2 text-sm text-white/70">
              <p>Business: {storeDetails.businessName}</p>
              <p>Style: {storeDetails.responseStyle}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-orange-400 text-sm">Store setup required</p>
              <button className="text-blue-400 hover:text-blue-300 text-xs">
                Complete setup →
              </button>
            </div>
          )}
        </div>

        {/* AI Training Status */}
        <div className="premium-card">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              aiStatus?.openai_configured && storeDetails?.storeSetupCompleted
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-gray-500/20 border border-gray-500/30'
            }`}>
              <Brain className={`w-6 h-6 ${
                aiStatus?.openai_configured && storeDetails?.storeSetupCompleted 
                  ? 'text-green-400' : 'text-gray-400'
              }`} />
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Training</h3>
              <p className={`text-sm ${
                aiStatus?.openai_configured && storeDetails?.storeSetupCompleted 
                  ? 'text-green-400' : 'text-gray-400'
              }`}>
                {aiStatus?.openai_configured && storeDetails?.storeSetupCompleted 
                  ? 'Ready' : 'Pending'}
              </p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-white/70">
            <p>Business context: {storeDetails?.description ? '✓' : '✗'}</p>
            <p>Target audience: {storeDetails?.targetAudience ? '✓' : '✗'}</p>
          </div>
        </div>
      </div>

      {/* AI Testing Interface */}
      <div className="premium-card">
        <div className="flex items-center space-x-3 mb-6">
          <TestTube className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Test AI Responses</h2>
        </div>

        {!aiStatus?.openai_configured || !storeDetails?.storeSetupCompleted ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Setup Required</h3>
            <p className="text-white/70 mb-6">
              Complete OpenAI configuration and store setup to test AI responses
            </p>
            <div className="flex justify-center space-x-4">
              {!storeDetails?.storeSetupCompleted && (
                <button 
                  onClick={() => window.location.href = '/onboarding/store-setup'}
                  className="btn-premium px-6 py-3"
                >
                  Complete Store Setup
                </button>
              )}
              {!aiStatus?.openai_configured && (
                <a 
                  href="/dashboard/settings" 
                  className="btn-secondary-premium px-6 py-3"
                >
                  Configure OpenAI
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Test Message Input */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-white mb-2">
                  Test Message
                </label>
                <input
                  type="text"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message to test AI response..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Customer name"
                />
              </div>
            </div>

            {/* Sample Messages */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Quick Test Messages
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sampleMessages.map((message, index) => (
                  <button
                    key={index}
                    onClick={() => setTestMessage(message)}
                    className="text-left p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-white/80 hover:text-white transition-all text-sm"
                  >
                    "{message}"
                  </button>
                ))}
              </div>
            </div>

            {/* Test Button */}
            <div className="flex justify-center">
              <button
                onClick={testAIResponse}
                disabled={loading}
                className="btn-premium px-8 py-4 text-lg flex items-center space-x-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating Response...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Test AI Response</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Response */}
            {aiResponse && (
              <div className="border border-green-500/30 rounded-lg p-6 bg-green-500/10">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-green-400 font-medium">AI Assistant</span>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <p className="text-white leading-relaxed whitespace-pre-wrap">
                      {aiResponse}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Configuration Tips */}
      <div className="premium-card">
        <div className="flex items-center space-x-3 mb-6">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">AI Configuration Tips</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Optimize AI Responses</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>• Add detailed product descriptions</li>
              <li>• Set clear target audience information</li>
              <li>• Choose appropriate response style</li>
              <li>• Include business hours and policies</li>
              <li>• Test with various languages</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Supported Languages</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'English', flag: '🇺🇸' },
                { name: 'हिंदी', flag: '🇮🇳' },
                { name: 'தமிழ்', flag: '🇮🇳' },
                { name: 'Hinglish', flag: '🇮🇳' }
              ].map((lang, index) => (
                <span key={index} className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm flex items-center space-x-1">
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}