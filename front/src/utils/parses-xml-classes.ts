import type { CardInfo } from '@/types/card/cardInfo'

export function parseClasses(doc: Document, card) {
  const RDFS_NS = doc.documentElement.lookupNamespaceURI('rdfs')
  const RDF_NS = doc.documentElement.lookupNamespaceURI('rdf')
  const OWL = doc.documentElement.lookupNamespaceURI('owl')
  const XLINK_NS = doc.documentElement.lookupNamespaceURI('xlink')

  if (card === 'entity') {
    const classEls = [...doc.getElementsByTagNameNS(RDFS_NS, 'Class')]

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

      const onlineResourceEl = el.getElementsByTagName('onlineresource')[0]
      const onlineResource = onlineResourceEl
        ? onlineResourceEl.getAttributeNS(XLINK_NS, 'href')
        : null

      return {
        id,
        about: aboutAttr,
        labels,
        comment,
        subClasses,
        onlineResource,
        branch: null,
      } as CardInfo
    })
  } else if (card === 'property') {
    const classEls = [...doc.getElementsByTagNameNS(RDF_NS, 'Property')]

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

      // récupère le domain
      const domainEl = el.getElementsByTagNameNS(RDFS_NS, 'domain')[0]
      const domain = domainEl?.getAttributeNS(RDF_NS, 'resource') ?? null

      // récupère le range
      const rangeEl = el.getElementsByTagNameNS(RDFS_NS, 'range')[0]
      const range = rangeEl?.getAttributeNS(RDF_NS, 'resource') ?? null

      const subPropertyOfEl = el.getElementsByTagNameNS(RDFS_NS, 'subPropertyOf')
      const subPropertyOf = [...subPropertyOfEl]
        .map((s) => s.getAttributeNS(RDF_NS, 'resource'))
        .filter((s): s is string => !!s)

      // récupère le inverseOf
      const inverseOfEl = el.getElementsByTagNameNS(OWL, 'inverseOf')
      const inverseOf = [...inverseOfEl]
        .map((s) => s.getAttributeNS(RDF_NS, 'resource'))
        .filter((s): s is string => !!s)

      // récupère le lien CIDOC
      const onlineResourceEl = el.getElementsByTagName('onlineresource')[0]
      const onlineResource = onlineResourceEl
        ? onlineResourceEl.getAttributeNS(XLINK_NS, 'href')
        : null

      return {
        id,
        about: aboutAttr,
        labels,
        domain,
        range,
        subPropertyOf,
        inverseOf,
        onlineResource,
      }
    })
  }
}
