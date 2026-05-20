import { ref } from 'vue'

export function useChapterInstances() {
  const chapterInstances = ref(null)
  const imgInstanceURL = ref('')
  const error = ref<string | null>(null)
  const isInstancesLoading = ref(false)

  async function loadInstances(ontology: string, scenario: string, lang: string) {
    isInstancesLoading.value = true
    error.value = null

    try {
      const basePath = import.meta.env.BASE_URL

      const instancesPath = `${basePath}json/${ontology}/${lang}/chapter/${scenario}/Instances/Instances.json`

      imgInstanceURL.value = `${basePath}json/${ontology}/${lang}/chapter/${scenario}/Instances/Images/`

      const res = await fetch(instancesPath)

      if (!res.ok) {
        throw new Error(`Instances introuvables : ${instancesPath}`)
      }

      chapterInstances.value = await res.json()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erreur inconnue'
      chapterInstances.value = null
    } finally {
      isInstancesLoading.value = false
    }
  }

  return {
    chapterInstances,
    imgInstanceURL,
    error,
    isInstancesLoading,
    loadInstances,
  }
}
