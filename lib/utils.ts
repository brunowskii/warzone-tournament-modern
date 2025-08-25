import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatPoints(points: number) {
  return points.toFixed(1)
}

export function getPositionColor(position: number) {
  switch (position) {
    case 1:
      return 'text-leaderboard-gold'
    case 2:
      return 'text-leaderboard-silver'
    case 3:
      return 'text-leaderboard-bronze'
    default:
      return 'text-muted-foreground'
  }
}
