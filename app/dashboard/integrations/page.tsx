"use client"

import { useState, useEffect } from 'react'
import { 
  Instagram, 
  MessageCircle, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink,
  Settings,
  RefreshCw,
  Trash2,
  Plus,
  Activity,
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  Bot,
  Wifi,
  WifiOff,
  Send,
  Database,
  Shield,
  Globe,
  ArrowRight,
  Sparkles,
  Star,
  Lock,
  Info,
  Unlock,
  Eye,
  Edit3,
  Save,
  X,
  AlertCircle,
  Facebook
} from 'lucide-react'
import toast from 'react-hot-toast'
import FacebookLogin from '@/components/FacebookLogin'

interface Integration {
  id: string
  name: string
  description: string
  icon: any
  color: string
  connected: boolean
  status: 'connected' | 'disconnected' | 'error' | 'pending'
  handle?: string
  lastSync?: string
  stats?: {
    messages?: number
    customers?: number
    orders?: number
  }
}

export default function IntegrationsPage() {
  const [loading, setLoading] = useState(false)
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [userData, setUserData] = useState<any>(null)
  const [instagramConfig, setInstagramConfig] = useState<any>(null)
  const [facebookConfig, setFacebookConfig] = useState<any>(null)
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false)
  const [showAutoReplySettings, setShowAutoReplySettings] = useState(false)
  const [autoReplyMessage, setAutoReplyMessage] = useState('')

  useEffect(() => {
    fetchIntegrations()
    fetchUserData()
    fetchInstagramStatus()
    fetchFacebookStatus()
    
    // Check for URL parameters (OAuth callback or error messages)
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    const error = urlParams.get('error')
    
    if (success) {
      toast.success(success)
      setTimeout(() => {
        fetchInstagramStatus()
        fetchFacebookStatus()
      }, 1000)
      window.history.replaceState({}, '', window.location.pathname)
    }
    
    if (error) {
      toast.error(error)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile')
      const data = await response.json()
      
      if (data.success) {
        setUserData(data.user)
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  }

  const fetchInstagramStatus = async () => {
    try {
      const response = await fetch('/api/integrations/instagram/status', {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.success) {
        setInstagramConfig({
          status: data.status,
          message: data.message,
          user: data.user
        })
        
        // Update integrations list with real status
        setIntegrations(prev => prev.map(integration => 
          integration.id === 'instagram' 
            ? { 
                ...integration, 
                connected: !!data.user?.instagramConnected,
                status: data.status,
                handle: data.user?.instagramHandle || undefined
              }
            : integration
        ))
      }
    } catch (error) {
      console.error('Error fetching Instagram status:', error)
    }
  }

  const fetchFacebookStatus = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.success && data.user) {
        setFacebookConfig({
          connected: data.user.facebookConnected,
          config: data.user.facebookConfig
        })
        
        // Update integrations list with Facebook status
        setIntegrations(prev => prev.map(integration => 
          integration.id === 'facebook' 
            ? { 
                ...integration, 
                connected: !!data.user?.facebookConnected,
                status: data.user?.facebookConnected ? 'connected' : 'disconnected',
                handle: data.user?.facebookConfig?.userInfo?.name || undefined
              }
            : integration
        ))
      }
    } catch (error) {
      console.error('Error fetching Facebook status:', error)
    }
  }

  const fetchIntegrations = async () => {
    try {
      setLoading(true)
      
      // Always create default integrations list
      const defaultIntegrations: Integration[] = [
        {
          id: 'facebook',
          name: 'Facebook Login',
          description: 'Connect your Facebook account to access Instagram Business accounts and manage social media',
          icon: Facebook,
          color: 'from-blue-600 to-blue-800',
          connected: false,
          status: 'disconnected',
          stats: {
            messages: 0,
            customers: 0
          }
        },
        {
          id: 'instagram',
          name: 'Instagram Business',
          description: 'Connect your Instagram Business account for automated messaging and order management',
          icon: Instagram,
          color: 'from-pink-500 to-purple-600',
          connected: false,
          status: 'disconnected',
          stats: {
            messages: 0,
            customers: 0
          }
        },
        {
          id: 'whatsapp',
          name: 'WhatsApp Business',
          description: 'Connect WhatsApp Business API for customer support and order notifications',
          icon: MessageCircle,
          color: 'from-green-500 to-emerald-600',
          connected: false,
          status: 'disconnected',
          stats: {
            messages: 0,
            customers: 0
          }
        }
      ]
      
      // Try to fetch status from API
      try {
        const response = await fetch('/api/integrations/status', {
          credentials: 'include'
        })
        const data = await response.json()
        
        if (data.success) {
          // Update with real status
          defaultIntegrations[0].connected = data.instagram?.status === 'active'
          defaultIntegrations[0].status = data.instagram?.status === 'active' ? 'connected' : 'disconnected'
          defaultIntegrations[0].handle = data.instagram?.handle
          defaultIntegrations[0].stats = {
            messages: data.instagram?.messages || 0,
            customers: data.instagram?.customers || 0
          }
          
          defaultIntegrations[1].connected = data.whatsapp?.status === 'active'
          defaultIntegrations[1].status = data.whatsapp?.status === 'active' ? 'connected' : 'disconnected'
          defaultIntegrations[1].stats = {
            messages: data.whatsapp?.messages || 0,
            customers: data.whatsapp?.customers || 0
          }
        }
      } catch (apiError) {
        console.error('Failed to fetch integration status:', apiError)
        // Continue with default values
      }
      
      setIntegrations(defaultIntegrations)
    } catch (error) {
      console.error('Failed to fetch integrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnectInstagram = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/integrations/instagram/direct-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'start_oauth' })
      })
      const data = await response.json()
      
      if (data.success && data.authUrl) {
        window.location.href = data.authUrl
      } else if (data.useDemo) {
        // Show demo mode message
        toast.error('Instagram integration requires Facebook App credentials. Please configure FACEBOOK_APP_ID and FACEBOOK_APP_SECRET in Vercel environment variables.')
      } else {
        toast.error(data.error || 'Failed to initiate Instagram connection')
      }
    } catch (error) {
      toast.error('Failed to connect Instagram')
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnectInstagram = async () => {
    if (!confirm('Are you sure you want to disconnect Instagram? This will stop all automated messaging.')) {
      return
    }
    
    try {
      setLoading(true)
      const response = await fetch('/api/integrations/instagram/disconnect', {
        method: 'POST',
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success('Instagram disconnected successfully')
        fetchInstagramStatus()
      } else {
        toast.error(data.error || 'Failed to disconnect Instagram')
      }
    } catch (error) {
      toast.error('Failed to disconnect Instagram')
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnectFacebook = async () => {
    if (!confirm('Are you sure you want to disconnect Facebook? This will remove access to your Facebook pages and Instagram Business accounts.')) {
      return
    }
    
    try {
      setLoading(true)
      const response = await fetch('/api/auth/facebook/callback', {
        method: 'DELETE',
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success('Facebook disconnected successfully')
        fetchFacebookStatus()
      } else {
        toast.error(data.error || 'Failed to disconnect Facebook')
      }
    } catch (error) {
      toast.error('Failed to disconnect Facebook')
    } finally {
      setLoading(false)
    }
  }

  const handleFacebookSuccess = (response: any) => {
    console.log('Facebook login successful:', response)
    fetchFacebookStatus()
  }

  const handleFacebookError = (error: any) => {
    console.error('Facebook login error:', error)
  }

  const toggleAutoReply = async () => {
    try {
      const response = await fetch('/api/integrations/instagram/auto-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ enabled: !autoReplyEnabled })
      })
      const data = await response.json()
      
      if (data.success) {
        setAutoReplyEnabled(!autoReplyEnabled)
        toast.success(`Auto-reply ${!autoReplyEnabled ? 'enabled' : 'disabled'}`)
      } else {
        toast.error(data.error || 'Failed to update auto-reply settings')
      }
    } catch (error) {
      toast.error('Failed to update auto-reply settings')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-gray-400" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected'
      case 'disconnected':
        return 'Not Connected'
      case 'error':
        return 'Error'
      default:
        return 'Pending'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'disconnected':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      case 'error':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      default:
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    }
  }

  return (
    <div className="p-6 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Integrations</h1>
              <p className="text-white/60 text-sm">
                Connect your business tools and automate customer interactions
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={fetchIntegrations}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors disabled:opacity-50 text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 rounded-lg border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Connected</p>
                <p className="text-xl font-bold text-white">
                  {integrations.filter(i => i.connected).length}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Messages Today</p>
                <p className="text-xl font-bold text-white">
                  {integrations.reduce((sum, i) => sum + (i.stats?.messages || 0), 0)}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Active Customers</p>
                <p className="text-xl font-bold text-white">
                  {integrations.reduce((sum, i) => sum + (i.stats?.customers || 0), 0)}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Automation</p>
                <p className="text-xl font-bold text-white">
                  {autoReplyEnabled ? 'ON' : 'OFF'}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {integrations.map((integration) => {
            const Icon = integration.icon
            const isConnected = integration.connected
            
            return (
              <div key={integration.id} className="bg-white/5 rounded-lg border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${integration.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{integration.name}</h3>
                      <p className="text-white/60 text-sm">{integration.description}</p>
                      {isConnected && integration.handle && (
                        <p className="text-blue-400 text-sm mt-1">@{integration.handle}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(integration.status)}`}>
                    {getStatusIcon(integration.status)}
                    <span className="text-sm font-medium">{getStatusText(integration.status)}</span>
                  </div>
                </div>

                {/* Stats */}
                {isConnected && integration.stats && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <MessageSquare className="w-4 h-4 text-blue-400" />
                        <span className="text-white/60 text-xs">Messages</span>
                      </div>
                      <p className="text-lg font-bold text-white">{integration.stats.messages || 0}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Users className="w-4 h-4 text-purple-400" />
                        <span className="text-white/60 text-xs">Customers</span>
                      </div>
                      <p className="text-lg font-bold text-white">{integration.stats.customers || 0}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-3">
                  {isConnected ? (
                    <>
                      {integration.id === 'instagram' && (
                        <button
                          onClick={toggleAutoReply}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                            autoReplyEnabled 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30' 
                              : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                          }`}
                        >
                          <Bot className="w-4 h-4" />
                          <span>Auto-Reply {autoReplyEnabled ? 'ON' : 'OFF'}</span>
                        </button>
                      )}
                      <button
                        onClick={
                          integration.id === 'instagram' 
                            ? handleDisconnectInstagram 
                            : integration.id === 'facebook'
                            ? handleDisconnectFacebook
                            : undefined
                        }
                        className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Disconnect</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {integration.id === 'facebook' ? (
                        <FacebookLogin
                          onSuccess={handleFacebookSuccess}
                          onError={handleFacebookError}
                          className="w-full"
                        />
                      ) : (
                        <button
                          onClick={integration.id === 'instagram' ? handleConnectInstagram : undefined}
                          disabled={loading}
                          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-lg hover:shadow-blue-500/25"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Connect {integration.name}</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Auto-Reply Settings */}
        {instagramConfig?.user?.instagramConnected && (
          <div className="bg-white/5 rounded-lg border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Instagram Auto-Reply Bot</h3>
                <p className="text-white/60 text-sm">Automatically respond to Instagram messages with a custom message</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${autoReplyEnabled ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="text-sm text-white/60">
                    {autoReplyEnabled ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <button
                  onClick={() => setShowAutoReplySettings(!showAutoReplySettings)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors text-sm"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-pink-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-2">Default Auto-Reply Message</h4>
                  <div className="bg-white/10 rounded-lg p-4 mb-4">
                    <p className="text-white/80 text-sm">
                      "Thank you for your message! Our AI-powered customer service is currently in development and will be live soon. 
                      For immediate assistance, please contact us directly. We'll get back to you as soon as possible! 🚀"
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-white/60">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Instant response</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Professional tone</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4" />
                      <span>24/7 active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-Reply Settings Panel */}
            {showAutoReplySettings && (
              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium">Customize Auto-Reply</h4>
                  <button
                    onClick={() => setShowAutoReplySettings(false)}
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Custom Message</label>
                    <textarea
                      value={autoReplyMessage}
                      onChange={(e) => setAutoReplyMessage(e.target.value)}
                      placeholder="Enter your custom auto-reply message..."
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors text-sm"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium">
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium">
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Setup Guide */}
        <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20 p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2">Quick Setup Guide</h3>
              <p className="text-white/70 text-sm mb-4">
                Get started with integrations in just a few steps. Connect your Instagram Business account to enable automated messaging and order management.
              </p>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => window.open('https://developers.facebook.com/docs/instagram-basic-display-api/getting-started', '_blank')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Instagram Setup Guide</span>
                </button>
                <button 
                  onClick={() => window.open('https://business.whatsapp.com/products/business-api', '_blank')}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Info className="w-4 h-4" />
                  <span>WhatsApp Business API</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}