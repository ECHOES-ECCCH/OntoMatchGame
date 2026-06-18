import { defineStore } from 'pinia'
import { ref } from 'vue'

const USER_ID_KEY = 'userId'
const USER_NAME_KEY = 'userName'

export const useUserInformations = defineStore('user', () => {
  const userInfo = ref({
    userName: localStorage.getItem(USER_NAME_KEY) as string | null,
    userId: localStorage.getItem(USER_ID_KEY) as string | null,
  })

  const isUserInfoLoading = ref(false)

  function setUserInfo(userId: string, userName: string) {
    userInfo.value.userId = userId
    userInfo.value.userName = userName
    localStorage.setItem(USER_ID_KEY, userId)
    localStorage.setItem(USER_NAME_KEY, userName)
  }

  function clearUserInfo() {
    userInfo.value.userId = null
    userInfo.value.userName = null
    localStorage.removeItem(USER_ID_KEY)
    localStorage.removeItem(USER_NAME_KEY)
  }

  return {
    userInfo,
    isUserInfoLoading,
    setUserInfo,
    clearUserInfo,
  }
})
