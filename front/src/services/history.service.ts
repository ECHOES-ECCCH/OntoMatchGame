import { ref } from 'vue'
import api from './api'
import { handleApiError } from './error.handler'

export const isLoading = ref(false)

export const getUserHistory = async (userId: string) => {
  isLoading.value = true
  try {
    const { data } = await api.get(`/gethistory.php?userId=${userId}`)
    return data
  } catch (error) {
    handleApiError(error)
  } finally {
    isLoading.value = false
  }
}
