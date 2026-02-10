<script setup lang="ts">
const props = defineProps<{
  position: string
  superSubClasses: object
  cardInfo: {
    eleft: string
    emiddle: string
    eright: string
  }
}>()

const emit = defineEmits<{
  'update:cardInfo': [value: typeof props.cardInfo]
}>()

const switchCard = (data) => {
  props.cardInfo[props.position] = { about: data }

  emit('update:cardInfo', props.cardInfo)
}
</script>
<template>
  <div class="entity-superclasses-subclasses">
    <ul>
      SuperClasses & subclasses
      <li>
        <button
          @click="switchCard(sub)"
          v-for="(sub, index) in superSubClasses.subClassOf.value[position]"
          :key="index"
        >
          {{ sub }}
        </button>
      </li>
      <li>{{ cardInfo[position].about }}</li>
      <button
        @click="switchCard(sup)"
        v-for="(sup, index) in superSubClasses.superClassOf.value[position]"
        :key="index"
      >
        {{ sup }}
      </button>
    </ul>
  </div>
</template>
