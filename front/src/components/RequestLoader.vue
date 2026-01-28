<script setup lang="ts">
defineProps({
  text: String,
})
</script>

<template>
  <span>{{ text }}</span>
  <div class="loader" id="loader-2">
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<style>
#loader-2 span {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background-color: white;
  margin: 35px 5px;
}

#loader-2 span:nth-child(1) {
  animation: bounce 1s ease-in-out infinite;
}

#loader-2 span:nth-child(2) {
  animation: bounce 1s ease-in-out 0.33s infinite;
}

#loader-2 span:nth-child(3) {
  animation: bounce 1s ease-in-out 0.66s infinite;
}

@keyframes bounce {
  0%,
  75%,
  100% {
    -webkit-transform: translateY(0);
    -ms-transform: translateY(0);
    -o-transform: translateY(0);
    transform: translateY(0);
  }

  25% {
    -webkit-transform: translateY(-10px);
    -ms-transform: translateY(-10px);
    -o-transform: translateY(-10px);
    transform: translateY(-10px);
  }
}
</style>
