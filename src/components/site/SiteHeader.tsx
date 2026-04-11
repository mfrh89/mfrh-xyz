import Image from 'next/image'
import Link from 'next/link'
import type { SiteSettingsData } from '@/lib/payload'
import { getMediaProps } from '@/lib/media'

function resolveContactHref(settings: SiteSettingsData) {
  if (settings.email) return `mailto:${settings.email}`
  if (settings.linkedin) {
    return settings.linkedin.startsWith('http') ? settings.linkedin : `https://${settings.linkedin}`
  }
  return '#contact'
}

export function SiteHeader({ settings }: { settings: SiteSettingsData }) {
  const contactHref = resolveContactHref(settings)

  return (
    <header className="print-hidden sticky top-0 z-40 glass-header">
      <div className="page-container flex items-center justify-between gap-6 py-4">
        <Link href="/" className="title-sm">
          {(() => {
            const logo = getMediaProps(settings.navLogo)
            if (logo) {
              return (
                <Image
                  src={logo.src}
                  alt={logo.alt || settings.siteName || 'Home'}
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                  priority
                />
              )
            }
            return settings.siteName || 'MFRH'
          })()}
        </Link>

        <nav className="hidden items-center gap-6 md:flex body-sm">
          <Link href="/">Home</Link>
          <Link href="/cv">CV</Link>
          <Link href="/projects">Projekte</Link>
        </nav>

        <a
          href={contactHref}
          target={contactHref.startsWith('http') ? '_blank' : undefined}
          rel={contactHref.startsWith('http') ? 'noreferrer' : undefined}
          className="btn-secondary !py-2 !px-4 !text-[0.8125rem]"
        >
          {settings.contactButtonLabel || 'Kontakt'}
        </a>
      </div>
    </header>
  )
}
