import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen warzone-bg-pattern">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-green-500/10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-16">
          <div className="text-center space-y-8">
            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black font-orbitron uppercase tracking-wider warzone-text-glow text-cyan-400 animate-float">
                Warzone
              </h1>
              <h2 className="text-4xl md:text-6xl font-bold font-orbitron uppercase tracking-wide text-white">
                Tournament Portal
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto animate-pulse-glow"></div>
            </div>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Next-generation tournament management with <span className="text-cyan-400 font-semibold">real-time leaderboards</span>, 
              <span className="text-green-400 font-semibold"> professional OBS overlays</span>, and 
              <span className="text-yellow-400 font-semibold"> immersive 3D design</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/en/tournaments">
                <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-4 text-lg warzone-glow transition-all duration-300">
                  🏆 View Tournaments
                </Button>
              </Link>
              <Link href="/en/obs/leaderboard">
                <Button variant="outline" size="lg" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-bold px-8 py-4 text-lg transition-all duration-300">
                  📺 OBS Overlays
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold font-orbitron text-white mb-4">Elite Features</h3>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Cards */}
          <Card className="warzone-border bg-black/40 border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 group">
            <CardHeader>
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎯</div>
              <CardTitle className="text-cyan-400 font-orbitron">Real-time Leaderboards</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Live score updates with Warzone Portal scoring system. Position-based multipliers and best-of-X match formats.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="warzone-border bg-black/40 border-green-400/30 hover:border-green-400/60 transition-all duration-300 group">
            <CardHeader>
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📺</div>
              <CardTitle className="text-green-400 font-orbitron">OBS Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Professional broadcast overlays with multiple themes, custom branding, and smooth animations for streaming.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="warzone-border bg-black/40 border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 group">
            <CardHeader>
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎮</div>
              <CardTitle className="text-yellow-400 font-orbitron">Warzone Design</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Immersive 3D elements, HUD-inspired interface, and cinematic animations that bring Verdansk to life.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="warzone-border bg-black/40 border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 group">
            <CardHeader>
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">👥</div>
              <CardTitle className="text-purple-400 font-orbitron">Team Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Unique access codes, Activision ID tracking, and comprehensive team registration with role management.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="warzone-border bg-black/40 border-red-400/30 hover:border-red-400/60 transition-all duration-300 group">
            <CardHeader>
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🔒</div>
              <CardTitle className="text-red-400 font-orbitron">Secure & Scalable</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Built with Next.js 14, Supabase auth, and PostgreSQL. Row-level security and complete audit logging.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="warzone-border bg-black/40 border-orange-400/30 hover:border-orange-400/60 transition-all duration-300 group">
            <CardHeader>
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📱</div>
              <CardTitle className="text-orange-400 font-orbitron">Mobile Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Responsive design optimized for mobile with touch interactions, floating navigation, and thumb-friendly UI.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-black/20 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold font-orbitron text-white mb-8">Powered by Elite Tech</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⚡</span>
              <span className="font-semibold">Next.js 14</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🗄️</span>
              <span className="font-semibold">Supabase</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎨</span>
              <span className="font-semibold">Three.js</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔒</span>
              <span className="font-semibold">PostgreSQL</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎭</span>
              <span className="font-semibold">Framer Motion</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⚡</span>
              <span className="font-semibold">Vercel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-green-500/10 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-4xl font-bold font-orbitron text-white mb-4">Ready to Dominate?</h3>
          <p className="text-xl text-gray-300 mb-8">Join the next generation of Warzone tournaments</p>
          <Link href="/en/tournaments">
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-400 hover:to-green-400 text-black font-bold px-12 py-4 text-xl warzone-glow transition-all duration-300">
              🚀 Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

