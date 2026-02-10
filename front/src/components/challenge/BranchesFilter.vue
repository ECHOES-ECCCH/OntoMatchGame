<script setup lang="ts">
import { colors } from '@/assets/cards/colors.js'

const props = defineProps<{
  modelValue: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const toggleBranch = (branch: string) => {
  const currentValue = [...props.modelValue]

  if (branch === 'entity') {
    emit('update:modelValue', ['entity'])
    return
  }

  const indexEntity = currentValue.indexOf('entity')
  if (indexEntity > -1) {
    currentValue.splice(indexEntity, 1)
  }

  // Toggle la branche cliquée
  const index = currentValue.indexOf(branch)
  if (index > -1) {
    currentValue.splice(index, 1)
  } else {
    currentValue.push(branch)
  }

  if (currentValue.length === 0) {
    emit('update:modelValue', ['entity'])
  } else {
    emit('update:modelValue', currentValue)
  }
}
</script>

<template>
  <div class="types-filter">
    <ul>
      <li
        v-for="(type, branch) in colors"
        :key="branch"
        class="type"
        :class="{ active: modelValue.includes(branch) }"
        :style="{ backgroundColor: type.color }"
        @click="toggleBranch(branch)"
      ></li>
    </ul>
  </div>
</template>
