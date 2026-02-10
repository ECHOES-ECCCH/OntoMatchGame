import { computed, watchEffect } from 'vue'

export function useSuperSubClasses(cardInfo, dataCards: { id: string }[]) {
  const subClassOf = computed(() => {
    const result = {
      eleft: dataCards
        .find((card) => card.about === cardInfo.eleft.about)
        ?.subClasses.map((s) => s),
      emiddle: dataCards
        .find((card) => card.about === cardInfo.emiddle.about)
        ?.subClasses.map((s) => s),
      eright: dataCards
        .find((card) => card.about === cardInfo.eright.about)
        ?.subClasses.map((s) => s),
    }

    return result
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

  watchEffect(() => {
    subClassOf.value
    superClassOf.value
  })

  return { subClassOf, superClassOf }
}
