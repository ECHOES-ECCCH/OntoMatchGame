<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
</script>

<template>
  <button>
    <router-link to="/home"> {{ langStore.t('static-text.Footer.footer-backbutton') }}</router-link>
  </button>
</template>
