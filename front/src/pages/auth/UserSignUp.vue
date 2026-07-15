<script setup lang="ts">
import SignupForm from '@/components/auth/SignupForm.vue'
import FooterHome from '@/components/footer/FooterHome.vue'
import { handleCheckingForm, checkUsername, isLoading, signup } from '@/services/auth.service'
import { langStore } from '@/stores/lang.store'
import type { SignupFormData } from '@/types/form'
import { ref } from 'vue'
import CreditsModal from '@/components/modals/CreditsModal.vue'
import InfosModal from '@/components/modals/InfosModal.vue'

const formData = ref<SignupFormData>({
  username: '',
  email: '',
  password: '',
  country: 'France',
  countryCode: 'FR',
})

const errors = ref({
  username: '',
  email: '',
})

const accountCreated = ref(false)
const accountCreationFailed = ref(false)
const infosModal = ref(false)
const creditsModal = ref(false)

/**
 * Handles signup form submission:
 * - checks username availability
 * - checks email availability
 * - creates account if all validations pass
 */
const handleSubmit = async (data: SignupFormData) => {
  accountCreated.value = false
  accountCreationFailed.value = false

  try {
    const checkUser = await checkUsername(data.username)
    if (!checkUser) {
      accountCreationFailed.value = true
      return
    }
    if (checkUser.doesExist) {
      errors.value.username = 'static-text.SignupScene.signup-scene-usernamealreadyexists-text'
      return
    }

    const checking = await handleCheckingForm(data.email)
    if (!checking) {
      accountCreationFailed.value = true
      return
    }
    if (checking.doesExist) {
      errors.value.email = 'static-text.SignupScene.signup-scene-emailalreadyexists-text'
      return
    }

    const success = await signup(data)
    accountCreated.value = !!success
    accountCreationFailed.value = !success
  } catch (error) {
    accountCreationFailed.value = true
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
  <div class="homepage-modal">
    <InfosModal v-if="infosModal === true" :handleInfosModal="handleInfosModal" />
    <CreditsModal v-if="creditsModal === true" :handleCreditsModal="handleCreditsModal" />
  </div>
  <section class="auth-page">
    <div class="auth-container">
      <h1>
        {{ langStore.t('static-text.SigninScene.signin-scene-title-text') }}
      </h1>
      <h3>{{ langStore.t('static-text.SignupScene.signup-scene-title-text') }}</h3>
      <p v-if="accountCreated" class="accountActivated">
        {{ langStore.t('static-text.SignupScene.signup-scene-accountcreated-text') }}
      </p>
      <p v-else-if="accountCreationFailed" class="accountActivated accountFailed">
        {{ langStore.t('static-text.SignupScene.signup-scene-accountcreatedfailed-text') }}
      </p>
      <div class="account">
        <SignupForm
          v-model="formData"
          v-model:errors="errors"
          @submit="handleSubmit"
          :isLoading="isLoading"
        />
        <span class="conditions">{{
          langStore.t('static-text.SignupScene.signup-scene-termsandconditions-text')
        }}</span>
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
    <FooterHome :handleInfosModal="handleInfosModal" :handleCreditsModal="handleCreditsModal" />
  </section>
</template>
