<script setup lang="ts">
import { ref, watch } from 'vue'
import router from '@/router'
import Form from '../../components/auth/AuthForm.vue'
import ButtonLoader from '@/components/loader/ButtonLoader.vue'
import { handleCheckingForm, login, isLoading } from '@/services/auth.service'
import type { RegisterFormData } from '@/types/form'
import { authStore } from '@/stores/auth.store'
import { langStore } from '@/stores/lang.store'
import LanguageSelection from '@/components/LanguageSelection.vue'

const formData = ref<RegisterFormData>({
  email: '',
  password: '',
})

const errors = ref<RegisterFormData>({
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

  if (!checking.doesExist) {
    errors.value.email = 'static-text.SigninScene.signin-scene-wrongemail-text'
    return
  }

  if (!checking.isActive) {
    errors.value.email = 'static-text.SigninScene.signin-scene-accountnotactivated-text'
    return
  }

  const success = await login(data)
  if (success && authStore.state.value.isAuthenticated) {
    router.push('/home')
  }
}
</script>

<template>
  <ButtonLoader v-if="isLoading" />
  <h1>
    {{ langStore.t('static-text.SigninScene.signin-scene-title-text') }}
  </h1>
  <p>{{ langStore.t('static-text.SigninScene.signin-scene-intro-text') }}</p>
  <LanguageSelection />
  <Form v-model="formData" v-model:errors="errors" @submit="handleSubmit" :isLoading></Form>
  <router-link to="/signup">
    <label>{{ langStore.t('static-text.SigninScene.signin-scene-noaccount-label') }}</label>
    <button>
      {{ langStore.t('static-text.SigninScene.signin-scene-createbutton-label') }}
    </button>
  </router-link>
</template>
