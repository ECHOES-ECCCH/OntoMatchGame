import api from './api'
import { handleApiError } from './error.handler'

export const getUserStats = async () => {
  try {
    const { data } = await api.get(`/getuserstats.php`)

    return data
  } catch (error) {
    handleApiError(error)
  }
}
