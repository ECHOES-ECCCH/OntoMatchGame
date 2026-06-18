import type { Chapter } from '@/types/game-selection'
import { userStats } from '@/composables/useUserStats'

/**
 * Find stats for a given chapter based on ontology, scenario and chapter name.
 * Returns the matching userStats entry or null if not found.
 */
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

  // Search matching stats in global userStats store

  const result =
    userStats.value.find(
      (s) =>
        s.ontologyName === ontologyName &&
        s.chapterName.includes(chapterName) &&
        s.scenarioName === scenarioName,
    ) ?? null

  return result
}

/**
 * Check if a chapter session has already been started.
 * Avoids creating duplicate sessions.
 */
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

/**
 * Compute progression percentage for a chapter.
 * Based on last completed challenge vs total challenges.
 */
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

  // Single-challenge chapter case
  if (max === 1) {
    return last >= 1 ? 100 : 0
  }

  // First challenge not considered progress yet
  if (last === 1) {
    return 0
  }

  return Math.round((last / max) * 100)
}
