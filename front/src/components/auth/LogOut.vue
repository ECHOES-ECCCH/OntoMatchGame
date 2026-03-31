<script setup lang="ts">
import router from '@/router'
import { authStore } from '@/stores/auth.store'
import { langStore } from '@/stores/lang.store'

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <button v-show="authStore.state.value.isAuthenticated" class="logout" @click="handleLogout">
    {{ langStore.t('static-text.MainMenuScene.mainmenu-scene-quitbutton-text') }}
  </button>
</template>
