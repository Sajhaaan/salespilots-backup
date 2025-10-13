'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, Shield, Zap, Github, Chrome, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [focusedField, setFocusedField] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)

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

  // Password strength calculator
  useEffect(() => {
    const calculateStrength = (password: string) => {
      let strength = 0
      if (password.length >= 6) strength += 25
      if (password.length >= 10) strength += 25
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25
      if (/\d/.test(password)) strength += 15
      if (/[!@#$%^&*]/.test(password)) strength += 10
      return Math.min(strength, 100)
    }
    setPasswordStrength(calculateStrength(formData.password))
  }, [formData.password])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          firstName: formData.name.split(' ')[0] || formData.name,
          lastName: formData.name.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (data.ok) {
        toast.success('Account created successfully!')
        router.push('/dashboard')
      } else {
        toast.error(data.error || 'Sign up failed')
      }
    } catch (error) {
      console.error('Sign up error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-red-500'
    if (passwordStrength < 50) return 'bg-orange-500'
    if (passwordStrength < 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak'
    if (passwordStrength < 50) return 'Fair'
    if (passwordStrength < 75) return 'Good'
    return 'Strong'
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
              Create your account
            </span>
          </h1>
          <p className="text-slate-400 text-base">
            Start your journey with SalesPilots today
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
            
            <form onSubmit={handleSubmit} className="relative space-y-5">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-white/90 flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-400" />
                  Full Name
                </label>
                <div className="relative group">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 ${focusedField === 'name' ? 'opacity-20' : 'group-hover:opacity-10'} blur transition-all duration-300`} />
                  <div className="relative">
                    <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${focusedField === 'name' ? 'text-purple-400 scale-110' : 'text-slate-500'}`} />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField('')}
                      className="relative w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 hover:bg-white/8"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-white/90 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-400" />
                  Email Address
                </label>
                <div className="relative group">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 ${focusedField === 'email' ? 'opacity-20' : 'group-hover:opacity-10'} blur transition-all duration-300`} />
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${focusedField === 'email' ? 'text-purple-400 scale-110' : 'text-slate-500'}`} />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      className="relative w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 hover:bg-white/8"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Password Field with Strength Indicator */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-white/90 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-400" />
                  Password
                </label>
                <div className="relative group">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 ${focusedField === 'password' ? 'opacity-20' : 'group-hover:opacity-10'} blur transition-all duration-300`} />
                  <div className="relative">
                    <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${focusedField === 'password' ? 'text-purple-400 scale-110' : 'text-slate-500'}`} />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('')}
                      className="relative w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 hover:bg-white/8"
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white transition-all duration-200 hover:scale-110"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Password Strength</span>
                      <span className={`font-semibold ${
                        passwordStrength < 25 ? 'text-red-400' :
                        passwordStrength < 50 ? 'text-orange-400' :
                        passwordStrength < 75 ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white/90 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-400" />
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 ${focusedField === 'confirmPassword' ? 'opacity-20' : 'group-hover:opacity-10'} blur transition-all duration-300`} />
                  <div className="relative">
                    <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${focusedField === 'confirmPassword' ? 'text-purple-400 scale-110' : 'text-slate-500'}`} />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField('')}
                      className="relative w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 hover:bg-white/8"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white transition-all duration-200 hover:scale-110"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="flex items-center gap-2 text-xs">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 text-red-400" />
                        <span className="text-red-400">Passwords don't match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="terms" className="text-sm text-slate-400">
                  I agree to the{' '}
                  <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Modern Submit Button with Gradient & Animations */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full group overflow-hidden"
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 transition-all duration-300 group-hover:scale-105" style={{ borderRadius: '1rem' }} />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderRadius: '1rem' }} />
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" style={{ borderRadius: '1rem' }} />
                
                {/* Button Content */}
                <div className="relative flex items-center justify-center space-x-2 py-3.5 px-6">
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-white font-semibold">Creating account...</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-white transition-transform group-hover:rotate-12" />
                      <span className="text-white font-semibold text-lg">Create Account</span>
                      <ArrowRight className="w-5 h-5 text-white transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/5 text-slate-400 rounded-full">Or sign up with</span>
              </div>
            </div>

            {/* Social Sign Up Buttons */}
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

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <span className="text-slate-400">Already have an account?</span>
                <Link
                  href="/sign-in"
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors relative group"
                >
                  Sign in
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
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span>Instant Setup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
