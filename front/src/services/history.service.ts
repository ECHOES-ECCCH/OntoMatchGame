import api from './api'
import { handleApiError } from './error.handler'

export const getUserHistory = async (userId: string) => {
  try {
    const { data } = await api.get(`/gethistory.php?userId=${userId}`)
    return data
  } catch (error) {
    handleApiError(error)
  }
}
