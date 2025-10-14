'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Shield, Zap, Github, Chrome } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  // Mouse tracking for interactive gradient
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.ok) {
        toast.success('Welcome back!')
        console.log('✅ Login successful, user data:', data.user)
        
        // Redirect to the intended page or dashboard
        const redirectTo = searchParams.get('redirect') || '/dashboard'
        
        // Longer delay for production/Vercel to ensure cookie is fully processed
        const isProduction = window.location.hostname !== 'localhost'
        const delay = isProduction ? 300 : 100
        
        console.log(`🔄 Redirecting to ${redirectTo} in ${delay}ms...`)
        
        setTimeout(() => {
          window.location.href = redirectTo
        }, delay)
      } else {
        console.error('❌ Login failed:', data.error)
        toast.error(data.error || 'Sign in failed')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1e] via-[#1a1347] to-[#0a0f1e]">
        {/* Mouse-tracked gradient orb */}
        <div 
          className="absolute w-[1000px] h-[1000px] rounded-full opacity-30 blur-[120px] transition-all duration-700 ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, rgba(59,130,246,0.3) 40%, transparent 70%)',
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/20 to-pink-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/15 to-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '3s' }} />
        
        {/* Refined grid pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
        
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
        }} />
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-md z-10">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200">
              Welcome back
            </span>
          </h1>
          <p className="text-slate-400 text-base">
            Sign in to continue to your account
          </p>
        </div>

        {/* Enhanced Glassmorphic Card */}
        <div className="relative group">
          {/* Multi-layer glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-[28px] opacity-0 group-hover:opacity-30 blur-xl transition-all duration-700" />
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-[26px] opacity-0 group-hover:opacity-20 blur transition-all duration-500" />
          
          {/* Main Card */}
          <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/[0.15] rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/20">
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
            
            <form onSubmit={handleSubmit} className="relative space-y-6">
              {/* Email Field - Premium Design */}
              <div className="space-y-2.5">
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1.5">
                  Email address
                </label>
                <div className="relative group">
                  {/* Enhanced animated border */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-[18px] opacity-0 ${emailFocused ? 'opacity-25 blur-md' : 'group-hover:opacity-15 blur-sm'} transition-all duration-500`} />
                  
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] pointer-events-none" />
                    <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 z-10 ${emailFocused ? 'text-purple-400 scale-110' : 'text-slate-500'}`} />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      className="relative w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/[0.12] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:bg-white/[0.08] focus:shadow-lg focus:shadow-purple-500/10 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Password Field - Premium Design */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-white/90">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  {/* Enhanced animated border */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-[18px] opacity-0 ${passwordFocused ? 'opacity-25 blur-md' : 'group-hover:opacity-15 blur-sm'} transition-all duration-500`} />
                  
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] pointer-events-none" />
                    <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 z-10 ${passwordFocused ? 'text-purple-400 scale-110' : 'text-slate-500'}`} />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      className="relative w-full pl-12 pr-12 py-3.5 bg-white/[0.03] border border-white/[0.12] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:bg-white/[0.08] focus:shadow-lg focus:shadow-purple-500/10 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-purple-400 transition-all duration-200 hover:scale-110 z-10"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Premium Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full group overflow-hidden mt-8"
              >
                {/* Multi-layer gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl transition-all duration-500 group-hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Animated shimmer */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl" />
                
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-50 blur-xl transition-all duration-500" />
                
                {/* Button Content */}
                <div className="relative flex items-center justify-center space-x-2.5 py-4 px-6 rounded-2xl">
                  {isLoading ? (
                    <div className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-white font-semibold text-base">Signing in...</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-white font-semibold text-base">Sign in</span>
                      <ArrowRight className="w-5 h-5 text-white transition-all duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/5 text-slate-400 rounded-full">Or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons - Modern 2025 Style */}
            <div className="grid grid-cols-2 gap-3">
              <button className="group relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl py-3 px-4 transition-all duration-300 flex items-center justify-center space-x-2">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Chrome className="w-5 h-5 text-white relative z-10" />
                <span className="text-white text-sm font-medium relative z-10">Google</span>
              </button>
              <button className="group relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl py-3 px-4 transition-all duration-300 flex items-center justify-center space-x-2">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700/20 to-gray-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Github className="w-5 h-5 text-white relative z-10" />
                <span className="text-white text-sm font-medium relative z-10">Github</span>
              </button>
            </div>

            {/* Footer Links - Modern Style */}
            <div className="mt-8 text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <span className="text-slate-400">Don't have an account?</span>
                <Link
                  href="/sign-up"
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors relative group"
                >
                  Sign up
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all group-hover:w-full" />
                </Link>
              </div>
              <Link
                href="/"
                className="inline-flex items-center text-slate-400 hover:text-white transition-colors text-sm group"
              >
                <ArrowRight className="w-4 h-4 mr-1 rotate-180 transition-transform group-hover:-translate-x-1" />
                Back to home
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="flex items-center justify-center space-x-6 text-xs text-slate-500">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>SSL Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>AI-Powered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}