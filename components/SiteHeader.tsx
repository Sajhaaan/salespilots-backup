"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Menu, X, Star } from 'lucide-react'
import Logo from './Logo'

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dbUser, setDbUser] = useState<{ id: string; email: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 4)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Detect database-backed auth session
  useEffect(() => {
    let mounted = true
    fetch('/api/auth/me', { method: 'GET' })
      .then(async (r) => r.json())
      .then((res) => {
        if (!mounted) return
        if (res?.ok && res?.user) setDbUser(res.user)
        else setDbUser(null)
      })
      .catch(() => setDbUser(null))
    return () => {
      mounted = false
    }
  }, [])

  const headerBase = 'safe-area-pad sticky top-0 z-[100] border-0 border-b transition-all duration-500'
  const headerStyle = scrolled 
    ? 'bg-gradient-to-r from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl border-white/10 shadow-2xl shadow-purple-500/20' 
    : 'bg-gradient-to-r from-slate-900/80 via-slate-800/70 to-slate-900/80 backdrop-blur-xl border-white/5'

  return (
    <>
    <header className={`${headerBase} ${headerStyle}`}>
      <div className="max-container py-3 md:py-4">
        <div className="flex items-center justify-between relative">
          {/* 2025 Ultra-Modern Logo */}
          <Link href="/" className="group relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            <div className="relative bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-3 border border-white/10 group-hover:border-white/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-purple-500/25">
              <Logo size="sm" variant="gradient" className="transition-all duration-300" />
            </div>
          </Link>

          {/* Dark Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/features" className="text-white/90 hover:text-white transition-colors duration-200 font-medium">Features</Link>
            <Link href="/pricing" className="text-white/90 hover:text-white transition-colors duration-200 font-medium">Pricing</Link>
            <Link href="/documentation" className="text-white/90 hover:text-white transition-colors duration-200 font-medium">Docs</Link>
            <Link href="/about" className="text-white/90 hover:text-white transition-colors duration-200 font-medium">About</Link>
            <Link href="/careers" className="text-white/90 hover:text-white transition-colors duration-200 font-medium">Careers</Link>
            <Link href="/contact" className="text-white/90 hover:text-white transition-colors duration-200 font-medium">Contact</Link>
          </nav>

          {/* 2025 Ultra-Modern Right Side */}
          <div className="flex items-center space-x-3">
            {dbUser ? (
              <>
                <Link href="/dashboard" className="hidden md:inline-block btn-secondary-premium">Dashboard</Link>
                <button
                  onClick={async () => {
                    await fetch('/api/auth/signout', { method: 'POST' })
                    setDbUser(null)
                    router.refresh()
                  }}
                  className="text-white/80 hover:text-white transition-colors font-medium tap-target"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="hidden md:block ultra-modern-nav-link">Sign in</Link>
                <Link href="/sign-up" className="ultra-modern-cta-button group">
                  <span className="flex items-center space-x-2">
                    <span>Get Started</span>
                    <div className="w-1.5 h-1.5 bg-white rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                  </span>
                </Link>
              </>
            )}

            {/* Simple Mobile Menu Button */}
            <button
              aria-label="Open menu"
              aria-expanded={isOpen}
              onClick={() => {
                console.log('Menu button clicked, current state:', isOpen);
                setIsOpen(!isOpen);
              }}
              className="lg:hidden w-12 h-12 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 border border-white/30 text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

    </header>

    {/* Mobile Menu - Full Screen Overlay - Outside Header */}
    {isOpen && (
      <div className="fixed inset-0 z-[99999] lg:hidden" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}>
        <div className="absolute inset-0 bg-black bg-opacity-60" onClick={() => setIsOpen(false)}></div>
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl h-[95vh] flex flex-col" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%' }}>
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-lg">SalesPilots</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links - Full Height */}
          <div className="flex-1 px-6 py-4 overflow-y-auto">
            <nav className="space-y-4">
              <Link href="/features" className="block text-xl font-medium text-gray-900 hover:text-blue-600 py-4 px-4 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(false)}>
                Features
              </Link>
              <Link href="/pricing" className="block text-xl font-medium text-gray-900 hover:text-blue-600 py-4 px-4 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(false)}>
                Pricing
              </Link>
              <Link href="/documentation" className="block text-xl font-medium text-gray-900 hover:text-blue-600 py-4 px-4 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(false)}>
                Documentation
              </Link>
              <Link href="/about" className="block text-xl font-medium text-gray-900 hover:text-blue-600 py-4 px-4 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(false)}>
                About
              </Link>
              <Link href="/careers" className="block text-xl font-medium text-gray-900 hover:text-blue-600 py-4 px-4 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(false)}>
                Careers
              </Link>
              <Link href="/contact" className="block text-xl font-medium text-gray-900 hover:text-blue-600 py-4 px-4 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(false)}>
                Contact
              </Link>
            </nav>
          </div>

          {/* CTA Section - Fixed at Bottom */}
          <div className="px-6 py-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
            {dbUser ? (
              <div className="space-y-4">
                <Link href="/dashboard" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl text-center transition-colors text-lg" onClick={() => setIsOpen(false)}>
                  Go to Dashboard
                </Link>
                <button
                  onClick={async () => {
                    await fetch('/api/auth/signout', { method: 'POST' })
                    setDbUser(null)
                    setIsOpen(false)
                    router.refresh()
                  }}
                  className="block w-full text-gray-900 hover:text-blue-600 font-medium py-3 text-center text-lg"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Link href="/sign-up" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl text-center transition-colors text-lg" onClick={() => setIsOpen(false)}>
                  Get Started for Free
                </Link>
                <Link href="/sign-in" className="block w-full text-gray-900 hover:text-blue-600 font-medium py-3 text-center text-lg" onClick={() => setIsOpen(false)}>
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  )
}


