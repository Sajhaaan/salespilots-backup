'use client'

import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Palette, 
  Zap, 
  Key, 
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Upload,
  Download,
  Trash2,
  Plus,
  Edit,
  CheckCircle,
  AlertTriangle,
  Info,
  Moon,
  Sun,
  Monitor,
  Camera,
  MessageSquare,
  Instagram,
  Phone,
  MapPin,
  Building,
  Users,
  Settings as SettingsIcon,
  BarChart3,
  FileText,
  ChevronRight,
  Sparkles,
  Star,
  Crown,
  Award,
  TrendingUp,
  Activity,
  Database,
  Cloud,
  Wifi,
  WifiOff,
  RefreshCw,
  ExternalLink,
  Copy,
  QrCode,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  X,
  Search,
  Filter,
  MoreVertical,
  Heart,
  Bookmark,
  Share2,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Settings2,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Switch,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Headphones,
  HeadphonesIcon,
  Calendar
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const settingsSections = [
  { 
    id: 'profile', 
    name: 'Profile', 
    icon: User, 
    description: 'Manage your personal information',
    color: 'from-blue-500 to-cyan-500',
    badge: null
  },
  { 
    id: 'notifications', 
    name: 'Notifications', 
    icon: Bell, 
    description: 'Configure notification preferences',
    color: 'from-orange-500 to-red-500',
    badge: '3'
  },
  { 
    id: 'security', 
    name: 'Security', 
    icon: Shield, 
    description: 'Password and security settings',
    color: 'from-green-500 to-emerald-500',
    badge: null
  },
  { 
    id: 'billing', 
    name: 'Billing', 
    icon: CreditCard, 
    description: 'Manage subscription and payments',
    color: 'from-purple-500 to-pink-500',
    badge: 'Premium'
  },
  { 
    id: 'integrations', 
    name: 'Integrations', 
    icon: Zap, 
    description: 'Connect external services',
    color: 'from-yellow-500 to-orange-500',
    badge: null
  },
  { 
    id: 'appearance', 
    name: 'Appearance', 
    icon: Palette, 
    description: 'Customize your interface',
    color: 'from-indigo-500 to-purple-500',
    badge: null
  },
  { 
    id: 'privacy', 
    name: 'Privacy', 
    icon: Lock, 
    description: 'Control your data and privacy',
    color: 'from-gray-500 to-slate-500',
    badge: null
  }
]

export default function SettingsPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState({
    name: 'Sajhan',
    email: 'sajhan@example.com',
    phone: '+91 98765 43210',
    timezone: 'Asia/Kolkata',
    avatar: null,
    plan: 'Premium',
    memberSince: 'Jan 2024',
    verified: true,
    businessName: 'SalesPilot Store',
    businessType: 'retail',
    businessAddress: '123 Business Street, Mumbai, Maharashtra, India'
  })
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    orders: true,
    payments: true,
    marketing: false,
    security: true,
    updates: true
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: 30,
    passwordExpiry: 90
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'dark',
    language: 'en',
    fontSize: 'medium',
    animations: true,
    compactMode: false
  })

  // Load user data on mount
  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/profile', { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUserData(prev => ({ ...prev, ...data.user }))
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
      toast.error('Failed to load user data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          toast.success('Profile updated successfully!')
        } else {
          toast.error(data.error || 'Failed to update profile')
        }
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save changes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all changes?')) {
      loadUserData()
      toast.success('Changes reset')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }))
  }

  // Enhanced section change handler with smooth transitions
  const handleSectionChange = (sectionId: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setActiveSection(sectionId)
      setIsLoading(false)
    }, 150)
  }

  // Filter sections based on search
  const filteredSections = settingsSections



  const renderProfileSection = () => (
    <div className="space-y-6">
      {/* Clean Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Profile Information</h2>
          <p className="text-white/60 text-sm mt-1">Manage your account details</p>
        </div>
        <div className="flex items-center space-x-2 text-green-400 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Auto-saved</span>
        </div>
      </div>

      {/* Clean Profile Card */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        {/* Avatar Section */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-semibold">
              {userData.name.charAt(0)}
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
              <Camera className="w-3 h-3 text-white" />
            </button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-1">
              <h3 className="text-lg font-semibold text-white">{userData.name}</h3>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full">
                {userData.plan}
              </span>
              {userData.verified && (
                <div className="flex items-center space-x-1 text-green-400 text-xs">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              )}
            </div>
            <p className="text-white/60 text-sm">Business Owner • Member since {userData.memberSince}</p>
          </div>
        </div>

        {/* Clean Form Fields */}
        <div className="space-y-6">
          <div>
            <h4 className="text-white font-medium mb-4">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Time Zone</label>
                <select 
                  value={userData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="border-t border-white/10 pt-6">
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <Building className="w-4 h-4 mr-2 text-purple-400" />
              Business Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-white/70 text-sm font-medium mb-2">Business Name</label>
                <input
                  type="text"
                  value={userData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all duration-200 group-hover:border-white/20"
                />
              </div>
              
              <div className="group">
                <label className="block text-white/70 text-sm font-medium mb-2">Business Type</label>
                <select 
                  value={userData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all duration-200 group-hover:border-white/20 appearance-none"
                >
                  <option value="retail">Retail Store</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="service">Service Provider</option>
                  <option value="marketplace">Marketplace</option>
                </select>
              </div>
              
              <div className="md:col-span-2 group">
                <label className="block text-white/70 text-sm font-medium mb-2">Business Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                  <textarea
                    value={userData.businessAddress}
                    onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all duration-200 group-hover:border-white/20 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
          <button 
            onClick={handleReset}
            className="text-white/60 hover:text-white text-sm transition-colors duration-200"
          >
            Reset to defaults
          </button>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleReset}
              className="px-4 py-2 text-white/70 hover:text-white text-sm transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white font-semibold">Profile Complete</p>
              <p className="text-white/60 text-sm">95% completed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-semibold">Account Status</p>
              <p className="text-green-400 text-sm">Verified</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-white font-semibold">Plan Usage</p>
              <p className="text-white/60 text-sm">67% used</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationsSection = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Notification Preferences</h2>
        <p className="text-white/70">Choose how you want to be notified about important events</p>
      </div>

      <div className="premium-card">
        <h3 className="text-lg font-semibold text-white mb-6">Notification Channels</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-white/60 text-sm">Receive notifications via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white font-medium">Push Notifications</p>
                <p className="text-white/60 text-sm">Get instant push notifications</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-white font-medium">SMS Notifications</p>
                <p className="text-white/60 text-sm">Receive important alerts via SMS</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) => setNotifications(prev => ({ ...prev, sms: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="premium-card">
        <h3 className="text-lg font-semibold text-white mb-6">Event Notifications</h3>
        
        <div className="space-y-4">
          {[
            { key: 'orders', label: 'New Orders', desc: 'Get notified when new orders are placed' },
            { key: 'payments', label: 'Payment Updates', desc: 'Alerts for payment confirmations and failures' },
            { key: 'marketing', label: 'Marketing Updates', desc: 'Product updates and promotional content' }
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors">
              <div>
                <p className="text-white font-medium">{item.label}</p>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[item.key as keyof typeof notifications]}
                  onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSecuritySection = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Security Settings</h2>
        <p className="text-white/70">Manage your account security and authentication</p>
      </div>

      <div className="premium-card">
        <h3 className="text-lg font-semibold text-white mb-6">Password</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-12"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Confirm new password"
            />
          </div>
          <button className="btn-premium px-6 py-3">
            Update Password
          </button>
        </div>
      </div>

      <div className="premium-card">
        <h3 className="text-lg font-semibold text-white mb-6">Two-Factor Authentication</h3>
        
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-white font-medium">SMS Authentication</p>
              <p className="text-white/60 text-sm">Add an extra layer of security to your account</p>
            </div>
          </div>
          <button className="btn-secondary-premium px-4 py-2 text-sm">
            Enable 2FA
          </button>
        </div>
      </div>

      <div className="premium-card">
        <h3 className="text-lg font-semibold text-white mb-6">API Keys</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <p className="text-white font-medium">Production API Key</p>
              <p className="text-white/60 text-sm font-mono">sk_live_**********************</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Eye className="w-4 h-4 text-white/70" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Edit className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <p className="text-white font-medium">Test API Key</p>
              <p className="text-white/60 text-sm font-mono">sk_test_**********************</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Eye className="w-4 h-4 text-white/70" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Edit className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </div>

          <button className="btn-secondary-premium px-4 py-2 text-sm">
            <Plus className="w-4 h-4 mr-2" />
            Generate New Key
          </button>
        </div>
      </div>
    </div>
  )

  const renderIntegrationsSection = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Integrations</h2>
        <p className="text-white/70">Connect your social media accounts and third-party services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="premium-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Instagram className="w-8 h-8 text-pink-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Instagram</h3>
                <p className="text-white/60 text-sm">Connect your Instagram business account</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Connected</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Account</span>
              <span className="text-white">@salespilot_store</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Followers</span>
              <span className="text-white">12.5K</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Last Sync</span>
              <span className="text-white">2 mins ago</span>
            </div>
          </div>
          <button className="w-full btn-secondary-premium py-2 text-sm mt-4">
            Manage Connection
          </button>
        </div>

        <div className="premium-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">WhatsApp Business</h3>
                <p className="text-white/60 text-sm">Connect WhatsApp Business API</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Connected</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Number</span>
              <span className="text-white">+91 98765 43210</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Status</span>
              <span className="text-green-400">Verified</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Messages Today</span>
              <span className="text-white">247</span>
            </div>
          </div>
          <button className="w-full btn-secondary-premium py-2 text-sm mt-4">
            Manage Connection
          </button>
        </div>

        <div className="premium-card opacity-60">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">f</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Facebook</h3>
                <p className="text-white/60 text-sm">Connect your Facebook page</p>
              </div>
            </div>
            <span className="text-green-400 text-sm font-medium">Available</span>
          </div>
          <button className="w-full btn-secondary-premium py-2 text-sm opacity-50 cursor-not-allowed">
            Connect Account
          </button>
        </div>

        <div className="premium-card opacity-60">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">YouTube</h3>
                <p className="text-white/60 text-sm">Connect your YouTube channel</p>
              </div>
            </div>
            <span className="text-green-400 text-sm font-medium">Available</span>
          </div>
          <button className="w-full btn-secondary-premium py-2 text-sm opacity-50 cursor-not-allowed">
            Connect Account
          </button>
        </div>
      </div>
    </div>
  )

  const renderBillingSection = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Billing & Subscription</h2>
        <p className="text-white/70">Manage your subscription and billing information</p>
      </div>

      {/* Current Plan */}
      <div className="premium-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Current Plan</h3>
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold gradient-text-primary">Premium Plan</span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full border border-blue-500/30">Active</span>
            </div>
            <p className="text-white/60 text-sm mt-2">Unlimited automation workflows and priority support</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">₹2,999</p>
            <p className="text-white/60 text-sm">per month</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <p className="text-2xl font-bold text-white">Unlimited</p>
            <p className="text-white/60 text-sm">Automated DMs</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <p className="text-2xl font-bold text-white">5</p>
            <p className="text-white/60 text-sm">Social Accounts</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <p className="text-2xl font-bold text-white">Priority</p>
            <p className="text-white/60 text-sm">Support</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="btn-secondary-premium px-6 py-3">
            Change Plan
          </button>
          <button className="btn-secondary-premium px-6 py-3">
            View Usage
          </button>
        </div>
      </div>

      {/* Payment Method */}
      <div className="premium-card">
        <h3 className="text-lg font-semibold text-white mb-6">Payment Method</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border-2 border-blue-500/30">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Visa ending in 4242</p>
                <p className="text-white/60 text-sm">Expires 12/25</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">Primary</span>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">Edit</button>
            </div>
          </div>

          <button className="w-full p-4 border-2 border-dashed border-white/20 rounded-xl hover:border-white/40 transition-colors text-white/70 hover:text-white">
            <Plus className="w-5 h-5 mx-auto mb-2" />
            Add Payment Method
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div className="premium-card">
        <h3 className="text-lg font-semibold text-white mb-6">Billing History</h3>
        
        <div className="space-y-4">
          {[
            { date: '2024-01-15', amount: '₹2,999', status: 'Paid', invoice: 'INV-001' },
            { date: '2023-12-15', amount: '₹2,999', status: 'Paid', invoice: 'INV-002' },
            { date: '2023-11-15', amount: '₹2,999', status: 'Paid', invoice: 'INV-003' }
          ].map((bill, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{bill.invoice}</p>
                  <p className="text-white/60 text-sm">{bill.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-white font-medium">{bill.amount}</p>
                  <p className="text-green-400 text-sm">{bill.status}</p>
                </div>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderAppearanceSection = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Appearance</h2>
        <p className="text-white/70">Customize the look and feel of your dashboard</p>
      </div>

      {/* Theme Settings */}
      <div className="premium-card">
        <h3 className="text-lg font-semibold text-white mb-6">Theme</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative group cursor-pointer">
            <div className="p-4 bg-gradient-to-br from-gray-900 to-black rounded-xl border-2 border-blue-500/50 group-hover:border-blue-400 transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <Moon className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">Dark</span>
                <CheckCircle className="w-4 h-4 text-blue-400 ml-auto" />
              </div>
              <div className="h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg"></div>
            </div>
          </div>

          <div className="relative group cursor-pointer opacity-60">
            <div className="p-4 bg-gradient-to-br from-gray-100 to-white rounded-xl border-2 border-white/20 group-hover:border-white/40 transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <Sun className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-800 font-medium">Light</span>
              </div>
              <div className="h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg"></div>
            </div>
            <span className="absolute top-2 right-2 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">Soon</span>
          </div>

          <div className="relative group cursor-pointer opacity-60">
            <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-white/20 group-hover:border-white/40 transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <Monitor className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">Auto</span>
              </div>
              <div className="h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg"></div>
            </div>
            <span className="absolute top-2 right-2 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">Soon</span>
          </div>
        </div>
      </div>

      {/* Color Scheme */}
      <div className="premium-card">
        <h3 className="text-lg font-semibold text-white mb-6">Accent Color</h3>
        
        <div className="grid grid-cols-6 gap-4">
          {[
            { name: 'Blue', color: 'from-blue-500 to-cyan-500', active: true },
            { name: 'Purple', color: 'from-purple-500 to-pink-500', active: false },
            { name: 'Green', color: 'from-green-500 to-emerald-500', active: false },
            { name: 'Orange', color: 'from-orange-500 to-red-500', active: false },
            { name: 'Indigo', color: 'from-indigo-500 to-purple-500', active: false },
            { name: 'Teal', color: 'from-teal-500 to-cyan-500', active: false }
          ].map((scheme, index) => (
            <div key={index} className="relative group cursor-pointer">
              <div className={`w-full h-16 bg-gradient-to-br ${scheme.color} rounded-xl border-2 ${scheme.active ? 'border-white/50' : 'border-white/20'} group-hover:border-white/40 transition-colors`}>
                {scheme.active && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <p className="text-white/70 text-sm text-center mt-2">{scheme.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Display Settings */}
      <div className="premium-card">
        <h3 className="text-lg font-semibold text-white mb-6">Display Settings</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Compact Mode</p>
              <p className="text-white/60 text-sm">Reduce spacing and show more content</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Animations</p>
              <p className="text-white/60 text-sm">Enable smooth transitions and hover effects</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Reduced Motion</p>
              <p className="text-white/60 text-sm">Minimize animations for better accessibility</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPrivacySection = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Privacy Settings</h2>
        <p className="text-white/70">Control your data privacy and sharing preferences</p>
      </div>

      {/* Data Collection */}
      <div className="premium-card">
        <h3 className="text-lg font-semibold text-white mb-6">Data Collection</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-medium">Analytics Data</p>
                <p className="text-white/60 text-sm">Help us improve by sharing usage analytics</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white font-medium">Marketing Communications</p>
                <p className="text-white/60 text-sm">Receive product updates and promotional content</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-white font-medium">Third-party Integrations</p>
                <p className="text-white/60 text-sm">Allow connected apps to access your data</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Data Export */}
      <div className="premium-card">
        <h3 className="text-lg font-semibold text-white mb-6">Data Management</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-medium">Export Data</p>
                <p className="text-white/60 text-sm">Download all your data in JSON format</p>
              </div>
            </div>
            <div className="relative group">
              <button className="btn-secondary-premium px-4 py-2 text-sm">
                Request Export
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-white/20 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <button 
                    onClick={async () => {
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
                          a.download = `user_data_export_${new Date().toISOString().split('T')[0]}.json`
                          document.body.appendChild(a)
                          a.click()
                          window.URL.revokeObjectURL(url)
                          document.body.removeChild(a)
                          toast.success('Data exported as JSON successfully!')
                        } else {
                          toast.error('Failed to export data')
                        }
                      } catch (error) {
                        toast.error('Failed to export data')
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
                        const response = await fetch('/api/dashboard/export', {
                          method: 'GET',
                          headers: { 'Content-Type': 'application/json' }
                        })

                        if (response.ok) {
                          const data = await response.json()
                          const { exportUsersAsCSV } = await import('@/lib/csv-export')
                          exportUsersAsCSV(data.data.orders || [], `user_data_report_${new Date().toISOString().split('T')[0]}.csv`)
                        } else {
                          toast.error('Failed to export data')
                        }
                      } catch (error) {
                        toast.error('Failed to export data')
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
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <Trash2 className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-white font-medium">Delete Account</p>
                <p className="text-white/60 text-sm">Permanently delete your account and all data</p>
              </div>
            </div>
            <button 
              onClick={async () => {
                const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.')
                if (confirmed) {
                  try {
                    const response = await fetch('/api/user/delete-account', {
                      method: 'DELETE',
                      credentials: 'include'
                    })
                    
                    if (response.ok) {
                      toast.success('Account deleted successfully. You will be redirected to the home page.')
                      window.location.href = '/'
                    } else {
                      toast.error('Failed to delete account. Please try again.')
                    }
                  } catch (error) {
                    toast.error('Failed to delete account. Please try again.')
                  }
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy */}
      <div className="premium-card">
        <h3 className="text-lg font-semibold text-white mb-6">Legal & Compliance</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white font-medium">Privacy Policy</p>
                <p className="text-white/60 text-sm">Last updated: January 15, 2024</p>
              </div>
            </div>
            <button 
              onClick={() => window.open('/privacy', '_blank')}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              View Policy
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-white font-medium">Terms of Service</p>
                <p className="text-white/60 text-sm">Last updated: January 15, 2024</p>
              </div>
            </div>
            <button 
              onClick={() => window.open('/terms', '_blank')}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              View Terms
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection()
      case 'notifications':
        return renderNotificationsSection()
      case 'security':
        return renderSecuritySection()
      case 'billing':
        return renderBillingSection()
      case 'integrations':
        return renderIntegrationsSection()
      case 'appearance':
        return renderAppearanceSection()
      case 'privacy':
        return renderPrivacySection()
      default:
        return (
          <div className="premium-card p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Section: {activeSection}</h2>
            <p className="text-white/70">This section is under development</p>
          </div>
        )
    }
  }

  return (
    <div className="p-6 pb-20 max-w-6xl mx-auto">
      {/* Clean Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Settings</h1>
            <p className="text-white/60 text-sm mt-1">Manage your account preferences</p>
          </div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 text-white/70 hover:text-white transition-colors text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Clean Settings Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 sticky top-6">
            <nav className="space-y-1">
              {filteredSections.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                      isActive
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{section.name}</span>
                    {section.badge && (
                      <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${
                        section.badge === 'Premium' 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {section.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Clean Settings Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white/5 border border-white/10 rounded-lg">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-5 h-5 border-2 border-white/30 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="p-6">
                {renderSection()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}