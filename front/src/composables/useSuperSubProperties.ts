import type { CardInfo, CardPositionInfo } from '@/types/card/cardInfo'
import { computed } from 'vue'

export function useSuperSubProperties(cardInfo: CardPositionInfo, propertyDataCards: CardInfo[]) {
  const subPropertyOf = computed(() => {
    const subProperty = {
      pleft:
        propertyDataCards.find((card) => card.about === cardInfo.pleft.about)?.subPropertyOf ?? [],
      pright:
        propertyDataCards.find((card) => card.about === cardInfo.pright.about)?.subPropertyOf ?? [],
    }

    return subProperty
  })

  const superPropertyOf = computed(() => {
    const superProperty = {
      pleft: cardInfo.pleft?.about
        ? propertyDataCards
            .filter((data) => data.subPropertyOf?.includes(cardInfo.pleft.about))
            .map((data) => data.about)
        : [],
      pright: cardInfo.pright?.about
        ? propertyDataCards
            .filter((data) => data.subPropertyOf?.includes(cardInfo.pright.about))
            .map((data) => data.about)
        : [],
    }

    return superProperty
  })

  return { superPropertyOf, subPropertyOf }
}
