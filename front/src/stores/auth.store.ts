import { ref, readonly } from 'vue'

const state = ref({ isAuthenticated: localStorage.getItem('isAuthenticated') === 'true' })

const AUTH_KEY = 'isAuthenticated'
const AUTH_EMAIL = 'email'

const login = (success: boolean, email: string) => {
  state.value.isAuthenticated = success
  localStorage.setItem(AUTH_KEY, String(success))
  localStorage.setItem(AUTH_EMAIL, email)
}

const logout = () => {
  state.value.isAuthenticated = false
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem(AUTH_EMAIL)
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
