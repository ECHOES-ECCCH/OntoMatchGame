import { reactive, type Ref, type ComputedRef } from 'vue'
import type { CardInfo, Position, CurrentIndexes } from '@/types/card/cardInfo'

export function useCardNavigation(
  boardCards: Ref<CardInfo[]> | ComputedRef<CardInfo[]>,
  cardInfo: Record<Position, CardInfo>,
) {
  const currentIndexes = reactive<CurrentIndexes>({
    eleft: 0,
    emiddle: 0,
    eright: 0,
    pleft: 0,
    pright: 0,
  })

  const updateCardInfo = (position: Position, cards: CardInfo[]) => {
    const index = currentIndexes[position]
    if (cards && cards[index]) {
      const allCards =
        boardCards.value?.flatMap((item) =>
          Array.isArray(item.cards) && item.cards !== 'no card' ? item.cards : [],
        ) ?? []

      const result = allCards.find((c) => c.about === cards[index]?.about)
      if (result) {
        cardInfo[position] = result
      } else {
        cardInfo[position] = {
          id: '',
          about: '',
          labels: {},
          comment: '',
          subClasses: [],
          branch: null,
        }
      }
    }
  }

  const handlePrevious = (position: Position, cards: CardInfo[]) => {
    currentIndexes[position] = Math.max(currentIndexes[position] - 1, 0)
    updateCardInfo(position, cards)
  }

  const handleNext = (position: Position, cards: CardInfo[]) => {
    currentIndexes[position] = Math.min(currentIndexes[position] + 1, cards.length - 1)
    updateCardInfo(position, cards)
  }

  const handleSliderChange = (position: Position, value: number, cards: CardInfo[]) => {
    currentIndexes[position] = value
    updateCardInfo(position, cards)
  }

  return {
    currentIndexes,
    updateCardInfo,
    handlePrevious,
    handleNext,
    handleSliderChange,
  }
}
