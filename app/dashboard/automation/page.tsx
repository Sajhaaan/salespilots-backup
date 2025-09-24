'use client'

import { 
  Zap, 
  MessageSquare, 
  Camera, 
  CreditCard, 
  Package, 
  Clock, 
  Play, 
  Pause, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle,
  AlertTriangle,
  Bot,
  Globe,
  Smartphone,
  Instagram,
  MessageCircle,
  Languages,
  Cpu,
  Activity,
  Target,
  Filter
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface Workflow {
  id: string
  name: string
  description: string
  status: string
  triggers: number
  success: number
  languages: string[]
  lastRun: string
  category: string
  performance: number
}

interface AutomationStat {
  name: string
  value: string
  icon: string
  color: string
  change: string
}

const categoryColors = {
  messaging: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  payments: 'bg-green-500/20 text-green-400 border-green-500/30',
  products: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  orders: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  support: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
}

const statusColors = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  paused: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
}

export default function AutomationPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [showWorkflowModal, setShowWorkflowModal] = useState(false)
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [automationStats, setAutomationStats] = useState<AutomationStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/automation/workflows')
      const data = await response.json()
      
      if (data.success) {
        setWorkflows(data.workflows || [])
        setAutomationStats(data.stats || [])
      } else {
        console.error('API returned error:', data.error)
        setWorkflows([])
        setAutomationStats([])
      }
    } catch (error) {
      console.error('Failed to fetch workflows:', error)
      setWorkflows([])
      setAutomationStats([])
    } finally {
      setLoading(false)
    }
  }

  const filteredWorkflows = (workflows || []).filter(workflow => 
    selectedCategory === 'all' || workflow.category === selectedCategory
  )

  const openWorkflowModal = (workflow: Workflow | null) => {
    setSelectedWorkflow(workflow)
    setShowWorkflowModal(true)
  }

  const createNewWorkflow = () => {
    setSelectedWorkflow({
      id: '',
      name: '',
      description: '',
      status: 'draft',
      category: 'messaging',
      languages: [],
      triggers: 0,
      success: 0,
      performance: 0,
      lastRun: 'Never'
    })
    setShowWorkflowModal(true)
  }

  const getStatIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Bot,
      CheckCircle,
      Languages,
      Clock
    }
    return icons[iconName] || Bot
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
          <h1 className="text-3xl font-bold text-white mb-2">AI Automation Center</h1>
          <p className="text-white/70">Configure and monitor your AI-powered automation workflows</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="btn-secondary-premium px-4 py-2 text-sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </button>
          <button onClick={createNewWorkflow} className="btn-premium px-4 py-2 text-sm">
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </button>
        </div>
      </div>

      {/* Automation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {(automationStats || []).map((stat, index) => {
          const Icon = getStatIcon(stat.icon)
          return (
            <div key={stat.name} className={`premium-card hover-glow animate-fade-in-up stagger-${index + 1}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/20 border border-${stat.color}-500/30`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <div className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : stat.change.startsWith('-') ? 'text-red-400' : 'text-blue-400'}`}>
                  {stat.change}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-white/60 text-sm">{stat.name}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* AI Capabilities Overview */}
      <div className="premium-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
              <Cpu className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Capabilities</h2>
              <p className="text-white/60 text-sm">Powerful AI features for your business automation</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">All Systems Operational</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Natural Language Processing</h3>
            <p className="text-white/60 text-sm">Understands and responds in multiple Indian languages</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Camera className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Computer Vision</h3>
            <p className="text-white/60 text-sm">Analyzes images, screenshots, and product photos</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Smart Automation</h3>
            <p className="text-white/60 text-sm">Context-aware decision making and workflow execution</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Real-time Processing</h3>
            <p className="text-white/60 text-sm">Instant responses and lightning-fast processing</p>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="premium-card">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            All Categories
          </button>
          <button
            onClick={() => setSelectedCategory('messaging')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === 'messaging'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 mr-2 inline" />
            Messaging
          </button>
          <button
            onClick={() => setSelectedCategory('payments')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === 'payments'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4 mr-2 inline" />
            Payments
          </button>
          <button
            onClick={() => setSelectedCategory('products')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === 'products'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4 mr-2 inline" />
            Products
          </button>
          <button
            onClick={() => setSelectedCategory('orders')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === 'orders'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4 mr-2 inline" />
            Orders
          </button>
        </div>
      </div>

      {/* Workflows Grid */}
      {filteredWorkflows.length === 0 ? (
        <div className="premium-card">
          <div className="py-12 text-center">
            <div className="text-white/60">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium mb-2">No workflows found</p>
              <p className="text-sm">Create your first automation workflow to get started.</p>
              <button 
                onClick={createNewWorkflow}
                className="btn-premium mt-4 px-6 py-3"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Workflow
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(filteredWorkflows || []).map((workflow, index) => (
            <div key={workflow.id} className={`premium-card hover-lift group animate-fade-in-up stagger-${index + 1}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    workflow.category === 'messaging' ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20' :
                    workflow.category === 'payments' ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20' :
                    workflow.category === 'products' ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20' :
                    workflow.category === 'orders' ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20' :
                    'bg-gradient-to-br from-pink-500/20 to-rose-500/20'
                  }`}>
                    {workflow.category === 'messaging' && <MessageSquare className="w-6 h-6 text-blue-400" />}
                    {workflow.category === 'payments' && <CreditCard className="w-6 h-6 text-green-400" />}
                    {workflow.category === 'products' && <Package className="w-6 h-6 text-purple-400" />}
                    {workflow.category === 'orders' && <Package className="w-6 h-6 text-orange-400" />}
                    {workflow.category === 'support' && <Users className="w-6 h-6 text-pink-400" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{workflow.name}</h3>
                    <p className="text-white/60 text-sm">{workflow.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${statusColors[workflow.status as keyof typeof statusColors]}`}>
                    {workflow.status === 'active' && <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />}
                    {workflow.status === 'paused' && <Pause className="w-3 h-3 mr-1" />}
                    {workflow.status === 'draft' && <Edit className="w-3 h-3 mr-1" />}
                    {workflow.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{workflow.triggers}</p>
                    <p className="text-white/60 text-xs">Triggers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{workflow.success}</p>
                    <p className="text-white/60 text-xs">Success</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{workflow.performance}%</p>
                    <p className="text-white/60 text-xs">Accuracy</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" 
                    style={{ width: `${workflow.performance}%` }}
                  ></div>
                </div>

                {/* Languages */}
                <div className="flex flex-wrap gap-2">
                  {(workflow.languages || []).map(lang => (
                    <span key={lang} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>

                {/* Last Run */}
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>Last run: {workflow.lastRun}</span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => openWorkflowModal(workflow)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-white/70" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                      <Settings className="w-4 h-4 text-white/70" />
                    </button>
                    <button className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                      workflow.status === 'active' 
                        ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400' 
                        : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                    }`}>
                      {workflow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Setup Templates */}
      <div className="premium-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Quick Setup Templates</h2>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">View All Templates</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Instagram className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Instagram Store Setup</h3>
            <p className="text-white/60 text-sm mb-4">Complete automation for Instagram-based stores with DM handling, payment verification, and order processing.</p>
            <button className="btn-premium w-full py-2 text-sm">
              Use Template
            </button>
          </div>

          <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">WhatsApp Business</h3>
            <p className="text-white/60 text-sm mb-4">Automated WhatsApp responses, catalog sharing, and customer support for business accounts.</p>
            <button className="btn-premium w-full py-2 text-sm">
              Use Template
            </button>
          </div>

          <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">AI Customer Support</h3>
            <p className="text-white/60 text-sm mb-4">Intelligent customer support bot with FAQ handling, ticket creation, and escalation management.</p>
            <button className="btn-premium w-full py-2 text-sm">
              Use Template
            </button>
          </div>
        </div>
      </div>

      {/* Workflow Detail Modal */}
      {showWorkflowModal && selectedWorkflow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowWorkflowModal(false)} />
          <div className="relative glass-card border border-white/20 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedWorkflow.id ? selectedWorkflow.name : 'Create New Workflow'}
              </h2>
              <button 
                onClick={() => setShowWorkflowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Trash2 className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Workflow Configuration */}
              <div className="space-y-6">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Workflow Name</label>
                  <input
                    type="text"
                    defaultValue={selectedWorkflow.name}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                
                <div>
                  <label className="block text-white/70 text-sm mb-2">Description</label>
                  <textarea
                    defaultValue={selectedWorkflow.description}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Category</label>
                    <select
                      defaultValue={selectedWorkflow.category}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="messaging">Messaging</option>
                      <option value="payments">Payments</option>
                      <option value="products">Products</option>
                      <option value="orders">Orders</option>
                      <option value="support">Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Status</label>
                    <select
                      defaultValue={selectedWorkflow.status}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Supported Languages</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Hindi', 'English', 'Tamil', 'Telugu', 'Marathi', 'Bengali'].map(lang => (
                      <label key={lang} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          defaultChecked={(selectedWorkflow.languages || []).includes(lang)}
                          className="rounded border-white/30 bg-white/10 text-blue-500" 
                        />
                        <span className="text-white/70 text-sm">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance & Analytics */}
              <div className="space-y-6">
                <div className="border border-white/10 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{selectedWorkflow.triggers}</p>
                      <p className="text-white/60 text-sm">Total Triggers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">{selectedWorkflow.success}</p>
                      <p className="text-white/60 text-sm">Successful</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-white/70 mb-2">
                      <span>Success Rate</span>
                      <span>{selectedWorkflow.performance}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" 
                        style={{ width: `${selectedWorkflow.performance}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="border border-white/10 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-4">Workflow Triggers</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="w-5 h-5 text-blue-400" />
                        <span className="text-white text-sm">New Instagram DM</span>
                      </div>
                      <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Camera className="w-5 h-5 text-purple-400" />
                        <span className="text-white text-sm">Image Upload</span>
                      </div>
                      <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-orange-400" />
                        <span className="text-white text-sm">Language Detection</span>
                      </div>
                      <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="btn-premium flex-1 py-3">
                    Save Workflow
                  </button>
                  <button className="btn-secondary-premium px-6 py-3">
                    Test Run
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}