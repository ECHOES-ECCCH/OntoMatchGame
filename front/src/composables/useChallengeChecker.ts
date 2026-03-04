import { ref, isRef } from 'vue'
import { useCardInfoStore } from '@/stores/cardInfo.store'
import { useChapterData } from '@/composables/useChapter'

const results = ref<Record<string, 'correct' | 'incorrect' | 'empty' | 'unused'>>({})
const isComplete = ref(false)
const score = ref(0)

const reset = () => {
  isComplete.value = false
  score.value = 0
  results.value = {}
}

function getStatus(
  current: string,
  answer: string | undefined,
): 'correct' | 'incorrect' | 'empty' | 'unused' {
  if (answer === undefined || answer === null || answer === '') return 'unused'
  if (answer === '*') return current ? 'correct' : 'empty'
  if (!current) return 'empty'
  return current === answer ? 'correct' : 'incorrect'
}

export function useChallengeChecker() {
  const cardInfoStore = useCardInfoStore()
  const { chapterData } = useChapterData()

  const check = async () => {
    const cardInfo = cardInfoStore.cardInfo
    const data = isRef(chapterData) ? chapterData.value : chapterData

    results.value = {
      eleft: getStatus(cardInfo.eleft.id, data.ELeftAnswer),
      emiddle: getStatus(cardInfo.emiddle.id, data.EMiddleAnswer),
      eright: getStatus(cardInfo.eright.id, data.ERightAnswer),
      pleft: getStatus(cardInfo.pleft.id, data.PLeftAnswer),
      pright: getStatus(cardInfo.pright.id, data.PRightAnswer),
    }

    isComplete.value = Object.values(results.value)
      .filter((v) => v !== 'unused')
      .every((v) => v === 'correct')

    score.value = isComplete.value ? data.Score : 0
  }

  return { results, isComplete, score, check, reset }
}
