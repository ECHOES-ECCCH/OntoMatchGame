import type { CardInfo, CardPositionInfo, CardPropertyInfo } from '@/types/card/cardInfo'
import { computed } from 'vue'

export function getSubProperties(about: string, propertyDataCards: CardInfo[]) {
  return propertyDataCards.find((card) => card.about === about)?.subPropertyOf ?? []
}

export function getSuperProperties(about: string, propertyDataCards: CardPropertyInfo[]) {
  return propertyDataCards
    .filter((card) => card.subPropertyOf?.includes(about))
    .map((card) => card.about)
}

export function useSuperSubProperties(cardInfo: CardPositionInfo, propertyDataCards: CardInfo[]) {
  const subPropertyOf = computed(() => {
    const subProperty = {
      pleft: getSubProperties(cardInfo.pleft.about, propertyDataCards),
      pright: getSubProperties(cardInfo.pright.about, propertyDataCards),
    }

    return subProperty
  })

  const superPropertyOf = computed(() => {
    const superProperty = {
      pleft: getSuperProperties(cardInfo.pleft.about, propertyDataCards),
      pright: getSuperProperties(cardInfo.pright.about, propertyDataCards),
    }

    return superProperty
  })

  return { superPropertyOf, subPropertyOf }
}
