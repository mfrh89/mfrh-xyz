import { readFileSync, existsSync } from 'fs'
import path from 'path'
import type { Payload } from 'payload'

function loadJSON(filePath: string): any | null {
  if (!existsSync(filePath)) return null
  return JSON.parse(readFileSync(filePath, 'utf-8'))
}

function textToLexical(text: string) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: text.split('\n\n').map((paragraph) => ({
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        textFormat: 0,
        textStyle: '',
        children: [{ type: 'text', text: paragraph, format: 0, mode: 'normal' as const, style: '', detail: 0, version: 1 }],
      })),
    },
  }
}

export async function seed(payload: Payload): Promise<void> {
  const users = await payload.find({ collection: 'users', limit: 1 })
  if (users.totalDocs > 0) {
    payload.logger.info('— Seed skipped: database already has data')
    return
  }

  payload.logger.info('— Seeding fresh database...')

  const contentDir = path.resolve(process.cwd(), 'content')

  // 1. Create admin user
  await payload.create({
    collection: 'users',
    data: {
      email: 'admin@mfrh.xyz',
      password: process.env.SEED_ADMIN_PASSWORD || 'jQ!sb%76FgEiXb',
    },
  })
  payload.logger.info('  ✓ Admin user created (admin@mfrh.xyz)')

  // 2. Seed CV global
  const cvData = loadJSON(path.join(contentDir, 'cv', 'index.json'))
  if (cvData) {
    if (typeof cvData.summary === 'string') {
      cvData.summary = textToLexical(cvData.summary)
    }
    await payload.updateGlobal({ slug: 'cv', data: cvData })
    payload.logger.info('  ✓ CV data seeded')
  }

  // 3. Seed site settings
  const ssData = loadJSON(path.join(contentDir, 'site-settings', 'index.json'))
  if (ssData) {
    await payload.updateGlobal({ slug: 'site-settings', data: ssData })
    payload.logger.info('  ✓ Site settings seeded')
  }

  // 4. Seed pages
  const pagesData = loadJSON(path.join(contentDir, 'pages', 'index.json'))
  if (Array.isArray(pagesData)) {
    for (const page of pagesData) {
      const { id, ...data } = page as Record<string, unknown>
      await payload.create({
        collection: 'pages',
        data: { ...data, _status: 'published' },
      })
    }
    payload.logger.info(`  ✓ ${(pagesData as unknown[]).length} pages seeded`)
  }

  // 5. Seed cover letter
  const clData = loadJSON(path.join(contentDir, 'cover-letter', 'index.json'))
  if (clData) {
    await payload.create({
      collection: 'cover-letters',
      data: {
        company: 'Links der Isar',
        role: 'Digitaler Projektmanager',
        ...clData,
        _status: 'published',
      },
    })
    payload.logger.info('  ✓ Cover letter seeded')
  }

  payload.logger.info('— Seed complete')
}
