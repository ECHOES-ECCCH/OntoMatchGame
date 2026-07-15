<script setup lang="ts">
import echoes from '@/assets/img/ECHOES_logo.png'
import takin from '@/assets/img/takin_logo.png'
import hn from '@/assets/img/HN_logo.jpg'
import indytion from '@/assets/img/indytion_logo.jpg'
import ucMerced from '@/assets/img/uc-merced_logo.png'
import masa from '@/assets/img/MASAplus_logo.png'
</script>

<template>
  <ul class="logos">
    <li><a class="logo-link" href="https://www.echoes-eccch.eu/" target="_blank"><img alt="logo" :src="echoes" /></a></li>
    <li><a class="logo-link" href="https://www.takinsolutions.com/" target="_blank"><img alt="logo" :src="takin" /></a></li>
    <li><a class="logo-link" href="https://www.huma-num.fr/" target="_blank"><img alt="logo" :src="hn" /></a></li>
    <li><a class="logo-link" href="" target="_blank"><img alt="logo" :src="indytion" /></a></li>
    <li><a class="logo-link" href="https://www.ucmerced.edu/" target="_blank"><img alt="logo" :src="ucMerced" /></a></li>
    <li><a class="logo-link" href="https://masa.hypotheses.org/" target="_blank"><img alt="logo" :src="masa" /></a></li>
  </ul>
</template>
