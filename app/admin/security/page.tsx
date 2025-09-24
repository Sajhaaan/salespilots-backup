'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  Lock, 
  Unlock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Globe,
  User,
  Key,
  Ban,
  Activity,
  FileText,
  Download,
  Filter,
  Search,
  RefreshCw,
  Bell,
  BellOff,
  Settings,
  Zap,
  Database,
  Server,
  Wifi,
  Terminal,
  Code,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Target,
  Crosshair,
  Flag,
  Info,
  UserX,
  UserCheck,
  LogIn,
  LogOut,
  CreditCard,
  DollarSign
} from 'lucide-react'

interface SecurityLog {
  id: string
  timestamp: string
  type: 'login' | 'logout' | 'failed_login' | 'password_change' | 'permission_change' | 'api_access' | 'data_access' | 'suspicious_activity'
  severity: 'low' | 'medium' | 'high' | 'critical'
  user: string
  action: string
  details: string
  ipAddress: string
  userAgent: string
  location: string
  status: 'success' | 'failed' | 'blocked'
}

interface ThreatAlert {
  id: string
  type: 'brute_force' | 'suspicious_login' | 'data_breach' | 'malware' | 'ddos' | 'unauthorized_access'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  timestamp: string
  source: string
  affectedUsers: number
  status: 'active' | 'investigating' | 'resolved' | 'false_positive'
  actions: string[]
}

interface SecurityMetric {
  id: string
  name: string
  value: number
  unit: string
  status: 'good' | 'warning' | 'critical'
  trend: number
  icon: any
  color: string
}

export default function AdminSecurityPage() {
  const [timeRange, setTimeRange] = useState('24h')
  const [filterType, setFilterType] = useState('all')
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLog, setSelectedLog] = useState<SecurityLog | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([])

  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([])

  const [threatAlerts, setThreatAlerts] = useState<ThreatAlert[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch security data
  const fetchSecurityData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/security?timeRange=${timeRange}`)
      const data = await response.json()
      
      if (response.ok && data.success) {
        setSecurityMetrics(data.metrics || [])
        setSecurityLogs(data.logs || [])
        setThreatAlerts(data.alerts || [])
      } else {
        console.error('Failed to fetch security data')
      }
    } catch (error) {
      console.error('Error fetching security data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount and when timeRange changes
  useEffect(() => {
    fetchSecurityData()
  }, [timeRange])

  // Auto refresh functionality
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchSecurityData()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, timeRange])

  // Filter logs based on search and filters
  const filteredLogs = securityLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ipAddress.includes(searchTerm) ||
                         log.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || log.type === filterType
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity
    return matchesSearch && matchesType && matchesSeverity
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-orange-400'
      case 'critical': return 'text-red-400'
      default: return 'text-white/60'
    }
  }

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500/20'
      case 'medium': return 'bg-yellow-500/20'
      case 'high': return 'bg-orange-500/20'
      case 'critical': return 'bg-red-500/20'
      default: return 'bg-white/5'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400'
      case 'failed': return 'text-red-400'
      case 'blocked': return 'text-orange-400'
      default: return 'text-white/60'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'login': return <LogIn className="w-4 h-4" />
      case 'logout': return <LogOut className="w-4 h-4" />
      case 'failed_login': return <UserX className="w-4 h-4" />
      case 'password_change': return <Key className="w-4 h-4" />
      case 'permission_change': return <Settings className="w-4 h-4" />
      case 'api_access': return <Zap className="w-4 h-4" />
      case 'data_access': return <Database className="w-4 h-4" />
      case 'suspicious_activity': return <AlertTriangle className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'brute_force': return <Target className="w-5 h-5 text-red-400" />
      case 'suspicious_login': return <MapPin className="w-5 h-5 text-orange-400" />
      case 'data_breach': return <Database className="w-5 h-5 text-red-400" />
      case 'malware': return <AlertTriangle className="w-5 h-5 text-red-400" />
      case 'ddos': return <Zap className="w-5 h-5 text-red-400" />
      case 'unauthorized_access': return <Lock className="w-5 h-5 text-yellow-400" />
      default: return <Shield className="w-5 h-5 text-blue-400" />
    }
  }

  const getAlertStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-400'
      case 'investigating': return 'text-yellow-400'
      case 'resolved': return 'text-green-400'
      case 'false_positive': return 'text-gray-400'
      default: return 'text-white/60'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text-admin mb-2">
            Security Command Center 🛡️
          </h1>
          <p className="text-white/70 text-lg">
            Advanced threat monitoring, access control, and security analytics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`btn-secondary-premium px-4 py-2 text-sm ${autoRefresh ? 'bg-green-500/20' : ''}`}
          >
            {autoRefresh ? <Bell className="w-4 h-4 mr-2" /> : <BellOff className="w-4 h-4 mr-2" />}
            Auto Refresh
          </button>
          <div className="relative group">
            <button className="btn-secondary-premium px-4 py-2 text-sm">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <button
                onClick={() => {
                  // TODO: Implement JSON export
                  alert('JSON export functionality will be implemented soon!')
                }}
                className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export as JSON
              </button>
              <button
                onClick={() => {
                  // TODO: Implement CSV export
                  alert('CSV export functionality will be implemented soon!')
                }}
                className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export as CSV
              </button>
            </div>
          </div>
          <button className="btn-danger px-4 py-2 text-sm">
            <Shield className="w-4 h-4 mr-2" />
            Security Scan
          </button>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {securityMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.id} className="premium-card p-6 hover-lift">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br from-${metric.color}-500/20 to-${metric.color}-600/20 rounded-xl flex items-center justify-center border border-${metric.color}-500/30`}>
                  <Icon className={`w-6 h-6 text-${metric.color}-400`} />
                </div>
                <div className={`flex items-center space-x-1 ${metric.trend >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {metric.trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-sm font-medium">{Math.abs(metric.trend)}%</span>
                </div>
              </div>
              <h3 className="text-white font-semibold mb-2">{metric.name}</h3>
              <p className={`text-2xl font-bold text-${metric.color}-400 mb-1`}>
                {metric.value.toLocaleString()}{metric.unit}
              </p>
              <p className="text-white/60 text-sm">Last 24 hours</p>
            </div>
          )
        })}
      </div>

      {/* Threat Alerts */}
      <div className="premium-card">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
              Active Threat Alerts
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-red-400 text-sm font-medium">
                {threatAlerts.filter(alert => alert.status === 'active').length} Active
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {threatAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-xl border transition-all ${getSeverityBg(alert.severity)} border-${alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : alert.severity === 'medium' ? 'yellow' : 'green'}-500/30`}>
                <div className="flex items-start space-x-4">
                  {getThreatIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-bold">{alert.title}</h4>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityBg(alert.severity)} ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getAlertStatusColor(alert.status)}`}>
                          {alert.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm mb-3">{alert.description}</p>
                    <div className="flex items-center justify-between text-xs text-white/60 mb-3">
                      <div className="flex items-center space-x-4">
                        <span>Source: {alert.source}</span>
                        <span>Affected: {alert.affectedUsers} user{alert.affectedUsers > 1 ? 's' : ''}</span>
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {alert.actions.map((action, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white/10 rounded text-xs text-white/80">
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="View Details">
                      <Eye className="w-4 h-4 text-white/60 hover:text-white" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Take Action">
                      <Settings className="w-4 h-4 text-white/60 hover:text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Logs */}
      <div className="premium-card">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <FileText className="w-6 h-6 mr-3 text-blue-400" />
              Security Audit Logs
            </h3>
            <div className="flex items-center space-x-3">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                <input
                  type="text"
                  placeholder="Search logs by user, action, IP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="all">All Types</option>
                  <option value="login">Login</option>
                  <option value="logout">Logout</option>
                  <option value="failed_login">Failed Login</option>
                  <option value="password_change">Password Change</option>
                  <option value="permission_change">Permission Change</option>
                  <option value="api_access">API Access</option>
                  <option value="data_access">Data Access</option>
                  <option value="suspicious_activity">Suspicious Activity</option>
                </select>

                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="all">All Severity</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <button className="btn-secondary-premium px-4 py-2 text-sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left p-4 text-white font-semibold">Timestamp</th>
                <th className="text-left p-4 text-white font-semibold">Type</th>
                <th className="text-left p-4 text-white font-semibold">User</th>
                <th className="text-left p-4 text-white font-semibold">Action</th>
                <th className="text-left p-4 text-white font-semibold">Location</th>
                <th className="text-left p-4 text-white font-semibold">Status</th>
                <th className="text-left p-4 text-white font-semibold">Severity</th>
                <th className="text-left p-4 text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="text-white/80 text-sm">{new Date(log.timestamp).toLocaleString()}</p>
                      <p className="text-white/60 text-xs">{log.ipAddress}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(log.type)}
                      <span className="text-white/80 text-sm capitalize">{log.type.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium">{log.user}</p>
                      <p className="text-white/60 text-xs truncate max-w-[200px]">{log.userAgent}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-white/80">{log.action}</p>
                      <p className="text-white/60 text-xs">{log.details}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-white/60" />
                      <span className="text-white/80 text-sm">{log.location}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                      log.status === 'success' ? 'bg-green-500/20 text-green-400' :
                      log.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${getSeverityBg(log.severity)} ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSelectedLog(log)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-white/60 hover:text-white" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Block IP">
                        <Ban className="w-4 h-4 text-white/60 hover:text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-white/10 p-4 flex items-center justify-between">
          <span className="text-white/60 text-sm">
            Showing {filteredLogs.length} of {securityLogs.length} logs
          </span>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-colors">
              Previous
            </button>
            <button className="px-3 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors">
              1
            </button>
            <button className="px-3 py-2 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-colors">
              2
            </button>
            <button className="px-3 py-2 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Security Controls */}
      <div className="premium-card">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Settings className="w-6 h-6 mr-3 text-purple-400" />
            Security Controls
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Access Control</h4>
              <div className="space-y-3">
                <button className="w-full p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
                  <Lock className="w-4 h-4 mr-2 inline" />
                  Manage Permissions
                </button>
                <button className="w-full p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
                  <Ban className="w-4 h-4 mr-2 inline" />
                  Block IP Addresses
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold">Monitoring</h4>
              <div className="space-y-3">
                <button className="w-full p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
                  <Eye className="w-4 h-4 mr-2 inline" />
                  Live Monitoring
                </button>
                <button className="w-full p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
                  <Bell className="w-4 h-4 mr-2 inline" />
                  Alert Settings
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold">Analysis</h4>
              <div className="space-y-3">
                <button className="w-full p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
                  <BarChart3 className="w-4 h-4 mr-2 inline" />
                  Security Reports
                </button>
                <button className="w-full p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all">
                  <Target className="w-4 h-4 mr-2 inline" />
                  Threat Analysis
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold">Emergency</h4>
              <div className="space-y-3">
                <button className="w-full p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium transition-all">
                  <AlertTriangle className="w-4 h-4 mr-2 inline" />
                  Emergency Lockdown
                </button>
                <button className="w-full p-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-xl font-medium transition-all">
                  <Shield className="w-4 h-4 mr-2 inline" />
                  Security Scan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="premium-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Security Log Details</h3>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6 text-white/60" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3">Event Information</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-white/60 text-sm">Timestamp</p>
                        <p className="text-white">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Type</p>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(selectedLog.type)}
                          <span className="text-white capitalize">{selectedLog.type.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Action</p>
                        <p className="text-white">{selectedLog.action}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Status</p>
                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                          selectedLog.status === 'success' ? 'bg-green-500/20 text-green-400' :
                          selectedLog.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {selectedLog.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-3">User & Location</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-white/60 text-sm">User</p>
                        <p className="text-white">{selectedLog.user}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">IP Address</p>
                        <p className="text-white font-mono">{selectedLog.ipAddress}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Location</p>
                        <p className="text-white">{selectedLog.location}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Severity</p>
                        <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${getSeverityBg(selectedLog.severity)} ${getSeverityColor(selectedLog.severity)}`}>
                          {selectedLog.severity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3">Details</h4>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-white/80">{selectedLog.details}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3">User Agent</h4>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-white/80 text-sm font-mono break-all">{selectedLog.userAgent}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-white/10">
                <button className="btn-secondary-premium px-4 py-2">
                  <Ban className="w-4 h-4 mr-2" />
                  Block IP
                </button>
                <button className="btn-secondary-premium px-4 py-2">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact User
                </button>
                <button className="btn-danger px-4 py-2">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Flag as Threat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}