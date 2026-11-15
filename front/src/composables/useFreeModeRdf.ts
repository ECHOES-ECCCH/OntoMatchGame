import { useVueFlow } from '@vue-flow/core'

/**
 * RDF (Turtle) export of the free-mode board.
 *
 * - buildFreeModeRdf: pure function (nodes + edges in, Turtle text out), no Vue dependency
 * - useFreeModeRdf: composable that reads the current board and downloads the .ttl file
 */

// Placeholders taken from the example file: adapt them if needed
const DATA_NAMESPACE = 'http://yourdataset.com/'
const INSTANCE_TYPE_PREDICATE = 'rdfs:a' // the example uses rdfs:a (standard Turtle would be "a" / rdf:type)
const ONTOLOGY_PREFIX = 'crm'

const HEADER = `@prefix crm: <http://www.cidoc-crm.org/cidoc-crm/> .
@prefix sci: <http://www.ics.forth.gr/isl/CRMsci/> .
@prefix inf: <http://www.ics.forth.gr/isl/CRMinf/> .
@prefix archaeo: <http://www.ics.forth.gr/isl/CRMarchaeo/> .
@prefix ba: <http://www.ics.forth.gr/isl/CRMba/> .

@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix xml: <http://www.w3.org/XML/1998/namespace#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix xsp: <http://www.owl-ontologies.com/2005/08/07/xsp.owl#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix skos: <http://www3.org/2004/02/skos/core#> .

@prefix data: <${DATA_NAMESPACE}> .
`

export interface RdfExportStats {
  instances: number
  properties: number
  edges: number
  relations: number
}

export interface RdfBuildResult {
  content: string
  warnings: string[]
  stats: RdfExportStats
}

// "E21 Person" -> "E21_Person", "P4 has time-span" -> "P4_has_time-span"
const toLocalName = (label: string) => label.trim().replace(/\s+/g, '_')

/**
 * Builds the Turtle text of the board.
 *
 * - Each instance linked to an entity gives a "type" line:  data:I2 rdfs:a crm:E21_Person .
 * - Each property gives a relation between the instances sitting on its domain entity and
 *   on its range entity, followed by its inverse (from the property card's `inverseOf`).
 *   If only one end is connected, the missing end is written as an anonymous node (_:...).
 *
 * Items that cannot produce a triple are skipped and reported in `warnings`
 * (and as comments at the end of the file, followed by a diagnostic of the board).
 */
export function buildFreeModeRdf(
  allNodes: any[],
  allEdges: any[],
  ontology: string,
): RdfBuildResult {
  const warnings: string[] = []

  // if (ontology !== 'CIDOC CRM') {
  //   warnings.push(
  //     `Ontology "${ontology}": every class/property is exported with the "${ONTOLOGY_PREFIX}:" prefix, check it is the right one`,
  //   )
  // }

  const nodeById = new Map<string, any>(allNodes.map((n): [string, any] => [n.id, n]))

  const instanceNodes = allNodes.filter((n) => n.data?.card?.kind === 'instance')
  const instanceKey = (n: any) => n.data.card.Id ?? n.data.card.id
  const instanceLabel = (n: any) => `${instanceKey(n)} (${n.data.card.Title ?? '?'})`

  // entity node id -> instance node placed on it
  const instanceByEntityNodeId = new Map<string, any>()
  instanceNodes.forEach((n) => {
    if (n.data.linkedEntityId) instanceByEntityNodeId.set(n.data.linkedEntityId, n)
  })

  // --- Instance definitions ---
  const typeLines = new Set<string>()
  instanceNodes.forEach((instanceNode) => {
    const entityNode = nodeById.get(instanceNode.data.linkedEntityId)
    if (!entityNode) {
      warnings.push(`Instance ${instanceLabel(instanceNode)} skipped: no entity associated`)
      return
    }
    typeLines.add(
      `data:${instanceKey(instanceNode)} ${INSTANCE_TYPE_PREDICATE} ${ONTOLOGY_PREFIX}:${toLocalName(entityNode.data.card.about)} .`,
    )
  })

  // --- Relations ---
  const relationBlocks = new Set<string>()
  allNodes
    .filter((n) => n.data?.card?.kind === 'property')
    .forEach((propertyNode) => {
      const card = propertyNode.data.card
      const edgeForRole = (role: 'domain' | 'range') =>
        allEdges.find((e) => e.source === propertyNode.id && e.sourceHandle === role)

      const domainEdge = edgeForRole('domain')
      const rangeEdge = edgeForRole('range')
      if (!domainEdge && !rangeEdge) {
        warnings.push(`Property ${card.about} skipped: not connected to any entity`)
        return
      }

      const domainEntity = domainEdge ? nodeById.get(domainEdge.target) : undefined
      const rangeEntity = rangeEdge ? nodeById.get(rangeEdge.target) : undefined
      const subject = domainEntity ? instanceByEntityNodeId.get(domainEntity.id) : undefined
      const object = rangeEntity ? instanceByEntityNodeId.get(rangeEntity.id) : undefined

      // A connected end must carry an instance, otherwise there is nothing to write
      if (domainEdge && !subject) {
        warnings.push(
          `Property ${card.about} skipped: entity ${domainEntity?.data?.card?.about ?? '?'} has no instance`,
        )
        return
      }
      if (rangeEdge && !object) {
        warnings.push(
          `Property ${card.about} skipped: entity ${rangeEntity?.data?.card?.about ?? '?'} has no instance`,
        )
        return
      }

      // Only one end connected: the missing end is an anonymous node, shared by the
      // relation and its inverse.
      const blankNode = `_:missing_${String(propertyNode.id).replace(/[^A-Za-z0-9_]/g, '_')}`
      const subjectTerm = subject ? `data:${instanceKey(subject)}` : blankNode
      const objectTerm = object ? `data:${instanceKey(object)}` : blankNode

      const lines: string[] = []
      if (!subject || !object) {
        lines.push(`# ${card.about}: ${!subject ? 'domain' : 'range'} not connected`)
      }
      lines.push(`${subjectTerm} ${ONTOLOGY_PREFIX}:${toLocalName(card.about)} ${objectTerm} .`)
      const inverses: string[] = Array.isArray(card.inverseOf) ? card.inverseOf : []
      inverses.forEach((inverse) => {
        lines.push(`${objectTerm} ${ONTOLOGY_PREFIX}:${toLocalName(inverse)} ${subjectTerm} .`)
      })
      relationBlocks.add(lines.join('\n'))
    })

  const parts = [
    HEADER,
    '### Définition des instances',
    [...typeLines].join('\n'),
    '',
    '### Définition des relations',
    [...relationBlocks].join('\n\n'),
  ]

  if (warnings.length) {
    parts.push('', '### Éléments ignorés', ...warnings.map((w) => `# ${w}`))

    // Diagnostic: what the export actually sees on the board
    const kindOf = (n: any) => n.data?.card?.kind ?? `(none, data.kind=${n.data?.kind})`
    const round = (v: any) => (typeof v === 'number' ? Math.round(v) : '?')
    const aboutOf = (id: any) => nodeById.get(id)?.data?.card?.about ?? 'none'
    const targetOf = (propertyId: string, role: string) =>
      aboutOf(allEdges.find((e) => e.source === propertyId && e.sourceHandle === role)?.target)

    const counts = new Map<string, number>()
    allNodes.forEach((n) => counts.set(kindOf(n), (counts.get(kindOf(n)) ?? 0) + 1))

    const diagnostic = [
      `node kinds: ${[...counts].map(([kind, count]) => `${kind}=${count}`).join(', ')}`,
      ...allNodes.map((n) => {
        const card = n.data?.card ?? {}
        const kind = kindOf(n)
        const label = card.about ?? card.Title ?? card.Id ?? card.id ?? '?'
        const box = `x=${round(n.position?.x)} y=${round(n.position?.y)} w=${round(n.dimensions?.width)} h=${round(n.dimensions?.height)}`

        let link = ''
        if (kind === 'instance') link = ` -> entity: ${aboutOf(n.data?.linkedEntityId)}`
        if (kind === 'entity') {
          const instance = instanceByEntityNodeId.get(n.id)
          link = ` -> instance: ${instance ? instanceKey(instance) : 'none'}`
        }
        if (kind === 'property') {
          link = ` -> domain: ${targetOf(n.id, 'domain')}, range: ${targetOf(n.id, 'range')}`
        }
        return `${kind} ${label} [${n.id}] ${box}${link}`
      }),
    ]
    parts.push('', '### Diagnostic', ...diagnostic.map((d) => `# ${d}`))
  }

  return {
    content: parts.join('\n') + '\n',
    warnings,
    stats: {
      instances: instanceNodes.length,
      properties: allNodes.filter((n) => n.data?.card?.kind === 'property').length,
      edges: allEdges.length,
      relations: relationBlocks.size,
    },
  }
}

export function useFreeModeRdf() {
  const { nodes, edges } = useVueFlow()

  /**
   * Builds the RDF of the current board and downloads it as a .ttl file.
   * Returns the warnings (skipped items) and some stats about what was exported.
   */
  const exportRdf = (ontology: string) => {
    const { content, warnings, stats } = buildFreeModeRdf(nodes.value, edges.value, ontology)

    const blob = new Blob([content], { type: 'text/turtle' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'OMG_ExportedBoard_RDF.ttl'
    a.click()
    URL.revokeObjectURL(url)

    return { warnings, stats }
  }

  return { exportRdf }
}
