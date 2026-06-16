<script setup lang="ts">
import { ref, watch } from 'vue'
import router from '@/router'
import Form from '../../components/auth/AuthForm.vue'
import ButtonLoader from '@/components/loader/ButtonLoader.vue'
import { handleCheckingForm, login, isLoading } from '@/services/auth.service'
import type { RegisterFormData } from '@/types/form'
import { authStore } from '@/stores/auth.store'
import { langStore } from '@/stores/lang.store'
import CreditsModal from '@/components/modals/CreditsModal.vue'
import InfosModal from '@/components/modals/InfosModal.vue'
import FooterHome from '@/components/footer/FooterHome.vue'

const formData = ref<RegisterFormData>({
  email: '',
  password: '',
})

const errors = ref<RegisterFormData>({
  email: '',
  password: '',
})

const infosModal = ref(false)
const creditsModal = ref(false)

const selectedLanguage = ref(langStore.state.language)

watch(selectedLanguage, (newLang) => {
  langStore.handleLanguage(newLang)
})

/**
 * Handles login form submission:
 * - validates email existence and account status
 * - attempts authentication
 * - redirects on success
 * - sets error messages on failure
 */
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

const handleInfosModal = (display: boolean) => {
  infosModal.value = display
  creditsModal.value = false
}

const handleCreditsModal = (display: boolean) => {
  creditsModal.value = display
  infosModal.value = false
}
</script>

<template>
  <ButtonLoader v-if="isLoading" />
  <div class="homepage-modal">
    <InfosModal v-if="infosModal === true" :handleInfosModal="handleInfosModal" />
    <CreditsModal v-if="creditsModal === true" :handleCreditsModal="handleCreditsModal" />
  </div>
  <section class="auth-page">
    <div class="auth-container">
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
    </div>
    <FooterHome :handleInfosModal="handleInfosModal" :handleCreditsModal="handleCreditsModal" />
  </section>
</template>
