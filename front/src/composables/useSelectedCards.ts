import { computed, type Ref } from 'vue'
import type { ChapterData } from '@/types/chapter'
import type { CardInfo, Position } from '@/types/card/cardInfo'
type EntityPositionKeys = 'ELeftInit' | 'EMiddleInit' | 'ERightInit'
type PropertyPositionKeys = 'PLeftInit' | 'PRightInit'

export function useSelectedCards(
  chapterData: Ref<ChapterData | null>,
  entityDataCards: CardInfo[],
  branches: Record<Position, string[]>,
) {
  return computed(() => {
    const chapter = chapterData.value
    if (!chapter) return []

    return (['ELeftInit', 'EMiddleInit', 'ERightInit'] as EntityPositionKeys[]).map((pos) => {
      /**
       * Cartes selectionnées selon le challenge et la position
       */
      const positionKey = pos.replace('Init', '').toLowerCase() as Position
      const ids = chapter[pos]?.split(',').map((id: string) => id.trim()) ?? []
      const allEntityCards = ids
        .flatMap((id: string) =>
          id === '*' ? entityDataCards : entityDataCards.find((card: CardInfo) => card.id === id),
        )
        .filter(Boolean)

      /**
       *  FILTRE : Filtrer avec plusieurs branches
       */
      const selectedBranches = branches[positionKey]

      const filteredCards = selectedBranches?.includes('entity')
        ? allEntityCards
        : allEntityCards.filter(
            (card) => card.branch != null && card.branch.some((b) => selectedBranches.includes(b)),
          )

      return {
        type: 'entity',
        position: positionKey,
        cards:
          !selectedBranches?.includes('entity') && !filteredCards.length
            ? 'no card'
            : filteredCards,
        totalCards: allEntityCards.length,
      }
    })
  })
}

export function usePropertyCards(chapterData: Ref<ChapterData | null>, propertyDataCards) {
  return computed(() => {
    const chapter = chapterData.value
    if (!chapter) return []
    return (['PLeftInit', 'PRightInit'] as PropertyPositionKeys[]).map((pos) => {
      /**
       * Cartes selectionnées selon le challenge et la position
       */

      const positionKey = pos.replace('Init', '').toLowerCase()
      const ids = chapter[pos]?.split(',').map((id: string) => id.trim()) ?? []

      const allPropertyCards = ids
        .flatMap((id: string) =>
          id === '*'
            ? propertyDataCards
            : id === ''
              ? null
              : propertyDataCards.find((card: CardInfo) => card.id === id),
        )
        .filter(Boolean)

      return {
        position: positionKey,
        cards: allPropertyCards,
        totalCards: allPropertyCards.length,
      }
    })
  })
}

export function useBoardCards(
  chapterData: Ref<ChapterData | null>,
  entityDataCards: CardInfo[],
  propertyDataCards: CardInfo[],
  branches: Record<Position, string[]>,
) {
  const selectedCards = useSelectedCards(chapterData, entityDataCards, branches)
  const propertyCards = usePropertyCards(chapterData, propertyDataCards)

  const boardCards = computed(() => {
    const entities = selectedCards.value
    const properties = propertyCards.value

    if (!entities.length) return []

    return [
      entities.find((e) => e.position === 'eleft'),
      properties.find((p) => p.position === 'pleft'),
      entities.find((e) => e.position === 'emiddle'),
      properties.find((p) => p.position === 'pright'),
      entities.find((e) => e.position === 'eright'),
    ].filter(Boolean)
  })

  return {
    boardCards,
    selectedCards,
    propertyCards,
  }
}
