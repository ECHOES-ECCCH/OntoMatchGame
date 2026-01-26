import { reactive, readonly } from 'vue'

const state = reactive({
  language: localStorage.getItem('language') || 'fr',
})

const AUTH_KEY = 'selectedLanguage'

const handleLanguage = (lang: string) => {
  state.language = lang
  localStorage.setItem(AUTH_KEY, lang)
}

export const langStore = {
  handleLanguage,
  state: readonly(state),
}
