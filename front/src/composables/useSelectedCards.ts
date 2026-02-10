import { computed, ref, type Ref } from 'vue'
import type { ChapterData } from '@/types/chapter'

export function useSelectedCards(
  chapterData: Ref<ChapterData | null>,
  dataCards: Ref<{ id: string }[]>,
  branches: Record<string, string[]>,
) {
  return computed(() => {
    const chapter = chapterData.value
    if (!chapter) return []

    return ['ELeftInit', 'EMiddleInit', 'ERightInit'].map((pos) => {
      /**
       * Cartes selectionnées selon le challenge et la position
       */
      const positionKey = pos.replace('Init', '').toLowerCase()
      const ids = chapter[pos]?.split(',').map((id) => id.trim()) ?? []
      const allCards = ids
        .flatMap((id) => (id === '*' ? dataCards : dataCards.find((card) => card.id === id)))
        .filter(Boolean)

      /**
       *  FILTRE : Filtrer avec plusieurs branches
       */
      const selectedBranches = branches[positionKey]
      const filteredCards = selectedBranches.includes('entity')
        ? allCards
        : allCards.filter((card) => selectedBranches.includes(card.branch))

      return {
        position: positionKey,
        totalCards: allCards.length,
        cards:
          !selectedBranches.includes('entity') && !filteredCards.length ? 'no card' : filteredCards,
      }
    })
  })
}
