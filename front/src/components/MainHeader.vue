<script setup lang="ts">
import logo from '@/assets/img/logo.png'
import LogOut from './auth/LogOut.vue'
import LanguageSelection from './LanguageSelection.vue'
</script>

<template>
  <header class="main-header">
    <div class="game-title">
      <span><img :src="logo" /></span>
      <h1>OntoMatchGame</h1>
    </div>
    <div class="header-right">
      <LanguageSelection />
      <LogOut />
    </div>
  </header>
</template>
