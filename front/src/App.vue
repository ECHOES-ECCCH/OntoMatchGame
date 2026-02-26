<script setup lang="ts">
import MainHeader from './components/MainHeader.vue'
// import { onMounted, onUnmounted } from 'vue'

// onMounted(() => {
//   let lastScroll = 0
//   const header = document.querySelector('header.main-header')

//   const handleScroll = (e: Event) => {
//     const target = e.target as HTMLElement
//     const current = target.scrollTop ?? window.scrollY
//     header?.classList.toggle('header-hidden', current > lastScroll && current > 60)
//     lastScroll = current
//   }

//   document.addEventListener('scroll', handleScroll, { capture: true })
//   onUnmounted(() => document.removeEventListener('scroll', handleScroll, { capture: true }))
// })
</script>
<template>
  <MainHeader />
  <RouterView />
</template>

<style scoped></style>
