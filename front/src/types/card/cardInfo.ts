import type { BranchName } from './branch'

export type EntityPosition = 'eleft' | 'emiddle' | 'eright' | 'pleft' | 'pright'
export type PropertyPosition = 'pleft_domain' | 'pleft_range' | 'pright_domain' | 'pright_range'
export type Position = EntityPosition | PropertyPosition
export type ErrorStatus = 'correct' | 'incorrect' | 'empty' | 'unused'

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
  cards: string[] | string
  kind?: string
}

export type CardPositionInfo = {
  [key in Position]: { about: string }
}

export type CurrentIndexes = {
  [key in Position]: number
}

export interface SelectedCardData {
  type: string
  position: Position
  totalCards: number
  cards: CardInfo[] | (CardPropertyInfo | undefined)[] | 'no card'
}

export interface CardInstances {
  Id: string
  Title: string
  Label: string
  ImageName: string
  kind?: string
  Scenario?: string
}

export interface ErrorCards {
  eleft: {
    status: ErrorStatus
    message: string
  }
  emiddle: {
    status: ErrorStatus
    message: string
  }
  eright: {
    status: ErrorStatus
    message: string
  }
  pleft: {
    status: ErrorStatus
    message: string
  }
  pright: {
    status: ErrorStatus
    message: string
  }
  pleft_domain?: { status: ErrorStatus; message: string }
  pleft_range?: { status: ErrorStatus; message: string }
  pright_domain?: { status: ErrorStatus; message: string }
  pright_range?: { status: ErrorStatus; message: string }
}
