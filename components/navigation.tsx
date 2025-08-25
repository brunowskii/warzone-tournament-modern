'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trophy, Home, Users, Eye, Target, Gamepad2 } from 'lucide-react'
import { motion } from 'framer-motion'

export function Navigation() {
  const t = useTranslations('navigation')
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: t('home'), icon: Home },
    { href: '/tournaments', label: t('tournaments'), icon: Trophy },
    { href: '/leaderboard', label: t('leaderboard'), icon: Target },
    { href: '/auth/login', label: t('login'), icon: Users },
  ]

  return (
    <nav className="metallic-surface border-b border-cyan-500/30 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Trophy className="h-8 w-8 text-cyan-500 group-hover:text-cyan-400 transition-colors duration-300" />
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-md group-hover:bg-cyan-400/30 transition-colors duration-300" />
            </div>
            <span className="text-xl font-bold text-cyan-500 group-hover:text-cyan-400 transition-colors duration-300 font-orbitron">
              WARZONE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`
                        relative overflow-hidden px-4 py-2 rounded-lg
                        ${isActive 
                          ? 'bg-gradient-to-r from-cyan-500 to-green-500 text-black font-bold' 
                          : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10'
                        }
                        transition-all duration-300
                        font-orbitron text-sm uppercase tracking-wider
                      `}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                      
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-green-400/20"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      
                      {/* Glow effect */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-green-500/20 blur-sm" />
                      )}
                    </Button>
                  </motion.div>
                </Link>
              )
            })}
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            >
              <Gamepad2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden mobile-nav">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`
                    relative p-3 rounded-full transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-r from-cyan-500 to-green-500 text-black' 
                      : 'text-cyan-400 hover:text-cyan-300'
                    }
                  `}
                >
                  <Icon className="h-6 w-6" />
                  
                  {/* Glow effect for active item */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-green-500/30 rounded-full blur-md" />
                  )}
                </motion.div>
                
                <span className={`
                  text-xs mt-1 font-orbitron uppercase tracking-wider
                  ${isActive ? 'text-cyan-400 font-bold' : 'text-cyan-500/70'}
                `}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
