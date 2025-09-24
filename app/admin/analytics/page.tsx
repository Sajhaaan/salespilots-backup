'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { 
  BarChart3,
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign,
  Package,
  MessageSquare,
  Calendar,
  MapPin,
  Clock,
  Eye,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Instagram,
  Mail,
  Phone,
  CreditCard,
  ShoppingBag,
  Star,
  Heart,
  Share2,
  ThumbsUp,
  Activity,
  PieChart,
  LineChart,
  AreaChart,
  FileText
} from 'lucide-react'

interface AnalyticsData {
  totalRevenue: number
  revenueGrowth: number
  totalUsers: number
  userGrowth: number
  totalOrders: number
  orderGrowth: number
  conversionRate: number
  conversionGrowth: number
  avgOrderValue: number
  aovGrowth: number
  churnRate: number
  churnGrowth: number
}

interface ChartData {
  date: string
  revenue: number
  users: number
  orders: number
  conversions: number
}

interface GeographicData {
  region: string
  users: number
  revenue: number
  growth: string
  percentage: number
}

interface DeviceData {
  device: string
  users: number
  percentage: number
  sessions: number
  conversionRate: number
}

interface ChannelData {
  channel: string
  users: number
  revenue: number
  conversions: number
  cost: number
  roi: number
}

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [loading, setLoading] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalRevenue: 0,
    revenueGrowth: 0,
    totalUsers: 0,
    userGrowth: 0,
    totalOrders: 0,
    orderGrowth: 0,
    conversionRate: 0,
    conversionGrowth: 0,
    avgOrderValue: 0,
    aovGrowth: 0,
    churnRate: 0,
    churnGrowth: 0
  })

  const [chartData, setChartData] = useState<ChartData[]>([])

  const [geographicData, setGeographicData] = useState<GeographicData[]>([])

  const [deviceData, setDeviceData] = useState<DeviceData[]>([])

  const [channelData, setChannelData] = useState<ChannelData[]>([])

  const maxValue = Math.max(...chartData.map(d => d[selectedMetric as keyof ChartData] as number))

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
  }

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`
    return `₹${value}`
  }

  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    return value.toString()
  }

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`)
      const data = await response.json()
      
      if (response.ok && data.success) {
        setAnalyticsData(data.data)
        setChartData(data.chartData || [])
        setGeographicData(data.geographicData || [])
        setDeviceData(data.deviceData || [])
        setChannelData(data.channelData || [])
      } else {
        console.error('Failed to fetch analytics data')
        toast.error('Failed to fetch analytics data')
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Error fetching analytics data')
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount and when timeRange changes
  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const showFilters = () => {
    toast.success('Filters panel opened!')
    // TODO: Implement filters modal/panel
    console.log('Opening filters panel')
  }

  const exportAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics/export?timeRange=${timeRange}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `analytics_export_${timeRange}_${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Analytics data exported successfully!')
      } else {
        toast.error('Failed to export analytics data')
      }
    } catch (error) {
      toast.error('Failed to export analytics data')
    }
  }

  const exportAnalyticsAsCSV = async () => {
    try {
      const { exportAnalyticsAsCSV } = await import('@/lib/csv-export')
      exportAnalyticsAsCSV(analyticsData, `analytics_export_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`)
    } catch (error) {
      toast.error('Failed to export analytics data as CSV')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text-admin mb-2">
            Business Intelligence Hub 📊
          </h1>
          <p className="text-white/70 text-lg">
            Advanced analytics, insights, and performance metrics for data-driven decisions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button 
            onClick={showFilters}
            className="btn-secondary-premium px-4 py-2 text-sm"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <div className="relative group">
            <button 
              onClick={exportAnalytics}
              className="btn-secondary-premium px-4 py-2 text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <button
                onClick={exportAnalytics}
                className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export as JSON
              </button>
              <button
                onClick={exportAnalyticsAsCSV}
                className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export as CSV
              </button>
            </div>
          </div>
          <button 
            onClick={fetchAnalyticsData}
            className="btn-premium px-4 py-2 text-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="premium-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <div className={`flex items-center space-x-1 ${getGrowthColor(analyticsData.revenueGrowth)}`}>
              {getGrowthIcon(analyticsData.revenueGrowth)}
              <span className="text-sm font-medium">{Math.abs(analyticsData.revenueGrowth)}%</span>
            </div>
          </div>
          <h3 className="text-white font-semibold mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold text-emerald-400 mb-1">
            {formatCurrency(analyticsData.totalRevenue)}
          </p>
          <p className="text-white/60 text-sm">vs last period</p>
        </div>

        <div className="premium-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div className={`flex items-center space-x-1 ${getGrowthColor(analyticsData.userGrowth)}`}>
              {getGrowthIcon(analyticsData.userGrowth)}
              <span className="text-sm font-medium">{Math.abs(analyticsData.userGrowth)}%</span>
            </div>
          </div>
          <h3 className="text-white font-semibold mb-2">Total Users</h3>
          <p className="text-2xl font-bold text-blue-400 mb-1">
            {formatNumber(analyticsData.totalUsers)}
          </p>
          <p className="text-white/60 text-sm">active users</p>
        </div>

        <div className="premium-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
              <Package className="w-6 h-6 text-purple-400" />
            </div>
            <div className={`flex items-center space-x-1 ${getGrowthColor(analyticsData.orderGrowth)}`}>
              {getGrowthIcon(analyticsData.orderGrowth)}
              <span className="text-sm font-medium">{Math.abs(analyticsData.orderGrowth)}%</span>
            </div>
          </div>
          <h3 className="text-white font-semibold mb-2">Total Orders</h3>
          <p className="text-2xl font-bold text-purple-400 mb-1">
            {formatNumber(analyticsData.totalOrders)}
          </p>
          <p className="text-white/60 text-sm">completed orders</p>
        </div>

        <div className="premium-card p-6 hover-lift">
              <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
              <Target className="w-6 h-6 text-orange-400" />
                </div>
            <div className={`flex items-center space-x-1 ${getGrowthColor(analyticsData.conversionGrowth)}`}>
              {getGrowthIcon(analyticsData.conversionGrowth)}
              <span className="text-sm font-medium">{Math.abs(analyticsData.conversionGrowth)}%</span>
                </div>
          </div>
          <h3 className="text-white font-semibold mb-2">Conversion Rate</h3>
          <p className="text-2xl font-bold text-orange-400 mb-1">
            {analyticsData.conversionRate}%
          </p>
          <p className="text-white/60 text-sm">visitor to customer</p>
              </div>
              
        <div className="premium-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-xl flex items-center justify-center border border-yellow-500/30">
              <ShoppingBag className="w-6 h-6 text-yellow-400" />
            </div>
            <div className={`flex items-center space-x-1 ${getGrowthColor(analyticsData.aovGrowth)}`}>
              {getGrowthIcon(analyticsData.aovGrowth)}
              <span className="text-sm font-medium">{Math.abs(analyticsData.aovGrowth)}%</span>
            </div>
          </div>
          <h3 className="text-white font-semibold mb-2">Avg Order Value</h3>
          <p className="text-2xl font-bold text-yellow-400 mb-1">
            ₹{analyticsData.avgOrderValue}
          </p>
          <p className="text-white/60 text-sm">per order</p>
              </div>
              
        <div className="premium-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
              <TrendingDown className="w-6 h-6 text-red-400" />
            </div>
            <div className={`flex items-center space-x-1 ${getGrowthColor(analyticsData.churnGrowth)}`}>
              {getGrowthIcon(analyticsData.churnGrowth)}
              <span className="text-sm font-medium">{Math.abs(analyticsData.churnGrowth)}%</span>
            </div>
          </div>
          <h3 className="text-white font-semibold mb-2">Churn Rate</h3>
          <p className="text-2xl font-bold text-red-400 mb-1">
            {analyticsData.churnRate}%
          </p>
          <p className="text-white/60 text-sm">monthly churn</p>
        </div>
      </div>

      {/* Main Chart */}
          <div className="premium-card">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center">
              <LineChart className="w-6 h-6 mr-3 text-blue-400" />
              Performance Trends
            </h3>
            <div className="flex items-center space-x-3">
              <div className="flex bg-white/10 rounded-lg p-1">
                {[
                  { key: 'revenue', label: 'Revenue', color: 'emerald' },
                  { key: 'users', label: 'Users', color: 'blue' },
                  { key: 'orders', label: 'Orders', color: 'purple' },
                  { key: 'conversions', label: 'Conversions', color: 'orange' }
                ].map((metric) => (
                  <button
                    key={metric.key}
                    onClick={() => setSelectedMetric(metric.key)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                      selectedMetric === metric.key
                        ? `bg-${metric.color}-500 text-white`
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {metric.label}
                  </button>
                ))}
              </div>
            </div>
                        </div>
                      </div>

        <div className="p-6">
          <div className="h-80 flex items-end space-x-1">
            {chartData.map((data, index) => {
              const value = data[selectedMetric as keyof ChartData] as number
              const height = (value / maxValue) * 100
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center group cursor-pointer"
                >
                  <div className="relative w-full">
                    <div
                      className={`w-full rounded-t-sm transition-all duration-500 group-hover:opacity-80 ${
                        selectedMetric === 'revenue' ? 'bg-gradient-to-t from-emerald-600 to-emerald-400' :
                        selectedMetric === 'users' ? 'bg-gradient-to-t from-blue-600 to-blue-400' :
                        selectedMetric === 'orders' ? 'bg-gradient-to-t from-purple-600 to-purple-400' :
                        'bg-gradient-to-t from-orange-600 to-orange-400'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      {new Date(data.date).toLocaleDateString()}: {
                        selectedMetric === 'revenue' ? formatCurrency(value) :
                        formatNumber(value)
                      }
                    </div>
                  </div>
                    </div>
                  )
                })}
          </div>
          <div className="flex justify-between mt-4 text-xs text-white/60">
            <span>{chartData[0]?.date}</span>
            <span>{chartData[chartData.length - 1]?.date}</span>
          </div>
        </div>
              </div>

      {/* Analytics Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Geographic Distribution */}
        <div className="premium-card">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-xl font-bold text-white flex items-center">
              <MapPin className="w-6 h-6 mr-3 text-green-400" />
              Geographic Performance
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {geographicData.map((region, index) => (
                <div key={region.region} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                      index === 1 ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                      index === 2 ? 'bg-gradient-to-br from-blue-400 to-cyan-500' :
                      index === 3 ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                      index === 4 ? 'bg-gradient-to-br from-red-400 to-rose-500' :
                      'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{region.region}</p>
                      <p className="text-white/60 text-sm">{formatNumber(region.users)} users</p>
                    </div>
                </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-bold">{formatCurrency(region.revenue)}</p>
                    <p className={`text-sm font-medium ${region.growth.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {region.growth}
                    </p>
                </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Device & Channel Analytics */}
        <div className="space-y-8">
          {/* Device Analytics */}
          <div className="premium-card">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Smartphone className="w-6 h-6 mr-3 text-blue-400" />
                Device Analytics
              </h3>
            </div>
            <div className="p-6">
            <div className="space-y-4">
                {deviceData.map((device, index) => (
                  <div key={device.device} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                        {device.device === 'Mobile' ? <Smartphone className="w-4 h-4 text-blue-400" /> :
                         device.device === 'Desktop' ? <Monitor className="w-4 h-4 text-blue-400" /> :
                         <Smartphone className="w-4 h-4 text-blue-400" />}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{device.device}</p>
                        <p className="text-white/60 text-sm">{device.percentage}% of traffic</p>
                    </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{formatNumber(device.users)}</p>
                      <p className="text-white/60 text-sm">{device.conversionRate}% CVR</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Channel Performance */}
          <div className="premium-card">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Globe className="w-6 h-6 mr-3 text-purple-400" />
                Channel Performance
              </h3>
            </div>
            <div className="p-6">
            <div className="space-y-4">
                {channelData.map((channel, index) => (
                  <div key={channel.channel} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                          {channel.channel === 'Instagram' ? <Instagram className="w-4 h-4 text-purple-400" /> :
                           channel.channel === 'WhatsApp' ? <MessageSquare className="w-4 h-4 text-purple-400" /> :
                           channel.channel === 'Email' ? <Mail className="w-4 h-4 text-purple-400" /> :
                           <Globe className="w-4 h-4 text-purple-400" />}
                        </div>
                        <span className="text-white font-semibold">{channel.channel}</span>
                      </div>
                    <div className="text-right">
                        <p className="text-emerald-400 font-bold">{formatCurrency(channel.revenue)}</p>
                        <p className="text-white/60 text-sm">{channel.roi > 0 ? `${channel.roi}%` : 'Free'} ROI</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-white/60">Users</p>
                        <p className="text-white font-medium">{formatNumber(channel.users)}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Conversions</p>
                        <p className="text-white font-medium">{channel.conversions}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Cost</p>
                        <p className="text-white font-medium">{channel.cost > 0 ? formatCurrency(channel.cost) : 'Free'}</p>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Activity */}
      <div className="premium-card">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Activity className="w-6 h-6 mr-3 text-green-400" />
              Real-time Activity
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Live</span>
        </div>
      </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-500/30">
                <Eye className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-blue-400 mb-1">247</p>
              <p className="text-white/60 text-sm">Active Users</p>
                </div>

            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
                <ShoppingBag className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-emerald-400 mb-1">23</p>
              <p className="text-white/60 text-sm">Orders (Last Hour)</p>
      </div>

            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-purple-500/30">
                <MessageSquare className="w-6 h-6 text-purple-400" />
          </div>
              <p className="text-2xl font-bold text-purple-400 mb-1">156</p>
              <p className="text-white/60 text-sm">AI Responses</p>
        </div>

            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-orange-500/30">
                <CreditCard className="w-6 h-6 text-orange-400" />
          </div>
              <p className="text-2xl font-bold text-orange-400 mb-1">₹67K</p>
              <p className="text-white/60 text-sm">Revenue (Today)</p>
        </div>
          </div>
        </div>
      </div>
    </div>
  )
}