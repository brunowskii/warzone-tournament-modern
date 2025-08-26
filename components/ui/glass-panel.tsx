// Glass panel component from Warzonedev-main
// Creates glassmorphism effect for modern UI

import * as React from 'react'
import { cn } from '@/lib/utils'

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  intensity?: 'light' | 'medium' | 'strong'
}

export function GlassPanel({ 
  children, 
  className, 
  intensity = 'medium',
  ...props 
}: GlassPanelProps) {
  const intensityClasses = {
    light: 'bg-black/10 backdrop-blur-sm border-white/10',
    medium: 'bg-black/20 backdrop-blur-md border-white/20',
    strong: 'bg-black/30 backdrop-blur-lg border-white/30'
  }

  return (
    <div
      className={cn(
        'rounded-xl border shadow-2xl',
        intensityClasses[intensity],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default GlassPanel
