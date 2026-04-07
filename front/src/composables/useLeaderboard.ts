import { ref } from 'vue'
import { handleApiError } from '@/services/error.handler'
import { getLeaderboard } from '@/services/leaderboard.service'
import type { Leaderboard } from '@/types/leaderboard'

export const leaderboard = ref<Leaderboard | null>(null)
export const isLeaderboardLoading = ref(false)
export const leaderBoardError = ref(null)

export const fetchRanking = async () => {
  isLeaderboardLoading.value = true
  leaderBoardError.value = null

  try {
    const data = await getLeaderboard()
    leaderboard.value = data

    console.log(leaderboard.value)
  } catch (error) {
    handleApiError(error)
  } finally {
    isLeaderboardLoading.value = false
  }
}
