'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'
import Logo from '@/components/Logo'

export default function AuthTestPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'info' | null
    message: string
    details?: any
  }>({ type: null, message: '' })
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus({ type: null, message: '' })

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/signin'
      
      console.log('🚀 Attempting authentication:', endpoint)
      console.log('📧 Data being sent:', { ...formData, password: '[HIDDEN]' })
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))

      const data = await response.json()
      console.log('📄 Response data:', data)

      if (response.ok) {
        setStatus({
          type: 'success',
          message: isSignUp ? 'Account created successfully!' : 'Signed in successfully!',
          details: data
        })
        
        // Redirect after a short delay
        setTimeout(() => {
          if (isSignUp) {
            router.push('/onboarding/store-setup')
          } else {
            router.push('/dashboard')
          }
        }, 2000)
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Authentication failed',
          details: data
        })
      }
    } catch (error) {
      console.error('❌ Network error:', error)
      setStatus({
        type: 'error',
        message: 'Network error. Please check your connection.',
        details: error
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const testDatabaseConnection = async () => {
    setStatus({ type: 'info', message: 'Testing database connection...' })
    
    try {
      const response = await fetch('/api/test/db')
      const data = await response.json()
      
      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Database connection successful!',
          details: data
        })
      } else {
        setStatus({
          type: 'error',
          message: 'Database connection failed',
          details: data
        })
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to test database connection',
        details: error
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <Logo size="lg" variant="gradient" className="group-hover:scale-110 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
          </div>
          <h1 className="text-heading-1 font-heading text-white mb-2 text-render-optimized font-features">SalesPilots</h1>
          <p className="text-body text-blue-300 text-render-optimized font-features">Authentication Test Page</p>
        </div>

        {/* Status Display */}
        {status.type && (
          <div className={`mb-6 p-4 rounded-lg border ${
            status.type === 'success' ? 'bg-green-900/20 border-green-500/30 text-green-300' :
            status.type === 'error' ? 'bg-red-900/20 border-red-500/30 text-red-300' :
            'bg-blue-900/20 border-blue-500/30 text-blue-300'
          }`}>
            <div className="flex items-center space-x-2">
              {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
               status.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
               <AlertCircle className="w-5 h-5" />}
              <span className="font-medium">{status.message}</span>
            </div>
            {status.details && (
              <details className="mt-2 text-sm opacity-80">
                <summary className="cursor-pointer hover:opacity-100">View Details</summary>
                <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(status.details, null, 2)}</pre>
              </details>
            )}
          </div>
        )}

        {/* Test Database Button */}
        <div className="mb-6 text-center">
          <button
            onClick={testDatabaseConnection}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-white"
          >
            Test Database Connection
          </button>
        </div>

        {/* Auth Form */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="First Name"
                        required={isSignUp}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Last Name"
                        required={isSignUp}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
            >
              {isLoading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          {/* Toggle Sign In/Sign Up */}
          <div className="text-center mt-6">
            <p className="text-white/70">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-6 text-center text-white/50 text-sm">
          <p>Environment: {process.env.NODE_ENV || 'development'}</p>
          <p>Base URL: {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}</p>
        </div>
      </div>
    </div>
  )
}
