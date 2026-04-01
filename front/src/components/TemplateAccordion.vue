<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  itemsCount: number
}>()

const activeIndex = ref<number | null>(null)

const toggle = (index: number) => {
  activeIndex.value = activeIndex.value === index ? null : index
}
</script>

<template>
  <div class="accordion">
    <div v-for="index in itemsCount" :key="index" class="accordion-item">
      <button class="accordion-header" @click="toggle(index - 1)">
        <slot name="header" :index="index - 1" :active="activeIndex === index - 1"></slot>
      </button>

      <div v-show="activeIndex === index - 1" class="accordion-content">
        <slot name="content" :index="index - 1" :active="activeIndex === index - 1"></slot>
      </div>
    </div>
  </div>
</template>
