import type { CreateSessionData } from '@/types/session'
import api from './api'
import { ref } from 'vue'
import { handleApiError } from './error.handler'
import { shouldReloadHistory } from '@/composables/useUserHistory'

export const isCreateSessionLoading = ref(false)

export const createSession = async (createSessionData: CreateSessionData) => {
  isCreateSessionLoading.value = true

  try {
    const { data } = await api.post('/createsession.php', {
      userId: createSessionData.userId,
      scenarioTitle: createSessionData.scenarioTitle,
      chapterTitle: createSessionData.chapterTitle,
    })

    if (data.result) {
      shouldReloadHistory.value = true
    }

    return data
  } catch (error) {
    handleApiError(error)
  } finally {
    isCreateSessionLoading.value = false
  }
}
