'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Crown,
  Shield,
  Star,
  MoreHorizontal,
  Plus,
  RefreshCw,
  ArrowUpDown,
  UserPlus,
  UserMinus,
  Activity,
  Clock,
  Package,
  CreditCard,
  FileText
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  location: string
  joinDate: string
  lastActive: string
  plan: 'Free' | 'Pro' | 'Premium' | 'Enterprise'
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  revenue: number
  orders: number
  automationEnabled: boolean
  integrations: string[]
  paymentMethod?: string
  subscriptionStatus: 'active' | 'past_due' | 'canceled' | 'trialing'
  riskScore: number
}

// Users will be fetched from the real API

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPlan, setFilterPlan] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('joinDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Fetch users from API
  useEffect(() => {
    fetchUsers()
  }, [searchTerm, filterStatus, filterPlan, sortBy, sortOrder])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        search: searchTerm,
        status: filterStatus,
        plan: filterPlan,
        sortBy: sortBy,
        sortOrder: sortOrder,
        limit: '50' // Get more users for admin view
      })
      
      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()
      
      if (data.success) {
        // Transform API data to match User interface
        const transformedUsers = data.users.map((user: any) => ({
          id: user.id,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
          email: user.email,
          phone: 'N/A', // Not available in current API
          location: user.business_name || 'N/A',
          joinDate: new Date(user.created_at).toLocaleDateString(),
          lastActive: user.last_sign_in_at ? formatRelativeTime(user.last_sign_in_at) : 'Never',
          plan: user.subscription_plan?.charAt(0).toUpperCase() + user.subscription_plan?.slice(1) || 'Free',
          status: 'active', // Default status
          revenue: 0, // Not available in current API
          orders: 0, // Not available in current API
          automationEnabled: user.automation_enabled,
          integrations: [
            ...(user.instagram_connected ? ['Instagram'] : []),
            ...(user.whatsapp_connected ? ['WhatsApp'] : [])
          ],
          paymentMethod: 'UPI', // Default for now
          subscriptionStatus: 'active', // Default for now
          riskScore: calculateRiskScore(user) // Calculate based on user data
        }))
        
        setUsers(transformedUsers)
        setStats(data.stats)
      } else {
        setError(data.error || 'Failed to fetch users')
      }
    } catch (err) {
      setError('Failed to fetch users')
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  const calculateRiskScore = (user: any) => {
    let score = 0
    if (!user.automation_enabled) score += 20
    if (user.subscription_plan === 'free') score += 15
    if (!user.instagram_connected && !user.whatsapp_connected) score += 25
    if (!user.business_name) score += 10
    return Math.min(score, 100)
  }

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus
      const matchesPlan = filterPlan === 'all' || user.plan === filterPlan
      return matchesSearch && matchesStatus && matchesPlan
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof User]
      let bValue = b[sortBy as keyof User]
      
      if (sortBy === 'revenue' || sortBy === 'orders' || sortBy === 'riskScore') {
        aValue = Number(aValue) || 0
        bValue = Number(bValue) || 0
      }
      
      if (aValue && bValue) {
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      }
      return 0
    })

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const selectAllUsers = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length 
        ? [] 
        : filteredUsers.map(user => user.id)
    )
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Free': return 'bg-gray-500/20 text-gray-400'
      case 'Pro': return 'bg-blue-500/20 text-blue-400'
      case 'Premium': return 'bg-purple-500/20 text-purple-400'
      case 'Enterprise': return 'bg-orange-500/20 text-orange-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400'
      case 'inactive': return 'bg-yellow-500/20 text-yellow-400'
      case 'suspended': return 'bg-red-500/20 text-red-400'
      case 'pending': return 'bg-blue-500/20 text-blue-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getRiskColor = (score: number) => {
    if (score <= 20) return 'text-green-400'
    if (score <= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const totalUsers = stats?.total_users || users.length
  const activeUsers = stats?.active_users || users.filter(u => u.status === 'active').length
  const totalRevenue = stats?.total_platform_revenue || users.reduce((sum, u) => sum + u.revenue, 0)
  const avgRevenue = totalUsers > 0 ? totalRevenue / totalUsers : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Loading users...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button 
            onClick={() => fetchUsers()} 
            className="btn-premium px-4 py-2"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="admin-card p-8 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black gradient-text-admin mb-4 tracking-tight">
              User Management Center 👥
            </h1>
            <p className="text-white/80 text-xl leading-relaxed">
              Complete control over your user base with advanced analytics and management tools
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button 
                className="btn-secondary-premium px-6 py-3 text-sm font-semibold hover:scale-105 transition-all duration-300"
              >
                <Download className="w-5 h-5 mr-2" />
                Export Data
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-white/20 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <button 
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/admin/users/export', {
                          method: 'GET',
                          headers: { 'Content-Type': 'application/json' }
                        })

                        if (response.ok) {
                          const blob = await response.blob()
                          const url = window.URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = `users_export_${new Date().toISOString().split('T')[0]}.json`
                          document.body.appendChild(a)
                          a.click()
                          window.URL.revokeObjectURL(url)
                          document.body.removeChild(a)
                          alert('Users data exported as JSON successfully!')
                        } else {
                          alert('Failed to export users data')
                        }
                      } catch (error) {
                        alert('Failed to export users data')
                      }
                    }}
                    className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export as JSON
                  </button>
                  
                  <button 
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/admin/users/export', {
                          method: 'GET',
                          headers: { 'Content-Type': 'application/json' }
                        })

                        if (response.ok) {
                          const data = await response.json()
                          console.log('Export data structure:', data)
                          
                          // Use the users data from the API response
                          const usersData = data.data?.users || data.data?.auth_users || []
                          console.log('Users data for PDF:', usersData)
                          
                          const { exportUsersAsCSV } = await import('@/lib/csv-export')
                          exportUsersAsCSV(usersData, `users_report_${new Date().toISOString().split('T')[0]}.csv`)
                        } else {
                          alert('Failed to export users data')
                        }
                      } catch (error) {
                        console.error('PDF export error:', error)
                        alert('Failed to export users data as PDF. Please try JSON export instead.')
                      }
                    }}
                    className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center"
                  >
                             <FileText className="w-4 h-4 mr-2" />
         Export as CSV
                  </button>
                </div>
              </div>
            </div>
            <button 
              onClick={() => {
                // TODO: Implement add user modal
                alert('Add User functionality will be implemented soon!')
              }}
              className="btn-premium px-6 py-3 text-sm font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/20"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="premium-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{totalUsers}</p>
              <p className="text-sm text-blue-400">{activeUsers} active</p>
            </div>
          </div>
          <h3 className="text-white font-semibold mb-2">Total Users</h3>
          <p className="text-white/60 text-sm">
            {((activeUsers / totalUsers) * 100).toFixed(1)}% engagement rate
          </p>
        </div>

        <div className="premium-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">₹{(totalRevenue/100000).toFixed(1)}L</p>
              <p className="text-sm text-emerald-400">Total Revenue</p>
            </div>
          </div>
          <h3 className="text-white font-semibold mb-2">Revenue</h3>
          <p className="text-white/60 text-sm">
            ₹{(avgRevenue/1000).toFixed(0)}K avg per user
          </p>
        </div>

        <div className="premium-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
              <Crown className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{users.filter(u => u.plan === 'Premium').length}</p>
              <p className="text-sm text-purple-400">Premium Users</p>
            </div>
          </div>
          <h3 className="text-white font-semibold mb-2">Premium</h3>
          <p className="text-white/60 text-sm">
            {((users.filter(u => u.plan === 'Premium').length / totalUsers) * 100).toFixed(1)}% of total
          </p>
        </div>

        <div className="premium-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{users.filter(u => u.riskScore > 50).length}</p>
              <p className="text-sm text-orange-400">High Risk</p>
            </div>
          </div>
          <h3 className="text-white font-semibold mb-2">Risk Users</h3>
          <p className="text-white/60 text-sm">
            Require attention
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="premium-card p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                type="text"
                placeholder="Search users by name, email, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>

              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">All Plans</option>
                <option value="Free">Free</option>
                <option value="Pro">Pro</option>
                <option value="Premium">Premium</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => alert('Advanced filters functionality will be implemented soon!')}
              className="btn-secondary-premium px-4 py-2 text-sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </button>
            <button 
              onClick={() => fetchUsers()}
              className="btn-secondary-premium px-4 py-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-blue-400 font-medium">
                {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => alert(`Send email to ${selectedUsers.length} selected users - functionality will be implemented soon!`)}
                  className="btn-secondary-premium px-3 py-2 text-sm"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </button>
                <button 
                  onClick={() => alert(`Suspend ${selectedUsers.length} selected users - functionality will be implemented soon!`)}
                  className="btn-secondary-premium px-3 py-2 text-sm"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Suspend
                </button>
                <button 
                  onClick={() => {
                    const confirmed = confirm(`Are you sure you want to delete ${selectedUsers.length} selected users? This action cannot be undone.`)
                    if (confirmed) {
                      alert('Delete functionality will be implemented soon!')
                    }
                  }}
                  className="btn-danger px-3 py-2 text-sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={selectAllUsers}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/50"
                  />
                </th>
                <th className="text-left p-4 text-white font-semibold">User</th>
                <th className="text-left p-4 text-white font-semibold">Plan & Status</th>
                <th className="text-left p-4 text-white font-semibold">Performance</th>
                <th className="text-left p-4 text-white font-semibold">Activity</th>
                <th className="text-left p-4 text-white font-semibold">Risk Score</th>
                <th className="text-left p-4 text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/50"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{user.name}</p>
                        <p className="text-white/60 text-sm">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <MapPin className="w-3 h-3 text-white/40" />
                          <span className="text-white/60 text-xs">{user.location}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(user.plan)}`}>
                        {user.plan}
                      </span>
                      <div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </div>
                      <div className="text-xs text-white/60">
                        {user.subscriptionStatus}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span className="text-white font-medium">₹{user.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-blue-400" />
                        <span className="text-white/80 text-sm">{user.orders} orders</span>
                      </div>
                      <div className="text-xs text-white/60">
                        ₹{(user.revenue / user.orders || 0).toFixed(0)} avg
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-white/60" />
                        <span className="text-white/80 text-sm">{new Date(user.joinDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-white/60" />
                        <span className="text-white/60 text-xs">{user.lastActive}</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-2">
                        {user.integrations.slice(0, 3).map((integration, idx) => (
                          <div key={idx} className="w-2 h-2 bg-green-400 rounded-full"></div>
                        ))}
                        {user.integrations.length > 3 && (
                          <span className="text-xs text-white/60">+{user.integrations.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        user.riskScore <= 20 ? 'bg-green-400' :
                        user.riskScore <= 50 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></div>
                      <span className={`font-medium ${getRiskColor(user.riskScore)}`}>
                        {user.riskScore}
                      </span>
                    </div>
                    <div className="text-xs text-white/60 mt-1">
                      {user.riskScore <= 20 ? 'Low' :
                       user.riskScore <= 50 ? 'Medium' : 'High'} risk
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedUser(user)
                          setShowUserModal(true)
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-white/60 hover:text-white" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4 text-white/60 hover:text-white" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="More">
                        <MoreHorizontal className="w-4 h-4 text-white/60 hover:text-white" />
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
            Showing {filteredUsers.length} of {totalUsers} users
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

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="premium-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">User Details</h3>
                <button 
                  onClick={() => setShowUserModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6 text-white/60" />
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* User Info */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {selectedUser.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">{selectedUser.name}</h4>
                      <p className="text-white/70">{selectedUser.email}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(selectedUser.plan)}`}>
                          {selectedUser.plan}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                          {selectedUser.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                        <span className="text-white font-medium">Revenue</span>
                      </div>
                      <p className="text-2xl font-bold text-emerald-400">₹{selectedUser.revenue.toLocaleString()}</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Package className="w-5 h-5 text-blue-400" />
                        <span className="text-white font-medium">Orders</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-400">{selectedUser.orders}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-white">Contact Information</h5>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-white/60" />
                        <span className="text-white/80">{selectedUser.email}</span>
                      </div>
                      {selectedUser.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-white/60" />
                          <span className="text-white/80">{selectedUser.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-white/60" />
                        <span className="text-white/80">{selectedUser.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity & Integrations */}
                <div className="space-y-6">
                  <div>
                    <h5 className="text-lg font-semibold text-white mb-4">Activity Timeline</h5>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-white/60" />
                        <span className="text-white/80 text-sm">Joined {new Date(selectedUser.joinDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-white/60" />
                        <span className="text-white/80 text-sm">Last active {selectedUser.lastActive}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Activity className="w-4 h-4 text-white/60" />
                        <span className="text-white/80 text-sm">
                          Automation {selectedUser.automationEnabled ? 'enabled' : 'disabled'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-lg font-semibold text-white mb-4">Integrations</h5>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedUser.integrations.map((integration, idx) => (
                        <div key={idx} className="flex items-center space-x-2 p-3 bg-white/5 rounded-lg">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span className="text-white/80 text-sm">{integration}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-lg font-semibold text-white mb-4">Risk Assessment</h5>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white font-medium">Risk Score</span>
                        <span className={`font-bold text-xl ${getRiskColor(selectedUser.riskScore)}`}>
                          {selectedUser.riskScore}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            selectedUser.riskScore <= 20 ? 'bg-green-400' :
                            selectedUser.riskScore <= 50 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${selectedUser.riskScore}%` }}
                        ></div>
                      </div>
                      <p className="text-white/60 text-sm mt-2">
                        {selectedUser.riskScore <= 20 ? 'Low risk user with good payment history' :
                         selectedUser.riskScore <= 50 ? 'Medium risk - monitor activity' : 
                         'High risk - requires immediate attention'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-white/10">
                <button className="btn-secondary-premium px-4 py-2">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </button>
                <button className="btn-secondary-premium px-4 py-2">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit User
                </button>
                <button className="btn-danger px-4 py-2">
                  <Ban className="w-4 h-4 mr-2" />
                  Suspend
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}