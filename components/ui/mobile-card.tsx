'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { designSystem } from '@/lib/design-system'

interface MobileCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'outlined' | 'filled'
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onClick?: () => void
}

export const MobileCard = React.forwardRef<HTMLDivElement, MobileCardProps>(
  ({ 
    children, 
    className, 
    variant = 'default', 
    size = 'md',
    interactive = false,
    onClick,
    ...props 
  }, ref) => {
    const baseClasses = designSystem.components.card.base
    const variantClasses = designSystem.components.card.variants[variant]
    
    const sizeClasses = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6'
    }
    
    const interactiveClasses = interactive 
      ? 'cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200' 
      : ''
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses,
          sizeClasses[size],
          interactiveClasses,
          className
        )}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    )
  }
)

MobileCard.displayName = 'MobileCard'

// Mobile-specific card variants
export const MobileCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-3', className)}
    {...props}
  />
))

MobileCardHeader.displayName = 'MobileCardHeader'

export const MobileCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))

MobileCardTitle.displayName = 'MobileCardTitle'

export const MobileCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))

MobileCardDescription.displayName = 'MobileCardDescription'

export const MobileCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-0', className)} {...props} />
))

MobileCardContent.displayName = 'MobileCardContent'

export const MobileCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-3', className)}
    {...props}
  />
))

MobileCardFooter.displayName = 'MobileCardFooter'
