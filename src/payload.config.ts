import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig, GlobalConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// ── Media Collection ────────────────────────────────────
const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media' },
  upload: {
    mimeTypes: ['image/*'],
  },
  fields: [
    { name: 'alt', type: 'text', label: 'Alt Text' },
  ],
}

// ── CV Global ───────────────────────────────────────────
const serverUrl = process.env.SERVER_URL || 'http://localhost:3000'

const CV: GlobalConfig = {
  slug: 'cv',
  label: 'CV',
  versions: { drafts: true },
  admin: {
    preview: () => `${serverUrl}/preview?global=cv`,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Full Name', required: true },
    { name: 'title', type: 'text', label: 'Professional Title (subtitle)' },
    { name: 'email', type: 'text', label: 'Email' },
    { name: 'phone', type: 'text', label: 'Phone' },
    { name: 'linkedin', type: 'text', label: 'LinkedIn (e.g. linkedin.com/in/mfrh)' },
    { name: 'profileImage', type: 'upload', relationTo: 'media', label: 'Profile Photo' },
    { name: 'summary', type: 'textarea', label: 'About Me (Über Mich)' },
    {
      name: 'experience',
      type: 'array',
      label: 'Work Experience (Berufserfahrung)',
      fields: [
        { name: 'duration', type: 'text', label: 'Duration (e.g. 1.5 Jahre)' },
        { name: 'startDate', type: 'text', label: 'Start Date (e.g. Juni 2024)' },
        { name: 'endDate', type: 'text', label: 'End Date (e.g. heute)' },
        { name: 'company', type: 'text', label: 'Company' },
        { name: 'role', type: 'text', label: 'Job Title / Role' },
        { name: 'description', type: 'textarea', label: 'Responsibilities (one bullet point per line)' },
      ],
    },
    {
      name: 'skillMaxDots',
      type: 'number',
      label: 'Max Dots per Skill',
      defaultValue: 5,
      min: 1,
      max: 10,
      admin: { description: 'Maximum number of dots shown for each skill rating' },
    },
    {
      name: 'skills',
      type: 'array',
      label: 'Tech & Software (mit Dot-Rating)',
      fields: [
        { name: 'name', type: 'text', label: 'Skill Name' },
        { name: 'level', type: 'number', label: 'Level', defaultValue: 4, min: 1, max: 10, admin: { description: 'Number of filled dots' } },
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
        { name: 'institution', type: 'text', label: 'Institution' },
        { name: 'degree', type: 'text', label: 'Degree / Program' },
        { name: 'startDate', type: 'text', label: 'Start Date' },
        { name: 'endDate', type: 'text', label: 'End Date' },
      ],
    },
    {
      name: 'certificates',
      type: 'array',
      label: 'Certificates (Zertifikate)',
      fields: [
        { name: 'name', type: 'text', label: 'Certificate Name' },
        { name: 'issuer', type: 'text', label: 'Issuer' },
        { name: 'date', type: 'text', label: 'Date' },
        { name: 'status', type: 'text', label: 'Status (e.g. in progress)' },
      ],
    },
  ],
}

// ── Cover Letter Global ─────────────────────────────────
const CoverLetter: GlobalConfig = {
  slug: 'cover-letter',
  label: 'Cover Letter (Anschreiben)',
  versions: { drafts: true },
  admin: {
    preview: () => `${serverUrl}/preview?global=cover-letter`,
  },
  fields: [
    { name: 'recipientSalutation', type: 'text', label: 'Salutation (e.g. Sehr geehrtes ... Team)' },
    { name: 'body', type: 'textarea', label: 'Letter Body' },
    { name: 'closing', type: 'text', label: 'Closing (e.g. Mit freundlichen Grüßen)' },
    { name: 'senderName', type: 'text', label: 'Sender Name' },
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
    push: false,
  }),

  editor: lexicalEditor(),

  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' | MFRH CV',
    },
    livePreview: {
      url: ({ globalConfig }) =>
        globalConfig?.slug === 'cover-letter'
          ? `${serverUrl}/cover-letter`
          : serverUrl,
      globals: ['cv', 'cover-letter'],
    },
  },

  collections: [
    Media,
    {
      slug: 'users',
      auth: true,
      admin: { useAsTitle: 'email' },
      fields: [],
    },
  ],

  globals: [CV, CoverLetter],

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
