import api from './api'
import { handleApiError } from './error.handler'

export const getLeaderboard = async () => {
  try {
    const response = await api.get('/getrankings.php')

    return response.data
  } catch (error) {
    handleApiError(error)
  }
}
