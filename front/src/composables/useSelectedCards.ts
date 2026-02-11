import { computed, type Ref } from 'vue'
import type { ChapterData } from '@/types/chapter'
import type { CardInfo, Position } from '@/types/cardInfo'
type ChapterPositionKeys = 'ELeftInit' | 'EMiddleInit' | 'ERightInit'

export function useSelectedCards(
  chapterData: Ref<ChapterData | null>,
  dataCards: CardInfo[],
  branches: Record<Position, string[]>,
) {
  return computed(() => {
    const chapter = chapterData.value
    if (!chapter) return []

    return (['ELeftInit', 'EMiddleInit', 'ERightInit'] as ChapterPositionKeys[]).map((pos) => {
      /**
       * Cartes selectionnées selon le challenge et la position
       */
      const positionKey = pos.replace('Init', '').toLowerCase() as Position
      const ids = chapter[pos]?.split(',').map((id: string) => id.trim()) ?? []
      const allCards = ids
        .flatMap((id: string) =>
          id === '*' ? dataCards : dataCards.find((card: CardInfo) => card.id === id),
        )
        .filter(Boolean)

      /**
       *  FILTRE : Filtrer avec plusieurs branches
       */
      const selectedBranches = branches[positionKey]
      const filteredCards = selectedBranches?.includes('entity')
        ? allCards
        : allCards.filter((card) => card?.branch != null && selectedBranches.includes(card.branch))

      return {
        position: positionKey,
        totalCards: allCards.length,
        cards:
          !selectedBranches?.includes('entity') && !filteredCards.length
            ? 'no card'
            : filteredCards,
      }
    })
  })
}
