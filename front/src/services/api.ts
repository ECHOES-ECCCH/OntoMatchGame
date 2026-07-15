import axios from 'axios'
import router from '@/router'
import { authStore } from '@/stores/auth.store'
import { useUserInformations } from '@/stores/userInformations.store'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

// The PHP session backing a "connected" tab can die server-side (GC,
// restart, ...) while the front-end still believes the user is logged in,
// since isAuthenticated/userId are cached in localStorage independently of
// the session cookie. Any 401 from the API means the server no longer
// recognizes the session, so bring the client-side state back in sync
// instead of leaving the UI stuck showing a "connected" user whose calls
// keep failing.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      authStore.logout()
      useUserInformations().clearUserInfo()
      if (router.currentRoute.value.path !== '/') {
        router.push('/')
      }
    }
    return Promise.reject(error)
  },
)

export default api
