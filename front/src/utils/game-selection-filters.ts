import { langStore } from '@/stores/lang.store'
import { ref } from 'vue'

export const selectedFilters = ref({
  theme: [
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-topicarcheology-text'),
      domainCodes: 'ARC',
      selected: true,
    },
    {
      name: langStore.t(
        'static-text.GameSelectionScene.gameselection-scene-topicarchitecture-text',
      ),
      domainCodes: 'ACT',
      selected: true,
    },
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-topicarchive-text'),
      domainCodes: 'ARK',
      selected: true,
    },
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-topicart-text'),
      domainCodes: 'ART',
      selected: true,
    },
    {
      name: langStore.t(
        'static-text.GameSelectionScene.gameselection-scene-topicconservation-text',
      ),
      domainCodes: 'CSV',
      selected: true,
    },
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-topicethnology-text'),
      domainCodes: 'ETH',
      selected: true,
    },
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-topichistory-text'),
      domainCodes: 'HIS',
      selected: true,
    },
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-topiclinguistic-text'),
      domainCodes: 'LIN',
      selected: true,
    },
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-topicliterature-text'),
      domainCodes: 'LIT',
      selected: true,
    },
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-topicoldbook-text'),
      domainCodes: 'OLB',
      selected: true,
    },
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-topicmuseum-text'),
      domainCodes: 'MSM',
      selected: true,
    },
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-topicmusicology-text'),
      domainCodes: 'MUS',
      selected: true,
    },
  ],
  language: [
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-language2-text'),

      selected: true,
    },
    {
      name: langStore.t('static-text.GameSelectionScene.gameselection-scene-language1-text'),
      selected: true,
    },
  ],
})

export const handleSelectedFilters = (
  category: 'theme' | 'language',
  name: string,
  selected: boolean,
) => {
  const target = selectedFilters.value[category].find((f) => f.name === name)

  if (target) {
    target.selected = selected
  }
}
