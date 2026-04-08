<script setup lang="ts">
import SignupForm from '@/components/auth/SignupForm.vue'
import { handleCheckingForm, checkUsername, isLoading, signup } from '@/services/auth.service'
import { langStore } from '@/stores/lang.store'
import type { SignupFormData } from '@/types/form'
import { ref } from 'vue'

const formData = ref<SignupFormData>({
  username: '',
  email: '',
  password: '',
  country: 'France',
  countryCode: 'FR',
})

const errors = ref<SignupFormData>({
  username: '',
  email: '',
  password: '',
  country: '',
  countryCode: '',
})

const accountCreated = ref(false)

const handleSubmit = async (data: SignupFormData) => {
  const checkUser = await checkUsername(data.username)
  if (!checkUser) return
  if (checkUser.doesExist) {
    errors.value.username = 'static-text.SignupScene.signup-scene-usernamealreadyexists-text'
    return
  }

  const checking = await handleCheckingForm(data.email)
  if (!checking) return
  if (checking.doesExist) {
    errors.value.email = 'static-text.SignupScene.signup-scene-emailalreadyexists-text'
    return
  }

  const success = await signup(data)

  if (success) {
    accountCreated.value = true
  }
}
</script>

<template>
  <section class="auth-page">
    <div class="auth-container">
      <h3>{{ langStore.t('static-text.SignupScene.signup-scene-title-text') }}</h3>
      <p v-if="accountCreated" class="accountActivated">
        {{ langStore.t('static-text.SignupScene.signup-scene-accountcreated-text') }}
      </p>
      <div class="account">
        <SignupForm v-model="formData" v-model:errors="errors" @submit="handleSubmit" :isLoading />

        <div class="signup-redirection">
          <router-link to="/">
            <p>
              {{ langStore.t('static-text.SignupScene.signup-scene-existingaccount-label') }}
            </p>
            <button>
              {{ langStore.t('static-text.SignupScene.signup-scene-signin-label') }}
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>
