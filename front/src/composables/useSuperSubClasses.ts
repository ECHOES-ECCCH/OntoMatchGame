import type { CardInfo, CardPositionInfo } from '@/types/card/cardInfo'
import { computed } from 'vue'

/**
 * Returns the direct subclasses of an entity.
 */
export function getSubClasses(about: string, entityDataCards: CardInfo[]) {
  return entityDataCards.find((card) => card.about === about)?.subClasses ?? []
}

/**
 * Returns the direct superclasses of an entity.
 */
export function getSuperClasses(about: string, entityDataCards: CardInfo[]) {
  return entityDataCards
    .filter((data) => data.subClasses?.includes(about))
    .map((data) => data.about)
}

export function useSuperSubClasses(cardInfo: CardPositionInfo, entityDataCards: CardInfo[]) {
  /**
   * Computes subclass and superclass relationships
   * for the entities currently displayed on the board.
   */
  const subClassOf = computed(() => ({
    eleft: getSubClasses(cardInfo.eleft.about, entityDataCards),
    emiddle: getSubClasses(cardInfo.emiddle.about, entityDataCards),
    eright: getSubClasses(cardInfo.eright.about, entityDataCards),
  }))

  const superClassOf = computed(() => ({
    eleft: getSuperClasses(cardInfo.eleft.about, entityDataCards),
    emiddle: getSuperClasses(cardInfo.emiddle.about, entityDataCards),
    eright: getSuperClasses(cardInfo.eright.about, entityDataCards),
  }))

  return { subClassOf, superClassOf }
}
