import { parseClasses } from '@/utils/parses-xml-classes'
import { ref } from 'vue'
import { types } from '@/assets/cards/types.ts'
import type { CardInfo, CardPropertyInfo } from '@/types/card/cardInfo'

const entityDataCards = ref<CardInfo[]>([])
const propertyDataCards = ref<CardPropertyInfo[]>([])
const isDataCardsLoading = ref(false)
const error = ref<string | null>(null)

export const useSelectedXML = () => {
  /**
   * Load ontology XML and convert it into card structures
   */
  async function loadCard(ontology: string) {
    isDataCardsLoading.value = true
    error.value = null

    try {
      const basePath = import.meta.env.BASE_URL

      // Fetch XML ontology file
      const xml = await fetch(`${basePath}/data/${ontology}/data.xml`).then((r) => r.text())

      // Parse XML document
      const doc: Document = new DOMParser().parseFromString(xml, 'text/xml')

      // Extract entity and property cards from XML
      entityDataCards.value = parseClasses(doc, 'entity')
      propertyDataCards.value = parseClasses(doc, 'property')

      /**
       * Enrich entity cards with external type metadata (branches)
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
      // Store error message for UI handling
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
