<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import { ref, watch } from 'vue'

const selectedLanguage = ref(langStore.state.language)

watch(selectedLanguage, (newLang) => {
  langStore.handleLanguage(newLang)
})
</script>

<template>
  <div class="language">
    <button
      :class="selectedLanguage === 'fr' && 'selectedlanguage'"
      value="fr"
      @click="selectedLanguage = 'fr'"
    >
      FR
    </button>
    |
    <button
      :class="selectedLanguage === 'en' && 'selectedlanguage'"
      value="en"
      @click="selectedLanguage = 'en'"
    >
      EN
    </button>
  </div>
</template>
