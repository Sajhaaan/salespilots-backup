'use client'

import { 
  Database,
  Server, 
  HardDrive, 
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  Play,
  Pause,
  Square,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Trash2,
  Copy,
  Edit,
  Eye,
  EyeOff,
  Settings,
  Activity,
  BarChart3,
  Zap,
  Shield,
  Key,
  Globe,
  TestTube,
  Loader2,
  Save
} from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface DatabaseTable {
  name: string
  rows: number
  size: string
  lastUpdated: string
  status: 'healthy' | 'warning' | 'error'
}

interface DatabaseBackup {
  id: string
  name: string
  size: string
  createdAt: string
  type: 'full' | 'incremental'
  status: 'completed' | 'running' | 'failed'
}

interface DatabaseConnection {
  id: string
  database: string
  user: string
  host: string
  status: 'active' | 'idle' | 'terminated'
  duration: string
  query?: string
}

export default function DatabasePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [queryInput, setQueryInput] = useState('')
  const [queryResult, setQueryResult] = useState<any>(null)
  const [isRunningQuery, setIsRunningQuery] = useState(false)

  const [tables, setTables] = useState<DatabaseTable[]>([])
  const [loading, setLoading] = useState(true)

  const [backups, setBackups] = useState<DatabaseBackup[]>([])
  const [stats, setStats] = useState<any>(null)

  const [connections, setConnections] = useState<DatabaseConnection[]>([])

  // Supabase configuration state
  const [supabaseConfig, setSupabaseConfig] = useState({
    projectUrl: '',
    anonKey: '',
    serviceRoleKey: '',
    status: 'disconnected' as 'connected' | 'disconnected' | 'testing' | 'error'
  })
  const [showServiceKey, setShowServiceKey] = useState(false)
  const [isTestingSupabase, setIsTestingSupabase] = useState(false)
  const [isSavingSupabase, setIsSavingSupabase] = useState(false)



  useEffect(() => {
    fetchDatabaseStats()
  }, [])

  const fetchDatabaseStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/database')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Ensure all arrays have fallbacks
          setTables(Array.isArray(data.tables) ? data.tables : [])
          setStats(data.stats || {
            totalSize: '0 KB',
            totalTables: 0,
            totalRows: 0,
            activeConnections: 0
          })
          setConnections(Array.isArray(data.connections) ? data.connections : [])
          setBackups(Array.isArray(data.backups) ? data.backups : [])
        } else {
          throw new Error('Invalid response from database API')
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Failed to fetch database stats:', error)
      // Set safe fallback values
      setTables([])
      setStats({
        totalSize: '0 KB',
        totalTables: 0,
        totalRows: 0,
        activeConnections: 0
      })
      setConnections([])
      setBackups([])
    } finally {
      setLoading(false)
    }
  }

  const databaseStats = stats || {
    totalSize: '0 KB',
    totalTables: 0,
    totalRows: 0,
    activeConnections: 0,
    healthyTables: 0,
    warningTables: 0,
    errorTables: 0
  }

  const executeQuery = async () => {
    if (!queryInput.trim()) return
    
    setIsRunningQuery(true)
    
    // Simulate query execution
    setTimeout(() => {
      setQueryResult({
        success: true,
        rows: Math.floor(Math.random() * 1000),
        executionTime: Math.floor(Math.random() * 500) + 50,
        data: [
          { id: 1, name: 'Sample Data', created_at: '2024-01-20' },
          { id: 2, name: 'Another Row', created_at: '2024-01-19' }
        ]
      })
      setIsRunningQuery(false)
    }, 2000)
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

  const createBackup = async () => {
    try {
      const response = await fetch('/api/admin/database/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Database backup created successfully!')
        fetchDatabaseStats() // Refresh stats
      } else {
        toast.error(data.error || 'Failed to create backup')
      }
    } catch (error) {
      toast.error('Failed to create backup')
    }
  }

  const viewTableData = (tableName: string) => {
    toast.success(`Viewing data for table: ${tableName}`)
    // TODO: Implement table data viewer modal/page
    console.log(`Viewing table: ${tableName}`)
  }

  const editTableStructure = (tableName: string) => {
    toast.success(`Editing structure for table: ${tableName}`)
    // TODO: Implement table structure editor
    console.log(`Editing table: ${tableName}`)
  }

  const exportTableData = async (tableName: string) => {
    try {
      const response = await fetch(`/api/admin/database/export/${tableName}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${tableName}_export.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success(`Exported ${tableName} data successfully!`)
      } else {
        toast.error('Failed to export table data')
      }
    } catch (error) {
      toast.error('Failed to export table data')
    }
  }

  const exportTableAsCSV = async (tableName: string) => {
    try {
      const response = await fetch(`/api/admin/database/export/${tableName}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        const data = await response.json()
        const { exportDatabaseTableAsCSV } = await import('@/lib/csv-export')
        exportDatabaseTableAsCSV(data.data || [], tableName, `${tableName}_export_${new Date().toISOString().split('T')[0]}.csv`)
      } else {
        toast.error('Failed to export table data as CSV')
      }
    } catch (error) {
      toast.error('Failed to export table data as CSV')
    }
  }

  const downloadBackup = async (backupId: string) => {
    try {
      const response = await fetch(`/api/admin/database/backup/${backupId}/download`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `backup_${backupId}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Backup downloaded successfully!')
      } else {
        toast.error('Failed to download backup')
      }
    } catch (error) {
      toast.error('Failed to download backup')
    }
  }

  const restoreBackup = async (backupId: string) => {
    if (!confirm('Are you sure you want to restore this backup? This will overwrite current data.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/database/backup/${backupId}/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Backup restored successfully!')
        fetchDatabaseStats() // Refresh stats
      } else {
        toast.error(data.error || 'Failed to restore backup')
      }
    } catch (error) {
      toast.error('Failed to restore backup')
    }
  }

  const deleteBackup = async (backupId: string) => {
    if (!confirm('Are you sure you want to delete this backup?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/database/backup/${backupId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Backup deleted successfully!')
        fetchDatabaseStats() // Refresh stats
      } else {
        toast.error(data.error || 'Failed to delete backup')
      }
    } catch (error) {
      toast.error('Failed to delete backup')
    }
  }

  const viewConnectionDetails = (connectionId: string) => {
    toast.success(`Viewing connection details for: ${connectionId}`)
    // TODO: Implement connection details modal
    console.log(`Viewing connection: ${connectionId}`)
  }

  const terminateConnection = async (connectionId: string) => {
    if (!confirm('Are you sure you want to terminate this connection?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/database/connections/${connectionId}/terminate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Connection terminated successfully!')
        fetchDatabaseStats() // Refresh stats
      } else {
        toast.error(data.error || 'Failed to terminate connection')
      }
    } catch (error) {
      toast.error('Failed to terminate connection')
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

  const migrateToSupabase = async () => {
    if (supabaseConfig.status !== 'connected') {
      toast.error('Please test and connect to Supabase first')
      return
    }

    setIsSavingSupabase(true)
    try {
      const response = await fetch('/api/admin/database/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: 'supabase' })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Migration completed successfully!')
        fetchDatabaseStats()
      } else {
        toast.error(data.error || 'Migration failed')
      }
    } catch (error) {
      toast.error('Migration failed')
    } finally {
      setIsSavingSupabase(false)
    }
  }

  const getTableStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-500/20'
      case 'warning': return 'text-yellow-400 bg-yellow-500/20'
      case 'error': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20'
      case 'idle': return 'text-yellow-400 bg-yellow-500/20'
      case 'terminated': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const dbStatsCards = [
    {
      title: 'Total Size',
      value: databaseStats.totalSize,
      icon: Database,
      color: 'blue'
    },
    {
      title: 'Tables',
      value: databaseStats.totalTables.toString(),
      icon: FileText,
      color: 'green'
    },
    {
      title: 'Total Rows',
      value: databaseStats.totalRows.toLocaleString(),
      icon: BarChart3,
      color: 'purple'
    },
    {
      title: 'Active Connections',
      value: databaseStats.activeConnections.toString(),
      icon: Activity,
      color: 'orange'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Database Management</h1>
          <p className="text-white/70">Monitor, manage, and optimize your database operations</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={createBackup}
            className="btn-secondary-premium px-4 py-2 text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Create Backup
          </button>
          
          <button 
            onClick={() => setActiveTab('supabase')}
            className="btn-premium px-4 py-2 text-sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            Database Settings
          </button>
        </div>
      </div>

      {/* Database Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dbStatsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className={`premium-card hover-lift group animate-fade-in-up stagger-${index + 1}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/20 border border-${stat.color}-500/30`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{stat.title}</h3>
                <p className="text-white/60 text-sm">Database metrics</p>
              </div>
              
              <div className={`w-full h-1 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-full mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
            </div>
          )
        })}
      </div>

      {/* Tab Navigation */}
      <div className="premium-card">
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'overview', label: 'Tables Overview', icon: Database },
            { id: 'supabase', label: 'Supabase Setup', icon: Zap },
            { id: 'query', label: 'Query Console', icon: FileText },
            { id: 'backups', label: 'Backups', icon: Download },
            { id: 'connections', label: 'Connections', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tables Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Database Tables</h3>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                  <input
                    type="text"
                    placeholder="Search tables..."
                    className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <button 
                  onClick={fetchDatabaseStats}
                  className="btn-secondary-premium px-3 py-2 text-sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-white/60 font-medium">Table Name</th>
                    <th className="text-right py-4 px-4 text-white/60 font-medium">Rows</th>
                    <th className="text-right py-4 px-4 text-white/60 font-medium">Size</th>
                    <th className="text-left py-4 px-4 text-white/60 font-medium">Last Updated</th>
                    <th className="text-left py-4 px-4 text-white/60 font-medium">Status</th>
                    <th className="text-left py-4 px-4 text-white/60 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(tables || []).map((table, index) => (
                    <tr key={table.name} className={`border-b border-white/5 hover:bg-white/5 transition-colors animate-fade-in-up stagger-${index + 1}`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <Database className="w-5 h-5 text-blue-400" />
                          <span className="font-medium text-white">{table.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right text-white">{table.rows.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right text-white">{table.size}</td>
                      <td className="py-4 px-4 text-white/60">{table.lastUpdated}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTableStatusColor(table.status)}`}>
                          {table.status === 'healthy' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {table.status === 'warning' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {table.status === 'error' && <XCircle className="w-3 h-3 mr-1" />}
                          {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => viewTableData(table.name)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            title="View table data"
                          >
                            <Eye className="w-4 h-4 text-white/70" />
                          </button>
                          <button 
                            onClick={() => editTableStructure(table.name)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            title="Edit table structure"
                          >
                            <Edit className="w-4 h-4 text-white/70" />
                          </button>
                          <div className="relative group">
                            <button 
                              onClick={() => exportTableData(table.name)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                              title="Export table data"
                            >
                              <Download className="w-4 h-4 text-white/70" />
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                              <button
                                onClick={() => exportTableData(table.name)}
                                className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Export as JSON
                              </button>
                              <button
                                onClick={() => exportTableAsCSV(table.name)}
                                className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center"
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                Export as CSV
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Supabase Setup Tab */}
        {activeTab === 'supabase' && (
          <div className="space-y-6">
            {/* Supabase Configuration */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Supabase Configuration
              </h3>
              
              <div className="space-y-4">
                {/* Project URL */}
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Project URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="url"
                      value={supabaseConfig.projectUrl}
                      onChange={(e) => setSupabaseConfig(prev => ({ ...prev, projectUrl: e.target.value }))}
                      placeholder="https://your-project.supabase.co"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:bg-white/10"
                    />
                  </div>
                </div>

                {/* Anon Key */}
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Anon Key (Public)
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      value={supabaseConfig.anonKey}
                      onChange={(e) => setSupabaseConfig(prev => ({ ...prev, anonKey: e.target.value }))}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:bg-white/10"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(supabaseConfig.anonKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Service Role Key */}
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Service Role Key (Secret)
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type={showServiceKey ? "text" : "password"}
                      value={supabaseConfig.serviceRoleKey}
                      onChange={(e) => setSupabaseConfig(prev => ({ ...prev, serviceRoleKey: e.target.value }))}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:bg-white/10"
                    />
                    <button
                      onClick={() => setShowServiceKey(!showServiceKey)}
                      className="absolute right-8 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                    >
                      {showServiceKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(supabaseConfig.serviceRoleKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-white/40 text-xs mt-1">Keep this key secure - it has full database access</p>
                </div>

                {/* Connection Status */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      supabaseConfig.status === 'connected' ? 'bg-green-400' :
                      supabaseConfig.status === 'testing' ? 'bg-yellow-400' :
                      supabaseConfig.status === 'error' ? 'bg-red-400' : 'bg-gray-400'
                    }`} />
                    <span className="text-white/60 text-sm">
                      Status: {supabaseConfig.status}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={testSupabaseConnection}
                    disabled={isTestingSupabase || !supabaseConfig.projectUrl || !supabaseConfig.anonKey}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    {isTestingSupabase ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <TestTube className="w-4 h-4" />
                    )}
                    <span>{isTestingSupabase ? 'Testing...' : 'Test Connection'}</span>
                  </button>

                  <button
                    onClick={saveSupabaseConfig}
                    disabled={isSavingSupabase || supabaseConfig.status !== 'connected'}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    {isSavingSupabase ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    <span>{isSavingSupabase ? 'Saving...' : 'Save Configuration'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Migration Section */}
            {supabaseConfig.status === 'connected' && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Data Migration
                </h3>
                
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="text-yellow-400 font-medium">Migration Warning</h4>
                      <p className="text-yellow-300 text-sm mt-1">
                        This will migrate all your current data to Supabase. Make sure you have a backup before proceeding.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={migrateToSupabase}
                  disabled={isSavingSupabase}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {isSavingSupabase ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  <span>{isSavingSupabase ? 'Migrating...' : 'Migrate to Supabase'}</span>
                </button>
              </div>
            )}

            {/* Setup Instructions */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Setup Instructions</h3>
              
              <div className="space-y-4 text-white/70 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-white">Create a Supabase Project</p>
                    <p>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">supabase.com</a> and create a new project</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-white">Get Your API Keys</p>
                    <p>Go to Settings → API in your Supabase dashboard and copy the Project URL and API keys</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-white">Test Connection</p>
                    <p>Enter your credentials above and click "Test Connection" to verify everything works</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-white">Save & Migrate</p>
                    <p>Save the configuration and migrate your data to start using Supabase</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Query Console Tab */}
        {activeTab === 'query' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">SQL Query Console</h3>
              <div className="flex items-center space-x-2">
                <button className="btn-secondary-premium px-3 py-2 text-sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Result
                </button>
                <button className="btn-secondary-premium px-3 py-2 text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">SQL Query</label>
                <textarea 
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  className="w-full h-40 p-3 rounded-xl bg-white/10 border border-white/20 text-white font-mono text-sm"
                  placeholder="SELECT * FROM users WHERE status = 'active' LIMIT 10;"
                />
                <div className="flex items-center space-x-2 mt-3">
                  <button 
                    onClick={executeQuery}
                    disabled={isRunningQuery}
                    className="btn-premium px-4 py-2 text-sm"
                  >
                    {isRunningQuery ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Execute Query
                  </button>
                  <button className="btn-secondary-premium px-3 py-2 text-sm">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Query Results</label>
                <div className="h-40 p-3 rounded-xl bg-black/50 border border-white/20 overflow-auto">
                  {queryResult ? (
                    <div className="font-mono text-sm">
                      {queryResult.success ? (
                        <div>
                          <div className="text-green-400 mb-2">
                            Query executed successfully
                          </div>
                          <div className="text-white/60 mb-2">
                            Rows returned: {queryResult.rows}
                          </div>
                          <div className="text-white/60 mb-3">
                            Execution time: {queryResult.executionTime}ms
                          </div>
                          <div className="text-white">
                            {(queryResult.data || []).map((row: any, index: number) => (
                              <div key={index} className="mb-1">
                                {JSON.stringify(row)}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-red-400">
                          Error: {queryResult.error}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-white/60 text-sm">
                      Execute a query to see results here...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backups Tab */}
        {activeTab === 'backups' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Database Backups</h3>
              <button 
                onClick={createBackup}
                className="btn-premium px-4 py-2 text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Create Backup
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {(backups || []).map((backup, index) => (
                <div key={backup.id} className={`p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors animate-fade-in-up stagger-${index + 1}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        backup.status === 'completed' ? 'bg-green-500/20' :
                        backup.status === 'running' ? 'bg-blue-500/20' :
                        'bg-red-500/20'
                      }`}>
                        {backup.status === 'completed' && <CheckCircle className="w-6 h-6 text-green-400" />}
                        {backup.status === 'running' && <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />}
                        {backup.status === 'failed' && <XCircle className="w-6 h-6 text-red-400" />}
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-white">{backup.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-white/60">
                          <span>{backup.size}</span>
                          <span>•</span>
                          <span>{backup.createdAt}</span>
                          <span>•</span>
                          <span className="capitalize">{backup.type} backup</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {backup.status === 'completed' && (
                        <>
                          <button 
                            onClick={() => downloadBackup(backup.id)}
                            className="btn-secondary-premium px-3 py-2 text-sm"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </button>
                          <button 
                            onClick={() => restoreBackup(backup.id)}
                            className="btn-secondary-premium px-3 py-2 text-sm"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Restore
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => deleteBackup(backup.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Supabase Setup Tab */}
        {activeTab === 'supabase' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Supabase Configuration</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white/60">
                  Connect your Supabase database
                </span>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                  supabaseConfig.status === 'connected' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : supabaseConfig.status === 'testing'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {supabaseConfig.status === 'connected' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : supabaseConfig.status === 'testing' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span className="capitalize">{supabaseConfig.status}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Configuration Form */}
              <div className="premium-card">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                    <Database className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Database Configuration</h4>
                    <p className="text-white/60">Enter your Supabase credentials</p>
                  </div>
                </div>

                <div className="space-y-4">
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
                        type="password"
                        value={supabaseConfig.anonKey}
                        onChange={(e) => setSupabaseConfig(prev => ({
                          ...prev,
                          anonKey: e.target.value
                        }))}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
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
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={testSupabaseConnection}
                      disabled={isTestingSupabase}
                      className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                        isTestingSupabase 
                          ? 'bg-gray-500/20 border border-gray-500/30 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 hover:scale-105 cursor-pointer'
                      }`}
                    >
                      {isTestingSupabase ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
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
                      className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                        isSavingSupabase 
                          ? 'bg-gray-500/20 border border-gray-500/30 text-gray-400 cursor-not-allowed' 
                          : 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 hover:scale-105 cursor-pointer'
                      }`}
                    >
                      {isSavingSupabase ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                          Save Configuration
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Card */}
              <div className="premium-card">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center border border-green-500/30">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Connection Status</h4>
                    <p className="text-white/60">Current database status</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                    <span className="text-white text-sm">Supabase Connection</span>
                    <span className={`text-sm font-medium ${
                      supabaseConfig.status === 'connected' ? 'text-green-400' : 
                      supabaseConfig.status === 'testing' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {supabaseConfig.status === 'connected' ? 'Connected' : 
                       supabaseConfig.status === 'testing' ? 'Testing...' : 'Not Configured'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                    <span className="text-white text-sm">Database Tables</span>
                    <span className="text-gray-400 text-sm">0 tables</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                    <span className="text-white text-sm">Last Sync</span>
                    <span className="text-gray-400 text-sm">Never</span>
                  </div>
                </div>

                {/* Setup Instructions */}
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <h5 className="text-sm font-medium text-blue-400 mb-2">How to get your credentials:</h5>
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
          </div>
        )}

        {/* Connections Tab */}
        {activeTab === 'connections' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Active Connections</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white/60">
                  {connections.length} total connections
                </span>
                <button 
                  onClick={fetchDatabaseStats}
                  className="btn-secondary-premium px-3 py-2 text-sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-white/60 font-medium">User</th>
                    <th className="text-left py-4 px-4 text-white/60 font-medium">Database</th>
                    <th className="text-left py-4 px-4 text-white/60 font-medium">Host</th>
                    <th className="text-left py-4 px-4 text-white/60 font-medium">Status</th>
                    <th className="text-left py-4 px-4 text-white/60 font-medium">Duration</th>
                    <th className="text-left py-4 px-4 text-white/60 font-medium">Current Query</th>
                    <th className="text-left py-4 px-4 text-white/60 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(connections || []).map((connection, index) => (
                    <tr key={connection.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors animate-fade-in-up stagger-${index + 1}`}>
                      <td className="py-4 px-4 text-white">{connection.user}</td>
                      <td className="py-4 px-4 text-white">{connection.database}</td>
                      <td className="py-4 px-4 text-white/60">{connection.host}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConnectionStatusColor(connection.status)}`}>
                          {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white/60">{connection.duration}</td>
                      <td className="py-4 px-4">
                        {connection.query ? (
                          <code className="text-xs bg-white/10 px-2 py-1 rounded text-blue-400">
                            {connection.query.substring(0, 30)}...
                          </code>
                        ) : (
                          <span className="text-white/40">No active query</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => viewConnectionDetails(connection.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            title="View connection details"
                          >
                            <Eye className="w-4 h-4 text-white/70" />
                          </button>
                          <button 
                            onClick={() => terminateConnection(connection.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                            title="Terminate connection"
                          >
                            <XCircle className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
