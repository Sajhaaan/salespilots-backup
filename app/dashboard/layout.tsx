"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  CreditCard, 
  Zap, 
  Settings, 
  Bell, 
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  HelpCircle,
  Plus,
  BarChart3,
  Brain,
  Upload
} from 'lucide-react'
import { useEffect, useState } from 'react'
import ChatbotWidget from '@/components/ChatbotWidget'
import MobileNav from '@/components/ui/mobile-nav'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, color: 'blue' },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag, color: 'emerald' },
  { name: 'Products', href: '/dashboard/products', icon: Package, color: 'purple' },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard, color: 'orange' },
      { name: 'QR & UPI Setup', href: '/dashboard/payment-upload', icon: Upload, color: 'green' },
  { name: 'Automation', href: '/dashboard/automation', icon: Zap, color: 'pink' },
  // { name: 'AI Setup', href: '/dashboard/ai-setup', icon: Brain, color: 'indigo' }, // temporarily hidden
  { name: 'Integrations', href: '/dashboard/integrations', icon: Plus, color: 'cyan' },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, color: 'gray' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [chatbotOpen, setChatbotOpen] = useState(false)
  const [dbUser, setDbUser] = useState<{ id: string; email: string } | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [headerStats, setHeaderStats] = useState<{ revenue: string; orders: number } | null>(null)

  // Mobile navigation items for bottom nav
  const mobileNavItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings }
  ]

  useEffect(() => {
    let mounted = true
    setAuthLoading(true)
    
    // Check localStorage first (fallback for Vercel cookie issues)
    const checkAuth = () => {
      console.log('🔍 Dashboard: Starting auth check...')
      
      // First, check localStorage for immediate feedback
      const localAuth = localStorage.getItem('sp_auth')
      const localUser = localStorage.getItem('sp_user')
      
      if (localAuth === 'true' && localUser) {
        try {
          const user = JSON.parse(localUser)
          console.log('✅ Dashboard: User found in localStorage:', user.email)
          setDbUser(user)
          setAuthLoading(false)
          // Still verify with server in background
          fetch('/api/auth/me', { 
            method: 'GET', 
            credentials: 'include', 
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache'
            }
          })
            .then(r => r.json())
            .then(res => {
              if (mounted && res?.ok && res?.user) {
                console.log('✅ Dashboard: Server confirmed authentication')
                setDbUser(res.user)
                fetchHeaderStats()
              } else if (mounted && !res?.ok) {
                console.log('⚠️ Dashboard: Server auth failed, but localStorage shows logged in')
                // Keep user logged in based on localStorage for now
                fetchHeaderStats()
              }
            })
            .catch(err => {
              console.log('⚠️ Dashboard: Server check failed, using localStorage:', err)
            })
          return
        } catch (e) {
          console.error('Error parsing localStorage user:', e)
        }
      }
      
      // If no localStorage, check with server
      fetch('/api/auth/me', { 
        method: 'GET', 
        credentials: 'include', 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
        .then(r => {
          console.log('🔍 Dashboard: Auth response status:', r.status)
          return r.json()
        })
        .then(res => {
          if (!mounted) return
          console.log('🔍 Dashboard auth check result:', res)
          if (res?.ok && res?.user) {
            console.log('✅ Dashboard: User authenticated:', res.user.email)
            setDbUser(res.user)
            localStorage.setItem('sp_user', JSON.stringify(res.user))
            localStorage.setItem('sp_auth', 'true')
            // Fetch header stats after user is authenticated
            fetchHeaderStats()
          } else {
            console.log('❌ Dashboard: User not authenticated, redirecting to sign-in')
            localStorage.removeItem('sp_user')
            localStorage.removeItem('sp_auth')
            setDbUser(null)
            router.replace('/sign-in?redirect=' + encodeURIComponent(pathname))
          }
        })
        .catch((err) => {
          console.error('❌ Dashboard auth error:', err)
          localStorage.removeItem('sp_user')
          localStorage.removeItem('sp_auth')
          setDbUser(null)
          router.replace('/sign-in?redirect=' + encodeURIComponent(pathname))
        })
        .finally(() => {
          if (mounted) setAuthLoading(false)
        })
    }
    
    // Immediate check for localStorage, no delay needed
    checkAuth()
    
    return () => {
      mounted = false
    }
  }, [router, pathname])

  // Handle window resize to fix layout issues on minimize/restore
  useEffect(() => {
    const handleResize = () => {
      // Force a re-render to recalculate responsive breakpoints
      setSidebarOpen(false)
      // Small delay to ensure proper recalculation
      setTimeout(() => {
        // Trigger a layout recalculation
        window.dispatchEvent(new Event('resize'))
      }, 100)
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Window was restored, recalculate layout
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'))
        }, 200)
      }
    }

    window.addEventListener('resize', handleResize)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Fix layout issues when navigating between pages
  useEffect(() => {
    // Reset sidebar state when pathname changes
    setSidebarOpen(false)
    setUserMenuOpen(false)
    
    // Force layout recalculation after navigation
    setTimeout(() => {
      // Trigger a reflow to ensure proper layout
      const mainContent = document.querySelector('.main-content') as HTMLElement
      if (mainContent) {
        mainContent.style.display = 'none'
        mainContent.offsetHeight // Trigger reflow
        mainContent.style.display = ''
      }
    }, 50)
  }, [pathname])

  const fetchHeaderStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats', { 
        credentials: 'include', 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      const data = await response.json()
      
      if (response.ok && data.success) {
        setHeaderStats({
          revenue: `₹${(data.stats.totalRevenue / 1000).toFixed(1)}K`,
          orders: data.stats.totalOrders
        })
      } else {
        // Set default values if API fails
        setHeaderStats({
          revenue: '₹0.0K',
          orders: 0
        })
      }
    } catch (error) {
      console.error('Failed to fetch header stats:', error)
      // Set default values on error
      setHeaderStats({
        revenue: '₹0.0K',
        orders: 0
      })
    }
  }

  // Refresh function that can be called from child components
  const refreshData = () => {
    fetchHeaderStats()
  }

  // Close mobile user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuOpen) {
        const target = event.target as Element
        if (!target.closest('[data-user-menu]')) {
          setUserMenuOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [userMenuOpen])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <>
      {dbUser ? (
        <div className="min-h-screen bg-background relative overflow-hidden dashboard-container navigation-fix">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="gradient-orb orb-blue absolute -top-40 -right-40 float float-delay-1"></div>
        <div className="gradient-orb orb-purple absolute bottom-0 -left-20 float float-delay-2"></div>
      </div>

      <div className="flex h-screen min-h-screen relative z-10">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* Mobile-Optimized Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-80 sm:w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 sidebar-container
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex h-full flex-col glass-card border-0 border-r border-white/10 backdrop-blur-xl">
            {/* Enhanced Logo Section */}
            <div className="flex h-16 sm:h-20 shrink-0 items-center justify-between px-4 sm:px-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold gradient-text-primary">SalesPilot</h1>
                  <p className="text-xs text-blue-400/80 tracking-wider">DASHBOARD</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors touch-target"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Enhanced Mobile Navigation */}
            <nav className="flex-1 px-4 sm:px-6 py-4 sm:py-6 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      group flex items-center px-4 py-4 text-base font-medium rounded-xl transition-all duration-200 touch-target
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/20' 
                        : 'text-white/70 hover:text-white hover:bg-white/10 active:bg-white/15'
                      }
                    `}
                  >
                    <Icon className={`mr-3 h-6 w-6 transition-colors ${isActive ? 'text-blue-400' : 'text-white/60 group-hover:text-white'}`} />
                    {item.name}
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Enhanced Quick Actions */}
            <div className="px-4 sm:px-6 pb-4">
              <button className="w-full btn-premium text-sm sm:text-base py-3 sm:py-4 group touch-target">
                <span className="flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  <span>Quick Action</span>
                </span>
              </button>
            </div>

            {/* Enhanced User Profile - Hidden when chatbot is open */}
            {!chatbotOpen && (
              <div className="border-t border-white/10 p-4 sm:p-6">
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 p-3 sm:p-4 rounded-xl bg-white/5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                      {dbUser.email?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-medium text-white truncate">
                        {dbUser.email?.split('@')[0] || dbUser.email}
                      </p>
                      <p className="text-xs sm:text-sm text-emerald-400 font-medium">Premium Plan</p>
                    </div>
                  </div>
                
                {/* Enhanced Mobile-Friendly Logout Button */}
                <button
                  onClick={async (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    
                    // Add visual feedback
                    const button = e.currentTarget
                    button.style.opacity = '0.5'
                    button.disabled = true
                    
                    try {
                      console.log('🔴 LOGOUT: Starting logout process...')
                      
                      // Call logout API
                      await fetch('/api/auth/signout', { 
                        method: 'POST',
                        credentials: 'include'
                      })
                      
                      // Force redirect
                      window.location.href = '/'
                    } catch (error) {
                      console.error('🔴 LOGOUT ERROR:', error)
                      window.location.href = '/'
                    } finally {
                      // Reset button state
                      button.style.opacity = '1'
                      button.disabled = false
                    }
                  }}
                  className="w-full flex items-center justify-center space-x-3 px-4 py-4 bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/40 text-red-400 hover:text-red-300 rounded-xl transition-all duration-200 font-semibold touch-target border border-red-500/30 hover:border-red-500/50 shadow-lg relative z-10"
                >
                  <LogOut className="w-6 h-6" />
                  <span className="text-base">Sign Out</span>
                </button>
              </div>
            </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0 main-content">
          {/* Mobile-Optimized Header */}
          <header className="glass-card border-0 border-b border-white/10 backdrop-blur-xl">
            <div className="flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6">
              <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors touch-target"
                >
                  <Menu className="w-5 h-5 text-white" />
                </button>
                
                {/* Mobile-Friendly Search */}
                <div className="relative group flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent focus:bg-white/15 transition-all text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4 relative">
                {/* Notifications */}
                <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors group touch-target">
                  <Bell className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                </button>

                {/* Quick Stats - Hidden on mobile, visible on md+ */}
                <div className="hidden md:flex items-center space-x-4 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-center">
                    <p className="text-xs text-white/60">Revenue</p>
                    <p className="text-sm font-bold text-green-400">
                      {headerStats ? headerStats.revenue : '--'}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-white/20"></div>
                  <div className="text-center">
                    <p className="text-xs text-white/60">Orders</p>
                    <p className="text-sm font-bold text-blue-400">
                      {headerStats ? headerStats.orders : '--'}
                    </p>
                  </div>
                </div>

                {/* Mobile Stats Button */}
                <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors touch-target">
                  <BarChart3 className="w-5 h-5 text-white/70" />
                </button>

                {/* Clear Mobile Logout - Fixed positioning */}
                <button 
                  onClick={async (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    
                    if (confirm('Are you sure you want to sign out?')) {
                      try {
                        console.log('🔴 MOBILE LOGOUT: Starting logout process...')
                        
                        // Clear state immediately
                        setDbUser(null)
                        setUserMenuOpen(false)
                        setSidebarOpen(false)
                        
                        // Call logout API
                        await fetch('/api/auth/signout', { 
                          method: 'POST',
                          credentials: 'include'
                        })
                        
                        // Force redirect
                        window.location.href = '/'
                        
                      } catch (error) {
                        console.error('🔴 MOBILE LOGOUT ERROR:', error)
                        window.location.href = '/'
                      }
                    }
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/40 text-red-400 hover:text-red-300 transition-all touch-target border border-red-500/30 hover:border-red-500/50 mobile-logout-btn"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>

                {/* Mobile User Menu */}
                <div className="relative user-dropdown" data-user-menu>
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 text-white font-bold touch-target relative z-10"
                  >
                    {dbUser.email?.[0]?.toUpperCase()}
                  </button>
                  
                  {/* Mobile User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-52 bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-[100] overflow-hidden">
                      <div className="p-4">
                        <div className="text-sm text-white/80 mb-3 pb-3 border-b border-white/10 truncate">
                          {dbUser.email?.split('@')[0]}
                        </div>
                        <button
                          onClick={async (e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            
                            // Add confirmation for better UX
                            if (confirm('Are you sure you want to sign out?')) {
                              try {
                                console.log('🔴 DROPDOWN LOGOUT: Starting logout process...')
                                
                                // Clear state immediately
                                setDbUser(null)
                                setUserMenuOpen(false)
                                setSidebarOpen(false)
                                
                                // Call logout API
                                const response = await fetch('/api/auth/signout', { 
                                  method: 'POST',
                                  credentials: 'include'
                                })
                                
                                console.log('🔴 DROPDOWN LOGOUT: API Response:', response.status)
                                
                                // Force redirect
                                window.location.href = '/'
                                
                              } catch (error) {
                                console.error('🔴 DROPDOWN LOGOUT ERROR:', error)
                                // Force logout even if API fails
                                setDbUser(null)
                                setUserMenuOpen(false)
                                setSidebarOpen(false)
                                window.location.href = '/'
                              }
                            }
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/40 text-red-400 hover:text-red-300 rounded-lg transition-all touch-target font-medium border border-red-500/30 hover:border-red-500/50"
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="text-sm font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions - Responsive */}
                <div className="flex items-center space-x-2">
                  <Link href="/dashboard/orders/new" className="hidden sm:flex btn-premium px-3 sm:px-4 py-2 text-sm group">
                    <span className="flex items-center space-x-2">
                      <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                      <span className="hidden md:inline">New Order</span>
                      <span className="md:hidden">Add</span>
                    </span>
                  </Link>
                  
                  {/* Mobile Add Button */}
                  <Link href="/dashboard/orders/new" className="sm:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all touch-target">
                    <Plus className="w-5 h-5 text-white" />
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {/* Mobile-Optimized Page content */}
          <main className="flex-1 overflow-auto" key={pathname}>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* AI Chatbot Widget */}
      <ChatbotWidget 
        isOpen={chatbotOpen} 
        onToggle={() => setChatbotOpen(!chatbotOpen)} 
      />
        </div>
      ) : null}
    </>
  )
}