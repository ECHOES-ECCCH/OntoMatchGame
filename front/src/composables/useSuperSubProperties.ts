import type { CardInfo, CardPositionInfo, CardPropertyInfo } from '@/types/card/cardInfo'
import { computed } from 'vue'

/**
 * Returns the direct parent properties of the specified property.
 */
export function getSubProperties(about: string, propertyDataCards: CardInfo[]) {
  return propertyDataCards.find((card) => card.about === about)?.subPropertyOf ?? []
}

/**
 * Returns the direct child properties of the specified property.
 */
export function getSuperProperties(about: string, propertyDataCards: CardPropertyInfo[]) {
  return propertyDataCards
    .filter((card) => card.subPropertyOf?.includes(about))
    .map((card) => card.about)
}

export function useSuperSubProperties(cardInfo: CardPositionInfo, propertyDataCards: CardInfo[]) {
  /**
   * Parent properties associated with each property position on the board.
   */
  const subPropertyOf = computed(() => {
    const subProperty = {
      pleft: getSubProperties(cardInfo.pleft.about, propertyDataCards),
      pright: getSubProperties(cardInfo.pright.about, propertyDataCards),
    }

    return subProperty
  })

  /**
   * Child properties associated with each property position on the board.
   */
  const superPropertyOf = computed(() => {
    const superProperty = {
      pleft: getSuperProperties(cardInfo.pleft.about, propertyDataCards),
      pright: getSuperProperties(cardInfo.pright.about, propertyDataCards),
    }

    return superProperty
  })

  return { superPropertyOf, subPropertyOf }
}
