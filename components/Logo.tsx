import React from 'react'
import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
  variant?: 'default' | 'white' | 'gradient'
}

export default function Logo({ 
  size = 'md', 
  className = '', 
  showText = true, 
  variant = 'default' 
}: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }

  const textSizes = {
    sm: 'text-lg font-heading',
    md: 'text-xl font-heading',
    lg: 'text-2xl font-heading',
    xl: 'text-3xl font-heading'
  }

  const logoVariants = {
    default: 'text-white',
    white: 'text-white',
    gradient: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent'
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon - Using the actual logo.png file */}
      <div className={`${sizeClasses[size]} flex-shrink-0 relative group/logo`}>
        <Image
          src="/logo.png"
          alt="SalesPilots Logo"
          width={48}
          height={48}
          className="w-full h-full object-contain drop-shadow-sm group-hover/logo:drop-shadow-lg transition-all duration-300"
          priority
        />
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
      </div>

      {/* Logo Text */}
      {showText && (
        <span className={`font-bold ${textSizes[size]} ${logoVariants[variant]} group-hover/logo:scale-105 transition-transform duration-300 text-render-optimized font-features`}>
          SalesPilots
        </span>
      )}
    </div>
  )
}

// Export individual logo icon for use without text
export function LogoIcon({ size = 'md', className = '' }: Omit<LogoProps, 'showText' | 'variant'>) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative group/logo`}>
      <Image
        src="/logo.png"
        alt="SalesPilots Logo"
        width={48}
        height={48}
        className="w-full h-full object-contain drop-shadow-sm group-hover/logo:drop-shadow-lg transition-all duration-300"
        priority
      />
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
    </div>
  )
}
