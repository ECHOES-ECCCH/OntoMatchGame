import { ref, computed, watch, onScopeDispose } from 'vue'
import { useRoute } from 'vue-router'
import { findChapterStats } from '@/utils/chapters-progression'
import scenarioCatalogRaw from '@/assets/json/scenariiCatalog.json'
import type { ScenarioCatalog } from '@/types/game-selection'
import type { ChapterData } from '@/types/chapter'
import { useSolution } from '@/composables/useSolution'

const { showSolution } = useSolution()

const scenarioCatalog = scenarioCatalogRaw as ScenarioCatalog

const chapters = import.meta.glob('@/assets/json/**/chapter/*/*.json')
const instances = import.meta.glob('@/assets/json/**/chapter/*/Instances/Instances.json')

const isLoadingChapter = ref(false)
const chapterData = ref<ChapterData | null>(null)
const chapterInstances = ref(null)
const imgInstanceURL = ref(null)
const error = ref<string | null>(null)

let watchInitialized = false

export function useChapterData() {
  const route = useRoute()

  const chapterStats = computed(() => {
    const chapterName = route.query.chapterName
    const scenarioName = route.query.scenario

    if (!chapterName || typeof chapterName !== 'string') return null

    const stats = findChapterStats({
      chapterName: chapterName,
      scenarioName: scenarioName,
    })

    return stats
  })

  const chapterInfo = computed<{ filename: string; lang: string } | null>(() => {
    if (!chapterStats.value) return null

    const scenario = scenarioCatalog.scenarii.find(
      (s) => s['scenario-title'] === chapterStats.value!.scenarioName,
    )
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
    if (!chapterName || !scenario || !info) {
      isLoadingChapter.value = false
      return
    }

    if (showSolution.value) return
    if (!chapterName || !scenario || !info) return

    const scenarioKey = scenario.split(' ')[0] || ''

    const key = `/src/assets/json/${info.lang}/chapter/${scenarioKey}/${info.filename}.json`
    const keyInstances = `/src/assets/json/${info.lang}/chapter/${scenarioKey}/Instances/Instances.json`
    imgInstanceURL.value = `/src/assets/json/${info.lang}/chapter/${scenarioKey}/Instances/Images/`

    if (!chapters[key]) {
      error.value = `Chapitre introuvable : ${key}`
      chapterData.value = null
      return
    }

    if (!instances[keyInstances]) {
      error.value = `Instances introuvables : ${key}`
      chapterInstances.value = null
      return
    }

    isLoadingChapter.value = true
    try {
      const module = await chapters[key]()

      chapterData.value = module.default[challengeId] ?? null

      const moduleInstances = await instances[keyInstances]()
      chapterInstances.value = moduleInstances.default ?? null

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
        () => route.query.chapterName,
        () => route.query.scenario,
        () => route.query.challengeId,
        chapterInfo,
      ],
      ([chapterName, scenarioValue, challengeId, info]) => {
        if (typeof chapterName !== 'string' || typeof scenarioValue !== 'string' || !info) return

        // challengeId depuis la route, sinon fallback sur les stats
        const id =
          typeof challengeId === 'string'
            ? challengeId
            : (chapterStats.value?.lastChallengeId ?? '0')

        loadChapter(chapterName, scenarioValue, id, info)
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
