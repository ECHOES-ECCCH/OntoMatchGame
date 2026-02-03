import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { getUserId, getUserName } from '@/services/userInformations'

export const useUserEmail = defineStore('auth', () => {
  const email = ref(localStorage.getItem('email') || null)

  function setEmail(value: string) {
    email.value = value
    localStorage.setItem('email', value)
  }

  function clearEmail() {
    email.value = null
    localStorage.removeItem('email')
  }

  return {
    email,
    setEmail,
    clearEmail,
  }
})

export const useUserInformations = defineStore('user', () => {
  const userInfo = ref({
    userName: null,
    userId: null,
  })

  const isUserInfoLoading = ref(false)

  const authStore = useUserEmail()

  const fetchUserInfo = async () => {
    if (!authStore.email) return

    isUserInfoLoading.value = true
    try {
      const [userName, userId] = await Promise.all([
        getUserName(authStore.email),
        getUserId(authStore.email),
      ])

      userInfo.value.userName = userName
      userInfo.value.userId = userId
    } finally {
      isUserInfoLoading.value = false
    }
  }

  watch(
    () => authStore.email,
    () => {
      fetchUserInfo()
    },
    { immediate: true },
  )

  return {
    userInfo,
    isUserInfoLoading,
    fetchUserInfo,
  }
})
