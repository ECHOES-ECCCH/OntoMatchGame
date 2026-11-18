import { useVueFlow } from '@vue-flow/core'

const DATA_NAMESPACE = 'https://ontomatchgame.huma-num.fr/data/'
const PREFIX = 'crm' // every class and property is exported with this prefix
const TYPE_PREDICATE = 'rdfs:a' // the example file uses rdfs:a (standard Turtle would be "a" / rdf:type)

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

// "E21 Person" -> "E21_Person", "P4 has time-span" -> "P4_has_time-span"
const toLocalName = (label: string) => label.trim().replace(/\s+/g, '_')

/**
 * Builds the Turtle text of the board:
 * - each instance placed on an entity gives a type line  (data:I2 rdfs:a crm:E21_Person .)
 * - each property gives a relation between the instances sitting on its domain and range
 *   entities, followed by its inverse (from the card's `inverseOf`). If only one end is
 *   connected, the missing end is an anonymous node (_:...).
 * Items that cannot be exported are skipped and listed in `warnings`.
 */
export function buildFreeModeRdf(nodes: any[], edges: any[]) {
  const warnings: string[] = []
  const nodeById = new Map<string, any>(nodes.map((n): [string, any] => [n.id, n]))

  const instanceNodes = nodes.filter((n) => n.data?.card?.kind === 'instance')
  const instanceId = (n: any): string => String(n.data.card.Id ?? n.data.card.id)

  // entity node id -> instance placed on it
  const instanceByEntity = new Map<string, any>()
  instanceNodes.forEach((n) => {
    if (n.data.linkedEntityId) instanceByEntity.set(n.data.linkedEntityId, n)
  })

  // --- Instances ---
  const typeLines = new Set<string>()
  instanceNodes.forEach((instance) => {
    const entity = nodeById.get(instance.data.linkedEntityId)
    if (!entity) {
      warnings.push(
        `Instance ${instanceId(instance)} (${instance.data.card.Title ?? '?'}) skipped: no entity associated`,
      )
      return
    }
    typeLines.add(
      `data:${instanceId(instance)} ${TYPE_PREDICATE} ${PREFIX}:${toLocalName(entity.data.card.about)} .`,
    )
  })

  // --- Relations ---
  const relationBlocks = new Set<string>()
  nodes
    .filter((n) => n.data?.card?.kind === 'property')
    .forEach((property) => {
      const card = property.data.card
      const edgeFor = (role: string) =>
        edges.find((e) => e.source === property.id && e.sourceHandle === role)
      const domainEdge = edgeFor('domain')
      const rangeEdge = edgeFor('range')

      if (!domainEdge && !rangeEdge) {
        warnings.push(`Property ${card.about} skipped: not connected to any entity`)
        return
      }

      // Term of one end: the instance on the connected entity, an anonymous node if that end
      // is not connected, or null (with a warning) if the connected entity has no instance.
      const blank = `_:missing_${String(property.id).replace(/\W/g, '_')}`
      const termFor = (edge: any): string | null => {
        if (!edge) return blank
        const entity = nodeById.get(edge.target)
        const instance = entity && instanceByEntity.get(entity.id)
        if (!instance) {
          warnings.push(
            `Property ${card.about} skipped: entity ${entity?.data?.card?.about ?? '?'} has no instance`,
          )
          return null
        }
        return `data:${instanceId(instance)}`
      }

      const subject = termFor(domainEdge)
      if (!subject) return
      const object = termFor(rangeEdge)
      if (!object) return

      const lines: string[] = []
      if (!domainEdge || !rangeEdge) {
        lines.push(`# ${card.about}: ${!domainEdge ? 'domain' : 'range'} not connected`)
      }
      lines.push(`${subject} ${PREFIX}:${toLocalName(card.about)} ${object} .`)
      const inverses: string[] = Array.isArray(card.inverseOf) ? card.inverseOf : []
      inverses.forEach((inverse) => {
        lines.push(`${object} ${PREFIX}:${toLocalName(inverse)} ${subject} .`)
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
  }

  return { content: parts.join('\n') + '\n', warnings }
}

export function useFreeModeRdf() {
  const { nodes, edges } = useVueFlow()

  /** Builds the RDF of the current board and downloads it as a Turtle (.ttl) file. */
  const exportRdf = () => {
    const { content, warnings } = buildFreeModeRdf(nodes.value, edges.value)

    const url = URL.createObjectURL(new Blob([content], { type: 'text/turtle' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'OMG_ExportedBoard.ttl'
    a.click()
    URL.revokeObjectURL(url)

    return { warnings }
  }

  return { exportRdf }
}
