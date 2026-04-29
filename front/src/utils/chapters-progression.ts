import type { Chapter } from '@/types/game-selection'
import { userStats } from '@/composables/useUserStats'

export const findChapterStats = (
  chapter: {
    ontologyName?: string
    'chapter-title'?: string
    chapterName?: string
    scenarioName?: string
  } | null,
) => {
  if (!chapter) return null

  const chapterName = 'chapter-title' in chapter ? chapter['chapter-title'] : chapter.chapterName
  const scenarioName = chapter.scenarioName ?? ''
  const ontologyName = chapter.ontologyName ?? ''

  if (!chapterName || !scenarioName || !ontologyName) return null

  // filtre userStats sur chapterName + scenarioName

  const result =
    userStats.value.find(
      (s) =>
        s.ontologyName === ontologyName &&
        s.chapterName.includes(chapterName) &&
        s.scenarioName === scenarioName,
    ) ?? null

  return result
}

/** !!! IMPORTANT !!! Avoid recreating a session if it already exists. */
export const isChapterStarted = (
  chapter: Chapter | null,
  scenarioName: string,
  ontologyName: string,
) => {
  return !!findChapterStats({
    ...chapter,
    scenarioName,
    ontologyName,
  })
}

export const getChapterProgression = (
  chapter: Chapter | null,
  scenarioName: string,
  ontologyName: string,
) => {
  const stats = findChapterStats({
    ...chapter,
    scenarioName,
    ontologyName,
  })
  if (!stats) return 0

  const last = parseInt(stats.lastChallengeId)
  const max = parseInt(stats.maxChallengeCount)

  // Cas : un seul challenge
  if (max === 1) {
    return last >= 1 ? 100 : 0
  }

  // Cas : plusieurs challenges mais on est au premier
  if (last === 1) {
    return 0
  }

  return Math.round((last / max) * 100)
}
