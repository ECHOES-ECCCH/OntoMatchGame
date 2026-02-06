import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findChapterStats } from '@/utils/chapters-progression'
import scenarioCatalogRaw from '@/assets/json/scenariiCatalog.json'
import type { ScenarioCatalog } from '@/types/game-selection'
import type { ChapterData } from '@/types/chapter'

const scenarioCatalog = scenarioCatalogRaw as ScenarioCatalog

const chapters = import.meta.glob('@/assets/json/**/chapter/*/*.json')
const isLoadingChapter = ref(false)

export function useChapterData() {
  const route = useRoute()

  const chapterData = ref<ChapterData | null>(null)
  const error = ref<string | null>(null)

  /**
   * Stats utilisateur du chapitre
   */
  const chapterStats = computed(() => {
    const chapterName = route.query.chapterName
    if (!chapterName || typeof chapterName !== 'string') return null

    return findChapterStats({
      chapterName,
      'chapter-title': chapterName,
    })
  })

  /**
   * Infos issues du scenariicatalog (lang + filename)
   */
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

  const scenarioKey = computed(() => {
    return chapterStats.value?.scenarioName.split(' ')[0] || ''
  })

  const lastChallengeId = computed(() => {
    return chapterStats.value?.lastChallengeId ?? '0'
  })

  /**
   * Chargement du JSON du chapitre
   */
  async function loadChapter(
    chapterName: string,
    scenario: string,
    challengeId: string,
    info: { filename: string; lang: string } | null,
  ) {
    if (!chapterName || !scenario || !info) return

    const key = `/src/assets/json/${info.lang}/chapter/${scenario}/${info.filename}.json`

    if (!chapters[key]) {
      error.value = `Chapitre introuvable : ${key}`
      chapterData.value = null
      return
    }

    isLoadingChapter.value = true

    try {
      const module = await chapters[key]()
      chapterData.value = module.default[challengeId] ?? null
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

  watch(
    [() => route.query.chapterName, scenarioKey, lastChallengeId, chapterInfo],
    ([chapterName, scenarioValue, challengeId, info]) => {
      if (
        typeof chapterName !== 'string' ||
        typeof scenarioValue !== 'string' ||
        typeof challengeId !== 'string' ||
        !info
      )
        return

      loadChapter(chapterName, scenarioValue, challengeId, info)
    },
    { immediate: true },
  )

  return {
    chapterData,
    error,
    chapterStats,
    isLoadingChapter,
  }
}
