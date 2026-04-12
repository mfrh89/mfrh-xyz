import type { MediaAsset } from './media'

export type { MediaAsset } from './media'

export type CVEntry = {
  duration?: string | null
  startDate?: string | null
  endDate?: string | null
  company?: string | null
  role?: string | null
  description?: string | null
  id?: string | null
}

export interface CVData {
  pageTitle?: string | null
  pageDescription?: string | null
  name?: string | null
  title?: string | null
  email?: string | null
  phone?: string | null
  location?: string | null
  website?: string | null
  linkedin?: string | null
  profileImage?: MediaAsset
  logo?: MediaAsset
  summary?: string | null
  skillMaxDots?: number | null
  skills?: { name?: string | null; level?: number | null }[] | null
  languages?: { name?: string | null; level?: string | null }[] | null
  education?: { institution?: string | null; degree?: string | null; startDate?: string | null; endDate?: string | null }[] | null
  certificates?: { name?: string | null; issuer?: string | null; date?: string | null; status?: string | null }[] | null
  experience?: CVEntry[] | null
}

export interface SiteSettingsData {
  siteName?: string | null
  navLogo?: MediaAsset
  tagline?: string | null
  email?: string | null
  phone?: string | null
  linkedin?: string | null
  contactButtonLabel?: string | null
  footerLinks?: { label: string; type?: 'internal' | 'external' | null; page?: { slug?: string | null } | number | null; url?: string | null }[] | null
  openrouterApiKey?: string | null
  openrouterModel?: string | null
  openrouterTemperature?: number | null
  openrouterMaxTokens?: number | null
  openrouterSystemPrompt?: string | null
}

export interface CTAData {
  label?: string | null
  href?: string | null
  style?: 'primary' | 'secondary' | null
}

export type PageBlock =
  | {
      blockType: 'hero'
      id?: string | number | null
      eyebrow?: string | null
      headline?: string | null
      intro?: string | null
      media?: MediaAsset
      cta?: CTAData | null
      secondaryCTA?: { label?: string | null; href?: string | null } | null
    }
  | {
      blockType: 'textMedia'
      id?: string | number | null
      eyebrow?: string | null
      title?: string | null
      body?: string | null
      mediaType?: 'image' | 'video' | 'none' | null
      media?: MediaAsset
      videoUrl?: string | null
      aspectRatio?: '16/9' | '4/3' | '1/1' | '3/4' | null
      layout?: 'media-right' | 'media-left' | null
      caption?: string | null
      cta?: CTAData | null
    }
  | {
      blockType: 'quote'
      id?: string | number | null
      quote?: string | null
      attribution?: string | null
      context?: string | null
      cta?: CTAData | null
    }
  | {
      blockType: 'featuredProjects'
      id?: string | number | null
      eyebrow?: string | null
      title?: string | null
      intro?: string | null
      projects?: Array<ProjectData | number> | null
      showAllLink?: boolean | null
    }
  | {
      blockType: 'richText'
      id?: string | number | null
      content?: any
    }

export interface PageData {
  id: number
  title?: string | null
  slug?: string | null
  layout?: PageBlock[] | null
  meta?: {
    title?: string | null
    description?: string | null
    image?: MediaAsset
  } | null
}

export type ProjectSection =
  | {
      blockType: 'text'
      id?: string | number | null
      eyebrow?: string | null
      title?: string | null
      body?: string | null
    }
  | {
      blockType: 'mediaHighlight'
      id?: string | number | null
      eyebrow?: string | null
      title?: string | null
      body?: string | null
      layout?: 'media-right' | 'media-left' | 'text-only' | null
      media?: MediaAsset
      caption?: string | null
    }
  | {
      blockType: 'stats'
      id?: string | number | null
      title?: string | null
      items?: { value?: string | null; label?: string | null; detail?: string | null }[] | null
    }
  | {
      blockType: 'quote'
      id?: string | number | null
      quote?: string | null
      attribution?: string | null
      context?: string | null
    }

export interface ProjectData {
  id: number
  title?: string | null
  slug?: string | null
  client?: string | null
  year?: string | null
  role?: string | null
  featured?: boolean | null
  accentColor?: string | null
  excerpt?: string | null
  coverImage?: MediaAsset
  tags?: { label?: string | null }[] | null
  links?: { label?: string | null; url?: string | null }[] | null
  challenge?: string | null
  solution?: string | null
  metrics?: { value?: string | null; label?: string | null }[] | null
  sections?: ProjectSection[] | null
}

export interface CoverLetterData {
  id: number
  token: string
  company: string
  role: string
  jobTitle?: string | null
  shareDisabled?: boolean | null
  shareExpiresAt?: string | null
  recipientSalutation?: string | null
  body?: string | null
  closing?: string | null
  senderName?: string | null
  _status?: 'draft' | 'published' | null
}
