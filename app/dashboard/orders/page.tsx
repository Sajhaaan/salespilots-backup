'use client'

import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  FileText
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Order {
  id: string
  customer: {
    name: string
    email: string
    phone: string
    avatar: string
    instagram_username?: string
  }
  product: {
    name: string
    id: string
  }
  total_amount: number
  status: string
  payment_status: string
  created_at: string
  shipping_address: string
  items: number
  tracking_id?: string
}

const statusColors = {
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  pending: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
}

const statusIcons = {
  completed: CheckCircle,
  processing: Clock,
  pending: AlertCircle,
  shipped: Truck,
  cancelled: X
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders')
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.length === filteredOrders.length 
        ? [] 
        : filteredOrders.map(order => order.id)
    )
  }

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-white/5 rounded w-1/2"></div>
        </div>
        <div className="premium-card">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white/5 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Orders Management</h1>
          <p className="text-white/70">Track, manage, and fulfill customer orders</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <button className="btn-secondary-premium px-4 py-2 text-sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-white/20 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/orders/export', {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                      })

                      if (response.ok) {
                        const blob = await response.blob()
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `orders_export_${new Date().toISOString().split('T')[0]}.json`
                        document.body.appendChild(a)
                        a.click()
                        window.URL.revokeObjectURL(url)
                        document.body.removeChild(a)
                        toast.success('Orders exported as JSON successfully!')
                      } else {
                        toast.error('Failed to export orders')
                      }
                    } catch (error) {
                      toast.error('Failed to export orders')
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
                      const response = await fetch('/api/orders/export', {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                      })

                      if (response.ok) {
                        const data = await response.json()
                        const { exportOrdersAsCSV } = await import('@/lib/csv-export')
                        exportOrdersAsCSV(data.data.orders, `orders_report_${new Date().toISOString().split('T')[0]}.csv`)
                      } else {
                        toast.error('Failed to export orders')
                      }
                    } catch (error) {
                      toast.error('Failed to export orders')
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
            onClick={() => router.push('/dashboard/products')}
            className="btn-premium px-4 py-2 text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="premium-card">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                type="text"
                placeholder="Search orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setSearchTerm('')}
              className="flex items-center px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white/70 hover:text-white"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
            <button 
              onClick={() => fetchOrders()}
              className="flex items-center px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white/70 hover:text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500/50"
                  />
                </th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Order</th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Customer</th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Product</th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Amount</th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Date</th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="text-white/60">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-40" />
                      <p className="text-lg font-medium mb-2">No orders found</p>
                      <p className="text-sm">Orders will appear here once customers start placing them.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => {
                  const StatusIcon = statusIcons[order.status as keyof typeof statusIcons] || AlertCircle
                  return (
                    <tr key={order.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors animate-fade-in-up stagger-${index + 1}`}>
                      <td className="py-4 px-6">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                          className="rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500/50"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-white">{order.id}</p>
                          {order.tracking_id && (
                            <p className="text-sm text-white/60">Track: {order.tracking_id}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {order.customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-white">{order.customer.name}</p>
                            <p className="text-sm text-white/60">{order.customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-white">{order.product.name}</p>
                          <p className="text-sm text-white/60">{order.items} item{order.items > 1 ? 's' : ''}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-white">₹{order.total_amount.toLocaleString()}</p>
                        <p className={`text-sm ${order.payment_status === 'paid' ? 'text-green-400' : order.payment_status === 'pending' ? 'text-orange-400' : 'text-red-400'}`}>
                          {order.payment_status}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${statusColors[order.status as keyof typeof statusColors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-white">{new Date(order.created_at).toLocaleDateString()}</p>
                        <p className="text-sm text-white/60">{order.shipping_address}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => openOrderModal(order)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            <Eye className="w-4 h-4 text-white/70" />
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                            <Edit className="w-4 h-4 text-white/70" />
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-red-500/20 transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-white/70" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
          <p className="text-white/60 text-sm">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white/70 hover:text-white text-sm">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 text-sm">
              1
            </button>
            <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white/70 hover:text-white text-sm">
              2
            </button>
            <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white/70 hover:text-white text-sm">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="glass-card border border-white/20 rounded-xl p-4 shadow-2xl animate-fade-in-up">
            <div className="flex items-center space-x-4">
              <span className="text-white font-medium">{selectedOrders.length} selected</span>
              <div className="w-px h-6 bg-white/20"></div>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors text-sm">
                  Mark Completed
                </button>
                <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors text-sm">
                  Update Status
                </button>
                <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm">
                  Cancel Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowOrderModal(false)} />
          <div className="relative glass-card border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Order Details</h2>
              <button 
                onClick={() => setShowOrderModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">Order ID</p>
                  <p className="text-white font-bold">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Status</p>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${statusColors[selectedOrder.status as keyof typeof statusColors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span className="text-white/70">{selectedOrder.customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-green-400" />
                    <span className="text-white/70">{selectedOrder.customer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-red-400" />
                    <span className="text-white/70">{selectedOrder.shipping_address}</span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Product Details</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{selectedOrder.product.name}</p>
                    <p className="text-white/60 text-sm">Quantity: {selectedOrder.items}</p>
                  </div>
                  <p className="text-2xl font-bold text-white">₹{selectedOrder.total_amount.toLocaleString()}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="btn-premium flex-1 py-3">
                  Update Status
                </button>
                <button className="btn-secondary-premium flex-1 py-3">
                  Send Message
                </button>
                <button className="btn-secondary-premium px-4 py-3">
                  <Package className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}