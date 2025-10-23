'use client'

import React, { useState, useEffect } from 'react'
import { 
  ShoppingBag, 
  Package, 
  CreditCard, 
  Users, 
  TrendingUp, 
  MessageSquare,
  Zap,
  Eye,
  Plus,
  Settings,
  BarChart3,
  Activity
} from 'lucide-react'
import { MobileCard } from '@/components/ui/mobile-card'
import { cn } from '@/lib/utils'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  activeWorkflows: number
  totalMessages: number
  todayRevenue: number
  todayOrders: number
  pendingOrders: number
  recentActivity: Array<{
    id: string
    type: 'order' | 'message' | 'workflow' | 'product'
    title: string
    description: string
    timestamp: string
    status?: string
  }>
}

interface RecentOrder {
  id: string
  customerName: string
  productName: string
  amount: number
  status: string
  createdAt: string
}

interface RecentMessage {
  id: string
  customerName: string
  content: string
  isAI: boolean
  createdAt: string
}

export default function RealDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch dashboard stats
      const statsResponse = await fetch('/api/dashboard/real/stats')
      const statsData = await statsResponse.json()

      if (statsData.success) {
        setStats(statsData.data)
      }

      // Fetch recent orders
      const ordersResponse = await fetch('/api/orders/real?limit=5')
      const ordersData = await ordersResponse.json()

      if (ordersData.success) {
        setRecentOrders(ordersData.data.orders)
      }

      // Fetch recent messages
      const messagesResponse = await fetch('/api/messages/real?limit=5')
      const messagesData = await messagesResponse.json()

      if (messagesData.success) {
        setRecentMessages(messagesData.data.messages)
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-orange-600 bg-orange-100'
      case 'confirmed':
        return 'text-blue-600 bg-blue-100'
      case 'processing':
        return 'text-purple-600 bg-purple-100'
      case 'shipped':
        return 'text-indigo-600 bg-indigo-100'
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to SalesPilots! 🚀</h1>
        <p className="text-primary-100">
          Your Instagram automation is running smoothly. Here's what's happening with your business.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MobileCard className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-900">
                {stats ? formatCurrency(stats.totalRevenue) : '₹0'}
              </p>
              <p className="text-xs text-green-700">
                Today: {stats ? formatCurrency(stats.todayRevenue) : '₹0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </MobileCard>

        <MobileCard className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Orders</p>
              <p className="text-2xl font-bold text-blue-900">
                {stats?.totalOrders || 0}
              </p>
              <p className="text-xs text-blue-700">
                Today: {stats?.todayOrders || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
          </div>
        </MobileCard>

        <MobileCard className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Products</p>
              <p className="text-2xl font-bold text-purple-900">
                {stats?.totalProducts || 0}
              </p>
              <p className="text-xs text-purple-700">
                Active in catalog
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </MobileCard>

        <MobileCard className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Customers</p>
              <p className="text-2xl font-bold text-orange-900">
                {stats?.totalCustomers || 0}
              </p>
              <p className="text-xs text-orange-700">
                Active conversations
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </MobileCard>
      </div>

      {/* Quick Actions */}
      <MobileCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="flex flex-col items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
            <Plus className="h-6 w-6 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-primary-900">Add Product</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Zap className="h-6 w-6 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-900">Create Workflow</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <MessageSquare className="h-6 w-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-900">View Messages</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <BarChart3 className="h-6 w-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-900">Analytics</span>
          </button>
        </div>
      </MobileCard>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <MobileCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </button>
          </div>
          
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No orders yet</p>
              <p className="text-sm text-gray-400">Orders will appear here when customers place them</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-sm text-gray-600">{order.productName}</p>
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(order.amount)}</p>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                      getStatusColor(order.status)
                    )}>
                      {order.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </MobileCard>

        {/* Recent Messages */}
        <MobileCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </button>
          </div>
          
          {recentMessages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No messages yet</p>
              <p className="text-sm text-gray-400">Customer messages will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((message) => (
                <div key={message.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{message.customerName}</p>
                      {message.isAI && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          AI
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{message.content}</p>
                    <p className="text-xs text-gray-500">{formatDate(message.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </MobileCard>
      </div>

      {/* Automation Status */}
      <MobileCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Automation Status</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600 font-medium">Active</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Zap className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-green-900">Active Workflows</p>
            <p className="text-2xl font-bold text-green-900">{stats?.activeWorkflows || 0}</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-blue-900">Messages Today</p>
            <p className="text-2xl font-bold text-blue-900">{stats?.totalMessages || 0}</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="font-medium text-purple-900">Pending Orders</p>
            <p className="text-2xl font-bold text-purple-900">{stats?.pendingOrders || 0}</p>
          </div>
        </div>
      </MobileCard>
    </div>
  )
}
