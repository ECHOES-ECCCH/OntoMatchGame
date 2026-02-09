export function parseClasses(doc) {
  console.log(doc)
  const RDFS_NS = doc.documentElement.lookupNamespaceURI('rdfs')
  const RDF_NS = doc.documentElement.lookupNamespaceURI('rdf')

  const classEls = [...doc.getElementsByTagNameNS(RDFS_NS, 'Class')]

  return classEls.map((el) => {
    const id = el.getAttributeNS(RDF_NS, 'about').split('_')[0]
    // récupère l'attribut rdf:about
    const about = el.getAttributeNS(RDF_NS, 'about')

    // récupère les labels par langue
    const labels = {}
    const labelEls = el.getElementsByTagNameNS(RDFS_NS, 'label')
    for (const l of labelEls) {
      const lang = l.getAttribute('xml:lang')
      if (lang) labels[lang] = l.textContent.trim()
    }

    // récupère le commentaire
    const commentEl = el.getElementsByTagNameNS(RDFS_NS, 'comment')[0]
    const comment = commentEl ? commentEl.textContent.trim() : ''

    // récupère le subClassOf
    const subClassEls = el.getElementsByTagNameNS(RDFS_NS, 'subClassOf')
    const subClasses = [...subClassEls].map((s) => s.getAttributeNS(RDF_NS, 'resource'))

    return { id, about, labels, comment, subClasses }
  })
}
