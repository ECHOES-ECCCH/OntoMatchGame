<script setup lang="ts">
import { colors } from '@/assets/cards/colors.js'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="types-filter">
    <ul>
      <li
        v-for="(type, branch) in colors"
        :key="branch"
        class="type"
        :class="{ active: modelValue === branch }"
        :style="{ backgroundColor: type.color }"
        @click="emit('update:modelValue', branch)"
      ></li>
    </ul>
  </div>
</template>
