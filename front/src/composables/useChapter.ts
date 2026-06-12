import { ref, computed, watch, onScopeDispose } from 'vue'
import { useRoute } from 'vue-router'
import { findChapterStats } from '@/utils/chapters-progression'
import scenarioCatalogRaw from '@/assets/json/scenariiCatalog.json'
import type { ScenarioCatalog } from '@/types/game-selection'
import type { ChapterData } from '@/types/chapter'
import { useSolution } from '@/composables/useSolution'

const { showSolution } = useSolution()

const scenarioCatalog = scenarioCatalogRaw as ScenarioCatalog

const isLoadingChapter = ref(false)
const chapterData = ref<ChapterData | null>(null)
const chapterInstances = ref(null)
const imgInstanceURL = ref<string | null>(null)
const error = ref<string | null>(null)

let watchInitialized = false

export function useChapterData() {
  const route = useRoute()

  const chapterStats = computed(() => {
    const toString = (v: unknown) => (typeof v === 'string' ? v : '')

    const chapterName = toString(route.query.chapterName)
    const scenarioName = toString(route.query.scenario)
    const ontologyName = toString(route.query.ontology)

    if (!chapterName || typeof chapterName !== 'string') return null

    const stats = findChapterStats({
      ontologyName: ontologyName,
      chapterName: chapterName,
      scenarioName: scenarioName,
    })

    return stats
  })

  const chapterInfo = computed<{ filename: string; lang: string } | null>(() => {
    if (!chapterStats.value) return null

    const ontology = scenarioCatalog.scenarii.filter((s) =>
      s['ontologyTags'].includes(chapterStats.value!.ontologyName),
    )

    const scenario = ontology.find((s) => s['scenario-title'] === chapterStats.value!.scenarioName)
    if (!scenario) return null

    const chapter = scenario.chapters.find(
      (c) => c['chapter-title'] === chapterStats.value!.chapterName,
    )
    if (!chapter) return null

    return {
      lang: scenario.languageTag === 'Français' ? 'fr' : 'en',
      filename: chapter['chapter-filename'].replace(/\.json$/, ''),
    }
  })

  async function loadChapter(
    ontology: string,
    chapterName: string,
    scenario: string,
    challengeId: string,
    info: { filename: string; lang: string } | null,
  ) {
    isLoadingChapter.value = true

    if (showSolution.value) {
      isLoadingChapter.value = false
      return
    }
    if (!ontology || !chapterName || !scenario || !info) {
      isLoadingChapter.value = false
      return
    }

    if (showSolution.value) return
    if (!ontology || !chapterName || !scenario || !info) return

    // Use import.meta.env.BASE_URL to ensure correct path in production
    const basePath = import.meta.env.BASE_URL
    const chapterPath = `${basePath}json/${ontology}/${info.lang}/chapter/${scenario}/${info.filename}.json`
    const instancesPath = `${basePath}json/${ontology}/${info.lang}/chapter/${scenario}/Instances/Instances.json`
    imgInstanceURL.value = `${basePath}json/${ontology}/${info.lang}/chapter/${scenario}/Instances/Images/`

    isLoadingChapter.value = true
    try {
      // Fetch chapter data
      const chapterResponse = await fetch(chapterPath)

      if (!chapterResponse.ok) {
        throw new Error(`Chapitre introuvable : ${chapterPath} (${chapterResponse.status})`)
      }

      const chapterJson = await chapterResponse.json()
      chapterData.value = chapterJson[challengeId] ?? null

      // Fetch instances data
      const instancesResponse = await fetch(instancesPath)
      if (!instancesResponse.ok) {
        throw new Error(`Instances introuvables : ${instancesPath} (${instancesResponse.status})`)
      }
      chapterInstances.value = await instancesResponse.json()

      error.value = null
    } catch (err) {
      if (err instanceof Error) {
        error.value = `Erreur chargement : ${err.message}`
      } else {
        error.value = 'Erreur chargement inconnue'
      }
      chapterData.value = null
    } finally {
      isLoadingChapter.value = false
    }
  }

  if (!watchInitialized) {
    watchInitialized = true

    watch(
      [
        () => route.query.ontology,
        () => route.query.chapterName,
        () => route.query.scenario,
        () => route.query.challengeId,
        chapterInfo,
      ],
      ([ontology, chapterName, scenarioValue, challengeId, info]) => {
        if (
          typeof ontology !== 'string' ||
          typeof chapterName !== 'string' ||
          typeof scenarioValue !== 'string' ||
          !info
        )
          return

        // challengeId depuis la route, sinon fallback sur les stats
        const id =
          typeof challengeId === 'string'
            ? challengeId
            : (chapterStats.value?.lastChallengeId ?? '0')

        loadChapter(ontology, chapterName, scenarioValue, id, info)
      },
      { immediate: true },
    )

    // Remet watchInitialized à false quand le composant est détruit pour permettre la réinitialisation du watcher
    onScopeDispose(() => {
      watchInitialized = false
      stop()
    })
  }

  return {
    chapterData,
    chapterInstances,
    imgInstanceURL,
    error,
    chapterStats,
    isLoadingChapter,
    chapterInfo,
    loadChapter,
  }
}
