import type { BranchName } from './branch'

export type Position = 'eleft' | 'emiddle' | 'eright'

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
