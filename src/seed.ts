import { readFileSync, existsSync } from 'fs'
import path from 'path'
import type { Payload } from 'payload'

function loadJSON(filePath: string): Record<string, unknown> | null {
  if (!existsSync(filePath)) return null
  return JSON.parse(readFileSync(filePath, 'utf-8'))
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
      password: 'changeme123',
    },
  })
  payload.logger.info('  ✓ Admin user created (admin@mfrh.xyz)')

  // 2. Seed CV global from content JSON
  const contentDir = path.resolve(process.cwd(), 'content')
  const cvData = loadJSON(path.join(contentDir, 'cv', 'index.json'))
  if (cvData) {
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
          intro: 'Seit über 10 Jahren in der Agenturbranche. Spezialisiert auf Web- und App-Projekte.',
        },
      ],
      _status: 'published',
    },
  })
  payload.logger.info('  ✓ Homepage seeded')

  payload.logger.info('— Seed complete')
}
