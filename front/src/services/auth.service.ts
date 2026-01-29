import { ref } from 'vue'
import api from './api'
import { handleApiError } from './error.handler'

import type { RegisterFormData } from '@/types/form'
import { authStore } from '@/stores/auth.store'

interface CheckEmailResponse {
  doesExist: boolean
}

interface CheckStatusResponse {
  isActive: boolean
}

interface CheckingResult {
  doesExist: boolean
  isActive: boolean
}

interface LoginResponse {
  login: boolean
}
export const isLoading = ref(false)

const checkStatus = async (email: string): Promise<CheckStatusResponse | null> => {
  isLoading.value = true
  try {
    const { data } = await api.get<CheckStatusResponse>(`/checkstatus.php?email=${email}`)
    return data
  } catch (error) {
    handleApiError(error)
  } finally {
    isLoading.value = false
  }
}

export const handleCheckingForm = async (email: string): Promise<CheckingResult | null> => {
  isLoading.value = true

  try {
    const { data } = await api.get<CheckEmailResponse>(`/checkemail.php?email=${email}`)
    if (!data.doesExist) return { doesExist: false, isActive: false }

    const status = await checkStatus(email)
    if (!status) return { doesExist: true, isActive: false }

    return { doesExist: true, isActive: status.isActive }
  } catch (error) {
    handleApiError(error)
  } finally {
    isLoading.value = false
  }
}

export const login = async (formData: RegisterFormData): Promise<boolean> => {
  isLoading.value = true

  try {
    const { data } = await api.post<LoginResponse>('/login.php', {
      email: formData.email,
      password: formData.password,
    })

    authStore.login(data.login, formData.email)
    return data.login
  } catch (error) {
    handleApiError(error)
  } finally {
    isLoading.value = false
  }
}
