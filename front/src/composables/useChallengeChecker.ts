import { ref, isRef } from 'vue'
import { useCardInfoStore } from '@/stores/cardInfo.store'
import { useChapterData } from '@/composables/useChapter'
import { langStore } from '@/stores/lang.store'

const results = ref<
  Record<
    string,
    {
      status: 'correct' | 'incorrect' | 'empty' | 'unused'
      message?: string
    }
  >
>({})
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
) {
  if (!answer) return { status: 'unused' }
  if (!current) return { status: 'empty' }
  if (answer === '*') return { status: 'correct' }

  const possibleAnswers = answer.split(',').map((a) => a.trim())
  const getBranch = (about: string) => entityDataCards.find((e) => e.about === about)?.branch ?? []

  // Cas branche : les answers sont des noms de branches, pas des IDs
  const hasCommonBranch =
    current.branch && current.branch.some((b: string) => possibleAnswers.includes(b))

  const hasCommonDomain =
    !current.domain || getBranch(current.domain).some((b: string) => possibleAnswers[0] === b)
  const hasCommonRange =
    !current.range || getBranch(current.range).some((b: string) => possibleAnswers[1] === b)

  const byBranch = current.domain || current.range ? hasCommonDomain && hasCommonRange : false

  const byBranchEntity = !current.domain && !current.range ? hasCommonBranch : false

  // Cas ID : les answers sont des IDs de cartes

  const byId = possibleAnswers.includes(current.id)

  const isCorrect = byId || byBranch || byBranchEntity

  if (isCorrect) return { status: 'correct' }

  const message = getErrorDetails(current, possibleAnswers, entityDataCards, propertyDataCards)

  return {
    status: 'incorrect',
    message,
  }
}

const getErrorDetails = (
  current: any,
  answers: string[],
  entityDataCards: any[],
  propertyDataCards: any[],
): string => {
  const getBranch = (about: string) => entityDataCards.find((e) => e.about === about)?.branch ?? []
  const isBranchAnswer = !answers[0]?.match(/^[EP]\d+/)
  const isProperty = current.domain || current.range
  const isEntity = !current.domain && !current.range

  if (isBranchAnswer && isEntity) {
    const errors: string[] = []

    const hasCommonBranch =
      current.branch && current.branch.some((b: string) => answers.includes(b))

    if (!hasCommonBranch)
      errors.push(langStore.t('static-text.BoardScene.boardscene-scene-error-branch'))

    return errors.length
      ? errors.join(' | ')
      : langStore.t('static-text.BoardScene.boardscene-scene-error-specific')
  }

  if (isBranchAnswer && isProperty) {
    const errors: string[] = []

    const hasCommonDomain = !current.domain || getBranch(current.domain).includes(answers[0])

    const hasCommonRange = !current.range || getBranch(current.range).includes(answers[1])

    if (!hasCommonDomain)
      errors.push(langStore.t('static-text.BoardScene.boardscene-scene-error-domain-branch'))

    if (!hasCommonRange)
      errors.push(langStore.t('static-text.BoardScene.boardscene-scene-error-range-branch'))

    return errors.length
      ? errors.join(' | ')
      : langStore.t('static-text.BoardScene.boardscene-scene-error-specific')
  }

  // Cas ID : les answers sont des IDs de cartes
  const allCards = [...entityDataCards, ...propertyDataCards]
  const found = allCards.find((c) => answers.includes(c.id))

  if (!found) return 'incorrect'

  const errors: string[] = []

  const currentBranches = Array.isArray(current.branch) ? current.branch : [current.branch]
  const foundBranches = Array.isArray(found.branch) ? found.branch : [found.branch]
  const hasCommonBranch = currentBranches.some((b: string) => foundBranches.includes(b))

  if (!hasCommonBranch) {
    errors.push(langStore.t('static-text.BoardScene.boardscene-scene-error-branch'))
  } else if (foundBranches.subClasses?.includes(currentBranches.about)) {
    errors.push(langStore.t('static-text.BoardScene.boardscene-scene-error-generic'))
  }

  const hasCommonDomain =
    !found.domain ||
    !current.domain ||
    getBranch(current.domain).some((b: string) => getBranch(found.domain).includes(b))
  const hasCommonRange =
    !found.range ||
    !current.range ||
    getBranch(current.range).some((b: string) => getBranch(found.range).includes(b))

  if (!hasCommonDomain)
    errors.push(langStore.t('static-text.BoardScene.boardscene-scene-error-domain-branch'))
  if (!hasCommonRange)
    errors.push(langStore.t('static-text.BoardScene.boardscene-scene-error-range-branch'))

  if (hasCommonBranch && hasCommonRange && found.isSubPropertyOf?.includes(current.about)) {
    errors.push(langStore.t('static-text.BoardScene.boardscene-scene-error-generic'))
  }

  return errors.length > 0
    ? errors.join(' | ')
    : langStore.t('static-text.BoardScene.boardscene-scene-error-specific')
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
      .filter((v) => v.status !== 'unused')
      .every((v) => v.status === 'correct')

    score.value = isComplete.value ? data.Score : 0
  }

  return { results, isComplete, score, check, reset }
}
