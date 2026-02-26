import type { BranchName } from '@/types/card/branch' // branch réel pour les noms de branches

export const colors: Record<BranchName, { color: string; icon: string }> = {
  entity: { color: '#...', icon: '...' },
  temporal: { color: '#...', icon: '...' },
  actor: { color: '#...', icon: '...' },
  place: { color: '#...', icon: '...' },
  physical: { color: '#...', icon: '...' },
  conceptual: { color: '#...', icon: '...' },
  appellation: { color: '#...', icon: '...' },
  type: { color: '#...', icon: '...' },
  primitive: { color: '#...', icon: '...' },
  'spacetime-volume': { color: '#...', icon: '...' },
  'time-span': { color: '#...', icon: '...' },
  dimension: { color: '#...', icon: '...' },
}
