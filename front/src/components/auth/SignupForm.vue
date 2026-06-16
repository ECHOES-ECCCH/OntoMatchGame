<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import ButtonLoader from '../loader/ButtonLoader.vue'

// List of available countries (static JSON file)
import countriesList from '../../../public/json/countries.json'

const props = defineProps({
  modelValue: Object,
  errors: Object,
  isLoading: Boolean,
})

const emit = defineEmits(['update:modelValue', 'update:errors', 'submit'])

/**
 * Update form fields dynamically
 *
 * Special case:
 * - country is stored as { name, code } instead of raw string
 */
const updateField = (field: string, value: string) => {
  // COUNTRY HANDLING (needs JSON parsing)
  if (field === 'country') {
    const { code, name } = JSON.parse(value)
    emit('update:modelValue', {
      ...props.modelValue,
      country: name,
      countryCode: code,
    })
    return
  }
  emit('update:modelValue', { ...props.modelValue, [field]: value })

  // Clear error when user modifies a field
  if (props.errors && props.errors[field]) {
    emit('update:errors', { ...props.errors, [field]: '' })
  }
}
const submitForm = () => {
  emit('submit', props.modelValue)
}
</script>

<template>
  <form class="auth-form" @submit.prevent="submitForm">
    <div class="form-field">
      <label for="username">
        {{ langStore.t('static-text.SignupScene.signup-scene-username-label') }}
      </label>
      <input
        type="username"
        id="username"
        name="username"
        autocomplete="current-password"
        @input="updateField('username', ($event.target as HTMLInputElement).value)"
        :placeholder="langStore.t('static-text.SignupScene.signup-scene-username-placeholder-text')"
        required
      />
      <p v-if="errors?.username" id="username-error" class="error-form">
        {{ langStore.t(errors.username) }}
      </p>
    </div>
    <div class="form-field">
      <label for="email">
        {{ langStore.t('static-text.SignupScene.signup-scene-email-label') }}
      </label>
      <input
        type="email"
        id="email"
        name="email"
        autocomplete="current-email"
        @input="updateField('email', ($event.target as HTMLInputElement).value)"
        :placeholder="langStore.t('static-text.SignupScene.signup-scene-email-placeholder-text')"
        required
      />
      <p v-if="errors?.email" id="email-error" class="error-form">
        {{ langStore.t(errors.email) }}
      </p>
    </div>
    <div class="form-field">
      <label for="password">
        {{ langStore.t('static-text.SignupScene.signup-scene-password-label') }}
      </label>
      <input
        type="password"
        id="password"
        name="password"
        autocomplete="current-password"
        @input="updateField('password', ($event.target as HTMLInputElement).value)"
        :placeholder="langStore.t('static-text.SignupScene.signup-scene-password-placeholder-text')"
        minlength="6"
        required
      />
      <p v-if="errors?.password" id="password-error" class="error-form">
        {{ langStore.t(errors.password) }}
      </p>
    </div>
    <div class="form-field">
      <label for="country">
        {{ langStore.t('static-text.SignupScene.signup-scene-country-label') }}
      </label>
      <select
        id="country"
        name="country"
        @change="updateField('country', ($event.target as HTMLInputElement).value)"
        :placeholder="langStore.t('static-text.SigninScene.signup-scene-country-label')"
        required
      >
        <optgroup>
          <option value='{"code":"FR","name":"France"}'>France</option>
        </optgroup>
        <optgroup label="Pays">
          <option
            v-for="country in countriesList.countries"
            :value="JSON.stringify({ code: country.code, name: country.name })"
            :key="country.code"
          >
            {{ country.name }}
          </option>
        </optgroup>
      </select>
    </div>
    <button class="submit" type="submit">
      <ButtonLoader
        v-if="isLoading"
        :text="langStore.t('static-text.SignupScene.signup-scene-waitingmessage-text')"
      />
      <span v-else>{{
        langStore.t('static-text.SignupScene.signup-scene-registerbutton-text')
      }}</span>
    </button>
  </form>
</template>
