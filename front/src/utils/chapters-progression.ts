import type { Chapter } from '@/types/game-selection'
import { userStats } from '@/composables/useUserStats'

export const findChapterStats = (
  chapter: { 'chapter-title'?: string; chapterName?: string; scenarioName?: string } | null,
) => {
  if (!chapter) return null

  const chapterName = 'chapter-title' in chapter ? chapter['chapter-title'] : chapter.chapterName
  const scenarioName = chapter.scenarioName ?? ''

  if (!chapterName || !scenarioName) return null

  // filtre userStats sur chapterName + scenarioName
  return (
    userStats.value.find(
      (s) => s.chapterName.includes(chapterName) && s.scenarioName === scenarioName,
    ) ?? null
  )
}

// Avoid recreating a session if it already exists.
export const isChapterStarted = (chapter: Chapter | null, scenarioName?: string) => {
  return !!findChapterStats({
    ...chapter,
    scenarioName,
  })
}

export const getChapterProgression = (chapter: Chapter | null, scenarioName?: string) => {
  const stats = findChapterStats({
    ...chapter,
    scenarioName,
  })
  if (!stats) return 0

  const last = parseInt(stats.lastChallengeId)
  const max = parseInt(stats.maxChallengeCount)

  return last === 1 ? 0 : Math.round((last / max) * 100)
}

export const getChapterLastChallengeId = (chapter: Chapter | null, scenarioName?: string) => {
  const stats = findChapterStats({
    ...chapter,
    scenarioName,
  })
  return stats?.lastChallengeId
}
