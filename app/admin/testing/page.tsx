'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  MessageSquare,
  Send,
  Bot,
  User,
  Loader2,
  CheckCircle,
  XCircle,
  Settings,
  RefreshCw,
  Copy,
  Download,
  Trash2,
  Globe,
  Clock,
  BarChart3,
  TestTube,
  AlertCircle,
  Zap
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ChatMessage {
  id: string
  type: 'user' | 'bot' | 'system'
  content: string
  timestamp: string
  metadata?: {
    category?: string
    language?: string
    responseTime?: number
    success?: boolean
    businessContext?: any
  }
}

interface TestScenario {
  id: string
  name: string
  description: string
  messages: string[]
  language: string
  expectedCategory?: string
}

export default function AdminTestingPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('english')
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [testStats, setTestStats] = useState({
    totalTests: 0,
    successfulTests: 0,
    averageResponseTime: 0,
    errorRate: 0
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const testScenarios: TestScenario[] = [
    {
      id: 'product_inquiry',
      name: 'Product Inquiry',
      description: 'Customer asking about product details and prices',
      messages: [
        'Hi, what products do you have?',
        'Can you tell me the price of your sarees?',
        'Do you have cotton kurtas available?'
      ],
      language: 'english',
      expectedCategory: 'inquiry'
    },
    {
      id: 'order_placement',
      name: 'Order Placement',
      description: 'Customer wanting to place an order',
      messages: [
        'I want to buy a saree',
        'Can I order 2 kurtas?',
        'I\'d like to purchase the gold necklace'
      ],
      language: 'english',
      expectedCategory: 'order'
    },
    {
      id: 'payment_query',
      name: 'Payment Query',
      description: 'Customer asking about payment methods',
      messages: [
        'How can I pay for my order?',
        'Do you accept UPI payments?',
        'I have paid via GPay, please confirm'
      ],
      language: 'english',
      expectedCategory: 'payment'
    },
    {
      id: 'hinglish_conversation',
      name: 'Hinglish Conversation',
      description: 'Customer using Hindi-English mix',
      messages: [
        'Namaste, kya products available hai?',
        'Yeh saree ka price kya hai?',
        'Mujhe yeh kurta chahiye'
      ],
      language: 'hinglish',
      expectedCategory: 'inquiry'
    },
    {
      id: 'support_request',
      name: 'Support Request',
      description: 'Customer needing help or having issues',
      messages: [
        'I have a problem with my order',
        'Can you help me track my delivery?',
        'The product I received is damaged'
      ],
      language: 'english',
      expectedCategory: 'support'
    }
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Add initial system message
    if (messages.length === 0) {
      addSystemMessage('AI Chatbot Testing Interface initialized. Ready for testing!')
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addSystemMessage = (content: string) => {
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'system',
      content,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, systemMessage])
  }

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || currentMessage.trim()
    if (!textToSend || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: textToSend,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsLoading(true)

    const startTime = Date.now()

    try {
      const response = await fetch('/api/chat/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          language: selectedLanguage
        }),
      })

      const data = await response.json()
      const responseTime = Date.now() - startTime

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.response || 'Sorry, I could not process your request.',
        timestamp: new Date().toISOString(),
        metadata: {
          category: data.category,
          language: data.language,
          responseTime,
          success: data.success,
          businessContext: data.businessContext
        }
      }

      setMessages(prev => [...prev, botMessage])
      
      // Update test stats
      setTestStats(prev => ({
        totalTests: prev.totalTests + 1,
        successfulTests: prev.successfulTests + (data.success ? 1 : 0),
        averageResponseTime: Math.round((prev.averageResponseTime * prev.totalTests + responseTime) / (prev.totalTests + 1)),
        errorRate: Math.round(((prev.totalTests - prev.successfulTests + (data.success ? 0 : 1)) / (prev.totalTests + 1)) * 100)
      }))

      if (data.success) {
        toast.success(`Response received in ${responseTime}ms`)
      } else {
        toast.error(data.error || 'Test failed')
      }

    } catch (error) {
      console.error('Test message error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Error: Failed to get response from AI chatbot.',
        timestamp: new Date().toISOString(),
        metadata: {
          success: false,
          responseTime: Date.now() - startTime
        }
      }
      setMessages(prev => [...prev, errorMessage])
      toast.error('Failed to send test message')
    } finally {
      setIsLoading(false)
    }
  }

  const runScenario = async (scenario: TestScenario) => {
    setSelectedScenario(scenario.id)
    addSystemMessage(`Running test scenario: ${scenario.name}`)
    
    for (let i = 0; i < scenario.messages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Delay between messages
      await sendMessage(scenario.messages[i])
    }
    
    setSelectedScenario(null)
    addSystemMessage(`Test scenario "${scenario.name}" completed`)
  }

  const clearChat = () => {
    setMessages([])
    addSystemMessage('Chat cleared. Ready for new tests!')
    toast.success('Chat history cleared')
  }

  const exportChatLog = () => {
    const chatLog = {
      timestamp: new Date().toISOString(),
      stats: testStats,
      messages: messages.map(msg => ({
        type: msg.type,
        content: msg.content,
        timestamp: msg.timestamp,
        metadata: msg.metadata
      }))
    }
    
    const blob = new Blob([JSON.stringify(chatLog, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chatbot-test-log-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Chat log exported')
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Message copied to clipboard')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Chatbot Testing</h1>
          <p className="text-white/70">Test and validate AI chatbot responses in real-time</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="english">English</option>
            <option value="hinglish">Hinglish</option>
            <option value="hindi">Hindi</option>
          </select>
          
          <button 
            onClick={exportChatLog}
            className="btn-secondary-premium px-4 py-2 text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Log
          </button>
          
          <button 
            onClick={clearChat}
            className="btn-danger px-4 py-2 text-sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Chat
          </button>
        </div>
      </div>

      {/* Test Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="premium-card group hover-lift">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
              <TestTube className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{testStats.totalTests}</p>
              <p className="text-white/60 text-sm">Total Tests</p>
            </div>
          </div>
        </div>

        <div className="premium-card group hover-lift">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center border border-green-500/30">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{testStats.successfulTests}</p>
              <p className="text-white/60 text-sm">Successful</p>
            </div>
          </div>
        </div>

        <div className="premium-card group hover-lift">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-purple-500/30">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{testStats.averageResponseTime}ms</p>
              <p className="text-white/60 text-sm">Avg Response</p>
            </div>
          </div>
        </div>

        <div className="premium-card group hover-lift">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl flex items-center justify-center border border-red-500/30">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{testStats.errorRate}%</p>
              <p className="text-white/60 text-sm">Error Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Test Scenarios */}
        <div className="lg:col-span-1">
          <div className="premium-card">
            <h2 className="text-lg font-bold text-white mb-4">Test Scenarios</h2>
            <div className="space-y-3">
              {testScenarios.map((scenario) => (
                <div key={scenario.id} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-white text-sm">{scenario.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      scenario.language === 'english' ? 'bg-blue-500/20 text-blue-400' :
                      scenario.language === 'hinglish' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {scenario.language}
                    </span>
                  </div>
                  <p className="text-white/60 text-xs mb-3">{scenario.description}</p>
                  <button
                    onClick={() => runScenario(scenario)}
                    disabled={isLoading || selectedScenario === scenario.id}
                    className="w-full btn-secondary-premium py-2 text-xs"
                  >
                    {selectedScenario === scenario.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-3 h-3 mr-1" />
                        Run Test
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <div className="premium-card h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center border border-green-500/30">
                  <Bot className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">AI Chatbot</h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white/60 text-xs">Online</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-white/60" />
                <span className="text-white/60 text-sm capitalize">{selectedLanguage}</span>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2"
              style={{ scrollBehavior: 'smooth' }}
            >
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'system' ? (
                    <div className="flex items-center justify-center w-full">
                      <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10">
                        <span className="text-white/60 text-xs">{message.content}</span>
                      </div>
                    </div>
                  ) : (
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' 
                            ? 'bg-blue-500' 
                            : message.metadata?.success === false 
                            ? 'bg-red-500' 
                            : 'bg-green-500'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        
                        <div className={`relative group ${message.type === 'user' ? 'text-right' : ''}`}>
                          <div className={`px-4 py-2 rounded-2xl ${
                            message.type === 'user'
                              ? 'bg-blue-500 text-white'
                              : message.metadata?.success === false
                              ? 'bg-red-500/20 border border-red-500/30 text-red-200'
                              : 'bg-white/10 border border-white/20 text-white'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                          
                          {/* Message metadata */}
                          {message.metadata && (
                            <div className="text-xs text-white/60 mt-1 space-y-1">
                              <div className="flex items-center space-x-2">
                                {message.metadata.responseTime && (
                                  <span>⏱️ {message.metadata.responseTime}ms</span>
                                )}
                                {message.metadata.category && (
                                  <span className={`px-2 py-0.5 rounded-full ${
                                    message.metadata.category === 'inquiry' ? 'bg-blue-500/20 text-blue-400' :
                                    message.metadata.category === 'order' ? 'bg-green-500/20 text-green-400' :
                                    message.metadata.category === 'payment' ? 'bg-purple-500/20 text-purple-400' :
                                    'bg-orange-500/20 text-orange-400'
                                  }`}>
                                    {message.metadata.category}
                                  </span>
                                )}
                                {message.metadata.language && (
                                  <span className="px-2 py-0.5 rounded-full bg-white/10">
                                    {message.metadata.language}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Copy button */}
                          <button
                            onClick={() => copyMessage(message.content)}
                            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white/10 rounded-full hover:bg-white/20"
                          >
                            <Copy className="w-3 h-3 text-white" />
                          </button>
                          
                          <div className="text-xs text-white/40 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center space-x-3 pt-4 border-t border-white/10">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type your test message..."
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20 pr-12"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40">
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>
              
              <button
                onClick={() => sendMessage()}
                disabled={isLoading}
                className="btn-premium px-4 py-3 group"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}