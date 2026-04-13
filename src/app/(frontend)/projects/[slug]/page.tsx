export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getDraftMode } from '@/lib/draft'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProjectSections } from '@/components/site/ProjectSections'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { InlineRichText } from '@/components/blocks/InlineRichText'
import { getMediaProps, getProjectBySlug, getSiteSettings, hasRichText } from '@/lib/payload'
import { resolveNavLinkHref } from '@/lib/utils'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const draft = await getDraftMode()
  const project = await getProjectBySlug(slug, { draft })
  if (!project) return { title: 'Projekt nicht gefunden' }
  return {
    title: project.title || 'Projekt',
    description: project.excerpt || 'Projekt-Detailseite',
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const draft = await getDraftMode()
  const [project, siteSettings] = await Promise.all([
    getProjectBySlug(slug, { draft }),
    getSiteSettings()
  ])
  if (!project) notFound()

  const media = getMediaProps(project.coverImage)

  return (
    <div className="portfolio-shell">
      <SiteHeader settings={siteSettings} />

      <main className="page-container py-12 md:py-16">
        <Link href="/projects" className="print-hidden inline-flex body-md underline decoration-outline-variant underline-offset-4">
          Zur&uuml;ck zur Projekt&uuml;bersicht
        </Link>

        <section className="mt-6 overflow-hidden rounded-[16px] bg-surface-lowest ghost-border shadow-[var(--shadow-float)]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
            <div className="p-8 md:p-10 lg:p-12">
              <p className="label-sm">{project.client || 'Projekt'}</p>
              <h1 className="mt-4 display-md">{project.title}</h1>
              {project.excerpt && <p className="mt-6 max-w-2xl body-lg">{project.excerpt}</p>}

              <div className="mt-8 flex flex-wrap gap-3">
                {project.year && <span className="detail-chip">{project.year}</span>}
                {project.role && <span className="detail-chip">{project.role}</span>}
                {project.client && <span className="detail-chip">{project.client}</span>}
                {project.tags?.map((tag, i) => (
                  <span key={`${tag.label}-${i}`} className="detail-chip">{tag.label}</span>
                ))}
              </div>

              {!!project.links?.length && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {project.links.map((link, i) => {
                    const href = resolveNavLinkHref(link)
                    if (!href) return null
                    const isExternal = link.type === 'external'
                    return (
                      <a key={`${href}-${i}`} href={href} {...(isExternal && { target: '_blank', rel: 'noreferrer' })} className="btn-primary">
                        {link.label || 'Open link'}
                      </a>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="relative min-h-[320px] ghost-border border-y-0 border-r-0 lg:min-h-full">
              {media ? (
                <Image src={media.src} alt={media.alt || project.title || ''} fill priority className="object-cover" />
              ) : (
                <div className="project-hero-fallback h-full min-h-[320px]">
                  <div className="project-card-grid" />
                  <div className="relative z-10 flex h-full flex-col justify-end p-8">
                    <p className="label-sm">Flexible template</p>
                    <p className="mt-4 max-w-sm title-lg">
                      Auch ohne visuelles Asset bleibt die Projektseite klar und ruhig.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {(hasRichText(project.challenge) || hasRichText(project.solution) || project.metrics?.length) && (
          <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="section-card">
              {hasRichText(project.challenge) && (
                <>
                  <p className="label-sm">Challenge</p>
                  <InlineRichText data={project.challenge} className="mt-4 body-lg" />
                </>
              )}
              {hasRichText(project.solution) && (
                <>
                  <p className="mt-8 label-sm">Solution</p>
                  <InlineRichText data={project.solution} className="mt-4 body-lg" />
                </>
              )}
            </div>

            {!!project.metrics?.length && (
              <aside className="section-card-dark">
                <p className="label-sm !text-[rgba(255,255,255,0.6)]">Projekt-Metriken</p>
                <div className="mt-6 space-y-5">
                  {project.metrics.map((metric, i) => (
                    <div key={`${metric.label}-${i}`}>
                      <p className="title-lg !text-[var(--on-primary)]">{metric.value}</p>
                      <p className="mt-1 label-sm !text-[rgba(255,255,255,0.6)]">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </aside>
            )}
          </section>
        )}

        <section className="mt-6">
          <ProjectSections sections={project.sections} />
        </section>
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  )
}
