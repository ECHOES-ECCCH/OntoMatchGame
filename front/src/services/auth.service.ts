import { ref } from 'vue'
import api from './api'
import { handleApiError } from './error.handler'
import type { RegisterFormData, SignupFormData } from '@/types/form'
import { authStore } from '@/stores/auth.store'
import { langStore } from '@/stores/lang.store'

const selectedLanguage = ref(langStore.state.language)

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

interface checkUsername {
  doesExist: boolean
}

interface SignupResponse {
  code: boolean
}

interface ActivationCode {
  code: boolean
}

interface ResetLinkResponse {
  emailSent: boolean
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

export const checkUsername = async (username: string): Promise<checkUsername | null> => {
  isLoading.value = true
  try {
    const { data } = await api.get<checkUsername>(`/checkusername.php?username=${username}`)
    return data
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

export const signup = async (formData: SignupFormData): Promise<boolean> => {
  isLoading.value = true

  try {
    const { data } = await api.post<SignupResponse>('/userSave.php', {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      country: formData.country,
      countryCode: formData.countryCode,
    })
    return data.code
  } catch (error) {
    handleApiError(error)
  } finally {
    isLoading.value = false
  }
}

export const getActivationCode = async (email: string): Promise<ActivationCode> => {
  isLoading.value = true

  try {
    const { data } = await api.post('/getactivationcode.php', {
      email: email,
    })
    return data
  } catch (error) {
    handleApiError(error)
  } finally {
    isLoading.value = false
  }
}

export const sendresetlink = async (email: string, code: string): Promise<ResetLinkResponse> => {
  isLoading.value = true

  try {
    const { data } = await api.post('/sendresetlink.php', {
      email,
      code,
      lang: selectedLanguage,
    })

    return data
  } catch (error) {
    handleApiError(error)
  } finally {
    isLoading.value = false
  }
}
