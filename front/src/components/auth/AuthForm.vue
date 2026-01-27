<script setup lang="ts">
import { langStore } from '@/stores/lang.store'

const props = defineProps({
  modelValue: Object,
  errors: Object,
})

const emit = defineEmits(['update:modelValue', 'update:errors', 'submit'])

const updateField = (field: string, value: string) => {
  // Met à jour la valeur
  emit('update:modelValue', { ...props.modelValue, [field]: value })

  if (props.errors && props.errors[field]) {
    emit('update:errors', { ...props.errors, [field]: '' })
  }
}
const submitForm = () => {
  emit('submit', props.modelValue)
}
</script>

<template>
  <form @submit.prevent="submitForm">
    <label>
      {{ langStore.t('static-text.SigninScene.signin-scene-email-label') }}
    </label>
    <input
      type="email"
      :value="modelValue?.email"
      @input="updateField('email', ($event.target as HTMLInputElement).value)"
      placeholder="email"
      required
    />
    <p v-if="errors?.email" id="email-error" class="error">
      {{ langStore.t(errors.email) }}
    </p>
    <label>
      {{ langStore.t('static-text.SigninScene.signin-scene-password-label') }}
    </label>
    <input
      type="password"
      :value="modelValue?.password"
      @input="updateField('password', ($event.target as HTMLInputElement).value)"
      placeholder="password"
      minlength="6"
      required
    />
    <p v-if="errors?.email" id="email-error" class="error">
      {{ langStore.t(errors.password) }}
    </p>
    <button type="submit">
      {{ langStore.t('static-text.SigninScene.signin-scene-okbutton-text') }}
    </button>
  </form>
</template>
