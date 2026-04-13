<script setup lang="ts">
defineProps<{
  handleInfosModal: (display: boolean) => void
  handleCreditsModal: (display: boolean) => void
}>()
</script>

<template>
  <div class="footer-home">
    <button @click="handleInfosModal(true)">+ d'infos</button>
    <button @click="handleCreditsModal(true)">Crédits</button>
  </div>
</template>
