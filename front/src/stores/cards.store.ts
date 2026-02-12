import { parseClasses } from '@/utils/parses-xml-classes'
import { ref } from 'vue'
import { types } from '@/assets/cards/types.js'
import type { CardInfo } from '@/types/card/cardInfo'

export const useSelectedXML = () => {
  const dataCards = ref<CardInfo[]>([])
  const isDataCardsLoading = ref(false)
  const error = ref<string | null>(null)
  const finalData = ref()

  async function load() {
    isDataCardsLoading.value = true
    error.value = null
    try {
      const xml = await fetch('/data/data.xml').then((r) => r.text())
      const doc: Document = new DOMParser().parseFromString(xml, 'text/xml')
      dataCards.value = parseClasses(doc)

      /**
       * Intégrer les types sur les différentes cartes
       */
      if (Array.isArray(types) && types.length > 0) {
        dataCards.value = dataCards.value.map((item) => {
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

  return { dataCards, finalData, load, isDataCardsLoading, error }
}
