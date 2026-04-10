<script setup lang="ts">
import { langStore } from '@/stores/lang.store'
import back1 from '@/assets/img/back1.svg'
</script>

<template>
  <div class="footer">
    <button class="back">
      <router-link to="/home">
        <img :src="back1" alt="back" />
        {{ langStore.t('static-text.Footer.footer-backbutton') }}</router-link
      >
    </button>
  </div>
</template>
