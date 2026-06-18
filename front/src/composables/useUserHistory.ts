import { computed, ref, watch } from 'vue'
import { useUserInformations } from '@/stores/userInformations.store'
import { getUserHistory } from '@/services/history.service'

export const userHistory = ref()
export const isHistoryLoading = ref(false)
export const shouldReloadHistory = ref(false)

const userStore = useUserInformations()

const fetchUserHistory = async (userId: string) => {
  if (!userId) return
  isHistoryLoading.value = true
  try {
    const data = await getUserHistory(userId)
    userHistory.value = data
  } finally {
    isHistoryLoading.value = false
  }
}

export const userOntology = computed<string>(() => {
  if (!userHistory.value) return ''

  return userHistory.value.ontologyName
})

/**
 * Reload history whenever:
 * - the connected user changes
 * - a manual refresh is requested
 */
watch(
  () => userStore.userInfo.userId,
  (userId) => {
    if (userId) fetchUserHistory(userId)
  },
  { immediate: true },
)

watch(shouldReloadHistory, (reload) => {
  if (!reload) return
  const userId = userStore.userInfo.userId
  if (userId) fetchUserHistory(userId)
  shouldReloadHistory.value = false
})
