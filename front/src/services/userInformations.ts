import api from './api'
import { handleApiError } from './error.handler'

export const getUserName = async (email: string) => {
  try {
    const { data } = await api.get(`/getusername.php?email=${email}`)
    return data.username
  } catch (error) {
    handleApiError(error)
  }
}

export const getUserId = async (email: string) => {
  try {
    const { data } = await api.get(`/getuserid.php?email=${email}`)
    return data.userId
  } catch (error) {
    handleApiError(error)
  }
}
