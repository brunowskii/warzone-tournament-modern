export type OverlayView = 'leaderboard' | 'fragger'
export type OverlayTheme = 'dark' | 'light' | 'neon'

export function generateObsUrl(
  basePath: string,
  locale: string,
  tournamentId: string,
  opts?: {
    view?: OverlayView
    theme?: OverlayTheme
    compact?: boolean
    refresh?: number
  }
) {
  const url = new URL(`${basePath.replace(/\/$/, '')}/${locale}/obs/leaderboard`, 'http://dummy')
  url.searchParams.set('tournamentId', tournamentId)
  if (opts?.view) url.searchParams.set('view', opts.view)
  if (opts?.theme) url.searchParams.set('theme', opts.theme)
  if (typeof opts?.compact === 'boolean') url.searchParams.set('compact', String(opts.compact))
  if (opts?.refresh) url.searchParams.set('refresh', String(opts.refresh))
  return url.pathname + url.search
}

