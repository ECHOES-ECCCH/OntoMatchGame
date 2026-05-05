<script setup lang="ts">
import logo from '../assets/img/OMG_logo.png'
</script>

<template>
  <section class="not-found">
    <div>
      <h1>Page not found</h1>
      <img :src="logo" />
      <router-link to="/"><button class="next-button">Home</button></router-link>
    </div>
  </section>
</template>
