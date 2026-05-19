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
  <div class="entity-classes-wrapper">
    <h2>SubClasses & SuperClasses</h2>
    <div class="entity-classes my-scroll">
      <button
        :disabled="position === 'screen'"
        v-for="sub in subClasses"
        :key="sub"
        @click="emit('select', sub)"
        class="hierarchy-btn sub"
      >
        {{ sub }}
      </button>

      <div class="current">{{ current }}</div>

      <button
        :disabled="position === 'screen'"
        v-for="sup in superClasses"
        :key="sup"
        @click="emit('select', sup)"
        class="hierarchy-btn super"
      >
        {{ sup }}
      </button>
    </div>
  </div>
</template>
