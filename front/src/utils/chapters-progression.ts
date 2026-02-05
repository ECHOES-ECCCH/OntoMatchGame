import type { Chapter } from '@/types/game-selection'
import { userStats } from '@/composables/useUserStats'

export const findChapterStats = (
  chapter: { 'chapter-title'?: string; chapterName?: string } | null,
) => {
  if (!chapter) return null

  const name = 'chapter-title' in chapter ? chapter['chapter-title'] : chapter.chapterName

  if (!name) return null

  return userStats.value.find((s) => s.chapterName.includes(name)) ?? null
}

// Avoid recreating a session if it already exists.
export const isChapterStarted = (chapter: Chapter | null) => {
  return !!findChapterStats(chapter)
}

export const getChapterProgression = (chapter: Chapter | null) => {
  const stats = findChapterStats(chapter)
  if (!stats) return 0

  const last = parseInt(stats.lastChallengeId)
  const max = parseInt(stats.maxChallengeCount)

  return last === 1 ? 0 : Math.round((last / max) * 100)
}

export const getChapterLastChallengeId = (chapter: Chapter | null) => {
  const lastChallengeId = findChapterStats(chapter)
  return lastChallengeId?.lastChallengeId
}
