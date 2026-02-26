import { parseClasses } from '@/utils/parses-xml-classes'
import { ref } from 'vue'
import { types } from '@/assets/cards/types.ts'
import type { CardInfo } from '@/types/card/cardInfo'

export const useSelectedXML = () => {
  const entityDataCards = ref<CardInfo[]>([])
  const propertyDataCards = ref<CardInfo[]>([])

  const isDataCardsLoading = ref(false)
  const error = ref<string | null>(null)

  async function loadCard() {
    isDataCardsLoading.value = true
    error.value = null
    try {
      const xml = await fetch('/data/data.xml').then((r) => r.text())
      const doc: Document = new DOMParser().parseFromString(xml, 'text/xml')

      entityDataCards.value = parseClasses(doc, 'entity')
      propertyDataCards.value = parseClasses(doc, 'property')

      /**
       * Intégrer les types sur les différentes cartes
       */
      if (Array.isArray(types) && types.length > 0) {
        entityDataCards.value = entityDataCards.value.map((item) => {
          const match = types.find((f) => f.id === item.id)
          return {
            ...item,
            branch: match ? match.branch : null,
          }
        })
      }
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      isDataCardsLoading.value = false
    }
  }

  return {
    entityDataCards,
    propertyDataCards,
    loadCard,
    isDataCardsLoading,
    error,
  }
}
