import type { CardInstances } from '@/types/card/cardInfo'
import { ref } from 'vue'

export function useOntologyInstancesLoader() {
  const instances = ref<CardInstances[]>([])
  const isLoading = ref(false)

  async function loadAllInstances(ontology: string, lang: string) {
    isLoading.value = true

    const base = import.meta.env.BASE_URL

    const indexUrl = `${base}data/json/${ontology}/${lang}/chapter/index.json`

    const indexRes = await fetch(indexUrl)
    const index = await indexRes.json()

    const all: any[] = []

    for (const scenario of index.scenarios) {
      const url = `${base}data/json/${ontology}/${lang}/chapter/${scenario}/Instances/Instances.json`

      const res = await fetch(url)
      if (!res.ok) continue

      const data = await res.json()
      all.push(...data)
    }

    instances.value = all
    isLoading.value = false
  }

  return {
    instances,
    isLoading,
    loadAllInstances,
  }
}
