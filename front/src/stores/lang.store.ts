import { readonly, ref, computed } from 'vue'
import fr from '@/assets/json/fr/lang-fr.json'
import en from '@/assets/json/en/lang-en.json'

const messages = { fr, en }

const AUTH_KEY = 'language'

type Language = keyof typeof messages

const language = ref<Language>((localStorage.getItem(AUTH_KEY) as Language) || 'fr')

const translations = computed(() => {
  return messages[language.value] || messages.fr
})

const handleLanguage = (lang: Language) => {
  language.value = lang
  localStorage.setItem(AUTH_KEY, lang)
}

const t = (key: string): string => {
  return (
    (key.split('.').reduce<unknown>((o, i) => {
      if (o && typeof o === 'object' && i in o) {
        return (o as Record<string, unknown>)[i]
      }
      return undefined
    }, translations.value) as string) ?? ''
  )
}

export const langStore = {
  handleLanguage,
  state: readonly({ language }),
  t,
}
