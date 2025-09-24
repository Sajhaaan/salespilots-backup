'use client'

import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  Zap,
  Eye,
  MessageSquare,
  Package,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  Calendar,
  Download,
  Database,
  FileText
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    fetchTopProducts()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch dashboard stats
      const statsResponse = await fetch('/api/dashboard/stats', { credentials: 'include', cache: 'no-store' })
      const statsData = await statsResponse.json()
      
      if (statsResponse.ok && statsData.success) {
        setStats(statsData.stats)
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

      // Fetch recent orders
      const ordersResponse = await fetch('/api/orders', { credentials: 'include', cache: 'no-store' })
      const ordersData = await ordersResponse.json()
      
      if (ordersResponse.ok && ordersData.success) {
        setRecentOrders(ordersData.orders.slice(0, 5))
      } else {
        setRecentOrders([])
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
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
        toast.success('Dashboard data exported successfully!')
      } else {
        toast.error('Failed to export dashboard data')
      }
    } catch (error) {
      toast.error('Failed to export dashboard data')
    }
  }

  const exportDashboardAsCSV = async () => {
    try {
      const { exportDashboardAsCSV } = await import('@/lib/csv-export')
      exportDashboardAsCSV(stats, `dashboard_export_${new Date().toISOString().split('T')[0]}.csv`)
    } catch (error) {
      toast.error('Failed to export dashboard data as CSV')
    }
  }

  // Derived stats for display
  const displayStats = stats ? [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up' as const,
      icon: CreditCard,
      color: 'emerald' as const
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      change: '+8.2%',
      trend: 'up' as const,
      icon: ShoppingBag,
      color: 'blue' as const
    },
    {
      title: 'Active Customers',
      value: stats.activeCustomers.toString(),
      change: '-2.1%',
      trend: 'down' as const,
      icon: Users,
      color: 'purple' as const
    },
    {
      title: 'Automation Rate',
      value: `${stats.automationRate}%`,
      change: '+5.3%',
      trend: 'up' as const,
      icon: Zap,
      color: 'orange' as const
    }
  ] : []

  const automationMetrics = stats ? [
    { name: 'Messages Automated', value: stats.messagesAutomated.toString(), icon: MessageSquare, color: 'blue' },
    { name: 'Payment Verified', value: stats.paymentsVerified.toString(), icon: CreditCard, color: 'green' },
    { name: 'AI Responses', value: stats.aiResponses || '0', icon: Package, color: 'purple' },
    { name: 'Response Time', value: '< 2s', icon: Clock, color: 'orange' },
  ] : []

  const [topProducts, setTopProducts] = useState<any[]>([])

  useEffect(() => {
    fetchTopProducts()
  }, [])

  const fetchTopProducts = async () => {
    try {
      const response = await fetch('/api/dashboard/top-products', { credentials: 'include', cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTopProducts(data.products)
        }
      }
    } catch (error) {
      console.error('Failed to fetch top products:', error)
      // Show empty state if no products
      setTopProducts([])
    }
  }

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
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-white/70">Welcome back! Here's what's happening with your business today.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
                      <div className="relative group">
              <button 
                onClick={exportDashboardData}
                className="btn-secondary-premium px-4 py-2 text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button
                  onClick={exportDashboardData}
                  className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export as JSON
                </button>
                <button
                  onClick={exportDashboardAsCSV}
                  className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export as CSV
                </button>
              </div>
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className={`premium-card hover-lift group animate-fade-in-up stagger-${index + 1}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/20 border border-${stat.color}-500/30`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <div className={`flex items-center text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                  {stat.change}
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-white/60 text-sm">{stat.title}</p>
              </div>
              
              <div className={`w-full h-1 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-full mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="premium-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Orders</h2>
              <div className="flex items-center space-x-2">
                <button className="text-white/60 hover:text-white transition-colors">
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
              {recentOrders.map((order, index) => {
                const timeAgo = new Date(order.created_at).toLocaleString()
                return (
                  <div key={order.id} className={`flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors animate-fade-in-up stagger-${index + 1}`}>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{order.id}</p>
                        <p className="text-sm text-white/60">{order.customer?.name || order.customer?.instagram_username} • {order.product?.name}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-white">₹{order.total_amount?.toLocaleString()}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`
                          inline-flex px-2 py-1 text-xs font-medium rounded-full
                          ${order.status === 'delivered' ? 'bg-green-500/20 text-green-400' : 
                            order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' : 
                            'bg-orange-500/20 text-orange-400'}
                        `}>
                          {order.status}
                        </span>
                        <span className="text-xs text-white/60">{timeAgo}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
              {recentOrders.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-white/60">No recent orders found</p>
                  <p className="text-white/40 text-sm mt-2">Orders will appear here when customers place them</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="space-y-8">
          <div className="premium-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Top Products</h2>
              <button 
                onClick={() => router.push('/dashboard/products')}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                View all
              </button>
            </div>
            
            <div className="space-y-4">
              {topProducts.length > 0 ? topProducts.map((product, index) => (
                <div key={product.name || index} className={`animate-fade-in-up stagger-${index + 1}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{product.name}</span>
                    <div className={`flex items-center text-sm ${product.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {product.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {product.change || '+0%'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-white/60 mb-2">
                    <span>{product.sales || 0} sales</span>
                    <span className="font-bold text-white">{product.revenue || '₹0'}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className={`h-2 rounded-full bg-gradient-to-r ${product.trend === 'up' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500'}`} style={{ width: `${Math.min(((product.sales || 0) / 250) * 100, 100)}%` }}></div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-white/40 mx-auto mb-3" />
                  <p className="text-white/60">No product data yet</p>
                  <p className="text-white/40 text-sm mt-2">Add products to see analytics</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Automation Metrics */}
          <div className="premium-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">AI Automation</h2>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            
            <div className="space-y-4">
              {automationMetrics.map((metric, index) => {
                const Icon = metric.icon
                return (
                  <div key={metric.name} className={`flex items-center justify-between animate-fade-in-up stagger-${index + 1}`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-${metric.color}-500/20 to-${metric.color}-600/20`}>
                        <Icon className={`w-4 h-4 text-${metric.color}-400`} />
                      </div>
                      <span className="text-white/70 text-sm">{metric.name}</span>
                    </div>
                    <span className="font-bold text-white">{metric.value}</span>
                  </div>
                )
              })}
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10">
              <button 
                onClick={() => router.push('/dashboard/automation')}
                className="w-full btn-premium text-sm py-2"
              >
                <span className="flex items-center justify-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Configure Automation</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>



      {/* Quick Actions */}
      <div className="premium-card">
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => router.push('/dashboard/products')}
            className="flex flex-col items-center justify-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-white font-medium">Add Product</span>
          </button>
          
          <button 
            onClick={() => router.push('/dashboard/orders')}
            className="flex flex-col items-center justify-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-white font-medium">View Orders</span>
          </button>
          
          <button 
            onClick={() => router.push('/dashboard/payments')}
            className="flex flex-col items-center justify-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-white font-medium">View Payments</span>
          </button>
          
          <button 
            onClick={() => router.push('/dashboard/automation')}
            className="flex flex-col items-center justify-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-orange-400" />
            </div>
            <span className="text-white font-medium">Setup Automation</span>
          </button>
        </div>
      </div>
    </div>
  )
}