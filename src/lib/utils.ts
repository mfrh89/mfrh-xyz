import type { CTAData, CTALinkData, NavLink, ProjectData, RichTextContent } from './types'

export function asResolvedProjects(projects: Array<ProjectData | number> | null | undefined): ProjectData[] {
  return (projects || []).filter((project): project is ProjectData => typeof project === 'object' && project !== null)
}

export function resolveCTAHref(cta: CTAData | CTALinkData | null | undefined): string | null {
  if (!cta) return null
  return resolveNavLinkHref(cta)
}

export function resolveNavLinkHref(link: NavLink): string | null {
  if (link.type === 'route') return link.route || null
  if (link.type === 'external') return link.url || null
  if (link.type === 'internal' && link.page) {
    // Polymorphic relationship: { relationTo, value } or direct object
    const ref = link.page as any
    const doc = ref?.value ?? ref
    const slug = typeof doc === 'object' ? doc?.slug : null
    if (!slug) return null
    const collection = ref?.relationTo
    if (collection === 'projects') return `/projects/${slug}`
    return slug === 'home' ? '/' : `/${slug}`
  }
  return null
}

export function hasRichText(data: RichTextContent): boolean {
  if (!data?.root?.children?.length) return false
  return data.root.children.some(
    (node: any) => node.children?.some((child: any) => child.text?.trim()),
  )
}

export function richTextToPlain(data: RichTextContent): string {
  if (!data?.root?.children) return ''
  return data.root.children
    .map((node: any) => {
      if (!node.children) return ''
      return node.children.map((child: any) => child.text || '').join('')
    })
    .filter(Boolean)
    .join('\n\n')
}

export function plainToRichText(text: string): RichTextContent {
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim())
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: paragraphs.map((p) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'text',
            text: p.trim(),
            format: 0,
            mode: 'normal',
            style: '',
            detail: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        textFormat: 0,
        textStyle: '',
      })),
      direction: 'ltr',
    },
  }
}

export function isShareExpired(expiresAt?: string | null): boolean {
  if (!expiresAt) return false
  return Date.parse(expiresAt) < Date.now()
}
