<script setup lang="ts">

const props = defineProps({
  modelValue: Object
})

const emit = defineEmits(['update:modelValue', 'submit'])

const updateField = (field: string, value: string) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value})
}

const submitForm = () => {
  emit('submit', props.modelValue)
}
</script>

<template>
  <form @submit.prevent="submitForm">
    <label>email</label>
      <input
        type="email"
        :value="modelValue?.email"
        @input="updateField('email', ($event.target as HTMLInputElement).value)"
        placeholder="email"
        required
      />
    <label>Mot de passe</label>
    <input type="password" :value="modelValue?.password" @input="updateField('password', ($event.target as HTMLInputElement).value)" placeholder="password" required />

    <button type="submit">Se connecter</button>
  </form>
</template>
