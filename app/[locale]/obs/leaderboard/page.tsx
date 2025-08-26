"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

type LeaderboardTeam = {
  id: string
  name: string
  rank: number
  totalScore: number
  players?: { playerName: string; activisionId?: string }[]
}

type LeaderboardResponse = {
  tournament: { id: string; name: string; code: string }
  leaderboard: LeaderboardTeam[]
  topFraggerStats?: { id?: string; playerName?: string; totalKills?: number; averageKills?: number }[] | null
  lastUpdated: string
}

const themes = {
  dark: 'bg-black/70 text-white',
  ice: 'bg-[#0a0f1a]/80 text-[#a1e0ff]',
  light: 'bg-white/80 text-black',
  neon: 'bg-[#0a0f0d]/80 text-[#e6fff2]'
} as const

export default function OBSLeaderboardOverlay() {
  const params = useSearchParams()
  const tournamentId = params.get('tournamentId') || ''
  const view = params.get('view') || 'leaderboard'
  const theme = (params.get('theme') || 'ice') as keyof typeof themes
  const refreshMs = Math.max(3000, Number(params.get('refresh') || 5000))
  // Custom brand colours for esports-style overlays
  const brandBg = params.get('bg') || ''
  const brandAccent = params.get('accent') || ''
  const brandStripe = params.get('stripe') || ''
  const brandText = params.get('text') || ''
  const compact = params.get('compact') === 'true'

  const [data, setData] = useState<LeaderboardResponse | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const overlayClass = useMemo(() => cn('w-full h-full p-4', themes[theme]), [theme])

  // Apply CSS variables for custom colours
  const styleVars: React.CSSProperties = useMemo(() => ({
    // fallbacks keep overlay readable
    ...(brandBg ? { ['--obs-bg' as any]: brandBg } : {}),
    ...(brandAccent ? { ['--obs-accent' as any]: brandAccent } : {}),
    ...(brandStripe ? { ['--obs-stripe' as any]: brandStripe } : {}),
    ...(brandText ? { ['--obs-text' as any]: brandText } : {}),
  }), [brandBg, brandAccent, brandStripe, brandText])

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      if (!tournamentId) return
      try {
        const res = await fetch(`/api/leaderboard/${tournamentId}/public`)
        if (!res.ok) throw new Error('Failed to fetch leaderboard')
        const json = (await res.json()) as LeaderboardResponse
        if (isMounted) setData(json)
      } catch (_) {
        // Silent fail for overlays
      }
    }

    fetchData()
    timerRef.current = setInterval(fetchData, refreshMs)
    return () => {
      isMounted = false
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [tournamentId, refreshMs])

  // Supabase realtime: refresh when relevant tables change
  useEffect(() => {
    if (!tournamentId) return

    let isSubscribed = true
    const refetch = async () => {
      if (!isSubscribed) return
      try {
        const res = await fetch(`/api/leaderboard/${tournamentId}/public`)
        if (!res.ok) return
        const json = (await res.json()) as LeaderboardResponse
        setData(json)
      } catch (_) {}
    }

    const channel = supabase
      .channel(`obs-${tournamentId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'PlayerStat' }, refetch)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ScoreAdjustment' }, refetch)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Match' }, refetch)
      .subscribe()

    return () => {
      isSubscribed = false
      try {
        supabase.removeChannel(channel)
      } catch {}
    }
  }, [tournamentId])

  if (!tournamentId) {
    return (
      <div className={overlayClass}>
        <div className="h-full grid place-items-center">
          <div className="text-center opacity-80">
            <p className="text-xl">Waiting for tournamentId…</p>
            <p className="text-sm">Add ?tournamentId=abc123</p>
          </div>
        </div>
      </div>
    )
  }

  const leaderboard = data?.leaderboard ?? []
  const fraggers = data?.topFraggerStats ?? []

  // Split leaderboard into columns for broadcast layout
  const colCount = compact ? 2 : 3
  const perCol = compact ? 8 : 9
  const columns: LeaderboardTeam[][] = Array.from({ length: colCount }, (_, i) =>
    leaderboard.slice(i * perCol, (i + 1) * perCol)
  )

  return (
    <div className={overlayClass} style={styleVars}>
      <div className={cn('relative mx-auto', compact ? 'max-w-5xl' : 'max-w-7xl')}>
        {/* Top stripe with enhanced ice-blue glow */}
        <div 
          className={cn(
            "absolute inset-x-0 -top-2 h-2",
            theme === 'ice' && "shadow-[0_0_20px_rgba(161,224,255,0.6)]"
          )} 
          style={{ background: 'var(--obs-stripe, #a1e0ff)' }} 
        />

        <header className="flex items-end justify-between mb-4">
          <div>
            <div className={cn(
              'uppercase tracking-widest font-black leading-none',
              theme === 'ice' && 'drop-shadow-[0_0_15px_rgba(161,224,255,0.8)]',
              compact ? 'text-3xl' : 'text-5xl'
            )}>
              Leaderboard
            </div>
            <div className={cn('opacity-80', compact ? 'text-xs' : 'text-sm')}>
              {data?.tournament?.name || 'Tournament'} • {new Date(data?.lastUpdated || Date.now()).toLocaleTimeString()}
            </div>
          </div>
          <div className="text-xs opacity-70">View: {view} • Theme: {theme}</div>
        </header>

        {view === 'fragger' ? (
          <div className="rounded-lg border border-white/10 overflow-hidden">
            <div className="grid grid-cols-12 text-xs uppercase tracking-wide opacity-70 px-3 py-2">
              <div className="col-span-1">#</div>
              <div className="col-span-7">Player</div>
              <div className="col-span-2 text-right">Kills</div>
              <div className="col-span-2 text-right pr-1">Avg</div>
            </div>
            <AnimatePresence initial={false}>
              {fraggers.slice(0, compact ? 8 : 14).map((p, index) => (
                <motion.div
                  key={`${p.id ?? p.playerName ?? index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className={cn('grid grid-cols-12 items-center px-3 py-2', index === 0 ? 'bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.08)]' : '')}
                >
                  <div className="col-span-1 font-bold">{index + 1}</div>
                  <div className="col-span-7 truncate">
                    <span className={cn('font-semibold', index === 0 ? 'animate-pulse' : '')}>
                      {p.playerName || `Player ${index + 1}`}
                    </span>
                  </div>
                  <div className="col-span-2 text-right font-semibold">{p.totalKills ?? 0}</div>
                  <div className="col-span-2 text-right font-semibold pr-1">{(p.averageKills ?? 0).toFixed(1)}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="grid gap-4" style={{ color: 'var(--obs-text, inherit)' }}>
            <div className="hidden" aria-hidden style={{ background: 'var(--obs-bg, transparent)' }} />
            <div className={cn('grid', compact ? 'grid-cols-2 gap-3' : 'grid-cols-3 gap-4')}>
              {columns.map((col, ci) => (
                <div key={ci} className="rounded-lg border border-white/10 overflow-hidden relative">
                  {/* Accent bar */}
                  <div className="absolute left-0 top-0 h-full w-1" style={{ background: 'var(--obs-accent, #ffef00)' }} />
                  <div className="grid grid-cols-12 text-xs uppercase tracking-wide opacity-80 px-3 py-2 bg-white/5">
                    <div className="col-span-1">#</div>
                    <div className="col-span-7">Team</div>
                    <div className="col-span-4 text-right pr-1">Points</div>
                  </div>
                  <AnimatePresence initial={false}>
                    {col.map((team) => (
                      <motion.div
                        key={team.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className={cn('grid grid-cols-12 items-center px-3 py-2 relative',
                          team.rank === 1 ? 'bg-[rgba(255,239,0,0.08)]' : team.rank === 2 ? 'bg-[rgba(192,192,192,0.08)]' : team.rank === 3 ? 'bg-[rgba(205,127,50,0.08)]' : '')}
                      >
                        <div className="col-span-1 font-black">{team.rank}</div>
                        <div className="col-span-7 truncate">
                          <span className="font-semibold">{team.name}</span>
                        </div>
                        <div className="col-span-4 text-right font-extrabold pr-1">
                          {Math.round(team.totalScore)}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

