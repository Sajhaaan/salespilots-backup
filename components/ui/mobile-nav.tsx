'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Menu, 
  X, 
  ChevronDown, 
  Home, 
  ShoppingBag, 
  Package, 
  CreditCard, 
  Zap, 
  Settings, 
  Bell,
  User,
  LogOut,
  HelpCircle
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  children?: NavItem[]
}

interface MobileNavProps {
  items: NavItem[]
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onLogout?: () => void
}

export const MobileNav: React.FC<MobileNavProps> = ({ 
  items, 
  user, 
  onLogout 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        setActiveDropdown(null)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const toggleDropdown = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName)
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Toggle mobile menu"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu panel */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-sm bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User info */}
              {user && (
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-primary-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation items */}
              <nav className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-1">
                  {items.map((item) => (
                    <div key={item.name}>
                      {item.children ? (
                        <div>
                          <button
                            onClick={() => toggleDropdown(item.name)}
                            className={cn(
                              'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                              isActive(item.href)
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            )}
                          >
                            <div className="flex items-center space-x-3">
                              <item.icon className="h-5 w-5" />
                              <span>{item.name}</span>
                              {item.badge && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <ChevronDown 
                              className={cn(
                                'h-4 w-4 transition-transform',
                                activeDropdown === item.name && 'rotate-180'
                              )}
                            />
                          </button>
                          
                          {activeDropdown === item.name && (
                            <div className="ml-8 mt-1 space-y-1">
                              {item.children.map((child) => (
                                <Link
                                  key={child.name}
                                  href={child.href}
                                  className={cn(
                                    'flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors',
                                    isActive(child.href)
                                      ? 'bg-primary-50 text-primary-700'
                                      : 'text-gray-600 hover:bg-gray-100'
                                  )}
                                >
                                  <child.icon className="h-4 w-4" />
                                  <span>{child.name}</span>
                                  {child.badge && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                      {child.badge}
                                    </span>
                                  )}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                            isActive(item.href)
                              ? 'bg-primary-50 text-primary-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                          {item.badge && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 space-y-2">
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <HelpCircle className="h-5 w-5" />
                  <span>Help & Support</span>
                </button>
                
                {onLogout && (
                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign out</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Mobile bottom navigation for main sections
export const MobileBottomNav: React.FC<{
  items: NavItem[]
  className?: string
}> = ({ items, className }) => {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden',
      className
    )}>
      <nav className="flex items-center justify-around py-2">
        {items.slice(0, 5).map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors',
              isActive(item.href)
                ? 'text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <div className="relative">
              <item.icon className="h-5 w-5" />
              {item.badge && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default MobileNav
