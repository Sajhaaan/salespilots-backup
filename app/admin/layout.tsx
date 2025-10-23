'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Database, 
  Shield, 
  BarChart3, 
  Activity,
  LogOut,
  Menu,
  X,
  Key
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      console.log('🔍 Checking admin access...')
      
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      console.log('Auth response status:', response.status)
      
      if (!response.ok) {
        console.log('❌ Auth response not ok, redirecting to sign-in')
        router.replace('/sign-in?redirect=/admin')
        return
      }
      
      const userData = await response.json()
      console.log('👤 User data:', userData)
      console.log('🔑 User role:', userData.user?.role)
      
      if (userData.user?.role !== 'admin') {
        console.log('❌ User is not admin, redirecting to dashboard')
        router.replace('/dashboard')
        return
      }
      
      console.log('✅ User is admin, setting user data')
      setUser(userData.user)
      setLoading(false)
    } catch (error) {
      console.error('Admin access check failed:', error)
      router.replace('/sign-in?redirect=/admin')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      router.replace('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const confirmLogout = () => {
    setShowLogoutConfirm(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-3 text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span>Verifying admin access...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  const adminNavItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/applications', icon: Users, label: 'Applications' },
    { href: '/admin/api-keys', icon: Key, label: 'API Keys' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/admin/database', icon: Database, label: 'Database' },
    { href: '/admin/system', icon: Activity, label: 'System' },
    { href: '/admin/security', icon: Shield, label: 'Security' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="admin-layout bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex">
      {/* Enhanced background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-6 left-6 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Enhanced Sidebar */}
      <div className={`
        admin-sidebar w-72 bg-black/30 backdrop-blur-2xl border-r border-white/10
        transform transition-all duration-500 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:translate-x-0 lg:relative lg:flex-shrink-0
        shadow-2xl shadow-black/50
        fixed lg:relative inset-y-0 left-0 z-40
      `}>
        <div className="flex flex-col h-full">
          {/* Enhanced Admin header - Fixed */}
          <div className="flex-shrink-0 p-4 border-b border-gradient-to-r from-red-500/20 via-purple-500/20 to-pink-500/20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl"></div>
              <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black animate-pulse"></div>
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-lg bg-gradient-to-r from-white to-white/80 bg-clip-text">
                        Admin Control
                      </h2>
                      <p className="text-white/60 text-xs">Welcome back, {user?.firstName || 'Admin'}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-xs font-medium">System Online</span>
                      </div>
                    </div>
                  </div>
                  {/* Emergency Logout Button */}
                  <button
                    onClick={confirmLogout}
                    className="group p-2 rounded-lg bg-red-500/20 border border-red-500/30 text-white hover:bg-red-500/30 hover:border-red-500/50 transition-all duration-300"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Navigation - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-4">
              <div className="mb-3">
                <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">
                  Navigation
                </h3>
              </div>
              <ul className="space-y-1.5">
                {adminNavItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = false // TODO: Add active state logic
                  
                  if (item.external) {
                    return (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setSidebarOpen(false)}
                          className="group relative flex items-center space-x-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20 transition-all duration-300 ease-out"
                        >
                          <div className="p-1.5 rounded-lg transition-all duration-300 bg-white/5 group-hover:bg-white/10">
                            <Icon className="w-4 h-4 transition-all duration-300 text-white/60 group-hover:text-white group-hover:scale-110" />
                          </div>
                          <span className="font-medium text-sm transition-all duration-300 group-hover:translate-x-1">
                            {item.label}
                          </span>
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                          </div>
                        </a>
                      </li>
                    )
                  }
                  
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`
                          group relative flex items-center space-x-3 px-3 py-2.5 rounded-xl
                          transition-all duration-300 ease-out
                          ${isActive 
                            ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-white border border-red-500/30 shadow-lg shadow-red-500/20' 
                            : 'text-white/70 hover:text-white hover:bg-white/10 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20'
                          }
                        `}
                      >
                        <div className={`
                          p-1.5 rounded-lg transition-all duration-300
                          ${isActive 
                            ? 'bg-gradient-to-br from-red-500/30 to-pink-500/30' 
                            : 'bg-white/5 group-hover:bg-white/10'
                          }
                        `}>
                          <Icon className={`w-4 h-4 transition-all duration-300 ${
                            isActive ? 'text-red-400' : 'text-white/60 group-hover:text-white group-hover:scale-110'
                          }`} />
                        </div>
                        <span className="font-medium text-sm transition-all duration-300 group-hover:translate-x-1">
                          {item.label}
                        </span>
                        {!isActive && (
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                          </div>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>

          {/* Enhanced User info and logout - Fixed at bottom */}
          <div className="flex-shrink-0 p-4 space-y-2 border-t border-white/10">
            {/* Debug: Always show logout even if user data is missing */}
            {user ? (
              <>
                {/* Compact User Profile Card */}
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/25">
                        {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'A'}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-black flex items-center justify-center">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-bold truncate">
                        {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
                      </p>
                      <p className="text-white/60 text-xs">Super Admin</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Fallback user info */
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/25">
                    A
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-xs font-bold">Admin User</p>
                    <p className="text-white/60 text-xs">Super Admin</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Compact Logout Button - Always visible */}
            <button
              onClick={confirmLogout}
              className="w-full group flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-white hover:from-red-500/30 hover:to-pink-500/30 hover:border-red-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20"
            >
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Main content */}
      <div className="admin-main flex-1 flex flex-col relative">
        {/* Top bar for mobile/desktop */}
        <div className="sticky top-0 z-30 backdrop-blur-xl bg-black/20 border-b border-white/10 p-6 lg:hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Online</span>
              </div>
              {/* Mobile Logout Button */}
              <button
                onClick={confirmLogout}
                className="group flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-white hover:bg-red-500/30 hover:border-red-500/50 transition-all duration-300"
                title="Logout"
              >
                <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 p-6 lg:p-8 relative overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Enhanced Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md w-full mx-auto shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/25">
                <LogOut className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Confirm Logout</h3>
              <p className="text-white/60 mb-6">Are you sure you want to logout from the admin panel?</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLogoutConfirm(false)
                    handleLogout()
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-red-500/25"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}