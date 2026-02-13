import type { BranchName } from './branch'

export type EntityPosition = 'eleft' | 'emiddle' | 'eright'
export type PropertyPosition = 'pleft' | 'pright'
export type Position = EntityPosition | PropertyPosition

export interface CardInfo {
  id: string
  about: string
  labels: object
  comment: string
  subClasses: string[]
  branch?: BranchName | null
}

export type CardPositionInfo = {
  [key in Position]: { about: string }
}

export type CurrentIndexes = {
  [key in Position]: number
}

export interface SelectedCardData {
  position: Position
  totalCards: number
  cards: CardInfo[] | 'no card'
}
