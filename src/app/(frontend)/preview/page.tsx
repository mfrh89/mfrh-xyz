import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { LiveCV } from '@/components/live/LiveCV'
import { LiveCoverLetter } from '@/components/live/LiveCoverLetter'

type Props = {
  searchParams: Promise<{ global?: string; collection?: string; id?: string }>
}

async function requireAuth(payload: Awaited<ReturnType<typeof getPayload>>) {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    redirect('/admin/login')
  }

  try {
    const { user } = await payload.auth({
      headers: new Headers({ Authorization: `JWT ${token}` }),
    })
    if (!user) redirect('/admin/login')
  } catch {
    redirect('/admin/login')
  }
}

export default async function PreviewPage({ searchParams }: Props) {
  const { global: globalSlug, collection, id } = await searchParams
  const payload = await getPayload({ config: configPromise })

  await requireAuth(payload)

  const serverURL = process.env.SERVER_URL || 'http://localhost:3000'

  // Cover letter preview
  if (collection === 'cover-letters' && id) {
    const letter = await payload.findByID({
      collection: 'cover-letters',
      id: Number(id),
      draft: true,
    })
    if (!letter) notFound()

    const cv = await payload.findGlobal({ slug: 'cv', draft: true })

    return (
      <>
        <div className="bg-yellow-500 text-black text-center py-2 text-sm font-bold print-hidden">
          PREVIEW - Draft-Version
        </div>
        <LiveCoverLetter
          initialData={{
            recipientSalutation: letter.recipientSalutation || '',
            body: letter.body || '',
            closing: letter.closing || '',
            senderName: letter.senderName || '',
          }}
          cvData={{
            name: cv.name || '',
            title: cv.title || '',
            email: cv.email || '',
            phone: cv.phone || '',
            linkedin: cv.linkedin || '',
            profileImage: typeof cv.profileImage === 'object' && cv.profileImage ? { url: cv.profileImage.url ?? undefined } : null,
            logo: typeof cv.logo === 'object' && cv.logo ? { url: cv.logo.url ?? undefined } : null,
          }}
          serverURL={serverURL}
        />
      </>
    )
  }

  // Default: CV preview
  const cv = await payload.findGlobal({ slug: 'cv', draft: true })

  return (
    <>
      <div className="bg-yellow-500 text-black text-center py-2 text-sm font-bold print-hidden">
        PREVIEW - Draft-Version
      </div>
      <LiveCV
        initialData={{
          name: cv.name || '',
          title: cv.title || '',
          email: cv.email || '',
          phone: cv.phone || '',
          linkedin: cv.linkedin || '',
          profileImage: typeof cv.profileImage === 'object' && cv.profileImage ? { url: cv.profileImage.url ?? undefined } : null,
          logo: typeof cv.logo === 'object' && cv.logo ? { url: cv.logo.url ?? undefined } : null,
          summary: cv.summary || '',
          skillMaxDots: cv.skillMaxDots ?? 5,
          skills: (cv.skills || []).map((s: any) => ({ name: s.name || '', level: s.level ?? 0 })),
          languages: (cv.languages || []).map((l: any) => ({ name: l.name || '', level: l.level || '' })),
          education: (cv.education || []).map((e: any) => ({ institution: e.institution || '', degree: e.degree || '', startDate: e.startDate || '', endDate: e.endDate || '' })),
          certificates: (cv.certificates || []).map((c: any) => ({ name: c.name || '', issuer: c.issuer || '', date: c.date || '', status: c.status || '' })),
          experience: cv.experience || [],
        }}
        serverURL={serverURL}
      />
    </>
  )
}
