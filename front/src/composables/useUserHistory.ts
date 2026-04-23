import { computed, ref, watch } from 'vue'
import { useUserInformations } from '@/stores/userInformations.store'
import { getUserHistory } from '@/services/history.service'
import scenarioCatalog from '@/assets/json/scenariiCatalog.json'

export const userHistory = ref()
export const isHistoryLoading = ref(false)
export const shouldReloadHistory = ref(false)

const userStore = useUserInformations()

const scenarii = scenarioCatalog.scenarii ?? []

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

  const scenario = scenarii.find((s) => s['scenario-title'] === userHistory.value.scenarioName)

  return scenario?.ontologyTags?.[0] ?? ''
})

watch(
  [() => userStore.userInfo.userId, shouldReloadHistory],
  ([userId, reload]) => {
    if (userId) fetchUserHistory(userId)
    if (reload) shouldReloadHistory.value = false
  },
  { immediate: true },
)
