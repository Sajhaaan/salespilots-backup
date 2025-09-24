'use client'

import { useState } from 'react'
import { 
  Globe, 
  Instagram,
  MessageSquare,
  Zap,
  Database,
  CreditCard,
  Mail,
  Phone,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Activity,
  BarChart3,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Play,
  Pause,
  Square,
  Edit,
  Trash2,
  Plus,
  Eye,
  Download,
  Upload,
  Key,
  Shield,
  Lock,
  Unlock,
  Bell,
  BellOff,
  Target,
  Gauge,
  Server,
  Cloud,
  Link,
  Unlink,
  Wifi,
  WifiOff,
  Power,
  PowerOff
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  type: 'social' | 'payment' | 'ai' | 'auth' | 'communication' | 'analytics' | 'storage'
  status: 'connected' | 'disconnected' | 'error' | 'pending'
  health: 'healthy' | 'degraded' | 'down'
  icon: any
  color: string
  description: string
  version: string
  lastSync: string
  apiCalls: number
  errorRate: number
  responseTime: number
  uptime: number
  rateLimitUsed: number
  rateLimitMax: number
  config: {
    endpoint?: string
    apiKey?: string
    webhookUrl?: string
    features?: string[]
  }
  metrics: {
    requests: number
    errors: number
    successRate: number
    avgResponseTime: number
  }
}

export default function AdminIntegrationsPage() {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch integrations data
  const fetchIntegrations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/integrations')
      const data = await response.json()
      
      if (response.ok && data.success) {
        setIntegrations(data.integrations || [])
      } else {
        console.error('Failed to fetch integrations data')
      }
    } catch (error) {
      console.error('Error fetching integrations data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchIntegrations()
  }, [])

  const filteredIntegrations = integrations.filter(integration => {
    const matchesType = filterType === 'all' || integration.type === filterType
    const matchesStatus = filterStatus === 'all' || integration.status === filterStatus
    return matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400'
      case 'disconnected': return 'text-gray-400'
      case 'error': return 'text-red-400'
      case 'pending': return 'text-yellow-400'
      default: return 'text-white/60'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500/20'
      case 'disconnected': return 'bg-gray-500/20'
      case 'error': return 'bg-red-500/20'
      case 'pending': return 'bg-yellow-500/20'
      default: return 'bg-white/5'
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-400'
      case 'degraded': return 'text-yellow-400'
      case 'down': return 'text-red-400'
      default: return 'text-white/60'
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />
      case 'degraded': return <AlertTriangle className="w-4 h-4" />
      case 'down': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const toggleIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { 
            ...integration, 
            status: integration.status === 'connected' ? 'disconnected' : 'connected',
            health: integration.status === 'connected' ? 'down' : 'healthy'
          }
        : integration
    ))
  }

  const connectedIntegrations = integrations.filter(i => i.status === 'connected').length
  const totalApiCalls = integrations.reduce((sum, i) => sum + i.apiCalls, 0)
  const avgResponseTime = integrations.filter(i => i.status === 'connected').reduce((sum, i, _, arr) => sum + i.responseTime / arr.length, 0)
  const avgUptime = integrations.filter(i => i.status === 'connected').reduce((sum, i, _, arr) => sum + i.uptime / arr.length, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text-admin mb-2">
            Integration Management Hub 🔗
          </h1>
          <p className="text-white/70 text-lg">
            Manage all third-party integrations, monitor performance, and configure API connections
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-secondary-premium px-4 py-2 text-sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync All
          </button>
          <button className="btn-secondary-premium px-4 py-2 text-sm">
            <Download className="w-4 h-4 mr-2" />
            Export Config
          </button>
          <button className="btn-premium px-4 py-2 text-sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Integration
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="premium-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center border border-green-500/30">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">{connectedIntegrations}</p>
              <p className="text-sm text-green-400">Connected</p>
            </div>
          </div>
          <h3 className="text-white font-semibold mb-2">Active Integrations</h3>
          <p className="text-white/60 text-sm">
            {integrations.length} total integrations
          </p>
        </div>

        <div className="premium-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-400">{(totalApiCalls/1000).toFixed(0)}K</p>
              <p className="text-sm text-blue-400">API Calls</p>
            </div>
          </div>
          <h3 className="text-white font-semibold mb-2">Total Requests</h3>
          <p className="text-white/60 text-sm">
            Last 24 hours
          </p>
        </div>

        <div className="premium-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
              <Gauge className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-400">{avgResponseTime.toFixed(0)}ms</p>
              <p className="text-sm text-purple-400">Avg Response</p>
            </div>
          </div>
          <h3 className="text-white font-semibold mb-2">Performance</h3>
          <p className="text-white/60 text-sm">
            All integrations
          </p>
        </div>

        <div className="premium-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-orange-400">{avgUptime.toFixed(1)}%</p>
              <p className="text-sm text-orange-400">Uptime</p>
            </div>
          </div>
          <h3 className="text-white font-semibold mb-2">Availability</h3>
          <p className="text-white/60 text-sm">
            Average uptime
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="premium-card p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">All Types</option>
              <option value="social">Social Media</option>
              <option value="payment">Payments</option>
              <option value="ai">AI Services</option>
              <option value="auth">Authentication</option>
              <option value="communication">Communication</option>
              <option value="analytics">Analytics</option>
              <option value="storage">Storage</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">All Status</option>
              <option value="connected">Connected</option>
              <option value="disconnected">Disconnected</option>
              <option value="error">Error</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-white/60 text-sm">
              {filteredIntegrations.length} of {integrations.length} integrations
            </span>
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => {
          const Icon = integration.icon
          return (
            <div key={integration.id} className="premium-card hover-lift">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-br from-${integration.color}-500/20 to-${integration.color}-600/20 rounded-xl flex items-center justify-center border border-${integration.color}-500/30`}>
                      <Icon className={`w-6 h-6 text-${integration.color}-400`} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{integration.name}</h3>
                      <p className="text-white/60 text-sm">v{integration.version}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-1 ${getHealthColor(integration.health)}`}>
                      {getHealthIcon(integration.health)}
                      <span className="text-xs font-medium capitalize">{integration.health}</span>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBg(integration.status)} ${getStatusColor(integration.status)}`}>
                    {integration.status.toUpperCase()}
                  </span>
                </div>

                {/* Description */}
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  {integration.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-white font-bold text-lg">{integration.apiCalls.toLocaleString()}</p>
                    <p className="text-white/60 text-xs">API Calls</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-white font-bold text-lg">{integration.responseTime}ms</p>
                    <p className="text-white/60 text-xs">Response Time</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className={`font-bold text-lg ${integration.errorRate > 1 ? 'text-red-400' : 'text-green-400'}`}>
                      {integration.errorRate}%
                    </p>
                    <p className="text-white/60 text-xs">Error Rate</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-white font-bold text-lg">{integration.uptime}%</p>
                    <p className="text-white/60 text-xs">Uptime</p>
                  </div>
                </div>

                {/* Rate Limit */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 text-sm">Rate Limit</span>
                    <span className="text-white/70 text-sm">
                      {integration.rateLimitUsed.toLocaleString()} / {integration.rateLimitMax.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        (integration.rateLimitUsed / integration.rateLimitMax) > 0.8 ? 'bg-red-400' :
                        (integration.rateLimitUsed / integration.rateLimitMax) > 0.6 ? 'bg-yellow-400' : 
                        'bg-green-400'
                      }`}
                      style={{ width: `${(integration.rateLimitUsed / integration.rateLimitMax) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      setSelectedIntegration(integration)
                      setShowConfigModal(true)
                    }}
                    className="flex-1 btn-secondary-premium py-2 text-sm"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </button>
                  <button 
                    onClick={() => toggleIntegration(integration.id)}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                      integration.status === 'connected' 
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    }`}
                  >
                    {integration.status === 'connected' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-white/60 hover:text-white" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Integration Configuration Modal */}
      {showConfigModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="premium-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-br from-${selectedIntegration.color}-500/20 to-${selectedIntegration.color}-600/20 rounded-xl flex items-center justify-center border border-${selectedIntegration.color}-500/30`}>
                    <selectedIntegration.icon className={`w-6 h-6 text-${selectedIntegration.color}-400`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedIntegration.name}</h3>
                    <p className="text-white/70">Configuration & Monitoring</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowConfigModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6 text-white/60" />
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Configuration */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Configuration</h4>
                    <div className="space-y-4">
                      {selectedIntegration.config.endpoint && (
                        <div>
                          <label className="block text-white/70 text-sm mb-2">API Endpoint</label>
                          <input 
                            type="text" 
                            value={selectedIntegration.config.endpoint}
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            readOnly
                          />
                        </div>
                      )}
                      
                      {selectedIntegration.config.apiKey && (
                        <div>
                          <label className="block text-white/70 text-sm mb-2">API Key</label>
                          <div className="relative">
                            <input 
                              type="password" 
                              value={selectedIntegration.config.apiKey}
                              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                              readOnly
                            />
                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <Eye className="w-4 h-4 text-white/60" />
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedIntegration.config.webhookUrl && (
                        <div>
                          <label className="block text-white/70 text-sm mb-2">Webhook URL</label>
                          <input 
                            type="text" 
                            value={selectedIntegration.config.webhookUrl}
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            readOnly
                          />
                        </div>
                      )}

                      {selectedIntegration.config.features && (
                        <div>
                          <label className="block text-white/70 text-sm mb-2">Features</label>
                          <div className="flex flex-wrap gap-2">
                            {selectedIntegration.config.features.map((feature, idx) => (
                              <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Actions</h4>
                    <div className="space-y-3">
                      <button className="w-full btn-secondary-premium py-3">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Test Connection
                      </button>
                      <button className="w-full btn-secondary-premium py-3">
                        <Key className="w-4 h-4 mr-2" />
                        Regenerate API Key
                      </button>
                      <button className="w-full btn-secondary-premium py-3">
                        <Download className="w-4 h-4 mr-2" />
                        Export Configuration
                      </button>
                    </div>
                  </div>
                </div>

                {/* Metrics & Monitoring */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-xl text-center">
                        <p className="text-2xl font-bold text-blue-400">{selectedIntegration.metrics.requests.toLocaleString()}</p>
                        <p className="text-white/60 text-sm">Total Requests</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl text-center">
                        <p className="text-2xl font-bold text-red-400">{selectedIntegration.metrics.errors}</p>
                        <p className="text-white/60 text-sm">Errors</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl text-center">
                        <p className="text-2xl font-bold text-green-400">{selectedIntegration.metrics.successRate}%</p>
                        <p className="text-white/60 text-sm">Success Rate</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl text-center">
                        <p className="text-2xl font-bold text-purple-400">{selectedIntegration.metrics.avgResponseTime}ms</p>
                        <p className="text-white/60 text-sm">Avg Response</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Status Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Status</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBg(selectedIntegration.status)} ${getStatusColor(selectedIntegration.status)}`}>
                          {selectedIntegration.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Health</span>
                        <div className={`flex items-center space-x-2 ${getHealthColor(selectedIntegration.health)}`}>
                          {getHealthIcon(selectedIntegration.health)}
                          <span className="text-sm font-medium capitalize">{selectedIntegration.health}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Last Sync</span>
                        <span className="text-white/80 text-sm">{new Date(selectedIntegration.lastSync).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-white/70">Uptime</span>
                        <span className="text-green-400 font-medium">{selectedIntegration.uptime}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Rate Limiting</h4>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white/70">Usage</span>
                        <span className="text-white font-medium">
                          {selectedIntegration.rateLimitUsed.toLocaleString()} / {selectedIntegration.rateLimitMax.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                        <div 
                          className={`h-3 rounded-full transition-all ${
                            (selectedIntegration.rateLimitUsed / selectedIntegration.rateLimitMax) > 0.8 ? 'bg-red-400' :
                            (selectedIntegration.rateLimitUsed / selectedIntegration.rateLimitMax) > 0.6 ? 'bg-yellow-400' : 
                            'bg-green-400'
                          }`}
                          style={{ width: `${(selectedIntegration.rateLimitUsed / selectedIntegration.rateLimitMax) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-white/60 text-sm">
                        {((selectedIntegration.rateLimitUsed / selectedIntegration.rateLimitMax) * 100).toFixed(1)}% of rate limit used
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-white/10">
                <button className="btn-secondary-premium px-4 py-2">
                  <Download className="w-4 h-4 mr-2" />
                  Export Logs
                </button>
                <button className="btn-secondary-premium px-4 py-2">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Config
                </button>
                <button 
                  onClick={() => toggleIntegration(selectedIntegration.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedIntegration.status === 'connected' 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {selectedIntegration.status === 'connected' ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Disconnect
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Connect
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
