import { ref } from 'vue'
import api from './api'
import { handleApiError } from './error.handler'

export const isResetLoading = ref(false)

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
