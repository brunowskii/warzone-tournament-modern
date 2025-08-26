// Glass panel component enhanced with ice-blue theme from Warzonedev-main
// Creates premium glassmorphism effect for modern UI

import * as React from 'react'
import { cn } from '@/lib/utils'

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  intensity?: 'light' | 'medium' | 'strong'
  animate?: boolean
}

export function GlassPanel({ 
  children, 
  className, 
  intensity = 'medium',
  animate = true,
  ...props 
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        'backdrop-blur-lg bg-black/20 border border-ice-blue/30 rounded-2xl',
        'shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(161,224,255,0.1)]',
        'relative overflow-hidden',
        animate && 'animate-fade-in-up',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-ice-blue/5 to-transparent pointer-events-none" />
      {children}
    </div>
  )
}

export default GlassPanel
