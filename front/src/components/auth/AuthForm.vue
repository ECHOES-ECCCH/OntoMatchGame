<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import ButtonLoader from '../loader/ButtonLoader.vue'

const props = defineProps({
  modelValue: Object,
  errors: Object,
  isLoading: Boolean,
})

const emit = defineEmits(['update:modelValue', 'update:errors', 'submit'])

const updateField = (field: string, value: string) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })

  // Delete error message if field is modified
  if (props.errors && props.errors[field]) {
    emit('update:errors', { ...props.errors, [field]: '' })
  }
}
const submitForm = () => {
  emit('submit', props.modelValue)
}
</script>

<template>
  <form class="login-form" @submit.prevent="submitForm">
    <div class="form-field">
      <label for="email">
        {{ langStore.t('static-text.SigninScene.signin-scene-email-label') }}
      </label>
      <input
        type="email"
        id="email"
        name="email"
        :value="modelValue?.email"
        @input="updateField('email', ($event.target as HTMLInputElement).value)"
        :placeholder="langStore.t('static-text.SigninScene.signin-scene-email-placeholder-text')"
        required
      />
      <p v-if="errors?.email" id="email-error" class="error-form">
        {{ langStore.t(errors.email) }}
      </p>
    </div>
    <div class="form-field">
      <label for="password">
        {{ langStore.t('static-text.SigninScene.signin-scene-password-label') }}
      </label>
      <input
        type="password"
        id="password"
        name="password"
        :value="modelValue?.password"
        @input="updateField('password', ($event.target as HTMLInputElement).value)"
        :placeholder="langStore.t('static-text.SigninScene.signin-scene-password-placeholder-text')"
        minlength="6"
        required
      />
      <p v-if="errors?.password" id="password-error" class="error-form">
        {{ langStore.t(errors.password) }}
      </p>
    </div>
    <div class="forgot-password">
      <RouterLink to="/forgot-password">
        {{ langStore.t('static-text.SigninScene.signin-scene-forgotpassword-text') }}
      </RouterLink>
    </div>
    <button class="submit" type="submit">
      <ButtonLoader
        v-if="isLoading"
        :text="langStore.t('static-text.SigninScene.signin-scene-waitingmessage-text')"
      />
      <span v-else>{{ langStore.t('static-text.SigninScene.signin-scene-okbutton-text') }}</span>
    </button>
  </form>
</template>
