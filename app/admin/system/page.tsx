'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Settings,
  Play,
  Pause,
  Square,
  Power,
  PowerOff,
  Thermometer,
  Gauge,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Globe,
  Shield,
  Lock,
  Unlock,
  Bell,
  BellOff,
  Eye,
  EyeOff,
  Download,
  Upload,
  MonitorSpeaker,
  Terminal,
  Code,
  FileText,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Package,
  MessageSquare,
  Mail,
  Phone,
  Smartphone
} from 'lucide-react'

interface SystemMetric {
  id: string
  name: string
  value: number
  unit: string
  status: 'good' | 'warning' | 'critical'
  threshold: { warning: number; critical: number }
  history: number[]
  icon: any
  color: string
}

interface ServiceStatus {
  id: string
  name: string
  status: 'running' | 'stopped' | 'error' | 'maintenance'
  uptime: string
  lastRestart: string
  port?: number
  memory: number
  cpu: number
  connections: number
  version: string
}

interface SystemAlert {
  id: string
  type: 'info' | 'warning' | 'error' | 'critical'
  title: string
  message: string
  timestamp: string
  acknowledged: boolean
  source: string
}

export default function AdminSystemPage() {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([])
  const [services, setServices] = useState<ServiceStatus[]>([])
  const [alerts, setAlerts] = useState<SystemAlert[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch system data
  const fetchSystemData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/system')
      const data = await response.json()
      
      if (response.ok && data.success) {
        setSystemMetrics(data.metrics || [])
        setServices(data.services || [])
        setAlerts(data.alerts || [])
      } else {
        console.error('Failed to fetch system data')
      }
    } catch (error) {
      console.error('Error fetching system data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchSystemData()
  }, [])

  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30)
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setSystemMetrics(prev => prev.map(metric => {
        const variation = (Math.random() - 0.5) * 10
        const newValue = Math.max(0, Math.min(100, metric.value + variation))
        const newHistory = [...metric.history.slice(1), newValue]
        
        let status: 'good' | 'warning' | 'critical' = 'good'
        if (newValue >= metric.threshold.critical) status = 'critical'
        else if (newValue >= metric.threshold.warning) status = 'warning'

        return {
          ...metric,
          value: newValue,
          history: newHistory,
          status
        }
      }))
    }, refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': case 'good': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'error': case 'critical': return 'text-red-400'
      case 'stopped': case 'maintenance': return 'text-gray-400'
      default: return 'text-white/60'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'running': case 'good': return 'bg-green-500/20'
      case 'warning': return 'bg-yellow-500/20'
      case 'error': case 'critical': return 'bg-red-500/20'
      case 'stopped': case 'maintenance': return 'bg-gray-500/20'
      default: return 'bg-white/5'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'info': return <CheckCircle className="w-5 h-5 text-blue-400" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />
      default: return <CheckCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ))
  }

  const restartService = (serviceId: string) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, status: 'running', lastRestart: new Date().toISOString(), uptime: '0m' }
        : service
    ))
  }

  const toggleMaintenanceMode = () => {
    setMaintenanceMode(!maintenanceMode)
    if (!maintenanceMode) {
      setServices(prev => prev.map(service => ({ ...service, status: 'maintenance' })))
    } else {
      setServices(prev => prev.map(service => ({ ...service, status: 'running' })))
    }
  }

  const criticalAlerts = alerts.filter(alert => !alert.acknowledged && (alert.type === 'critical' || alert.type === 'error'))
  const warningAlerts = alerts.filter(alert => !alert.acknowledged && alert.type === 'warning')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text-admin mb-2">
            System Control Center ⚙️
          </h1>
          <p className="text-white/70 text-lg">
            Real-time system monitoring, service management, and performance analytics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`btn-secondary-premium px-4 py-2 text-sm ${autoRefresh ? 'bg-green-500/20' : ''}`}
          >
            {autoRefresh ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            Auto Refresh
          </button>
          <button className="btn-secondary-premium px-4 py-2 text-sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Now
          </button>
          <button 
            onClick={toggleMaintenanceMode}
            className={`px-4 py-2 text-sm rounded-xl font-medium transition-all ${
              maintenanceMode 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'btn-danger'
            }`}
          >
            {maintenanceMode ? <Power className="w-4 h-4 mr-2" /> : <PowerOff className="w-4 h-4 mr-2" />}
            {maintenanceMode ? 'Exit Maintenance' : 'Maintenance Mode'}
          </button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="premium-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center border border-green-500/30">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">99.97%</p>
              <p className="text-sm text-green-400">Uptime</p>
            </div>
          </div>
          <h3 className="text-white font-semibold mb-2">System Health</h3>
          <p className="text-white/60 text-sm">All systems operational</p>
        </div>

        <div className="premium-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-400">{services.filter(s => s.status === 'running').length}</p>
              <p className="text-sm text-blue-400">Active Services</p>
            </div>
          </div>
          <h3 className="text-white font-semibold mb-2">Services</h3>
          <p className="text-white/60 text-sm">{services.length} total services</p>
        </div>

        <div className="premium-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-yellow-500/30">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-400">{criticalAlerts.length + warningAlerts.length}</p>
              <p className="text-sm text-yellow-400">Active Alerts</p>
            </div>
          </div>
          <h3 className="text-white font-semibold mb-2">Alerts</h3>
          <p className="text-white/60 text-sm">{criticalAlerts.length} critical</p>
        </div>

        <div className="premium-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-400">145ms</p>
              <p className="text-sm text-purple-400">Avg Response</p>
            </div>
          </div>
          <h3 className="text-white font-semibold mb-2">Performance</h3>
          <p className="text-white/60 text-sm">Optimal response time</p>
        </div>
      </div>

      {/* System Metrics */}
      <div className="premium-card">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-blue-400" />
              Real-Time System Metrics
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-white/60 text-sm">Refresh every</span>
                <select 
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value={10}>10s</option>
                  <option value={30}>30s</option>
                  <option value={60}>1m</option>
                  <option value={300}>5m</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {systemMetrics.map((metric) => {
              const Icon = metric.icon
              return (
                <div 
                  key={metric.id} 
                  className={`p-6 rounded-xl border transition-all cursor-pointer hover-lift ${
                    selectedMetric === metric.id 
                      ? 'bg-white/10 border-blue-500/50' 
                      : `${getStatusBg(metric.status)} border-white/10`
                  }`}
                  onClick={() => setSelectedMetric(selectedMetric === metric.id ? null : metric.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-6 h-6 text-${metric.color}-400`} />
                      <span className="text-white font-medium">{metric.name}</span>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      metric.status === 'good' ? 'bg-green-400' :
                      metric.status === 'warning' ? 'bg-yellow-400 animate-pulse' :
                      'bg-red-400 animate-ping'
                    }`}></div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline space-x-2 mb-2">
                      <span className={`text-3xl font-bold ${getStatusColor(metric.status)}`}>
                        {metric.value.toFixed(1)}
                      </span>
                      <span className="text-white/60 text-sm">{metric.unit}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          metric.status === 'good' ? `bg-${metric.color}-400` :
                          metric.status === 'warning' ? 'bg-yellow-400' :
                          'bg-red-400'
                        }`}
                        style={{ width: `${Math.min(100, (metric.value / 100) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="h-16 flex items-end space-x-1">
                    {metric.history.map((value, index) => (
                      <div
                        key={index}
                        className={`flex-1 bg-${metric.color}-400/30 rounded-t`}
                        style={{ height: `${(value / 100) * 100}%` }}
                      ></div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs text-white/60">
                    <span>Warning: {metric.threshold.warning}{metric.unit}</span>
                    <span>Critical: {metric.threshold.critical}{metric.unit}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="premium-card">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Server className="w-6 h-6 mr-3 text-green-400" />
            Service Management
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-4 text-white font-semibold">Service</th>
                <th className="text-left p-4 text-white font-semibold">Status</th>
                <th className="text-left p-4 text-white font-semibold">Uptime</th>
                <th className="text-left p-4 text-white font-semibold">Resources</th>
                <th className="text-left p-4 text-white font-semibold">Connections</th>
                <th className="text-left p-4 text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium">{service.name}</p>
                      <p className="text-white/60 text-sm">v{service.version}</p>
                      {service.port && (
                        <p className="text-white/60 text-xs">Port: {service.port}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        service.status === 'running' ? 'bg-green-400 animate-pulse' :
                        service.status === 'stopped' ? 'bg-red-400' :
                        service.status === 'maintenance' ? 'bg-yellow-400' :
                        'bg-red-400 animate-ping'
                      }`}></div>
                      <span className={`font-medium capitalize ${getStatusColor(service.status)}`}>
                        {service.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-white/80 text-sm">{service.uptime}</p>
                      <p className="text-white/60 text-xs">
                        Last restart: {new Date(service.lastRestart).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <HardDrive className="w-4 h-4 text-white/60" />
                        <span className="text-white/80 text-sm">{service.memory.toFixed(1)}MB</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Cpu className="w-4 h-4 text-white/60" />
                        <span className="text-white/80 text-sm">{service.cpu.toFixed(1)}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-white/80 font-medium">{service.connections}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => restartService(service.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Restart Service"
                      >
                        <RefreshCw className="w-4 h-4 text-white/60 hover:text-white" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="View Logs">
                        <FileText className="w-4 h-4 text-white/60 hover:text-white" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Configure">
                        <Settings className="w-4 h-4 text-white/60 hover:text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Alerts */}
      <div className="premium-card">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Bell className="w-6 h-6 mr-3 text-yellow-400" />
              System Alerts
            </h3>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setAlertsEnabled(!alertsEnabled)}
                className={`p-2 rounded-lg transition-colors ${alertsEnabled ? 'bg-green-500/20' : 'bg-red-500/20'}`}
              >
                {alertsEnabled ? <Bell className="w-4 h-4 text-green-400" /> : <BellOff className="w-4 h-4 text-red-400" />}
              </button>
              <button className="btn-secondary-premium px-3 py-2 text-sm">
                Clear All
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-xl border transition-all ${
                  alert.acknowledged 
                    ? 'bg-white/5 border-white/10 opacity-60' 
                    : `${getStatusBg(alert.type)} border-${alert.type === 'critical' ? 'red' : alert.type === 'error' ? 'red' : alert.type === 'warning' ? 'yellow' : 'blue'}-500/30`
                }`}
              >
                <div className="flex items-start space-x-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{alert.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-white/60 text-xs">{alert.source}</span>
                        {!alert.acknowledged && (
                          <button 
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="btn-secondary-premium px-2 py-1 text-xs"
                          >
                            Acknowledge
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-white/80 text-sm mb-2">{alert.message}</p>
                    <div className="flex items-center space-x-4 text-xs text-white/60">
                      <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      {alert.acknowledged && (
                        <span className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Acknowledged</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Controls */}
      <div className="premium-card">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Settings className="w-6 h-6 mr-3 text-purple-400" />
            System Controls
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Maintenance</h4>
              <div className="space-y-3">
                <button 
                  onClick={toggleMaintenanceMode}
                  className={`w-full p-3 rounded-xl font-medium transition-all ${
                    maintenanceMode 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {maintenanceMode ? <Power className="w-4 h-4 mr-2 inline" /> : <PowerOff className="w-4 h-4 mr-2 inline" />}
                  {maintenanceMode ? 'Exit Maintenance' : 'Maintenance Mode'}
                </button>
                <button className="w-full p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
                  <RefreshCw className="w-4 h-4 mr-2 inline" />
                  Restart All Services
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold">Monitoring</h4>
              <div className="space-y-3">
                <button 
                  onClick={() => setAlertsEnabled(!alertsEnabled)}
                  className={`w-full p-3 rounded-xl font-medium transition-all ${
                    alertsEnabled 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {alertsEnabled ? <Bell className="w-4 h-4 mr-2 inline" /> : <BellOff className="w-4 h-4 mr-2 inline" />}
                  {alertsEnabled ? 'Alerts Enabled' : 'Alerts Disabled'}
                </button>
                <button className="w-full p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
                  <Eye className="w-4 h-4 mr-2 inline" />
                  View System Logs
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold">Backup & Recovery</h4>
              <div className="space-y-3">
                <button className="w-full p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
                  <Download className="w-4 h-4 mr-2 inline" />
                  Create Backup
                </button>
                <button className="w-full p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
                  <Upload className="w-4 h-4 mr-2 inline" />
                  Restore System
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold">Security</h4>
              <div className="space-y-3">
                <button className="w-full p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
                  <Shield className="w-4 h-4 mr-2 inline" />
                  Security Scan
                </button>
                <button className="w-full p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
                  <Lock className="w-4 h-4 mr-2 inline" />
                  Access Control
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}