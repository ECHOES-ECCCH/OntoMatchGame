import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserInformations = defineStore('user', () => {
  const userInfo = ref({
    userName: null as string | null,
    userId: null as string | null,
  })

  const isUserInfoLoading = ref(false)

  function setUserInfo(userId: string, userName: string) {
    userInfo.value.userId = userId
    userInfo.value.userName = userName
  }

  function clearUserInfo() {
    userInfo.value.userId = null
    userInfo.value.userName = null
  }

  return {
    userInfo,
    isUserInfoLoading,
    setUserInfo,
    clearUserInfo,
  }
})
