import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProject, getProjectSlugs, type Locale } from '../../../../lib/wp'
import ProjectIntro from '../../../../components/sections/progetto/ProjectIntro/ProjectIntro'
import ProjectContext from '../../../../components/sections/progetto/ProjectContext/ProjectContext'
import ProjectChallenge from '../../../../components/sections/progetto/ProjectChallenge/ProjectChallenge'
import ProjectRole from '../../../../components/sections/progetto/ProjectRole/ProjectRole'
import ProjectMaterials from '../../../../components/sections/progetto/ProjectMaterials/ProjectMaterials'
import ProjectStrategy from '../../../../components/sections/progetto/ProjectStrategy/ProjectStrategy'
import Marquee from '../../../../components/sections/Marquee/Marquee'
import ContattiCta from '../../../../components/sections/ContattiCta/ContattiCta'
import ScrollTop from '../../../../components/ui/ScrollTop'

export function generateStaticParams() {
  return getProjectSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const project = await getProject(lang as Locale, slug)
  if (!project) return {}

  return {
    title: project.seo.title,
    description: project.seo.description,
    alternates: {
      canonical: `/${lang}/progetti/${slug}`,
      languages: {
        it: `/it/progetti/${slug}`,
        en: `/en/progetti/${slug}`,
      },
    },
    openGraph: {
      title: project.seo.title,
      description: project.seo.description,
      images: [project.hero_media],
    },
  }
}

export default async function ProgettoPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const project = await getProject(lang as Locale, slug)
  if (!project) notFound()

  return (
    <main>
      <ScrollTop />
      <ProjectIntro project={project} />
      <ProjectContext project={project} />
      <Marquee words={project.marquee_parole} />
      <ProjectChallenge project={project} />
      <ProjectRole project={project} />
      <ProjectMaterials project={project} />
      <ProjectStrategy project={project} />
      <ContattiCta />
    </main>
  )
}
