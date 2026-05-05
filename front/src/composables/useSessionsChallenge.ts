import { updateSession } from '@/services/sessions.service'
import { useChallengeChecker } from '@/composables/useChallengeChecker'
import { useChapterData } from '@/composables/useChapter'
import router from '@/router'
import { showSolution } from './useSolution'

export function useFinishChallenge() {
  const { reset } = useChallengeChecker()
  const { chapterStats, chapterInfo } = useChapterData()
  async function finishChallenge(extraScore = 0) {
    const userId = chapterStats.value?.userId
    const scenarioName = chapterStats.value?.scenarioName
    const filename = chapterInfo.value?.filename
    const lastChallengeId = chapterStats.value?.lastChallengeId
    const currentScore = parseInt(chapterStats.value?.score ?? '0', 10) + extraScore
    const lastId = Number(lastChallengeId ?? 0)
    const max = Number(chapterStats.value?.maxChallengeCount ?? 0)

    const nextIndex = lastId < max ? lastId + 1 : max

    if (!userId || !scenarioName || !filename || !lastChallengeId) return

    try {
      await updateSession({
        userId,
        currentScenario: scenarioName,
        currentChapter: filename + '.json',
        currentChallengeIndex: nextIndex,
        currentScore,
      })
    } catch (e) {
      console.error('updateSession failed:', e)
    }

    reset()
    if (showSolution.value) return

    if (!showSolution.value) {
      const nextId = String(parseInt(chapterStats.value?.lastChallengeId ?? '1') + 1)
      router.replace({
        path: '/challenge',
        query: {
          ontology: chapterStats.value?.ontologyName,
          scenario: chapterStats.value?.scenarioName,
          chapterName: chapterStats.value?.chapterName,
          challengeId: nextId,
        },
      })
    }
  }

  return { finishChallenge }
}
