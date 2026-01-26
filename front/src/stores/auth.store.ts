import { reactive, readonly } from 'vue'

const state = reactive({ isAuthenticated: localStorage.getItem('isAuthenticated') === 'true' })

const AUTH_KEY = 'isAuthenticated'

const login = (success: boolean) => {
  state.isAuthenticated = success
  localStorage.setItem(AUTH_KEY, String(success))
}

const logout = () => {
  state.isAuthenticated = false
  localStorage.removeItem(AUTH_KEY)
}

const isAuthenticated = () => {
  return state.isAuthenticated
}

export const authStore = {
  state: readonly(state),
  login,
  logout,
  isAuthenticated,
}
