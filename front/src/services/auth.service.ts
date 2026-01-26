import type { RegisterFormData } from '@/types/form'
import axios from 'axios'
import api from './api'
import { authStore } from '@/stores/auth.store'

interface CheckEmailResponse {
  doesExist: boolean
}

interface CheckStatusResponse {
  isActive: boolean
}

interface LoginResponse {
  login: boolean
}

const checkStatus = async (email: string): Promise<CheckStatusResponse | null> => {
  try {
    const { data } = await api.get<CheckStatusResponse>(`/checkstatus.php?email=${email}`)
    return data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(err.response?.data, err.message)
    }
    return null
  }
}

export const handleCheckingForm = async (email: string): Promise<CheckStatusResponse | null> => {
  try {
    const { data } = await api.get<CheckEmailResponse>(`/checkemail.php?email=${email}`)

    if (!data.doesExist) return null

    return await checkStatus(email)
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(err.response?.data, err.message)
    }
    return null
  }
}

export const login = async (formData: RegisterFormData): Promise<boolean> => {
  try {
    const { data } = await api.post<LoginResponse>('/login.php', {
      email: formData.email,
      password: formData.password,
    })

    authStore.login(data.login)
    return data.login
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(err.response?.data, err.message)
    }
    return false
  }
}
