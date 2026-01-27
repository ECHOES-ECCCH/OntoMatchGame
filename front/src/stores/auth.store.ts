import { ref, readonly } from 'vue'

const state = ref({ isAuthenticated: localStorage.getItem('isAuthenticated') === 'true' })

const AUTH_KEY = 'isAuthenticated'

const login = (success: boolean) => {
  state.value.isAuthenticated = success
  localStorage.setItem(AUTH_KEY, String(success))
}

const logout = () => {
  state.value.isAuthenticated = false
  localStorage.removeItem(AUTH_KEY)
}

const isAuthenticated = () => {
  return state.value.isAuthenticated
}

export const authStore = {
  state: readonly(state),
  login,
  logout,
  isAuthenticated,
}
