import { userStats } from '@/composables/useUserStats'
import type { Chapter } from '@/types/game-selection'

// Avoid recreating a session if it already exists.
export const isChapterStarted = (chapter: Chapter | null) => {
  if (!chapter) return false

  return userStats.value.find((s) => s.chapterName.includes(chapter['chapter-title']))
}

export const getChapterProgression = (chapter: Chapter | null) => {
  if (!chapter) return false

  const result = userStats.value.find((s) => s.chapterName.includes(chapter['chapter-title']))
  if (result) {
    const chapterProgression =
      parseInt(result.lastChallengeId) === 1
        ? 0
        : Math.round((parseInt(result.lastChallengeId) / parseInt(result.maxChallengeCount)) * 100)
    return chapterProgression
  }
}
