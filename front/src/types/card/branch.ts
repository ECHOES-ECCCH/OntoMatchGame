import type { EntityPosition, Position } from './cardInfo'

export type BranchKey =
  | Position
  | `${EntityPosition}_domain`
  | `${EntityPosition}_range`
  | `pleft_domain`
  | `pleft_range`
  | `pright_domain`
  | `pright_range`

export type Branch = {
  [key in BranchKey]?: string[]
}

export type BranchName =
  | 'entity'
  | 'temporal'
  | 'actor'
  | 'place'
  | 'physical'
  | 'conceptual'
  | 'appellation'
  | 'type'
  | 'primitive'
  | 'spacetime-volume'
  | 'time-span'
  | 'dimension'
