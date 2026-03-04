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
  current: any,
  answer: string | undefined,
  entityDataCards: any[],
  propertyDataCards: any[],
): 'correct' | 'incorrect' | 'empty' | 'unused' {
  if (!answer) return 'unused'
  if (!current) return 'empty'
  if (answer === '*') return 'correct'

  const possibleAnswers = answer.split(',').map((a) => a.trim())
  const isCorrect = possibleAnswers.includes(current.id)

  if (isCorrect) return 'correct'

  // getErrorDetails doit retourner quelque chose !
  return getErrorDetails(current, possibleAnswers, entityDataCards, propertyDataCards)
}

const getErrorDetails = (
  current: any,
  answers: string[],
  entityDataCards: any[],
  propertyDataCards: any[],
): string => {
  const allCards = [...entityDataCards, ...propertyDataCards]
  const found = allCards.find((c) => answers.includes(c.id))
  console.log(found)
  console.log(current)

  if (!found) return 'incorrect'

  const currentBranches = Array.isArray(current.branch) ? current.branch : [current.branch]
  const foundBranches = Array.isArray(found.branch) ? found.branch : [found.branch]

  const hasCommonBranch = currentBranches.some((b) => foundBranches.includes(b))

  if (!hasCommonBranch) return 'Mauvaise branche'

  const isSubClasses = found.subClasses && found.subClasses.includes(current.about)

  console.log('isSubClasses', isSubClasses)
  if (hasCommonBranch && isSubClasses) {
    return 'Trop générique'
  }

  return 'Trop spécifique'
}

export function useChallengeChecker() {
  const cardInfoStore = useCardInfoStore()
  const { chapterData } = useChapterData()

  const check = async (entityDataCards: any[], propertyDataCards: any[]) => {
    const cardInfo = cardInfoStore.cardInfo
    const data = isRef(chapterData) ? chapterData.value : chapterData

    results.value = {
      eleft: getStatus(cardInfo.eleft, data.ELeftAnswer, entityDataCards, propertyDataCards),
      emiddle: getStatus(cardInfo.emiddle, data.EMiddleAnswer, entityDataCards, propertyDataCards),
      eright: getStatus(cardInfo.eright, data.ERightAnswer, entityDataCards, propertyDataCards),
      pleft: getStatus(cardInfo.pleft, data.PLeftAnswer, entityDataCards, propertyDataCards),
      pright: getStatus(cardInfo.pright, data.PRightAnswer, entityDataCards, propertyDataCards),
    }

    isComplete.value = Object.values(results.value)
      .filter((v) => v !== 'unused')
      .every((v) => v === 'correct')

    score.value = isComplete.value ? data.Score : 0
  }

  return { results, isComplete, score, check, reset }
}
