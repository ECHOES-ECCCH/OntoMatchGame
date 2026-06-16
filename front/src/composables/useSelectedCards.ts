import { computed, type Ref } from 'vue'
import type { ChapterData } from '@/types/chapter'
import type { CardInfo, CardInstances, CardPropertyInfo, Position } from '@/types/card/cardInfo'
import { showSolution } from './useSolution'
type EntityPositionKeys = 'ELeftInit' | 'EMiddleInit' | 'ERightInit'
type PropertyPositionKeys = 'PLeftInit' | 'PRightInit'

/**
 * Filters entity cards based on selected ontology branches.
 * If "entity" is selected, no filtering is applied.
 */
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

/**
 * Filters property cards based on entity branches.
 * Filtering is applied on either domain or range side.
 */
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

/**
 * Builds entity card groups for the board based on chapter configuration.
 */
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
       * Maps selected according to the challenge and position
       */
      const positionKey = pos.replace('Init', '').toLowerCase() as Position
      const ids = chapter[pos]?.split(',').map((id: string) => id.trim()) ?? []

      // Resolve IDs into actual card objects
      const allEntityCards = ids
        .flatMap((id: string) =>
          id === '*' ? entityDataCards : entityDataCards.find((card: CardInfo) => card.id === id),
        )
        .filter(Boolean)

      // Branch filtering is disabled in solution mode
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

/**
 * Builds property card groups (domain/range filtering included).
 */
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

      // Branch filters for domain and range sides
      const domainBranches = showSolution.value ? 'entity' : branches[`${positionKey}_domain`]
      const rangeBranches = showSolution.value ? 'entity' : branches[`${positionKey}_range`]

      let filteredCards = allPropertyCards

      // Apply domain filtering
      if (domainBranches && !domainBranches.includes('entity')) {
        filteredCards = filteredPropertyCardsByBranch(
          entityDataCards,
          domainBranches,
          filteredCards,
          'domain',
        )
      }

      // Apply range filtering
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

/**
 * Builds instance cards for each board position.
 * Each instance is matched by ID from chapter configuration.
 */
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

/**
 * Combines entity, property cards into a single board layout.
 * Defines the final structure used by the UI.
 */
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
