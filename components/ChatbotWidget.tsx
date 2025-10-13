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
    if (isOpen && messages.length === 0) {
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'system',
        content: 'AI Chatbot connected. Ready to help with customer inquiries!',
        timestamp: new Date().toISOString()
      }
      setMessages([welcomeMessage])
      checkConnectionStatus()
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
      const response = await fetch('/api/admin/openai')
      if (response.ok) {
        const data = await response.json()
        setConnectionStatus(data.config.status === 'connected' ? 'connected' : 'disconnected')
      } else {
        setConnectionStatus('disconnected')
      }
    } catch (error) {
      console.error('Connection check failed:', error)
      setConnectionStatus('disconnected')
    }
  }

  const sendMessage = async () => {
    const messageText = currentMessage.trim()
    if (!messageText || isLoading) return

    if (connectionStatus !== 'connected') {
      toast.error('AI Chatbot is not configured. Please check admin settings.')
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
      const response = await fetch('/api/chat/test', {
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

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.response || 'Sorry, I could not process your request.',
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
    <div className={`fixed bottom-6 right-6 w-96 h-[500px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden ${className}`}>
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'system' ? (
                  <div className="flex items-center justify-center w-full">
                    <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
                      <span className="text-white/60 text-xs">{message.content}</span>
                    </div>
                  </div>
                ) : (
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-blue-500' 
                          : message.metadata?.success === false 
                          ? 'bg-red-500' 
                          : 'bg-green-500'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-3 h-3 text-white" />
                        ) : (
                          <Bot className="w-3 h-3 text-white" />
                        )}
                      </div>
                      
                      <div className={`group ${message.type === 'user' ? 'text-right' : ''}`}>
                        <div className={`px-3 py-2 rounded-2xl text-sm ${
                          message.type === 'user'
                            ? 'bg-blue-500 text-white'
                            : message.metadata?.success === false
                            ? 'bg-red-500/20 border border-red-500/30 text-red-200'
                            : 'bg-white/10 border border-white/20 text-white'
                        }`}>
                          {message.content}
                        </div>
                        
                        {/* Metadata */}
                        {message.metadata && (
                          <div className="text-xs text-white/60 mt-1 space-y-1">
                            <div className="flex items-center space-x-2">
                              {message.metadata.responseTime && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{message.metadata.responseTime}ms</span>
                                </div>
                              )}
                              {message.metadata.category && (
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                  message.metadata.category === 'inquiry' ? 'bg-blue-500/20 text-blue-400' :
                                  message.metadata.category === 'order' ? 'bg-green-500/20 text-green-400' :
                                  message.metadata.category === 'payment' ? 'bg-purple-500/20 text-purple-400' :
                                  'bg-orange-500/20 text-orange-400'
                                }`}>
                                  {message.metadata.category}
                                </span>
                              )}
                              {message.metadata.success !== undefined && (
                                message.metadata.success ? (
                                  <CheckCircle className="w-3 h-3 text-green-400" />
                                ) : (
                                  <AlertCircle className="w-3 h-3 text-red-400" />
                                )
                              )}
                            </div>
                          </div>
                        )}
                        
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
                <span className="text-red-400 text-xs">AI features offline. Check admin settings.</span>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/20">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white text-sm placeholder-white/40 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  disabled={isLoading}
                />
              </div>
              
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  !isLoading
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
              
              {messages.length > 1 && (
                <button
                  onClick={clearChat}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/60 transition-colors"
                  title="Clear chat"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
