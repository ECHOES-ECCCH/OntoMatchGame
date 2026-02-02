import { userStats } from '@/composables/useUserStats'

// Avoid recreating a session if it already exists.
export const isChapterStarted = (chapter: object) => {
  return userStats.value.find((s) => s.chapterName.includes(chapter['chapter-title']))
}

export const getChapterProgression = (chapter: object) => {
  const result = userStats.value.find((s) => s.chapterName.includes(chapter['chapter-title']))
  console.log('result', result)
  if (result) {
    const chapterProgression =
      parseInt(result.lastChallengeId) === 1
        ? 0
        : Math.round((parseInt(result.lastChallengeId) / parseInt(result.maxChallengeCount)) * 100)

    return chapterProgression
  }
}
