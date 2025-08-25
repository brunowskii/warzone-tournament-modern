import { TournamentList } from '@/components/tournament/tournament-list'
import { WarzoneTrophy } from '@/components/ui/warzone-trophy'
import { SupplyCrate } from '@/components/ui/supply-crate'
import { UAVRadar } from '@/components/ui/uav-radar'
import { motion } from 'framer-motion'
import { Trophy, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-blue-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-24 h-24 bg-green-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative"
              >
                <WarzoneTrophy size="lg" className="mx-auto" />
              </motion.div>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-6xl md:text-8xl font-black mb-6 text-cyan-500 text-cyan-glow"
            >
              WARZONE
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-2xl md:text-3xl text-cyan-300 mb-8 font-orbitron uppercase tracking-wider"
            >
              TOURNAMENT PORTAL
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-xl text-cyan-200 mb-12 max-w-3xl mx-auto"
            >
              Professional tournament management for Call of Duty: Warzone. 
              Experience the ultimate competitive gaming platform with real-time leaderboards, 
              team management, and immersive OBS overlays.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-col sm:flex-row justify-center gap-6"
            >
              <a 
                href="/tournaments" 
                className="btn-warzone inline-flex items-center px-8 py-4 text-lg"
              >
                <Trophy className="h-6 w-6 mr-3" />
                View Tournaments
              </a>
              <a 
                href="/auth/login" 
                className="inline-flex items-center px-8 py-4 text-lg border-2 border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition-all duration-300 font-orbitron uppercase tracking-wider"
              >
                <Users className="h-6 w-6 mr-3" />
                Admin Login
              </a>
            </motion.div>
          </motion.div>

          {/* 3D Elements Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex justify-center items-center gap-12 mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotateY: 10 }}
              className="flex flex-col items-center"
            >
              <SupplyCrate size="md" />
              <span className="text-cyan-400 font-orbitron uppercase tracking-wider mt-4">
                Supply Drops
              </span>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1, rotateY: -10 }}
              className="flex flex-col items-center"
            >
              <UAVRadar size="md" />
              <span className="text-cyan-400 font-orbitron uppercase tracking-wider mt-4">
                Live Tracking
              </span>
            </motion.div>
          </motion.div>
          
          {/* Featured Tournaments Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mb-16"
          >
            <div className="flex items-center justify-center mb-8">
              <h2 className="text-4xl font-black text-cyan-500 text-cyan-glow font-orbitron uppercase tracking-wider">
                Featured Tournaments
              </h2>
            </div>
            
            <div className="relative">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-green-500/10 rounded-2xl blur-3xl" />
              
              {/* Tournament list with metallic surface */}
              <div className="relative metallic-surface rounded-2xl p-8 border-cyan-glow">
                <TournamentList />
              </div>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {[
              {
                title: "Real-Time Leaderboards",
                description: "Live updates with Supabase Realtime integration",
                icon: "🏆",
                color: "from-yellow-500 to-orange-500"
              },
              {
                title: "OBS Integration",
                description: "Professional overlays for streaming",
                icon: "📺",
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "Team Management",
                description: "Complete team registration and access system",
                icon: "👥",
                color: "from-green-500 to-cyan-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.8 + index * 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="card-warzone tilt-3d text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-cyan-400 mb-2 font-orbitron uppercase">
                  {feature.title}
                </h3>
                <p className="text-cyan-200">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
