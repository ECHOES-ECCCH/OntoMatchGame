import { ref } from 'vue'
import api from './api'
import { handleApiError } from './error.handler'

export const isLoading = ref(false)

export const getUserName = async (email: string) => {
  isLoading.value = true

  try {
    const { data } = await api.get(`/getusername.php?email=${email}`)
    return data.username
  } catch (error) {
    handleApiError(error)
  } finally {
    isLoading.value = false
  }
}

export const getUserId = async (email: string) => {
  isLoading.value = true

  try {
    const { data } = await api.get(`/getuserid.php?email=${email}`)
    return data.userId
  } catch (error) {
    handleApiError(error)
  } finally {
    isLoading.value = false
  }
}
