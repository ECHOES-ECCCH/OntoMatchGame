<script setup lang="ts">
import { colors } from '@/assets/cards/colors'

const props = defineProps<{
  modelValue: string[]
  orientation: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()
const toggleBranch = (branches: string[]) => {
  const currentValue = [...props.modelValue]

  if (branches.includes('entity')) {
    emit('update:modelValue', ['entity'])
    return
  }

  const indexEntity = currentValue.indexOf('entity')
  if (indexEntity > -1) {
    currentValue.splice(indexEntity, 1)
  }

  branches.forEach((branch) => {
    const index = currentValue.indexOf(branch)
    if (index > -1) {
      currentValue.splice(index, 1)
    } else {
      currentValue.push(branch)
    }
  })

  if (currentValue.length === 0) {
    emit('update:modelValue', ['entity'])
  } else {
    emit('update:modelValue', currentValue)
  }
}

type Branch = keyof typeof colors

const groupBranchesByColor = (): Record<string, Branch[]> => {
  const result: Record<string, Branch[]> = {}

  Object.entries(colors).forEach(([branch, config]) => {
    const color = config.color

    if (!result[color]) {
      result[color] = []
    }

    result[color].push(branch as Branch)
  })

  return result
}

const groupedBranches = groupBranchesByColor()
</script>

<template>
  <div
    :class="[
      'types-filter',
      orientation === 'vertical-left'
        ? 'vertical-filter vertical-filter-left'
        : orientation === 'vertical-right'
          ? 'vertical-filter vertical-filter-right'
          : 'horizontal-filter',
    ]"
  >
    <ul>
      <li
        v-for="(branches, color) in groupedBranches"
        :key="color"
        class="type"
        :class="{ active: branches.some((b) => modelValue.includes(b)) }"
        :style="{ backgroundColor: color }"
        @click="toggleBranch(branches)"
      ></li>
    </ul>
  </div>
</template>
