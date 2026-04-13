import crypto from 'node:crypto'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block, CollectionConfig, Field, GlobalConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { seed } from './seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// ── Shared Helpers ─────────────────────────────────────
const serverUrl = process.env.SERVER_URL || 
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'))

function randomToken(length = 10): string {
  return crypto.randomBytes(18).toString('base64url').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, length)
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function aiField(hint?: string) {
  const component: any = { path: '/src/components/admin/AIGenerate' }
  if (hint) component.clientProps = { hint }
  return { afterInput: [component] }
}

// ── Shared Link Fields ────────────────────────────────
const navLinkFields: Field[] = [
  { name: 'label', type: 'text', required: true },
  {
    name: 'type',
    type: 'select',
    defaultValue: 'route',
    options: [
      { label: 'Route', value: 'route' },
      { label: 'Internal', value: 'internal' },
      { label: 'External', value: 'external' },
    ],
  },
  {
    name: 'route',
    type: 'select',
    label: 'App Route',
    options: [
      { label: 'CV (/cv)', value: '/cv' },
      { label: 'Projects (/projects)', value: '/projects' },
    ],
    admin: { condition: (_data, siblingData) => siblingData?.type === 'route' },
  },
  {
    name: 'page',
    type: 'relationship',
    relationTo: ['pages', 'projects'] as any,
    admin: { condition: (_data, siblingData) => siblingData?.type === 'internal' },
  },
  {
    name: 'url',
    type: 'text',
    label: 'URL',
    admin: { condition: (_data, siblingData) => siblingData?.type === 'external' },
  },
]

const linkFields: Field[] = [
  { name: 'label', type: 'text' },
  ...navLinkFields.filter((f) => 'name' in f && f.name !== 'label'),
]

const optionalCTA: Field = {
  name: 'cta',
  type: 'group',
  label: 'Call to Action (optional)',
  admin: { condition: () => true },
  fields: [
    ...linkFields,
    {
      name: 'style',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Primary (filled)', value: 'primary' },
        { label: 'Secondary (outline)', value: 'secondary' },
      ],
    },
  ],
}

// ── Page-Level Blocks ──────────────────────────────────
const pageBlocks: Block[] = [
  {
    slug: 'hero',
    labels: { singular: 'Hero', plural: 'Heroes' },
    fields: [
      { name: 'eyebrow', type: 'text' },
      { name: 'headline', type: 'text', required: true },
      { name: 'intro', type: 'richText', admin: { components: aiField('Short introductory paragraph, 2-3 sentences, for a hero section') } },
      { name: 'media', type: 'upload', relationTo: 'media', label: 'Hero Image' },
      optionalCTA,
      {
        name: 'secondaryCTA',
        type: 'group',
        label: 'Secondary CTA (optional)',
        fields: linkFields,
      },
    ],
  },
  {
    slug: 'textMedia',
    labels: { singular: 'Text + Media', plural: 'Text + Media' },
    fields: [
      { name: 'eyebrow', type: 'text' },
      { name: 'title', type: 'text', required: true },
      { name: 'body', type: 'richText', admin: { components: aiField('Body text for a content section, 1-2 paragraphs') } },
      {
        name: 'mediaType',
        type: 'select',
        defaultValue: 'image',
        options: [
          { label: 'Image', value: 'image' },
          { label: 'Video (URL)', value: 'video' },
          { label: 'None', value: 'none' },
        ],
      },
      { name: 'media', type: 'upload', relationTo: 'media', admin: { condition: (_data, siblingData) => siblingData?.mediaType === 'image' } },
      { name: 'videoUrl', type: 'text', label: 'Video URL (YouTube, Vimeo, or direct)', admin: { condition: (_data, siblingData) => siblingData?.mediaType === 'video' } },
      {
        name: 'aspectRatio',
        type: 'select',
        defaultValue: '4/3',
        options: [
          { label: '16:9 (Widescreen)', value: '16/9' },
          { label: '4:3 (Standard)', value: '4/3' },
          { label: '1:1 (Square)', value: '1/1' },
          { label: '3:4 (Portrait)', value: '3/4' },
        ],
      },
      {
        name: 'layout',
        type: 'select',
        defaultValue: 'media-right',
        options: [
          { label: 'Media right', value: 'media-right' },
          { label: 'Media left', value: 'media-left' },
        ],
      },
      { name: 'caption', type: 'text' },
      optionalCTA,
    ],
  },
  {
    slug: 'quote',
    labels: { singular: 'Quote', plural: 'Quotes' },
    fields: [
      { name: 'quote', type: 'richText', admin: { components: aiField('An impactful quote or testimonial, 1-2 sentences') } },
      { name: 'attribution', type: 'text' },
      { name: 'context', type: 'text' },
      optionalCTA,
    ],
  },
  {
    slug: 'featuredProjects',
    labels: { singular: 'Featured Projects', plural: 'Featured Projects' },
    fields: [
      { name: 'eyebrow', type: 'text', defaultValue: 'Ausgewählte Projekte' },
      { name: 'title', type: 'text' },
      { name: 'intro', type: 'textarea' },
      {
        name: 'projects',
        type: 'relationship',
        relationTo: 'projects' as any,
        hasMany: true,
        admin: { description: 'Leave empty to auto-select featured projects' },
      },
      { name: 'showAllLink', type: 'checkbox', defaultValue: true, label: 'Show "View all projects" link' },
    ],
  },
  {
    slug: 'richText',
    labels: { singular: 'Rich Text', plural: 'Rich Text' },
    fields: [
      { name: 'content', type: 'richText', required: true, admin: { components: aiField('Content paragraph(s) for a rich text section') } },
    ],
  },
]

const projectSectionBlocks: Block[] = [
  {
    slug: 'text',
    labels: { singular: 'Text Section', plural: 'Text Sections' },
    fields: [
      { name: 'eyebrow', type: 'text' },
      { name: 'title', type: 'text', required: true },
      { name: 'body', type: 'richText', admin: { components: aiField('Descriptive paragraph for a project section') } },
    ],
  },
  {
    slug: 'mediaHighlight',
    labels: { singular: 'Media Highlight', plural: 'Media Highlights' },
    fields: [
      { name: 'eyebrow', type: 'text' },
      { name: 'title', type: 'text', required: true },
      { name: 'body', type: 'richText', admin: { components: aiField('Descriptive paragraph accompanying a media highlight') } },
      {
        name: 'layout',
        type: 'select',
        defaultValue: 'media-right',
        options: [
          { label: 'Media right', value: 'media-right' },
          { label: 'Media left', value: 'media-left' },
          { label: 'Text only', value: 'text-only' },
        ],
      },
      { name: 'media', type: 'upload', relationTo: 'media' },
      { name: 'caption', type: 'text' },
    ],
  },
  {
    slug: 'stats',
    labels: { singular: 'Stats Grid', plural: 'Stats Grids' },
    fields: [
      { name: 'title', type: 'text' },
      {
        name: 'items',
        type: 'array',
        minRows: 1,
        fields: [
          { name: 'value', type: 'text', required: true },
          { name: 'label', type: 'text', required: true },
          { name: 'detail', type: 'text' },
        ],
      },
    ],
  },
  {
    slug: 'quote',
    labels: { singular: 'Quote', plural: 'Quotes' },
    fields: [
      { name: 'quote', type: 'richText', admin: { components: aiField('An impactful quote or testimonial, 1-2 sentences') } },
      { name: 'attribution', type: 'text' },
      { name: 'context', type: 'text' },
    ],
  },
]

// ── Media Collection ────────────────────────────────────
const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media' },
  access: {
    read: () => true,
  },
  upload: {
    mimeTypes: ['image/*'],
  },
  fields: [
    { name: 'alt', type: 'text', label: 'Alt Text' },
  ],
}

// ── Site Settings ──────────────────────────────────────
const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Header & Footer',
          fields: [
            { name: 'siteName', type: 'text', defaultValue: 'MFRH' },
            { name: 'tagline', type: 'text', label: 'Short tagline' },
            { name: 'navLogo', type: 'upload', relationTo: 'media', label: 'Navigation Logo' },
            {
              name: 'navLinks',
              type: 'array',
              label: 'Navigation Links',
              admin: { description: 'Main navigation links in the header' },
              fields: navLinkFields,
            },
            { name: 'contactButtonLabel', type: 'text', defaultValue: 'Kontakt aufnehmen' },
            { name: 'email', type: 'text' },
            { name: 'linkedin', type: 'text', label: 'LinkedIn URL or handle' },
            {
              name: 'footerLinks',
              type: 'array',
              label: 'Footer Links',
              admin: { description: 'Links displayed in the footer (e.g. Impressum, Datenschutz, GitHub)' },
              fields: navLinkFields,
            },
          ],
        },
        {
          label: 'APIs',
          fields: [
            {
              name: 'openrouterApiKey',
              type: 'text',
              label: 'OpenRouter API Key',
              admin: { description: 'API key from openrouter.ai — used for AI text generation in the admin panel' },
            },
            {
              name: 'openrouterModel',
              type: 'text',
              defaultValue: 'anthropic/claude-3.5-haiku',
              admin: {
                components: {
                  Field: '/src/components/admin/ModelSelect',
                },
              },
            },
            {
              name: 'openrouterTemperature',
              type: 'number',
              label: 'Temperature',
              defaultValue: 0.7,
              min: 0,
              max: 2,
              admin: { description: '0 = deterministic, 2 = creative. Default: 0.7' },
            },
            {
              name: 'openrouterMaxTokens',
              type: 'number',
              label: 'Max Tokens',
              defaultValue: 500,
              min: 50,
              max: 4000,
              admin: { description: 'Maximum output length. Default: 500' },
            },
            {
              name: 'openrouterSystemPrompt',
              type: 'textarea',
              label: 'System Prompt',
              defaultValue: 'You write text for a portfolio website. English only. Write like a human: plain, direct, no filler. Avoid buzzwords and superlatives. Prefer short sentences, concrete specifics, understated confidence. Return ONLY the text, no quotes or labels.',
              admin: {
                rows: 6,
                description: 'Instructions that control tone and style for all AI-generated text. The field context is added automatically.',
              },
            },
          ],
        },
      ],
    },
  ],
}

// ── Pages Collection ──────────────────────────────────
const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  versions: { drafts: true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Modular pages built from blocks. Set slug to "home" for the homepage.',
    preview: (doc) => {
      const slug = typeof (doc as Record<string, unknown>)?.slug === 'string' ? (doc as Record<string, string>).slug : ''
      const path = slug === 'home' ? '/' : `/${slug}`
      return `${serverUrl}/api/draft?slug=${path}`
    },
  },
  hooks: {
    beforeValidate: [
      ({ data, originalDoc }) => {
        if (!data) return data
        if (typeof data.slug !== 'string' || !data.slug) {
          const fallbackTitle = typeof data.title === 'string' ? data.title : typeof originalDoc?.title === 'string' ? originalDoc.title : ''
          data.slug = slugify(fallbackTitle)
        } else {
          data.slug = slugify(data.slug)
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { components: { Field: '/src/components/admin/SlugField' } } },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Page Layout',
      blocks: pageBlocks,
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', label: 'Meta Title', admin: { components: aiField('SEO meta title, max 60 characters, concise and descriptive') } },
        { name: 'description', type: 'textarea', label: 'Meta Description', admin: { components: aiField('SEO meta description, max 155 characters, compelling summary for search results') } },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'OG Image' },
      ],
    },
  ],
}

const CV: GlobalConfig = {
  slug: 'cv',
  label: 'CV',
  versions: { drafts: true },
  admin: {
    preview: (doc) => {
      return `${serverUrl}/api/draft?slug=/cv`
    },
  },
  fields: [
    { name: 'pageTitle', type: 'text', label: 'Page Title (e.g. Curriculum Vitae)', defaultValue: 'Curriculum Vitae' },
    { name: 'pageDescription', type: 'text', label: 'Page Description' },
    { name: 'name', type: 'text', label: 'Full Name', required: true },
    { name: 'title', type: 'text', label: 'Professional Title (subtitle)' },
    { name: 'email', type: 'text', label: 'Email' },
    { name: 'location', type: 'text', label: 'Location' },
    { name: 'website', type: 'text', label: 'Website' },
    { name: 'linkedin', type: 'text', label: 'LinkedIn (e.g. linkedin.com/in/mfrh)' },
    { name: 'profileImage', type: 'upload', relationTo: 'media', label: 'Profile Photo' },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo' },
    { name: 'summary', type: 'richText', label: 'About Me (Über Mich)', admin: { components: aiField('Professional summary/bio, 3-4 sentences, first person') } },
    {
      name: 'experience',
      type: 'array',
      label: 'Work Experience (Berufserfahrung)',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'startDate', type: 'text', label: 'Start Date (e.g. Juni 2024)' },
            { name: 'endDate', type: 'text', label: 'End Date (e.g. heute)' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'company', type: 'text', label: 'Company' },
            { name: 'companyUrl', type: 'text', label: 'Company URL' },
          ],
        },
        { name: 'role', type: 'text', label: 'Job Title / Role' },
        { name: 'description', type: 'textarea', label: 'Responsibilities (one bullet point per line)', admin: { components: aiField('Bullet-point list of job responsibilities, one per line, no dashes') } },
      ],
    },
    {
      name: 'skills',
      type: 'array',
      label: 'Tech & Software (mit Dot-Rating)',
      fields: [
        { name: 'name', type: 'text', label: 'Skill Name' },
        {
          name: 'level',
          type: 'radio',
          label: 'Level',
          defaultValue: '3',
          options: [
            { label: '1 — Basic', value: '1' },
            { label: '2 — Intermediate', value: '2' },
            { label: '3 — Proficient', value: '3' },
            { label: '4 — Advanced', value: '4' },
            { label: '5 — Expert', value: '5' },
          ],
        },
      ],
    },
    {
      name: 'languages',
      type: 'array',
      label: 'Languages (Sprachen)',
      fields: [
        { name: 'name', type: 'text', label: 'Language' },
        { name: 'level', type: 'text', label: 'Level (e.g. Muttersprache, C1)' },
      ],
    },
    {
      name: 'education',
      type: 'array',
      label: 'Education (Ausbildung)',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'institution', type: 'text', label: 'Institution' },
            { name: 'institutionUrl', type: 'text', label: 'Institution URL' },
          ],
        },
        { name: 'degree', type: 'text', label: 'Degree / Program' },
        {
          type: 'row',
          fields: [
            { name: 'startDate', type: 'text', label: 'Start Date' },
            { name: 'endDate', type: 'text', label: 'End Date' },
          ],
        },
      ],
    },
    {
      name: 'certificates',
      type: 'array',
      label: 'Certificates (Zertifikate)',
      fields: [
        { name: 'name', type: 'text', label: 'Certificate Name' },
        {
          type: 'row',
          fields: [
            { name: 'issuer', type: 'text', label: 'Issuer' },
            { name: 'issuerUrl', type: 'text', label: 'Issuer URL' },
          ],
        },
        { name: 'date', type: 'text', label: 'Date' },
        { name: 'status', type: 'text', label: 'Status (e.g. in progress)' },
      ],
    },
  ],
}

// ── Projects Collection ────────────────────────────────
const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Project', plural: 'Projects' },
  versions: { drafts: true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'year', 'featured'],
    description: 'Portfolio projects with a structured summary and flexible content sections.',
    preview: (doc) => {
      const slug = typeof (doc as Record<string, unknown>)?.slug === 'string' ? (doc as Record<string, string>).slug : ''
      return `${serverUrl}/api/draft?slug=/projects/${slug}`
    },
  },
  hooks: {
    beforeValidate: [
      ({ data, originalDoc }) => {
        if (!data) return data

        if (typeof data.slug !== 'string' || !data.slug) {
          const fallbackTitle = typeof data.title === 'string' ? data.title : typeof originalDoc?.title === 'string' ? originalDoc.title : ''
          data.slug = slugify(fallbackTitle)
        } else {
          data.slug = slugify(data.slug)
        }

        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { components: { Field: '/src/components/admin/SlugField' } } },
    { name: 'client', type: 'text' },
    { name: 'year', type: 'text' },
    { name: 'role', type: 'text' },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'accentColor', type: 'text', defaultValue: '#bf6b45', admin: { description: 'Optional accent color used in the frontend card and detail page' } },
    { name: 'excerpt', type: 'textarea', required: true, admin: { components: aiField('Short project summary, 1-2 sentences, for card previews') } },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'links',
      type: 'array',
      fields: navLinkFields,
    },
    { name: 'challenge', type: 'richText', admin: { components: aiField('The problem or challenge this project addressed, 2-3 sentences') } },
    { name: 'solution', type: 'richText', admin: { components: aiField('How the challenge was solved, highlighting approach and technology, 2-3 sentences') } },
    {
      name: 'metrics',
      type: 'array',
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'sections',
      type: 'blocks',
      blocks: projectSectionBlocks,
    },
  ],
}

// ── Cover Letters Collection ─────────────────────────────

const CoverLetters: CollectionConfig = {
  slug: 'cover-letters',
  labels: { singular: 'Cover Letter', plural: 'Cover Letters' },
  versions: { drafts: true },
  admin: {
    useAsTitle: 'company',
    defaultColumns: ['company', 'role', 'preview'],
    description: 'Per-application cover letters. Share the token URL with employers.',
    preview: (doc) => {
      const token = (doc as Record<string, unknown>)?.token
      return `${serverUrl}/api/draft?slug=/cover-letter/${token}`
    },
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.token) {
          data.token = randomToken(10)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'token',
      type: 'text',
      label: 'URL Token',
      unique: true,
      admin: {
        hidden: true,
      },
    },
    { name: 'company', type: 'text', label: 'Company', required: true },
    { name: 'role', type: 'text', label: 'Role / Job Title', required: true },
    { name: 'jobTitle', type: 'text', label: 'Display Title (optional override)' },
    { name: 'shareDisabled', type: 'checkbox', label: 'Disable public sharing', defaultValue: false },
    { name: 'shareExpiresAt', type: 'date', label: 'Public share expires at' },
    { name: 'recipientSalutation', type: 'text', label: 'Salutation (e.g. Sehr geehrtes ... Team)' },
    { name: 'body', type: 'textarea', label: 'Letter Body', admin: { components: aiField('Professional cover letter body, 3-4 paragraphs, formal but personable tone') } },
    { name: 'closing', type: 'text', label: 'Closing (e.g. Mit freundlichen Grüßen)' },
    { name: 'senderName', type: 'text', label: 'Sender Name' },
    {
      name: 'preview',
      type: 'ui',
      admin: {
        components: {
          Cell: '/src/components/admin/PreviewCell',
        },
      },
    },
  ],
}

// ── Payload Config ──────────────────────────────────────
export default buildConfig({
  serverURL: serverUrl,
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-in-production',

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || 'postgresql://payload:payload@localhost:5433/payload',
    },
    push: process.env.NODE_ENV !== 'production',
  }),

  onInit: async (payload) => {
    const isCLI = process.argv.some(arg => arg.includes('migrate'))
    if (!isCLI) {
      await seed(payload)
    }
  },

  editor: lexicalEditor(),

  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' | MFRH CV',
    },
  },

  collections: [
    Media,
    Pages,
    Projects,
    CoverLetters,
    {
      slug: 'users',
      auth: true,
      admin: { useAsTitle: 'email' },
      fields: [],
    },
  ],

  plugins: [
    nestedDocsPlugin({
      collections: ['pages'],
      generateLabel: (_, doc) => doc.title as string,
      generateURL: (docs) =>
        docs.reduce((url, doc) => `${url}/${doc.slug as string}`, ''),
    }),
  ],

  globals: [SiteSettings, CV],

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
