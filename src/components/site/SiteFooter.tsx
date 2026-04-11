import Link from 'next/link'
import type { SiteSettingsData } from '@/lib/payload'

function externalUrl(value?: string | null) {
  if (!value) return null
  return value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`
}

export function SiteFooter({ settings }: { settings: SiteSettingsData }) {
  const linkedin = externalUrl(settings.linkedin)

  return (
    <footer className="print-hidden ghost-border border-x-0 border-b-0">
      <div className="page-container flex flex-col gap-3 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="title-sm">{settings.siteName || 'MFRH'}</p>
          <p className="body-sm">{settings.tagline || 'Portfolio, CV und Anschreiben aus einem System.'}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 body-sm">
          {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
          {settings.phone && <a href={`tel:${settings.phone.replace(/\s+/g, '')}`}>{settings.phone}</a>}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          )}
          {settings.footerLinks?.map((link, i) => {
            if (link.type === 'external' && link.url) {
              return <a key={i} href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
            }
            const slug = typeof link.page === 'object' ? link.page?.slug : null
            if (slug) {
              const href = slug === 'home' ? '/' : `/${slug}`
              return <Link key={i} href={href}>{link.label}</Link>
            }
            return null
          })}
        </div>
      </div>
    </footer>
  )
}
