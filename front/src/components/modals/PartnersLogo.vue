<script setup lang="ts">
import takin from '@/assets/img/takin_logo.png'
import hn from '@/assets/img/HN_LOGO.jpg'
import indytion from '@/assets/img/indytion_logo.jpg'
import ucMerced from '@/assets/img/uc-merced_logo.png'
import masa from '@/assets/img/MASAplus_logo.png'
</script>

<template>
  <ul class="logos">
    <li><img alt="logo" :src="takin" /></li>
    <li><img alt="logo" :src="hn" /></li>
    <li><img alt="logo" :src="indytion" /></li>
    <li><img alt="logo" :src="ucMerced" /></li>
    <li><img alt="logo" :src="masa" /></li>
  </ul>
</template>
