<script setup lang="ts">
import { ref } from 'vue'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm.vue'
import ButtonLoader from '@/components/loader/ButtonLoader.vue'
import { langStore } from '@/stores/lang.store'
import {
  handleCheckingForm,
  isLoading,
  getActivationCode,
  sendresetlink,
} from '@/services/auth.service'
import type { ResetPasswordFormData } from '@/types/form'

const formData = ref<ResetPasswordFormData>({
  email: '',
})

const errors = ref<ResetPasswordFormData>({
  email: '',
})

const emailSent = ref(false)

const handleSubmit = async (data: ResetPasswordFormData) => {
  const checking = await handleCheckingForm(data.email)
  if (!checking) return

  if (!checking.doesExist) {
    errors.value.email = 'static-text.ResetPasswordScene.resetpassword-scene-noaccount-text'
    return
  }

  if (!checking.isActive) {
    errors.value.email = 'static-text.ResetPasswordScene.resetpassword-scene-notactivated-text'
    return
  }

  if (checking.doesExist && checking.isActive) {
    const activationCode = await getActivationCode(data.email)

    if (!isLoading.value && typeof activationCode.code === 'string') {
      const success = await sendresetlink(data.email, activationCode.code)
      if (success.emailSent) {
        emailSent.value = true
      }
    }
  }
}
</script>

<template>
  <ButtonLoader v-if="isLoading" />
  <section class="auth-page">
    <div class="auth-container">
      <h1>
        {{ langStore.t('static-text.SigninScene.signin-scene-title-text') }}
      </h1>
      <h3>{{ langStore.t('static-text.ResetPasswordScene.resetpassword-scene-title-text') }}</h3>
      <p>{{ langStore.t('static-text.ResetPasswordScene.resetpassword-scene-intro-text') }}</p>
      <p v-if="emailSent" class="accountActivated">
        {{
          langStore.t('static-text.ResetPasswordScene.resetpassword-scene-confirmationmessage-text')
        }}
      </p>
      <div class="account">
        <ResetPasswordForm
          v-model="formData"
          v-model:errors="errors"
          @submit="handleSubmit"
          :isLoading
        />
        <div class="signup-redirection">
          <router-link to="/">
            <p>{{ langStore.t('static-text.SignupScene.signup-scene-existingaccount-label') }}</p>
            <button>
              {{ langStore.t('static-text.SignupScene.signup-scene-signin-label') }}
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>
