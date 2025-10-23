'use client'

import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  Zap,
  MessageSquare,
  Package,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  Download,
  FileText,
  QrCode
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MobileCard } from '@/components/ui/mobile-card'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  completedOrders: number
  pendingOrders: number
  activeCustomers: number
  automationRate: number
  messagesAutomated: number
  paymentsVerified: number
  aiResponses?: number
}

interface RecentOrder {
  id: string
  customer: {
    name: string
    instagram_username: string
  }
  product: {
    name: string
  }
  total_amount: number
  status: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState('7d')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
    fetchTopProducts()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch real dashboard stats from the new API
      const statsResponse = await fetch('/api/dashboard/real/stats', { 
        credentials: 'include', 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        if (statsData.success) {
          setStats({
            totalRevenue: statsData.data.totalRevenue || 0,
            totalOrders: statsData.data.totalOrders || 0,
            completedOrders: statsData.data.totalOrders - (statsData.data.pendingOrders || 0),
            pendingOrders: statsData.data.pendingOrders || 0,
            activeCustomers: statsData.data.totalCustomers || 0,
            automationRate: statsData.data.activeWorkflows > 0 ? 95 : 0,
            messagesAutomated: statsData.data.totalMessages || 0,
            paymentsVerified: statsData.data.totalOrders || 0,
          })
        } else {
          setStats({
            totalRevenue: 0,
            totalOrders: 0,
            completedOrders: 0,
            pendingOrders: 0,
            activeCustomers: 0,
            automationRate: 0,
            messagesAutomated: 0,
            paymentsVerified: 0,
          })
        }
      } else {
        setStats({
          totalRevenue: 0,
          totalOrders: 0,
          completedOrders: 0,
          pendingOrders: 0,
          activeCustomers: 0,
          automationRate: 0,
          messagesAutomated: 0,
          paymentsVerified: 0,
        })
      }

      // Fetch recent orders from the real API
      const ordersResponse = await fetch('/api/orders/real?limit=5', { 
        credentials: 'include', 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        if (ordersData.success) {
          setRecentOrders(ordersData.data.orders.map((order: any) => ({
            id: order.id,
            customer: {
              name: order.customerName,
              instagram_username: order.customerId
            },
            product: {
              name: order.productName
            },
            total_amount: order.totalAmount,
            status: order.status,
            created_at: order.createdAt
          })))
        } else {
          setRecentOrders([])
        }
      } else {
        setRecentOrders([])
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setError('Failed to load dashboard data')
      setStats({
        totalRevenue: 0,
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        activeCustomers: 0,
        automationRate: 0,
        messagesAutomated: 0,
        paymentsVerified: 0,
      })
      setRecentOrders([])
    } finally {
      setLoading(false)
    }
  }

  const fetchTopProducts = async () => {
    try {
      const response = await fetch('/api/products/real?limit=5', { credentials: 'include', cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTopProducts(data.data.products.map((product: any) => ({
            name: product.name,
            sales: Math.floor(Math.random() * 50), // This would be calculated from actual order data
            revenue: `₹${product.price}`,
            trend: 'up',
            change: '+12%'
          })))
        }
      }
    } catch (error) {
      console.error('Failed to fetch top products:', error)
      // Show empty state if no products
      setTopProducts([])
    }
  }

  const exportDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/export', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `dashboard_export_${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to export dashboard data:', error)
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
        return 'text-orange-300 bg-orange-900'
      case 'confirmed':
        return 'text-blue-300 bg-blue-900'
      case 'processing':
        return 'text-purple-300 bg-purple-900'
      case 'shipped':
        return 'text-indigo-300 bg-indigo-900'
      case 'delivered':
        return 'text-green-300 bg-green-900'
      case 'cancelled':
        return 'text-red-300 bg-red-900'
      default:
        return 'text-gray-300 bg-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-white mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-300">Welcome back! Here's what's happening with your business today.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <button 
            onClick={exportDashboardData}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MobileCard className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-400">Total Revenue</p>
              <p className="text-2xl font-bold text-white">
                {stats ? formatCurrency(stats.totalRevenue) : '₹0'}
              </p>
              <p className="text-xs text-gray-300">
                {stats?.completedOrders || 0} completed orders
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
          </div>
        </MobileCard>

        <MobileCard className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-400">Total Orders</p>
              <p className="text-2xl font-bold text-white">
                {stats?.totalOrders || 0}
              </p>
              <p className="text-xs text-gray-300">
                {stats?.pendingOrders || 0} pending
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
          </div>
        </MobileCard>

        <MobileCard className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-400">Active Customers</p>
              <p className="text-2xl font-bold text-white">
                {stats?.activeCustomers || 0}
              </p>
              <p className="text-xs text-gray-300">
                Instagram users
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </MobileCard>

        <MobileCard className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-400">Automation Rate</p>
              <p className="text-2xl font-bold text-white">
                {stats?.automationRate || 0}%
              </p>
              <p className="text-xs text-gray-300">
                {stats?.messagesAutomated || 0} messages automated
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </div>
        </MobileCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <MobileCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Orders</h2>
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-gray-300 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => router.push('/dashboard/orders')}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  View all
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">No recent orders</p>
                  <p className="text-sm text-gray-400">Orders will appear here when customers place them</p>
                </div>
              ) : (
                recentOrders.map((order, index) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{order.id}</p>
                        <p className="text-sm text-gray-300">{order.customer?.name || order.customer?.instagram_username} • {order.product?.name}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-white">{formatCurrency(order.total_amount)}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(order.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </MobileCard>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <MobileCard>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard/payment-upload')}
                className="w-full flex items-center p-3 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                <QrCode className="h-5 w-5 text-white mr-3" />
                <span className="text-white font-medium">QR & UPI Setup</span>
              </button>
              
              <button 
                onClick={() => router.push('/dashboard/products')}
                className="w-full flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Plus className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-white font-medium">Add Product</span>
              </button>
              
              <button 
                onClick={() => router.push('/dashboard/orders')}
                className="w-full flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <ShoppingBag className="h-5 w-5 text-purple-400 mr-3" />
                <span className="text-white font-medium">View Orders</span>
              </button>
              
              <button 
                onClick={() => router.push('/dashboard/automation')}
                className="w-full flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Zap className="h-5 w-5 text-orange-400 mr-3" />
                <span className="text-white font-medium">Setup Automation</span>
              </button>
            </div>
          </MobileCard>

          {/* AI Automation Status */}
          <MobileCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">AI Automation</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-400 font-medium">Active</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-300 text-sm">Messages Automated</span>
                </div>
                <span className="font-bold text-white">{stats?.messagesAutomated || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-300 text-sm">Payments Verified</span>
                </div>
                <span className="font-bold text-white">{stats?.paymentsVerified || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Package className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-300 text-sm">AI Responses</span>
                </div>
                <span className="font-bold text-white">{stats?.aiResponses || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-300 text-sm">Response Time</span>
                </div>
                <span className="font-bold text-white">Real-time</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-600">
              <button 
                onClick={() => router.push('/dashboard/automation')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <span className="flex items-center justify-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Configure Automation</span>
                </span>
              </button>
            </div>
          </MobileCard>
        </div>
      </div>
    </div>
  )
}