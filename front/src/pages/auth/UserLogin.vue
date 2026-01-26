<script setup lang="ts">
import { ref, watch } from 'vue'
import Form from '../../components/auth/AuthForm.vue'
import { handleCheckingForm, login } from '@/services/auth.service'
import router from '@/router'
import type { RegisterFormData } from '@/types/form'
import { authStore } from '@/stores/auth.store'
import { langStore } from '@/stores/lang.store'

const formData = ref<RegisterFormData>({
  email: '',
  password: '',
})

const selectedLanguage = ref(langStore.state.language)

watch(selectedLanguage, (newLang) => {
  langStore.handleLanguage(newLang)
})

const handleSubmit = async (data: RegisterFormData) => {
  const checking = await handleCheckingForm(data.email)

  if (!checking) return

  if (!checking.isActive) return

  const success = await login(data)

  if (success && authStore.state.isAuthenticated) {
    router.push('/home')
  }
}
</script>

<template>
  <h1>OnToMatchGame</h1>
  <div>
    <label>Français</label>
    <input name="language" type="radio" value="fr" v-model="selectedLanguage" />
    <label>English</label>
    <input name="language" type="radio" value="en" v-model="selectedLanguage" />
  </div>
  <Form v-model="formData" @submit="handleSubmit"></Form>
</template>
