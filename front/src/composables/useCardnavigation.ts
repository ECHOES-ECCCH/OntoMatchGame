import { reactive, type Ref, type ComputedRef } from 'vue'
import type { CardInfo, Position, CurrentIndexes, SelectedCardData } from '@/types/card/cardInfo'

export function useCardNavigation(
  boardCards: Ref<SelectedCardData[]> | ComputedRef<SelectedCardData[]>,
  cardInfo: Record<Position, CardInfo>,
) {
  const currentIndexes = reactive<CurrentIndexes>({
    eleft: 0,
    emiddle: 0,
    eright: 0,
    pleft: 0,
    pright: 0,
  })
  /**
   * Updates the currently displayed card for a given position
   * based on the current index and available cards
   */
  const updateCardInfo = (position: Position, cards: CardInfo[]) => {
    const index = currentIndexes[position]
    if (cards && cards[index]) {
      // Flatten all available cards from board structure
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

  /**
   * Move to previous card in the carousel
   */
  const handlePrevious = (position: Position, cards: CardInfo[]) => {
    currentIndexes[position] = Math.max(currentIndexes[position] - 1, 0)
    updateCardInfo(position, cards)
  }

  /**
   * Move to next card in the carousel
   */
  const handleNext = (position: Position, cards: CardInfo[]) => {
    currentIndexes[position] = Math.min(currentIndexes[position] + 1, cards.length - 1)
    updateCardInfo(position, cards)
  }

  /**
   * Directly set carousel position from slider input
   */
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
