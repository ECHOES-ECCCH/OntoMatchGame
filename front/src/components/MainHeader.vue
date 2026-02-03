<script setup lang="ts">
import logo from '@/assets/img/logo.png'
import LogOut from './auth/LogOut.vue'
</script>

<template>
  <header class="main-header">
    <div class="game-title">
      <span><img :src="logo" /></span>
      <h1>OntoMatchGame</h1>
    </div>
    <LogOut />
  </header>
</template>
