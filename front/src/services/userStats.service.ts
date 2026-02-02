import api from './api'
import { handleApiError } from './error.handler'
import { useUserInformations } from '@/stores/userInformations.store'
const userStore = useUserInformations()

export const getUserStats = async () => {
  try {
    const { data } = await api.get(`/getuserstats.php?userId=${userStore.userInfo.userId}`)
    return data
  } catch (error) {
    handleApiError(error)
  }
}
