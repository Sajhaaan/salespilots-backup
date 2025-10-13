'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Database,
  Server,
  Cpu,
  HardDrive
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface SystemMetrics {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  totalMessages: number
  verifiedPayments: number
  pendingPayments: number
  totalRevenue: number
  monthlyRevenue: number
  monthlyGrowth: number
  systemUptime: string
  systemHealth: number
  apiErrors: number
  apiCallsToday: number
  aiResponsesToday: number
  averageResponseTime: number
  automationSuccess: number
  paymentSuccess: number
  integrationHealth: number
  storageUsed: number
  bandwidthUsed: number
  cpuUsage: number
  memoryUsage: number
  automationRate: number
  responseTime: number
  uptime: number
  activeSessions: number
  peakConcurrency: number
  apiCalls: number
  errorRate: number
}

interface ActivityItem {
  id: string
  type: 'user' | 'order' | 'payment' | 'system'
  message: string
  timestamp: string
  status: 'success' | 'warning' | 'error'
}

interface GeographicData {
  country: string
  users: number
  orders: number
  revenue: number
  growth: string
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalMessages: 0,
    verifiedPayments: 0,
    pendingPayments: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    monthlyGrowth: 0,
    systemUptime: '0%',
    systemHealth: 0,
    apiErrors: 0,
    apiCallsToday: 0,
    aiResponsesToday: 0,
    averageResponseTime: 0,
    automationSuccess: 0,
    paymentSuccess: 0,
    integrationHealth: 0,
    storageUsed: 0,
    bandwidthUsed: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    automationRate: 0,
    responseTime: 0,
    uptime: 0,
    activeSessions: 0,
    peakConcurrency: 0,
    apiCalls: 0,
    errorRate: 0
  })

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [geographicData, setGeographicData] = useState<GeographicData[]>([])

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      setLoading(true)
      
      // Load analytics data
      const analyticsResponse = await fetch('/api/admin/analytics')
      const analyticsResult = await analyticsResponse.json()
      
      if (analyticsResult.success) {
        setAnalyticsData(analyticsResult.data)
        
        // Update system metrics with real data
        setSystemMetrics({
          totalUsers: analyticsResult.data.totalUsers || 0,
          activeUsers: analyticsResult.data.activeUsers || 0,
          newUsersToday: analyticsResult.data.newUsersToday || 0,
          totalOrders: analyticsResult.data.totalOrders || 0,
          totalProducts: analyticsResult.data.totalProducts || 0,
          totalCustomers: analyticsResult.data.totalCustomers || 0,
          totalMessages: analyticsResult.data.totalMessages || 0,
          verifiedPayments: analyticsResult.data.verifiedPayments || 0,
          pendingPayments: analyticsResult.data.pendingPayments || 0,
          totalRevenue: analyticsResult.data.totalRevenue || 0,
          monthlyRevenue: analyticsResult.data.monthlyRevenue || 0,
          monthlyGrowth: analyticsResult.data.monthlyGrowth || 0,
          systemUptime: analyticsResult.data.systemUptime || '0%',
          systemHealth: analyticsResult.data.systemHealth || 0,
          apiErrors: analyticsResult.data.apiErrors || 0,
          apiCallsToday: analyticsResult.data.apiCallsToday || 0,
          aiResponsesToday: analyticsResult.data.aiResponsesToday || 0,
          averageResponseTime: analyticsResult.data.averageResponseTime || 0,
          automationSuccess: analyticsResult.data.automationSuccess || 0,
          paymentSuccess: analyticsResult.data.paymentSuccess || 0,
          integrationHealth: analyticsResult.data.integrationHealth || 0,
          storageUsed: analyticsResult.data.storageUsed || 0,
          bandwidthUsed: analyticsResult.data.bandwidthUsed || 0,
          cpuUsage: analyticsResult.data.cpuUsage || 0,
          memoryUsage: analyticsResult.data.memoryUsage || 0,
          automationRate: analyticsResult.data.automationRate || 0,
          responseTime: analyticsResult.data.responseTime || 0,
          uptime: analyticsResult.data.uptime || 0,
          activeSessions: analyticsResult.data.activeSessions || 0,
          peakConcurrency: analyticsResult.data.peakConcurrency || 0,
          apiCalls: analyticsResult.data.apiCalls || 0,
          errorRate: analyticsResult.data.errorRate || 0
        })
      }

      // Load recent activity
      const activityResponse = await fetch('/api/admin/activity')
      const activityResult = await activityResponse.json()
      
      if (activityResult.success) {
        setRecentActivity(activityResult.activities || [])
      }

      // Load geographic data
      const geoResponse = await fetch('/api/admin/geographic-data')
      const geoResult = await geoResponse.json()
      
      if (geoResult.success) {
        setGeographicData(geoResult.data || [])
      }

    } catch (error) {
      console.error('Failed to load admin data:', error)
      setError('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Platform overview and system metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-white text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemMetrics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              +{systemMetrics.newUsersToday} today
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-white text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemMetrics.totalOrders.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              ₹{systemMetrics.totalRevenue.toLocaleString()} revenue
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-white text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹{systemMetrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              +{systemMetrics.monthlyGrowth}% this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-white text-sm font-medium">System Health</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemMetrics.systemHealth}%</div>
            <p className="text-xs text-gray-400">
              {systemMetrics.systemUptime} uptime
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">System Performance</CardTitle>
            <CardDescription className="text-gray-400">Real-time system metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">CPU Usage</span>
              <span className="text-gray-400">{systemMetrics.cpuUsage}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Memory Usage</span>
              <span className="text-gray-400">{systemMetrics.memoryUsage}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Storage Used</span>
              <span className="text-gray-400">{systemMetrics.storageUsed}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">API Response Time</span>
              <span className="text-gray-400">{systemMetrics.averageResponseTime}ms</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Business Metrics</CardTitle>
            <CardDescription className="text-gray-400">Platform performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Automation Success</span>
              <span className="text-gray-400">{systemMetrics.automationSuccess}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Payment Success</span>
              <span className="text-gray-400">{systemMetrics.paymentSuccess}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Integration Health</span>
              <span className="text-gray-400">{systemMetrics.integrationHealth}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Error Rate</span>
              <span className="text-gray-400">{systemMetrics.errorRate}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-gray-900 border-gray-700 mb-8">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
          <CardDescription className="text-gray-400">Latest platform activities</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.message}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      {geographicData.length > 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Geographic Distribution</CardTitle>
            <CardDescription className="text-gray-400">User distribution by country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {geographicData.map((geo) => (
                <div key={geo.country} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{geo.country}</p>
                    <p className="text-gray-400 text-sm">{geo.users} users</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white">{geo.orders} orders</p>
                    <p className="text-gray-400 text-sm">₹{geo.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}