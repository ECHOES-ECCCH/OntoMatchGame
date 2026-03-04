<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import next from '@/assets/img/next.svg'
import { updateSession } from '@/services/sessions.service'
import { langStore } from '@/stores/lang.store'

const props = defineProps<{
  errorCards: Record<string, string>
}>()
// const emit = defineEmits(['close'])
// const router = useRouter()

// const countdown = ref(5)
// let interval: ReturnType<typeof setInterval>
// let timeout: ReturnType<typeof setTimeout>

// async function finishChallenge() {
//   clearInterval(interval)
//   clearTimeout(timeout)

//   emit('close')

//   await updateSession({
//     userId: props.chapterStats?.userId,
//     currentScenario: props.chapterStats?.scenarioName,
//     currentChapter: props.chapterInfo?.filename + '.json',
//     currentChallengeIndex: parseInt(props.chapterStats?.lastChallengeId ?? '0', 10) + 1,
//     currentScore:
//       parseInt(props.chapterStats?.score ?? '0', 10) +
//       parseInt(String(props.chapterData?.Score ?? 0), 10),
//   })

//   router.push({
//     path: '/challenge',
//     query: {
//       scenario: props.chapterStats?.scenarioName,
//       chapterName: props.chapterStats?.chapterName,
//     },
//   })
// }

// onMounted(() => {
//   interval = setInterval(() => {
//     countdown.value--
//   }, 1000)

//   timeout = setTimeout(finishChallenge, 5000)
// })

// onUnmounted(() => {
//   clearInterval(interval)
//   clearTimeout(timeout)
// })
</script>

<template>
  <div class="challenge-completed-container">
    <div class="challenge-completed-content">
      <!-- <button class="next-challenge" @click="finishChallenge">
        <img :src="next" alt="Next" />{{
          langStore.t('static-text.BoardScene.boardscene-scene-nextbutton-text')
        }}
      </button> -->
    </div>
  </div>
</template>
