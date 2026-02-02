import { ref } from 'vue'
import api from './api'
import { handleApiError } from './error.handler'
import { fetchUserStats } from '@/composables/useUserStats'

export const isResetLoading = ref(false)
export const isResetProgressionLoading = ref(false)

export const resetGame = async (userId: string) => {
  isResetLoading.value = true
  try {
    const { data } = await api.get(`/resetgame.php?userId=${userId}`)
    return data
  } catch (error) {
    handleApiError(error)
  } finally {
    isResetLoading.value = false
  }
}

export const resetProgression = async ({ userId, currentScenario, currentChapter }) => {
  isResetProgressionLoading.value = true
  try {
    const { data } = await api.post('/resetprogression.php', {
      userId: userId,
      currentScenario: currentScenario,
      currentChapter: currentChapter,
    })

    if (data.result === true) {
      await fetchUserStats(userId)
    }

    return data
  } catch (error) {
    handleApiError(error)
  } finally {
    isResetProgressionLoading.value = false
  }
}
