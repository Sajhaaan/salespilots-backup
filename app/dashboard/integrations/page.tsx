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
  Globe
} from 'lucide-react'
import toast from 'react-hot-toast'

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
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false)

  useEffect(() => {
    fetchIntegrations()
    fetchUserData()
    fetchInstagramStatus()
    
    // Check for URL parameters (OAuth callback or error messages)
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    const error = urlParams.get('error')
    
    if (success) {
      toast.success(success)
      setTimeout(() => {
        fetchInstagramStatus()
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

  const fetchIntegrations = async () => {
    try {
      setLoading(true)
      
      // Always create default integrations list
      const defaultIntegrations: Integration[] = [
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
      const response = await fetch('/api/integrations/instagram/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'start_oauth' })
      })
      const data = await response.json()
      
      if (data.success && data.authUrl) {
        window.location.href = data.authUrl
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
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'disconnected':
        return <WifiOff className="w-5 h-5 text-gray-400" />
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-400" />
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />
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
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'disconnected':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Integrations</h1>
          <p className="text-white/70">Connect your business tools and automate customer interactions</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchIntegrations}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="premium-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Connected</p>
              <p className="text-2xl font-bold text-white">
                {integrations.filter(i => i.connected).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="premium-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Messages Today</p>
              <p className="text-2xl font-bold text-white">
                {integrations.reduce((sum, i) => sum + (i.stats?.messages || 0), 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="premium-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Active Customers</p>
              <p className="text-2xl font-bold text-white">
                {integrations.reduce((sum, i) => sum + (i.stats?.customers || 0), 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="premium-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Automation</p>
              <p className="text-2xl font-bold text-white">
                {autoReplyEnabled ? 'ON' : 'OFF'}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {integrations.map((integration) => {
          const Icon = integration.icon
          const isConnected = integration.connected
          
          return (
            <div key={integration.id} className="premium-card group">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${integration.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{integration.name}</h3>
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
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                      <span className="text-white/60 text-sm">Messages</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{integration.stats.messages || 0}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span className="text-white/60 text-sm">Customers</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{integration.stats.customers || 0}</p>
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
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                          autoReplyEnabled 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-white/10 text-white border border-white/20'
                        }`}
                      >
                        <Bot className="w-4 h-4" />
                        <span>Auto-Reply {autoReplyEnabled ? 'ON' : 'OFF'}</span>
                      </button>
                    )}
                    <button
                      onClick={integration.id === 'instagram' ? handleDisconnectInstagram : undefined}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Disconnect</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={integration.id === 'instagram' ? handleConnectInstagram : undefined}
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Connect {integration.name}</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Auto-Reply Settings */}
      {instagramConfig?.user?.instagramConnected && (
        <div className="premium-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Instagram Auto-Reply Bot</h3>
              <p className="text-white/60">Automatically respond to Instagram messages with a custom message</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${autoReplyEnabled ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-white/60">
                {autoReplyEnabled ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-pink-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium mb-2">Default Auto-Reply Message</h4>
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <p className="text-white/80">
                    "Thank you for your message! Our AI-powered customer service is currently in development and will be live soon. 
                    For immediate assistance, please contact us directly. We'll get back to you as soon as possible! 🚀"
                  </p>
                  <div className="mt-3 text-sm text-white/60">
                    <p>• Responds to greetings like "hi", "hello", "hey"</p>
                    <p>• Sends professional message to all customers</p>
                    <p>• Works 24/7 when enabled</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-white/60">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Instant response</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4" />
                    <span>Professional tone</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span>24/7 active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}