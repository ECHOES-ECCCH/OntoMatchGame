<script setup lang="ts">
const props = defineProps<{
  position: string
  current: string
  subClasses: string[]
  superClasses: string[]
}>()

const emit = defineEmits<{
  select: [value: string]
}>()
</script>

<template>
  <div>
    <button
      :disabled="position === 'screen'"
      v-for="sub in subClasses"
      :key="sub"
      @click="emit('select', sub)"
    >
      {{ sub }}
    </button>

    <div>{{ current }}</div>

    <button
      :disabled="position === 'screen'"
      v-for="sup in superClasses"
      :key="sup"
      @click="emit('select', sup)"
    >
      {{ sup }}
    </button>
  </div>
</template>
