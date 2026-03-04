import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import type { ChapterData } from '@/types/chapter'
import type { CardInfo, CardPropertyInfo, Position } from '@/types/card/cardInfo'
import { useEntityCards, usePropertyCards } from '@/composables/useSelectedCards'

export const useBoardStore = defineStore('board', () => {
  const chapterData = ref<ChapterData | null>(null)
  const entityDataCards = ref<CardInfo[]>([])
  const propertyDataCards = ref<CardPropertyInfo[]>([])
  const branches = ref<Record<Position, string[]>>({} as Record<Position, string[]>)

  const entityCards = useEntityCards(
    chapterData as Ref<ChapterData | null>,
    entityDataCards.value,
    branches.value,
  )

  const propertyCards = usePropertyCards(
    chapterData as Ref<ChapterData | null>,
    propertyDataCards.value,
    entityDataCards.value,
    branches.value,
  )

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

  function setBoardData(data: {
    chapter: ChapterData | null
    entities: CardInfo[]
    properties: CardPropertyInfo[]
    boardBranches: Record<Position, string[]>
  }) {
    chapterData.value = data.chapter
    entityDataCards.value = data.entities
    propertyDataCards.value = data.properties
    branches.value = data.boardBranches
  }

  function resetBoard() {
    chapterData.value = null
    entityDataCards.value = []
    propertyDataCards.value = []
    branches.value = {} as Record<Position, string[]>
  }

  return {
    boardCards,
    entityCards,
    propertyCards,
    setBoardData,
    resetBoard,
  }
})
