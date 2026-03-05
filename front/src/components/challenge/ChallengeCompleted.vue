<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import next from '@/assets/img/next.svg'
import { langStore } from '@/stores/lang.store'
import { useFinishChallenge } from '@/composables/useSessionsChallenge'

const props = defineProps({
  chapterStats: Object,
  chapterData: Object,
  chapterInfo: Object,
})
const emit = defineEmits(['close'])

const { finishChallenge } = useFinishChallenge()

const countdown = ref(5)
let interval: ReturnType<typeof setInterval>
let timeout: ReturnType<typeof setTimeout>

async function handleFinish() {
  clearInterval(interval)
  clearTimeout(timeout)
  emit('close')
  await finishChallenge(parseInt(String(props.chapterData?.Score ?? 0), 10))
}

onMounted(() => {
  interval = setInterval(() => countdown.value--, 1000)
  timeout = setTimeout(handleFinish, 5000)
})

onUnmounted(() => {
  clearInterval(interval)
  clearTimeout(timeout)
})
</script>

<template>
  <div class="challenge-completed-container">
    <div class="challenge-completed-content">
      <p>{{ langStore.t('static-text.BoardScene.boardscene-scene-winbanner-text') }}</p>
      <p class="score">Score: {{ chapterData?.Score }}</p>
      <p>Prochain défi dans {{ countdown }} secondes...</p>
      <button class="next-challenge" @click="finishChallenge(0)">
        <img :src="next" alt="Next" />{{
          langStore.t('static-text.BoardScene.boardscene-scene-nextbutton-text')
        }}
      </button>
    </div>
  </div>
</template>
