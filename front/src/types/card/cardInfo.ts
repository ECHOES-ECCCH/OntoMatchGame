import type { BranchName } from './branch'

export type EntityPosition = 'eleft' | 'emiddle' | 'eright' | 'pleft' | 'pright'
export type PropertyPosition = 'pleft_domain' | 'pleft_range' | 'pright_domain' | 'pright_range'
export type Position = EntityPosition | PropertyPosition

export interface CardInfo {
  id: string
  about: string
  labels: {
    en: string
    fr: string
  }
  cards: string[] | string
  comment: string
  subClasses: string[]
  branch?: BranchName[] | null
  kind?: string
}

export interface CardPropertyInfo {
  id: string
  about: string
  labels: {
    en: string
    fr: string
  }
  comment: string
  subClasses: string[]
  branch?: BranchName[] | null
  domain: string
  range: string
  subPropertyOf: string
  card?: CardInfo
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

export interface CardInstances {
  Id: string
  Title: string
  Label: string
  ImageName: string
}
