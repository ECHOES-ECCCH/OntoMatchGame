import { computed, ref, type Ref } from 'vue'
import type { ChapterData } from '@/types/chapter'

const POSITIONS = ['ELeftInit', 'EMiddleInit', 'ERightInit'] as const

export function useSelectedCards(
  chapterData: Ref<ChapterData | null>,
  dataCards: Ref<{ id: string }[]>,
  branches: string,
) {
  return computed(() => {
    const chapter = chapterData.value
    if (!chapter) return []

    return POSITIONS.map((pos) => {
      const positionKey = pos.replace('Init', '').toLowerCase()
      const ids = chapter[pos]?.split(',').map((id) => id.trim()) ?? []
      const allCards = ids
        .flatMap((id) => (id === '*' ? dataCards : dataCards.find((card) => card.id === id)))
        .filter(Boolean)

      // Filtrer selon la branche sélectionnée pour cette position
      const filteredCards =
        branches[positionKey] === 'entity'
          ? allCards
          : allCards.filter((card) => card.branch === branches[positionKey])

      return {
        position: positionKey,
        cards: branches[positionKey] !== 'entity' && !filteredCards.length ? 'rien' : filteredCards,
      }
    })
  })
}
