import axios from 'axios'

export interface ApiError {
  status: number
  message: string
}

export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    throw {
      status: error.response?.status ?? 0,
      message: error.response?.data?.message ?? 'Erreur serveur',
    }
  }

  throw {
    status: 0,
    message: 'Erreur inconnue',
  }
}
