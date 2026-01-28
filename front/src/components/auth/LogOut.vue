<script setup lang="ts">
import router from '@/router';
import { authStore } from '@/stores/auth.store';

const handleLogout = () => {
    authStore.logout()
    router.push("/")
}
</script>

<template>
    <button @click="handleLogout">Quitter le jeu</button>
</template>

