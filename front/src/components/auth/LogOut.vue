<script setup lang="ts">
import router from '@/router'
import { authStore } from '@/stores/auth.store'
import close from '@/assets/img/close.svg'

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <button class="logout" @click="handleLogout"><img :src="close" /> Quitter le jeu</button>
</template>
