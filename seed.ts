import { getPayload } from 'payload'
import config from './src/payload.config'
import fs from 'fs'
import path from 'path'

async function seed() {
  const payload = await getPayload({ config })

  // Create admin user
  const existingUsers = await payload.find({ collection: 'users', limit: 1 })
  if (existingUsers.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@mfrh.xyz',
        password: 'changeme123',
      },
    })
    console.log('Admin user created: admin@mfrh.xyz / changeme123')
  } else {
    console.log('Admin user already exists, skipping...')
  }

  // Seed CV data
  const cvPath = path.resolve('content/cv/index.json')
  if (fs.existsSync(cvPath)) {
    const cvData = JSON.parse(fs.readFileSync(cvPath, 'utf-8'))
    await payload.updateGlobal({
      slug: 'cv',
      data: {
        name: cvData.name,
        title: cvData.title,
        email: cvData.email,
        phone: cvData.phone,
        linkedin: cvData.linkedin,
        summary: cvData.summary,
        skillMaxDots: cvData.skillMaxDots,
        experience: cvData.experience,
        skills: cvData.skills,
        languages: cvData.languages,
        education: cvData.education,
        certificates: cvData.certificates,
      },
    })
    console.log('CV data seeded')
  }

  // Seed Cover Letter data
  const clPath = path.resolve('content/cover-letter/index.json')
  if (fs.existsSync(clPath)) {
    const clData = JSON.parse(fs.readFileSync(clPath, 'utf-8'))
    await payload.updateGlobal({
      slug: 'cover-letter',
      data: {
        recipientSalutation: clData.recipientSalutation,
        body: clData.body,
        closing: clData.closing,
        senderName: clData.senderName,
      },
    })
    console.log('Cover Letter data seeded')
  }

  console.log('Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
