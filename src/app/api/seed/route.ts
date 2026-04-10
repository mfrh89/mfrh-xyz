import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { execSync } from 'child_process'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (token !== 'init123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config: configPromise })
    
    // We explicitly tell Payload to force push the database schema
    // In case the DB is missing tables, this will fix it.
    // getPayload alone might not block/await the push fully before returning.
    // However since Payload doesn't expose a clean push() we fall back to creating docs
    
    // Check if pages exist, wait 2s to allow async push to settle if it was triggered
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const existingPages = await (payload as any).find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
    })

    let pageMsg = 'Home page already exists.'
    if (existingPages.totalDocs === 0) {
      await (payload as any).create({
        collection: 'pages',
        data: {
          title: 'Home',
          slug: 'home',
          layout: [
            {
              blockType: 'hero',
              headline: 'Willkommen',
              intro: 'Die modulare Startseite ist erfolgreich eingerichtet.',
            }
          ],
          _status: 'published'
        },
      })
      pageMsg = 'Home page created.'
    }

    const existingUsers = await (payload as any).find({ collection: 'users' })
    let userMsg = 'Admin user already exists.'
    if (existingUsers.totalDocs === 0) {
      await (payload as any).create({
        collection: 'users',
        data: {
          email: 'admin@mfrh.xyz',
          password: 'changeme123',
        },
      })
      userMsg = 'Admin user created (admin@mfrh.xyz / changeme123).'
    }

    return NextResponse.json({ success: true, message: `Database seeded successfully. ${pageMsg} ${userMsg}` })
  } catch (error: any) {
    console.error('[Seed Route Error]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
