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

watch(
  [() => userStore.userInfo.userId, shouldReloadHistory],
  ([userId, reload]) => {
    if (userId) fetchUserHistory(userId)
    if (reload) shouldReloadHistory.value = false
  },
  { immediate: true },
)
