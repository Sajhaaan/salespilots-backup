'use client'

import { useState, useEffect } from 'react'
import { 
  Settings,
  Key,
  Check,
  X,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Zap,
  Database,
  Shield,
  Globe,
  MessageSquare,
  Bot,
  TestTube,
  Save,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

interface OpenAIConfig {
  apiKeyConfigured: boolean
  model: string
  maxTokens: string
  temperature: string
  status: 'connected' | 'not_configured' | 'disconnected'
}

interface TestMessage {
  id: string
  message: string
  response: string
  timestamp: string
  success: boolean
}

interface SupabaseConfig {
  projectUrl: string
  anonKey: string
  serviceRoleKey: string
  status: 'connected' | 'disconnected' | 'testing' | 'error'
}

export default function AdminSettingsPage() {
  const [openaiConfig, setOpenaiConfig] = useState<OpenAIConfig>({
    apiKeyConfigured: false,
    model: 'gpt-3.5-turbo',
    maxTokens: '150',
    temperature: '0.7',
    status: 'not_configured'
  })

  const [formData, setFormData] = useState({
    apiKey: '',
    model: 'gpt-3.5-turbo',
    maxTokens: '150',
    temperature: '0.7'
  })

  const [showApiKey, setShowApiKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testMessage, setTestMessage] = useState('Hi, what products do you have?')
  const [testResults, setTestResults] = useState<TestMessage[]>([])

  // Supabase configuration state
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>({
    projectUrl: '',
    anonKey: '',
    serviceRoleKey: '',
    status: 'disconnected'
  })

  // Load saved Supabase config on mount
  useEffect(() => {
    const loadSupabaseConfig = async () => {
      try {
        const response = await fetch('/api/admin/database/save-supabase', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.config) {
            setSupabaseConfig(data.config)
          }
        }
      } catch (error) {
        console.log('No saved Supabase config found')
      }
    }
    loadSupabaseConfig()
  }, [])
  const [showServiceKey, setShowServiceKey] = useState(false)
  const [isTestingSupabase, setIsTestingSupabase] = useState(false)
  const [isSavingSupabase, setIsSavingSupabase] = useState(false)

  useEffect(() => {
    fetchOpenAIConfig()
  }, [])

  const fetchOpenAIConfig = async () => {
    try {
      const response = await fetch('/api/admin/openai')
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.config) {
          setOpenaiConfig(data.config)
          setFormData({
            apiKey: '',
            model: data.config.model || 'gpt-3.5-turbo',
            maxTokens: data.config.maxTokens || '150',
            temperature: data.config.temperature || '0.7'
          })
        } else {
          throw new Error('Invalid configuration data received')
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Failed to fetch OpenAI config:', error)
      toast.error('Failed to load OpenAI configuration')
      // Set safe default values
      setOpenaiConfig({
        apiKeyConfigured: false,
        model: 'gpt-3.5-turbo',
        maxTokens: '150',
        temperature: '0.7',
        status: 'not_configured'
      })
    }
  }

  const handleSaveConfig = async () => {
    if (!formData.apiKey && !openaiConfig?.apiKeyConfigured) {
      toast.error('Please enter an OpenAI API key')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setOpenaiConfig(data.config)
        toast.success('OpenAI configuration saved successfully!')
        setFormData(prev => ({ ...prev, apiKey: '' })) // Clear API key from form
      } else {
        toast.error(data.error || 'Failed to save configuration')
      }
    } catch (error) {
      console.error('Save config error:', error)
      toast.error('Failed to save configuration')
    } finally {
      setLoading(false)
    }
  }

  const testChatbot = async () => {
    if (!testMessage.trim()) {
      toast.error('Please enter a test message')
      return
    }

    setTesting(true)
    try {
      const response = await fetch('/api/chat/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: testMessage,
          language: 'english'
        }),
      })

      const data = await response.json()

      const newResult: TestMessage = {
        id: Date.now().toString(),
        message: testMessage,
        response: data.response,
        timestamp: new Date().toISOString(),
        success: data.success
      }

      setTestResults(prev => [newResult, ...prev.slice(0, 4)]) // Keep last 5 results

      if (data.success) {
        toast.success('Chatbot test successful!')
      } else {
        toast.error(data.error || 'Chatbot test failed')
      }
    } catch (error) {
      console.error('Chatbot test error:', error)
      toast.error('Failed to test chatbot')
    } finally {
      setTesting(false)
    }
  }

  const clearTestResults = () => {
    setTestResults([])
    toast.success('Test results cleared')
  }

  // Supabase functions
  const testSupabaseConnection = async () => {
    if (!supabaseConfig.projectUrl || !supabaseConfig.anonKey) {
      toast.error('Please enter both Project URL and Anon Key')
      return
    }

    setIsTestingSupabase(true)
    try {
      const response = await fetch('/api/admin/database/test-supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectUrl: supabaseConfig.projectUrl,
          anonKey: supabaseConfig.anonKey,
          serviceRoleKey: supabaseConfig.serviceRoleKey
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setSupabaseConfig(prev => ({
          ...prev,
          status: 'connected'
        }))
        toast.success('Supabase connection successful!')
      } else {
        setSupabaseConfig(prev => ({
          ...prev,
          status: 'error'
        }))
        toast.error(data.error || 'Connection failed')
      }
    } catch (error) {
      setSupabaseConfig(prev => ({
        ...prev,
        status: 'error'
      }))
      toast.error('Failed to test connection')
    } finally {
      setIsTestingSupabase(false)
    }
  }

  const saveSupabaseConfig = async () => {
    if (!supabaseConfig.projectUrl || !supabaseConfig.anonKey) {
      toast.error('Please enter both Project URL and Anon Key')
      return
    }

    setIsSavingSupabase(true)
    try {
      const response = await fetch('/api/admin/database/save-supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supabaseConfig)
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Supabase configuration saved successfully!')
      } else {
        toast.error(data.error || 'Failed to save configuration')
      }
    } catch (error) {
      toast.error('Failed to save configuration')
    } finally {
      setIsSavingSupabase(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Settings</h1>
          <p className="text-white/70">Configure system settings and integrations</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchOpenAIConfig}
            className="btn-secondary-premium px-4 py-2 text-sm group"
          >
            <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Refresh
          </button>
        </div>
      </div>

      {/* OpenAI Configuration */}
      <div className="premium-card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center border border-green-500/30">
            <Bot className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">OpenAI Configuration</h2>
            <p className="text-white/60">Configure AI chatbot and automation features</p>
          </div>
          <div className="ml-auto">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              openaiConfig?.status === 'connected' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {openaiConfig?.status === 'connected' ? (
                <Check className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
              <span className="capitalize">{openaiConfig?.status?.replace('_', ' ') || 'Not Configured'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Form */}
          <div className="space-y-6">
            {/* API Key */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={formData.apiKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder={openaiConfig.apiKeyConfigured ? '••••••••••••••••••••••••••••••••' : 'sk-proj-...'}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-white/60 mt-1">
                Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">OpenAI Platform</a>
              </p>
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                AI Model
              </label>
              <select
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Recommended)</option>
                <option value="gpt-4">GPT-4 (Premium)</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
              </select>
            </div>

            {/* Advanced Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Max Tokens
                </label>
                <input
                  type="number"
                  value={formData.maxTokens}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxTokens: e.target.value }))}
                  min="50"
                  max="1000"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Temperature
                </label>
                <input
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                  min="0"
                  max="2"
                  step="0.1"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveConfig}
              disabled={loading}
              className="w-full btn-premium py-3 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Save Configuration
                </>
              )}
            </button>
          </div>

          {/* Test Chatbot */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center space-x-3 mb-4">
                <TestTube className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Test AI Chatbot</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Test Message
                  </label>
                  <textarea
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Enter a message to test the AI response..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={testChatbot}
                    disabled={testing}
                    className="flex-1 btn-secondary-premium py-2 group"
                  >
                    {testing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        Test Chatbot
                      </>
                    )}
                  </button>
                  
                  {testResults.length > 0 && (
                    <button
                      onClick={clearTestResults}
                      className="btn-danger px-4 py-2"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {!openaiConfig.apiKeyConfigured && (
                  <div className="flex items-center space-x-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-yellow-400">
                      Please configure OpenAI API key first
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-white">Recent Test Results</h4>
                {testResults.map((result) => (
                  <div key={result.id} className={`p-4 rounded-xl border ${
                    result.success 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {result.success ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <X className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-xs text-white/60">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-white/60">Message: </span>
                        <span className="text-white">{result.message}</span>
                      </div>
                      <div>
                        <span className="text-white/60">Response: </span>
                        <span className="text-white">{result.response}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Supabase Configuration */}
      <div className="premium-card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
            <Database className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Supabase Configuration</h2>
            <p className="text-white/60">Connect your Supabase database for data management</p>
          </div>
          <div className="ml-auto">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              supabaseConfig.status === 'connected' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : supabaseConfig.status === 'testing'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {supabaseConfig.status === 'connected' ? (
                <Check className="w-4 h-4" />
              ) : supabaseConfig.status === 'testing' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <X className="w-4 h-4" />
              )}
              <span className="capitalize">{supabaseConfig.status}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Project URL */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Project URL
            </label>
            <input
              type="url"
              value={supabaseConfig.projectUrl}
              onChange={(e) => setSupabaseConfig(prev => ({
                ...prev,
                projectUrl: e.target.value
              }))}
              placeholder="https://your-project.supabase.co"
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <p className="text-xs text-white/40 mt-1">
              Found in your Supabase dashboard under Settings → API
            </p>
          </div>

          {/* Anon Key */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Anon Key (Public)
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={supabaseConfig.anonKey}
                onChange={(e) => setSupabaseConfig(prev => ({
                  ...prev,
                  anonKey: e.target.value
                }))}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-white/40 mt-1">
              Safe to use in client-side code
            </p>
          </div>

          {/* Service Role Key */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Service Role Key (Secret)
            </label>
            <div className="relative">
              <input
                type={showServiceKey ? 'text' : 'password'}
                value={supabaseConfig.serviceRoleKey}
                onChange={(e) => setSupabaseConfig(prev => ({
                  ...prev,
                  serviceRoleKey: e.target.value
                }))}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="button"
                onClick={() => setShowServiceKey(!showServiceKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
              >
                {showServiceKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-white/40 mt-1">
              Keep this key secure - it has full database access
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={testSupabaseConnection}
              disabled={isTestingSupabase}
              className="flex-1 btn-secondary-premium py-3 group"
            >
              {isTestingSupabase ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <TestTube className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Test Connection
                </>
              )}
            </button>
            
            <button
              onClick={saveSupabaseConfig}
              disabled={isSavingSupabase}
              className="flex-1 btn-primary-premium py-3 group"
            >
              {isSavingSupabase ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Save Configuration
                </>
              )}
            </button>
          </div>

          {/* Setup Instructions */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <h4 className="text-sm font-medium text-blue-400 mb-2">How to get your Supabase credentials:</h4>
            <ol className="text-xs text-white/60 space-y-1">
              <li>1. Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">supabase.com</a></li>
              <li>2. Sign in to your account</li>
              <li>3. Select your project (or create a new one)</li>
              <li>4. Go to Settings → API</li>
              <li>5. Copy the Project URL, anon public key, and service_role secret key</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="premium-card">
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Database, label: 'Database', color: 'blue', href: '/admin/database' },
            { icon: Shield, label: 'Security', color: 'red', href: '/admin/security' },
            { icon: Globe, label: 'System', color: 'green', href: '/admin/system' },
            { icon: Zap, label: 'Testing', color: 'purple', href: '/admin/testing' },
          ].map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.label}
                className="flex flex-col items-center justify-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br from-${action.color}-500/20 to-${action.color}-600/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-${action.color}-500/30`}>
                  <Icon className={`w-6 h-6 text-${action.color}-400`} />
                </div>
                <span className="text-white font-medium text-sm">{action.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}