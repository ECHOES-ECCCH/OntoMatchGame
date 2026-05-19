import { computed, type Ref } from 'vue'
import type { ChapterData } from '@/types/chapter'
import type { CardInfo, CardInstances, CardPropertyInfo, Position } from '@/types/card/cardInfo'
import { showSolution } from './useSolution'
type EntityPositionKeys = 'ELeftInit' | 'EMiddleInit' | 'ERightInit'
type PropertyPositionKeys = 'PLeftInit' | 'PRightInit'

export function filteredEntityCardsByBranch(
  allEntityCards: CardInfo[],
  selectedBranches: string[],
) {
  if (!allEntityCards?.length || !selectedBranches?.length) return []

  return selectedBranches?.includes('entity')
    ? allEntityCards
    : allEntityCards.filter(
        (card) => card.branch != null && card.branch.some((b) => selectedBranches.includes(b)),
      )
}

export function filteredPropertyCardsByBranch(
  allEntityCards: CardInfo[],
  selectedBranches: string[],
  filteredCards: CardPropertyInfo[],
  side: 'domain' | 'range',
) {
  if (!allEntityCards?.length || !selectedBranches?.length) return []

  const allowedEntities = allEntityCards
    .filter((entity) => entity.branch?.some((b) => selectedBranches.includes(b)))
    .map((e) => e.about)

  return filteredCards.filter((card) => allowedEntities.includes(card[side]))
}

export function useEntityCards(
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
      const selectedBranches = showSolution.value ? 'entity' : branches[positionKey]

      const filteredCards = filteredEntityCardsByBranch(allEntityCards, selectedBranches)

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

export function usePropertyCards(
  chapterData: Ref<ChapterData | null>,
  propertyDataCards: CardPropertyInfo[],
  entityDataCards: CardInfo[],
  branches: Record<string, string[]>,
) {
  return computed(() => {
    const chapter = chapterData.value
    if (!chapter) return []

    return (['PLeftInit', 'PRightInit'] as PropertyPositionKeys[]).map((pos) => {
      const positionKey = pos.replace('Init', '').toLowerCase() // pleft | pright
      const ids = chapter[pos]?.split(',').map((id: string) => id.trim()) ?? []

      const allPropertyCards = ids
        .flatMap((id: string) =>
          id === '*' ? propertyDataCards : propertyDataCards.find((card) => card.id === id),
        )
        .filter(Boolean)

      // 👇 nouveaux filtres
      const domainBranches = showSolution.value ? 'entity' : branches[`${positionKey}_domain`]
      const rangeBranches = showSolution.value ? 'entity' : branches[`${positionKey}_range`]

      let filteredCards = allPropertyCards

      // Filtrage via les entités Domain

      if (domainBranches && !domainBranches.includes('entity')) {
        filteredCards = filteredPropertyCardsByBranch(
          entityDataCards,
          domainBranches,
          filteredCards,
          'domain',
        )
      }

      // Filtrage via les entités Range
      if (rangeBranches && !rangeBranches.includes('entity')) {
        filteredCards = filteredPropertyCardsByBranch(
          entityDataCards,
          rangeBranches,
          filteredCards,
          'range',
        )
      }

      return {
        type: 'property',
        position: positionKey,
        cards:
          filteredCards.length === 0 &&
          (!domainBranches?.includes('entity') || !rangeBranches?.includes('entity'))
            ? 'no card'
            : filteredCards,
        totalCards: allPropertyCards.length,
      }
    })
  })
}

export function useInstancesCards(
  chapterData: Ref<ChapterData | null>,
  chapterInstances: Ref<CardInstances | null>,
) {
  return computed(() => {
    const chapter = chapterData.value
    const instances = chapterInstances.value

    if (!chapter || !instances) return []

    return ['ILeftInit', 'IMiddleInit', 'IRightInit'].map((pos) => {
      const positionKey = pos.replace('Init', '').toLowerCase() as Position
      const id = chapter[pos]

      if (!id) return { position: positionKey, card: null }

      const matchedCard = instances.find((inst: CardInstances) => inst.Id === id)

      return { position: positionKey, card: matchedCard || null }
    })
  })
}

export function useBoardCards(
  chapterData: Ref<ChapterData | null>,
  entityDataCards: CardInfo[],
  propertyDataCards: CardPropertyInfo[],
  branches: Record<Position, string[]>,
) {
  const entityCards = useEntityCards(chapterData, entityDataCards, branches)
  const propertyCards = usePropertyCards(chapterData, propertyDataCards, entityDataCards, branches)

  const boardCards = computed(() => {
    const entities = entityCards.value
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
    entityCards,
    propertyCards,
  }
}
