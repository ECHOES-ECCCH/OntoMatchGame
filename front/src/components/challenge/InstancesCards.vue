<script setup lang="ts">
import { useChapterData } from '@/composables/useChapter'
import { useInstancesCards } from '@/composables/useSelectedCards'
import logo from '@/assets/img/logo-g.png'

const chapterStore = useChapterData()

const instancesCards = useInstancesCards(chapterStore.chapterData, chapterStore.chapterInstances)

const isUrl = (str: string) => {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}
</script>

<template>
  <div class="instances content-cards">
    <div v-for="item in instancesCards" :key="item?.position" class="carousel-container">
      <div v-if="item.card" class="instance-card">
        <div class="instance card-name">
          <span class="instance prefix">{{ item.card.Id }}</span>
          <span class="instance name">{{ item.card.Title }}</span>
          <a
            v-if="isUrl(item.card.Label)"
            class="instance link"
            :href="item.card.Label"
            target="_blank"
          >
            {{ item.card.Label }}
          </a>
          <span v-else class="instance label">{{ item.card.Label }}</span>
        </div>
        <img
          :src="`${chapterStore.imgInstanceURL.value}${item.card.ImageName}`"
          :alt="item.card.Title"
        />
      </div>
      <div v-else class="empty-card-entity">
        <p>OntoMatchGame</p>
        <img :src="logo" />
      </div>
    </div>
  </div>
</template>
