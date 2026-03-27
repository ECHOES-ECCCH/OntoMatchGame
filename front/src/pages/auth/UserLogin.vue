<script setup lang="ts">
import { ref, watch } from 'vue'
import router from '@/router'
import Form from '../../components/auth/AuthForm.vue'
import ButtonLoader from '@/components/loader/ButtonLoader.vue'
import { handleCheckingForm, login, isLoading } from '@/services/auth.service'
import type { RegisterFormData } from '@/types/form'
import { authStore } from '@/stores/auth.store'
import { langStore } from '@/stores/lang.store'

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

  if (!success) {
    errors.value.password = 'static-text.SigninScene.signin-scene-wrongcombination-text'
    return
  }
}
</script>

<template>
  <ButtonLoader v-if="isLoading" />
  <section class="login-container">
    <h1>
      {{ langStore.t('static-text.SigninScene.signin-scene-title-text') }}
    </h1>
    <p>{{ langStore.t('static-text.SigninScene.signin-scene-intro-text') }}</p>
    <h3>{{ langStore.t('static-text.SigninScene.signin-scene-signin-text') }}</h3>
    <div class="account">
      <Form v-model="formData" v-model:errors="errors" @submit="handleSubmit" :isLoading></Form>
      <div class="signup-redirection">
        <router-link to="/signup">
          <p>{{ langStore.t('static-text.SigninScene.signin-scene-noaccount-label') }}</p>
          <button>
            {{ langStore.t('static-text.SigninScene.signin-scene-createbutton-label') }}
          </button>
        </router-link>
      </div>
    </div>
  </section>
</template>
