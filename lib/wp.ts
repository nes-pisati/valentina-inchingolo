// Dati dei progetti — mock locali con la stessa forma del CPT in attesa del CMS.

export type Locale = 'it' | 'en'

export type ProjectMeta = {
  label: string
  valore: string
  highlight?: boolean
}

export type RoleItem = {
  titolo: string
  descrizione: string
}

export type Duotone = 'cipria' | 'ink' | 'corallo' | 'grigio'

export type MaterialTile = {
  img: string
  caption: string
  duotone: Duotone
  speed: number
}

export type ResultFigure = {
  prefisso?: string
  valore: number
  unita?: string
  descrizione: string
}

export type Project = {
  numero: string
  slug: string
  titolo: string
  sottotitolo_riga1: string
  sottotitolo_accento: string
  meta: ProjectMeta[]
  badge_testo: string
  hero_media: string
  hero_alt: string
  contesto_lead: string[]
  contesto_body: string[]
  contesto_img: string
  contesto_caption: string
  marquee_parole: string[]
  sfida_statement: string
  sfida_body: string[]
  ruolo_lead: string[]
  ruolo_attivita: RoleItem[]
  materiali: MaterialTile[]
  strategia_lead: string[]
  strategia_paragrafo: string
  risultati: ResultFigure[]
  outline: string
  cosa_dimostra: string
  seo: { title: string; description: string }
}

import mypollyIt from '../content/projects/mypolly.it.json'
import mypollyEn from '../content/projects/mypolly.en.json'
import biodiversaIt from '../content/projects/app-biodiversa.it.json'
import biodiversaEn from '../content/projects/app-biodiversa.en.json'

const MOCK: Record<Locale, Project[]> = {
  it: [mypollyIt, biodiversaIt] as Project[],
  en: [mypollyEn, biodiversaEn] as Project[],
}

export async function getProject(locale: Locale, slug: string): Promise<Project | null> {
  const list = MOCK[locale] ?? MOCK.it
  return list.find(p => p.slug === slug) ?? null
}

export function getProjectSlugs(): string[] {
  return MOCK.it.map(p => p.slug)
}
