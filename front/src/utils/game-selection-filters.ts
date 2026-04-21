import { langStore } from '@/stores/lang.store'
import { computed, ref } from 'vue'
import scenarioCatalog from '@/assets/json/scenariiCatalog.json'
const scenarii = scenarioCatalog.scenarii ?? []

// Filtre par défaut
export const selectedOntology = ref('CIDOC CRM')

// Filtres à afficher selon l'ontolgie sélectionnée
export const allDomainCodes = computed(() => {
  return [
    ...new Set(
      scenarii
        .filter((s) => !selectedOntology.value || s.ontologyTags.includes(selectedOntology.value))
        .flatMap((s) => s.domainCodes || []),
    ),
  ].sort()
})

export const selectedDomains = ref<string[]>([...allDomainCodes.value])

export const domainLabels = computed(() => {
  const t = langStore.t

  return {
    ARC: t('static-text.GameSelectionScene.gameselection-scene-topicarcheology-text'),
    ACT: t('static-text.GameSelectionScene.gameselection-scene-topicarchitecture-text'),
    ARK: t('static-text.GameSelectionScene.gameselection-scene-topicarchive-text'),
    ART: t('static-text.GameSelectionScene.gameselection-scene-topicart-text'),
    CUL: t('static-text.GameSelectionScene.gameselection-scene-topiccultural-text'),
    CSV: t('static-text.GameSelectionScene.gameselection-scene-topicconservation-text'),
    ETH: t('static-text.GameSelectionScene.gameselection-scene-topicethnology-text'),
    HIS: t('static-text.GameSelectionScene.gameselection-scene-topichistory-text'),
    LIN: t('static-text.GameSelectionScene.gameselection-scene-topiclinguistic-text'),
    LIT: t('static-text.GameSelectionScene.gameselection-scene-topicliterature-text'),
    OLB: t('static-text.GameSelectionScene.gameselection-scene-topicoldbook-text'),
    MSM: t('static-text.GameSelectionScene.gameselection-scene-topicmuseum-text'),
    MUS: t('static-text.GameSelectionScene.gameselection-scene-topicmusicology-text'),
  }
})

// Liste des scénarios selectionnés
export const filteredScenarii = computed(() => {
  const result = scenarii.filter((s) => {
    const matchOntology = !selectedOntology.value || s.ontologyTags.includes(selectedOntology.value)
    const matchDomains = Array.isArray(s.domainCodes)
      ? s.domainCodes.some((c) => selectedDomains.value.includes(c))
      : selectedDomains.value.includes(s.domainCodes)
    return matchOntology && matchDomains
  })

  return result
})
