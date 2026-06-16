export function parseClasses(doc: Document, card: 'entity' | 'property') {
  const RDFS_NS = doc.documentElement.lookupNamespaceURI('rdfs')
  const RDF_NS = doc.documentElement.lookupNamespaceURI('rdf')
  const OWL = doc.documentElement.lookupNamespaceURI('owl')
  const XLINK_NS = doc.documentElement.lookupNamespaceURI('xlink')

  /**
   * Utility function to normalize XML string values
   * (removes underscores and handles null values safely)
   */
  const clean = (value: string | null) => (value ? value.replace(/_/g, ' ') : value)

  /**
   * ENTITY CLASS PARSING
   */
  if (card === 'entity') {
    const classEls = [...doc.getElementsByTagNameNS(RDFS_NS, 'Class')]

    return classEls.map((el) => {
      const aboutAttr = el.getAttributeNS(RDF_NS, 'about')
      if (!aboutAttr) {
        throw new Error('Classe XML sans attribut rdf:about')
      }

      const id = aboutAttr.split('_')[0]

      /**
       * Extract class description/comment
       */
      const labels: Record<string, string> = {}
      const labelEls = el.getElementsByTagNameNS(RDFS_NS, 'label')
      for (const l of labelEls) {
        const lang = l.getAttribute('xml:lang')
        if (lang && l.textContent) {
          labels[lang] = l.textContent.trim()
        }
      }

      /**
       * Extract class description/comment
       */
      const commentEl = el.getElementsByTagNameNS(RDFS_NS, 'comment')[0]
      const comment = commentEl?.textContent?.trim() ?? ''

      /**
       * Extract subclass relationships
       */
      const subClassEls = el.getElementsByTagNameNS(RDFS_NS, 'subClassOf')
      const subClasses = [...subClassEls]
        .map((s) => s.getAttributeNS(RDF_NS, 'resource'))
        .filter((s): s is string => !!s)

      /**
       * External online resource (if available)
       */
      const onlineResourceEl = el.getElementsByTagName('onlineresource')[0]
      const onlineResource = onlineResourceEl
        ? onlineResourceEl.getAttributeNS(XLINK_NS, 'href')
        : null

      return {
        id,
        about: clean(aboutAttr),
        labels,
        comment,
        subClasses: subClasses.map(clean),
        onlineResource,
        branch: null,
      }
    })
  } else if (card === 'property') {
    /**
     * PROPERTY PARSING
     */
    const classEls = [...doc.getElementsByTagNameNS(RDF_NS, 'Property')]

    return classEls.map((el) => {
      const aboutAttr = el.getAttributeNS(RDF_NS, 'about')
      if (!aboutAttr) {
        throw new Error('Classe XML sans attribut rdf:about')
      }

      const id = aboutAttr.split('_')[0]

      /**
       * Extract multilingual labels
       */
      const labels: Record<string, string> = {}
      const labelEls = el.getElementsByTagNameNS(RDFS_NS, 'label')
      for (const l of labelEls) {
        const lang = l.getAttribute('xml:lang')
        if (lang && l.textContent) {
          labels[lang] = l.textContent.trim()
        }
      }

      /**
       * Extract comment/description
       */
      const commentEl = el.getElementsByTagNameNS(RDFS_NS, 'comment')[0]
      const comment = commentEl?.textContent?.trim() ?? ''

      /**
       * Domain and range definitions
       */
      const domainEl = el.getElementsByTagNameNS(RDFS_NS, 'domain')[0]
      const domain = domainEl?.getAttributeNS(RDF_NS, 'resource') ?? null

      const rangeEl = el.getElementsByTagNameNS(RDFS_NS, 'range')[0]
      const range = rangeEl?.getAttributeNS(RDF_NS, 'resource') ?? null

      /**
       * Hierarchical relationships
       */
      const subPropertyOfEl = el.getElementsByTagNameNS(RDFS_NS, 'subPropertyOf')
      const subPropertyOf = [...subPropertyOfEl]
        .map((s) => s.getAttributeNS(RDF_NS, 'resource'))
        .filter((s): s is string => !!s)

      /**
       * Inverse property relationships (OWL)
       */
      const inverseOfEl = el.getElementsByTagNameNS(OWL, 'inverseOf')
      const inverseOf = [...inverseOfEl]
        .map((s) => s.getAttributeNS(RDF_NS, 'resource'))
        .filter((s): s is string => !!s)

      /**
       * External CIDOC / ontology reference
       */
      const onlineResourceEl = el.getElementsByTagName('onlineresource')[0]
      const onlineResource = onlineResourceEl
        ? onlineResourceEl.getAttributeNS(XLINK_NS, 'href')
        : null

      return {
        id,
        about: clean(aboutAttr),
        labels,
        comment,
        domain: clean(domain),
        range: clean(range),
        subPropertyOf: subPropertyOf.map(clean),
        inverseOf: inverseOf.map(clean),
        onlineResource,
      }
    })
  }
}
