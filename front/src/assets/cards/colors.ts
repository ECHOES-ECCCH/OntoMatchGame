import iconIdea from '../img/iconIdea.png'
import iconUser from '../img/iconUser.png'
import iconLocation from '../img/iconLocation.png'
import iconClock from '../img/iconClock.png'
import iconAxis from '../img/iconAxis.png'
import iconCube from '../img/iconCube.png'
import iconID from '../img/iconID.png'
import iconForms from '../img/iconForms.png'
import iconMoebius from '../img/iconMoebius.png'
import iconRuler from '../img/iconRuler.png'
import iconPrimitive from '../img/iconPrimitive.png'
import logo from '../img/logo-g.png'
import type { Branch } from './types'

export interface ColorConfig {
  color: string
  icon: string
}

export const colors: Record<Branch, ColorConfig> = {
  entity: { color: '#FFFFFF', icon: logo },
  conceptual: { color: '#fddc34', icon: iconIdea },
  actor: { color: '#ffbdca', icon: iconUser },
  place: { color: '#94cc7d', icon: iconLocation },
  'time-span': { color: '#86bcc8', icon: iconClock },
  temporal: { color: '#82ddff', icon: iconAxis },
  physical: { color: '#c78e66', icon: iconCube },
  appellation: { color: '#fddc34', icon: iconID },
  type: { color: '#fddc34', icon: iconForms },
  'spacetime-volume': { color: '#bc8df0', icon: iconMoebius },
  dimension: { color: '#cccccc', icon: iconRuler },
  primitive: { color: '#e5e0c3', icon: iconPrimitive },
}
