import type { CreateSessionData, UpdateSessionData } from '@/types/session'
import api from './api'
import { ref } from 'vue'
import { handleApiError } from './error.handler'
import { shouldReloadHistory } from '@/composables/useUserHistory'
import { fetchUserStats } from '@/composables/useUserStats'

export const isCreateSessionLoading = ref(false)
export const isUpdateSessionLoading = ref(false)

export const createSession = async (createSessionData: CreateSessionData) => {
  isCreateSessionLoading.value = true

  try {
    const { data } = await api.post('/createsession.php', {
      userId: createSessionData.userId,
      scenarioTitle: createSessionData.scenarioTitle,
      chapterTitle: createSessionData.chapterTitle,
    })

    if (data.result && createSessionData.userId) {
      shouldReloadHistory.value = true
      fetchUserStats(createSessionData.userId)
    }

    return data
  } catch (error) {
    handleApiError(error)
  } finally {
    isCreateSessionLoading.value = false
  }
}

export const updateSession = async (updateSessionData: UpdateSessionData) => {
  isUpdateSessionLoading.value = true

  try {
    const { data } = await api.put('/updatesession.php', {
      userId: updateSessionData.userId,
      currentScenario: updateSessionData.currentScenario,
      currentChapter: updateSessionData.currentChapter,
      currentChallengeIndex: updateSessionData.currentChallengeIndex,
      currentScore: updateSessionData.currentScore,
    })

    if (data.result && updateSessionData.userId) {
      shouldReloadHistory.value = true
      fetchUserStats(updateSessionData.userId)
    }

    return data
  } catch (error) {
    handleApiError(error)
  } finally {
    isUpdateSessionLoading.value = false
  }
}
