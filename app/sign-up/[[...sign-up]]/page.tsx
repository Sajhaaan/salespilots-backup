'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle, Sparkles, Zap, Star } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!email || !password || !firstName || !lastName) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsLoading(false)
      return
    }
    
    try {
      console.log('🔄 Attempting signup...')
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      })
      console.log('📡 Response status:', res.status)
      console.log('📡 Response headers:', Object.fromEntries(res.headers.entries()))
      
      const data = await res.json()
      console.log('📡 Response data:', data)
      
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || 'Sign up failed')
      }
      toast.success('Account created successfully! Let\'s set up your store...')
      router.push('/onboarding/store-setup')
    } catch (err: any) {
      console.error('❌ Signup error:', err)
      const errorMessage = err?.message || 'An error occurred during sign up'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs with 3D effect */}
        <div className="gradient-orb orb-green w-[600px] h-[600px] -top-64 -left-64 animate-float-slow"></div>
        <div className="gradient-orb orb-blue w-[500px] h-[500px] -bottom-64 -right-64 animate-float-reverse"></div>
        <div className="gradient-orb orb-purple w-[400px] h-[400px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-40 animate-pulse-slow"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400/30 rounded-full animate-float-particle-1"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400/40 rounded-full animate-float-particle-2"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-float-particle-3"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - 3D Visual */}
        <div className="hidden lg:block relative">
          <div className="relative w-full h-[600px] rounded-3xl overflow-hidden">
            {/* 3D Visual Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-3xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-3xl flex items-center justify-center">
                  <Star className="w-16 h-16 text-white/60" />
                </div>
                <h3 className="text-white/80 font-semibold text-lg mb-2">Start Your Journey</h3>
                <p className="text-white/60 text-sm">3D Visualization Coming Soon</p>
              </div>
            </div>
            
            {/* Overlay content */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="glass-card p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Start Your Journey</h3>
                    <p className="text-white/60 text-sm">Join thousands of businesses already saving money</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-white/70">
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-4 h-4" />
                    <span>₹9,001/month saved</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-4 h-4" />
                    <span>5-min setup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Header */}
          <div className="text-center lg:text-left mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-white/80 text-sm font-medium">Start Your Journey</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-white/70 text-lg">Join the AI automation revolution and transform your business</p>
          </div>

          {/* Value Proposition */}
          <div className="glass-card-3d p-6 mb-6">
            <div className="text-center">
              <div className="text-green-400 font-bold text-2xl mb-2 flex items-center justify-center space-x-2">
                <span>Save ₹9,001/month</span>
                <Star className="w-5 h-5" />
              </div>
              <p className="text-white/70 text-sm">Replace employees with AI automation</p>
            </div>
          </div>

          {/* Enhanced Sign Up Form */}
          <div className="glass-card-3d p-8 lg:p-10">
            {pendingVerification ? (
              <form onSubmit={(e) => { e.preventDefault(); setPendingVerification(false) }} className="space-y-6">
                <div className="text-center mb-6">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Check Your Email</h3>
                  <p className="text-white/70 text-sm">
                    We've sent a verification code to <strong>{email}</strong>
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start space-x-3 backdrop-blur-sm">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-white/90 mb-3">
                    Verification Code
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <input
                        type="text"
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-center text-lg tracking-widest transition-all duration-300 backdrop-blur-sm"
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled
                  className="w-full relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 group-hover:scale-[1.02] transform">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify Email</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPendingVerification(false)}
                  className="w-full text-white/60 hover:text-white text-sm transition-colors"
                >
                  Back to sign up
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start space-x-3 backdrop-blur-sm">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-white/90 mb-3">
                      First Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5 group-focus-within:text-green-400 transition-colors" />
                        <input
                          type="text"
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 backdrop-blur-sm"
                          placeholder="First name"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-white/90 mb-3">
                      Last Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5 group-focus-within:text-green-400 transition-colors" />
                        <input
                          type="text"
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 backdrop-blur-sm"
                          placeholder="Last name"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-3">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5 group-focus-within:text-green-400 transition-colors" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 backdrop-blur-sm"
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
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5 group-focus-within:text-green-400 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-14 pr-14 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 backdrop-blur-sm"
                        placeholder="Create a password (min 8 characters)"
                        required
                        disabled={isLoading}
                        minLength={8}
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
                  <p className="text-white/50 text-xs mt-2 flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>Password must be at least 8 characters long</span>
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 group-hover:scale-[1.02] transform">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </form>
            )}
          </div>

          {/* Bottom Link */}
          <div className="text-center mt-8">
            <p className="text-white/60">
              Already have an account?{' '}
              <a href="/sign-in" className="text-green-400 hover:text-green-300 font-medium transition-colors hover:underline">
                Sign in
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
                <span>5-min setup</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Save thousands</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
