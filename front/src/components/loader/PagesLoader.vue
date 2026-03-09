<script setup lang="ts">
import logo from '@/assets/img/logo-g.png'
</script>

<template>
  <div class="loader-wrapper">
    <div class="loader">
      <div class="loader-center">
        <img :src="logo" alt="logo" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.loader-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.85); /* blanc légèrement transparent */
  z-index: 9999;
}

.loader {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: spin 1.2s linear infinite;
  background: conic-gradient(var(--main-color1), #ffcf87, var(--main-color1));
}

.loader-center {
  width: 180px;
  height: 180px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-center img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
