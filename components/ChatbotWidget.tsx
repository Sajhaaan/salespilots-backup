'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Loader2, 
  AlertCircle,
  CheckCircle,
  Clock,
  Minimize2,
  Maximize2
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
  }
}

interface ChatbotWidgetProps {
  isOpen: boolean
  onToggle: () => void
  className?: string
}

export default function ChatbotWidget({ isOpen, onToggle, className = '' }: ChatbotWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Add welcome message every time chatbot opens
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'system',
        content: '👋 Welcome to SalesPilots AI Assistant! Ask me anything about our platform, pricing, features, or how to get started.',
        timestamp: new Date().toISOString()
      }
      
      if (messages.length === 0) {
        setMessages([welcomeMessage])
        console.log('✅ Welcome message added:', welcomeMessage)
      }
      
      // Always check connection status when opened
      checkConnectionStatus()
      
      // Retry connection check after 2 seconds if still checking
      const retryTimer = setTimeout(() => {
        if (connectionStatus === 'checking') {
          checkConnectionStatus()
        }
      }, 2000)
      
      return () => clearTimeout(retryTimer)
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const checkConnectionStatus = async () => {
    try {
      // Use health check endpoint instead of admin endpoint
      const response = await fetch('/api/health', {
        cache: 'no-store', // Prevent caching
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Health check response:', data)
        
        // Find OpenAI service in health checks
        const openaiCheck = data.checks?.find((check: any) => check.service === 'openai')
        console.log('OpenAI check:', openaiCheck)
        
        if (openaiCheck && (openaiCheck.status === 'healthy' || openaiCheck.status === 'degraded')) {
          setConnectionStatus('connected')
          console.log('✅ AI connected')
        } else {
          setConnectionStatus('disconnected')
          console.log('❌ AI disconnected:', openaiCheck)
        }
      } else {
        setConnectionStatus('disconnected')
        console.log('❌ Health check failed:', response.status)
      }
    } catch (error) {
      console.error('❌ Connection check failed:', error)
      setConnectionStatus('disconnected')
    }
  }

  const sendMessage = async () => {
    const messageText = currentMessage.trim()
    if (!messageText || isLoading) return

    // Allow sending even if connection shows degraded (fallback will work)
    if (connectionStatus === 'disconnected') {
      toast.error('AI Chatbot is still connecting. Please wait a moment and try again.')
      return
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsLoading(true)

    const startTime = Date.now()

    try {
      const response = await fetch('/api/chat/public', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          language: 'english'
        }),
      })

      const data = await response.json()
      const responseTime = Date.now() - startTime

      // Extract response content (handle both string and object responses)
      let responseContent = data.response
      if (typeof responseContent === 'object' && responseContent.content) {
        responseContent = responseContent.content
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: responseContent || 'Sorry, I could not process your request.',
        timestamp: new Date().toISOString(),
        metadata: {
          category: data.category,
          language: data.language,
          responseTime,
          success: data.success
        }
      }

      setMessages(prev => [...prev, botMessage])

      if (data.success) {
        toast.success(`Response received in ${responseTime}ms`)
      } else {
        toast.error('Failed to get AI response')
      }

    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I am experiencing technical difficulties. Please try again.',
        timestamp: new Date().toISOString(),
        metadata: {
          success: false,
          responseTime: Date.now() - startTime
        }
      }
      setMessages(prev => [...prev, errorMessage])
      toast.error('Failed to send message')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([{
      id: Date.now().toString(),
      type: 'system',
      content: 'Chat cleared. Ready for new conversations!',
      timestamp: new Date().toISOString()
    }])
    toast.success('Chat history cleared')
  }

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 z-50 ${className}`}
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
      </button>
    )
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="chatbot-backdrop fixed inset-0 bg-black/70 backdrop-blur-lg z-[100] transition-opacity duration-300"
        onClick={onToggle}
      />
      
      {/* Chatbot Modal - Centered */}
      <div 
        className={`fixed w-[calc(100vw-2rem)] sm:w-[450px] bg-gradient-to-br from-slate-900/98 via-purple-900/95 to-slate-900/98 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl z-[101] flex flex-col overflow-hidden animate-slide-up ${className}`} 
        style={{ 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          height: 'min(600px, 85vh)',
          maxHeight: '85vh'
        }}
      >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-white text-sm">AI Chatbot</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' :
                connectionStatus === 'disconnected' ? 'bg-red-400' :
                'bg-yellow-400 animate-pulse'
              }`}></div>
              <span className="text-xs text-white/60 capitalize">
                {connectionStatus === 'connected' ? 'Online' :
                 connectionStatus === 'disconnected' ? 'Offline' :
                 'Connecting...'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-white/60" />
            ) : (
              <Minimize2 className="w-4 h-4 text-white/60" />
            )}
          </button>
          
          <button
            onClick={onToggle}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Bot className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                  <p className="text-white/60 text-sm">Loading chatbot...</p>
                </div>
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'system' ? (
                  <div className="flex items-center justify-center w-full my-2">
                    <div className="px-4 py-2.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30 backdrop-blur-sm">
                      <span className="text-white text-sm font-medium">{message.content}</span>
                    </div>
                  </div>
                ) : (
                  <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start gap-2.5 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center shadow-lg ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                          : message.metadata?.success === false 
                          ? 'bg-gradient-to-br from-red-500 to-red-600' 
                          : 'bg-gradient-to-br from-green-500 to-emerald-600'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <Bot className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                      
                      <div className={`flex-1 min-w-0 ${message.type === 'user' ? 'text-right' : ''}`}>
                        <div className={`inline-block px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-md ${
                          message.type === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                            : message.metadata?.success === false
                            ? 'bg-red-500/20 border border-red-500/30 text-red-200'
                            : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white'
                        }`} style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                          {message.content}
                        </div>
                        
                        {/* Metadata */}
                        <div className={`flex items-center gap-2 mt-1.5 text-xs ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-white/40">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {message.metadata?.responseTime && (
                            <span className="text-white/40 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {message.metadata.responseTime}ms
                            </span>
                          )}
                          {message.metadata?.success !== undefined && (
                            message.metadata.success ? (
                              <CheckCircle className="w-3 h-3 text-green-400" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-red-400" />
                            )
                          )}
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
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-white/10 border border-white/20 rounded-2xl px-3 py-2">
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

          {/* Connection Status Warning */}
          {connectionStatus === 'disconnected' && (
            <div className="px-4 pb-2">
              <div className="flex items-center space-x-2 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-xs">AI is connecting... Please refresh if this persists.</span>
              </div>
            </div>
          )}
          
          {connectionStatus === 'checking' && (
            <div className="px-4 pb-2">
              <div className="flex items-center space-x-2 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
                <span className="text-yellow-400 text-xs">Connecting to AI services...</span>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/20 bg-slate-900/50">
            <div className="flex items-end gap-2.5">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-white/40 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white/15 transition-all"
                  disabled={isLoading || connectionStatus === 'disconnected'}
                />
              </div>
              
              <button
                onClick={sendMessage}
                disabled={isLoading || !currentMessage.trim() || connectionStatus === 'disconnected'}
                className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                  !isLoading && currentMessage.trim() && connectionStatus !== 'disconnected'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 text-white'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
              
              {messages.length > 1 && (
                <button
                  onClick={clearChat}
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-white/10 hover:bg-red-500/20 hover:border-red-500/30 border border-white/10 text-white/60 hover:text-red-400 transition-all"
                  title="Clear chat"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </>
      )}
      </div>
    </>
  )
}
