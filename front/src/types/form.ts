export interface RegisterFormData {
  email: string
  password: string
}

export interface SignupFormData {
  username: string
  email: string
  password: string
  country: string
  countryCode: string
}

export interface ResetPasswordFormData {
  email: string
}
