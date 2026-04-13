import { readFileSync, existsSync } from 'fs'
import path from 'path'
import type { Payload } from 'payload'

function loadJSON(filePath: string): Record<string, unknown> | null {
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

  // 1. Create admin user
  await payload.create({
    collection: 'users',
    data: {
      email: 'admin@mfrh.xyz',
      password: process.env.SEED_ADMIN_PASSWORD || 'jQ!sb%76FgEiXb',
    },
  })
  payload.logger.info('  ✓ Admin user created (admin@mfrh.xyz)')

  // 2. Seed CV global from content JSON
  const contentDir = path.resolve(process.cwd(), 'content')
  const cvData = loadJSON(path.join(contentDir, 'cv', 'index.json'))
  if (cvData) {
    if (typeof cvData.summary === 'string') {
      cvData.summary = textToLexical(cvData.summary)
    }
    await payload.updateGlobal({
      slug: 'cv',
      data: cvData,
    })
    payload.logger.info('  ✓ CV data seeded')
  }

  // 3. Seed cover letter from content JSON
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

  // 4. Create homepage with hero block
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Home',
      slug: 'home',
      layout: [
        {
          blockType: 'hero',
          headline: 'Maximilian Huber',
          eyebrow: 'Project Manager • Product Owner • Scrum Master',
          intro: {
            root: {
              type: 'root',
              format: '',
              indent: 0,
              version: 1,
              children: [{
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [{ type: 'text', text: 'Seit über 10 Jahren in der Agenturbranche. Spezialisiert auf Web- und App-Projekte.', format: 0, mode: 'normal', style: '', detail: 0, version: 1 }],
                direction: 'ltr',
                textFormat: 0,
                textStyle: '',
              }],
              direction: 'ltr',
            },
          },
        },
      ],
      _status: 'published',
    },
  })
  payload.logger.info('  ✓ Homepage seeded')

  payload.logger.info('— Seed complete')
}
