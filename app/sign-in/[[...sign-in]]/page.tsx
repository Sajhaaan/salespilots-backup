'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, Sparkles, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // If already signed in via DB session, redirect
  useEffect(() => {
    let mounted = true
    fetch('/api/auth/me', { method: 'GET', credentials: 'include', cache: 'no-store' })
      .then(r => r.json())
      .then(res => {
        if (!mounted) return
        if (res?.ok && res?.user) {
          // Redirect admin users to admin panel
          if (res.user.role === 'admin') {
            window.location.href = '/admin'
          } else {
            window.location.href = '/dashboard'
          }
        }
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || 'Invalid credentials')
      }
      
      // Check user role and redirect accordingly
      if (data.user?.role === 'admin') {
        toast.success('Welcome back! Redirecting to admin panel...')
        // Force redirect to admin panel
        window.location.href = '/admin'
      } else {
        toast.success('Welcome back! Redirecting to dashboard...')
        // Force redirect to dashboard
        window.location.href = '/dashboard'
      }
    } catch (err: any) {
      const msg = err?.message || 'An error occurred during sign in'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs with 3D effect */}
        <div className="gradient-orb orb-blue w-[600px] h-[600px] -top-64 -left-64 animate-float-slow"></div>
        <div className="gradient-orb orb-purple w-[500px] h-[500px] -bottom-64 -right-64 animate-float-reverse"></div>
        <div className="gradient-orb orb-pink w-[400px] h-[400px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-40 animate-pulse-slow"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-float-particle-1"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-float-particle-2"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-float-particle-3"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - 3D Visual */}
        <div className="hidden lg:block relative">
          <div className="relative w-full h-[600px] rounded-3xl overflow-hidden">
            {/* 3D Visual Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center">
                  <Zap className="w-16 h-16 text-white/60" />
                </div>
                <h3 className="text-white/80 font-semibold text-lg mb-2">AI-Powered</h3>
                <p className="text-white/60 text-sm">3D Visualization Coming Soon</p>
              </div>
            </div>
            
            {/* Overlay content */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="glass-card p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">AI-Powered Automation</h3>
                    <p className="text-white/60 text-sm">Transform your business with intelligent automation</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-white/70">
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-4 h-4" />
                    <span>99% Accuracy</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-4 h-4" />
                    <span>5-min Setup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Header */}
          <div className="text-center lg:text-left mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-white/80 text-sm font-medium">Welcome Back</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Sign In
            </h1>
            <p className="text-white/70 text-lg">Access your AI-powered business automation dashboard</p>
          </div>

          {/* Enhanced Sign In Form */}
          <div className="glass-card-3d p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start space-x-3 backdrop-blur-sm">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-3">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
                        placeholder="Enter your email"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-3">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-14 pr-14 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
                        placeholder="Enter your password"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors p-1"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 group-hover:scale-[1.02] transform">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>

          {/* Bottom Link */}
          <div className="text-center mt-8">
            <p className="text-white/60">
              New to SalesPilots?{' '}
              <a href="/sign-up" className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline">
                Create an account
              </a>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="text-center mt-6">
            <div className="flex items-center justify-center space-x-6 text-sm text-white/50">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Fast</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Reliable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
