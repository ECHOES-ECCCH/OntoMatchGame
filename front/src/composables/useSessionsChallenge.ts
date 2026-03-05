// composables/useFinishChallenge.ts
import { useRouter } from 'vue-router'
import { updateSession } from '@/services/sessions.service'
import { useChallengeChecker } from '@/composables/useChallengeChecker'
import { useChapterData } from '@/composables/useChapter'

export function useFinishChallenge() {
  const router = useRouter()
  const { reset } = useChallengeChecker()
  const { chapterStats, chapterInfo } = useChapterData()

  async function finishChallenge(extraScore = 0) {
    const userId = chapterStats.value?.userId
    const scenarioName = chapterStats.value?.scenarioName
    const filename = chapterInfo.value?.filename
    const chapterName = chapterStats.value?.chapterName
    const lastChallengeId = chapterStats.value?.lastChallengeId
    const currentScore = parseInt(chapterStats.value?.score ?? '0', 10) + extraScore

    try {
      await updateSession({
        userId,
        currentScenario: scenarioName,
        currentChapter: filename + '.json',
        currentChallengeIndex: parseInt(lastChallengeId ?? '0', 10) + 1,
        currentScore,
      })
    } catch (e) {
      console.error('updateSession failed:', e)
    }

    reset()
    router.push({ path: '/challenge', query: { scenario: scenarioName, chapterName } })
  }

  return { finishChallenge }
}
