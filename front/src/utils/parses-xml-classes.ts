import type { CardInfo } from '@/types/cardInfo'

export function parseClasses(doc: Document) {
  const RDFS_NS = doc.documentElement.lookupNamespaceURI('rdfs')
  const RDF_NS = doc.documentElement.lookupNamespaceURI('rdf')

  const classEls = [...doc.getElementsByTagNameNS(RDFS_NS, 'Class')]

  // récupère l'attribut rdf:about

  return classEls.map((el) => {
    const aboutAttr = el.getAttributeNS(RDF_NS, 'about')
    if (!aboutAttr) {
      throw new Error('Classe XML sans attribut rdf:about')
    }

    const id = aboutAttr.split('_')[0]

    // récupère les labels par langue
    const labels: Record<string, string> = {}
    const labelEls = el.getElementsByTagNameNS(RDFS_NS, 'label')
    for (const l of labelEls) {
      const lang = l.getAttribute('xml:lang')
      if (lang && l.textContent) {
        labels[lang] = l.textContent.trim()
      }
    }

    // récupère le commentaire
    const commentEl = el.getElementsByTagNameNS(RDFS_NS, 'comment')[0]
    const comment = commentEl?.textContent?.trim() ?? ''

    // récupère le subClassOf
    const subClassEls = el.getElementsByTagNameNS(RDFS_NS, 'subClassOf')
    const subClasses = [...subClassEls]
      .map((s) => s.getAttributeNS(RDF_NS, 'resource'))
      .filter((s): s is string => !!s)

    return {
      id,
      about: aboutAttr,
      labels,
      comment,
      subClasses,
      branch: null, // valeur par défaut
    } as CardInfo
  })
}
