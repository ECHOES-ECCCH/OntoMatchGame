import api from './api'
import { computed, ref } from 'vue'
import { handleApiError } from './error.handler'
import type { FreeModeBoard } from '@/types/freemode'
import { useUserInformations } from '@/stores/userInformations.store'
const userStore = useUserInformations()

export const freeModeBoard = ref()
export const freeModeBoardLoading = ref(false)
export const isCreateFreeModeBoardLoading = ref(false)
export const isError = ref(false)
export const isUpdateFreeModeBoardLoading = ref(false)
export const isDeleteFreeModeBoardLoading = ref(false)
const userId = computed(() => userStore.userInfo.userId)

export const getFreeModeBoardByName = async (ontology: string) => {
  freeModeBoardLoading.value = true
  isError.value = false

  try {
    if (!userId.value) throw new Error('User not loaded')

    const { data } = await api.get<FreeModeBoard[]>(
      `/freemode.php?ontologyName=${encodeURIComponent(ontology)}&userId=${userId.value}`,
    )

    return data.sort((a, b) => a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' }))
  } catch (error) {
    if (error) isError.value = true
    handleApiError(error)
  } finally {
    freeModeBoardLoading.value = false
  }
}

export const createFreeModeBoard = async (board: FreeModeBoard) => {
  isCreateFreeModeBoardLoading.value = true
  isError.value = false
  console.log(userId)

  if (!userId.value) throw new Error('User not loaded')

  try {
    const { data } = await api.post('/freemode.php', {
      title: board.title,
      ontologyName: board.ontologyName,
      userId: userId.value,
      freemodeData: {
        ZoomLevel: board.ZoomLevel,
        Entities: board.Entities,
        Properties: board.Properties,
        Instances: board.Instances,
      },
    })

    return data
  } catch (error) {
    if (error) isError.value = true
    handleApiError(error)
  } finally {
    isCreateFreeModeBoardLoading.value = false
  }
}

export const updateFreeModeBoard = async (updateBoard: FreeModeBoard) => {
  isUpdateFreeModeBoardLoading.value = true

  if (!userId.value) throw new Error('User not loaded')

  try {
    const { data } = await api.put('/freemode.php', {
      title: updateBoard.title,
      ontologyName: updateBoard.ontologyName,
      userId: userId.value,
      freemodeData: {
        ZoomLevel: updateBoard.ZoomLevel,
        Entities: updateBoard.Entities,
        Properties: updateBoard.Properties,
        Instances: updateBoard.Instances,
      },
    })

    return data
  } catch (error) {
    handleApiError(error)
  } finally {
    isUpdateFreeModeBoardLoading.value = false
  }
}

export const deleteFreeModeBoardById = async (freemodeId: string) => {
  isDeleteFreeModeBoardLoading.value = true
  isError.value = false

  if (!userId.value) throw new Error('User not loaded')

  try {
    const { data } = await api.delete('/freemode.php', {
      data: { id: freemodeId, userId: userId.value },
    })

    return data
  } catch (error) {
    if (error) isError.value = true
    handleApiError(error)
  } finally {
    isDeleteFreeModeBoardLoading.value = false
  }
}
