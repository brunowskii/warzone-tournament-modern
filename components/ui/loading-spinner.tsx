// Loading spinner component from Warzonedev-main
// Modern loading animations for better UX

import * as React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'dots' | 'pulse' | 'warzone'
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default',
  className, 
  ...props 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex space-x-1', className)} {...props}>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('rounded-full bg-cyan-400 animate-pulse', sizeClasses[size], className)} {...props} />
    )
  }

  if (variant === 'warzone') {
    return (
      <div className={cn('relative', sizeClasses[size], className)} {...props}>
        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border border-green-400/50 animate-ping"></div>
      </div>
    )
  }

  return (
    <div 
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-cyan-400',
        sizeClasses[size],
        className
      )} 
      {...props} 
    />
  )
}

export default LoadingSpinner
