<script setup lang="ts">
import logo from '@/assets/img/logo.png'
import LogOut from './auth/LogOut.vue'
</script>

<template>
  <header>
    <img :src="logo" />
    <h1>OntoMatchGame</h1>
    <LogOut />
  </header>
</template>
