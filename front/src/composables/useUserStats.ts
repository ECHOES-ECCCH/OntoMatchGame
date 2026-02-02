import { ref, watch } from 'vue'
import api from '@/services/api'
import { useUserInformations } from '@/stores/userInformations.store'
import { handleApiError } from '@/services/error.handler'

export const userStats = ref(null)
export const isUsersStatsLoading = ref(false)
export const userStatsError = ref(null)

const userStore = useUserInformations()

export const fetchUserStats = async (userId: string) => {
  if (!userId) return

  isUsersStatsLoading.value = true
  userStatsError.value = null

  try {
    const { data } = await api.get(`/getuserstats.php?userId=${userId}`)
    userStats.value = data
  } catch (error) {
    handleApiError(error)
  } finally {
    isUsersStatsLoading.value = false
  }
}

watch(
  () => userStore.userInfo.userId,
  (userId) => {
    if (userId) {
      fetchUserStats(userId)
    }
  },
  { immediate: true },
)
