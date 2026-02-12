import type { Position } from './cardInfo'

export type Branch = {
  [key in Position]: string[]
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
