import type { CardInfo, CardPositionInfo } from '@/types/card/cardInfo'
import { computed } from 'vue'

export function useSuperSubClasses(cardInfo: CardPositionInfo, dataCards: CardInfo[]) {
  const subClassOf = computed(() => {
    const subClass = {
      eleft:
        dataCards.find((card) => card.about === cardInfo.eleft.about)?.subClasses.map((s) => s) ??
        [],
      emiddle:
        dataCards.find((card) => card.about === cardInfo.emiddle.about)?.subClasses.map((s) => s) ??
        [],
      eright:
        dataCards.find((card) => card.about === cardInfo.eright.about)?.subClasses.map((s) => s) ??
        [],
    }

    return subClass
  })

  const superClassOf = computed(() => {
    const superClass = {
      eleft: cardInfo.eleft?.about
        ? dataCards
            .filter((data) => data.subClasses?.includes(cardInfo.eleft.about))
            .map((data) => data.about)
        : [],

      emiddle: cardInfo.emiddle?.about
        ? dataCards
            .filter((data) => data.subClasses?.includes(cardInfo.emiddle.about))
            .map((data) => data.about)
        : [],

      eright: cardInfo.eright?.about
        ? dataCards
            .filter((data) => data.subClasses?.includes(cardInfo.eright.about))
            .map((data) => data.about)
        : [],
    }

    return superClass
  })

  return { subClassOf, superClassOf }
}
