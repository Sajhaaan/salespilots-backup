'use client'

import { 
  Search, 
  Filter, 
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  MoreHorizontal,
  CreditCard,
  Smartphone,
  Banknote,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  FileText,
  Calendar,
  IndianRupee,
  Zap,
  Camera,
  MessageSquare
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface Payment {
  id: string
  order_id: string
  customer_name: string
  amount: number
  payment_method: string
  payment_provider: string
  status: string
  transaction_id: string
  created_at: string
  screenshot_url?: string
  verified: boolean
  notes?: string
}

const statusColors = {
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  pending: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  refunded: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
}

const statusIcons = {
  completed: CheckCircle,
  pending: Clock,
  failed: XCircle,
  refunded: RefreshCw
}

const paymentMethods = {
  UPI: { icon: Smartphone, color: 'text-green-400' },
  'Credit Card': { icon: CreditCard, color: 'text-blue-400' },
  'Bank Transfer': { icon: Banknote, color: 'text-purple-400' }
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/payments')
      const data = await response.json()
      
      if (data.success) {
        setPayments(data.payments)
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPayments = (payments || []).filter(payment => {
    const customerName = payment.customer_name || ''
    const paymentId = payment.id || ''
    const transactionId = payment.transaction_id || ''
    
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    const matchesMethod = methodFilter === 'all' || payment.payment_method === methodFilter
    return matchesSearch && matchesStatus && matchesMethod
  })

  const totalRevenue = (payments || []).filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0)
  const pendingAmount = (payments || []).filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0)
  const failedAmount = (payments || []).filter(p => p.status === 'failed').reduce((sum, p) => sum + (p.amount || 0), 0)
  const verificationRate = payments.length > 0 ? (((payments || []).filter(p => p.verified).length / payments.length) * 100).toFixed(1) : '0'

  const openPaymentModal = (payment: Payment) => {
    setSelectedPayment(payment)
    setShowPaymentModal(true)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-white/5 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="premium-card animate-pulse">
              <div className="h-16 bg-white/5 rounded mb-4"></div>
              <div className="h-4 bg-white/5 rounded mb-2"></div>
              <div className="h-4 bg-white/5 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Payments Dashboard</h1>
          <p className="text-white/70">Track and manage payment transactions</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => alert('Upload receipt functionality will be implemented soon!')}
            className="btn-secondary-premium px-4 py-2 text-sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Receipt
          </button>
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
                      const response = await fetch('/api/payments/export', {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                      })

                      if (response.ok) {
                        const blob = await response.blob()
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `payments_export_${new Date().toISOString().split('T')[0]}.json`
                        document.body.appendChild(a)
                        a.click()
                        window.URL.revokeObjectURL(url)
                        document.body.removeChild(a)
                        alert('Payments exported as JSON successfully!')
                      } else {
                        alert('Failed to export payments')
                      }
                    } catch (error) {
                      alert('Failed to export payments')
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
                      const response = await fetch('/api/payments/export', {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                      })

                      if (response.ok) {
                        const data = await response.json()
                        const { exportPaymentsAsCSV } = await import('@/lib/csv-export')
                        exportPaymentsAsCSV(data.data.payments, `payments_report_${new Date().toISOString().split('T')[0]}.csv`)
                      } else {
                        alert('Failed to export payments')
                      }
                    } catch (error) {
                      alert('Failed to export payments')
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
            onClick={() => alert('AI verification functionality will be implemented soon!')}
            className="btn-premium px-4 py-2 text-sm"
          >
            <Zap className="w-4 h-4 mr-2" />
            AI Verify
          </button>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="premium-card hover-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex items-center text-sm text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12.5%
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">₹{totalRevenue.toLocaleString()}</h3>
            <p className="text-white/60 text-sm">Total Revenue</p>
          </div>
        </div>

        <div className="premium-card hover-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <div className="flex items-center text-sm text-orange-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              +5.2%
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">₹{pendingAmount.toLocaleString()}</h3>
            <p className="text-white/60 text-sm">Pending Payments</p>
          </div>
        </div>

        <div className="premium-card hover-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/30">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex items-center text-sm text-red-400">
              <TrendingDown className="w-4 h-4 mr-1" />
              -2.1%
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">₹{failedAmount.toLocaleString()}</h3>
            <p className="text-white/60 text-sm">Failed Payments</p>
          </div>
        </div>

        <div className="premium-card hover-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex items-center text-sm text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              {verificationRate}%
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">AI Verified</h3>
            <p className="text-white/60 text-sm">Auto Verification</p>
          </div>
        </div>
      </div>

      {/* AI Payment Verification Panel */}
      <div className="premium-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Payment Verification</h2>
              <p className="text-white/60 text-sm">Automatically verify UPI screenshots and payment confirmations</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Screenshot Analysis</h3>
            <p className="text-white/60 text-sm">AI analyzes payment screenshots to extract transaction details</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Auto Verification</h3>
            <p className="text-white/60 text-sm">Automatically verifies payment authenticity and amount</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">WhatsApp Alerts</h3>
            <p className="text-white/60 text-sm">Instant notifications for successful payment verifications</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="premium-card">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                type="text"
                placeholder="Search payments, customers..."
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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            {/* Method Filter */}
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white/70 hover:text-white">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
            <button className="flex items-center px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white/70 hover:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 text-white/70 font-medium">Payment ID</th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Customer</th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Amount</th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Method</th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Verification</th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Date</th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="text-white/60">
                      <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-40" />
                      <p className="text-lg font-medium mb-2">No payments found</p>
                      <p className="text-sm">Payment records will appear here once transactions are made.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment, index) => {
                  const StatusIcon = statusIcons[payment.status as keyof typeof statusIcons] || Clock
                  const PaymentMethod = paymentMethods[payment.payment_method as keyof typeof paymentMethods]
                  const PaymentIcon = PaymentMethod?.icon || CreditCard
                  
                  return (
                    <tr key={payment.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors animate-fade-in-up stagger-${index + 1}`}>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-white">{payment.id}</p>
                          <p className="text-sm text-white/60">Order: {payment.order_id}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {payment.customer_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-white">{payment.customer_name}</p>
                            <p className="text-sm text-white/60">{payment.transaction_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-white text-lg">₹{payment.amount.toLocaleString()}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <PaymentIcon className={`w-5 h-5 ${PaymentMethod?.color || 'text-white/60'}`} />
                          <div>
                            <p className="font-medium text-white">{payment.payment_method}</p>
                            <p className="text-sm text-white/60">{payment.payment_provider}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${statusColors[payment.status as keyof typeof statusColors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          {payment.screenshot_url && (
                            <div className="flex items-center space-x-1 text-blue-400">
                              <Camera className="w-4 h-4" />
                              <span className="text-xs">Screenshot</span>
                            </div>
                          )}
                          {payment.verified ? (
                            <div className="flex items-center space-x-1 text-green-400">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-xs">AI Verified</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-orange-400">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="text-xs">Manual Review</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-white">{new Date(payment.created_at).toLocaleDateString()}</p>
                        <p className="text-sm text-white/60">{new Date(payment.created_at).toLocaleTimeString()}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => openPaymentModal(payment)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            <Eye className="w-4 h-4 text-white/70" />
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                            <FileText className="w-4 h-4 text-white/70" />
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
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
      </div>

      {/* Payment Detail Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)} />
          <div className="relative glass-card border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Payment Details</h2>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <XCircle className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Payment Status */}
              <div className="text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  selectedPayment.status === 'completed' ? 'bg-green-500/20 border-2 border-green-500/30' :
                  selectedPayment.status === 'pending' ? 'bg-orange-500/20 border-2 border-orange-500/30' :
                  selectedPayment.status === 'failed' ? 'bg-red-500/20 border-2 border-red-500/30' :
                  'bg-blue-500/20 border-2 border-blue-500/30'
                }`}>
                  {selectedPayment.status === 'completed' && <CheckCircle className="w-10 h-10 text-green-400" />}
                  {selectedPayment.status === 'pending' && <Clock className="w-10 h-10 text-orange-400" />}
                  {selectedPayment.status === 'failed' && <XCircle className="w-10 h-10 text-red-400" />}
                  {selectedPayment.status === 'refunded' && <RefreshCw className="w-10 h-10 text-blue-400" />}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">₹{selectedPayment.amount.toLocaleString()}</h3>
                <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${statusColors[selectedPayment.status as keyof typeof statusColors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                  {selectedPayment.status.toUpperCase()}
                </span>
              </div>

              {/* Payment Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-1">Payment ID</p>
                  <p className="text-white font-medium">{selectedPayment.id}</p>
                </div>
                <div className="border border-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-1">Order ID</p>
                  <p className="text-white font-medium">{selectedPayment.order_id}</p>
                </div>
                <div className="border border-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-1">Customer</p>
                  <p className="text-white font-medium">{selectedPayment.customer_name}</p>
                </div>
                <div className="border border-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-1">Method</p>
                  <p className="text-white font-medium">{selectedPayment.payment_method}</p>
                </div>
                <div className="border border-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-1">Provider</p>
                  <p className="text-white font-medium">{selectedPayment.payment_provider}</p>
                </div>
                <div className="border border-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-1">Transaction ID</p>
                  <p className="text-white font-medium text-sm">{selectedPayment.transaction_id}</p>
                </div>
              </div>

              {/* Verification Status */}
              <div className="border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-semibold">Verification Status</h4>
                  {selectedPayment.verified ? (
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">AI Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-orange-400">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="text-sm font-medium">Manual Review Required</span>
                    </div>
                  )}
                </div>
                {selectedPayment.notes && (
                  <p className="text-white/70 text-sm">{selectedPayment.notes}</p>
                )}
              </div>

              {/* Screenshot Section */}
              {selectedPayment.screenshot_url && (
                <div className="border border-white/10 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3">Payment Screenshot</h4>
                  <div className="aspect-video bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-white/40 mx-auto mb-2" />
                      <p className="text-white/60 text-sm">Screenshot Available</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="btn-premium flex-1 py-3">
                  Mark as Verified
                </button>
                <button className="btn-secondary-premium flex-1 py-3">
                  Request Refund
                </button>
                <button className="btn-secondary-premium px-4 py-3">
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}